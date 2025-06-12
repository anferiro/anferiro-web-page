// Dynamic section loader
class SectionLoader {
    constructor() {
        this.sections = {
            'navigation': 'navigation.html',
            'hero': 'hero.html',
            'bio': 'bio.html',
            'articles': 'articles.html',
            'quotes': 'quotes.html',
            'spiritual': 'spiritual.html',
            'contact': 'contact.html',
            'footer': 'footer.html'
        };
        this.loadedSections = new Set();
    }

    async loadSection(sectionName) {
        if (this.loadedSections.has(sectionName)) {
            return; // Already loaded
        }

        try {
            const response = await fetch(this.sections[sectionName]);
            if (!response.ok) {
                throw new Error(`Failed to load ${sectionName}: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Create a container for the section if it doesn't exist
            let container = document.getElementById(`${sectionName}-container`);
            if (!container) {
                container = document.createElement('div');
                container.id = `${sectionName}-container`;
                document.body.appendChild(container);
            }
            
            container.innerHTML = html;
            this.loadedSections.add(sectionName);
            
            // Trigger any section-specific initialization
            this.initializeSection(sectionName);
            
            // Update translations for newly loaded content
            if (typeof i18n !== 'undefined') {
                i18n.updatePage();
            }
            
        } catch (error) {
            console.error(`Error loading section ${sectionName}:`, error);
        }
    }

    async loadAllSections() {
        // Load sections in order
        const sectionOrder = ['navigation', 'hero', 'bio', 'articles', 'quotes', 'spiritual', 'contact', 'footer'];
        
        for (const section of sectionOrder) {
            await this.loadSection(section);
        }
    }

    initializeSection(sectionName) {
        // Section-specific initialization logic
        switch (sectionName) {
            case 'navigation':
                this.initializeNavigation();
                break;
            case 'footer':
                this.initializeVisitorCounter();
                break;
        }
    }

    initializeNavigation() {
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
    }

    initializeVisitorCounter() {
        // Initialize visitor counter from original script.js
        if (typeof updateVisitorCount === 'function') {
            updateVisitorCount();
        }
    }
}

// Initialize section loader when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    const loader = new SectionLoader();
    await loader.loadAllSections();
});

// Helper function for tracking navigation (if analytics is available)
function trackNavigation(sectionName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'navigation_click', {
            event_category: 'Navigation',
            event_label: sectionName,
            value: 1
        });
    }
}
