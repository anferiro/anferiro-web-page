// Translations for the website
const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      bio: "Bio",
      articles: "Articles",
      quotes: "Quotes",
      spiritual: "Spiritual",
      contact: "Contact"
    },
    
    // Hero Section
    hero: {
      motto: "Be a better version of myself everyday",
      name: "Andres Rincon",
      subtitle: "Developer • Architect • Leader • Manager",
      description: "Passionate technologist leading fintech innovation with 20+ years' experience. Committed to transforming the world responsibly through AI.",
      readArticles: "Read Articles",
      getInTouch: "Get In Touch"
    },
    
    // Bio Section
    bio: {
      title: "About Me",
      subtitle: "My journey, philosophy, and expertise",
      introTitle: "Passionate Technologist & Innovation Leader",
      introDescription: "With over 20 years of experience in technology and financial services, I've dedicated my career to transforming ideas into reality through innovative software solutions. My journey began as a developer, driven by curiosity and a passion for solving complex problems through code.",
      philosophyTitle: "Philosophy & Values",
      expertiseTitle: "Expertise & Focus Areas",
      continuousGrowth: "Continuous Growth",
      continuousGrowthDesc: "I believe in being a better version of myself every day, constantly learning and adapting to new challenges and technologies.",
      peopleFirst: "People First",
      peopleFirstDesc: "Technology is powerful, but it's the people behind it that make the real difference. I focus on building and leading high-performing teams.",
      responsibleInnovation: "Responsible Innovation",
      responsibleInnovationDesc: "In the age of AI, I'm committed to developing technology that transforms the world responsibly and ethically.",
      fintech: "Financial Technology",
      fintechDesc: "Leading fintech innovation with expertise in payment systems, digital banking, and financial infrastructure.",
      architecture: "Architecture Design Systems",
      architectureDesc: "Developing scalable architecture frameworks and design systems that drive consistency and efficiency across organizations.",
      aiTransformation: "AI & Digital Transformation",
      aiTransformationDesc: "Guiding organizations through digital transformation journeys, leveraging AI and modern technologies responsibly.",
      teamLeadership: "Team Leadership",
      teamLeadershipDesc: "Building and nurturing high-performance engineering teams that deliver exceptional results while maintaining work-life balance."
    },
    
    // Articles Section
    articles: {
      title: "My Articles",
      subtitle: "Insights on Architecture Design Systems and Software Development",
      readOnMedium: "Read on Medium",
      readOnSubstack: "Read on Substack",
      category: "Architecture"
    },
    
    // Quotes Section
    quotes: {
      title: "Favorite Quotes",
      subtitle: "Words that inspire and guide my journey"
    },
    
    // Spiritual Section
    spiritual: {
      title: "Spiritual",
      subtitle: "Biblical wisdom that grounds my journey"
    },
    
    // Contact Section
    contact: {
      title: "Let's Connect",
      subtitle: "Ready to start a conversation?"
    },
    
    // Footer
    footer: {
      copyright: "Made with ❤️",
      totalVisits: "🌍 Total Visits:"
    }
  },
  
  es: {
    // Navigation
    nav: {
      home: "Inicio",
      bio: "Bio",
      articles: "Artículos",
      quotes: "Citas",
      spiritual: "Espiritual",
      contact: "Contacto"
    },
    
    // Hero Section
    hero: {
      motto: "Ser una mejor versión de mí mismo cada día",
      name: "Andres Rincon",
      subtitle: "Desarrollador • Arquitecto • Líder • Manager",
      description: "Tecnólogo apasionado liderando la innovación fintech con más de 20 años de experiencia. Comprometido a transformar el mundo de manera responsable a través de la IA.",
      readArticles: "Leer Artículos",
      getInTouch: "Contactarme"
    },
    
    // Bio Section
    bio: {
      title: "Acerca de Mí",
      subtitle: "Mi trayectoria, filosofía y experiencia",
      introTitle: "Tecnólogo Apasionado y Líder en Innovación",
      introDescription: "Con más de 20 años de experiencia en tecnología y servicios financieros, he dedicado mi carrera a transformar ideas en realidad a través de soluciones de software innovadoras. Mi trayectoria comenzó como desarrollador, impulsado por la curiosidad y la pasión por resolver problemas complejos a través del código.",
      philosophyTitle: "Filosofía y Valores",
      expertiseTitle: "Experiencia y Áreas de Enfoque",
      continuousGrowth: "Crecimiento Continuo",
      continuousGrowthDesc: "Creo en ser una mejor versión de mí mismo cada día, aprendiendo constantemente y adaptándome a nuevos desafíos y tecnologías.",
      peopleFirst: "Las Personas Primero",
      peopleFirstDesc: "La tecnología es poderosa, pero son las personas detrás de ella las que marcan la verdadera diferencia. Me enfoco en construir y liderar equipos de alto rendimiento.",
      responsibleInnovation: "Innovación Responsable",
      responsibleInnovationDesc: "En la era de la IA, estoy comprometido a desarrollar tecnología que transforme el mundo de manera responsable y ética.",
      fintech: "Tecnología Financiera",
      fintechDesc: "Liderando la innovación fintech con experiencia en sistemas de pago, banca digital e infraestructura financiera.",
      architecture: "Sistemas de Diseño Arquitectónico",
      architectureDesc: "Desarrollando marcos de arquitectura escalables y sistemas de diseño que impulsan la consistencia y eficiencia en las organizaciones.",
      aiTransformation: "IA y Transformación Digital",
      aiTransformationDesc: "Guiando a las organizaciones a través de trayectorias de transformación digital, aprovechando la IA y tecnologías modernas de manera responsable.",
      teamLeadership: "Liderazgo de Equipos",
      teamLeadershipDesc: "Construyendo y nutriendo equipos de ingeniería de alto rendimiento que entregan resultados excepcionales mientras mantienen el equilibrio trabajo-vida."
    },
    
    // Articles Section
    articles: {
      title: "Mis Artículos",
      subtitle: "Perspectivas sobre Sistemas de Diseño Arquitectónico y Desarrollo de Software",
      readOnMedium: "Leer en Medium",
      readOnSubstack: "Leer en Substack",
      category: "Arquitectura"
    },
    
    // Quotes Section
    quotes: {
      title: "Citas Favoritas",
      subtitle: "Palabras que inspiran y guían mi camino"
    },
    
    // Spiritual Section
    spiritual: {
      title: "Espiritual",
      subtitle: "Sabiduría bíblica que fundamenta mi camino"
    },
    
    // Contact Section
    contact: {
      title: "Conectemos",
      subtitle: "¿Listo para iniciar una conversación?"
    },
    
    // Footer
    footer: {
      copyright: "Hecho con ❤️",
      totalVisits: "🌍 Total de Visitas:"
    }
  }
};

