document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('[data-widget="fullscreen"]').addEventListener('click', function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  });