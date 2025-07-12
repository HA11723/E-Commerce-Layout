// DOM Elements
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const productCards = document.querySelectorAll(".product-card");
const addToCartBtns = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector(".cart-count");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-menu a");

// Carousel functionality
let currentIndex = 0;
const cardWidth = 320; // card width + gap
const visibleCards = 3;
const totalCards = productCards.length;

// Initialize carousel
function initCarousel() {
  updateCarouselButtons();
  updateCarouselPosition();
}

// Update carousel position
function updateCarouselPosition() {
  const translateX = -currentIndex * cardWidth;
  carouselTrack.style.transform = `translateX(${translateX}px)`;
}

// Update carousel buttons state
function updateCarouselButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= totalCards - visibleCards;

  prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
  nextBtn.style.opacity =
    currentIndex >= totalCards - visibleCards ? "0.5" : "1";
}

// Next button click
nextBtn.addEventListener("click", () => {
  if (currentIndex < totalCards - visibleCards) {
    currentIndex++;
    updateCarouselPosition();
    updateCarouselButtons();
  }
});

// Previous button click
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarouselPosition();
    updateCarouselButtons();
  }
});

// Touch/swipe functionality for mobile
let startX = 0;
let currentX = 0;
let isDragging = false;

carouselTrack.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

carouselTrack.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  const diff = startX - currentX;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex < totalCards - visibleCards) {
      // Swipe left - next
      currentIndex++;
    } else if (diff < 0 && currentIndex > 0) {
      // Swipe right - previous
      currentIndex--;
    }
    updateCarouselPosition();
    updateCarouselButtons();
    isDragging = false;
  }
});

carouselTrack.addEventListener("touchend", () => {
  isDragging = false;
});

// Shopping cart functionality
let cartItems = 0;

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // Add animation to button
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 150);

    // Update cart count
    cartItems++;
    cartCount.textContent = cartItems;

    // Add animation to cart icon
    const cartIcon = document.querySelector(".nav-cart");
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);

    // Show success message
    showNotification("Item added to cart!");
  });
});

// Notification system
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(".product-card, .stat, .about-image, .contact-form")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Form submission
document.querySelector(".contact-form form").addEventListener("submit", (e) => {
  e.preventDefault();

  const submitBtn = e.target.querySelector(".submit-btn");
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    submitBtn.textContent = "Message Sent!";
    submitBtn.style.background = "#4CAF50";

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = "";
      e.target.reset();
    }, 2000);
  }, 1500);
});

// Newsletter subscription
document.querySelector(".newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;
  if (email) {
    showNotification("Thank you for subscribing!");
    e.target.reset();
  }
});

// Quick view functionality
document.querySelectorAll(".quick-view").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const productCard = btn.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;

    showNotification(`Quick view: ${productName}`);
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  if (hero && heroContent) {
    const rate = scrolled * -0.5;
    heroContent.style.transform = `translateY(${rate}px)`;
  }
});

// Magnetic cursor effect
const magneticCursor = document.querySelector(".magnetic-cursor");

document.addEventListener("mousemove", (e) => {
  if (magneticCursor) {
    magneticCursor.style.left = e.clientX + "px";
    magneticCursor.style.top = e.clientY + "px";
    magneticCursor.classList.add("active");
  }

  // Enhanced mouse move effect for floating cards
  const cards = document.querySelectorAll(".floating-card");
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - cardCenterX;
    const distanceY = e.clientY - cardCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 200) {
      const strength = (200 - distance) / 200;
      const offsetX = distanceX * strength * 0.1;
      const offsetY = distanceY * strength * 0.1;

      card.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${
        1 + strength * 0.05
      })`;
    } else {
      card.style.transform = "translate(0, 0) scale(1)";
    }
  });
});

document.addEventListener("mouseleave", () => {
  if (magneticCursor) {
    magneticCursor.classList.remove("active");
  }

  // Reset card positions
  const cards = document.querySelectorAll(".floating-card");
  cards.forEach((card) => {
    card.style.transform = "translate(0, 0) scale(1)";
  });
});

// Auto-rotate carousel (optional)
let autoRotateInterval;

function startAutoRotate() {
  autoRotateInterval = setInterval(() => {
    if (currentIndex < totalCards - visibleCards) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarouselPosition();
    updateCarouselButtons();
  }, 5000); // Change slide every 5 seconds
}

function stopAutoRotate() {
  clearInterval(autoRotateInterval);
}

// Start auto-rotate when user is not interacting
let userInteractionTimeout;
carouselTrack.addEventListener("mouseenter", stopAutoRotate);
carouselTrack.addEventListener("mouseleave", () => {
  userInteractionTimeout = setTimeout(startAutoRotate, 2000);
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  startAutoRotate();

  // Add loading animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Keyboard navigation for carousel
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevBtn.click();
  } else if (e.key === "ArrowRight") {
    nextBtn.click();
  }
});

// Add hover effects for product cards
productCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform =
      "perspective(1000px) rotateY(5deg) translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateY(0deg) translateY(0) scale(1)";
  });
});

// Add ripple effect to buttons
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll("button").forEach((button) => {
  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.addEventListener("click", createRipple);
});

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
