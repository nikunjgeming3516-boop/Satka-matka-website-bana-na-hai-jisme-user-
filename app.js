// app.js
let depositTimer;
let timerCount = 10;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('userBalance')) {
    checkAuth();
    const user = JSON.parse(localStorage.getItem('royal_currentUser'));
    document.getElementById('userBalance').innerText = user.balance || 0;
    loadComplaintsCount();
  }
});

function startDeposit() {
  document.getElementById('depositModal').style.display = 'flex';
  document.getElementById('depositStage1').style.display = 'block';
  document.getElementById('depositStage2').style.display = 'none';
  document.getElementById('complaintStage').style.display = 'none';
}

function closeDeposit() {
  document.getElementById('depositModal').style.display = 'none';
  clearInterval(depositTimer);
}

function generateQR() {
  const amount = document.getElementById('depAmount').value;
  if(amount < 100) { alert('Minimum deposit is ₹100'); return; }
  
  document.getElementById('depositStage1').style.display = 'none';
  document.getElementById('depositStage2').style.display = 'block';
  document.getElementById('qrAmountDisplay').innerText = '₹' + amount;
  
  timerCount = 10;
  document.getElementById('timerDisplay').innerText = `Checking status... ${timerCount}s`;
  
  depositTimer = setInterval(() => {
    timerCount--;
    document.getElementById('timerDisplay').innerText = `Checking status... ${timerCount}s`;
    
    if (timerCount <= 0) {
      clearInterval(depositTimer);
      document.getElementById('depositStage2').style.display = 'none';
      document.getElementById('complaintStage').style.display = 'block';
    }
  }, 1000);
}

function submitComplaint() {
  const utr = document.getElementById('compUTR').value;
  const file = document.getElementById('compScreenshot').files[0];
  const amount = document.getElementById('depAmount').value;
  
  if(!utr || !file) { alert('Please enter UTR and upload screenshot'); return; }
  
  // Save to LocalStorage (Demo for Admin Panel)
  const user = JSON.parse(localStorage.getItem('royal_currentUser'));
  let complaints = JSON.parse(localStorage.getItem('royal_complaints')) || [];
  
  complaints.push({
    id: Date.now(),
    username: user.username,
    amount: amount,
    utr: utr,
    status: 'pending',
    date: new Date().toLocaleString()
  });
  
  localStorage.setItem('royal_complaints', JSON.stringify(complaints));
  
  alert('✅ Complaint submitted! Admin will review it within 24 hours.');
  closeDeposit();
}

function loadComplaintsCount() {
  let complaints = JSON.parse(localStorage.getItem('royal_complaints')) || [];
  const pending = complaints.filter(c => c.status === 'pending').length;
  if(document.getElementById('pendingComplaints')) {
    document.getElementById('pendingComplaints').innerText = pending;
  }
}