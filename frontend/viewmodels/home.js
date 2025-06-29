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
const floatingHeartsContainer = document.getElementById("floating-hearts-bg")
const backToTopBtn = document.getElementById("back-to-top")
const testimonialsSlider = document.getElementById("testimonials-slider")
const prevTestimonialBtn = document.getElementById("prev-testimonial")
const nextTestimonialBtn = document.getElementById("next-testimonial")
const testimonialDots = document.getElementById("testimonial-dots")
const contactForm = document.getElementById("contact-form")

// Thêm các DOM elements mới cho trang chủ
const phoneInterface = document.querySelector(".app-interface")
const profileCard = document.querySelector(".profile-card")
const storiesCarousel = document.querySelector(".stories-carousel")
const storyCards = document.querySelectorAll(".story-card")
const carouselBtns = document.querySelectorAll(".carousel-btn")
const carouselDots = document.querySelectorAll(".carousel-dots .dot")
const ctaCounters = document.querySelectorAll(".counter-number")
const heroActions = document.querySelectorAll(".btn-primary-home, .btn-secondary-home")

// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0
const totalTestimonials = 3
let testimonialInterval

// Thêm biến global cho stories carousel
let currentStory = 0
const totalStories = storyCards.length
let storyInterval

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
  // Animate progress bar
  const progressBar = document.querySelector(".progress-bar")
  if (progressBar) {
    progressBar.style.width = "100%"
  }

  setTimeout(() => {
    loadingScreen.classList.add("fade-out")
    mainContent.classList.remove("hidden")

    // Remove loading screen from DOM after animation
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 600)
  }, 2500) // Increased time to show progress bar
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

  if (scrollY > 50) {
    header.style.background = "rgba(243, 89, 128, 0.98)"
    header.style.backdropFilter = "blur(15px)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
    header.style.position = "fixed"
    header.style.top = "0"
    header.style.left = "0"
    header.style.right = "0"
    header.style.zIndex = "1000"
  } else {
    header.style.background = ""
    header.style.backdropFilter = ""
    header.style.boxShadow = ""
    header.style.position = "relative"
  }
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const target = document.querySelector(targetId)

      if (target) {
        const headerHeight = header.offsetHeight
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        closeMobileMenu()

        // Update active nav link
        updateActiveNavLink(targetId)
      }
    })
  })
}

// ===== ACTIVE NAVIGATION =====
function updateActiveNavLink(targetId) {
  // Remove active class from all nav links
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  // Add active class to current nav link
  document.querySelectorAll(`a[href="${targetId}"]`).forEach((link) => {
    link.classList.add("active")
  })
}

function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id")
          updateActiveNavLink(`#${id}`)
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: "-100px 0px -100px 0px",
    },
  )

  sections.forEach((section) => {
    observer.observe(section)
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

        // Add special animations for different elements
        if (entry.target.classList.contains("feature-card")) {
          entry.target.style.transform = "translateY(0) scale(1)"
        }
        if (entry.target.classList.contains("about-card")) {
          entry.target.style.transform = "translateY(0) rotateX(0)"
        }
        if (entry.target.classList.contains("gallery-item")) {
          entry.target.style.transform = "scale(1) rotate(0deg)"
        }
      }
    })
  }, observerOptions)

  // Observe elements that should animate on scroll
  const animatedElements = document.querySelectorAll(`
    .feature-card, .about-card, .gallery-item, .contact-item,
    .timeline-item, .stat-item, .testimonial-card
  `)

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// ===== FLOATING HEARTS ANIMATION =====
function createFloatingHeart() {
  const hearts = ["💕", "❤️", "💖", "💝", "💗", "💘", "🥰", "😍", "💞"]
  const heart = document.createElement("div")
  heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
  heart.className = "floating-heart-bg"
  heart.style.left = Math.random() * 100 + "vw"
  heart.style.animationDuration = Math.random() * 3 + 5 + "s"
  heart.style.fontSize = Math.random() * 1 + 1 + "rem"
  heart.style.opacity = Math.random() * 0.5 + 0.3

  floatingHeartsContainer.appendChild(heart)

  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove()
    }
  }, 8000)
}

// ===== TESTIMONIALS SLIDER =====
function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial-card")
  const dots = document.querySelectorAll(".dot")

  // Hide all testimonials
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active")
  })

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active")
  })

  // Show current testimonial
  if (testimonials[index]) {
    testimonials[index].classList.add("active")
  }

  // Activate current dot
  if (dots[index]) {
    dots[index].classList.add("active")
  }

  currentTestimonial = index
}

