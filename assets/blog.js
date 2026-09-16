(() => {
  const search = document.querySelector(".search input");
  const cards = [...document.querySelectorAll(".post-list .post-card")];
  const buttons = [...document.querySelectorAll("[data-category]")].filter(
    (el) => el.tagName === "BUTTON",
  );
  let category = "all";
  function filter() {
    const query = (search?.value || "").trim().toLocaleLowerCase();
    cards.forEach((card) => {
      const categories = (card.dataset.category || "").split("|");
      card.hidden =
        (category !== "all" && !categories.includes(category)) ||
        !(card.dataset.search || "").toLocaleLowerCase().includes(query);
    });
    const empty = document.querySelector(".search-empty");
    if (empty) empty.hidden = cards.some((card) => !card.hidden);
  }
  search?.addEventListener("input", filter);
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      category = button.dataset.category;
      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      filter();
    }),
  );
  document.querySelectorAll("[data-tag]").forEach((button) =>
    button.addEventListener("click", () => {
      if (!search) return;
      category = "all";
      buttons.forEach((item) => {
        const active = item.dataset.category === "all";
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      search.value = button.dataset.tag;
      filter();
      search.focus({ preventScroll: true });
      document
        .querySelector("#journal")
        ?.scrollIntoView({ behavior: "smooth" });
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      search &&
      !event.ctrlKey &&
      !event.metaKey &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement.tagName,
      ) &&
      !document.activeElement.isContentEditable
    ) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      filter();
      search.blur();
    }
  });
  const toc = document.querySelector(".toc");
  document
    .querySelectorAll(".prose h2, .prose h3")
    .forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      if (toc) {
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        if (heading.tagName === "H3") link.className = "toc-sub";
        toc.append(link);
      }
    });
})();
