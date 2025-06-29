// ===== PERFORMANCE OPTIMIZATION =====
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById("loading-screen")
const mainContent = document.getElementById("main-content")
const themeToggle = document.getElementById("theme-toggle")
const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
const mobileMenu = document.getElementById("mobile-menu")
const header = document.getElementById("header")

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
  setTimeout(() => {
    loadingScreen.classList.add("fade-out")
    mainContent.classList.remove("hidden")

    // Remove loading screen from DOM after animation
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 600)
  }, 1000) // Reduced loading time for better UX
}

// ===== DARK MODE =====
function initDarkMode() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    enableDarkMode()
  }
}

function enableDarkMode() {
  document.body.classList.add("dark-mode")
  updateThemeIcon(true)
  localStorage.setItem("theme", "dark")
}

function disableDarkMode() {
  document.body.classList.remove("dark-mode")
  updateThemeIcon(false)
  localStorage.setItem("theme", "light")
}

function updateThemeIcon(isDark) {
  const icon = themeToggle.querySelector(".theme-icon")
  if (isDark) {
    icon.className = "fas fa-sun theme-icon"
  } else {
    icon.className = "fas fa-moon theme-icon"
  }

  // Add rotation animation
  icon.style.transform = "rotate(180deg)"
  setTimeout(() => {
    icon.style.transform = "rotate(0deg)"
  }, 150)
}

function toggleDarkMode() {
  if (document.body.classList.contains("dark-mode")) {
    disableDarkMode()
  } else {
    enableDarkMode()
  }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  mobileMenuToggle.classList.toggle("active")
  mobileMenu.classList.toggle("active")

  // Prevent body scroll when menu is open
  if (mobileMenu.classList.contains("active")) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }

  // Update ARIA attributes
  const isExpanded = mobileMenu.classList.contains("active")
  mobileMenuToggle.setAttribute("aria-expanded", isExpanded)
}

function closeMobileMenu() {
  mobileMenuToggle.classList.remove("active")
  mobileMenu.classList.remove("active")
  document.body.style.overflow = ""
  mobileMenuToggle.setAttribute("aria-expanded", "false")
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
  const scrollY = window.scrollY

  if (scrollY > 100) {
    header.style.background = document.body.classList.contains("dark-mode")
      ? "rgba(26, 26, 26, 0.98)"
      : "rgba(243, 89, 128, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.background = document.body.classList.contains("dark-mode")
      ? "rgba(26, 26, 26, 0.95)"
      : "rgba(243, 89, 128, 0.95)"
    header.style.boxShadow = "none"
  }
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        // Close mobile menu if open
        closeMobileMenu()
      }
    })
  })
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        entry.target.classList.add("animate-fade-in")
      }
    })
  }, observerOptions)

  // Observe elements that should animate on scroll
  document
    .querySelectorAll(".feature-card, .feature-item, .stat-item, .about-content, .footer-content > *")
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
}

