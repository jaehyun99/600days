(() => {
  const app = document.getElementById("app");

  if (!app || typeof siteContent === "undefined") {
    return;
  }

  document.title = siteContent.pageTitle || "우리의 600일";

  const nl2br = (value = "") =>
    String(value)
      .split("\n")
      .map((line) => escapeHtml(line))
      .join("<br>");

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function imageMarkup(src, alt, className) {
    return `
      <img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />
      <div class="image-fallback">
        사진을 찾을 수 없습니다.<br />
        content.js의 파일명과 images 폴더를 확인해주세요.
      </div>
    `;
  }

  function buildHero() {
    const h = siteContent.hero;

    return `
      <section class="hero">
        ${imageMarkup(h.image, "우리의 대표 사진", "hero-image")}
        <div class="hero-content reveal">
          <div class="hero-kicker">${escapeHtml(h.kicker)}</div>
          <h1 class="hero-title">${nl2br(h.title)}</h1>
          <p class="hero-subtitle">${nl2br(h.subtitle)}</p>
          <div class="scroll-hint">SCROLL</div>
        </div>
      </section>
    `;
  }

  function buildIntro() {
    const intro = siteContent.intro;

    return `
      <section class="intro reveal">
        <div class="section-kicker">${escapeHtml(intro.kicker)}</div>
        <h2 class="intro-title">${nl2br(intro.title)}</h2>
        <p class="intro-body">${nl2br(intro.body)}</p>
      </section>
    `;
  }

  function buildPhoto(photo, index) {
    const number = String(index + 1).padStart(2, "0");

    return `
      <section class="photo">
        ${imageMarkup(photo.file, `우리의 추억 사진 ${index + 1}`, "photo-image")}
        <div class="photo-text reveal">
          <span class="photo-number">${number}</span>
          <p class="photo-caption">${nl2br(photo.caption)}</p>
        </div>
      </section>
    `;
  }

  function buildNumberSection() {
    const section = siteContent.numberSection;

    return `
      <section class="number-section reveal">
        <p>${nl2br(section.before)}</p>
        <div class="big-number">${escapeHtml(section.number)}</div>
        <p>${nl2br(section.after)}</p>
      </section>
    `;
  }

  function buildLetter() {
    const intro = siteContent.letterIntro;
    const letter = siteContent.letter;

    return `
      <section class="letter-intro reveal">
        <div class="letter-intro-small">${escapeHtml(intro.small)}</div>
        <h2 class="letter-intro-title">${nl2br(intro.title)}</h2>
      </section>
      <section class="letter-area">
        <article class="letter reveal">
          <div class="letter-to">${escapeHtml(letter.to)}</div>
          <div class="letter-body">${escapeHtml(letter.body)}</div>
          <div class="letter-from">${escapeHtml(letter.from)}</div>
        </article>
      </section>
    `;
  }

  function buildEnding() {
    const ending = siteContent.ending;

    return `
      <section class="ending reveal">
        <div class="heart">♥</div>
        <div class="ending-kicker">${escapeHtml(ending.kicker)}</div>
        <h2 class="ending-title">${escapeHtml(ending.title)}</h2>
        <p class="ending-message">${nl2br(ending.message)}</p>
      </section>
    `;
  }

  function render() {
    let html = "";
    html += buildHero();
    html += buildIntro();

    const insertAfter = Number(siteContent.numberSection.insertAfterPhotoIndex ?? 2);

    siteContent.photos.forEach((photo, index) => {
      html += buildPhoto(photo, index);
      if (index === insertAfter) {
        html += buildNumberSection();
      }
    });

    if (insertAfter < 0 || insertAfter >= siteContent.photos.length) {
      html += buildNumberSection();
    }

    html += buildLetter();
    html += buildEnding();
    app.innerHTML = html;
  }

  function setupImageFallbacks() {
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        img.parentElement?.classList.add("image-missing");
      });
    });
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add("show");
      }, 180);
    }
  }

  function setupPhotoZoom() {
    const photos = document.querySelectorAll(".photo");

    if (!("IntersectionObserver" in window)) {
      photos.forEach((photo) => photo.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.32 });

    photos.forEach((photo) => observer.observe(photo));
  }

  render();
  setupImageFallbacks();
  setupRevealAnimations();
  setupPhotoZoom();
})();
