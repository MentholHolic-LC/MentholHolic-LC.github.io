/* Edge proximity and cursor angle adapted from the supplied React Bits BorderGlow. */
(() => {
  const header = document.querySelector(".header");
  const syncHeader = () =>
    header?.classList.toggle("is-scrolled", scrollY > 25);
  addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  document
    .querySelectorAll(".chapter-card,.post-card,.profile-card,.now-card")
    .forEach((card) => {
      card.classList.add("glow-card");
      const light = document.createElement("span");
      light.className = "edge-light";
      light.setAttribute("aria-hidden", "true");
      card.append(light);
      let frame = 0,
        x = 0,
        y = 0;
      function update() {
        frame = 0;
        const rect = card.getBoundingClientRect();
        const px = x - rect.left,
          py = y - rect.top,
          cx = rect.width / 2,
          cy = rect.height / 2;
        const edge = Math.min(
          1,
          Math.max(
            Math.abs(px - cx) / Math.max(cx, 1),
            Math.abs(py - cy) / Math.max(cy, 1),
          ),
        );
        const angle =
          ((Math.atan2(py - cy, px - cx) * 180) / Math.PI + 450) % 360;
        card.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
        card.style.setProperty("--cursor-angle", angle.toFixed(2) + "deg");
        card.style.setProperty(
          "--glow-alpha",
          Math.max(0, (edge - 0.3) / 0.7).toFixed(3),
        );
        card.style.setProperty("--pointer-x", px.toFixed(1) + "px");
        card.style.setProperty("--pointer-y", py.toFixed(1) + "px");
      }
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch" || reduced.matches) return;
        x = event.clientX;
        y = event.clientY;
        if (!frame) frame = requestAnimationFrame(update);
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
        frame = 0;
        card.style.setProperty("--glow-alpha", "0");
        card.style.setProperty("--edge-proximity", "0");
      });
    });
})();
