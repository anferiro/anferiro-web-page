// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Track navigation click
                const sectionName = targetId.replace('#', '');
                trackNavigation(sectionName);
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll('.skill-card, .stat-item, .contact-item');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add active class to current navigation item and track scroll depth
    window.addEventListener('scroll', function() {
        // Track scroll depth for engagement metrics
        trackScrollDepth();
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });

    // Typing effect for hero name (optional)
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.textContent = '';
        heroName.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroName.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroName.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Track article clicks
    const articleLinks = document.querySelectorAll('.article-link');
    articleLinks.forEach(link => {
        link.addEventListener('click', function() {
            const articleTitle = this.closest('.article-card').querySelector('.article-title').textContent;
            const articleUrl = this.href;
            trackArticleClick(articleTitle, articleUrl);
        });
    });

    // Track contact clicks
    const contactLinks = document.querySelectorAll('.contact-item');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const contactType = this.querySelector('span').textContent;
            trackContactClick(contactType);
        });
    });

    // Track button clicks in hero section
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            trackEvent('hero_button_click', {
                button_text: buttonText,
                event_category: 'CTA',
                event_label: buttonText
            });
        });
    });

    // Initialize visitor counter
    initializeVisitorCounter();
});

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #6366f1 !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Google Analytics Event Tracking
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Track navigation clicks
function trackNavigation(section) {
    trackEvent('navigation_click', {
        section_name: section,
        event_category: 'Navigation',
        event_label: section
    });
}

// Track article interactions
function trackArticleClick(articleTitle, articleUrl) {
    trackEvent('article_click', {
        article_title: articleTitle,
        article_url: articleUrl,
        event_category: 'Content',
        event_label: articleTitle
    });
}

// Track contact interactions
function trackContactClick(contactType) {
    trackEvent('contact_click', {
        contact_type: contactType,
        event_category: 'Contact',
        event_label: contactType
    });
}

// Track scroll depth
let maxScroll = 0;
function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackEvent('scroll_depth', {
            scroll_percent: scrollPercent,
            event_category: 'Engagement',
            event_label: `${scrollPercent}%`
        });
    }
}

window.addEventListener('scroll', trackScrollDepth);

// Visitor Counter Implementation
function initializeVisitorCounter() {
    const counterElement = document.getElementById('visitor-count');
    if (!counterElement) return;

    // Get or initialize visitor count
    let visitorCount = localStorage.getItem('visitorCount');
    let lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();

    if (!visitorCount) {
        // First time visitor - start from file count or default
        visitorCount = getInitialCount();
    } else {
        visitorCount = parseInt(visitorCount);
    }

    // Check if it's a new day
    if (lastVisit !== today) {
        visitorCount++;
        localStorage.setItem('lastVisit', today);
        localStorage.setItem('visitorCount', visitorCount.toString());
        
        // Track new visitor in Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'unique_visitor', {
                event_category: 'Engagement',
                event_label: 'Daily Unique Visit'
            });
        }
    }

    // Animate counter
    animateCounter(counterElement, visitorCount);
}

function getInitialCount() {
    // Try to get count from visitor_count.txt file or use a default
    try {
        // This would work if we could fetch the file, but for GitHub Pages we'll use a base number
        return 247; // Starting from the number in visitor_count.txt
    } catch (error) {
        return 247; // Fallback number
    }
}

function animateCounter(element, targetCount) {
    element.classList.add('updating');
    
    // Show loading state briefly
    setTimeout(() => {
        let currentCount = 0;
        const increment = Math.ceil(targetCount / 50); // Animate over ~50 steps
        
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                currentCount = targetCount;
                clearInterval(timer);
                element.classList.remove('updating');
            }
            element.textContent = currentCount.toLocaleString();
        }, 20); // Update every 20ms for smooth animation
    }, 300);
}

// Track visitor count in Google Analytics (when GA is configured)
function trackVisitorMilestone(count) {
    if (typeof gtag !== 'undefined') {
        // Track milestones
        if (count % 100 === 0) {
            gtag('event', 'visitor_milestone', {
                event_category: 'Engagement',
                event_label: `${count} visitors`,
                value: count
            });
        }
    }
}
