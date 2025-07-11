// Global variables
let currentChatUser = "Hà My";

// Dark Mode Functionality
function toggleDarkMode() {
  const body = document.body;
  const themeIconCard = document.getElementById("theme-icon-card");
  const themeTitle = document.getElementById("theme-title");
  const mobileThemeIcon = document.getElementById("mobile-theme-icon");
  const mobileThemeText = document.getElementById("mobile-theme-text");

  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme");
    if (themeIconCard) themeIconCard.className = "fas fa-moon";
    if (themeTitle) themeTitle.textContent = "Dark Mode";
    if (mobileThemeIcon) mobileThemeIcon.className = "fas fa-moon";
    if (mobileThemeText) mobileThemeText.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    if (themeIconCard) themeIconCard.className = "fas fa-sun";
    if (themeTitle) themeTitle.textContent = "Light Mode";
    if (mobileThemeIcon) mobileThemeIcon.className = "fas fa-sun";
    if (mobileThemeText) mobileThemeText.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  }
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const themeIconCard = document.getElementById("theme-icon-card");
  const themeTitle = document.getElementById("theme-title");
  const mobileThemeIcon = document.getElementById("mobile-theme-icon");
  const mobileThemeText = document.getElementById("mobile-theme-text");

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeIconCard) themeIconCard.className = "fas fa-sun";
    if (themeTitle) themeTitle.textContent = "Light Mode";
    if (mobileThemeIcon) mobileThemeIcon.className = "fas fa-sun";
    if (mobileThemeText) mobileThemeText.textContent = "Light Mode";
  }
}

// Enhanced Mobile Menu Functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");

  mobileMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");

  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// // Enhanced tab switching for mobile
// function showTab(tabName) {
//   // Close mobile menu if open
//   closeMobileMenu();

//   // Remove active class from all nav icons (desktop)
//   document.querySelectorAll(".nav-icon").forEach((icon) => {
//     icon.classList.remove("active");
//   });

//   // Remove active class from all bottom nav items (mobile)
//   document.querySelectorAll(".bottom-nav-item").forEach((item) => {
//     item.classList.remove("active");
//   });

//   // Add active class to clicked element
//   if (event && event.target) {
//     const clickedElement =
//       event.target.closest(".nav-icon") ||
//       event.target.closest(".bottom-nav-item");
//     if (clickedElement) {
//       clickedElement.classList.add("active");
//     }
//   }

//   // Hide all main tab panes
//   document.querySelectorAll(".main-content .tab-pane").forEach((pane) => {
//     pane.classList.remove("active");
//   });

//   // Hide all sidebar tab panes
//   document.querySelectorAll(".tab-content .tab-pane").forEach((pane) => {
//     pane.classList.remove("active");
//   });

//   // Show selected main tab
//   const targetTab = document.getElementById(tabName + "-tab");
//   if (targetTab) {
//     targetTab.classList.add("active");
//   }

//   // Show corresponding sidebar content
//   if (tabName === "dating") {
//     const matchesSidebar = document.getElementById("matches-sidebar");
//     if (matchesSidebar) matchesSidebar.classList.add("active");
//   } else if (tabName === "notifications") {
//     const notificationsSidebar = document.getElementById(
//       "notifications-sidebar"
//     );
//     if (notificationsSidebar) notificationsSidebar.classList.add("active");
//   } else {
//     const matchesSidebar = document.getElementById("matches-sidebar");
//     if (matchesSidebar) matchesSidebar.classList.add("active");
//   }

//   // Special handling for messages tab
//   if (tabName === "messages") {
//     showChatList();
//   }
// }

// // Enhanced Chat Functions
// function showChatList() {
//   const chatListView = document.getElementById("chat-list-view");
//   const individualChatView = document.getElementById("individual-chat-view");

//   if (chatListView && individualChatView) {
//     chatListView.style.display = "flex";
//     individualChatView.style.display = "none";
//   }
// }

// function showIndividualChat() {
//   const chatListView = document.getElementById("chat-list-view");
//   const individualChatView = document.getElementById("individual-chat-view");

//   if (chatListView && individualChatView) {
//     chatListView.style.display = "none";
//     individualChatView.style.display = "flex";
//   }
// }

// function openChatFromList(name) {
//   // Remove active class from all chat list items
//   document.querySelectorAll(".chat-list-item").forEach((item) => {
//     item.classList.remove("active");
//   });

//   // Add active class to clicked item
//   event.target.closest(".chat-list-item").classList.add("active");

//   // Open the individual chat
//   openChat(name);
//   showIndividualChat();
// }

