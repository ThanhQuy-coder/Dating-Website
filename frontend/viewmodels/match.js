// Dark Mode Functionality (only in settings)
function toggleDarkMode() {
  const body = document.body
  const themeIconCard = document.getElementById("theme-icon-card")
  const themeTitle = document.getElementById("theme-title")

  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme")
    themeIconCard.className = "fas fa-moon"
    themeTitle.textContent = "Dark Mode"
    localStorage.setItem("theme", "light")
  } else {
    body.setAttribute("data-theme", "dark")
    themeIconCard.className = "fas fa-sun"
    themeTitle.textContent = "Light Mode"
    localStorage.setItem("theme", "dark")
  }
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  const themeIconCard = document.getElementById("theme-icon-card")
  const themeTitle = document.getElementById("theme-title")

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark")
    if (themeIconCard) themeIconCard.className = "fas fa-sun"
    if (themeTitle) themeTitle.textContent = "Light Mode"
  }
}

// Enhanced tab switching for mobile
function showTab(tabName) {
  // Remove active class from all nav icons (desktop)
  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.classList.remove("active")
  })

  // Remove active class from all bottom nav items (mobile)
  document.querySelectorAll(".bottom-nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to clicked element
  if (event && event.target) {
    const clickedElement = event.target.closest(".nav-icon") || event.target.closest(".bottom-nav-item")
    if (clickedElement) {
      clickedElement.classList.add("active")
    }
  }

  // Hide all main tab panes
  document.querySelectorAll(".main-content .tab-pane").forEach((pane) => {
    pane.classList.remove("active")
  })

  // Hide all sidebar tab panes
  document.querySelectorAll(".tab-content .tab-pane").forEach((pane) => {
    pane.classList.remove("active")
  })

  // Show selected main tab
  const targetTab = document.getElementById(tabName + "-tab")
  if (targetTab) {
    targetTab.classList.add("active")
  }

  // Show corresponding sidebar content
  if (tabName === "dating") {
    const matchesSidebar = document.getElementById("matches-sidebar")
    if (matchesSidebar) matchesSidebar.classList.add("active")
  } else if (tabName === "notifications") {
    const notificationsSidebar = document.getElementById("notifications-sidebar")
    if (notificationsSidebar) notificationsSidebar.classList.add("active")
  } else {
    const matchesSidebar = document.getElementById("matches-sidebar")
    if (matchesSidebar) matchesSidebar.classList.add("active")
  }
}

// Enhanced card swiping with touch support
let startX = 0
let startY = 0
let currentX = 0
let currentY = 0
let isDragging = false

function initializeSwipeGestures() {
  const card = document.getElementById("dating-card")
  if (!card) return

  // Touch events
  card.addEventListener("touchstart", handleTouchStart, { passive: false })
  card.addEventListener("touchmove", handleTouchMove, { passive: false })
  card.addEventListener("touchend", handleTouchEnd, { passive: false })

  // Mouse events for desktop
  card.addEventListener("mousedown", handleMouseDown)
  card.addEventListener("mousemove", handleMouseMove)
  card.addEventListener("mouseup", handleMouseUp)
  card.addEventListener("mouseleave", handleMouseUp)
}

function handleTouchStart(e) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  isDragging = true
}

function handleTouchMove(e) {
  if (!isDragging) return
  e.preventDefault()

  currentX = e.touches[0].clientX - startX
  currentY = e.touches[0].clientY - startY

  updateCardPosition()
}

function handleTouchEnd(e) {
  if (!isDragging) return
  isDragging = false

  const threshold = 100
  if (Math.abs(currentX) > threshold) {
    if (currentX > 0) {
      swipeCard("like")
    } else {
      swipeCard("dislike")
    }
  } else if (currentY < -threshold) {
    swipeCard("super-like")
  } else {
    resetCardPosition()
  }
}

function handleMouseDown(e) {
  startX = e.clientX
  startY = e.clientY
  isDragging = true
}

function handleMouseMove(e) {
  if (!isDragging) return

  currentX = e.clientX - startX
  currentY = e.clientY - startY

  updateCardPosition()
}

function handleMouseUp(e) {
  if (!isDragging) return
  isDragging = false

  const threshold = 100
  if (Math.abs(currentX) > threshold) {
    if (currentX > 0) {
      swipeCard("like")
    } else {
      swipeCard("dislike")
    }
  } else if (currentY < -threshold) {
    swipeCard("super-like")
  } else {
    resetCardPosition()
  }
}

