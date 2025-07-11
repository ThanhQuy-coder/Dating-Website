import { adminModel } from '../../models/adminModel.js';

let users = [];


document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('usersTableBody')) {
    loadUsers();
  }

  const editForm = document.getElementById('editUserForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editUserId').value;
  const username = document.getElementById('editUsername').value;
  const email = document.getElementById('editEmail').value;

  const res = await adminModel.updateUserInfo(id, username, email);
  if (res.success) {
    alert('✅ Cập nhật thành công!');
    closeModal('editUserModal');

    // 👉 Load lại users để cập nhật dữ liệu mới
    await loadUsers();

    // 👉 Reset modal XEM để dùng được lại
    document.getElementById('userModalBody').innerHTML = 'Đang tải...';
    document.getElementById('userModal').classList.remove('show');

  } else {
    alert('❌ Cập nhật thất bại!');
  }
});
  }
});

async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');

  // ✅ XÓA dữ liệu cũ trước khi render lại
  tbody.innerHTML = '';

  users = await adminModel.getUsers();

  tbody.innerHTML = users.map(user => `
  <tr id="user-row-${user.id}">
    <td><input type="checkbox" value="${user.id}"></td>
    <td>${user.username}</td>
    <td>${user.email}</td>
    <td>${user.created_at ?? 'Không rõ'}</td>
    <td><span class="status-badge status-${user.status}">${user.status}</span></td>
    <td>
      <button class="btn btn-view" onclick="viewUser(${user.id})">👁️ Xem</button>
      <button class="btn btn-edit" onclick="editUser(${user.id})">✏️ Sửa</button>
      <button class="btn btn-ban" onclick="toggleUserStatus(${user.id}, '${user.status}')">
        ${user.status === 'banned' ? 'Unban' : 'Ban'}
      </button>
    </td>
  </tr>
`).join('');

}

window.viewUser = function(userId) {
  console.log("👁️ Đã click Xem, ID:", userId);

  const user = users.find(u => u.id == userId);
  if (!user) return;

  const editModal = document.getElementById('editUserModal');
  if (editModal) editModal.classList.remove('show');

  const modal = document.getElementById('userModal');
  const modalBody = document.getElementById('userModalBody');

  modalBody.innerHTML = `
  <div class="user-details-modal">
    <div class="info">
      <h2>${user.username}</h2>
      <p><strong>📧 Email:</strong> ${user.email ?? 'Không có'}</p>
      <p><strong>🆔 ID:</strong> ${user.id}</p>
      <p><strong>📌 Trạng thái:</strong> 
        <span class="badge badge-${user.status}">${user.status}</span>
      </p>
      <p><strong>📅 Ngày tham gia:</strong> ${user.created_at ?? 'Không rõ'}</p>
    </div>
  </div>
`;

  modal.classList.remove('show');
  void modal.offsetHeight;
  modal.classList.add('show');
};


window.editUser = function (userId) {
  console.log("✏️ Đã click Sửa, ID:", userId);

  const user = users.find(u => u.id == userId);
  if (!user) {
    console.warn("❌ Không tìm thấy user trong mảng!");
    return;
  }

  // 👉 Đóng modal xem nếu đang mở
  const viewModal = document.getElementById('userModal');
  if (viewModal) {
    viewModal.classList.remove('show');
    document.getElementById('userModalBody').innerHTML = 'Đang tải...'; // reset lại luôn
  }

  // Điền thông tin vào form
  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editEmail').value = user.email;

  // Hiện modal
  const editModal = document.getElementById('editUserModal');
  editModal.classList.remove('show');
  void editModal.offsetHeight;
  editModal.classList.add('show');
};


window.toggleUserStatus = async function(id, currentStatus) {
  const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
  if (confirm(`Bạn có chắc muốn ${newStatus === 'banned' ? 'CẤM' : 'BỎ CẤM'} người dùng này?`)) {
    const res = await adminModel.updateUserStatus(id, newStatus);
    if (res.success) {
      alert('✅ Đã cập nhật trạng thái');
      await loadUsers();
    } else {
      alert('❌ Không cập nhật được');
    }
  }
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');

    // Reset nội dung modal xem
    if (modalId === 'userModal') {
      document.getElementById('userModalBody').innerHTML = 'Đang tải...';
    }
  }
};


