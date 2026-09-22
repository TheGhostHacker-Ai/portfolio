// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('#mobile-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

// ============================================================
// Active section indicator
// ============================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('[data-nav]');

const setActive = (id) => {
  navLinks.forEach((link) => {
    const match = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', match);
  });
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

// ============================================================
// Project detail modal
// ============================================================
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
let lastFocusedEl = null;

const PROJECTS_DATA = {
  enyayalaya: {
    title: 'e-Nyayalaya — Unified Digital Evidence & Case Docketing Grid',
    overview: 'A next-generation zero-trust judicial case management and electronic evidence infrastructure bridging Citizens, 1,900+ Police Stations, Trial Courts, High Courts, Supreme Court, and Central Enforcement Agencies (CBI/NIA/ED).',
    objective: "Built natively to fulfill the statutory mandates of India's New Criminal Laws (BNSS & BSA 2023), eliminating physical file transit delays, paper case diary doctoring, and inter-agency jurisdictional silos.",
    approach: 'Features a 4-tier linear judicial hierarchy with specialized agency transfer dispatch. Employs client-side SHA-256 Web Crypto API hashing, recursive block chaining (PreviousHash_{i-1}) for court admissibility under Sec 63 BSA 2023, Google Gemini Vision OCR, and PostgreSQL Row-Level Security.',
    features: [
      'Instant Zero FIR territorial handover under Sec 173(1) BNSS in < 30 seconds',
      'Automated Sec 193 BNSS Final Charge Sheet generation via Gemini Vision AI',
      'Mathematically tamper-evident chained audit ledger under Sec 63 BSA 2023',
      'Single-Use Master Transfer Tokens (TRF-CBI-XXXX) for cryptographic custody handover',
      '100% Aadhaar Act 2016 UIDAI 4-digit masking (XXXX-XXXX-1234)'
    ],
    technologies: 'React 19, Vite 8, Supabase PostgreSQL 15, Row-Level Security (RLS), SHA-256 Web Crypto API, Google Gemini Multimodal Vision, Netlify CI/CD, GIGW 3.0',
    complianceTitle: 'Compliance & Standards',
    complianceDesc: 'Fully compliant with the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam (BSA 2023), Aadhaar Act 2016, and Supreme Court e-Courts Phase III / ICJS architecture.',
    repoUrl: 'https://github.com/TheGhostHacker-Ai/e-Nyayalaya',
    demoUrl: 'https://e-nyayalaya.netlify.app/'
  },
  scanner: {
    title: 'Website Vulnerability Scanner',
    overview: 'A Python-based tool for scanning websites the user is authorized to test, aimed at identifying common, well-understood security issues rather than performing comprehensive penetration testing.',
    objective: 'Built as a hands-on way to learn how automated security checks work in practice — moving from reading about vulnerabilities to writing code that actually looks for them.',
    approach: 'The scanner sends HTTP/HTTPS requests to a target URL and inspects the responses — headers, status codes and page content — for indicators of common misconfigurations, then reports findings in a structured, readable format.',
    features: [
      'HTTP/HTTPS request-based scanning of a target URL',
      'Basic security header and configuration checks',
      'Structured output of findings'
    ],
    technologies: 'Python, HTTP/HTTPS, Security Assessment Tools',
    complianceTitle: 'Responsible Use',
    complianceDesc: 'This tool is intended for authorized security testing and educational purposes only. Only scan systems you own or have explicit permission to test.',
    repoUrl: 'https://github.com/TheGhostHacker-Ai/Website-vulnerability-scanner',
    demoUrl: null
  },
  sehatsaathi: {
    title: 'SehatSaathi — AI-Enabled Healthcare Application',
    overview: 'An AI-assisted healthcare platform built to improve medical accessibility, multilingual patient interactions, and symptom analysis with a user-centric design.',
    objective: 'Developed for the Smart India Hackathon to bridge the gap between patients and primary healthcare information through intelligent AI assistance.',
    approach: 'Integrates responsive frontend interfaces with AI/ML diagnostic APIs and clean medical workflow routing, enabling patients to describe symptoms and receive structured health guidance.',
    features: [
      'Interactive AI health assistant for preliminary symptom checking',
      'Doctor discovery and medical workflow navigation',
      'Mobile-responsive UI designed for accessibility',
      'Cloud deployment on Netlify CDN'
    ],
    technologies: 'React, JavaScript, AI / ML Diagnostic APIs, Tailwind CSS, Netlify Cloud',
    complianceTitle: 'Project Context',
    complianceDesc: 'Developed for Smart India Hackathon innovation challenges focused on accessible digital healthcare in India.',
    repoUrl: 'https://github.com/TheGhostHacker-Ai',
    demoUrl: 'https://sehatsaathii.netlify.app/'
  },
  rudrax: {
    title: 'RudraX — AI Home Assistant',
    overview: 'A smart voice-driven AI home assistant designed for contextual information retrieval, voice command execution, IoT automation, and desktop productivity.',
    objective: 'Built to explore on-device speech recognition, natural language intent mapping, and automated device interaction without reliance on opaque cloud lock-in.',
    approach: 'Combines Python speech recognition engines, text-to-speech synthesis, and custom NLP intent parsers to execute system tasks, answer contextual queries, and manage automation workflows.',
    features: [
      'Real-time voice command processing and audio feedback',
      'Contextual intent recognition and question answering',
      'Automated desktop workflow triggers and system utilities',
      'Modular architecture allowing extension to IoT and smart appliances'
    ],
    technologies: 'Python, Speech Recognition, NLP, PyAudio, OS Automation APIs',
    complianceTitle: 'Project Status',
    complianceDesc: 'Active ongoing development exploring localized edge AI processing and low-latency voice interactions.',
    repoUrl: 'https://github.com/TheGhostHacker-Ai',
    demoUrl: null
  }
};

const openModal = (triggerEl, projectKey = 'enyayalaya') => {
  lastFocusedEl = triggerEl;
  const data = PROJECTS_DATA[projectKey] || PROJECTS_DATA.enyayalaya;

  const titleEl = document.getElementById('modal-title');
  const overviewEl = document.getElementById('modal-overview');
  const objectiveEl = document.getElementById('modal-objective');
  const approachEl = document.getElementById('modal-approach');
  const featuresEl = document.getElementById('modal-features');
  const techEl = document.getElementById('modal-tech');
  const compTitleEl = document.getElementById('modal-compliance-title');
  const compDescEl = document.getElementById('modal-compliance-desc');
  const repoLinkEl = document.getElementById('modal-repo-link');
  const demoLinkEl = document.getElementById('modal-demo-link');

  if (titleEl) titleEl.textContent = data.title;
  if (overviewEl) overviewEl.textContent = data.overview;
  if (objectiveEl) objectiveEl.textContent = data.objective;
  if (approachEl) approachEl.textContent = data.approach;
  if (techEl) techEl.textContent = data.technologies;
  if (compTitleEl) compTitleEl.textContent = data.complianceTitle;
  if (compDescEl) compDescEl.textContent = data.complianceDesc;
  if (repoLinkEl) repoLinkEl.href = data.repoUrl;

  if (demoLinkEl) {
    if (data.demoUrl) {
      demoLinkEl.href = data.demoUrl;
      demoLinkEl.style.display = 'inline-flex';
    } else {
      demoLinkEl.style.display = 'none';
    }
  }

  if (featuresEl) {
    featuresEl.innerHTML = '';
    data.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      featuresEl.appendChild(li);
    });
  }

  modal.hidden = false;
  modalClose.focus();
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedEl) lastFocusedEl.focus();
};