function updateCardPosition() {
  const card = document.getElementById("dating-card")
  if (!card) return

  const rotation = currentX * 0.1
  const opacity = 1 - Math.abs(currentX) / 300

  card.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${rotation}deg)`
  card.style.opacity = Math.max(opacity, 0.5)
}

function resetCardPosition() {
  const card = document.getElementById("dating-card")
  if (!card) return

  card.style.transform = ""
  card.style.opacity = ""
  currentX = 0
  currentY = 0
}

// Enhanced card swiping functionality
function swipeCard(action) {
  const card = document.getElementById("dating-card")
  if (!card) return

  // Add swipe animation
  if (action === "like") {
    card.style.transform = "translateX(100%) rotate(20deg)"
    card.style.opacity = "0"

    // Random chance for match (20% probability)
    const matchChance = Math.random()
    if (matchChance < 0.2) {
      setTimeout(() => showMatchAnimation(), 500)
    } else {
      showLikeAnimation()
    }
  } else if (action === "dislike") {
    card.style.transform = "translateX(-100%) rotate(-20deg)"
    card.style.opacity = "0"
  } else if (action === "super-like") {
    card.style.transform = "translateY(-100%) rotate(10deg)"
    card.style.opacity = "0"

    // Higher chance for super like (40% probability)
    const superMatchChance = Math.random()
    if (superMatchChance < 0.4) {
      setTimeout(() => showMatchAnimation(), 500)
    } else {
      showSuperLikeAnimation()
    }
  }

  // Reset card after animation
  setTimeout(() => {
    resetCardPosition()
    loadNextProfile()
  }, 300)
}

// Update loadNextProfile function - bạn tự thêm ảnh vào đây
function loadNextProfile() {
  const profiles = [
    {
      name: "Linh Tran",
      age: 23,
      distance: 3,
      hobbies: ["💃 Dancing", "🍳 Cooking", "🧘 Yoga", "📚 Reading"],
      image: "https://i.pinimg.com/736x/06/22/c7/0622c7b35454a3916004f7f3b56e52ad.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Thu Nguyen",
      age: 25,
      distance: 7,
      hobbies: ["🎨 Art", "🎬 Movies", "🥾 Hiking", "☕ Coffee"],
      image: "https://i.pinimg.com/736x/38/fd/07/38fd076e6cf0e13ba30b44034ea5f2b9.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Mai Anh",
      age: 22,
      distance: 2,
      hobbies: ["💪 Fitness", "✈️ Travel", "📸 Photography", "🎵 Music"],
      image: "https://i.pinimg.com/736x/51/4e/34/514e34ef914b74aff29eab6d6f51f077.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Hương Giang",
      age: 24,
      distance: 4,
      hobbies: ["🎵 Music", "📖 Reading", "🌸 Flowers", "🍰 Baking"],
      image: "https://i.pinimg.com/736x/a0/38/b9/a038b9a06e18962bef99eeb912d1d6d1.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Phương Anh",
      age: 21,
      distance: 6,
      hobbies: ["🎭 Theater", "🏊 Swimming", "🎨 Painting", "🐕 Dogs"],
      image: "https://i.pinimg.com/736x/f8/26/f4/f826f4c8188ff3fbe288e83462234673.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Thanh Hà",
      age: 26,
      distance: 8,
      hobbies: ["🎸 Guitar", "🌱 Gardening", "📚 Books", "🍜 Food"],
      image: "https://i.pinimg.com/736x/e2/3b/4c/e23b4c30dad8967937e292aaeeebdfff.jpg", // Bạn tự thêm ảnh vào đây
    },
    {
      name: "Minh Châu",
      age: 20,
      distance: 1,
      hobbies: ["🎪 Circus", "🧩 Puzzles", "🎯 Darts", "🎲 Games"],
      image: "https://i.pinimg.com/736x/1c/78/44/1c7844744ee6217d7336b948d834af4a.jpg", // Bạn tự thêm ảnh vào đây
    },
  ]

  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)]

  // Update card info
  const cardName = document.querySelector(".card-name")
  const cardDetails = document.querySelector(".card-details")
  const hobbiesContainer = document.querySelector(".card-hobbies")
  const cardImage = document.querySelector(".card-image")

  if (cardName) cardName.textContent = randomProfile.name
  if (cardDetails) cardDetails.textContent = `${randomProfile.age} years old • ${randomProfile.distance}km away`

  // Update main card image
  if (cardImage) {
    cardImage.src = randomProfile.image || "/placeholder.svg?height=420&width=350"
    cardImage.alt = `${randomProfile.name} Profile`
  }

  // Update hobbies
  if (hobbiesContainer) {
    hobbiesContainer.innerHTML = ""
    randomProfile.hobbies.forEach((hobby) => {
      const hobbyTag = document.createElement("span")
      hobbyTag.className = "hobby-tag"
      hobbyTag.textContent = hobby
      hobbiesContainer.appendChild(hobbyTag)
    })
  }

  // Show encouraging message occasionally
  showEncouragingMessage()
}

// Chat profiles - bạn tự thêm ảnh avatar vào đây
const chatProfiles = {
  "Hà My": {
    avatar: "https://i.pinimg.com/736x/e5/fc/a5/e5fca56c7194668b0e4c8a47f0f0b64a.jpg", // Bạn tự thêm ảnh avatar vào đây
    status: "Active now",
    messages: [
      { type: "other", text: "Hi! Nice to meet you 😊", time: "2:30 PM" },
      { type: "self", text: "Hey! Same here 😄", time: "2:32 PM" },
      { type: "other", text: "How's your day going?", time: "2:33 PM" },
      { type: "self", text: "Pretty good! Just finished work. How about you?", time: "2:35 PM" },
      {
        type: "other",
        text: "Great! I'm planning to go to that new coffee shop downtown. Want to join? ☕",
        time: "2:37 PM",
      },
      { type: "self", text: "That sounds amazing! I'd love to 💕", time: "2:38 PM" },
      { type: "other", text: "Perfect! How about 4 PM today?", time: "2:39 PM" },
    ],
  },
  "Linh Tran": {
    avatar: "https://i.pinimg.com/736x/06/22/c7/0622c7b35454a3916004f7f3b56e52ad.jpg", // Bạn tự thêm ảnh avatar vào đây
    status: "Online",
    messages: [
      { type: "other", text: "Thanks for the match! 💕", time: "Yesterday" },
      { type: "self", text: "You're welcome! Nice to meet you", time: "Yesterday" },
      { type: "other", text: "I love your photos! Where was that beach pic taken?", time: "Yesterday" },
      { type: "self", text: "That was in Da Nang! Have you been there?", time: "Yesterday" },
      { type: "other", text: "Not yet, but it's on my bucket list! 🏖️", time: "Yesterday" },
    ],
  },
  "Thu Nguyen": {
    avatar: "https://i.pinimg.com/736x/38/fd/07/38fd076e6cf0e13ba30b44034ea5f2b9.jpg", // Bạn tự thêm ảnh avatar vào đây
    status: "Last seen 2 hours ago",
    messages: [
      { type: "other", text: "Nice to meet you! 😊", time: "3 days ago" },
      { type: "self", text: "Nice to meet you too!", time: "3 days ago" },
      { type: "other", text: "I see you're into art too! What's your favorite medium?", time: "3 days ago" },
      { type: "self", text: "I love digital art and photography. How about you?", time: "3 days ago" },
      { type: "other", text: "Watercolor painting is my passion! 🎨", time: "3 days ago" },
    ],
  },
  "Mai Anh": {
    avatar: "https://i.pinimg.com/736x/51/4e/34/514e34ef914b74aff29eab6d6f51f077.jpg", // Bạn tự thêm ảnh avatar vào đây
    status: "Last seen 1 week ago",
    messages: [
      { type: "other", text: "Love your photos! You have great taste 📸", time: "1 week ago" },
      { type: "self", text: "Thank you so much! That means a lot", time: "1 week ago" },
      { type: "other", text: "Do you do professional photography?", time: "1 week ago" },
      { type: "self", text: "Just as a hobby for now, but I'm thinking about it!", time: "1 week ago" },
    ],
  },
}

// Update openChat function
function openChat(name) {
  showTab("messages")

  const chatName = document.querySelector(".chat-info h3")
  const chatStatus = document.querySelector(".chat-status")
  const chatAvatar = document.querySelector(".chat-avatar")
  const chatBody = document.getElementById("chat-body")

  // Get profile info
  const profile = chatProfiles[name]

  if (profile) {
    // Update header info
    if (chatName) chatName.textContent = name
    if (chatStatus) chatStatus.textContent = profile.status
    if (chatAvatar) chatAvatar.src = profile.avatar || "/placeholder.svg?height=50&width=50"

    // Clear and update messages
    if (chatBody) {
      chatBody.innerHTML = ""

      profile.messages.forEach((msg) => {
        const messageElement = document.createElement("div")
        messageElement.className = `message ${msg.type}`
        messageElement.innerHTML = `
          ${msg.text}
          <div class="message-time">${msg.time}</div>
        `
        chatBody.appendChild(messageElement)
      })

      chatBody.scrollTop = chatBody.scrollHeight
    }
  }
}

// Enhanced match animation
function showMatchAnimation() {
  const matchPopup = document.createElement("div")
  matchPopup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: slideIn 0.5s ease-out;">
            <div style="background: var(--card-bg); padding: 40px; border-radius: 20px; text-align: center; max-width: 90%; animation: slideIn 0.5s ease-out; box-shadow: var(--shadow-heavy);">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: var(--primary-solid); margin-bottom: 15px; font-size: 28px;">It's a Match!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 30px; font-size: 16px;">You and Hà My liked each other!</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="this.closest('div').remove(); showTab('messages');" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600;">Send Message</button>
                    <button onclick="this.closest('div').remove()" style="background: var(--secondary); color: var(--text-primary); border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600;">Keep Swiping</button>
                </div>
            </div>
        </div>
    `
  document.body.appendChild(matchPopup)

  setTimeout(() => {
    if (matchPopup.parentElement) {
      matchPopup.remove()
    }
  }, 5000)
}