// Internationalization manager
class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translations = translations;
  }

  // Get translation for a key
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }

  // Change language
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
      this.updatePage();
      
      // Update HTML lang attribute
      document.documentElement.lang = lang;
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLang;
  }

  // Update all translatable elements on the page
  updatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update language toggle button
    this.updateLanguageToggle();
  }

  // Update language toggle button text
  updateLanguageToggle() {
    const toggleBtn = document.getElementById('language-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = this.currentLang === 'en' ? 'ES' : 'EN';
      toggleBtn.setAttribute('title', this.currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English');
      console.log(`🔄 Language toggle updated to: ${toggleBtn.textContent}`);
    }
  }

  // Initialize i18n system
  init() {
    // Set initial HTML lang attribute
    document.documentElement.lang = this.currentLang;
    
    // Setup language toggle when navigation is ready
    this.setupLanguageToggle();
    
    // Update page with current language
    this.updatePage();
  }

  // Setup language toggle button
  setupLanguageToggle() {
    const checkForButton = () => {
      const toggle = document.getElementById('language-toggle');
      if (toggle) {
        // Button found, set it up
        this.updateLanguageToggle();
        toggle.addEventListener('click', () => {
          const newLang = this.currentLang === 'en' ? 'es' : 'en';
          this.setLanguage(newLang);
        });
        console.log('✅ Language toggle button configured');
        return true;
      }
      return false;
    };

    // Try immediately
    if (!checkForButton()) {
      // If not found, check periodically
      const interval = setInterval(() => {
        if (checkForButton()) {
          clearInterval(interval);
        }
      }, 500); // Check every 500ms
      
      // Stop checking after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        console.log('⚠️ Language toggle button not found after 5 seconds');
      }, 5000);
    }
  }

}

// Global i18n instance
const i18n = new I18nManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