// Chat profiles data
// const chatProfiles = {
//   "Hà My": {
//     avatar:
//       "https://i.pinimg.com/736x/e5/fc/a5/e5fca56c7194668b0e4c8a47f0f0b64a.jpg",
//     status: "Active now",
//     messages: [
//       { type: "other", text: "Hi! Nice to meet you 😊", time: "2:30 PM" },
//       { type: "self", text: "Hey! Same here 😄", time: "2:32 PM" },
//       { type: "other", text: "How's your day going?", time: "2:33 PM" },
//       {
//         type: "self",
//         text: "Pretty good! Just finished work. How about you?",
//         time: "2:35 PM",
//       },
//       {
//         type: "other",
//         text: "Great! I'm planning to go to that new coffee shop downtown. Want to join? ☕",
//         time: "2:37 PM",
//       },
//       {
//         type: "self",
//         text: "That sounds amazing! I'd love to 💕",
//         time: "2:38 PM",
//       },
//       {
//         type: "other",
//         text: "Perfect! How about 4 PM today?",
//         time: "2:39 PM",
//       },
//     ],
//   },
//   "Linh Tran": {
//     avatar:
//       "https://i.pinimg.com/736x/06/22/c7/0622c7b35454a3916004f7f3b56e52ad.jpg",
//     status: "Online",
//     messages: [
//       { type: "other", text: "Thanks for the match! 💕", time: "Yesterday" },
//       {
//         type: "self",
//         text: "You're welcome! Nice to meet you",
//         time: "Yesterday",
//       },
//       {
//         type: "other",
//         text: "I love your photos! Where was that beach pic taken?",
//         time: "Yesterday",
//       },
//       {
//         type: "self",
//         text: "That was in Da Nang! Have you been there?",
//         time: "Yesterday",
//       },
//       {
//         type: "other",
//         text: "Not yet, but it's on my bucket list! 🏖️",
//         time: "Yesterday",
//       },
//     ],
//   },
//   "Thu Nguyen": {
//     avatar:
//       "https://i.pinimg.com/736x/38/fd/07/38fd076e6cf0e13ba30b44034ea5f2b9.jpg",
//     status: "Last seen 2 hours ago",
//     messages: [
//       { type: "other", text: "Nice to meet you! 😊", time: "3 days ago" },
//       { type: "self", text: "Nice to meet you too!", time: "3 days ago" },
//       {
//         type: "other",
//         text: "I see you're into art too! What's your favorite medium?",
//         time: "3 days ago",
//       },
//       {
//         type: "self",
//         text: "I love digital art and photography. How about you?",
//         time: "3 days ago",
//       },
//       {
//         type: "other",
//         text: "Watercolor painting is my passion! 🎨",
//         time: "3 days ago",
//       },
//     ],
//   },
//   "Mai Anh": {
//     avatar:
//       "https://i.pinimg.com/736x/51/4e/34/514e34ef914b74aff29eab6d6f51f077.jpg",
//     status: "Last seen 1 week ago",
//     messages: [
//       {
//         type: "other",
//         text: "Love your photos! You have great taste 📸",
//         time: "1 week ago",
//       },
//       {
//         type: "self",
//         text: "Thank you so much! That means a lot",
//         time: "1 week ago",
//       },
//       {
//         type: "other",
//         text: "Do you do professional photography?",
//         time: "1 week ago",
//       },
//       {
//         type: "self",
//         text: "Just as a hobby for now, but I'm thinking about it!",
//         time: "1 week ago",
//       },
//     ],
//   },
// };
// // Function to open chat from match item
// function openChatFromMatch(name) {
//   openChat(name);
//   showTab("messages");
//   showIndividualChat();
// }
// // Update openChat function
// function openChat(name) {
//   currentChatUser = name;

//   const chatName = document.getElementById("current-chat-name");
//   const chatStatus = document.getElementById("current-chat-status");
//   const chatAvatar = document.querySelector(".chat-avatar");
//   const chatBody = document.getElementById("chat-body");

//   // Get profile info
//   const profile = chatProfiles[name];

//   if (profile) {
//     // Update header info
//     if (chatName) chatName.textContent = name;
//     if (chatStatus) chatStatus.textContent = profile.status;
//     if (chatAvatar) chatAvatar.src = profile.avatar;

//     // Clear and update messages
//     if (chatBody) {
//       chatBody.innerHTML = "";

//       profile.messages.forEach((msg) => {
//         const messageElement = document.createElement("div");
//         messageElement.className = `message ${msg.type}`;
//         messageElement.innerHTML = `
//           ${msg.text}
//           <div class="message-time">${msg.time}</div>
//         `;
//         chatBody.appendChild(messageElement);
//       });

//       chatBody.scrollTop = chatBody.scrollHeight;
//     }
//   }
// }

// // Enhanced card swiping with touch support
// let startX = 0;
// let startY = 0;
// let currentX = 0;
// let currentY = 0;
// let isDragging = false;

// function initializeSwipeGestures() {
//   const card = document.getElementById("dating-card");
//   if (!card) return;

//   // Touch events
//   card.addEventListener("touchstart", handleTouchStart, { passive: false });
//   card.addEventListener("touchmove", handleTouchMove, { passive: false });
//   card.addEventListener("touchend", handleTouchEnd, { passive: false });