// Enhanced super like animation
function showSuperLikeAnimation() {
  const superLikePopup = document.createElement("div")
  superLikePopup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: slideIn 0.5s ease-out;">
            <div style="background: linear-gradient(135deg, #74b9ff, #0984e3); padding: 40px; border-radius: 20px; text-align: center; color: white; max-width: 90%; animation: slideIn 0.5s ease-out; box-shadow: var(--shadow-heavy);">
                <div style="font-size: 60px; margin-bottom: 20px;">⭐</div>
                <h2 style="margin-bottom: 15px; font-size: 28px;">Super Like Sent!</h2>
                <p style="margin-bottom: 20px; opacity: 0.9; font-size: 16px;">Your super like has been sent!</p>
                <p style="margin-bottom: 30px; opacity: 0.8; font-size: 14px;">They'll see that you super liked them. Fingers crossed! 🤞</p>
                <button onclick="this.closest('div').remove()" style="background: white; color: #0984e3; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600;">Continue Swiping</button>
            </div>
        </div>
    `
  document.body.appendChild(superLikePopup)

  setTimeout(() => {
    if (superLikePopup.parentElement) {
      superLikePopup.remove()
    }
  }, 4000)
}

// Show like animation
function showLikeAnimation() {
  const likePopup = document.createElement("div")
  likePopup.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; animation: slideIn 0.3s ease-out;">
            <div style="background: var(--primary); padding: 20px 30px; border-radius: 50px; text-align: center; color: white; box-shadow: var(--shadow-heavy); animation: pulse 0.5s ease-out;">
                <i class="fas fa-heart" style="font-size: 24px; margin-right: 10px;"></i>
                <span style="font-size: 16px; font-weight: 600;">Liked!</span>
            </div>
        </div>
    `
  document.body.appendChild(likePopup)

  setTimeout(() => {
    if (likePopup.parentElement) {
      likePopup.remove()
    }
  }, 1500)
}

