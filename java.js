'use strict';

(() => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navBookBtn = document.getElementById('navBookBtn');
  const heroBookBtn = document.getElementById('heroBookBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formMessage = document.getElementById('form-msg');

  /*
   * Navbar
   */
  if (navbar) {
    window.addEventListener(
      'scroll',
      () => {
        navbar.classList.toggle(
          'scrolled',
          window.scrollY > 40
        );
      },
      { passive: true }
    );
  }

  /*
   * Mobile navigation
   */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');

      menuToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

      menuToggle.setAttribute(
        'aria-label',
        open ? 'Close menu' : 'Open menu'
      );
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');

        menuToggle.setAttribute(
          'aria-expanded',
          'false'
        );

        menuToggle.setAttribute(
          'aria-label',
          'Open menu'
        );
      });
    });
  }

  /*
   * Booking navigation
   */
  const scrollToContact = () => {
    const contact = document.getElementById('contact');

    if (!contact) {
      return;
    }

    contact.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  navBookBtn?.addEventListener(
    'click',
    scrollToContact
  );

  heroBookBtn?.addEventListener(
    'click',
    scrollToContact
  );

  /*
   * Reveal animation
   */
  const revealElements =
    document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('visible');
    });
  }

  /*
   * Animated counters
   */
  const counters =
    document.querySelectorAll('.stat-num');

  if ('IntersectionObserver' in window) {
    const counterObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const element = entry.target;

            const target = Number.parseInt(
              element.dataset.target,
              10
            );

            if (
              !Number.isSafeInteger(target) ||
              target < 0
            ) {
              counterObserver.unobserve(element);
              return;
            }

            let current = 0;

            const step = Math.max(
              1,
              Math.ceil(target / 50)
            );

            const tick = () => {
              current += step;

              if (current >= target) {
                element.textContent =
                  target === 100
                    ? '100%'
                    : `${target}+`;

                return;
              }

              element.textContent =
                String(current);

              window.requestAnimationFrame(tick);
            };

            tick();

            counterObserver.unobserve(element);
          });
        },
        {
          threshold: 0.5
        }
      );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  /*
   * Demo booking form.
   *
   * No form data is sent anywhere.
   *
   * textContent is deliberately used rather than
   * innerHTML, preventing HTML injection through
   * future changes to this message.
   */
  bookingForm?.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      if (!formMessage) {
        return;
      }

      formMessage.textContent =
        'Demo only: your information has not been sent.';

      bookingForm.reset();

      window.setTimeout(() => {
        formMessage.textContent = '';
      }, 5000);
    }
  );
})();