// Global state
let currentPage = 1;
let usersPerPage = 10;
let allReports = []; // dùng để lưu tất cả dữ liệu
let currentUserFilter = 'all';
let currentReportFilter = 'all';
let currentReportTypeFilter = 'all';


let totalPages = 5;

// Dữ liệu từ backend
let users = [];
let reports = [];


// Import các hàm cần thiết
import { adminModel } from '../models/adminModel.js';

import { loadDashboard } from './admin/dashboardViewModel.js';
import { 
    getUserGrowthData, 
    getDailyActivityData, 
    getRecentActivity
} from './admin/dashboardViewModel.js';


async function loadRecentActivity() {
  try {
    const activities = await adminModel.getRecentActivities();
    renderRecentActivity(activities);
  } catch {
    renderRecentActivity([]); // fallback   
  }
}





// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUsersData();
    initializeDashboard();
    setupEventListeners();
});

function initializeDashboard() {
    loadUsersData();
    loadDashboard();
    drawCharts();
    animateStats();
}

function showEditUserModal(user) {
  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editUserModal').style.display = 'block';
}



document.getElementById('editUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editUserId').value;
  const username = document.getElementById('editUsername').value;
  const email = document.getElementById('editEmail').value;

  const res = await adminModel.updateUserInfo(id, username, email);
  if (res.success) {
    alert('Cập nhật thành công!');
    closeModal('editUserModal');
    loadUsersData();
  } else {
    alert('Cập nhật thất bại!');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // ✅ Xử lý đăng xuất
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminToken');
      // hoặc các key liên quan như adminName, v.v.

      // 👉 Redirect về trang đăng nhập
      window.location.href = '/index.php?page=login';
    });
  }
});




function setupEventListeners() {
    // User Search Input
    const userSearchInput = document.getElementById('userSearch');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }

    // User Filter Dropdown
    const userFilter = document.getElementById('userFilter');
    if (userFilter) {
        userFilter.addEventListener('change', function(e) {
            currentUserFilter = e.target.value;
            loadUsersData();
        });
    }

    // Report Status Filter
    const reportFilter = document.getElementById('reportFilter');
    if (reportFilter) {
        reportFilter.addEventListener('change', function(e) {
            currentReportFilter = e.target.value;
            loadReports();
        });
    }

    // Report Type Filter
    const reportTypeFilter = document.getElementById('reportTypeFilter');
    if (reportTypeFilter) {
        reportTypeFilter.addEventListener('change', function(e) {
            currentReportTypeFilter = e.target.value;
            loadReports();
        });
    }

    // Global Search Input
    const globalSearchInput = document.getElementById('globalSearch');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            globalSearch(searchTerm);
        });
    }

    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewUserSubmit();
        });
    }

    // Analytics time range
    const analyticsTimeRange = document.getElementById('analyticsTimeRange');
    if (analyticsTimeRange) {
        analyticsTimeRange.addEventListener('change', function() {
            drawAnalyticsCharts();
        });
    }

    // Sidebar navigation links
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            showSection(sectionName, this);
        });
    });
}

// Navigation functions
function showSection(sectionName, clickedLink) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) selectedSection.classList.add('active');

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (clickedLink) clickedLink.classList.add('active');

    // Update page title
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Tổng quan hệ thống' },
        users: { title: 'Quản lý người dùng', subtitle: 'Quản lý tài khoản và thông tin người dùng' },
        reports: { title: 'Báo cáo vi phạm', subtitle: 'Xử lý các báo cáo từ người dùng' }
    };

    const pageInfo = titles[sectionName];
    if (pageInfo) {
        document.getElementById('pageTitle').textContent = pageInfo.title;
        document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
    }

    // Close mobile menu
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    sidebar?.classList.remove('mobile-open');
    toggle?.classList.remove('active');

    // Section-specific logic
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            loadRecentActivity();
            drawCharts();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    sidebar.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
        toggle.classList.remove('active');
    }
});

