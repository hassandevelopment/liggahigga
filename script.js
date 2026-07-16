/* The RULEBOOK - page flips, swipe/click/keyboard navigation, poem audio */
"use strict";

(() => {
  const book = document.getElementById("book");
  const hint = document.getElementById("hint");
  const pages = Array.from(book.querySelectorAll(".page"));
  const N = pages.length;
  const FLIP_MS = 700;

  let current = 0; // index of the topmost unflipped page

  pages.forEach((p, i) => { p.style.zIndex = String(N - i); });

  /* -- Page turning -------------------------------------- */

  function settle(page, index) {
    clearTimeout(page._settle);
    page._settle = setTimeout(() => {
      page.classList.remove("turning");
      page.style.zIndex = String(page.classList.contains("flipped") ? index + 1 : N - index);
    }, FLIP_MS);
  }

  function next() {
    if (current >= N - 1) return;
    const page = pages[current];
    page.classList.remove("peek");
    page.style.zIndex = String(N + 1);
    page.classList.add("flipped", "turning");
    settle(page, current);
    current++;
    onNavigate();
  }

  function prev() {
    if (current <= 0) return;
    current--;
    const page = pages[current];
    page.style.zIndex = String(N + 1);
    page.classList.remove("flipped");
    page.classList.add("turning");
    settle(page, current);
    onNavigate();
  }

  function onNavigate() {
    hint.classList.add("gone");
    // leaving the poem page pauses the recording
    if (!audio.paused && current !== poemIndex) audio.pause();
  }

  /* -- Desktop: click halves + arrow keys ---------------- */

  book.addEventListener("click", (e) => {
    if (e.target.closest(".no-flip, button, a, audio")) return;
    const rect = book.getBoundingClientRect();
    if (e.clientX - rect.left > rect.width / 2) next();
    else prev();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });

  /* -- Mobile: swipe (50px threshold, horizontal only) --- */

  const SWIPE_MIN = 50;
  let touchX = 0, touchY = 0, touchOnControl = false;

  book.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    touchX = t.clientX;
    touchY = t.clientY;
    touchOnControl = !!e.target.closest(".no-flip, button, a, audio");
  }, { passive: true });

  book.addEventListener("touchend", (e) => {
    if (touchOnControl) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });

  /* -- Opening animation: cover peeks after the book lands -- */

  function schedulePeek() {
    setTimeout(() => {
      if (current !== 0) return;
      const cover = pages[0];
      cover.classList.add("peek");
      cover.addEventListener("animationend", () => cover.classList.remove("peek"), { once: true });
    }, 1400);
  }
  schedulePeek();

  /* -- Back cover: "Read it again" closes the book and replays the intro -- */

  document.getElementById("restart-btn").addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    resetSignature();
    book.classList.add("no-anim");
    pages.forEach((p, i) => {
      clearTimeout(p._settle);
      p.classList.remove("flipped", "turning", "peek");
      p.style.zIndex = String(N - i);
    });
    current = 0;
    void book.offsetWidth; // flush the un-flip before re-enabling transitions
    book.classList.remove("no-anim");
    book.style.animation = "none";
    void book.offsetWidth;
    book.style.animation = ""; // restarts the book-in entrance
    schedulePeek();
  });

  /* -- Poem audio ---------------------------------------- */

  const audio = document.getElementById("poem-audio");
  const audioBox = document.querySelector(".poem-audio");
  const playBtn = document.getElementById("play-btn");
  const audioFill = document.getElementById("audio-fill");
  const poemIndex = pages.indexOf(document.querySelector(".page--poem"));

  playBtn.addEventListener("click", () => {
    if (playBtn.classList.contains("is-error")) return;
    if (audio.paused) {
      // play() inside the tap handler satisfies iOS Safari's gesture requirement
      audio.play().catch(() => {
        playBtn.classList.add("is-error");
        playBtn.setAttribute("aria-label", "Recording coming soon");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    audioBox.classList.add("playing");
    playBtn.setAttribute("aria-label", "Pause the poem recording");
  });
  audio.addEventListener("pause", () => {
    audioBox.classList.remove("playing");
    playBtn.setAttribute("aria-label", "Play the poem recording");
  });
  audio.addEventListener("timeupdate", () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    audioFill.style.transform = `scaleX(${ratio})`;
  });
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audioFill.style.transform = "scaleX(0)";
  });

  /* -- Photo: show the placeholder until photo-1.jpg exists -- */

  const photo = document.getElementById("poem-photo");
  const frame = document.getElementById("photo-frame");
  photo.addEventListener("error", () => frame.classList.add("empty"));
  if (photo.complete && photo.naturalWidth === 0) frame.classList.add("empty");

  /* -- The final rule: Lina signs the contract (permanently) -- */

  const signBtn = document.getElementById("sign-btn");
  const signLabel = document.getElementById("sign-label");
  const sigStamp = document.getElementById("sig-stamp");

  sigStamp.addEventListener("error", () => sigStamp.remove());

  // no undo while reading; only "Read it again" (or a reload) clears it
  signBtn.addEventListener("click", () => {
    if (signBtn.classList.contains("is-signed")) return;
    signBtn.classList.add("is-signed");
    if (sigStamp.isConnected) sigStamp.hidden = false;
    signLabel.textContent = "Agreed ♥";
    signBtn.setAttribute("aria-label", "Signed by Lina. No takebacks.");
    celebrate();
    playYay();
  });

  /* celebration: confetti + hearts burst from the signature */

  function celebrate() {
    const host = document.querySelector(".final-inner");
    const colors = ["#b04a5a", "#c9a34a", "#e3c778", "#8c2f39", "#f0a8b4"];
    for (let i = 0; i < 42; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      const color = colors[i % colors.length];
      if (Math.random() < 0.3) {
        c.textContent = "♥";
        c.style.color = color;
        c.style.width = c.style.height = "auto";
      } else {
        c.style.background = color;
      }
      c.style.setProperty("--dx", (Math.random() * 320 - 160).toFixed(0) + "px");
      c.style.setProperty("--dy", -(90 + Math.random() * 300).toFixed(0) + "px");
      c.style.setProperty("--rot", (Math.random() * 900 - 450).toFixed(0) + "deg");
      c.style.setProperty("--dur", (0.9 + Math.random() * 0.9).toFixed(2) + "s");
      host.appendChild(c);
      c.addEventListener("animationend", () => c.remove());
    }
  }

  /* celebration sound: audio/yay.mp3 if present, else a synthesized ta-da */

  function playYay() {
    const yay = new Audio("audio/yay.mp3");
    yay.play().catch(synthFanfare);
  }

  function synthFanfare() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const t0 = ctx.currentTime;
      // rising major arpeggio: C5 E5 G5 C6, then a bright closing chord
      [[523.25, 0], [659.25, .09], [783.99, .18], [1046.5, .3]].forEach(([freq, at]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0 + at);
        gain.gain.exponentialRampToValueAtTime(0.22, t0 + at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0 + at);
        osc.stop(t0 + at + 0.55);
      });
      [523.25, 659.25, 783.99].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * 2;
        gain.gain.setValueAtTime(0.0001, t0 + 0.42);
        gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0 + 0.42);
        osc.stop(t0 + 1.25);
      });
    } catch (e) { /* no audio available; the confetti still parties */ }
  }

  function resetSignature() {
    signBtn.classList.remove("is-signed");
    if (sigStamp.isConnected) sigStamp.hidden = true;
    signLabel.textContent = "Lina, sign here";
    signBtn.setAttribute("aria-label", "Tap to sign the contract");
  }
})();
