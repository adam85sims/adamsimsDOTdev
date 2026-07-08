// Sentinel Docs — Navigation & Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const toggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Active nav link based on current page
    const path = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href')?.replace(/\/$/, '');
        if (href === path || path.endsWith(href)) {
            link.classList.add('active');
        }
    });

    // Copy code buttons
    document.querySelectorAll('pre').forEach(pre => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code')?.textContent || pre.textContent;
            await navigator.clipboard.writeText(code);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 2000);
        });
        pre.appendChild(btn);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