// Data loading functions
async function loadUsersData() {
    try {
        users = await adminModel.getUsers();
        let filteredUsers = [...users];
        
        if (currentUserFilter !== 'all') {
            filteredUsers = filteredUsers.filter(u => u.status === currentUserFilter);
        }
        
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        renderUsersTable(paginatedUsers);
        updatePagination(Math.ceil(filteredUsers.length / usersPerPage));
    } catch (err) {
        console.error('Lỗi khi tải người dùng:', err);
        users = [];
        alert('Không thể tải danh sách người dùng!');
    }
}



// Render functions
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td><input type="checkbox" value="${user.id}" onchange="updateSelectAllState()"></td>
            <td>
                <div class="user-info">
                    <img src="https://via.placeholder.com/40" class="user-avatar" alt="${user.username}">
                    <div class="user-details">
                        <h4>${user.username}</h4>
                        <p>ID: ${user.id}</p>
                    </div>
                </div>
            </td>
            <td class="hide-mobile">${user.email}</td>
            <td class="hide-mobile">N/A</td>
            <td class="hide-mobile">N/A</td>
            <td>
                <span class="status-badge status-${user.status}">
                    ${getStatusText(user.status)}
                </span>
            </td>
            <td class="hide-mobile">N/A</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewUser(${user.id})">👁️ Xem</button>
                    <button class="action-btn btn-edit" onclick="editUser(${user.id})">✏️ Sửa</button>
                    <button class="action-btn btn-ban" onclick="banUser(${user.id})">${user.status === 'banned' ? '🔓 Bỏ cấm' : '🚫 Cấm'}</button>
                </div>
            </td>
        </tr>
    `).join('');
}
window.renderUsersTable = renderUsersTable;

async function loadReports() {
  try {
    const reports = await adminModel.getReports();
    const reportsGrid = document.getElementById('reportsGrid');

    if (!reportsGrid) return;

    if (reports.length === 0) {
      reportsGrid.innerHTML = '<p class="empty-message">Không có báo cáo nào.</p>';
      return;
    }

    reportsGrid.innerHTML = reports.map(report => `
      <div class="report-card">
        <div class="report-header">
          <strong>🆔 #${report.id}</strong> - Ngày: ${new Date(report.created_at).toLocaleString()}
        </div>
        <div class="report-body">
          <p><strong>Người báo cáo:</strong> ${report.reporter_name}</p>
          <p><strong>Người bị báo cáo:</strong> ${report.reported_name}</p>
          <p><strong>📄 Lý do:</strong> ${report.reason}</p>
          <p><strong>📌 Trạng thái:</strong> 
            <span class="status-badge ${getReportStatusClass(report.status)}">
              ${getReportStatusText(report.status)}
            </span>
          </p>
        </div>
        ${report.status === 'pending' ? `
          <div class="report-actions">
            <button class="action-btn btn-resolve" onclick="resolveReport(${report.id})">✅ Giải quyết</button>
            <button class="action-btn btn-dismiss" onclick="dismissReport(${report.id})">❌ Bỏ qua</button>
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (err) {
    console.error('❌ Không thể tải báo cáo:', err);
  }
}


function renderRecentActivity(activities) {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${formatTimeAgo(activity.createdAt)}</div>
        </div>
    `).join('');
}



