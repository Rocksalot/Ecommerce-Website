// ShopHub - Main Client JS

document.addEventListener('DOMContentLoaded', () => {

  // ---- Countdown Timer (Deals section) ----
  const secBlock = document.getElementById('sec-block');
  if (secBlock) {
    // Target: 4 days from now
    const target = new Date();
    target.setDate(target.getDate() + 4);
    target.setHours(target.getHours() + 13, target.getMinutes() + 34, 0);

    function updateCountdown() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) return;

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      const secs  = Math.floor((diff % 60000)    / 1000);

      const blocks = document.querySelectorAll('.countdown-block');
      if (blocks[0]) blocks[0].childNodes[0].textContent = String(days).padStart(2, '0');
      if (blocks[1]) blocks[1].childNodes[0].textContent = String(hours).padStart(2, '0');
      if (blocks[2]) blocks[2].childNodes[0].textContent = String(mins).padStart(2, '0');
      if (blocks[3]) blocks[3].childNodes[0].textContent = String(secs).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---- Auto-dismiss alerts ----
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });

  // ---- Mobile filter toggle ----
  const filterToggle = document.getElementById('filter-toggle');
  const filterSidebar = document.querySelector('.filter-sidebar');
  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', () => {
      filterSidebar.style.display = filterSidebar.style.display === 'block' ? 'none' : 'block';
    });
  }

  // ---- Sticky header shadow on scroll ----
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.1)' : '';
    });
  }

});
