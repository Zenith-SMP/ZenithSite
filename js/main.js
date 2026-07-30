document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Подсветка активной страницы в навигации
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(btn => {
    const page = btn.getAttribute('data-nav');
    if (
      (page === 'main' && (path === 'index.html' || path === '' || path === '/')) ||
      (page === 'rules' && path === 'rules.html') ||
      (page === 'mods' && path === 'forbidden-mods.html') ||
      (page === 'donate' && path === 'donate.html')
    ) {
      btn.classList.add('nav-btn-active');
      btn.classList.remove('nav-btn');
    }
  });
});

function copyIP() {
  const ip = 'mc.myserver.net';
  navigator.clipboard.writeText(ip).then(() => {
    const icon = document.getElementById('ip-icon');
    if (icon) {
      icon.setAttribute('data-lucide', 'check');
      lucide.createIcons();
      setTimeout(() => {
        icon.setAttribute('data-lucide', 'copy');
        lucide.createIcons();
      }, 2000);
    }
  });
}

function toggleAccordion(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById('icon-' + id);
  if (!content || !icon) return;

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.setAttribute('data-lucide', 'chevron-down');
  } else {
    content.classList.add('hidden');
    icon.setAttribute('data-lucide', 'chevron-right');
  }
  lucide.createIcons();
}

/**
 * Рендерит правила из rules.json в контейнер #rules-container
 */
async function loadRules() {
  const container = document.getElementById('rules-container');
  if (!container) return;

  try {
    const res = await fetch('rules.json');
    if (!res.ok) throw new Error('Не удалось загрузить rules.json');
    const data = await res.json();

    // Заголовок
    const header = document.getElementById('rules-header');
    if (header) {
      header.innerHTML = `
        <h2 class="text-2xl font-bold text-white tracking-tight">${data.title}</h2>
        <p class="text-xs text-neutral-400 mt-1">${data.subtitle}</p>
      `;
    }

    container.innerHTML = '';

    data.sections.forEach(section => {
      const isOpen = section.open === true;
      const iconName = isOpen ? 'chevron-down' : 'chevron-right';
      const hiddenClass = isOpen ? '' : 'hidden';

      const rulesHtml = section.rules
        .map(r => `<p><strong class="text-neutral-200">${r.id}.</strong> ${r.text}</p>`)
        .join('');

      const block = document.createElement('div');
      block.className = 'border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/20';
      block.innerHTML = `
        <button onclick="toggleAccordion('${section.id}')" class="w-full px-5 py-3.5 flex justify-between items-center text-left hover:bg-neutral-900/50 transition-colors">
          <span class="text-xs font-semibold text-white flex items-center gap-2">
            <span class="text-neutral-500 font-mono">${section.number}.</span> ${section.title}
          </span>
          <i id="icon-${section.id}" data-lucide="${iconName}" class="w-4 h-4 text-neutral-400"></i>
        </button>
        <div id="${section.id}" class="${hiddenClass} px-5 pb-4 text-xs text-neutral-400 space-y-2 border-t border-neutral-800/50 pt-3 leading-relaxed accordion-content">
          ${rulesHtml}
        </div>
      `;
      container.appendChild(block);
    });

    lucide.createIcons();
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-400 text-sm">Ошибка загрузки правил. Проверьте файл rules.json</p>`;
  }
}

// Автозагрузка правил на странице rules.html
if (document.getElementById('rules-container')) {
  loadRules();
}
