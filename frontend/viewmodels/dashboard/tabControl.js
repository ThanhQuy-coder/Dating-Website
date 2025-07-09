export function showTab(tabName, event = null) {
  closeMobileMenu();

  document.querySelectorAll(".nav-icon").forEach((icon) => {
    icon.classList.remove("active");
  });

  document.querySelectorAll(".bottom-nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (event && event.target) {
    const clickedElement =
      event.target.closest(".nav-icon") ||
      event.target.closest(".bottom-nav-item");
    if (clickedElement) {
      clickedElement.classList.add("active");
    }
  }

  document.querySelectorAll(".main-content .tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  document.querySelectorAll(".tab-content .tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  const targetTab = document.getElementById(tabName + "-tab");
  if (targetTab) {
    targetTab.classList.add("active");
  }

  const matchesSidebar = document.getElementById("matches-sidebar");
  const notificationsSidebar = document.getElementById("notifications-sidebar");

  if (tabName === "dating") {
    matchesSidebar?.classList.add("active");
  } else if (tabName === "notifications") {
    notificationsSidebar?.classList.add("active");
  } else {
    matchesSidebar?.classList.remove("active");
    notificationsSidebar?.classList.remove("active");
  }

  if (
    tabName === "messages" ||
    tabName === "profile" ||
    tabName === "settings" ||
    tabName === "premium"
  ) {
    matchesSidebar?.classList.add("active");
    showChatList();
  }
}

export function showChatList() {
  const chatListView = document.getElementById("chat-list-view");
  const individualChatView = document.getElementById("individual-chat-view");

  if (chatListView && individualChatView) {
    chatListView.style.display = "flex";
    individualChatView.style.display = "none";
  }
}

export function showIndividualChat() {
  const chatListView = document.getElementById("chat-list-view");
  const individualChatView = document.getElementById("individual-chat-view");

  if (chatListView && individualChatView) {
    chatListView.style.display = "none";
    individualChatView.style.display = "flex";
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");

  mobileMenu?.classList.remove("active");
  overlay?.classList.remove("active");
  document.body.style.overflow = "";
}

window.showTab = showTab;
window.showChatList = showChatList;
