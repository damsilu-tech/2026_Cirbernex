const API = 'http://localhost:3000/api/artifacts';
    let artifacts = [];

    // ---- Header ----
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.textContent = open ? '✕' : '☰';
    });

    // ---- Image preview ----
    function previewImage(url) {
      const img = document.getElementById('imgPreview');
      if (url) { img.src = url; img.style.display = 'block'; }
      else img.style.display = 'none';
    }

    // ---- Toast ----
    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast ' + type;
      t.style.display = 'block';
      setTimeout(() => t.style.display = 'none', 4000);
    }

    // ---- Load artifacts ----
    async function loadArtifacts() {
      try {
        const res = await fetch(API);
        artifacts = await res.json();
        renderList(artifacts);
        document.getElementById('countBadge').textContent = artifacts.length;
      } catch {
        document.getElementById('artifactList').innerHTML = '<div class="empty-list">Could not connect to server.</div>';
      }
    }

    // ---- Render list ----
    function renderList(data) {
      const list = document.getElementById('artifactList');
      if (!data.length) {
        list.innerHTML = '<div class="empty-list">No artifacts found.</div>';
        return;
      }
      list.innerHTML = data.map(a => `
        <div class="artifact-row">
          <img src="${a.imageUrl}" alt="${a.title}" onerror="this.src=''">
          <div class="artifact-row-info">
            <strong>${a.title}</strong>
            <span>${a.category}${a.period ? ' · ' + a.period : ''}${a.date ? ' · ' + a.date : ''}</span>
          </div>
          <div class="row-actions">
            <button class="btn-edit" onclick="editArtifact('${a._id}')">Edit</button>
            <button class="btn-delete" onclick="deleteArtifact('${a._id}', '${a.title}')">Delete</button>
          </div>
        </div>
      `).join('');
    }

    // ---- Search ----
    function filterList(query) {
      const q = query.toLowerCase();
      const filtered = artifacts.filter(a =>
        a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      );
      renderList(filtered);
    }

    // ---- Submit (add or update) ----
    async function submitForm() {
      const id    = document.getElementById('editId').value;
      const title = document.getElementById('title').value.trim();
      const cat   = document.getElementById('category').value;
      const per   = document.getElementById('period').value;
      const desc  = document.getElementById('description').value.trim();
      const img   = document.getElementById('imageUrl').value.trim();

      if (!title || !cat || !per || !desc || !img) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const body = {
        title,
        category: cat,
        period:      per,
        date:        document.getElementById('date').value.trim(),
        description: desc,
        imageUrl:    img,
        location:    document.getElementById('location').value.trim(),
        dynasty:     document.getElementById('dynasty').value.trim(),
      };

      try {
        const url    = id ? `${API}/${id}` : API;
        const method = id ? 'PUT' : 'POST';
        const res    = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error();
        showToast(id ? '✓ Artifact updated!' : '✓ Artifact added!');
        clearForm();
        loadArtifacts();
      } catch {
        showToast('Something went wrong. Is the server running?', 'error');
      }
    }

    // ---- Edit ----
    function editArtifact(id) {
      const a = artifacts.find(x => x._id === id);
      if (!a) return;

      document.getElementById('editId').value      = a._id;
      document.getElementById('title').value       = a.title;
      document.getElementById('category').value    = a.category;
      document.getElementById('period').value       = a.period || '';
      document.getElementById('date').value        = a.date || '';
      document.getElementById('description').value = a.description;
      document.getElementById('imageUrl').value    = a.imageUrl;
      document.getElementById('location').value    = a.location || '';
      document.getElementById('dynasty').value     = a.dynasty || '';
      document.getElementById('formTitle').textContent = '✏️ Edit Artifact';
      previewImage(a.imageUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---- Delete ----
    async function deleteArtifact(id, title) {
      if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
      try {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        showToast(`✓ "${title}" deleted.`);
        loadArtifacts();
      } catch {
        showToast('Delete failed. Is the server running?', 'error');
      }
    }

    // ---- Clear form ----
    function clearForm() {
      ['editId','title','date','description','imageUrl','location','dynasty'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('category').value = '';
      document.getElementById('period').value = '';
      document.getElementById('formTitle').textContent = '➕ Add New Artifact';
      document.getElementById('imgPreview').style.display = 'none';
    }

    loadArtifacts();