// Show encouraging messages
function showEncouragingMessage() {
  const messages = [
    "Keep swiping! Your perfect match is out there! 💕",
    "Don't give up! Love finds a way! ✨",
    "The right person is worth waiting for! 🌟",
    "Your soulmate might be the next swipe! 💖",
    "Good things come to those who wait! 🍀",
  ]

  if (!window.swipeCount) window.swipeCount = 0
  window.swipeCount++

  if (window.swipeCount % 10 === 0) {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    const messagePopup = document.createElement("div")
    messagePopup.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: var(--card-bg); padding: 15px 20px; border-radius: 15px; box-shadow: var(--shadow-medium); z-index: 9999; animation: slideIn 0.3s ease-out; border-left: 4px solid var(--primary-solid);">
                <p style="color: var(--text-primary); font-size: 14px; margin: 0;">${randomMessage}</p>
            </div>
        `
    document.body.appendChild(messagePopup)

    setTimeout(() => {
      if (messagePopup.parentElement) {
        messagePopup.remove()
      }
    }, 3000)
  }
}

// Enhanced chat functionality
function initializeChat() {
  const chatInput = document.getElementById("chat-input")
  const chatSendBtn = document.getElementById("chat-send-btn")
  const chatBody = document.getElementById("chat-body")

  function sendMessage() {
    const message = chatInput.value.trim()
    if (message) {
      const messageElement = document.createElement("div")
      messageElement.className = "message self"
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      messageElement.innerHTML = `
                ${message}
                <div class="message-time">${currentTime}</div>
            `
      chatBody.appendChild(messageElement)
      chatInput.value = ""
      chatBody.scrollTop = chatBody.scrollHeight

      // Show typing indicator
      const typingElement = document.createElement("div")
      typingElement.className = "typing-indicator"
      typingElement.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `
      chatBody.appendChild(typingElement)
      chatBody.scrollTop = chatBody.scrollHeight

      // Simulate response
      setTimeout(() => {
        const responses = [
          "That's interesting! 😊",
          "I totally agree!",
          "Tell me more about that",
          "Haha, that's funny! 😄",
          "Really? That's cool!",
          "I'd love to hear more",
          "What do you think about that?",
          "That sounds amazing! 🤩",
          "I can't wait to meet you! 💕",
          "You seem really nice 😊",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const responseTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        typingElement.className = "message other"
        typingElement.innerHTML = `
                    ${randomResponse}
                    <div class="message-time">${responseTime}</div>
                `
        chatBody.scrollTop = chatBody.scrollHeight
      }, 1500)
    }
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener("click", sendMessage)
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  }
}

