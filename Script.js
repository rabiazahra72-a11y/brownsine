/* =========================================================
   Fiqh-e-Jafariya Website — Main JavaScript
   Handles: mobile nav, FAQ accordion, smooth scroll,
   active-link highlighting, header scroll effect,
   scroll-reveal animation, back-to-top button.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------
     1. MOBILE MENU TOGGLE
  --------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close menu when a nav link is clicked (mobile)
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });

    // Close menu if user clicks/taps outside of it
    document.addEventListener("click", (e) => {
      const clickedInsideNav = mainNav.contains(e.target);
      const clickedToggle = menuToggle.contains(e.target);
      if (!clickedInsideNav && !clickedToggle) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
  }

  /* ---------------------------------------------------
     2. FAQ ACCORDION (Core Beliefs section)
  --------------------------------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    const plus = item.querySelector(".plus");

    // Prepare answer for smooth height animation
    answer.style.maxHeight = "0px";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.35s ease, padding 0.35s ease";

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other items (single-open accordion behaviour)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = "0px";
          other.querySelector(".plus").textContent = "+";
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = "0px";
        plus.textContent = "+";
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        plus.textContent = "−";
      }
    });
  });

  /* ---------------------------------------------------
     3. SMOOTH SCROLL FOR ANCHOR LINKS
     (accounts for the fixed header height)
  --------------------------------------------------- */
  const headerEl = document.querySelector(".site-header");

  function getHeaderOffset() {
    return headerEl ? headerEl.offsetHeight : 0;
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");

      // Plain "#" (e.g. Back to Top) scrolls to the very top
      if (targetId === "#" || targetId === "") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          getHeaderOffset() -
          10;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  /* ---------------------------------------------------
     4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
  --------------------------------------------------- */
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function highlightActiveLink() {
    const scrollPos = window.pageYOffset + getHeaderOffset() + 40;

    let currentSection = null;
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section;
      }
    });

    navLinks.forEach(link => {
      link.style.color = "";
      const href = link.getAttribute("href");
      if (currentSection && href === "#" + currentSection.id) {
        link.style.color = "#d4af37";
      }
    });
  }

  window.addEventListener("scroll", highlightActiveLink);
  highlightActiveLink();

  /* ---------------------------------------------------
     5. HEADER SHADOW / STYLE ON SCROLL
  --------------------------------------------------- */
  function updateHeaderOnScroll() {
    if (!headerEl) return;
    if (window.scrollY > 20) {
      headerEl.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
    } else {
      headerEl.style.boxShadow = "none";
    }
  }

  window.addEventListener("scroll", updateHeaderOnScroll);
  updateHeaderOnScroll();

  /* ---------------------------------------------------
     6. SCROLL-REVEAL FADE-IN FOR CARDS & SECTIONS
     (Styles are set inline by JS itself — no CSS edits needed)
  --------------------------------------------------- */
  const revealSelectors = [
    ".pillar-card",
    ".imam-card",
    ".city-card",
    ".scholar-card",
    ".faq-item",
    ".ashura-card",
    ".ashura-content"
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(","));

  revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     7. "EXPLORE MORE" / "READ BIOGRAPHY" BUTTON HINT
     Currently placeholder buttons — gently scroll the
     user back to the top of that same card on click
     so the buttons feel responsive until real pages/
     content are linked in.
  --------------------------------------------------- */
  document.querySelectorAll(".city-content button, .scholar-content button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".city-card, .scholar-card");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });

});