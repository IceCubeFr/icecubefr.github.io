console.log("Launched!");
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
const mailLink: HTMLLinkElement = document.getElementById("mail-link") as HTMLLinkElement;

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
const logoLink = document.querySelector(".logo");

if(burgerMenu && navMenu) {
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Fermer le menu et restaurer la vue principale quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            burgerMenu.classList.remove("active");
            navMenu.classList.remove("active");
            showMainContent(); // Retour à la vue principale au clic sur un lien du menu
        });
    });

    // Restaurer la vue principale quand on clique sur le logo
    logoLink?.addEventListener("click", (e) => {
        e.preventDefault();
        burgerMenu.classList.remove("active");
        navMenu.classList.remove("active");
        showMainContent();
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
                navLinks.forEach((link: Element) => {
                    link.classList.remove('active-link');
                    // Cas spécial : si le href correspond à l'ID de la section
                    // On gère le cas href="#topic" et href="index.html#topic"
                    if (link.getAttribute('href')!.endsWith('#' + entry.target.id)) {
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

/* --- 7. LOADING PROJECTS --- */
let allProjects: Project[] = [];

interface Tags {
    title: string;
    type: string;
}
interface Project {
    title: string;
    imgUrl: string;
    shortDesc: string;
    tags: Tags[];
    desc: string;
    descHTML: string;
    link: string;
}

function renderTags(tags: Tags[]) {
    let html: string = "";
    tags.forEach((tag: Tags) => {
        html += `<li class="${tag.type}">${tag.title}</li>`
    });
    return html;
}

function renderProject(proj: Project, index: number) {
    return `
        <article class="card projContainer" data-index="${index}">
            <img src="${proj.imgUrl}" alt="Image du projet ${proj.title}">
            <h3>${proj.title}</h3>
            <p>${proj.shortDesc}</p>
            <ul class="tags">
                ${renderTags(proj.tags)}
            </ul>
        </article>
`
}

function openPopup(proj: Project) {
    const popup = document.querySelector('.popup')!;
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-card">
                <div class="popup-image-container">
                    <img src="${proj.imgUrl}" alt="${proj.title}">
                </div>
                <div class="popup-content">
                    <h2>${proj.title}</h2>
                    <h3>${proj.shortDesc}</h3>
                    <div class="popup-desc">
                        ${proj.descHTML}
                    </div>
                    <ul class="tags">
                        ${renderTags(proj.tags)}
                    </ul>
                    <div class="popup-actions">
                        <a href="${proj.link}" target="_blank" class="popup-link">Découvrir le projet <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        <button class="popup-link close-popup-btn">Retour</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    popup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const closeBtn = popup.querySelector('.close-popup-btn');
    const overlay = popup.querySelector('.popup-overlay');

    const closePopup = () => {
        popup.classList.add('hidden');
        popup.innerHTML = "";
        document.body.style.overflow = ''; // Rétablir le scroll
    };

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closePopup();
    });

    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });
}

fetch("./src/projects.json")
.then(response => response.json())
.then((projects: Project[]) => {
    allProjects = projects;
    const container = document.querySelector('.cards')!;
    if (container) {
        let html = "";
        projects.forEach((proj: Project, index: number) => {
            html += renderProject(proj, index);
        })
        container.innerHTML = html;

        const projs = document.querySelectorAll('.projContainer')!;
        projs.forEach(elt => {
            elt.addEventListener('click', () => {
                const index = parseInt(elt.getAttribute('data-index')!);
                openPopup(allProjects[index]);
            });
        });
    }
})
.catch(error => {
    console.error("Erreur lors du chargement des projets:", error);
});

/* --- 8. Mentions legales et anciennes versions --- */
const mainSection = document.querySelector('main')!;
const heroSection = document.querySelector('.image')!;
const oldLink = document.querySelector('.oldLink')!;
const mentionsLink = document.querySelector('.mentionsLink')!;
const oldSection = document.querySelector('.old')!;
const mentionsSection = document.querySelector('.mentionsLegales')!;

function hideMainContent() {
    mainSection.classList.add('hidden');
    heroSection.classList.add('hidden');
    window.scrollTo(0, 0);
}

function showMainContent() {
    mainSection.classList.remove('hidden');
    heroSection.classList.remove('hidden');
    oldSection.classList.add('hidden');
    mentionsSection.classList.add('hidden');
    window.scrollTo(0, 0);
}

function setupBackButtons(container: Element) {
    const backBtns = container.querySelectorAll('.main-back');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showMainContent();
        });
    });
}

fetch("./old.html")
.then(response => response.text())
.then(content => {
    oldSection.innerHTML = `<div class="reveal active">${content}</div>`;
    setupBackButtons(oldSection);
});

fetch("./mentions.html")
.then(response => response.text())
.then(content => {
    mentionsSection.innerHTML = `<div class="reveal active">${content}</div>`;
    setupBackButtons(mentionsSection);
});

oldLink?.addEventListener('click', (event) => {
    event.preventDefault();
    hideMainContent();
    mentionsSection.classList.add('hidden');
    oldSection.classList.remove('hidden');
});

mentionsLink?.addEventListener('click', (event) => {
    event.preventDefault();
    hideMainContent();
    oldSection.classList.add('hidden');
    mentionsSection.classList.remove('hidden');
});