// Add photo function
function addRandomPhoto() {
  const photoGrid = document.querySelector(".photo-grid")
  const addPhotoBtn = document.querySelector(".add-photo")

  if (photoGrid && addPhotoBtn) {
    const newPhotoItem = document.createElement("div")
    newPhotoItem.className = "photo-item"
    newPhotoItem.innerHTML = `
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop" alt="New Photo">
            <div class="photo-overlay">
                <div class="photo-actions">
                    <button class="photo-action"><i class="fas fa-edit"></i></button>
                    <button class="photo-action" onclick="this.closest('.photo-item').remove()"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `

    photoGrid.insertBefore(newPhotoItem, addPhotoBtn)

    newPhotoItem.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    newPhotoItem.addEventListener("mouseleave", function () {
      this.style.transform = ""
    })
  }
}

// Detect mobile device
function isMobile() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

// Optimize for mobile performance
if (isMobile()) {
  document.documentElement.style.setProperty("--transition", "all 0.2s ease")
  document.addEventListener("touchstart", () => {}, { passive: true })
  document.addEventListener("touchmove", () => {}, { passive: true })
}

// Handle orientation change
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    const cardContainer = document.querySelector(".card-container")
    if (cardContainer && isMobile()) {
      if (window.orientation === 90 || window.orientation === -90) {
        // Landscape mode
        cardContainer.style.width = "60vh"
        cardContainer.style.height = "80vh"
      } else {
        // Portrait mode
        cardContainer.style.width = "90vw"
        cardContainer.style.height = "70vh"
      }
    }
  }, 100)
})

