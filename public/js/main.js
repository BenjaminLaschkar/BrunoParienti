// =======================
// DOM Ready
// =======================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initLanguageMenu();
  initSmoothScroll();
  initHeaderScroll();
  initGalleryFilters();
  initLightbox();
  initMobileCarousel();
  initCookieBanner();
  initContactForm();
});

// =======================
// Theme Toggle (Dark/Light Mode)
// =======================
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem("theme") || "light";
  html.classList.add(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      if (html.classList.contains("dark")) {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
}

// =======================
// Mobile Menu Toggle
// =======================
function initMobileMenu() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

// =======================
// Language Menu Toggle
// =======================
function initLanguageMenu() {
  const langToggle = document.getElementById("lang-toggle");
  const langMenu = document.getElementById("lang-menu");

  if (langToggle && langMenu) {
    // Toggle menu on button click
    langToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
        langMenu.classList.add("hidden");
      }
    });

    // Close menu when clicking a language option
    const langLinks = langMenu.querySelectorAll("a");
    langLinks.forEach((link) => {
      link.addEventListener("click", () => {
        langMenu.classList.add("hidden");
      });
    });
  }
}

// =======================
// Smooth Scroll for Anchor Links
// =======================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href === "#" || !href) return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const headerHeight =
          document.getElementById("header")?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// =======================
// Header Scroll Effect
// =======================
function initHeaderScroll() {
  const header = document.getElementById("header");
  let lastScroll = 0;

  if (!header) return;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
}

// =======================
// Gallery Filters
// =======================
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll(".gallery-filter");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter gallery items
      galleryItems.forEach((item) => {
        const category = item.dataset.category;

        if (filter === "all" || category === filter) {
          item.style.display = "block";
          // Fade in animation
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 10);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// =======================
// Lightbox Gallery
// =======================
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (!lightbox || !lightboxImage || !galleryItems.length) return;

  let currentPhotoIndex = 0;
  let currentFilter = "all";
  const photosData = window.photosData || [];

  // Get filtered photos
  function getFilteredPhotos() {
    if (currentFilter === "all") {
      return photosData;
    }
    return photosData.filter((photo) => photo.category === currentFilter);
  }

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const photoId = parseInt(item.dataset.photoId);
      const filteredPhotos = getFilteredPhotos();

      // Update current filter based on active filter button
      const activeFilter = document.querySelector(".gallery-filter.active");
      if (activeFilter) {
        currentFilter = activeFilter.dataset.filter;
      }

      // Find index in filtered photos
      currentPhotoIndex = filteredPhotos.findIndex(
        (photo) => photo.id === photoId
      );

      if (currentPhotoIndex !== -1) {
        showPhoto(currentPhotoIndex);
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigate photos
  function showPhoto(index) {
    const filteredPhotos = getFilteredPhotos();
    if (index < 0) index = filteredPhotos.length - 1;
    if (index >= filteredPhotos.length) index = 0;

    currentPhotoIndex = index;
    const photo = filteredPhotos[index];

    if (photo) {
      lightboxImage.src = photo.url;
      lightboxImage.alt = photo.alt;
    }
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      showPhoto(currentPhotoIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      showPhoto(currentPhotoIndex + 1);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPhoto(currentPhotoIndex - 1);
      } else if (e.key === "ArrowRight") {
        showPhoto(currentPhotoIndex + 1);
      }
    }
  });
}

// =======================
// Cookie Banner
// =======================
function initCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieAccept = document.getElementById("cookie-accept");
  const cookieDecline = document.getElementById("cookie-decline");

  if (!cookieBanner) return;

  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem("cookieConsent");

  if (!cookieConsent) {
    // Show banner after a short delay
    setTimeout(() => {
      cookieBanner.classList.remove("translate-y-full");
    }, 1000);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      cookieBanner.classList.add("translate-y-full");
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      cookieBanner.classList.add("translate-y-full");
    });
  }
}

// =======================
// Contact Form
// =======================
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Get submit button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    try {
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = submitButton.dataset.sending || "Sending...";

      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      showFormMessage("success", "Message sent successfully!");
      contactForm.reset();

      // In production, you would send the data to your server:
      /*
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        showFormMessage('success', 'Message sent successfully!');
        contactForm.reset();
      } else {
        throw new Error('Failed to send message');
      }
      */
    } catch (error) {
      console.error("Error:", error);
      showFormMessage("error", "Error sending message. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

  function showFormMessage(type, message) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `p-4 rounded-lg text-center ${
      type === "success"
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }`;
    formMessage.classList.remove("hidden");

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.classList.add("hidden");
    }, 5000);
  }
}

// =======================
// Mobile Carousel for Gallery
// =======================
function initMobileCarousel() {
  const carousel = document.getElementById("mobile-carousel");
  if (!carousel) return;

  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  let currentIndex = 0;
  let filteredSlides = [...slides];
  let touchStartX = 0;
  let touchEndX = 0;

  // Create dots based on filtered slides
  function createDots() {
    dotsContainer.innerHTML = "";
    filteredSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `w-2 h-2 rounded-full transition-all ${
        index === currentIndex ? "bg-accent w-8" : "bg-gray-400"
      }`;
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Update carousel position
  function updateCarousel() {
    const offset = -currentIndex * 100;
    
    // Hide all slides first
    slides.forEach(slide => {
      slide.style.display = "none";
    });
    
    // Show only filtered slides
    filteredSlides.forEach((slide, index) => {
      slide.style.display = "block";
      slide.style.order = index;
    });
    
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  // Update dots
  function updateDots() {
    const dots = dotsContainer.querySelectorAll("button");
    dots.forEach((dot, index) => {
      dot.className = `w-2 h-2 rounded-full transition-all ${
        index === currentIndex ? "bg-accent w-8" : "bg-gray-400"
      }`;
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, filteredSlides.length - 1));
    updateCarousel();
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < filteredSlides.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Touch events for swipe
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextSlide(); // Swipe left
    }
    if (touchEndX > touchStartX + 50) {
      prevSlide(); // Swipe right
    }
  }

  // Button events
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (carousel.classList.contains("md:hidden")) {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    }
  });

  // Filter integration
  const filterButtons = document.querySelectorAll(".gallery-filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      
      if (filter === "all") {
        filteredSlides = [...slides];
      } else {
        filteredSlides = slides.filter(
          (slide) => slide.dataset.category === filter
        );
      }
      
      currentIndex = 0;
      createDots();
      updateCarousel();
    });
  });

  // Click on slide to open lightbox
  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const photoId = slide.dataset.photoId;
      if (photoId) {
        // Trigger click on corresponding desktop gallery item to use existing lightbox logic
        const desktopItem = document.querySelector(`#gallery-grid .gallery-item[data-photo-id="${photoId}"]`);
        if (desktopItem) {
          desktopItem.click();
        }
      }
    });
  });

  // Initialize
  createDots();
  updateCarousel();
}

// Helper function to open lightbox (already exists but making sure it's accessible)
function openLightbox(imageSrc) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  
  if (lightbox && lightboxImage) {
    lightboxImage.src = imageSrc;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
  }
}

// =======================
// Lazy Load Images (Optional Enhancement)
// =======================
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// =======================
// Performance: Reduce animations on slow devices
// =======================
if (matchMedia("(prefers-reduced-motion)").matches) {
  document.documentElement.style.scrollBehavior = "auto";
}
