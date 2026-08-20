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

const openModal = (triggerEl) => {
  lastFocusedEl = triggerEl;
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
    openModal(el);
  });
  el.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && el.hasAttribute('data-project')) {
      e.preventDefault();
      openModal(el);
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
