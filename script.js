const canvas = document.querySelector("#voidCanvas");
const ctx = canvas.getContext("2d");
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".main-nav a");
const revealItems = document.querySelectorAll(".reveal");

let pixels = [];

// Cria pequenos pontos quadrados para dar sensacao de tela de jogo.
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const total = window.innerWidth < 700 ? 36 : 68;
  pixels = Array.from({ length: total }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() > 0.82 ? 4 : 2,
    speed: Math.random() * 0.28 + 0.12,
    color: Math.random() > 0.82 ? "#b9102c" : "#f7f7f7",
    alpha: Math.random() * 0.45 + 0.18,
  }));
}

// Anima os pixels de fundo de forma leve, sem atrapalhar a leitura.
function animatePixels() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pixels.forEach((pixel) => {
    pixel.y += pixel.speed;

    if (pixel.y > window.innerHeight + 8) {
      pixel.y = -8;
      pixel.x = Math.random() * window.innerWidth;
    }

    ctx.globalAlpha = pixel.alpha;
    ctx.fillStyle = pixel.color;
    ctx.fillRect(Math.round(pixel.x), Math.round(pixel.y), pixel.size, pixel.size);
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animatePixels);
}

// Marca automaticamente o link da pagina atual no menu.
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    link.classList.toggle("active", linkPage === currentPage);
  });
}

// Revela conteudos conforme o usuario rola a pagina.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

menuButton.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animatePixels();
setActiveNavLink();
