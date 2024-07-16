document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('[data-widget="pushmenu"]').addEventListener('click', function (e) {
      e.preventDefault();
      const sidebar = document.querySelector('.main-sidebar');
      sidebar.classList.toggle('closed');
      document.querySelector('.search-container').classList.toggle('d-none');

      const userPanel = document.querySelector('.user-panel');
      if (sidebar.classList.contains('closed')) {
        userPanel.classList.add('pb-5');
        userPanel.classList.remove('pb-3');
      } else {
        userPanel.classList.add('pb-3');
        userPanel.classList.remove('pb-5');
      }
    });
  });