//   // Mouse events for desktop
//   card.addEventListener("mousedown", handleMouseDown);
//   card.addEventListener("mousemove", handleMouseMove);
//   card.addEventListener("mouseup", handleMouseUp);
//   card.addEventListener("mouseleave", handleMouseUp);
// }

// function handleTouchStart(e) {
//   startX = e.touches[0].clientX;
//   startY = e.touches[0].clientY;
//   isDragging = true;
// }

// function handleTouchMove(e) {
//   if (!isDragging) return;
//   e.preventDefault();

//   currentX = e.touches[0].clientX - startX;
//   currentY = e.touches[0].clientY - startY;

//   updateCardPosition();
// }

// function handleTouchEnd(e) {
//   if (!isDragging) return;
//   isDragging = false;

//   const threshold = 100;
//   if (Math.abs(currentX) > threshold) {
//     if (currentX > 0) {
//       swipeCard("like");
//     } else {
//       swipeCard("dislike");
//     }
//   } else if (currentY < -threshold) {
//     swipeCard("super-like");
//   } else {
//     resetCardPosition();
//   }
// }

// function handleMouseDown(e) {
//   startX = e.clientX;
//   startY = e.clientY;
//   isDragging = true;
// }

// function handleMouseMove(e) {
//   if (!isDragging) return;

//   currentX = e.clientX - startX;
//   currentY = e.clientY - startY;

//   updateCardPosition();
// }

// function handleMouseUp(e) {
//   if (!isDragging) return;
//   isDragging = false;

//   const threshold = 100;
//   if (Math.abs(currentX) > threshold) {
//     if (currentX > 0) {
//       swipeCard("like");
//     } else {
//       swipeCard("dislike");
//     }
//   } else if (currentY < -threshold) {
//     swipeCard("super-like");
//   } else {
//     resetCardPosition();
//   }
// }

// function updateCardPosition() {
//   const card = document.getElementById("dating-card");
//   if (!card) return;

//   const rotation = currentX * 0.1;
//   const opacity = 1 - Math.abs(currentX) / 300;

//   card.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${rotation}deg)`;
//   card.style.opacity = Math.max(opacity, 0.5);
// }

// function resetCardPosition() {
//   const card = document.getElementById("dating-card");
//   if (!card) return;

//   card.style.transform = "";
//   card.style.opacity = "";
//   currentX = 0;
//   currentY = 0;
// }

// // Enhanced card swiping functionality
// function swipeCard(action) {
//   const card = document.getElementById("dating-card");
//   if (!card) return;

//   // Add swipe animation
//   if (action === "like") {
//     card.style.transform = "translateX(100%) rotate(20deg)";
//     card.style.opacity = "0";

//     // Random chance for match (20% probability)
//     const matchChance = Math.random();
//     if (matchChance < 0.2) {
//       setTimeout(() => showMatchAnimation(), 500);
//     } else {
//       showLikeAnimation();
//     }
//   } else if (action === "dislike") {
//     card.style.transform = "translateX(-100%) rotate(-20deg)";
//     card.style.opacity = "0";
//   } else if (action === "super-like") {
//     card.style.transform = "translateY(-100%) rotate(10deg)";
//     card.style.opacity = "0";
//     showSuperLikeAnimation();
//   }

//   // Load next card after animation
//   setTimeout(() => {
//     loadNextCard();
//   }, 600);
// }

// Sample profiles for card rotation
// const profiles = [
//   {
//     name: "Nguyễn Hà My",
//     age: 21,
//     distance: "5km",
//     image: "https://i.pinimg.com/736x/e5/fc/a5/e5fca56c7194668b0e4c8a47f0f0b64a.jpg",
//     hobbies: ["Photography", "Travel", "Music", "Coffee"],
//   },
//   {
//     name: "Trần Linh Chi",
//     age: 23,
//     distance: "3km",
//     image: "https://i.pinimg.com/736x/06/22/c7/0622c7b35454a3916004f7f3b56e52ad.jpg",
//     hobbies: ["Yoga", "Reading", "Cooking", "Dancing"],
//   },
//   {
//     name: "Lê Thu Hương",
//     age: 20,
//     distance: "7km",
//     image: "https://i.pinimg.com/736x/38/fd/07/38fd076e6cf0e13ba30b44034ea5f2b9.jpg",
//     hobbies: ["Art", "Movies", "Hiking", "Gaming"],
//   },
//   {
//     name: "Phạm Mai Anh",
//     age: 22,
//     distance: "4km",
//     image: "https://i.pinimg.com/736x/51/4e/34/514e34ef914b74aff29eab6d6f51f077.jpg",
//     hobbies: ["Fashion", "Fitness", "Travel", "Photography"],
//   },
//   {
//     name: "Vũ Thanh Hà",
//     age: 24,
//     distance: "6km",
//     image: "https://i.pinimg.com/736x/5d/0e/75/5d0e7559bfa500cf385382ef6147655f.jpg",
//     hobbies: ["Music", "Writing", "Cats", "Coffee"],
//   },
// ]