function nextTestimonial() {
  const nextIndex = (currentTestimonial + 1) % totalTestimonials
  showTestimonial(nextIndex)
}

function prevTestimonial() {
  const prevIndex = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials
  showTestimonial(prevIndex)
}

function initTestimonialsSlider() {
  if (!testimonialsSlider) return

  // Add event listeners for navigation buttons
  if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener("click", () => {
      nextTestimonial()
      resetTestimonialInterval()
    })
  }

  if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener("click", () => {
      prevTestimonial()
      resetTestimonialInterval()
    })
  }

  // Add event listeners for dots
  if (testimonialDots) {
    const dots = testimonialDots.querySelectorAll(".dot")
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showTestimonial(index)
        resetTestimonialInterval()
      })
    })
  }

  // Auto-play slider
  startTestimonialInterval()

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevTestimonial()
      resetTestimonialInterval()
    } else if (e.key === "ArrowRight") {
      nextTestimonial()
      resetTestimonialInterval()
    }
  })
}

function startTestimonialInterval() {
  testimonialInterval = setInterval(nextTestimonial, 5000)
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval)
  startTestimonialInterval()
}

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
    if (menu) {
      menu.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }

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
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        if (target === 95) {
          counter.textContent = "95%"
        } else {
          counter.textContent = target.toLocaleString() + "+"
        }
        clearInterval(timer)
      } else {
        counter.textContent = Math.floor(current).toLocaleString()
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

// ===== BUTTON INTERACTIONS =====
function initButtonInteractions() {
  const buttons = document.querySelectorAll(".button-main, .button-secondary, .submit-btn")

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.filter = "drop-shadow(0 0 20px rgba(226, 247, 66, 0.8))"
    })

    button.addEventListener("mouseleave", () => {
      button.style.filter = ""
    })

    button.addEventListener("click", (e) => {
      // Add click animation
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = ""
      }, 150)

      // Create ripple effect
      createRippleEffect(e, button)
    })
  })
}

// ===== RIPPLE EFFECT =====
function createRippleEffect(event, element) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + "px"
  ripple.style.left = x + "px"
  ripple.style.top = y + "px"
  ripple.classList.add("ripple")

  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// ===== CONTACT FORM =====
function initContactForm() {
  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address", "error")
      return
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector(".submit-btn")
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
    submitBtn.disabled = true

    setTimeout(() => {
      showNotification("Message sent successfully! We'll get back to you soon.", "success")
      contactForm.reset()
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }, 2000)
  })
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification)
  }, 5000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 300)
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  if (!backToTopBtn) return

  // Show/hide button based on scroll position
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible")
      } else {
        backToTopBtn.classList.remove("visible")
      }
    }, 100),
  )

  // Scroll to top when clicked
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// ===== GALLERY INTERACTIONS =====
function initGalleryInteractions() {
  const galleryItems = document.querySelectorAll(".gallery-item")

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img")
      const title = item.querySelector("h4").textContent
      const subtitle = item.querySelector("p").textContent

      openLightbox(img.src, title, subtitle)
    })
  })
}

function openLightbox(imageSrc, title, subtitle) {
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox"
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">
        <i class="fas fa-times"></i>
      </button>
      <img src="${imageSrc}" alt="${title}">
      <div class="lightbox-info">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>
    </div>
  `

  // Add styles
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `

  document.body.appendChild(lightbox)
  document.body.style.overflow = "hidden"

  // Animate in
  setTimeout(() => {
    lightbox.style.opacity = "1"
  }, 10)

  // Close functionality
  const closeBtn = lightbox.querySelector(".lightbox-close")
  const closeLightbox = () => {
    lightbox.style.opacity = "0"
    setTimeout(() => {
      document.body.removeChild(lightbox)
      document.body.style.overflow = ""
    }, 300)
  }

  closeBtn.addEventListener("click", closeLightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard close
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeLightbox()
      document.removeEventListener("keydown", escHandler)
    }
  })
}

// ===== FEATURE CARD INTERACTIONS =====
function initFeatureCardInteractions() {
  const featureCards = document.querySelectorAll(".feature-card")

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-15px) scale(1.02)"
      card.style.boxShadow = "0 20px 60px rgba(243, 89, 128, 0.4)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
      card.style.boxShadow = ""
    })
  })
}

// ===== PARALLAX EFFECT =====
function initParallax() {
  const parallaxElements = document.querySelectorAll(".hero-right, .cta-image")

  const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.3

    parallaxElements.forEach((element) => {
      element.style.transform = `translateY(${rate}px)`
    })
  }, 16)

  window.addEventListener("scroll", handleParallax)
}