function showUserModal(user) {
    const modal = document.getElementById('userModal');
    const modalBody = document.getElementById('userModalBody');
    
    modalBody.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 25px; gap: 20px;">
            <img src="${user.avatar}" alt="${user.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0;">
            <div>
                <h3 style="color: #1e293b; margin-bottom: 10px;">${user.name}</h3>
                <p style="color: #64748b; margin-bottom: 5px;"><strong>Email:</strong> ${user.email}</p>
                <p style="color: #64748b; margin-bottom: 5px;"><strong>ID:</strong> ${user.id}</p>
                <span class="status-badge status-${user.status}">${getStatusText(user.status)}</span>
                ${user.verified ? '<span class="status-badge status-verified">✓ Xác thực</span>' : ''}
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <p style="margin-bottom: 10px;"><strong>Tuổi:</strong> ${user.age}</p>
                <p style="margin-bottom: 10px;"><strong>Địa điểm:</strong> ${user.location}</p>
                <p style="margin-bottom: 10px;"><strong>Ngày tham gia:</strong> ${formatDate(user.joinDate)}</p>
            </div>
            <div>
                <p style="margin-bottom: 10px;"><strong>Hoạt động cuối:</strong> ${formatDate(user.lastActive)}</p>
                <p style="margin-bottom: 10px;"><strong>Trạng thái xác thực:</strong> ${user.verified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}



function viewUser(userId) {
  const user = users.find(u => u.id == userId);
  if (!user) return;

  console.log("👁️ viewUser đang chạy, userId =", userId);

  const modal = document.getElementById('userModal');
  const body = document.getElementById('userModalBody');

  if (!modal || !body) {
    console.warn("❌ Không tìm thấy modal hoặc nội dung modal!");
    return;
  }

  body.innerHTML = `
    <h3>${user.username}</h3>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Trạng thái:</strong> ${user.status}</p>
  `;
  modal.classList.add('show');
}


function editUser(userId) {
  const user = users.find(u => u.id == userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editUserModal').classList.add('show');
}




async function banUser(userId) {
  const user = users.find(u => u.id == userId);
  const newStatus = user.status === 'banned' ? 'active' : 'banned';

  try {
    const res = await adminModel.updateUserStatus(userId, newStatus);
    if (res.success) {
      alert('Cập nhật trạng thái thành công!');
      loadUsersData();
    } else {
      alert('Thất bại: ' + res.message);
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái:', err);
    alert('Có lỗi xảy ra.');
  }
}


// Report actions
async function resolveReport(reportId) {
    if (!confirm('Đánh dấu báo cáo này là đã giải quyết?')) return;
    try {
        const res = await adminModel.updateReportStatus(reportId, 'resolved');
        if (res.success) {
            alert('Báo cáo đã được giải quyết!');
            loadReports();
        } else {
            alert('Cập nhật trạng thái báo cáo thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi giải quyết báo cáo:', err);
        alert('Có lỗi xảy ra khi giải quyết báo cáo!');
    }
}

async function dismissReport(reportId) {
    if (!confirm('Bỏ qua báo cáo này?')) return;
    try {
        const res = await adminModel.updateReportStatus(reportId, 'dismissed');
        if (res.success) {
            alert('Báo cáo đã được bỏ qua!');
            loadReports();
        } else {
            alert('Cập nhật trạng thái báo cáo thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi bỏ qua báo cáo:', err);
        alert('Có lỗi xảy ra khi bỏ qua báo cáo!');
    }
}

// Search and filter functions
function filterUsers(searchTerm) {
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.location.toLowerCase().includes(searchTerm)
    );
    
    renderUsersTable(filteredUsers);
}

function globalSearch(searchTerm) {
    if (searchTerm.length < 2) return;
    
    // Search in users
    const userResults = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    
    // Search in reports
    const reportResults = reports.filter(report => 
        report.reason.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm)
    );
    
    console.log('Search results:', { users: userResults, reports: reportResults });
}

// Pagination functions
function updatePagination(totalPagesCount) {
    totalPages = totalPagesCount;
    document.getElementById('pageInfo').textContent = `Trang ${currentPage} / ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadUsersData();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadUsersData();
    }
}

// Select all functionality
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#usersTableBody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function updateSelectAllState() {
    const checkboxes = document.querySelectorAll('#usersTableBody input[type="checkbox"]');
    const selectAll = document.getElementById('selectAll');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    selectAll.checked = checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

// Modal functions
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

function addNewUser() {
    document.getElementById('addUserModal').style.display = 'block';
}

function addNewUserSubmit() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    
    const newUser = {
        id: users.length + 1,
        name: formData.get('name') || form.querySelector('input[type="text"]').value,
        email: formData.get('email') || form.querySelector('input[type="email"]').value,
        age: parseInt(formData.get('age') || form.querySelector('input[type="number"]').value),
        location: formData.get('location') || form.querySelectorAll('input[type="text"]')[1].value,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        verified: false,
        avatar: 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    };
    
    users.push(newUser);
    
    // Add activity
    sampleActivities.unshift({
        type: 'user',
        title: 'Người dùng mới được thêm',
        description: `${newUser.name} đã được thêm bởi admin`,
        createdAt: new Date().toISOString()
    });
    
    loadUsersData();
    loadRecentActivity();
    updateStats();
    closeModal('addUserModal');
    form.reset();
    alert('Đã thêm người dùng mới thành công!');
}

// Export functions
function exportUsers() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Tên,Email,Tuổi,Địa điểm,Trạng thái,Ngày tham gia,Xác thực\n"
        + users.map(user => 
            `${user.id},"${user.name}","${user.email}",${user.age},"${user.location}","${getStatusText(user.status)}","${formatDate(user.joinDate)}","${user.verified ? 'Có' : 'Không'}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateReportSummary() {
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const dismissedReports = reports.filter(r => r.status === 'dismissed').length;
    
    alert(`Báo cáo tổng hợp:\n- Chờ xử lý: ${pendingReports}\n- Đã giải quyết: ${resolvedReports}\n- Đã bỏ qua: ${dismissedReports}\n\nTổng cộng: ${reports.length} báo cáo`);
}

// Settings functions
function saveSettings() {
    alert('Cài đặt đã được lưu thành công!');
}

function resetSettings() {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
        alert('Đã khôi phục cài đặt mặc định!');
    }
}

// Chart functions
function drawCharts() {
    drawUserGrowthChart();
    drawDailyActivityChart();
}

function drawAnalyticsCharts() {
    drawMatchRateChart();
    drawUsageTimeChart();
    drawAgeDistributionChart();
    drawLocationChart();
}

async function drawUserGrowthChart() {
    const canvas = document.getElementById('userGrowthChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const data = await adminModel.getUserGrowthData(); 

    drawLineChart(ctx, canvas, days, data, '#667eea');
}

async function drawDailyActivityChart() {
    const canvas = document.getElementById('dailyActivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const hours = ['6h', '9h', '12h', '15h', '18h', '21h', '24h'];
    const data = await adminModel.getDailyActivityData();
    
    drawBarChart(ctx, canvas, hours, data, '#10b981');
}

/* async function drawMatchRateChart() {
    const canvas = document.getElementById('matchRateChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const days = ['1', '2', '3', '4', '5', '6', '7'];
    const data = await adminModel.getMatchRateData();

    drawLineChart(ctx, canvas, days, data, '#f59e0b');
}

function drawUsageTimeChart() {
    const canvas = document.getElementById('usageTimeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const days = ['1', '2', '3', '4', '5', '6', '7'];
    const data = [22, 25, 23, 26, 24, 27, 24];
    
    drawLineChart(ctx, canvas, days, data, '#ef4444');
}

function drawAgeDistributionChart() {
    const canvas = document.getElementById('ageDistributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const ages = ['18-22', '23-27', '28-32', '33-37', '38+'];
    const data = [15, 35, 28, 18, 4];
    
    drawBarChart(ctx, canvas, ages, data, '#8b5cf6');
}

function drawLocationChart() {
    const canvas = document.getElementById('locationChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const locations = ['HN', 'HCM', 'DN', 'HP', 'CT'];
    const data = [35, 30, 15, 12, 8];
    
    drawBarChart(ctx, canvas, locations, data, '#06b6d4');
} */

function drawLineChart(ctx, canvas, labels, data, color) {
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1);
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + (index * chartWidth) / (labels.length - 1);
        ctx.fillText(label, x, canvas.height - 10);
    });
}

function drawBarChart(ctx, canvas, labels, data, color) {
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.8;
    
    // Draw bars
    ctx.fillStyle = color;
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (index * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 5);
        ctx.fillStyle = color;
    });
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + (index * chartWidth) / labels.length + chartWidth / labels.length / 2;
        ctx.fillText(label, x, canvas.height - 10);
    });
}