// let currentProfileIndex = 0;

// function loadNextCard() {
//   currentProfileIndex = (currentProfileIndex + 1) % profiles.length;
//   const profile = profiles[currentProfileIndex];

//   const card = document.getElementById("dating-card");
//   if (!card) return;

//   // Update card content
//   const cardImage = card.querySelector(".card-image");
//   const cardName = card.querySelector(".card-name");
//   const cardDetails = card.querySelector(".card-details");
//   const cardHobbies = card.querySelector(".card-hobbies");

//   if (cardImage) cardImage.src = profile.image;
//   if (cardName) cardName.textContent = profile.name;
//   if (cardDetails)
//     cardDetails.textContent = `${profile.age} years old • ${profile.distance} away`;

//   if (cardHobbies) {
//     cardHobbies.innerHTML = "";
//     profile.hobbies.forEach((hobby) => {
//       const hobbyTag = document.createElement("span");
//       hobbyTag.className = "hobby-tag";
//       hobbyTag.textContent = hobby;
//       cardHobbies.appendChild(hobbyTag);
//     });
//   }

//   // Reset card position and opacity
//   card.style.transform = "";
//   card.style.opacity = "";
//   currentX = 0;
//   currentY = 0;

//   // Add entrance animation
//   card.style.animation = "slideIn 0.6s ease-out";
//   setTimeout(() => {
//     card.style.animation = "";
//   }, 600);
// }

// // Animation functions
// function showMatchAnimation() {
//   // Create match overlay
//   const overlay = document.createElement("div");
//   overlay.className = "match-overlay";
//   overlay.innerHTML = `
//     <div class="match-content">
//       <h2>It's a Match! 💕</h2>
//       <p>You and ${profiles[currentProfileIndex].name} liked each other</p>
//       <div class="match-actions">
//         <button onclick="closeMatchOverlay()" class="match-btn secondary">Keep Swiping</button>
//         <button onclick="openChatFromMatch()" class="match-btn primary">Send Message</button>
//       </div>
//     </div>
//   `;

//   // Add styles
//   overlay.style.cssText = `
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(255, 107, 157, 0.95);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 10000;
//     animation: fadeIn 0.5s ease-out;
//   `;

//   document.body.appendChild(overlay);
// }

// function showLikeAnimation() {
//   showFloatingIcon("❤️", "#ff6b9d");
// }

// function showSuperLikeAnimation() {
//   showFloatingIcon("⭐", "#74b9ff");
// }

// function showFloatingIcon(icon, color) {
//   const floatingIcon = document.createElement("div");
//   floatingIcon.textContent = icon;
//   floatingIcon.style.cssText = `
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     font-size: 60px;
//     color: ${color};
//     z-index: 1000;
//     animation: floatUp 1s ease-out forwards;
//     pointer-events: none;
//   `;

//   document.body.appendChild(floatingIcon);

//   setTimeout(() => {
//     document.body.removeChild(floatingIcon);
//   }, 1000);
// }

function closeMatchOverlay() {
  const overlay = document.querySelector(".match-overlay");
  if (overlay) {
    overlay.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  }
}

function openChatFromMatch(name) {
  console.log("Open chat for:", name);
  openChat(name);
  showTab("messages");
  showIndividualChat();
}

