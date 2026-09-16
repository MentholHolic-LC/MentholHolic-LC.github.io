/* Plain browser JavaScript: works with file:// and Jekyll, without modules or fetch. */
(() => {
  const profile = window.portfolioProfile;
  const projects = window.portfolioProjects;
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-header nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "关闭 −" : "菜单 +";
  };
  menu.addEventListener("click", () =>
    setMenu(menu.getAttribute("aria-expanded") !== "true"),
  );
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setMenu(false)));
  const cards = [...document.querySelectorAll(".project-card")];
  const filters = [...document.querySelectorAll(".filters button")];
  filters.forEach((button, index) =>
    button.addEventListener("click", () => {
      const category = ["全部项目", "安全工程", "安全研究"][index];
      filters.forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      cards.forEach((card, i) => {
        card.hidden = index !== 0 && projects[i].type !== category;
        card.classList.toggle("featured", index === 0 && i === 0);
      });
    }),
  );
  const dialog = document.querySelector(".project-dialog");
  let opener;
  dialog.insertAdjacentHTML(
    "beforeend",
    '<div class="dialog-copy"><div class="eyebrow"></div><h2 id="dialog-title"></h2><p class="detail-text"></p><div class="tags"></div><p class="dialog-note">本项目为首版布局示例，尚未关联真实作品。</p></div>',
  );
  cards.forEach((card, i) =>
    card.addEventListener("click", () => {
      opener = card;
      const project = projects[i];
      dialog.querySelector(".project-art")?.remove();
      dialog.insertBefore(
        card.querySelector(".project-art").cloneNode(true),
        dialog.querySelector(".dialog-copy"),
      );
      dialog.querySelector(".eyebrow").textContent =
        `${project.name} / 概念项目`;
      dialog.querySelector("h2").textContent = project.title;
      dialog.querySelector(".detail-text").textContent = project.details;
      const tags = dialog.querySelector(".tags");
      tags.replaceChildren();
      project.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        tags.append(span);
      });
      dialog.showModal();
    }),
  );
  const close = () => dialog.close();
  dialog.querySelector(".dialog-close").addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("close", () => opener?.focus());
  const toast = document.querySelector(".toast");
  let timer;
  const notify = (message) => {
    clearTimeout(timer);
    toast.textContent = message;
    toast.classList.add("visible");
    timer = setTimeout(() => toast.classList.remove("visible"), 4500);
  };
  const contact = async () => {
    if (!profile.email) {
      notify("联系邮箱待补充，你可以先通过 GitHub 了解我。");
      return;
    }
    try {
      await navigator.clipboard.writeText(profile.email);
      notify("邮箱已复制，期待与你交流。");
    } catch {
      notify(`联系邮箱：${profile.email}`);
    }
  };
  document
    .querySelectorAll(
      ".about-links button, .contact-button, .contact-links button",
    )
    .forEach((button) => button.addEventListener("click", contact));
  if (profile.email)
    document.querySelector(".contact-links button").textContent =
      `${profile.email} ↗`;
  document
    .querySelectorAll('a[href^="https://github.com/"]')
    .forEach((a) => (a.href = profile.github));
  const video = document.querySelector(".hero-video");
  const motion = document.querySelector(".motion-toggle");
  const hero = document.querySelector(".hero");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const reflectMotion = (playing) => {
    hero.classList.toggle("motion-paused", !playing);
    motion.setAttribute(
      "aria-label",
      playing ? "暂停背景动画" : "播放背景动画",
    );
    motion.innerHTML = `${playing ? "Ⅱ" : "▷"} <span>MOTION ${playing ? "ON" : "OFF"}</span>`;
  };
  const setMotion = async (playing) => {
    if (!playing) {
      video.pause();
      reflectMotion(false);
      return;
    }
    try {
      await video.play();
      reflectMotion(true);
    } catch {
      reflectMotion(false);
    }
  };
  video.addEventListener("error", () => reflectMotion(false));
  video.addEventListener("pause", () => reflectMotion(false));
  video.addEventListener("play", () => reflectMotion(true));
  motion.addEventListener("click", () => setMotion(video.paused));
  preference.addEventListener("change", (event) => setMotion(!event.matches));
  setMotion(!preference.matches);
})();
