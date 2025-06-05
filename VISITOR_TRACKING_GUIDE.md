# Visitor Tracking Options for GitHub Pages

This document outlines several methods to track visitors on your GitHub Pages site without requiring a backend server.

## 🎯 Recommended Solutions

### 1. Google Analytics 4 (Professional)
**Pros:** Industry standard, detailed analytics, real-time data
**Cons:** Requires Google account, privacy concerns for some users

**Setup:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (starts with G-)
4. Replace `GA_MEASUREMENT_ID` in index.html with your actual ID

**Features:**
- Real-time visitor count
- Detailed demographics and behavior
- Mobile app for monitoring
- Custom events and conversions

### 2. GoatCounter (Privacy-Focused)
**Pros:** Open source, privacy-focused, simple setup
**Cons:** Limited features compared to GA

**Setup:**
1. Sign up at [goatcounter.com](https://www.goatcounter.com/)
2. Add this code before closing `</body>` tag:
```html
<script data-goatcounter="https://YOURSITE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

### 3. Simple Analytics
**Pros:** Privacy-friendly, GDPR compliant, clean interface
**Cons:** Paid service ($19/month)

## 🔧 Current Implementation

The current visitor counter uses a hybrid approach:

1. **Primary:** Tries to fetch from `visitor_count.txt` (GitHub Actions)
2. **Secondary:** Uses GitHub repository stats as proxy
3. **Fallback:** Local storage with realistic increments

## 📊 GitHub Actions Visitor Counter

The `.github/workflows/visitor-counter.yml` file implements an automated visitor counter:

- Runs hourly via cron job
- Uses GitHub Traffic API to get unique visitors
- Updates `visitor_count.txt` file
- Commits changes automatically

**Note:** GitHub Traffic API data is only available for repository owners.

## 🚀 Quick Start Guide

### For Google Analytics (Recommended):
1. Create GA4 property
2. Replace `GA_MEASUREMENT_ID` in index.html
3. Visitor data available in GA dashboard

### For GoatCounter:
1. Sign up for free account
2. Add tracking script to index.html
3. View stats at your GoatCounter dashboard

### For GitHub Actions Counter:
1. The workflow is already set up
2. Grant repository permissions if needed
3. Counter updates automatically

## 📈 Display Options

The current visitor counter displays at the bottom of the page. You can:

1. **Keep current position:** Shows "Visitors: X" in footer
2. **Add to hero section:** Show visitor count prominently
3. **Create analytics page:** Dedicated page with stats
4. **Add badge:** Use shields.io badges in README

## 🔒 Privacy Considerations

- **Google Analytics:** Collects detailed user data
- **GoatCounter:** Minimal data collection, no personal info
- **GitHub Actions:** Only counts unique repository views
- **Local Storage:** Only tracks per-browser visits

## 📝 Next Steps

1. Choose your preferred analytics solution
2. Update the tracking code if needed
3. Test the implementation
4. Monitor visitor data

For any questions or issues, refer to the respective service documentation or create an issue in this repository.