// Enhanced search modal functionality
function openSearchModal() {
  const modal = document.createElement("div");
  modal.className = "search-modal";
  modal.innerHTML = `
    <div class="search-modal-content">
      <div class="search-modal-header">
        <h2><i class="fas fa-search"></i> Find Your Perfect Match</h2>
        <button class="search-close-btn" onclick="closeSearchModal()">&times;</button>
      </div>
      <div class="search-modal-body">
        <div class="search-section">
          <h3><i class="fas fa-user"></i> Basic Preferences</h3>
          <div class="search-input-group">
            <label>Age Range</label>
            <div class="range-input-group">
              <input type="number" placeholder="18" min="18" max="100">
              <span class="range-separator">to</span>
              <input type="number" placeholder="35" min="18" max="100">
            </div>
          </div>
          <div class="search-input-group">
            <label>Gender</label>
            <select>
              <option>Everyone</option>
              <option>Women</option>
              <option>Men</option>
              <option>Non-binary</option>
            </select>
          </div>
        </div>

        <div class="search-section">
          <h3><i class="fas fa-map-marker-alt"></i> Location & Distance</h3>
          <div class="search-input-group">
            <label>Maximum Distance</label>
            <div class="distance-options">
              <div class="distance-option active">5km</div>
              <div class="distance-option">10km</div>
              <div class="distance-option">25km</div>
              <div class="distance-option">50km</div>
              <div class="distance-option">100km</div>
              <div class="distance-option">Global</div>
            </div>
          </div>
        </div>

        <div class="search-section">
          <h3><i class="fas fa-heart"></i> Interests & Hobbies</h3>
          <div class="search-tags">
            <div class="search-tag">🎵 Music</div>
            <div class="search-tag">📸 Photography</div>
            <div class="search-tag">✈️ Travel</div>
            <div class="search-tag">🍳 Cooking</div>
            <div class="search-tag">🎮 Gaming</div>
            <div class="search-tag">📚 Reading</div>
            <div class="search-tag">🏃‍♀️ Fitness</div>
            <div class="search-tag">🎨 Art</div>
            <div class="search-tag">🎬 Movies</div>
            <div class="search-tag">☕ Coffee</div>
            <div class="search-tag">🧘‍♀️ Yoga</div>
            <div class="search-tag">🌱 Nature</div>
          </div>
        </div>

        <div class="search-section">
          <h3><i class="fas fa-graduation-cap"></i> Lifestyle</h3>
          <div class="search-input-group">
            <label>Education Level</label>
            <select>
              <option>Any</option>
              <option>High School</option>
              <option>Some College</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>PhD</option>
            </select>
          </div>
          <div class="search-input-group">
            <label>Occupation</label>
            <input type="text" placeholder="e.g., Software Engineer, Teacher, Artist...">
          </div>
        </div>
      </div>
      <div class="search-buttons">
        <button class="search-btn secondary" onclick="resetSearchFilters()">
          <i class="fas fa-undo"></i> Reset
        </button>
        <button class="search-btn primary" onclick="applySearchFilters()">
          <i class="fas fa-search"></i> Find Matches
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listeners for interactive elements
  addSearchModalEventListeners();

  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function addSearchModalEventListeners() {
  // Distance options
  document.querySelectorAll(".distance-option").forEach((option) => {
    option.addEventListener("click", function () {
      document
        .querySelectorAll(".distance-option")
        .forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Interest tags
  document.querySelectorAll(".search-tag").forEach((tag) => {
    tag.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  // Close modal when clicking outside
  document
    .querySelector(".search-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeSearchModal();
      }
    });
}

function closeSearchModal() {
  const modal = document.querySelector(".search-modal");
  if (modal) {
    modal.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = "";
    }, 300);
  }
}

function resetSearchFilters() {
  // Reset all form inputs
  document.querySelectorAll(".search-modal input").forEach((input) => {
    input.value = "";
  });
  document.querySelectorAll(".search-modal select").forEach((select) => {
    select.selectedIndex = 0;
  });

  // Reset active states
  document
    .querySelectorAll(".distance-option")
    .forEach((opt) => opt.classList.remove("active"));
  document.querySelector(".distance-option").classList.add("active");

  document
    .querySelectorAll(".search-tag")
    .forEach((tag) => tag.classList.remove("active"));
}

function applySearchFilters() {
  // Get selected filters
  const selectedInterests = Array.from(
    document.querySelectorAll(".search-tag.active")
  ).map((tag) => tag.textContent.trim());
  const selectedDistance = document.querySelector(
    ".distance-option.active"
  )?.textContent;

  // Show loading state
  const applyBtn = document.querySelector(".search-btn.primary");
  const originalText = applyBtn.innerHTML;
  applyBtn.innerHTML = '<div class="loading"></div> Searching...';
  applyBtn.disabled = true;

  // Simulate search delay
  setTimeout(() => {
    closeSearchModal();
    showSearchResults(selectedInterests, selectedDistance);
  }, 2000);
}

function showSearchResults(interests, distance) {
  // Create results notification
  const notification = document.createElement("div");
  notification.className = "search-results-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <h4>Search Complete!</h4>
      <p>Found ${
        Math.floor(Math.random() * 50) + 10
      } potential matches within ${distance}</p>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border: 2px solid var(--primary-solid);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--shadow-heavy);
    z-index: 1000;
    animation: slideInRight 0.5s ease-out;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease-out";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

function closeChatOptions() {
  const menu = document.querySelector(".chat-options-menu");
  if (menu) {
    document.body.removeChild(menu);
  }
}

function viewProfile() {
  closeChatOptions();
  // Implement profile viewing logic
  console.log("Viewing profile of", currentChatUser);
}

function muteChat() {
  closeChatOptions();
  showNotification(
    "Chat muted",
    "You won't receive notifications from this chat"
  );
}

function archiveChat() {
  closeChatOptions();
  showNotification(
    "Chat archived",
    "This chat has been moved to your archived conversations"
  );
}

// function blockUser() {
//   closeChatOptions();
//   if (confirm(`Are you sure you want to block ${currentChatUser}?`)) {
//     showNotification(
//       "User blocked",
//       `${currentChatUser} has been blocked and removed from your matches`
//     );
//   }
// }

// function reportUser() {
//   closeChatOptions();
//   if (confirm(`Report ${currentChatUser} for inappropriate behavior?`)) {
//     showNotification(
//       "Report submitted",
//       "Thank you for helping keep our community safe"
//     );
//   }
// }

function showNotification(title, message) {
  const notification = document.createElement("div");
  notification.className = "app-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border-left: 4px solid var(--primary-solid);
    border-radius: var(--border-radius);
    padding: 15px 20px;
    box-shadow: var(--shadow-medium);
    z-index: 1000;
    animation: slideInRight 0.5s ease-out;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease-out";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Auto-resize textarea function
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
}

// Enhanced message sending setup
function setupMessageSending() {
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");

  if (chatInput && sendBtn) {
    // Auto-resize textarea
    chatInput.addEventListener("input", function () {
      autoResizeTextarea(this);
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendBtn.addEventListener("click", sendMessage);
  }
}

// Enhanced send message function
function sendMessage() {
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");

  if (!chatInput || !chatBody) return;

  const messageText = chatInput.value.trim();
  if (!messageText) return;

  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = "message self";
  messageElement.innerHTML = `
    ${messageText.replace(/\n/g, "<br>")}
    <div class="message-time">${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}</div>
  `;

  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Clear input and reset height
  chatInput.value = "";
  chatInput.style.height = "auto";

  // Show typing indicator
  setTimeout(() => {
    showTypingIndicator();
  }, 1000);

  // Simulate response
  setTimeout(() => {
    hideTypingIndicator();
    sendAutoReply();
  }, 3000);
}

// Typing indicator functions
function showTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.style.display = "block";
  }
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.style.display = "none";
  }
}

// Auto-reply function
function sendAutoReply() {
  const chatBody = document.getElementById("chat-body");
  if (!chatBody) return;

  const replyMessage = document.createElement("div");
  replyMessage.className = "message other";
  replyMessage.innerHTML = `
    <span>Users who have been blocked cannot view news</span>
    <div class="message-time">${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}</div> 
  `;

  chatBody.appendChild(replyMessage);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle mobile viewport and prevent zoom on input focus
function handleMobileViewport() {
  // Prevent zoom on input focus for iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        document
          .querySelector("meta[name=viewport]")
          .setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          );
      });

      input.addEventListener("blur", () => {
        document
          .querySelector("meta[name=viewport]")
          .setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
          );
      });
    });
  }
}

// Help function
function showHelp() {
  showNotification(
    "Help & Support",
    "Contact us at support@perfectmatch.com or visit our FAQ section"
  );
}

// Add CSS animations
const additionalStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }

  @keyframes floatUp {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -150%) scale(1.5);
    }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  .match-content {
    text-align: center;
    color: white;
    max-width: 400px;
    padding: 40px;
  }

  .match-content h2 {
    font-size: 36px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }

  .match-content p {
    font-size: 18px;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .match-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .match-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .match-btn.primary {
    background: white;
    color: var(--primary-solid);
  }

  .match-btn.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .match-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  .app-notification .notification-content h4 {
    color: var(--text-primary);
    font-size: 16px;
    margin-bottom: 5px;
  }

  .app-notification .notification-content p {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0;
  }
`;

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  // initializeSwipeGestures();
  setupMessageSending();
  handleMobileViewport();

  // Add additional styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);

  // Initialize with first profile
  // loadNextCard();

  // Set default active states
  const defaultNavIcon = document.querySelector(
    ".nav-icon[onclick=\"showTab('dating')\"]"
  );
  const defaultBottomNavItem = document.querySelector(
    ".bottom-nav-item[onclick=\"showTab('dating')\"]"
  );

  if (defaultNavIcon) defaultNavIcon.classList.add("active");
  if (defaultBottomNavItem) defaultBottomNavItem.classList.add("active");
})


