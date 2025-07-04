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
    if (loadingScreen) loadingScreen.classList.add("fade-out")
    if (mainContent) mainContent.classList.remove("hidden")
    setTimeout(() => {
      if (loadingScreen) loadingScreen.style.display = "none"
    }, 600)
  }, 1000)
}

// ===== DARK MODE =====
function initDarkMode() {
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
  if (!themeToggle) return
  const icon = themeToggle.querySelector(".theme-icon")
  if (!icon) return
  icon.className = isDark ? "fas fa-sun theme-icon" : "fas fa-moon theme-icon"
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
  if (!mobileMenu || !mobileMenuToggle) return
  mobileMenuToggle.classList.toggle("active")
  mobileMenu.classList.toggle("active")
  document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : ""
  mobileMenuToggle.setAttribute("aria-expanded", mobileMenu.classList.contains("active"))
}

function closeMobileMenu() {
  if (!mobileMenu || !mobileMenuToggle) return
  mobileMenuToggle.classList.remove("active")
  mobileMenu.classList.remove("active")
  document.body.style.overflow = ""
  mobileMenuToggle.setAttribute("aria-expanded", "false")
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
  if (!header) return
  const scrollY = window.scrollY
  header.style.background = document.body.classList.contains("dark-mode")
    ? "rgba(26, 26, 26, 0.98)"
    : "rgba(243, 89, 128, 0.98)"
  header.style.boxShadow = scrollY > 100 ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "none"
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
        closeMobileMenu()
      }
    })
  })
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        entry.target.classList.add("animate-fade-in")
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  })

  document.querySelectorAll(".feature-card, .feature-item, .stat-item, .about-content, .footer-content > *").forEach((el) => {
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
    if (sweetSection) {
      sweetSection.style.backgroundPositionY = `${scrolled * 0.5}px`
    }
    if (footerSection) {
      footerSection.style.backgroundPositionY = `${scrolled * 0.15}px`
    }
  }, 16)

  window.addEventListener("scroll", handleParallax)
}

// ===== FLOATING HEARTS ANIMATION =====
function createFloatingHeart() {
  const hearts = ["💕", "❤️", "💖", "💝", "💗", "💘"]
  const heart = document.createElement("div")
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
  Object.assign(heart.style, {
    position: "fixed",
    left: Math.random() * 100 + "vw",
    top: "100vh",
    fontSize: Math.random() * 1 + 1.5 + "rem",
    pointerEvents: "none",
    zIndex: 999,
    animation: "floatUp 4s linear forwards",
    userSelect: "none",
  })
  document.body.appendChild(heart)
  setTimeout(() => heart.remove(), 4000)
}

// Add CSS for hearts
const style = document.createElement("style")
style.textContent = `@keyframes floatUp {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}`
document.head.appendChild(style)

// ===== DROPDOWN FUNCTIONALITY =====
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")
    if (!toggle || !menu) return

    toggle.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdowns.forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove("active")
          const t = d.querySelector(".dropdown-toggle")
          if (t) t.setAttribute("aria-expanded", "false")
        }
      })
      const isActive = dropdown.classList.toggle("active")
      toggle.setAttribute("aria-expanded", isActive)
    })

    document.addEventListener("click", () => {
      dropdown.classList.remove("active")
      toggle.setAttribute("aria-expanded", "false")
    })

    menu.addEventListener("click", (e) => e.stopPropagation())

    toggle.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) {
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
    if (!toggle || !menu) return

    toggle.addEventListener("click", (e) => {
      e.preventDefault()
      const isActive = toggle.classList.toggle("active")
      menu.classList.toggle("active")
      toggle.setAttribute("aria-expanded", isActive)
    })

    dropdown.querySelectorAll(".mobile-dropdown-item").forEach((item) => {
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
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ""))
    let current = 0
    const increment = target / 100
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

  counters.forEach((counter) => observer.observe(counter))
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const inputs = form.querySelectorAll("input[required], textarea[required]")
      let isValid = true
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false
          input.classList.add("error")
          input.addEventListener("input", () => input.classList.remove("error"), { once: true })
        }
      })
      if (isValid) console.log("Form submitted successfully!")
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
  images.forEach((img) => imageObserver.observe(img))
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  if (themeToggle) themeToggle.addEventListener("click", toggleDarkMode)
  if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", toggleMobileMenu)

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  window.addEventListener("scroll", throttle(handleHeaderScroll, 10))

  document.addEventListener("click", (e) => {
    if (mobileMenu && mobileMenuToggle && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      closeMobileMenu()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu()
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active")
      })
    }
  })

  const heartInterval = setInterval(createFloatingHeart, 5000)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(heartInterval)
  })

  window.addEventListener("resize", debounce(() => {
    if (window.innerWidth > 768) closeMobileMenu()
  }, 250))

  document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const href = button.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    })
  })
}

// ===== INITIALIZATION =====
function init() {
  try {
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
    hideLoadingScreen()
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(createFloatingHeart, i * 1000)
      }
    }, 2000)
    console.log("🍫 Choco Dating App loaded successfully!")
  } catch (error) {
    console.error("Error initializing app:", error)
    hideLoadingScreen()
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

window.addEventListener("error", (e) => {
  console.error("An error occurred:", e.error)
  if (loadingScreen && !loadingScreen.classList.contains("fade-out")) hideLoadingScreen()
})

// Performance
window.addEventListener("load", () => {
  if ("performance" in window) {
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
  }
})

// Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered:", registration))
      .catch((err) => console.log("SW registration failed:", err))
  })
}
