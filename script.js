/* ─── Load & Render ──────────────────────────────────── */
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    renderHero(data.meta);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderProjects(data.projects);
    renderPublications(data.publications);
    renderSkills(data.skills);
    renderAchievements(data.achievements);
    renderContact(data.meta);
    initScrollAnimations();
    initNav();
    initRoleCycle(data.meta.roles);
  });

/* ─── Hero ───────────────────────────────────────────── */
function renderHero(meta) {
  document.getElementById('hero-name').textContent = meta.name;
  document.getElementById('hero-summary').textContent = meta.summary;

  const stats = [
    { num: '6+',  label: 'Papers Published' },
    { num: '15+', label: 'Production AI Systems' },
  ];

  const container = document.getElementById('hero-stats');
  stats.forEach(s => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<span class="stat-num">${s.num}</span><span class="stat-label">${s.label}</span>`;
    container.appendChild(el);
  });

  const ghBtn = document.getElementById('btn-github');
  if (ghBtn) ghBtn.href = meta.github;
}

/* ─── Role Cycling Animation ─────────────────────────── */
function initRoleCycle(roles) {
  const el = document.getElementById('role-text');
  if (!el) return;
  let i = 0;
  let charIdx = 0;
  let deleting = false;
  let waiting = false;

  function tick() {
    const word = roles[i % roles.length];

    if (waiting) {
      waiting = false;
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }

    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) { waiting = true; setTimeout(tick, 80); }
      else setTimeout(tick, 70);
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; i++; setTimeout(tick, 300); }
      else setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 800);
}

/* ─── Experience ─────────────────────────────────────── */
function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  experience.forEach(exp => {
    const item = document.createElement('div');
    item.className = 'timeline-item' + (exp.current ? ' current' : '');
    item.innerHTML = `
      <div class="exp-header">
        <div>
          <div class="exp-company">
            ${exp.company}
            ${exp.current ? '<span class="current-badge">Now</span>' : ''}
          </div>
          <div class="exp-role">${exp.role} · ${exp.location}</div>
        </div>
        <div class="exp-period">${exp.period}</div>
      </div>
      <ul class="exp-points">
        ${exp.points.map(p => `<li>${p}</li>`).join('')}
      </ul>`;
    timeline.appendChild(item);
  });
}

/* ─── Education ──────────────────────────────────────── */
function renderEducation(education) {
  const container = document.getElementById('edu-container');
  education.forEach(edu => {
    const card = document.createElement('div');
    card.className = 'edu-card';
    card.innerHTML = `
      <div>
        <div class="edu-inst">${edu.institution}</div>
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-spec">${edu.specialization}</div>
      </div>
      <div class="edu-meta">
        <div class="edu-period">${edu.period}</div>
        <div class="edu-cgpa">${edu.cgpa}<span>CGPA</span></div>
      </div>`;
    container.appendChild(card);
  });
}

/* ─── Projects ───────────────────────────────────────── */
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const links = [];
    if (p.github) links.push(`<a href="${p.github}" target="_blank" rel="noopener" class="project-link">↗ Code</a>`);
    if (p.demo)   links.push(`<a href="${p.demo}"   target="_blank" rel="noopener" class="project-link">↗ Live</a>`);

    card.innerHTML = `
      <div class="project-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="project-name">${p.name}</div>
      <div class="project-subtitle">${p.subtitle}</div>
      <p class="project-desc">${p.description}</p>
      <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      <div class="project-links">${links.join('')}</div>`;
    grid.appendChild(card);
  });
}

/* ─── Publications ───────────────────────────────────── */
function renderPublications(pubs) {
  const list = document.getElementById('pub-list');
  pubs.forEach(pub => {
    const item = document.createElement('div');
    item.className = 'pub-item';
    const link = pub.url && pub.url !== '#'
      ? `<a href="${pub.url}" target="_blank" rel="noopener" class="project-link" style="margin-top:16px;display:inline-flex">↗ View Paper</a>`
      : '';
    const statusBadge = pub.status
      ? `<span class="pub-status pub-status--${pub.status.toLowerCase().replace(/\s+/g,'-')}">${pub.status}</span>`
      : '';
    item.innerHTML = `
      <div class="pub-header">
        <div class="pub-venue">${pub.venue}</div>
        ${statusBadge}
      </div>
      <div class="pub-title">${pub.title}</div>
      <ul class="pub-highlights">
        ${pub.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
      ${link}`;
    list.appendChild(item);
  });
}

/* ─── Skills ─────────────────────────────────────────── */
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  Object.entries(skills).forEach(([category, tags]) => {
    const group = document.createElement('div');
    group.className = 'skill-group';
    group.innerHTML = `
      <div class="skill-category">${category}</div>
      <div class="skill-tags">
        ${tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>`;
    grid.appendChild(group);
  });
}

/* ─── Achievements ───────────────────────────────────── */
function renderAchievements(achievements) {
  const list = document.getElementById('achievement-list');
  achievements.forEach((a, i) => {
    const item = document.createElement('div');
    item.className = 'achievement-item';
    item.innerHTML = `
      <div class="achievement-num">0${i + 1}</div>
      <div class="achievement-text">${a}</div>`;
    list.appendChild(item);
  });
}

/* ─── Contact ────────────────────────────────────────── */
function renderContact(meta) {
  document.getElementById('contact-name').textContent = `Let's work\ntogether.`;

  const links = [
    { icon: '@', label: 'Email', val: meta.email, href: `mailto:${meta.email}` },
    { icon: '⌥', label: 'GitHub', val: 'github.com/namanomar', href: meta.github },
    { icon: '↗', label: 'LinkedIn', val: 'linkedin.com/in/naman-omar', href: meta.linkedin },
    { icon: '◆', label: 'Google Scholar', val: 'Scholar Profile', href: meta.scholar },
  ];

  const container = document.getElementById('contact-links');
  links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'contact-link';
    a.href = l.href;
    if (!l.href.startsWith('mailto')) { a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = `
      <span class="contact-link-icon">${l.icon}</span>
      <span><span class="contact-link-label">${l.label}</span><span class="contact-link-val">${l.val}</span></span>`;
    container.appendChild(a);
  });
}

/* ─── Scroll Animations ──────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.timeline-item, .project-card, .pub-item, .skill-group, .achievement-item, .edu-card'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = (parseInt(el.dataset.delay) || 0) * 80;
        setTimeout(() => el.classList.add('visible'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.dataset.delay = i % 6;
    io.observe(el);
  });
}

/* ─── Active Nav Tracking ────────────────────────────── */
function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
}