// ===== PARALLAX EFFECT =====
function initParallax() {
  const sweetSection = document.querySelector(".sweet-section")
  const footerSection = document.querySelector(".footer")

  const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset
    const parallaxSpeed = 0.5

    if (sweetSection) {
      sweetSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`
    }
    if (footerSection) {
      footerSection.style.backgroundPositionY = `${scrolled * parallaxSpeed * 0.3}px`
    }
  }, 16)

  window.addEventListener("scroll", handleParallax)
}

// ===== FLOATING HEARTS ANIMATION =====
function createFloatingHeart() {
  const hearts = ["💕", "❤️", "💖", "💝", "💗", "💘"]
  const heart = document.createElement("div")
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
  heart.style.position = "fixed"
  heart.style.left = Math.random() * 100 + "vw"
  heart.style.top = "100vh"
  heart.style.fontSize = Math.random() * 1 + 1.5 + "rem"
  heart.style.pointerEvents = "none"
  heart.style.zIndex = "999"
  heart.style.animation = "floatUp 4s linear forwards"
  heart.style.userSelect = "none"

  document.body.appendChild(heart)

  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove()
    }
  }, 4000)
}

// Add CSS for floating hearts
const style = document.createElement("style")
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// ===== DROPDOWN FUNCTIONALITY =====
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")

    toggle.addEventListener("click", (e) => {
      e.stopPropagation()

      // Close other dropdowns
      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove("active")
          const otherToggle = otherDropdown.querySelector(".dropdown-toggle")
          otherToggle.setAttribute("aria-expanded", "false")
        }
      })

      // Toggle current dropdown
      const isActive = dropdown.classList.toggle("active")
      toggle.setAttribute("aria-expanded", isActive)
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.classList.remove("active")
      toggle.setAttribute("aria-expanded", "false")
    })

    // Prevent dropdown from closing when clicking inside
    menu.addEventListener("click", (e) => {
      e.stopPropagation()
    })

    // Handle keyboard navigation
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggle.click()
      }
    })
  })
}

// ===== MOBILE DROPDOWN FUNCTIONALITY =====
function initMobileDropdowns() {
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown")

  mobileDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".mobile-dropdown-toggle")
    const menu = dropdown.querySelector(".mobile-dropdown-menu")

    toggle.addEventListener("click", (e) => {
      e.preventDefault()
      const isActive = toggle.classList.toggle("active")
      menu.classList.toggle("active")
      toggle.setAttribute("aria-expanded", isActive)
    })

    // Close dropdown when selecting an item
    const items = dropdown.querySelectorAll(".mobile-dropdown-item")
    items.forEach((item) => {
      item.addEventListener("click", () => {
        toggle.classList.remove("active")
        menu.classList.remove("active")
        toggle.setAttribute("aria-expanded", "false")
      })
    })
  })
}

// ===== STATISTICS COUNTER ANIMATION =====
function initCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number")

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        counter.textContent = counter.textContent.replace(/\d+/, target)
        clearInterval(timer)
      } else {
        counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current))
      }
    }, 20)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const inputs = form.querySelectorAll("input[required], textarea[required]")
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.classList.add("error")

          // Remove error class after user starts typing
          input.addEventListener(
            "input",
            () => {
              input.classList.remove("error")
            },
            { once: true },
          )
        }
      })

      if (isValid) {
        // Handle form submission
        console.log("Form submitted successfully!")
        // You can add actual form submission logic here
      }
    })
  })
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Theme toggle
  themeToggle.addEventListener("click", toggleDarkMode)

  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", toggleMobileMenu)

  // Close mobile menu when clicking on links
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Header scroll effect
  window.addEventListener("scroll", throttle(handleHeaderScroll, 10))

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeMobileMenu()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu()
      // Close all dropdowns
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active")
      })
    }
  })

  // Create floating hearts periodically
  const heartInterval = setInterval(createFloatingHeart, 5000)

  // Stop creating hearts when page is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(heartInterval)
    }
  })

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu()
      }
    }, 250),
  )

  // Smooth scroll for CTA buttons
  document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const href = button.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    })
  })
}

// ===== INITIALIZATION =====
function init() {
  try {
    // Initialize all features
    initDarkMode()
    initEventListeners()
    initSmoothScrolling()
    initScrollAnimations()
    initParallax()
    initDropdowns()
    initMobileDropdowns()
    initCounterAnimation()
    initFormValidation()
    initLazyLoading()

    // Hide loading screen
    hideLoadingScreen()

    // Add some initial floating hearts
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(createFloatingHeart, i * 1000)
      }
    }, 2000)

    console.log("🍫 Choco Dating App loaded successfully!")
  } catch (error) {
    console.error("Error initializing app:", error)
    // Still hide loading screen even if there's an error
    hideLoadingScreen()
  }
}

// ===== START APPLICATION =====
// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("An error occurred:", e.error)
  // Hide loading screen even if there's an error
  if (loadingScreen && !loadingScreen.classList.contains("fade-out")) {
    hideLoadingScreen()
  }
})


// ===== PERFORMANCE MONITORING =====
// Monitor page performance
window.addEventListener("load", () => {
  if ("performance" in window) {
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
  }
})

// ===== SERVICE WORKER REGISTRATION =====
// Register service worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
