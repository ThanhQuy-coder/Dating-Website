import { adminModel } from '../../models/adminModel.js';

let allReports = [];
let currentReportFilter = 'all';
let currentReportTypeFilter = 'all';

export async function loadReports() {
  try {
    const response = await adminModel.getReports();
    allReports = Array.isArray(response.reports) ? response.reports : [];

    // Kiểm tra và gán đúng dữ liệu
    if (Array.isArray(response)) {
      // Trường hợp API trả trực tiếp mảng
      allReports = response;
    } else if (response && Array.isArray(response.reports)) {
      // Trường hợp API trả về dạng { success: true, reports: [...] }
      allReports = response.reports;
    } else {
      throw new Error('Dữ liệu trả về không đúng định dạng');
    }

    filterReports(); // Áp dụng lọc sau khi load
  } catch (error) {
    console.error('❌ Lỗi khi tải báo cáo:', error);
    alert('❌ Không thể tải danh sách báo cáo.');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Không rõ' : date.toLocaleString();
}

function getReportStatusClass(status) {
  const classes = {
    pending: 'status-inactive',
    resolved: 'status-active',
    dismissed: 'status-banned',
    '': 'status-inactive',
    null: 'status-inactive'
  };
  return classes[status] || 'status-unknown';
}

function getReportStatusText(status) {
  const texts = {
    pending: 'Chờ xử lý',
    resolved: 'Đã giải quyết',
    dismissed: 'Đã bỏ qua',
    '': 'Chờ xử lý',
    null: 'Chờ xử lý'
  };
  return texts[status] || 'Không xác định';
}

async function resolveReport(id) {
  if (!confirm("Bạn chắc chắn muốn đánh dấu báo cáo này là đã giải quyết?")) return;

  const res = await adminModel.updateReportStatus(id, 'resolved');
  if (res.success) {
    alert('✅ Đã giải quyết!');
    await reloadReports();
  } else {
    alert('❌ Lỗi khi cập nhật!');
  }
}

async function dismissReport(id) {
  if (!confirm("Bạn chắc chắn muốn bỏ qua báo cáo này?")) return;

  const res = await adminModel.updateReportStatus(id, 'dismissed');
  if (res.success) {
    alert('✅ Đã bỏ qua!');
    await reloadReports();
  } else {
    alert('❌ Lỗi khi cập nhật!');
    allReports = allReports.filter(report => report.id != id);

    // 🔥 Render lại UI ngay
    filterReports();
  }
}

async function reloadReports() {
  const response = await adminModel.getReports();
  if (Array.isArray(response)) {
    allReports = response;
  } else {
    allReports = response.reports || [];
  }
  filterReports();
}

function renderReportsGrid(reports) {
  const grid = document.getElementById('reportsGrid');

  if (!grid) {
    console.warn("❌ Không tìm thấy #reportsGrid trong DOM!");
    return;
  }

  if (!Array.isArray(reports) || reports.length === 0) {
    grid.innerHTML = '<p class="empty-message">Không có báo cáo nào.</p>';
    return;
  }

  grid.innerHTML = reports.map(report => `
    <div class="report-card" data-id="${report.id}">
      <div class="report-header">
        <span class="report-id">🆔 #${report.id}</span>
        <span class="report-date">📅 ${formatDate(report.created_at)}</span>
      </div>
      <div class="report-content">
        <p><strong>📄 Lý do:</strong> ${report.reason}</p>
        <p><strong>👤 Người báo cáo:</strong> ${report.reporter_name || 'ID ' + report.reporter_id}</p>
        <p><strong>👥 Người bị báo cáo:</strong> ${report.reported_name || 'ID ' + report.reported_id}</p>
        <p><strong>📌 Trạng thái:</strong> 
          <span class="status-badge ${getReportStatusClass(report.status)}">
            ${getReportStatusText(report.status)}
          </span>
        </p>
      </div>
      ${(report.status === 'pending' || !report.status) ? `
        <div class="report-actions">
          <button class="action-btn btn-resolve" onclick="resolveReport(${report.id})">✅ Giải quyết</button>
          <button class="action-btn btn-dismiss" onclick="dismissReport(${report.id})">❌ Bỏ qua</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function filterReports() {
  console.log('▶️ Bắt đầu lọc...');
  console.log('🔍 Trạng thái:', currentReportFilter);
  console.log('🔍 Lý do:', currentReportTypeFilter);
  console.log('📦 Dữ liệu gốc:', allReports);

  const filtered = allReports.filter(report => {
    const status = (report.status || 'pending').trim();
    const reason = (report.reason || '').trim().toLowerCase();
    const type = currentReportTypeFilter.trim().toLowerCase();

    const statusMatch = currentReportFilter === 'all' || status === currentReportFilter;
    const typeMatch = type === 'all' || reason === type;

    return statusMatch && typeMatch;
  });

  console.log('✅ Sau lọc:', filtered.length);
  renderReportsGrid(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('reportFilter');
  const typeFilter = document.getElementById('reportTypeFilter');

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentReportFilter = e.target.value;
      ensureReportsVisible();
      filterReports();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      currentReportTypeFilter = e.target.value;
      filterReports();
    });
  }

  loadReports(); // Load ban đầu
});

function ensureReportsVisible() {
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById('reports')?.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector('[data-section="reports"]')?.classList.add('active');
}

// Xuất ra global cho onclick HTML nếu dùng inline
window.resolveReport = resolveReport;
window.dismissReport = dismissReport;
window.renderReportsGrid = renderReportsGrid;
window.filterReports = filterReports;
window.loadReports = loadReports;
window.ensureReportsVisible = ensureReportsVisible;