// Animation functions
async function animateStats() {
    try {
        const stats = await adminModel.getDashboardStats(); // 👈 Lấy số liệu thật từ API

        if (stats.success) {
            document.getElementById('totalUsers').textContent = stats.totalUsers ?? 0;
            //document.getElementById('activeUsers').textContent = stats.activeUsers ?? 0;
            document.getElementById('totalMatches').textContent = stats.totalMatches ?? 0;
            document.getElementById('pendingReports').textContent = stats.pendingReports ?? 0;
        } else {
            console.error('Lỗi API:', stats.message);
        }
    } catch (error) {
        console.error('Lỗi khi tải Dashboard stats:', error);
    }
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

function updateStats() {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    
    document.getElementById('totalUsers').textContent = users.length.toLocaleString();
    document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
    document.getElementById('pendingReports').textContent = pendingReports.toString();
}

// Helper functions
function getStatusText(status) {
    const statusTexts = {
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        banned: 'Bị cấm'
    };
    return statusTexts[status] || status;
}

function getReportStatusClass(status) {
  return {
    pending: 'status-pending',
    resolved: 'status-active',
    dismissed: 'status-muted'
  }[status] || 'status-pending';
}

function getReportStatusText(status) {
  return {
    pending: 'Chờ xử lý',
    resolved: 'Đã xử lý',
    dismissed: 'Đã bỏ qua'
  }[status] || status;
}

function getSeverityClass(severity) {
    const classes = {
        low: 'status-active',
        medium: 'status-inactive',
        high: 'status-banned'
    };
    return classes[severity] || 'status-inactive';
}

function getSeverityText(severity) {
    const texts = {
        low: 'Thấp',
        medium: 'Trung bình',
        high: 'Cao'
    };
    return texts[severity] || severity;
}

function getActivityIcon(type) {
    const icons = {
        user: '👤',
        report: '⚠️',
        match: '💕',
        login: '🔑',
        ban: '🚫'
    };
    return icons[type] || '📝';
}

function formatDate(dateString) {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Đăng xuất
function logout() {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    fetch('api/auth/logout.php', {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Đăng xuất thành công!");
            window.location.href = 'index.php?page=login';
        } else {
            alert("Đăng xuất thất bại: " + data.message);
        }
    })
    .catch(err => {
        console.error("Lỗi khi đăng xuất:", err);
        alert("Có lỗi xảy ra khi đăng xuất.");
    });
}

// Gán sự kiện sau khi DOM đã load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await adminModel.getDashboardStats();
    
    // Kiểm tra nếu API trả về success
    if (response.success) {
      document.getElementById('totalUsers').textContent = response.totalUsers;
      document.getElementById('totalMatches').textContent = response.totalMatches;
      document.getElementById('pendingReports').textContent = response.pendingReports;
    } else {
      console.error('API error:', response.message);
      alert('Lỗi khi tải thống kê: ' + response.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Không thể kết nối đến server!');
  }
});


document.addEventListener('DOMContentLoaded', async () => {
  allReports = await adminModel.getReports();
  renderReportsGrid(allReports); // lần đầu
});

// Bắt sự kiện thay đổi
document.getElementById('reportFilter').addEventListener('change', (e) => {
  currentReportFilter = e.target.value;
  filterReports();
});
document.getElementById('reportTypeFilter').addEventListener('change', (e) => {
  currentReportTypeFilter = e.target.value;
  filterReports();
});

// Hàm lọc và render lại
function filterReports() {
  const filtered = allReports.filter(report => {
    const statusMatch = currentReportFilter === 'all' || report.status === currentReportFilter;
    const typeMatch = currentReportTypeFilter === 'all' || report.reason === currentReportTypeFilter;
    return statusMatch && typeMatch;
  });

  renderReportsGrid(filtered);
}



window.viewUser = viewUser;
window.editUser = editUser;
window.banUser = banUser;
window.closeModal = closeModal;
window.adminModel = adminModel;
window.toggleUserStatus = toggleUserStatus;

window.resolveReport = resolveReport;
window.dismissReport = dismissReport;
window.renderReportsGrid = renderReportsGrid;


