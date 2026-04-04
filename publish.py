#!/usr/bin/env python3
"""
publish.py — Obsidian Markdown → anferiro.me article HTML

Usage:
    python publish.py <markdown-file> [options]

Options:
    --slug SLUG       URL slug (e.g., adopting-generative-ai)
    --title TITLE     Article title
    --date DATE       Date (YYYY-MM-DD)
    --category CAT    Artificial Intelligence | Architecture | Leadership | Engineering
    --excerpt TEXT    Short description (shown in header + SEO)
    --image FILE      Image filename in img/articles/ (e.g., article.2026.04.04.png)
    --lang LANG       Language: en (default) | es
    --alt-url URL     Filename of alternate language version (e.g., articulo-es.html)
    --medium URL      Medium article URL
    --substack URL    Substack article URL
    --no-index        Skip updating index.html

Frontmatter (optional, in the .md file):
    ---
    title: My Article
    slug: my-article
    date: 2026-04-04
    category: Artificial Intelligence
    excerpt: Short description here.
    image: article.2026.04.04.png
    lang: en
    alt_url: mi-articulo-es.html
    medium: https://...
    substack: https://...
    ---
"""

import argparse
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
SITE_ROOT = Path(__file__).parent.resolve()
ARTICLES_DIR = SITE_ROOT / "articles"
IMG_DIR = SITE_ROOT / "img" / "articles"

# ── Callout types ─────────────────────────────────────────────────────────────
CALLOUT_MAP = {
    "IMPORTANT": ("callout-important", "⚠️ Important"),
    "WARNING":   ("callout-important", "⚠️ Warning"),
    "CAUTION":   ("callout-important", "⚠️ Caution"),
    "DANGER":    ("callout-important", "🚨 Danger"),
    "INFO":      ("callout-info", "💡 Info"),
    "INFORMATION":("callout-info", "💡 Info"),
    "NOTE":      ("callout-info", "📝 Note"),
    "TIP":       ("callout-info", "💡 Tip"),
    "PRINCIPLE": ("callout-info", "💡 Principle"),
    "QUOTE":     ("callout-info", "💬 Quote"),
    "SUMMARY":   ("callout-info", "📋 Summary"),
}

CATEGORY_ALIASES = {
    "ai":                     "Artificial Intelligence",
    "artificial intelligence":"Artificial Intelligence",
    "architecture":           "Architecture",
    "leadership":             "Leadership",
    "engineering":            "Engineering",
}

MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
]

SHORT_MONTHS = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
]

# ── Date helpers ──────────────────────────────────────────────────────────────

def parse_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d")
    except Exception:
        return None

def long_date(s):
    d = parse_date(s)
    if d:
        return f"{MONTHS[d.month-1]} {d.day}, {d.year}"
    return s

def short_date(s):
    d = parse_date(s)
    if d:
        return f"{SHORT_MONTHS[d.month-1]} {d.day}, {d.year}"
    return s

# ── Frontmatter parser ────────────────────────────────────────────────────────

def parse_frontmatter(content):
    meta = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].strip().split("\n"):
                if ":" in line:
                    k, _, v = line.partition(":")
                    meta[k.strip().lower().replace("-", "_")] = v.strip().strip("\"'")
            body = parts[2].strip()
    return meta, body

def strip_h1(content):
    """Remove leading # Title line, return (title, rest)."""
    lines = content.split("\n")
    if lines and lines[0].startswith("# "):
        return lines[0][2:].strip(), "\n".join(lines[1:]).lstrip("\n")
    return None, content

# ── Image handling ────────────────────────────────────────────────────────────

def copy_obsidian_images(md_path, content):
    """Copy ![[...]] images from the markdown's folder to img/articles/."""
    md_dir = Path(md_path).parent
    for name in re.findall(r'!\[\[([^\]]+)\]\]', content):
        src = md_dir / name
        if src.exists():
            dest = IMG_DIR / name
            if not dest.exists():
                shutil.copy2(src, dest)
                print(f"  📋 Copied: {name}")
        else:
            print(f"  ⚠️  Not found (you may need to copy manually): {name}")

