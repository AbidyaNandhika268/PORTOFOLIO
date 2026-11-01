const menuToggle = document.getElementById("menuToggle");
const slideNav = document.getElementById("slideNav");
const slides = Array.from(document.querySelectorAll(".slide"));
const navigationLinks = Array.from(
  document.querySelectorAll("[data-slide-link]")
);
const slideDots = Array.from(document.querySelectorAll("[data-slide-to]"));
const previousButton = document.getElementById("previousSlide");
const nextButton = document.getElementById("nextSlide");
const slideCount = document.getElementById("slideCount");

let activeSlide = Math.max(
  0,
  slides.findIndex((slide) => `#${slide.id}` === window.location.hash)
);

function closeMenu() {
  slideNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka navigasi");
}

function showSlide(index, updateHash = true) {
  activeSlide = Math.min(Math.max(index, 0), slides.length - 1);

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.hidden = !isActive;
    slide.classList.toggle("is-active", isActive);
    slide.classList.remove("is-entering");
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  void slides[activeSlide].offsetWidth;
  slides[activeSlide].classList.add("is-entering");

  navigationLinks.forEach((link, linkIndex) => {
    if (linkIndex === activeSlide) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  slideDots.forEach((dot, dotIndex) => {
    if (dotIndex === activeSlide) {
      dot.setAttribute("aria-current", "step");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  previousButton.disabled = activeSlide === 0;
  nextButton.disabled = activeSlide === slides.length - 1;
  slideCount.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

  if (updateHash) {
    window.history.replaceState(null, "", `#${slides[activeSlide].id}`);
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = slideNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Tutup navigasi" : "Buka navigasi"
  );
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSlide(Number(link.dataset.slideLink));
    closeMenu();
  });
});

slideDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slideTo));
  });
});

previousButton.addEventListener("click", () => {
  showSlide(activeSlide - 1);
});

nextButton.addEventListener("click", () => {
  showSlide(activeSlide + 1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    return;
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.key === "ArrowRight") {
    showSlide(activeSlide + 1);
  } else if (event.key === "ArrowLeft") {
    showSlide(activeSlide - 1);
  }
});

window.addEventListener("hashchange", () => {
  const slideIndex = slides.findIndex(
    (slide) => `#${slide.id}` === window.location.hash
  );

  if (slideIndex !== -1 && slideIndex !== activeSlide) {
    showSlide(slideIndex, false);
  }
});

showSlide(activeSlide, false);
