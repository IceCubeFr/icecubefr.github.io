(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const v of s.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&c(v)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();console.log("Launched!");const q=1500,k=Date.now();function T(){const e=Date.now()-k,t=Math.max(0,q-e);setTimeout(()=>{const n=document.getElementById("banter-loader"),c=document.getElementById("all");n&&(n.style.opacity="0"),setTimeout(()=>{n&&(n.style.display="none"),c&&(c.style.display="block"),$(),M()},500)},t)}window.addEventListener("load",T);function $(){const e=document.querySelectorAll(".reveal");if("IntersectionObserver"in window){const t=new IntersectionObserver((n,c)=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("active"),c.unobserve(o.target))})},{threshold:.15});e.forEach(n=>{t.observe(n)})}else e.forEach(t=>t.classList.add("active"))}const d=document.getElementById("backToTop");d&&(window.addEventListener("scroll",()=>{window.scrollY>300?d.classList.add("show"):d.classList.remove("show")}),d.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}));const i=document.getElementById("mail-link");if(i){const e="florian.gavoille.pro",t="gmail.com";i.addEventListener("mouseover",()=>{i.href="mailto:"+e+"@"+t}),i.addEventListener("click",()=>{i.href="mailto:"+e+"@"+t})}const r=document.querySelector(".burger-menu"),u=document.querySelector(".nav-menu"),g=document.querySelectorAll(".nav-menu ul li a"),m=document.querySelector(".logo");r&&u&&(r.addEventListener("click",()=>{r.classList.toggle("active"),u.classList.toggle("active")}),g.forEach(e=>{e.addEventListener("click",()=>{r.classList.remove("active"),u.classList.remove("active"),h()})}),m==null||m.addEventListener("click",e=>{e.preventDefault(),r.classList.remove("active"),u.classList.remove("active"),h()}));function M(){const e=document.querySelectorAll("section[id]");if(e.length===0)return;const t={root:null,rootMargin:"0px",threshold:.3},n=new IntersectionObserver(c=>{c.forEach(o=>{o.isIntersecting&&g.forEach(s=>{s.classList.remove("active-link"),s.getAttribute("href").endsWith("#"+o.target.id)&&s.classList.add("active-link")})})},t);e.forEach(c=>{n.observe(c)})}let L=[];function y(e){let t="";return e.forEach(n=>{t+=`<li class="${n.type}">${n.title}</li>`}),t}function I(e,t){return`
        <article class="card projContainer" data-index="${t}">
            <img src="${e.imgUrl}" alt="Image du projet ${e.title}">
            <h3>${e.title}</h3>
            <p>${e.shortDesc}</p>
            <ul class="tags">
                ${y(e.tags)}
            </ul>
        </article>
`}function O(e){const t=document.querySelector(".popup");t.innerHTML=`
        <div class="popup-overlay">
            <div class="popup-card">
                <div class="popup-image-container">
                    <img src="${e.imgUrl}" alt="${e.title}">
                </div>
                <div class="popup-content">
                    <h2>${e.title}</h2>
                    <h3>${e.shortDesc}</h3>
                    <div class="popup-desc">
                        ${e.descHTML}
                    </div>
                    <ul class="tags">
                        ${y(e.tags)}
                    </ul>
                    <div class="popup-actions">
                        <a href="${e.link}" target="_blank" class="popup-link">Découvrir le projet <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        <button class="popup-link close-popup-btn">Retour</button>
                    </div>
                </div>
            </div>
        </div>
    `,t.classList.remove("hidden"),document.body.style.overflow="hidden";const n=t.querySelector(".close-popup-btn"),c=t.querySelector(".popup-overlay"),o=()=>{t.classList.add("hidden"),t.innerHTML="",document.body.style.overflow=""};n==null||n.addEventListener("click",s=>{s.stopPropagation(),o()}),c==null||c.addEventListener("click",s=>{s.target===c&&o()})}fetch("./js/projects.json").then(e=>e.json()).then(e=>{L=e;const t=document.querySelector(".cards");if(t){let n="";e.forEach((o,s)=>{n+=I(o,s)}),t.innerHTML=n,document.querySelectorAll(".projContainer").forEach(o=>{o.addEventListener("click",()=>{const s=parseInt(o.getAttribute("data-index"));O(L[s])})})}}).catch(e=>{console.error("Erreur lors du chargement des projets:",e)});const b=document.querySelector("main"),E=document.querySelector(".image"),p=document.querySelector(".oldLink"),f=document.querySelector(".mentionsLink"),l=document.querySelector(".old"),a=document.querySelector(".mentionsLegales");function w(){b.classList.add("hidden"),E.classList.add("hidden"),window.scrollTo(0,0)}function h(){b.classList.remove("hidden"),E.classList.remove("hidden"),l.classList.add("hidden"),a.classList.add("hidden"),window.scrollTo(0,0)}function S(e){e.querySelectorAll(".main-back").forEach(n=>{n.addEventListener("click",c=>{c.preventDefault(),h()})})}fetch("./old.html").then(e=>e.text()).then(e=>{l.innerHTML=`<div class="reveal active">${e}</div>`,S(l)});fetch("./mentions.html").then(e=>e.text()).then(e=>{a.innerHTML=`<div class="reveal active">${e}</div>`,S(a)});p==null||p.addEventListener("click",e=>{e.preventDefault(),w(),a.classList.add("hidden"),l.classList.remove("hidden")});f==null||f.addEventListener("click",e=>{e.preventDefault(),w(),l.classList.add("hidden"),a.classList.remove("hidden")});
