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
  }, 1000) // 2 second loading time
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
}

function closeMobileMenu() {
  mobileMenuToggle.classList.remove("active")
  mobileMenu.classList.remove("active")
  document.body.style.overflow = ""
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
      }
    })
  }, observerOptions)

  // Observe elements that should animate on scroll
  document.querySelectorAll(".support-column, .contact-content, .footer-content > *").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// ===== PARALLAX EFFECT =====
function initParallax() {
  const heroBackground = document.querySelector(".hero-background")
  const contactSection = document.querySelector(".contact-section")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxSpeed = 0.5

    if (heroBackground) {
      heroBackground.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`
    }

    if (contactSection) {
      contactSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`
    }
  })
}

// ===== SUPPORT LINK INTERACTIONS =====
function initSupportLinks() {
  const supportLinks = document.querySelectorAll(".support-link")

  supportLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateX(10px) scale(1.02)"
    })

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateX(0) scale(1)"
    })

    // Add click effect
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Create ripple effect
      const ripple = document.createElement("span")
      ripple.style.position = "absolute"
      ripple.style.borderRadius = "50%"
      ripple.style.background = "rgba(255, 255, 255, 0.6)"
      ripple.style.transform = "scale(0)"
      ripple.style.animation = "ripple 0.6s linear"
      ripple.style.left = "50%"
      ripple.style.top = "50%"
      ripple.style.width = "20px"
      ripple.style.height = "20px"
      ripple.style.marginLeft = "-10px"
      ripple.style.marginTop = "-10px"

      link.style.position = "relative"
      link.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)

      // Simulate navigation
      console.log(`Navigating to: ${link.querySelector("span").textContent}`)
    })
  })
}

// Add ripple animation CSS
const rippleStyle = document.createElement("style")
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`
document.head.appendChild(rippleStyle)

// ===== CONTACT BUTTON INTERACTION =====
function initContactButton() {
  const contactButton = document.querySelector(".contact-button")

  if (contactButton) {
    contactButton.addEventListener("click", () => {
      // Add loading state
      const originalText = contactButton.innerHTML
      contactButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>'
      contactButton.disabled = true

      // Simulate form submission
      setTimeout(() => {
        contactButton.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>'
        contactButton.style.background = "linear-gradient(135deg, #4CAF50, #45a049)"

        setTimeout(() => {
          contactButton.innerHTML = originalText
          contactButton.disabled = false
          contactButton.style.background = ""
        }, 2000)
      }, 1500)
    })
  }
}

// ===== DROPDOWN FUNCTIONALITY =====
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")

    toggle.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdown.classList.toggle("active")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.classList.remove("active")
    })

    // Prevent dropdown from closing when clicking inside
    menu.addEventListener("click", (e) => {
      e.stopPropagation()
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
      toggle.classList.toggle("active")
      menu.classList.toggle("active")
    })

    // Close dropdown when selecting an item
    const items = dropdown.querySelectorAll(".mobile-dropdown-item")
    items.forEach((item) => {
      item.addEventListener("click", () => {
        toggle.classList.remove("active")
        menu.classList.remove("active")
      })
    })
  })
}

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
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu()
    }
  })
}

// ===== INITIALIZATION =====
function init() {
  // Initialize all features
  initDarkMode()
  initEventListeners()
  initSmoothScrolling()
  initScrollAnimations()
  initParallax()
  initDropdowns()
  initMobileDropdowns()
  initSupportLinks()
  initContactButton()

  // Hide loading screen
  hideLoadingScreen()
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

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Skip to main content link
const skipLink = document.createElement("a")
skipLink.href = "#support-main"
skipLink.textContent = "Skip to main content"
skipLink.className = "skip-link"
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-pink);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
`

skipLink.addEventListener("focus", () => {
  skipLink.style.top = "6px"
})

skipLink.addEventListener("blur", () => {
  skipLink.style.top = "-40px"
})

document.body.insertBefore(skipLink, document.body.firstChild)

// Add main id to support main element
document.querySelector(".support-main").id = "support-main"

console.log("🛠️ Choco Support Page loaded successfully!")
