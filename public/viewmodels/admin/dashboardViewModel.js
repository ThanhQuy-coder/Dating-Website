import { adminModel } from '../../models/adminModel.js';

// Thêm hàm loadDashboard và export nó
export async function loadDashboard() {
  try {
    const stats = await adminModel.getDashboardStats();

    document.getElementById('totalUsers').textContent = stats.totalUsers ?? 0;
    //document.getElementById('activeUsers').textContent = stats.activeUsers ?? 0;
    document.getElementById('totalMatches').textContent = stats.totalMatches ?? 0;
    document.getElementById('pendingReports').textContent = stats.pendingReports ?? 0;
  } catch (error) {
    console.error('Lỗi khi tải dashboard:', error);
    // Xử lý lỗi nếu cần
  }
}
export async function getUserGrowthData() {
    const res = await fetch('/api/admin/getUserGrowthData.php');
    const json = await res.json();
    return json.data || [0, 0, 0, 0, 0, 0, 0];
}

export async function getDailyActivityData() {
    const res = await fetch('/api/admin/getDailyActivityData.php');
    const json = await res.json();
    return json.data || [0, 0, 0, 0, 0, 0, 0];
}
// Lấy hoạt động gần đây (recent activity)
export async function getRecentActivity() {
  try {
    const res = await fetch('/api/admin/getRecentActivity.php');
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error('❌ Lỗi khi tải Recent Activity:', err);
    return [];
  }
}


// Giữ lại sự kiện DOMContentLoaded nếu cần
document.addEventListener('DOMContentLoaded', () => {
  // Có thể gọi loadDashboard() ở đây nếu muốn tự động chạy
});