# ── Inline markdown → HTML ────────────────────────────────────────────────────

def inline_md(text):
    # Bold (**text** or __text__)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.+?)__',     r'<strong>\1</strong>', text)
    # Italic (*text* or _text_) — avoid matching ** boundaries
    text = re.sub(r'(?<!\*)\*([^\*\n]+?)\*(?!\*)', r'<em>\1</em>', text)
    text = re.sub(r'(?<!_)_([^_\n]+?)_(?!_)',       r'<em>\1</em>', text)
    # Inline code
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    # Links [text](url)
    text = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2" target="_blank">\1</a>', text)
    # Strip leftover Obsidian embeds from inline text
    text = re.sub(r'!\[\[[^\]]+\]\]', '', text)
    return text

# ── Block markdown → HTML ─────────────────────────────────────────────────────

_BLOCK_STARTERS = re.compile(
    r'^(#{1,6}\s|'          # headings
    r'[\-\*]\s|'            # unordered list
    r'\d+\.\s|'             # ordered list
    r'>|'                   # blockquote / callout
    r'```|'                 # fenced code
    r'!\[\[|'              # obsidian embed
    r'!\[|'                 # standard image
    r'[-*_]{3,}$'           # horizontal rule
    r')'
)

def is_block_start(line):
    return bool(_BLOCK_STARTERS.match(line.strip())) if line.strip() else False

def md_to_html(content, img_prefix="../img/articles/"):
    lines = content.split("\n")
    parts = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # ── Fenced code block ─────────────────────────────────────────────────
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            code = "\n".join(code_lines)
            code = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            parts.append(f'<pre><code>{code}</code></pre>')
            i += 1
            continue

        # ── Obsidian callout: >[!TYPE] ────────────────────────────────────────
        callout_m = re.match(r'^>\s*\[!(\w+)\]\s*(.*)?$', stripped)
        if callout_m:
            ctype = callout_m.group(1).upper()
            first = (callout_m.group(2) or "").strip()
            css_cls, label = CALLOUT_MAP.get(ctype, ("callout-info", f"📌 {ctype.title()}"))
            body_lines = [first] if first else []
            i += 1
            while i < n and lines[i].startswith(">"):
                tail = lines[i][1:].strip()
                if tail:
                    body_lines.append(tail)
                i += 1
            body = inline_md(" ".join(body_lines))
            parts.append(
                f'<div class="callout {css_cls}">'
                f'<div class="callout-label">{label}</div>'
                f'{body}'
                f'</div>'
            )
            continue

        # ── Regular blockquote ────────────────────────────────────────────────
        if stripped.startswith("> ") or stripped == ">":
            q_lines = []
            while i < n and (lines[i].strip().startswith("> ") or lines[i].strip() == ">"):
                q_lines.append(lines[i].strip()[2:] if lines[i].strip().startswith("> ") else "")
                i += 1
            parts.append(f'<blockquote>{inline_md(" ".join(q_lines).strip())}</blockquote>')
            continue

        # ── Obsidian image embed: ![[filename]] ───────────────────────────────
        embed_m = re.match(r'^!\[\[([^\]]+)\]\]$', stripped)
        if embed_m:
            fname = embed_m.group(1)
            alt = Path(fname).stem.replace("-", " ").replace("_", " ")
            parts.append(
                f'<img src="{img_prefix}{fname}" alt="{alt}" '
                f'style="width:100%;border-radius:8px;margin:1rem 0 1.5rem;'
                f'box-shadow:0 4px 20px rgba(0,0,0,0.1);">'
            )
            i += 1
            continue

        # ── Standard image: ![alt](src) ───────────────────────────────────────
        std_img_m = re.match(r'^!\[([^\]]*)\]\(([^\)]+)\)$', stripped)
        if std_img_m:
            alt, src = std_img_m.group(1), std_img_m.group(2)
            parts.append(
                f'<img src="{src}" alt="{alt}" '
                f'style="width:100%;border-radius:8px;margin:1rem 0 1.5rem;'
                f'box-shadow:0 4px 20px rgba(0,0,0,0.1);">'
            )
            i += 1
            continue

        # ── Headings ──────────────────────────────────────────────────────────
        heading_m = re.match(r'^(#{1,6})\s+(.+)$', stripped)
        if heading_m:
            level = len(heading_m.group(1))
            text = inline_md(heading_m.group(2).strip())
            parts.append(f'<h{level}>{text}</h{level}>')
            i += 1
            continue

        # ── Horizontal rule ───────────────────────────────────────────────────
        if re.match(r'^[-*_]{3,}$', stripped):
            parts.append('<hr>')
            i += 1
            continue

        # ── Unordered list ────────────────────────────────────────────────────
        if re.match(r'^[\-\*]\s+', stripped):
            items = []
            while i < n and re.match(r'^[\-\*]\s+', lines[i].strip()):
                item = re.sub(r'^[\-\*]\s+', '', lines[i].strip())
                items.append(f'<li>{inline_md(item)}</li>')
                i += 1
            parts.append('<ul>\n' + '\n'.join(items) + '\n</ul>')
            continue

        # ── Ordered list ──────────────────────────────────────────────────────
        if re.match(r'^\d+\.\s+', stripped):
            items = []
            while i < n and re.match(r'^\d+\.\s+', lines[i].strip()):
                item = re.sub(r'^\d+\.\s+', '', lines[i].strip())
                items.append(f'<li>{inline_md(item)}</li>')
                i += 1
            parts.append('<ol>\n' + '\n'.join(items) + '\n</ol>')
            continue

        # ── Empty line ────────────────────────────────────────────────────────
        if not stripped:
            i += 1
            continue

        # ── Paragraph (collect consecutive non-special lines) ─────────────────
        para = []
        while i < n and lines[i].strip() and not is_block_start(lines[i]):
            para.append(lines[i].strip())
            i += 1
        if para:
            parts.append(f'<p>{inline_md(" ".join(para))}</p>')
            continue

        # Fallback: skip unknown line
        i += 1

    return "\n\n".join(p for p in parts if p.strip())