// Blocking Modal Functions
function showBlockingModal() {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-user-slash"></i> Manage Blocked Users</h2>
                <button class="modal-close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 30px;">
                    <h3 style="color: var(--text-primary); margin-bottom: 15px;">Currently Blocked (${blockedUsers.length})</h3>
                    ${
                      blockedUsers.length === 0
                        ? '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No blocked users</p>'
                        : blockedUsers
                            .map(
                              (user) => `
                            <div class="blocked-user-item">
                                <img src="${user.avatar}" alt="${user.name}" class="blocked-user-avatar">
                                <div class="blocked-user-info">
                                    <div class="blocked-user-name">${user.name}</div>
                                    <div class="blocked-user-date">Blocked on ${new Date(user.blockedDate).toLocaleDateString()}</div>
                                </div>
                                <button class="unblock-btn" onclick="unblockUser('${user.name}')">
                                    <i class="fas fa-unlock"></i> Unblock
                                </button>
                            </div>
                        `,
                            )
                            .join("")
                    }
                </div>
                
                <div>
                    <h3 style="color: var(--text-primary); margin-bottom: 15px;">Block Someone New</h3>
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="block-search" placeholder="Search friends to block..." 
                               style="width: 100%; padding: 12px 16px; border: 2px solid var(--secondary); border-radius: 12px; font-size: 15px;">
                    </div>
                    <div id="friends-to-block">
                        ${profiles
                          .map(
                            (profile) => `
                            <div class="blocked-user-item" style="background: var(--card-bg);">
                                <img src="${profile.image}" alt="${profile.name}" class="blocked-user-avatar">
                                <div class="blocked-user-info">
                                    <div class="blocked-user-name">${profile.name}</div>
                                    <div class="blocked-user-date">${profile.age} years old • ${profile.distance} away</div>
                                </div>
                                <button class="modal-btn danger" onclick="blockUser('${profile.name}', '${profile.image}')" style="padding: 8px 16px; font-size: 14px;">
                                    <i class="fas fa-user-slash"></i> Block
                                </button>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        </div>
    `

  document.body.appendChild(modal)
}

function blockUser(name, avatar) {
  // Add to blocked users
  blockedUsers.push({
    name: name,
    avatar: avatar,
    blockedDate: new Date().toISOString().split("T")[0],
  })

  // Show confirmation
  showNotification(`${name} has been blocked`, "warning")

  // Close modal and refresh
  closeModal(document.querySelector(".modal-overlay .modal-close-btn"))

  // Optionally refresh the blocking modal if it's still open
  setTimeout(() => {
    if (document.querySelector(".modal-overlay")) {
      showBlockingModal()
    }
  }, 100)
}

function unblockUser(name) {
  // Remove from blocked users
  const index = blockedUsers.findIndex((user) => user.name === name)
  if (index > -1) {
    blockedUsers.splice(index, 1)
    showNotification(`${name} has been unblocked`, "success")

    // Refresh the modal
    closeModal(document.querySelector(".modal-overlay .modal-close-btn"))
    setTimeout(() => showBlockingModal(), 100)
  }
}

// Activity Modal Functions
function showActivityModal() {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-chart-line"></i> Your Activity</h2>
                <button class="modal-close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="activity-stats">
                    <div class="activity-stat-card">
                        <div class="activity-stat-number">${activityData.profileViews}</div>
                        <div class="activity-stat-label">Profile Views</div>
                    </div>
                    <div class="activity-stat-card">
                        <div class="activity-stat-number">${activityData.likes}</div>
                        <div class="activity-stat-label">Likes Given</div>
                    </div>
                    <div class="activity-stat-card">
                        <div class="activity-stat-number">${activityData.matches}</div>
                        <div class="activity-stat-label">Total Matches</div>
                    </div>
                    <div class="activity-stat-card">
                        <div class="activity-stat-number">${activityData.messages}</div>
                        <div class="activity-stat-label">Messages Sent</div>
                    </div>
                    <div class="activity-stat-card">
                        <div class="activity-stat-number">${activityData.swipes}</div>
                        <div class="activity-stat-label">Total Swipes</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3 style="color: var(--text-primary); margin-bottom: 20px;">Recent Activity</h3>
                    <div style="space-y: 15px;">
                        <div style="display: flex; align-items: center; padding: 15px; background: var(--secondary); border-radius: 12px; margin-bottom: 10px;">
                            <div style="width: 40px; height: 40px; background: var(--primary-solid); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                <i class="fas fa-eye" style="color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--text-primary);">Profile Views</div>
                                <div style="font-size: 14px; color: var(--text-secondary);">Your profile was viewed 15 times today</div>
                            </div>
                            <div style="font-size: 12px; color: var(--text-light);">2 hours ago</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; padding: 15px; background: var(--secondary); border-radius: 12px; margin-bottom: 10px;">
                            <div style="width: 40px; height: 40px; background: #ff6b9d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                <i class="fas fa-heart" style="color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--text-primary);">New Match</div>
                                <div style="font-size: 14px; color: var(--text-secondary);">You matched with Hà My</div>
                            </div>
                            <div style="font-size: 12px; color: var(--text-light);">5 hours ago</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; padding: 15px; background: var(--secondary); border-radius: 12px; margin-bottom: 10px;">
                            <div style="width: 40px; height: 40px; background: #74b9ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                <i class="fas fa-star" style="color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--text-primary);">Super Like Received</div>
                                <div style="font-size: 14px; color: var(--text-secondary);">Someone super liked your profile!</div>
                            </div>
                            <div style="font-size: 12px; color: var(--text-light);">1 day ago</div>
                        </div>
                        
                        <div style="display: flex; align-items: center; padding: 15px; background: var(--secondary); border-radius: 12px;">
                            <div style="width: 40px; height: 40px; background: #00b894; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                <i class="fas fa-comments" style="color: white;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: var(--text-primary);">Messages</div>
                                <div style="font-size: 14px; color: var(--text-secondary);">You sent 12 messages today</div>
                            </div>
                            <div style="font-size: 12px; color: var(--text-light);">Today</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

  document.body.appendChild(modal)
}



