"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const navigationLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const projectCards = Array.from(document.querySelectorAll("[data-project]"));
  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("open");
  }
  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("open", !isOpen);
    });
    navigation.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selected = button.dataset.filter || "all";
      filterButtons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(function (card) {
        const categories = (card.dataset.category || "").split(/\s+/);
        card.hidden = selected !== "all" && !categories.includes(selected);
      });
    });
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (element) { revealObserver.observe(element); });

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach(function (link) {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (element) { element.classList.add("revealed"); });
  }
});

/* Pointer depth on featured work: disabled for touch and reduced-motion users. */
document.addEventListener("DOMContentLoaded", function () {
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reducedMotion || !finePointer) return;

  document.querySelectorAll(".project-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 2.2;
      const rotateX = (0.5 - y) * 2.2;
      card.style.transform = "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-4px)";
    });
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  });
});