document.querySelectorAll('[data-open-project], [data-project]').forEach((el) => {
  el.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let GitHub link work normally
    const projectKey = el.getAttribute('data-open-project') || el.getAttribute('data-project');
    openModal(el, projectKey);
  });
  el.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && el.hasAttribute('data-project')) {
      e.preventDefault();
      const projectKey = el.getAttribute('data-project');
      openModal(el, projectKey);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// ============================================================
// GitHub repositories (graceful failure)
// ============================================================
const repoContainer = document.getElementById('github-repos');
const repoStatus = document.getElementById('repo-status');
const GITHUB_USER = 'TheGhostHacker-Ai';

async function loadRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error('GitHub API request failed');
    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      repoStatus.textContent = 'No public repositories to show right now.';
      return;
    }

    repoStatus.remove();

    repos
      .filter((r) => !r.fork)
      .forEach((repo) => {
        const card = document.createElement('a');
        card.className = 'repo-card';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener';

        const title = document.createElement('h4');
        title.textContent = repo.name;

        const desc = document.createElement('p');
        desc.textContent = repo.description || 'No description provided.';

        const meta = document.createElement('div');
        meta.className = 'repo-meta';
        meta.innerHTML = `
          <span>${repo.language || '—'}</span>
          <span>★ ${repo.stargazers_count}</span>
        `;

        card.append(title, desc, meta);
        repoContainer.appendChild(card);
      });
  } catch (err) {
    repoStatus.textContent = 'GitHub repositories could not be loaded right now — view the profile directly below.';
  }
}

loadRepos();
