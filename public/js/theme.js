const toggleBtn=document.getElementById('theme-toggle');
const themeIcon=document.getElementById('theme-icon');
const htmlEl=document.documentElement;
let currentTheme=localStorage.getItem('theme')||'dark';

themeIcon.className=currentTheme==='dark'?'bi bi-brightness-high-fill fs-5':'bi bi-moon-fill fs-5';

toggleBtn.addEventListener('click',()=>{
    currentTheme=currentTheme==='dark'?'light':'dark';
    htmlEl.setAttribute('data-bs-theme',currentTheme);
    localStorage.setItem('theme',currentTheme);
    themeIcon.className=currentTheme==='dark'?'bi bi-brightness-high-fill fs-5':'bi bi-moon-fill fs-5';
});