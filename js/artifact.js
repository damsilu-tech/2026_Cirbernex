(() => {
  'use strict';

  const API_BASE = (() => {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://cibernex-api.onrender.com';
  })();

  const LABELS = {
    royal: 'Royalty & Elite',
    funerary: 'Funerary & Afterlife',
    religious: 'Religion & Ritual',
    everyday: 'Daily Life',
    writing: 'Writing & Documents',
    art: 'Art & Sculpture',
    monuments: 'Architecture & Monuments'
  };

  const PERIOD_LABELS = {
    'predynastic': 'Predynastic',
    'early-dynastic': 'Early Dynastic',
    'old-kingdom': 'Old Kingdom',
    'middle-kingdom': 'Middle Kingdom',
    'new-kingdom': 'New Kingdom',
    'late-period': 'Late Period',
    'ptolemaic': 'Ptolemaic & Roman'
  };

  const $ = id => document.getElementById(id);

  const header = $('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const menuBtn = $('menuBtn');
  const navLinks = $('navLinks');

  menuBtn?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
      if (menuBtn) menuBtn.textContent = '☰';
    });
  });

  function text(value) {
    return value === undefined || value === null ? '' : String(value).trim();
  }

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = text(value);
  }

  function showSection(sectionId, shouldShow) {
    const el = $(sectionId);
    if (el) el.hidden = !shouldShow;
  }

  function addDetail(container, label, value) {
    if (!text(value)) return;
    const item = document.createElement('div');
    item.className = 'detail-item';

    const labelEl = document.createElement('span');
    labelEl.className = 'detail-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'detail-value';
    valueEl.textContent = text(value);

    item.append(labelEl, valueEl);
    container.appendChild(item);
  }

  function getRelatedId(item) {
    if (!item) return '';
    return typeof item === 'string' ? item : text(item._id);
  }

  function renderRelated(items) {
    const section = $('relatedSection');
    const grid = $('relatedArtifacts');
    if (!Array.isArray(items) || !items.length) {
      showSection('relatedSection', false);
      return;
    }

    grid.replaceChildren();

    items.forEach(item => {
      const id = getRelatedId(item);
      if (!id) return;

      const card = document.createElement('a');
      card.className = 'related-card';
      card.href = `artifact.html?id=${encodeURIComponent(id)}`;

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = text(item.title) || 'Related artifact';
      img.src = text(item.imageUrl) || '';
      img.onerror = () => {
        img.style.display = 'none';
      };

      const body = document.createElement('div');
      body.className = 'related-card-body';

      const category = document.createElement('span');
      category.textContent = LABELS[item.category] || text(item.category);

      const title = document.createElement('h3');
      title.textContent = text(item.title) || 'Related artifact';

      body.append(category, title);
      card.append(img, body);
      grid.appendChild(card);
    });

    showSection('relatedSection', grid.children.length > 0);
  }

  function renderArtifact(a) {
    const title = text(a.title) || 'Untitled Artifact';

    document.title = `${title} | Egypt's Digital Museum`;

    const image = $('artifactImage');
    image.src = text(a.imageUrl);
    image.alt = title;
    image.onerror = () => {
      image.removeAttribute('src');
      image.style.background = '#c9bfa8';
    };

    setText('artifactCategory', LABELS[a.category] || a.category || 'Artifact');
    setText('artifactDate', a.date);
    setText('artifactTitle', title);
    setText('artifactShortDescription', a.shortDescription || a.description || 'A recorded object in Egypt’s Digital Museum.');

    const facts = $('artifactQuickFacts');
    facts.replaceChildren();
    addQuickFact(facts, 'Period', PERIOD_LABELS[a.period] || a.period);
    addQuickFact(facts, 'Dynasty', a.dynasty);
    addQuickFact(facts, 'Location', (a.place && a.place.location) || a.location);

    const description = text(a.description);
    setText('artifactDescription', description);
    showSection('descriptionSection', Boolean(description));

    const details = $('artifactDetails');
    details.replaceChildren();
    addDetail(details, 'Category', LABELS[a.category] || a.category);
    addDetail(details, 'Period', PERIOD_LABELS[a.period] || a.period);
    addDetail(details, 'Date', a.date);
    addDetail(details, 'Dynasty', a.dynasty);
    addDetail(details, 'Location', (a.place && a.place.location) || a.location);
    addDetail(details, 'Weight', a.weight);
    showSection('detailsSection', details.children.length > 0);

    const materials = Array.isArray(a.materials) ? a.materials.filter(Boolean) : [];
    const materialList = $('artifactMaterials');
    materialList.replaceChildren();
    materials.forEach(material => {
      const li = document.createElement('li');
      li.textContent = material;
      materialList.appendChild(li);
    });
    showSection('materialsSection', materials.length > 0);

    setText('artifactSignificance', a.significance);
    showSection('significanceSection', Boolean(text(a.significance)));

    setText('artifactDiscovery', a.discovery);
    showSection('discoverySection', Boolean(text(a.discovery)));

    const person = a.person || {};
    setText('personName', person.name);
    setText('personRole', person.role);
    showSection('personCard', Boolean(text(person.name) || text(person.role)));

    const place = a.place || {};
    setText('placeName', place.name);
    setText('placeLocation', place.location || a.location);
    showSection('placeCard', Boolean(text(place.name) || text(place.location) || text(a.location)));

    showSection('connectionsSection',
      Boolean(
        text(person.name) || text(person.role) ||
        text(place.name) || text(place.location) || text(a.location)
      )
    );

    renderRelated(a.relatedArtifacts || []);

    $('artifactLoading').hidden = true;
    $('artifactError').hidden = true;
    $('artifactContent').hidden = false;
  }

  function addQuickFact(container, label, value) {
    if (!text(value)) return;

    const box = document.createElement('div');
    box.className = 'quick-fact';

    const labelEl = document.createElement('span');
    labelEl.className = 'quick-fact-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'quick-fact-value';
    valueEl.textContent = text(value);

    box.append(labelEl, valueEl);
    container.appendChild(box);
  }

  async function loadArtifact() {
    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
      showError('No artifact ID was provided. Please return to the collection and choose an artifact.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/artifacts/${encodeURIComponent(id)}`);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const artifact = await response.json();

      if (!artifact || !artifact._id) {
        throw new Error('Invalid artifact data received');
      }

      renderArtifact(artifact);
    } catch (error) {
      console.error('Unable to load artifact:', error);
      showError('The artifact record could not be loaded right now. Please return to the collection and try again.');
    }
  }

  function showError(message) {
    $('artifactLoading').hidden = true;
    $('artifactContent').hidden = true;
    $('artifactError').hidden = false;
    setText('artifactErrorMessage', message);
  }

  loadArtifact();
})();