document.addEventListener("DOMContentLoaded", () => {
  loadTheme()
  initializeSwipeGestures()
  initializeChat()
  showTab("dating")

  document.querySelectorAll(".touch-feedback").forEach((button) => {
    button.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.95)"
    })

    button.addEventListener("touchend", function () {
      setTimeout(() => {
        this.style.transform = ""
      }, 100)
    })
  })

  document
    .querySelectorAll(".match-item, .notification-item, .setting-card, .settings-item, .photo-item, .hobby-chip")
    .forEach((item) => {
      item.addEventListener("mouseenter", function () {
        if (!this.classList.contains("add-photo")) {
          this.style.transform = "translateY(-2px)"
        }
      })

      item.addEventListener("mouseleave", function () {
        this.style.transform = ""
      })
    })

  document.querySelectorAll(".add-photo, .camera-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uploadPopup = document.createElement("div")
      uploadPopup.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                    <div style="background: var(--card-bg); padding: 30px; border-radius: 20px; text-align: center; max-width: 90%; box-shadow: var(--shadow-heavy);">
                        <i class="fas fa-camera" style="font-size: 48px; color: var(--primary-solid); margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Upload Photo</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 25px;">Choose a photo from your gallery or take a new one</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="addRandomPhoto(); this.closest('div').remove()" style="background: var(--primary); color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Add Photo</button>
                            <button onclick="this.closest('div').remove()" style="background: var(--secondary); color: var(--text-primary); border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Gallery</button>
                            <button onclick="this.closest('div').remove()" style="background: none; border: 1px solid var(--text-light); color: var(--text-secondary); padding: 12px 20px; border-radius: 25px; cursor: pointer;">Cancel</button>
                        </div>
                    </div>
                </div>
            `
      document.body.appendChild(uploadPopup)
    })
  })

  if (window.innerWidth <= 768) {
    document.body.style.scrollBehavior = "smooth"
  }

  function addHapticFeedback() {
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  document.querySelectorAll(".action-btn, .bottom-nav-item").forEach((btn) => {
    btn.addEventListener("click", addHapticFeedback)
  })
})
// Mở search modal với UI cải tiến
function openSearchModal() {
  const searchModal = document.createElement('div');
  searchModal.className = 'search-modal';
  searchModal.innerHTML = `
    <div class="search-modal-content">
      <div class="search-modal-header">
        <h2><i class="fas fa-search"></i> Find Your Perfect Match</h2>
        <button class="search-close-btn" onclick="closeSearchModal()">&times;</button>
      </div>

      <div class="search-modal-body">
        <!-- Age Range -->
        <div class="search-section">
          <h3><i class="fas fa-birthday-cake"></i> Age Range</h3>
          <div class="range-input-group">
            <div class="search-input-group">
              <label>From</label>
              <input type="number" placeholder="18" min="18" max="100" value="18" id="min-age">
            </div>
            <span class="range-separator">to</span>
            <div class="search-input-group">
              <label>To</label>
              <input type="number" placeholder="35" min="18" max="100" value="35" id="max-age">
            </div>
          </div>
        </div>

        <!-- Distance -->
        <div class="search-section">
          <h3><i class="fas fa-map-marker-alt"></i> Maximum Distance</h3>
          <div class="distance-options">
            <div class="distance-option active" onclick="selectDistance(this, 5)">5 km</div>
            <div class="distance-option" onclick="selectDistance(this, 10)">10 km</div>
            <div class="distance-option" onclick="selectDistance(this, 25)">25 km</div>
            <div class="distance-option" onclick="selectDistance(this, 50)">50 km</div>
            <div class="distance-option" onclick="selectDistance(this, 100)">100 km</div>
            <div class="distance-option" onclick="selectDistance(this, 999)">Any</div>
          </div>
        </div>

        <!-- Location -->
        <div class="search-section">
          <h3><i class="fas fa-globe"></i> Location</h3>
          <div class="search-input-group">
            <label>City or Region</label>
            <select id="location-select">
              <option value="">All locations</option>
              <option value="hcm">Ho Chi Minh City</option>
              <option value="hanoi">Hanoi</option>
              <option value="danang">Da Nang</option>
              <option value="cantho">Can Tho</option>
              <option value="haiphong">Hai Phong</option>
              <option value="nhatrang">Nha Trang</option>
              <option value="hue">Hue</option>
              <option value="vungtau">Vung Tau</option>
            </select>
          </div>
        </div>

        <!-- Interests -->
        <div class="search-section">
          <h3><i class="fas fa-heart"></i> Shared Interests</h3>
          <div class="search-tags">
            <div class="search-tag" onclick="toggleSearchTag(this)">🎮 Gaming</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">⚽ Sports</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">💻 Tech</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">📸 Photography</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">✈️ Travel</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🎵 Music</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">☕ Coffee</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🍳 Cooking</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">📚 Reading</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🎬 Movies</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🧘 Yoga</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🎨 Art</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">💪 Fitness</div>
            <div class="search-tag" onclick="toggleSearchTag(this)">🌱 Nature</div>
          </div>
        </div>

        <!-- Online Status -->
        <div class="search-section">
          <h3><i class="fas fa-circle"></i> Activity Status</h3>
          <div class="search-input-group">
            <label>Last seen</label>
            <select id="online-status">
              <option value="">Any time</option>
              <option value="online">Online now</option>
              <option value="recently">Active today</option>
              <option value="week">Active this week</option>
              <option value="month">Active this month</option>
            </select>
          </div>
        </div>

        <!-- Education -->
        <div class="search-section">
          <h3><i class="fas fa-graduation-cap"></i> Education Level</h3>
          <div class="search-input-group">
            <label>Minimum education</label>
            <select id="education-level">
              <option value="">Any level</option>
              <option value="high-school">High School</option>
              <option value="college">College/Diploma</option>
              <option value="university">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Search Buttons -->
      <div class="search-buttons">
        <button class="search-btn secondary" onclick="clearSearchFilters()">
          <i class="fas fa-undo"></i> Reset
        </button>
        <button class="search-btn primary" onclick="applySearchFilters()">
          <i class="fas fa-search"></i> Find Matches
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(searchModal);
  document.body.style.overflow = 'hidden';
}