// ===== FORM VALIDATION =====
function initFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input, textarea")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateField(input)
      })

      input.addEventListener("input", () => {
        clearFieldError(input)
      })
    })
  })
}

function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Please enter a valid email address"
    }
  }

  // Show/hide error
  if (!isValid) {
    showFieldError(field, errorMessage)
  } else {
    clearFieldError(field)
  }

  return isValid
}

function showFieldError(field, message) {
  clearFieldError(field)

  field.style.borderColor = "#f44336"

  const errorElement = document.createElement("div")
  errorElement.className = "field-error"
  errorElement.textContent = message
  errorElement.style.cssText = `
    color: #f44336;
    font-size: 0.9rem;
    margin-top: 5px;
    animation: fadeIn 0.3s ease;
  `

  field.parentNode.appendChild(errorElement)
}

function clearFieldError(field) {
  field.style.borderColor = ""

  const errorElement = field.parentNode.querySelector(".field-error")
  if (errorElement) {
    errorElement.remove()
  }
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleDarkMode)
  }

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu)
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (mobileMenu && mobileMenuToggle && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
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
  setInterval(createFloatingHeart, 3000)

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu()
      }
    }, 250),
  )

  // Add scroll effects
  window.addEventListener(
    "scroll",
    throttle(() => {
      handleHeaderScroll()
    }, 10),
  )

  // Pause testimonial auto-play when user hovers
  if (testimonialsSlider) {
    testimonialsSlider.addEventListener("mouseenter", () => {
      clearInterval(testimonialInterval)
    })

    testimonialsSlider.addEventListener("mouseleave", () => {
      startTestimonialInterval()
    })
  }
}

function initPhoneInterface() {
  if (!phoneInterface) return

  // Animate profile card
  setInterval(() => {
    if (profileCard) {
      profileCard.style.transform = "scale(0.95) rotateY(5deg)"
      setTimeout(() => {
        profileCard.style.transform = "scale(1) rotateY(0deg)"
      }, 300)
    }
  }, 4000)

  // Add swipe simulation
  const actionButtons = document.querySelectorAll(".btn-pass, .btn-like")
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (profileCard) {
        const isLike = btn.classList.contains("btn-like")
        profileCard.style.transform = `translateX(${isLike ? "100px" : "-100px"}) rotate(${isLike ? "15deg" : "-15deg"})`
        profileCard.style.opacity = "0"

        setTimeout(() => {
          profileCard.style.transform = "translateX(0) rotate(0deg)"
          profileCard.style.opacity = "1"
        }, 500)
      }
    })
  })
}

function initStoriesCarousel() {
  if (!storiesCarousel) return

  function showStory(index) {
    storyCards.forEach((card, i) => {
      card.classList.toggle("active", i === index)
    })

    carouselDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index)
    })

    currentStory = index
  }

  function nextStory() {
    const nextIndex = (currentStory + 1) % totalStories
    showStory(nextIndex)
  }

  function prevStory() {
    const prevIndex = (currentStory - 1 + totalStories) % totalStories
    showStory(prevIndex)
  }

  // Navigation buttons
  carouselBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("next")) {
        nextStory()
      } else {
        prevStory()
      }
      resetStoryInterval()
    })
  })

  // Dots navigation
  carouselDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showStory(index)
      resetStoryInterval()
    })
  })

  // Auto-play
  function startStoryInterval() {
    storyInterval = setInterval(nextStory, 6000)
  }

  function resetStoryInterval() {
    clearInterval(storyInterval)
    startStoryInterval()
  }

  startStoryInterval()

  // Pause on hover
  storiesCarousel.addEventListener("mouseenter", () => {
    clearInterval(storyInterval)
  })

  storiesCarousel.addEventListener("mouseleave", () => {
    startStoryInterval()
  })
}

function initCTACounters() {
  if (!ctaCounters.length) return

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        counter.textContent = target.toLocaleString() + "+"
        clearInterval(timer)
      } else {
        counter.textContent = Math.floor(current).toLocaleString()
      }
    }, 30)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  ctaCounters.forEach((counter) => {
    observer.observe(counter)
  })
}

function initHeroInteractions() {
  // Hero badge pulse animation
  const heroBadge = document.querySelector(".hero-badge")
  if (heroBadge) {
    setInterval(() => {
      heroBadge.style.transform = "scale(1.05)"
      setTimeout(() => {
        heroBadge.style.transform = "scale(1)"
      }, 200)
    }, 3000)
  }

  // Hero actions enhanced interactions
  heroActions.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-5px) scale(1.05)"
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)"
    })

    btn.addEventListener("click", (e) => {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      btn.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

function initFeatureCardsHome() {
  const featureCards = document.querySelectorAll(".feature-card-home")

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const icon = card.querySelector(".icon-wrapper")
      if (icon) {
        icon.style.transform = "scale(1.1) rotate(10deg)"
      }
    })

    card.addEventListener("mouseleave", () => {
      const icon = card.querySelector(".icon-wrapper")
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)"
      }
    })
  })
}

