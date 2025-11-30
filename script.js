const chatMessages = document.getElementById('chat-messages');
const userInput     = document.getElementById('user-input');
const sendButton    = document.getElementById('send-button');

// Append message bubble
function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message');
    msg.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    userInput.value = "";
    sendButton.disabled = true;

    const typing = appendMessage("Tunggu dulu ... 😭🔥 AI lagi mikir...", "ai");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        typing.remove();
        appendMessage(data.reply || "Aku bingung banget sumpah 😭✨", "ai");

    } catch (err) {
        typing.textContent = "[ERROR] Tidak bisa terhubung ke server 😭";
        console.error(err);
    }

    sendButton.disabled = false;
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

const slider = document.getElementById('project-slider');
const dotsContainer = document.getElementById('slider-nav-dots');
const cards = document.querySelectorAll('.project-card');

let currentSlide = 0;

function createDots() {
    dotsContainer.innerHTML = "";
    cards.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("slider-dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => moveToSlide(i));
        dotsContainer.appendChild(dot);
    });
}

function updateDots(i) {
    document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === i);
    });
}

function moveToSlide(i) {
    currentSlide = i;
    slider.style.transform = `translateX(${-i * 100}%)`;
    updateDots(i);
}

setInterval(() => moveToSlide((currentSlide + 1) % cards.length), 5000);
createDots();

const modal = document.getElementById("contactModal");
const modalTitle = document.getElementById("modal-title");
const modalDetails = document.getElementById("modal-content-details");

function openContactModal(type) {
    let title = "";
    let content = "";

    if (type === "email") {
        title = "Contact via Email";
        content = `
            <p>Email Profesional:</p>
            <a href="mailto:DerrNotDev@gmail.com">
                <i class="fas fa-envelope"></i> DerrNotDev@gmail.com
            </a>
        `;
    }

    if (type === "whatsapp") {
        title = "Contact via WhatsApp";
        content = `
            <p>Kirim pesan otomatis:</p>
            <a href="https://wa.me/6281617434605?text=hallo%20derr">
                <i class="fab fa-whatsapp"></i> 6281617434605
            </a>
        `;
    }

    if (type === "linkedin") {
        title = "Social Media Connection";
        content = `
            <p>LinkedIn (Belum diisi):</p>
            <a href="#" target="_blank">
                <i class="fab fa-linkedin"></i> Link Not Set
            </a>
        `;
    }

    if (type === "qris_info") {
        title = "Alternative Payment";
        content = `
            <p>Dana / GoPay:</p>
            <a><i class="fas fa-wallet"></i> 081617434605</a>
        `;
    }

    modalTitle.textContent = title;
    modalDetails.innerHTML = content;
    modal.style.display = "block";
}

function closeContactModal() {
    modal.style.display = "none";
}

window.onclick = (e) => {
    if (e.target === modal) closeContactModal();
};

const music = document.getElementById("bg-music");
const musicBtn = document.querySelector(".music-control");

function toggleMusic() {
    if (music.paused) {
        music.muted = false;
        music.play();
        musicBtn.textContent = "⏸ Pause";
    } else {
        music.pause();
        musicBtn.textContent = "▶ Play";
    }
}

const canvas = document.getElementById("particles");
const ctx    = canvas.getContext("2d");

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let hue = 0;

class Particle {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = `hsl(${hue}, 100%, 60%)`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        this.color = `hsl(${hue}, 100%, 60%)`;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 120; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 1.5;
        const speedY = (Math.random() - 0.5) * 1.5;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.2)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hue += 0.5;

    particlesArray.forEach((p) => {
        p.update();
        p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

function createStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top  = Math.random() * 100 + "px";

    const size = Math.random() * 2 + 1;
    star.style.width  = size + "px";
    star.style.height = size * 40 + "px";

    document.body.appendChild(star);

    setTimeout(() => star.remove(), 2000);
}

setInterval(() => {
    for (let i = 0; i < 3; i++) {
        setTimeout(createStar, i * 300);
    }
}, 1500);
