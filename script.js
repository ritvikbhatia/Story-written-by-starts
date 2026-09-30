const body = document.body;
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Cover: open the book ---------- */
const cover = document.getElementById("cover");
document.getElementById("openBook").addEventListener("click", () => {
  cover.classList.add("open");
  setTimeout(() => {
    cover.classList.add("gone");
    body.classList.remove("locked");
    startTypewriter();
  }, 1800);
});

/* ---------- Prologue typewriter ---------- */
function startTypewriter() {
  const el = document.querySelector(".typewriter");
  const text = el.dataset.text;
  let i = 0;
  (function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(type, 60);
    }
  })();
}

/* ---------- Split subtitles into words ---------- */
document.querySelectorAll(".words").forEach((p) => {
  p.innerHTML = p.textContent
    .trim()
    .split(/\s+/)
    .map((w, i) => `<span class="w" style="transition-delay:${i * 0.07}s">${w}</span>`)
    .join(" ");
});

/* ---------- Scroll reveal ---------- */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains("words") ? "play" : "visible");
      if (e.target.classList.contains("decrypto")) decode(e.target.querySelector(".decode"));
      if (e.target.classList.contains("age-reveal")) countUp(e.target.querySelector(".age-num"));
      if (e.target.classList.contains("midnight")) strikeMidnight(e.target);
      if (e.target.classList.contains("chat-stream")) chatStream(e.target);
      if (e.target.classList.contains("secret")) setTimeout(() => (e.target.querySelector(".secret-lock").textContent = "🔓"), 2000);
      if (e.target.closest(".page")?.querySelector(".laughs") && e.target.classList.contains("frame")) laughBurst(e.target.closest(".page").querySelector(".laughs"));
      revealObs.unobserve(e.target);
    });
  },
  { threshold: 0.35 }
);
document.querySelectorAll(".reveal, .words").forEach((el) => revealObs.observe(el));

/* ---------- Living sky follows chapter ---------- */
const skyObs = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && (body.dataset.sky = e.target.dataset.sky)),
  { threshold: 0.4 }
);
document.querySelectorAll("[data-sky]:not(body)").forEach((s) => skyObs.observe(s));

/* ---------- Progress bar ---------- */
const bar = document.querySelector(".progress span");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = `${(scrollY / max) * 100}%`;
});

/* ---------- Rain ---------- */
const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");
let drops = [];
function sizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  drops = Array.from({ length: 160 }, () => ({
    x: rand(0, innerWidth), y: rand(0, innerHeight), l: rand(10, 22), v: rand(7, 13),
  }));
}
sizeCanvas();
addEventListener("resize", sizeCanvas);
(function rain() {
  if (body.dataset.sky === "rain") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const d of drops) {
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.l);
      d.y += d.v; d.x -= 0.6;
      if (d.y > canvas.height) { d.y = -20; d.x = rand(0, canvas.width); }
    }
    ctx.stroke();
  }
  requestAnimationFrame(rain);
})();

/* ---------- Petals ---------- */
const petals = document.querySelector(".petals");
setInterval(() => {
  if (body.dataset.sky === "rain") return;
  const p = document.createElement("span");
  p.className = "petal";
  p.style.left = `${rand(0, 100)}vw`;
  p.style.setProperty("--dx", `${rand(-150, 150)}px`);
  p.style.animationDuration = `${rand(8, 14)}s`;
  petals.appendChild(p);
  setTimeout(() => p.remove(), 15000);
}, 1000);

/* ---------- Decrypto decode ---------- */
function decode(el) {
  const final = el.dataset.final;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*";
  let frame = 0;
  const timer = setInterval(() => {
    const done = Math.floor(frame / 3);
    el.textContent = final
      .split("")
      .map((c, i) => (i < done || c === " " ? c : glyphs[Math.floor(rand(0, glyphs.length))]))
      .join("");
    if (done >= final.length) clearInterval(timer);
    frame++;
  }, 45);
}

/* ---------- Endless chats ---------- */
function chatStream(box) {
  const lines = [
    ["r", "good morning ☀️"], ["l", "gm!! 🥱"], ["r", "reached office?"], ["l", "yes 😤"],
    ["r", "how's the call center? 😂"], ["l", "shut up 🙄"], ["r", "kurkure momos tonight?"], ["l", "YESSS 🥟"],
    ["r", "what are you reading 👀"], ["l", "nothing!! 🙈"], ["r", "sleep now, it's 2am"], ["l", "5 more mins 🥺"],
  ];
  let i = 0;
  setInterval(() => {
    const [side, text] = lines[i++ % lines.length];
    const b = document.createElement("span");
    b.className = `cs-bubble ${side}`;
    b.textContent = text;
    box.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }, 900);
}