function initFloatingElements() {
  // Enhanced floating hearts
  function createFloatingHeartHome() {
    const hearts = ["💕", "❤️", "💖", "💝", "💗", "💘", "🥰", "😍", "💞", "💓"]
    const heart = document.createElement("div")
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
    heart.className = "floating-heart-bg"
    heart.style.left = Math.random() * 100 + "vw"
    heart.style.animationDuration = Math.random() * 4 + 6 + "s"
    heart.style.fontSize = Math.random() * 1.5 + 1 + "rem"
    heart.style.opacity = Math.random() * 0.4 + 0.2

    floatingHeartsContainer.appendChild(heart)

    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove()
      }
    }, 10000)
  }

  // Create floating hearts more frequently for home page
  setInterval(createFloatingHeartHome, 2000)
}

function initScrollAnimationsHome() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Special animations for home page elements
        if (entry.target.classList.contains("feature-card-home")) {
          entry.target.style.transform = "translateY(0) scale(1)"
        }
        if (entry.target.classList.contains("story-card")) {
          entry.target.style.transform = "translateY(0) rotateX(0)"
        }
        if (entry.target.classList.contains("counter-item")) {
          entry.target.style.transform = "scale(1) rotate(0deg)"
        }
      }
    })
  }, observerOptions)

  // Observe home page specific elements
  const homeElements = document.querySelectorAll(`
    .feature-card-home, .story-card, .counter-item,
    .hero-badge, .cta-feature, .floating-ui-elements .ui-element
  `)

  homeElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px)"
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease"
    observer.observe(el)
  })
}

function initPlayButtons() {
  const playButtons = document.querySelectorAll(".play-story")

  playButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Simulate video play
      btn.innerHTML = "⏸"
      btn.style.background = "#ff6b9d"

      setTimeout(() => {
        btn.innerHTML = "▶"
        btn.style.background = "rgba(255, 255, 255, 0.9)"
      }, 3000)
    })
  })
}

function initParallaxHome() {
  const parallaxElements = document.querySelectorAll(".floating-ui-elements .ui-element")

  const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.2

    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.1
      element.style.transform = `translateY(${rate * speed}px)`
    })
  }, 16)

  window.addEventListener("scroll", handleParallax)
}

// Cập nhật hàm init() để bao gồm các tính năng mới
function init() {
  try {
    // Initialize existing features
    initDarkMode()
    initEventListeners()
    initSmoothScrolling()
    initActiveNavigation()
    initScrollAnimations()
    initDropdowns()
    initMobileDropdowns()
    initCounterAnimation()
    initTestimonialsSlider()
    initButtonInteractions()
    initContactForm()
    initBackToTop()
    initGalleryInteractions()
    initFeatureCardInteractions()
    initFormValidation()

    // Initialize new home page features
    initPhoneInterface()
    initStoriesCarousel()
    initCTACounters()
    initHeroInteractions()
    initFeatureCardsHome()
    initFloatingElements()
    initScrollAnimationsHome()
    initPlayButtons()
    // initParallaxHome() // Uncomment if you want parallax

    // Hide loading screen
    hideLoadingScreen()

    // Add some initial floating hearts
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingHeart, i * 300)
      }
    }, 1000)

    console.log("🍫 Choco Dating Home loaded successfully!")
  } catch (error) {
    console.error("Error initializing app:", error)
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
window.addEventListener("load", () => {
  if ("performance" in window) {
    const perfData = performance.getEntriesByType("navigation")[0]
    console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
  }
})

// ===== SERVICE WORKER REGISTRATION =====
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

// ===== ADDITIONAL STYLES FOR DYNAMIC ELEMENTS =====
const additionalStyles = document.createElement("style")
additionalStyles.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 5px;
    margin-left: auto;
  }

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    text-align: center;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .lightbox-close {
    position: absolute;
    top: -50px;
    right: -50px;
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.3s ease;
  }

  .lightbox-close:hover {
    background: rgba(255,255,255,0.3);
  }

  .lightbox-info {
    margin-top: 20px;
    color: white;
  }

  .lightbox-info h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .lightbox-info p {
    font-size: 1.1rem;
    opacity: 0.8;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
document.head.appendChild(additionalStyles)
