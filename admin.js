// admin.js
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  const user = JSON.parse(localStorage.getItem('royal_currentUser'));
  if (!user || !user.isAdmin) {
    alert('Access Denied. Admin only!');
    window.location.href = 'login.html';
  }
  loadAdminComplaints();
});

function showSection(sectionId, element) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if(target) target.classList.add('active');

  document.querySelectorAll('.sidebar a').forEach(item => item.classList.remove('active'));
  if(element) element.classList.add('active');
  
  document.getElementById('pageTitle').innerText = element.innerText.replace(/[^a-zA-Z ]/g, "");
}

function loadAdminComplaints() {
  const tbody = document.getElementById('adminComplaintsBody');
  if(!tbody) return;

  let complaints = JSON.parse(localStorage.getItem('royal_complaints')) || [];
  tbody.innerHTML = '';

  if(complaints.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No complaints found.</td></tr>';
    return;
  }

  complaints.forEach((c, index) => {
    let actionBtns = c.status === 'pending' 
      ? `<button class="btn btn-gold" onclick="approveComplaint(${c.id})">Approve</button>
         <button class="btn btn-red" onclick="rejectComplaint(${c.id})">Reject</button>`
      : `Processed`;

    let badgeClass = c.status === 'pending' ? 'badge-pending' : (c.status === 'approved' ? 'badge-success' : 'badge-danger');

    tbody.innerHTML += `
      <tr>
        <td>${c.username}</td>
        <td>₹${c.amount}</td>
        <td>${c.utr}</td>
        <td><a href="#" style="color:var(--gold);">View Proof</a></td>
        <td><span class="badge ${badgeClass}">${c.status.toUpperCase()}</span></td>
        <td>${actionBtns}</td>
      </tr>
    `;
  });
}

function approveComplaint(id) {
  if(!confirm('Approve this deposit?')) return;
  
  let complaints = JSON.parse(localStorage.getItem('royal_complaints')) || [];
  let users = JSON.parse(localStorage.getItem('royal_users')) || [];
  
  const complaint = complaints.find(c => c.id === id);
  complaint.status = 'approved';

  // Add balance to user
  const userIndex = users.findIndex(u => u.username === complaint.username);
  if(userIndex !== -1) {
    users[userIndex].balance = Number(users[userIndex].balance) + Number(complaint.amount);
    localStorage.setItem('royal_users', JSON.stringify(users));
  }

  localStorage.setItem('royal_complaints', JSON.stringify(complaints));
  loadAdminComplaints();
  alert('Approved and balance added!');
}

function rejectComplaint(id) {
  if(!confirm('Reject this deposit?')) return;
  let complaints = JSON.parse(localStorage.getItem('royal_complaints')) || [];
  const complaint = complaints.find(c => c.id === id);
  complaint.status = 'rejected';
  localStorage.setItem('royal_complaints', JSON.stringify(complaints));
  loadAdminComplaints();
}