/* ---------- Midnight clock ticks to 00:00 ---------- */
function strikeMidnight(box) {
  setTimeout(() => {
    box.querySelector(".hh").textContent = "00";
    box.querySelector(".mm").textContent = "00";
  }, 2000);
}

/* ---------- Age count-up ---------- */
function countUp(el) {
  const target = +el.dataset.target;
  let n = 0;
  const t = setInterval(() => {
    el.textContent = ++n;
    if (n >= target) clearInterval(t);
  }, 350);
}

/* ---------- Floating laughs in the car ---------- */
function laughBurst(box) {
  const items = ["😂", "🤣", "haha", "😆", "💨", "hahaha"];
  let count = 0;
  const t = setInterval(() => {
    const s = document.createElement("span");
    s.className = "laugh";
    s.textContent = items[Math.floor(rand(0, items.length))];
    s.style.left = `${rand(5, 90)}%`;
    s.style.fontFamily = "var(--hand)";
    box.appendChild(s);
    setTimeout(() => s.remove(), 4000);
    if (++count > 18) clearInterval(t);
  }, 300);
}

/* ---------- Age guesses ---------- */
const replies = ["*mysterious smile* 🤐", "nice try 😌", "not telling you 🙈"];
const replyEl = document.querySelector(".guess-reply");
document.querySelectorAll(".guess").forEach((g, i) =>
  g.addEventListener("click", () => {
    g.classList.remove("nope");
    void g.offsetWidth;
    g.classList.add("nope");
    replyEl.textContent = replies[i];
  })
);

/* ---------- Flip cards ---------- */
document.querySelectorAll(".flip").forEach((c) => c.addEventListener("click", () => c.classList.toggle("open")));

/* ---------- Stars + lanterns ---------- */
const stars = document.querySelector(".stars");
for (let s = 0; s < 90; s++) {
  const el = document.createElement("span");
  el.className = "star";
  el.style.left = `${rand(0, 100)}%`;
  el.style.top = `${rand(0, 80)}%`;
  el.style.animationDelay = `${rand(0, 3)}s`;
  stars.appendChild(el);
}
const lanterns = document.querySelector(".lanterns");
for (let l = 0; l < 18; l++) {
  const el = document.createElement("span");
  el.className = "lantern";
  el.style.left = `${rand(2, 96)}%`;
  el.style.setProperty("--sway", `${rand(-80, 80)}px`);
  el.style.animationDuration = `${rand(14, 26)}s`;
  el.style.animationDelay = `${-rand(0, 26)}s`;
  el.style.transform = `scale(${rand(0.5, 1.2)})`;
  lanterns.appendChild(el);
}

/* ---------- Soot sprites that wander and flee the cursor ---------- */
const spriteBox = document.querySelector(".sprites");
const sprites = Array.from({ length: 5 }, () => {
  const s = document.createElement("span");
  s.className = "sprite";
  s.style.left = `${rand(5, 90)}vw`;
  s.style.animationDelay = `${rand(0, 0.7)}s`;
  spriteBox.appendChild(s);
  return s;
});
setInterval(() => {
  const s = sprites[Math.floor(rand(0, sprites.length))];
  s.style.left = `${rand(3, 94)}vw`;
}, 1400);
addEventListener("mousemove", (e) => {
  if (e.clientY < innerHeight - 80) return;
  sprites.forEach((s) => {
    const x = s.getBoundingClientRect().left;
    if (Math.abs(x - e.clientX) < 60) s.style.left = `${rand(3, 94)}vw`;
  });
});

/* ---------- Final heart burst ---------- */
document.getElementById("yes").addEventListener("click", (e) => {
  e.currentTarget.textContent = "Forever and always 💗";
  for (let h = 0; h < 50; h++) {
    const heart = document.createElement("span");
    heart.textContent = ["💗", "💕", "🌸", "✨", "🏮"][h % 5];
    Object.assign(heart.style, {
      position: "fixed", left: `${e.clientX}px`, top: `${e.clientY}px`,
      fontSize: `${rand(16, 36)}px`, pointerEvents: "none", zIndex: 60,
      transition: "transform 2s ease-out, opacity 2s ease-out",
    });
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      const a = rand(0, Math.PI * 2), d = rand(120, 360);
      heart.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
      heart.style.opacity = "0";
    });
    setTimeout(() => heart.remove(), 2100);
  }
});