// Logout Modal Functions
function showLogoutModal() {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2><i class="fas fa-sign-out-alt"></i> Log Out</h2>
                <button class="modal-close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 48px; color: var(--primary-solid); margin-bottom: 20px;">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <h3 style="color: var(--text-primary); margin-bottom: 15px;">Are you sure you want to log out?</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5;">
                        You'll need to log back in to access your account and continue chatting with your matches.
                    </p>
                </div>
            </div>
            <div class="modal-buttons">
                <button type="button" class="modal-btn secondary" onclick="closeModal(this)">Cancel</button>
                <button type="button" class="modal-btn primary" onclick="performLogout()" style="background: #ff6b9d;">Log Out</button>
            </div>
        </div>
    `

  document.body.appendChild(modal)
}

function performLogout() {
  // Show loading state
  showNotification("Logging out...", "info")

  // Simulate logout process
  setTimeout(() => {
    // In a real app, this would:
    // 1. Clear authentication tokens
    // 2. Clear user data from localStorage
    // 3. Redirect to login page

    showNotification("Successfully logged out!", "success")
    closeModal(document.querySelector(".modal-overlay .modal-close-btn"))

    // Simulate redirect to login (in a real app)
    setTimeout(() => {
      alert("In a real app, you would be redirected to the login page now.")
    }, 1000)
  }, 1500)
}

// Delete Account Modal Functions
function showDeleteAccountModal() {
  const modal = document.createElement("div")
  modal.className = "modal-overlay"
  modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header" style="background: #ff4757;">
                <h2><i class="fas fa-exclamation-triangle"></i> Delete Account</h2>
                <button class="modal-close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 48px; color: #ff4757; margin-bottom: 20px;">
                        <i class="fas fa-user-times"></i>
                    </div>
                    <h3 style="color: var(--text-primary); margin-bottom: 15px;">This action cannot be undone!</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5; margin-bottom: 20px;">
                        Deleting your account will permanently remove all your data, including:
                    </p>
                    
                    <div style="text-align: left; background: var(--secondary); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><i class="fas fa-heart" style="color: #ff4757; margin-right: 10px;"></i> All your matches and conversations</li>
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><i class="fas fa-user" style="color: #ff4757; margin-right: 10px;"></i> Your profile and photos</li>
                            <li style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><i class="fas fa-crown" style="color: #ff4757; margin-right: 10px;"></i> Premium subscription benefits</li>
                            <li style="padding: 8px 0;"><i class="fas fa-chart-line" style="color: #ff4757; margin-right: 10px;"></i> All activity history</li>
                        </ul>
                    </div>
                    
                    <div style="background: rgba(255, 71, 87, 0.1); border: 2px solid #ff4757; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <p style="color: #ff4757; font-weight: 600; margin: 0;">
                            <i class="fas fa-exclamation-triangle"></i> 
                            This action is permanent and cannot be reversed!
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label for="delete-confirmation" style="display: block; color: var(--text-primary); font-weight: 600; margin-bottom: 10px;">
                            Type "DELETE" to confirm:
                        </label>
                        <input type="text" id="delete-confirmation" placeholder="Type DELETE here..." 
                               style="width: 100%; padding: 12px; border: 2px solid #ff4757; border-radius: 8px; text-align: center; font-weight: 600;">
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button type="button" class="modal-btn secondary" onclick="closeModal(this)">Cancel</button>
                <button type="button" class="modal-btn danger" onclick="confirmDeleteAccount()" id="delete-confirm-btn" disabled>Delete My Account</button>
            </div>
        </div>
    `

  document.body.appendChild(modal)

  // Add event listener for confirmation input
  const confirmInput = document.getElementById("delete-confirmation")
  const deleteBtn = document.getElementById("delete-confirm-btn")

  confirmInput.addEventListener("input", function () {
    if (this.value.toUpperCase() === "DELETE") {
      deleteBtn.disabled = false
      deleteBtn.style.opacity = "1"
    } else {
      deleteBtn.disabled = true
      deleteBtn.style.opacity = "0.5"
    }
  })
}


function confirmDeleteAccount() {
  const confirmInput = document.getElementById("delete-confirmation")

  if (confirmInput.value.toUpperCase() !== "DELETE") {
    showNotification('Please type "DELETE" to confirm', "error")
    return
  }

  // Show loading state
  showNotification("Deleting account...", "info")

  // Simulate account deletion process
  setTimeout(() => {
    // In a real app, this would:
    // 1. Send delete request to server
    // 2. Clear all local data
    // 3. Redirect to goodbye page

    showNotification("Account deleted successfully", "success")
    closeModal(document.querySelector(".modal-overlay .modal-close-btn"))

    // Simulate redirect (in a real app)
    setTimeout(() => {
      alert("Your account has been permanently deleted. In a real app, you would be redirected to a goodbye page.")
    }, 1000)
  }, 2000)
}
