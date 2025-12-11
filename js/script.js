/* --- 1. GESTION DU LOADER --- */
const MIN_TIME = 1500; // Le temps minimum du loader (en ms)
const start = Date.now();

function finishLoading() {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, MIN_TIME - elapsed);

    setTimeout(() => {
        const loader = document.getElementById("banter-loader");
        const content = document.getElementById("all");

        // Disparition en fondu
        if(loader) loader.style.opacity = "0";

        setTimeout(() => {
            // Suppression totale et affichage du site
            if(loader) loader.style.display = "none";
            if(content) content.style.display = "block";

            // On lance les animations d'apparition une fois le site visible
            initScrollReveal();
            // On lance l'observateur de sections pour le menu
            initActiveSectionObserver();
        }, 500); // Temps de la transition CSS (0.5s)
    }, remaining);
}

// On déclenche la fin du chargement quand la page est prête
window.addEventListener("load", finishLoading);


/* --- 2. SCROLL REVEAL (Animation d'apparition) --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    // Vérifie si le navigateur supporte l'observer (moderne)
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // On arrête d'observer une fois l'élément affiché
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 }); // Se déclenche à 15% de visibilité

        reveals.forEach(reveal => {
            revealObserver.observe(reveal);
        });
    } else {
        // Fallback pour vieux navigateurs : on affiche tout directement
        reveals.forEach(reveal => reveal.classList.add("active"));
    }
}


/* --- 3. BOUTON RETOUR EN HAUT --- */
const backToTopBtn = document.getElementById("backToTop");

if(backToTopBtn) {
    window.addEventListener("scroll", () => {
        // Affiche le bouton si on a scrollé de plus de 300px
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* --- 4. PROTECTION EMAIL (Obfuscation) --- */
const mailLink = document.getElementById("mail-link");

if(mailLink) {
    // On sépare les parties de l'email pour éviter que les robots ne les lisent dans le code source
    const user = "florian.gavoille.pro";
    const domain = "gmail.com";
    
    // On reconstitue le lien au survol ou au clic pour l'utilisateur
    mailLink.addEventListener("mouseover", () => {
        mailLink.href = "mailto:" + user + "@" + domain;
    });

    mailLink.addEventListener("click", () => {
        mailLink.href = "mailto:" + user + "@" + domain;
    });
}

/* --- 5. BURGER MENU --- */
const burgerMenu = document.querySelector(".burger-menu");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu ul li a");

if(burgerMenu && navMenu) {
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            burgerMenu.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

/* --- 6. ACTIVE LINK ON SCROLL --- */
function initActiveSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    
    // Si aucune section n'est trouvée (ex: page mentions légales), on ne fait rien
    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // La section doit être visible à 30% pour être considérée active
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    // Cas spécial : si le href correspond à l'ID de la section
                    // On gère le cas href="#topic" et href="index.html#topic"
                    if (link.getAttribute('href').endsWith('#' + entry.target.id)) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}