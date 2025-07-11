  console.log("✅ adminModel.js loaded OK");

  export const adminModel = {
    // 🟢 Lấy danh sách users
    async getUsers() {
      const res = await fetch('/api/admin/users.php');
      return await res.json();
    },

    // 🟢 Cập nhật trạng thái user (ban/unban)
    async updateUserStatus(id, status) {
      const res = await fetch('/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      return res.json();
    },

    // 🟢 Cập nhật thông tin user (username, email)
    async updateUserInfo(id, username, email) {
      const res = await fetch('/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, username, email })
      });
      return res.json();
    },

    // 🟢 Lấy danh sách báo cáo
    async getReports() {
      try {
        const res = await fetch('api/admin/reports.php');
        if (!res.ok) throw new Error(`❌ GET reports lỗi: ${res.status}`);

        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (parseErr) {
          console.error('❌ API getReports trả về không phải JSON:', text);
          throw new Error('API getReports trả về dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error(err);
        return [];
      }
    },

    // 🟢 Cập nhật trạng thái báo cáo
    async updateReportStatus(id, status) {
      try {
        const res = await fetch('api/admin/reports.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status })
        });
        if (!res.ok) throw new Error(`❌ POST updateReportStatus lỗi: ${res.status}`);

        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (parseErr) {
          console.error('❌ API updateReportStatus trả về không phải JSON:', text);
          throw new Error('API updateReportStatus trả về dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error(err);
        return { success: false, message: 'Lỗi khi cập nhật báo cáo' };
      }
    },

    // 🟢 Lấy thống kê dashboard
    async getDashboardStats() {
      try {
        const res = await fetch('api/admin/dashboard.php');
        if (!res.ok) throw new Error(`❌ GET dashboardStats lỗi: ${res.status}`);

        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (parseErr) {
          console.error('❌ API getDashboardStats trả về không phải JSON:', text);
          throw new Error('API getDashboardStats trả về dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error(err);
        return {};
      }
    },


    // 🟢 Lấy dữ liệu người dùng mới theo ngày
  async getUserGrowthData() {
    try {
      const res = await fetch('/api/admin/getUserGrowthData.php');
      if (!res.ok) throw new Error('Không lấy được dữ liệu người dùng mới');
      return await res.json();
    } catch (err) {
      console.error('Lỗi khi lấy user growth:', err);
      return [0, 0, 0, 0, 0, 0, 0];
    }
  },

  async getDailyActivityData() {
    try {
      const res = await fetch('/api/admin/getDailyActivityData.php');
      if (!res.ok) throw new Error('Không lấy được hoạt động hàng ngày');
      return await res.json(); // vì API trả mảng trực tiếp
    } catch (err) {
      console.error('Lỗi khi lấy daily activity:', err);
      return [0, 0, 0, 0, 0, 0, 0]; // fallback nếu lỗi
    }
  }



  };

