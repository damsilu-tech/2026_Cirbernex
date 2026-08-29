'use strict';

/* ------ Header ------ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ------ Mobile nav ------ */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
  menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  });
});

/* ------ Section nav highlight on scroll ------ */
const snavBtns = document.querySelectorAll('.snav-btn');
const sections = document.querySelectorAll('section[id]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      snavBtns.forEach(b => b.classList.remove('active'));
      const active = document.querySelector(`.snav-btn[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

/* ------ Live artifact count ------ */
const API_BASE = (() => {
  const h = window.location.hostname;
  return (h === 'localhost' || h === '127.0.0.1') ? 'http://localhost:3000' : '';
})();

async function loadArtifactCount() {
  const el = document.getElementById('aboutArtifacts');
  if (!el) return;
  try {
    const res  = await fetch(`${API_BASE}/api/artifacts`);
    const data = await res.json();
    if (data.length) el.textContent = data.length + '+';
  } catch {
    // Keep default value
  }
}

loadArtifactCount();