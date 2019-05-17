window.onload = () => {
    document.getElementById('toggleNav').addEventListener('click', () => {
      const show = document.querySelector('.js-nav-icon');
      const icon = document.querySelector('.js-nav-icon i');
      const navbar = document.querySelector('.main-nav')
      navbar.classList.toggle('dis-block')
      show.classList.toggle('open');
      if(icon.classList.contains('ion-md-menu')) {
          icon.classList.add('ion-md-close')
          icon.classList.remove('ion-md-menu')
      } else {
          icon.classList.add('ion-md-menu')
          icon.classList.remove('ion-md-close')
      }
    });
  };
  