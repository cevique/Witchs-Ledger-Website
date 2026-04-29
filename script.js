// ─── EMAILJS INIT ───

const YOUR_PUBLIC_KEY="QDQzQ39_i8oDjStom"
const YOUR_SERVICE_ID="service_83mh799"
const YOUR_TEMPLATE_ID="template_5ee9mgr"

emailjs.init(YOUR_PUBLIC_KEY);

// ─── THEME ───
const THEMES = ['system', 'light', 'dark'];
const ICONS = { system: '◐', light: '☀', dark: '☾' };
let currentTheme = localStorage.getItem('umineko-theme') || 'system';

function applyTheme(t) {
    const html = document.documentElement;
    html.setAttribute('data-theme', t);
    html.classList.remove('dark-mode');
    if (t === 'dark') html.classList.add('dark-mode');
    document.getElementById('themeIcon').textContent = ICONS[t];
    localStorage.setItem('umineko-theme', t);
    currentTheme = t;
}

function cycleTheme() {
    const idx = THEMES.indexOf(currentTheme);
    applyTheme(THEMES[(idx + 1) % THEMES.length]);
}

applyTheme(currentTheme);

// ─── ROUTING ───
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.getElementById('nav-' + name).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // re-trigger scroll animations
    setTimeout(observeCards, 100);
}

// ─── SCROLL ANIMATIONS ───
function observeCards() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.feature-card:not(.visible), .roadmap-item:not(.visible)').forEach(el => io.observe(el));
}

observeCards();

// ─── FLOATING PARTICLES ───
function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    const dur = 8 + Math.random() * 12;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = Math.random() * -dur + 's';
    p.style.width = p.style.height = (1.5 + Math.random() * 2.5) + 'px';
    p.style.opacity = 0;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur + 2) * 1000);
}

for (let i = 0; i < 12; i++) spawnParticle();
setInterval(spawnParticle, 3000);

// ─── TOAST ───
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.className = 'toast toast-' + type;
    t.innerHTML = (type === 'success' ? '✦ ' : '✗ ') + msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}

// ─── EMAILJS FORM ───
async function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Sending...';

    const params = {
        from_name: document.getElementById('from_name').value,
        from_email: document.getElementById('from_email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };

    try {
        await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, params);
        showToast('Message sent! The golden sorcerer received it.', 'success');
        document.getElementById('contactForm').reset();
    } catch (err) {
        console.error(err);
        showToast('Failed to send. Try GitHub Issues instead.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Send Message ✦';
    }
}