# ── HTML template ─────────────────────────────────────────────────────────────

def build_html(args, body_html):
    lang = args.lang
    site_url = f"https://anferiro.me/articles/{args.slug}.html"
    og_image = f"https://anferiro.me/img/articles/{args.image}" if args.image else ""
    display_date = long_date(args.date)

    # Language switcher
    if args.alt_url:
        alt_label = "Leer en Español" if lang == "en" else "Read in English"
        lang_switcher = f'<a href="{args.alt_url}" class="lang-switcher"><i class="fas fa-globe"></i> {alt_label}</a>'
        lang_js = f'fresh.addEventListener("click", function() {{ window.location.href = "{args.alt_url}"; }});'
    else:
        lang_switcher = ""
        lang_js = "// No alternate version"

    nav_btn_text = "ES" if lang == "en" else "EN"

    # Featured image
    featured_img = (
        f'<img src="../img/articles/{args.image}" alt="{args.title}" class="article-featured-image">'
        if args.image else ""
    )

    # Sharing links
    tweet = args.title.replace(" ", "+")
    sharing = []
    if args.substack:
        sharing.append(f'<a href="{args.substack}" target="_blank" style="background:#FF6719;"><i class="fas fa-newspaper"></i> Substack</a>')
    if args.medium:
        sharing.append(f'<a href="{args.medium}" target="_blank" style="background:#222;"><i class="fab fa-medium"></i> Medium</a>')
    sharing += [
        f'<a href="https://twitter.com/intent/tweet?text={tweet}&url={site_url}&via=anferiro" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>',
        f'<a href="https://www.linkedin.com/sharing/share-offsite/?url={site_url}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>',
        f'<a href="mailto:?subject={args.title}&body={site_url}" target="_blank"><i class="fas fa-envelope"></i> Email</a>',
    ]
    sharing_html = "\n                        ".join(sharing)

    # Indent body
    indented_body = "\n".join("                " + l if l.strip() else l for l in body_html.split("\n"))

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{args.title} | Andres Rincon</title>
    <meta name="description" content="{args.excerpt}">
    <meta name="author" content="Andres Rincon">

    <!-- Open Graph -->
    <meta property="og:title" content="{args.title}">
    <meta property="og:description" content="{args.excerpt}">
    <meta property="og:image" content="{og_image}">
    <meta property="og:url" content="{site_url}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Andres Rincon">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{args.title}">
    <meta name="twitter:description" content="{args.excerpt}">
    <meta name="twitter:image" content="{og_image}">
    <meta name="twitter:creator" content="@anferiro">

    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="../img/avatar.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/styles.css">

    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NNSEEY27SZ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', 'G-NNSEEY27SZ');
    </script>
    <script data-goatcounter="https://anferiro.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>

    <style>
        .article-content {{ max-width:100%; margin:0; padding:0; line-height:1.8; font-size:1.1rem; }}
        .article-header {{
            display:block !important; text-align:center;
            background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);
            padding:4rem 2rem 3rem; border-bottom:1px solid #e5e5e5;
        }}
        .article-title {{
            font-family:'Montserrat',sans-serif; font-size:clamp(2rem,5vw,3rem) !important;
            font-weight:700; color:#1a1a2e; margin-bottom:1rem; line-height:1.15;
            max-width:800px; margin-left:auto; margin-right:auto;
            letter-spacing:normal !important; transition:none !important;
        }}
        .article-meta {{
            display:flex; justify-content:center; align-items:center;
            gap:1.5rem; margin-bottom:1.5rem; flex-wrap:wrap;
        }}
        .article-date {{ color:#666; font-size:0.9rem; }}
        .article-category {{
            background:#1a1a2e; color:#fff; padding:0.3rem 1rem;
            border-radius:20px; font-size:0.75rem; font-weight:600;
            text-transform:uppercase; letter-spacing:0.8px;
        }}
        .article-description {{
            font-size:1.2rem; color:#555; margin-top:1rem;
            max-width:640px; margin-left:auto; margin-right:auto; line-height:1.6;
        }}
        .article-featured-image {{
            display:block; width:100%; max-width:860px; height:auto;
            border-radius:12px; margin:2.5rem auto 0;
            box-shadow:0 8px 32px rgba(0,0,0,0.14);
        }}
        .article-body {{ max-width:900px; margin:0 auto; padding:3rem 2.5rem; }}
        .article-body h2 {{
            font-family:'Montserrat',sans-serif; font-size:1.8rem; font-weight:700;
            color:#1a1a2e; margin:3rem 0 1.2rem; padding-bottom:0.5rem;
            border-bottom:2px solid #e5e5e5;
        }}
        .article-body h3 {{
            font-family:'Montserrat',sans-serif; font-size:1.3rem; font-weight:600;
            color:#333; margin:2rem 0 0.8rem;
        }}
        .article-body h4 {{
            font-family:'Montserrat',sans-serif; font-size:1.05rem; font-weight:600;
            color:#555; margin:1.5rem 0 0.6rem;
        }}
        .article-body h5 {{
            font-family:'Montserrat',sans-serif; font-size:0.95rem; font-weight:600;
            color:#666; margin:1.2rem 0 0.5rem;
        }}
        .article-body p {{ margin-bottom:1.4rem; color:#444; }}
        .article-body blockquote {{
            background:#f8f9fa; border-left:4px solid #1a1a2e;
            padding:1.2rem 1.5rem; margin:2rem 0; font-style:italic;
            font-size:1.1rem; border-radius:0 8px 8px 0; color:#333;
        }}
        .article-body ol, .article-body ul {{ margin-bottom:1.4rem; padding-left:2rem; }}
        .article-body li {{ margin-bottom:0.7rem; color:#444; }}
        .article-body strong {{ color:#1a1a2e; font-weight:700; }}
        .article-body em {{ color:#666; }}
        .article-body code {{
            background:#f1f1f1; padding:0.15rem 0.4rem;
            border-radius:4px; font-family:'Courier New',monospace; font-size:0.88em;
        }}
        .article-body pre {{
            background:#1a1a2e; color:#e2e8f0; padding:1.5rem;
            border-radius:8px; overflow-x:auto;
            font-family:'Courier New',monospace; font-size:0.88rem;
            margin:1.5rem -2rem; line-height:1.6;
        }}
        .article-body pre code {{ background:none; padding:0; color:inherit; font-size:inherit; }}
        .article-body a {{ color:#4a5568; font-weight:600; }}
        .article-body hr {{ border:none; border-top:1px solid #e5e5e5; margin:2rem 0; }}
        .callout {{ border-radius:8px; padding:1.2rem 1.5rem; margin:1.5rem 0; font-size:1rem; }}
        .callout-important {{ background:#fff3cd; border-left:4px solid #ffc107; }}
        .callout-info {{ background:#e8f4fd; border-left:4px solid #0d6efd; font-style:italic; }}
        .callout-label {{
            font-weight:700; text-transform:uppercase;
            font-size:0.8rem; letter-spacing:0.5px; margin-bottom:0.5rem;
        }}
        .lang-switcher {{
            display:inline-flex; align-items:center; gap:0.5rem;
            background:#333; color:white; padding:0.5rem 1.2rem;
            border-radius:6px; text-decoration:none; font-size:0.9rem;
            font-weight:500; transition:background 0.3s; float:right;
        }}
        .lang-switcher:hover {{ background:#000; color:white; }}
        .back-to-home {{
            display:inline-flex; align-items:center; gap:0.5rem;
            color:#333; text-decoration:none; font-weight:600;
            transition:all 0.3s ease;
        }}
        .back-to-home:hover {{ color:#000; transform:translateX(-5px); }}
        .sharing-section {{
            max-width:900px; margin:3rem auto 2rem; padding:2rem;
            background:#f8f9fa; border-radius:12px; text-align:center;
        }}
        .sharing-section h3 {{ margin-bottom:1rem; color:#333; }}
        .sharing-links {{ display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; }}
        .sharing-links a {{
            display:inline-flex; align-items:center; gap:0.5rem;
            padding:0.8rem 1.5rem; background:#333; color:white;
            text-decoration:none; border-radius:6px; font-weight:500;
            transition:all 0.3s ease;
        }}
        .sharing-links a:hover {{ background:#000; transform:translateY(-2px); }}
        .donation-section {{
            max-width:900px; margin:3rem auto; padding:2.5rem;
            background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);
            border-radius:12px; text-align:center; border:1px solid #dee2e6;
        }}
        .donation-section h3 {{
            font-family:'Montserrat',sans-serif; font-size:1.4rem;
            color:#333; margin-bottom:0.8rem;
        }}
        .donation-section p {{ color:#666; margin-bottom:1.5rem; }}
        .nav-logo a {{ color:inherit; text-decoration:none; }}
        /* TOC Sidebar */
        .toc-sidebar {{
            position:fixed; left:1.25rem; top:50%; transform:translateY(-50%);
            z-index:200; display:flex; flex-direction:column;
            align-items:flex-start; gap:0.4rem;
        }}
        .toc-toggle {{
            background:#1a1a2e; color:white; border:none; width:34px; height:34px;
            border-radius:8px; cursor:pointer; font-size:1rem; display:flex;
            align-items:center; justify-content:center;
            box-shadow:0 2px 10px rgba(0,0,0,0.2); transition:background 0.2s; flex-shrink:0;
        }}
        .toc-toggle:hover {{ background:#2d2d50; }}
        .toc-panel {{
            background:white; border:1px solid #e5e5e5; border-radius:10px;
            padding:0.75rem 0.9rem; width:195px; max-height:65vh; overflow-y:auto;
            box-shadow:0 4px 24px rgba(0,0,0,0.1); transition:opacity 0.2s,transform 0.2s;
        }}
        .toc-panel.toc-hidden {{ opacity:0; pointer-events:none; transform:translateX(-8px); }}
        .toc-panel p.toc-heading {{
            font-family:'Montserrat',sans-serif; font-size:0.65rem; font-weight:700;
            text-transform:uppercase; letter-spacing:1px; color:#aaa; margin:0 0 0.5rem;
        }}
        .toc-panel ul {{ list-style:none; padding:0; margin:0; }}
        .toc-panel li {{ margin-bottom:0.1rem; }}
        .toc-panel a {{
            display:block; color:#666; text-decoration:none; font-size:0.78rem;
            line-height:1.4; padding:0.25rem 0.5rem;
            border-left:2px solid transparent; border-radius:0 4px 4px 0; transition:all 0.2s;
        }}
        .toc-panel a:hover {{ color:#1a1a2e; background:#f5f5fa; }}
        .toc-panel a.toc-active {{
            color:#1a1a2e; border-left-color:#1a1a2e;
            background:#f0f0f8; font-weight:600;
        }}
        .toc-panel li.toc-h3 a {{ padding-left:1.1rem; font-size:0.72rem; color:#888; }}
        .toc-panel li.toc-h3 a.toc-active {{ color:#1a1a2e; }}
        @media (max-width:1200px) {{ .toc-sidebar {{ display:none; }} }}
        @media (max-width:768px) {{
            .article-title {{ font-size:2rem; }}
            .article-meta {{ flex-direction:column; gap:1rem; }}
            .sharing-links {{ flex-direction:column; align-items:center; }}
            .lang-switcher {{ float:none; display:flex; }}
        }}
    </style>
</head>

<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo"><a href="../index.html">anferiro</a></div>
            <div class="nav-toggle" id="nav-toggle">
                <span></span><span></span><span></span>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="../index.html#bio" class="nav-link">About</a>
                <a href="../index.html#articles" class="nav-link">Articles</a>
                <a href="../index.html#contact" class="nav-link">Contact</a>
                <button id="language-toggle" class="language-toggle">{nav_btn_text}</button>
            </div>
        </div>
    </nav>

    <main style="margin-top:80px;">
        <div style="max-width:900px;margin:0 auto;padding:1.5rem 2rem 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <a href="../index.html#articles" class="back-to-home">
                <i class="fas fa-arrow-left"></i>
                <span>Back to Articles</span>
            </a>
            {lang_switcher}
        </div>

        <article class="article-content">
            <header class="article-header">
                <div class="article-meta">
                    <span class="article-category">{args.category}</span>
                    <span class="article-date">{display_date}</span>
                </div>
                <h1 class="article-title">{args.title}</h1>
                <p class="article-description">{args.excerpt}</p>
            </header>

            {featured_img}

            <div class="article-body">
{indented_body}
            </div>

            <div class="donation-section">
                <h3>Did this article add value?</h3>
                <p>If this content was useful, consider showing your appreciation. Every bit of support helps dedicate more time to researching, writing, and sharing.</p>
                <a href="https://checkout.wompi.co/l/VPOS_4Ynhit" target="_blank" class="btn btn-primary" style="display:inline-block;text-decoration:none;">Gracias ❤️</a>
            </div>

            <div class="sharing-section">
                <h3>Share this article</h3>
                <div class="sharing-links">
                        {sharing_html}
                </div>
            </div>

        </article>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Andres Rincon</h4>
                    <p>Engineering Manager &amp; Solution Architect</p>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <div class="footer-links">
                        <a href="https://linkedin.com/in/anferiro" target="_blank"><i class="fab fa-linkedin"></i></a>
                        <a href="https://twitter.com/anferiro" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://medium.com/@anferiro" target="_blank"><i class="fab fa-medium"></i></a>
                        <a href="https://github.com/anferiro" target="_blank"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Andres Rincon. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../js/translations.js"></script>
    <script src="../js/script.js"></script>
    <script>
    /* Table of Contents */
    (function () {{
        var headings = Array.from(document.querySelectorAll('.article-body h2, .article-body h3'));
        if (!headings.length) return;
        var usedIds = {{}};
        headings.forEach(function (h, i) {{
            if (!h.id) {{
                var base = h.textContent.trim()
                    .toLowerCase().replace(/[^a-z0-9\\s]/g,'').trim()
                    .replace(/\\s+/g,'-').substring(0,45);
                var id = base;
                if (usedIds[id]) {{ id = base+'-'+i; }}
                usedIds[id] = true;
                h.id = id;
            }}
        }});
        var sidebar = document.createElement('aside');
        sidebar.className = 'toc-sidebar';
        var btn = document.createElement('button');
        btn.className = 'toc-toggle';
        btn.innerHTML = '&#9776;';
        btn.setAttribute('aria-label','Toggle table of contents');
        sidebar.appendChild(btn);
        var panel = document.createElement('div');
        panel.className = 'toc-panel';
        var lbl = document.createElement('p');
        lbl.className = 'toc-heading';
        lbl.textContent = 'Contents';
        panel.appendChild(lbl);
        var ul = document.createElement('ul');
        headings.forEach(function (h) {{
            var li = document.createElement('li');
            li.className = h.tagName==='H3' ? 'toc-h3' : 'toc-h2';
            var a = document.createElement('a');
            a.href = '#'+h.id;
            a.textContent = h.textContent;
            a.addEventListener('click', function(e) {{
                e.preventDefault();
                window.scrollTo({{top: h.getBoundingClientRect().top+window.scrollY-90, behavior:'smooth'}});
            }});
            li.appendChild(a);
            ul.appendChild(li);
        }});
        panel.appendChild(ul);
        sidebar.appendChild(panel);
        document.body.appendChild(sidebar);
        var isOpen = true;
        function applyState() {{
            panel.classList.toggle('toc-hidden',!isOpen);
            btn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
            btn.setAttribute('aria-expanded',isOpen);
        }}
        applyState();
        btn.addEventListener('click', function() {{ isOpen=!isOpen; applyState(); }});
        var links = Array.from(panel.querySelectorAll('a'));
        window.addEventListener('scroll', function() {{
            var cur='';
            headings.forEach(function(h) {{ if(window.scrollY>=h.offsetTop-110) cur=h.id; }});
            links.forEach(function(a) {{ a.classList.toggle('toc-active',a.getAttribute('href')==='#'+cur); }});
        }}, {{passive:true}});
    }})();
    </script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {{
        var btn = document.getElementById('language-toggle');
        if (btn) {{
            var fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);
            {lang_js}
        }}
    }});
    </script>
</body>
</html>"""

# ── index.html updater ────────────────────────────────────────────────────────

def update_index(index_path, args):
    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    href = f'href="articles/{args.slug}.html"'
    if href in content:
        print("  ℹ️  Already in index.html, skipping.")
        return

    d = short_date(args.date)

    if args.image:
        thumb = (
            f'          <div class="card-thumb">\n'
            f'            <img src="img/articles/{args.image}" alt="{args.title}" class="card-thumb-img">\n'
            f'            <span class="card-thumb-cat">{args.category}</span>\n'
            f'          </div>'
        )
    else:
        thumb = (
            f'          <div class="card-thumb card-thumb--gradient" style="background:linear-gradient(135deg,#1a1a2e,#4a5568)">\n'
            f'            <i class="fas fa-file-alt card-thumb-icon"></i>\n'
            f'            <span class="card-thumb-cat">{args.category}</span>\n'
            f'          </div>'
        )

    card = f"""
        <article class="article-card" data-category="{args.category}">
{thumb}
          <div class="card-body">
            <span class="card-date">{d}</span>
            <h3 class="article-title">{args.title}</h3>
            <p class="article-excerpt">{args.excerpt}</p>
            <div class="article-links">
              <a href="articles/{args.slug}.html" class="article-link" target="_blank">Read Full Article</a>
            </div>
          </div>
        </article>
"""

    marker = '<div class="articles-grid">'
    if marker not in content:
        print("  ⚠️  articles-grid not found in index.html")
        return

    new_content = content.replace(marker, marker + card, 1)
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("  ✅ index.html updated")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(
        description="Publish an Obsidian .md article to anferiro.me",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("md_file",     help="Path to Obsidian markdown file")
    p.add_argument("--slug",      help="URL slug")
    p.add_argument("--title",     help="Article title")
    p.add_argument("--date",      help="Date YYYY-MM-DD (default: today)")
    p.add_argument("--category",  help="Article category")
    p.add_argument("--excerpt",   help="Short description")
    p.add_argument("--image",     help="Hero image filename in img/articles/")
    p.add_argument("--lang",      default="en", choices=["en","es"])
    p.add_argument("--alt-url",   dest="alt_url", help="Alternate language HTML filename")
    p.add_argument("--medium",    help="Medium URL")
    p.add_argument("--substack",  help="Substack URL")
    p.add_argument("--no-index",  action="store_true", help="Skip index.html update")
    args = p.parse_args()

    md_path = Path(args.md_file).expanduser().resolve()
    if not md_path.exists():
        print(f"❌ File not found: {md_path}")
        sys.exit(1)

    print(f"\n📄 {md_path.name}")

    # Read + parse
    raw = md_path.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(raw)
    md_title, body = strip_h1(body)

    # Merge: CLI > frontmatter > derived
    def get(attr, fm_key=None):
        val = getattr(args, attr.replace("-","_"), None)
        if val: return val
        return fm.get(fm_key or attr.replace("-","_"), "")

    args.title    = get("title")    or md_title or md_path.stem
    args.slug     = get("slug")     or re.sub(r'[^a-z0-9]+', '-', args.title.lower()).strip('-')
    args.date     = get("date")     or datetime.today().strftime("%Y-%m-%d")
    args.category = (CATEGORY_ALIASES.get(get("category").lower()) or get("category") or "Artificial Intelligence")
    args.excerpt  = get("excerpt")  or fm.get("description","")
    args.image    = get("image")    or ""
    args.alt_url  = get("alt_url", "alt_url") or fm.get("alt-url","")
    args.medium   = get("medium")   or ""
    args.substack = get("substack") or ""

    # Warnings for missing fields
    if not args.excerpt:
        print("  ⚠️  --excerpt not set. Add it as CLI arg or frontmatter.")
    if not args.image:
        print("  ⚠️  --image not set. Hero image will be missing.")

    # Copy images from Obsidian folder → img/articles/
    print("\n🖼️  Images:")
    copy_obsidian_images(md_path, body)

    # Remove the first ![[...]] (usually the draft hero image — replaced by --image)
    body = re.sub(r'^\s*!\[\[[^\]]+\]\]\s*\n', '', body, count=1)

    # Convert
    print("\n🔄 Converting markdown...")
    body_html = md_to_html(body)

    # Generate HTML
    html = build_html(args, body_html)

    # Write
    out = ARTICLES_DIR / f"{args.slug}.html"
    out.write_text(html, encoding="utf-8")
    print(f"\n✅ Article: {out.relative_to(SITE_ROOT)}")

    # Update index.html
    if not args.no_index:
        index = SITE_ROOT / "index.html"
        if index.exists():
            print("\n📝 Updating index.html...")
            update_index(index, args)

    print(f"""
🎉 Done!

Next steps:
  1. Review → open articles/{args.slug}.html in browser
  2. Add hero image → img/articles/{args.image or '<your-image.png>'}
  3. git add articles/{args.slug}.html index.html img/articles/
  4. git commit -m "Add article: {args.title}"
  5. git push
""")

if __name__ == "__main__":
    main()