// Select distance option
function selectDistance(element, distance) {
  // Remove active from all distance options
  document.querySelectorAll('.distance-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Add active to selected option
  element.classList.add('active');
  
  // Store selected distance
  element.parentElement.setAttribute('data-selected-distance', distance);
}

// Toggle search tag với animation
function toggleSearchTag(tag) {
  tag.classList.toggle('active');
  
  // Add ripple effect
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;
  
  const rect = tag.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (rect.width / 2 - size / 2) + 'px';
  ripple.style.top = (rect.height / 2 - size / 2) + 'px';
  
  tag.style.position = 'relative';
  tag.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Clear all search filters với animation
function clearSearchFilters() {
  // Reset inputs với animation
  const inputs = document.querySelectorAll('#min-age, #max-age, #location-select, #online-status, #education-level');
  inputs.forEach((input, index) => {
    setTimeout(() => {
      if (input.type === 'number') {
        input.value = input.id === 'min-age' ? '18' : '35';
      } else {
        input.value = '';
      }
      input.style.transform = 'scale(1.05)';
      setTimeout(() => {
        input.style.transform = '';
      }, 200);
    }, index * 100);
  });
  
  // Reset distance options
  document.querySelectorAll('.distance-option').forEach(option => {
    option.classList.remove('active');
  });
  document.querySelector('.distance-option').classList.add('active');
  
  // Clear tags với animation
  const activeTags = document.querySelectorAll('.search-tag.active');
  activeTags.forEach((tag, index) => {
    setTimeout(() => {
      tag.classList.remove('active');
      tag.style.transform = 'scale(0.9)';
      setTimeout(() => {
        tag.style.transform = '';
      }, 200);
    }, index * 50);
  });
  
  showNotification('All filters cleared! ✨', 'info');
}

// Apply search filters với loading animation
function applySearchFilters() {
  const filters = {
    minAge: document.getElementById('min-age').value,
    maxAge: document.getElementById('max-age').value,
    distance: document.querySelector('.distance-option.active').textContent,
    location: document.getElementById('location-select').value,
    onlineStatus: document.getElementById('online-status').value,
    education: document.getElementById('education-level').value,
    interests: Array.from(document.querySelectorAll('.search-tag.active')).map(tag => tag.textContent.trim())
  };

  // Close modal với animation
  const modal = document.querySelector('.search-modal-content');
  modal.style.transform = 'translateY(-50px) scale(0.9)';
  modal.style.opacity = '0';
  
  setTimeout(() => {
    closeSearchModal();
    showSearchResults(filters);
  }, 300);
}

// Show search results với animation
function showSearchResults(filters) {
  showNotification('🔍 Searching for your perfect matches...', 'info');
  
  setTimeout(() => {
    const resultsCount = Math.floor(Math.random() * 50) + 15;
    showNotification(`🎉 Found ${resultsCount} amazing matches for you!`, 'success');
    loadNextProfile();
  }, 2500);
}
// Backup method - chạy sau khi DOM load xong
setTimeout(() => {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    console.log('Search input found!');
    searchInput.onclick = function() {
      console.log('Search clicked!');
      openSearchModal();
    };
    searchInput.onfocus = function() {
      console.log('Search focused!');
      openSearchModal();
    };
  } else {
    console.log('Search input NOT found!');
  }
}, 1000);
// Close search modal
function closeSearchModal() {
  const modal = document.querySelector('.search-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}
// Thêm function để toggle chat options menu
function toggleChatOptions() {
  const existingMenu = document.querySelector(".chat-options-menu")

  if (existingMenu) {
    existingMenu.remove()
    return
  }

  const chatOptionsMenu = document.createElement("div")
  chatOptionsMenu.className = "chat-options-menu"
  chatOptionsMenu.innerHTML = `
    <div class="chat-options-overlay" onclick="this.parentElement.remove()"></div>
    <div class="chat-options-content">
      <div class="chat-option-item" onclick="viewProfile()">
        <i class="fas fa-user"></i>
        <span>View Profile</span>
      </div>
      <div class="chat-option-item" onclick="muteNotifications()">
        <i class="fas fa-bell-slash"></i>
        <span>Mute Notifications</span>
      </div>
      <div class="chat-option-item" onclick="shareContact()">
        <i class="fas fa-share"></i>
        <span>Share Contact</span>
      </div>
      <div class="chat-option-item" onclick="exportChat()">
        <i class="fas fa-download"></i>
        <span>Export Chat</span>
      </div>
      <div class="chat-option-item" onclick="clearChat()">
        <i class="fas fa-trash-alt"></i>
        <span>Clear Chat</span>
      </div>
      <div class="chat-option-item danger" onclick="blockUser()">
        <i class="fas fa-ban"></i>
        <span>Block User</span>
      </div>
      <div class="chat-option-item danger" onclick="reportUser()">
        <i class="fas fa-flag"></i>
        <span>Report User</span>
      </div>
    </div>
  `

  document.body.appendChild(chatOptionsMenu)
}

// Thêm các functions cho chat options
function viewProfile() {
  document.querySelector(".chat-options-menu").remove()
  showTab("profile")
  showNotification("Opening profile...", "info")
}

function muteNotifications() {
  document.querySelector(".chat-options-menu").remove()
  showNotification("Notifications muted for this chat", "success")
}

function shareContact() {
  document.querySelector(".chat-options-menu").remove()
  if (navigator.share) {
    navigator.share({
      title: "Contact",
      text: "Check out this person on Perfect Match!",
      url: window.location.href,
    })
  } else {
    showNotification("Contact shared to clipboard!", "success")
  }
}

function exportChat() {
  document.querySelector(".chat-options-menu").remove()
  showNotification("Chat exported successfully!", "success")
}

function clearChat() {
  document.querySelector(".chat-options-menu").remove()
  const confirmPopup = document.createElement("div")
  confirmPopup.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: var(--card-bg); padding: 30px; border-radius: 20px; text-align: center; max-width: 90%; box-shadow: var(--shadow-heavy);">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b9d; margin-bottom: 20px;"></i>
        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Clear Chat History?</h3>
        <p style="color: var(--text-secondary); margin-bottom: 25px;">This action cannot be undone. All messages will be permanently deleted.</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button onclick="confirmClearChat(); this.closest('div').remove()" style="background: #ff4757; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Clear Chat</button>
          <button onclick="this.closest('div').remove()" style="background: var(--secondary); color: var(--text-primary); border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(confirmPopup)
}

function confirmClearChat() {
  const chatBody = document.getElementById("chat-body")
  if (chatBody) {
    chatBody.innerHTML =
      '<div style="text-align: center; color: var(--text-light); padding: 20px;">Chat history cleared</div>'
  }
  showNotification("Chat history cleared", "success")
}

function blockUser() {
  document.querySelector(".chat-options-menu").remove()
  const confirmPopup = document.createElement("div")
  confirmPopup.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: var(--card-bg); padding: 30px; border-radius: 20px; text-align: center; max-width: 90%; box-shadow: var(--shadow-heavy);">
        <i class="fas fa-ban" style="font-size: 48px; color: #ff4757; margin-bottom: 20px;"></i>
        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Block This User?</h3>
        <p style="color: var(--text-secondary); margin-bottom: 25px;">They won't be able to message you or see your profile.</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button onclick="confirmBlockUser(); this.closest('div').remove()" style="background: #ff4757; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Block User</button>
          <button onclick="this.closest('div').remove()" style="background: var(--secondary); color: var(--text-primary); border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(confirmPopup)
}

function confirmBlockUser() {
  showNotification("User blocked successfully", "success")
  showTab("dating")
}

function reportUser() {
  document.querySelector(".chat-options-menu").remove()
  const reportPopup = document.createElement("div")
  reportPopup.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: var(--card-bg); padding: 30px; border-radius: 20px; text-align: center; max-width: 90%; box-shadow: var(--shadow-heavy);">
        <i class="fas fa-flag" style="font-size: 48px; color: #ff4757; margin-bottom: 20px;"></i>
        <h3 style="margin-bottom: 15px; color: var(--text-primary);">Report User</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Why are you reporting this user?</p>
        <select style="width: 100%; padding: 10px; margin-bottom: 20px; border: 2px solid var(--secondary); border-radius: 10px; background: var(--card-bg); color: var(--text-primary);">
          <option>Inappropriate behavior</option>
          <option>Spam or fake profile</option>
          <option>Harassment</option>
          <option>Inappropriate photos</option>
          <option>Other</option>
        </select>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button onclick="confirmReportUser(); this.closest('div').remove()" style="background: #ff4757; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Submit Report</button>
          <button onclick="this.closest('div').remove()" style="background: var(--secondary); color: var(--text-primary); border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(reportPopup)
}

function confirmReportUser() {
  showNotification("Report submitted. Thank you for keeping our community safe!", "success")
}

// Thêm function để show notifications
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: ${type === "success" ? "#2ecc71" : type === "error" ? "#ff4757" : "var(--primary-solid)"}; color: white; padding: 15px 25px; border-radius: 25px; box-shadow: var(--shadow-medium); z-index: 10000; animation: slideIn 0.3s ease-out;">
      <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : "info"}" style="margin-right: 10px;"></i>
      ${message}
    </div>
  `
  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 3000)
}

chatBody.scrollTop = chatBody.scrollHeight;
chatBody.appendChild(messageElement);
chatBody.scrollTop = chatBody.scrollHeight;
chatBody.scrollTop = chatBody.scrollHeight;