document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. МЕНЮ НАВИГАЦИИ & HEADER SCROLL
  // ==========================================
  const header = document.getElementById('site-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Изменение фона шапки при скролле
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Мобильное меню
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Блокируем скролл страницы при открытом меню
      document.body.classList.toggle('no-scroll', !isExpanded);
    });

    // Закрытие меню при клике на ссылку
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Разблокируем скролл страницы при клике на ссылку
        document.body.classList.remove('no-scroll');
      });
    });
  }


  // ==========================================
  // 4. SCROLL REVEAL (ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15, // Элемент должен быть виден на 15%
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Прекращаем наблюдение после показа
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Фоллбэк для старых браузеров
    revealElements.forEach(el => el.classList.add('active'));
  }


  // ==========================================
  // 5. КАРУСЕЛЬ УСЛУГ — drag + стрелки + peek
  // ==========================================
  (function initServicesCarousel() {
    const grid    = document.querySelector('#services .services-grid');
    const btnPrev = document.getElementById('services-prev');
    const btnNext = document.getElementById('services-next');
    if (!grid) return;

    // Вычисляем ширину карточек и отступ слева, чтобы 3-я карточка торчала краешком
    function setCardSizes() {
      const vw = window.innerWidth;
      const gap = 20;
      const peek = 100; // сколько пикселей 3-й карточки видно

      // Левый отступ = смещение container'а (линия модуля)
      const maxW = 1400;
      const containerPad = 24;
      const leftOffset = vw > maxW
        ? Math.round((vw - maxW) / 2) + containerPad
        : containerPad;

      // Ширина карточки рассчитывается так, чтобы в видимой области (vw - leftOffset)
      // помещалось ровно 2 карточки полностью, а 3-я торчала на peek пикселей.
      // 2 * cardW + 2 * gap + peek = vw - leftOffset
      const cardW = Math.floor((vw - leftOffset - gap * 2 - peek) / 2);

      if (vw > 768) {
        grid.querySelectorAll('.service-card').forEach(c => {
          c.style.flex = `0 0 ${cardW}px`;
        });
      } else {
        grid.querySelectorAll('.service-card').forEach(c => {
          c.style.flex = '';
        });
      }
    }

    setCardSizes();
    window.addEventListener('resize', setCardSizes, { passive: true });

    // Шаг скролла = ширина одной карточки + gap
    function stepPx() {
      const card = grid.querySelector('.service-card');
      return card ? card.offsetWidth + 20 : 400;
    }

    // Стрелки
    if (btnPrev && btnNext) {
      btnNext.addEventListener('click', () => {
        grid.scrollBy({ left: stepPx(), behavior: 'smooth' });
      });
      btnPrev.addEventListener('click', () => {
        grid.scrollBy({ left: -stepPx(), behavior: 'smooth' });
      });

      // Состояние кнопок (disabled на краях)
      function updateArrows() {
        btnPrev.disabled = grid.scrollLeft <= 4;
        btnNext.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 4;
      }
      grid.addEventListener('scroll', updateArrows, { passive: true });
      updateArrows();
    }

    // Drag-скролл мышью (ПК)
    let isDown = false, startX, startScrollLeft;

    grid.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX;
      startScrollLeft = grid.scrollLeft;
      grid.style.cursor = 'grabbing';
      grid.style.scrollBehavior = 'auto';
      grid.style.scrollSnapType = 'none'; // Отключаем привязку при перетаскивании во избежание конфликтов
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      grid.style.cursor = 'grab';
      grid.style.scrollBehavior = 'smooth';
      grid.style.scrollSnapType = 'x mandatory'; // Включаем привязку обратно, чтобы карточка встала на ровную позицию
    });

    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      grid.scrollLeft = startScrollLeft - (e.pageX - startX) * 1.4;
    });
  })();


  // ==========================================
  // 6. ВАЛИДАЦИЯ B2B ФОРМЫ СВЯЗИ
  // ==========================================
  const form = document.getElementById('b2b-contact-form');
  const successAlert = document.getElementById('success-alert');

  if (form) {
    // Вспомогательные функции для валидации
    function showError(inputId, errorId, message) {
      const input = document.getElementById(inputId);
      const errorDiv = document.getElementById(errorId);
      input.style.borderColor = 'var(--accent-red)';
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }

    function clearError(inputId, errorId) {
      const input = document.getElementById(inputId);
      const errorDiv = document.getElementById(errorId);
      input.style.borderColor = 'var(--border-color)';
      errorDiv.style.display = 'none';
    }

    // Слушатели для очистки ошибок «на лету» при вводе/выборе
    const inputsToValidate = [
      { id: 'form-name', err: 'error-name' },
      { id: 'form-company', err: 'error-company' },
      { id: 'form-phone', err: 'error-phone' },
      { id: 'form-email', err: 'error-email' }
    ];

    inputsToValidate.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        el.addEventListener('input', () => clearError(item.id, item.err));
      }
    });

    // ---- Маска для телефона и нормализация email ----
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        let input = phoneInput.value.replace(/\D/g, '');
        
        // Если пользователь начал ввод с 9, это код города. Если с 7 или 8, отсекаем первую цифру.
        if (input.length > 0 && (input[0] === '7' || input[0] === '8')) {
          input = input.substring(1);
        }
        
        let formatted = '';
        if (input.length > 0) {
          formatted = '+7 (' + input.substring(0, 3);
          if (input.length > 3) {
            formatted += ') ' + input.substring(3, 6);
          }
          if (input.length > 6) {
            formatted += '-' + input.substring(6, 8);
          }
          if (input.length > 8) {
            formatted += '-' + input.substring(8, 10);
          }
        }
        
        phoneInput.value = formatted;
      });

      // Автоматическое добавление префикса при фокусе
      phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value) {
          phoneInput.value = '+7 (';
        }
      });

      // Удаление пустого префикса при размытии
      phoneInput.addEventListener('blur', () => {
        if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
          phoneInput.value = '';
        }
      });
    }

    const emailInput = document.getElementById('form-email');
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        // Убираем пробелы и переводим в нижний регистр на лету
        emailInput.value = emailInput.value.trim().toLowerCase();
      });
    }

    // ---- Кастомный dropdown «Направление» ----
    function showDirectionError(message) {
      const cs = document.getElementById('custom-direction');
      if (cs) cs.classList.add('error');
      const errorDiv = document.getElementById('error-direction');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }

    function clearDirectionError() {
      const cs = document.getElementById('custom-direction');
      if (cs) cs.classList.remove('error');
      const errorDiv = document.getElementById('error-direction');
      errorDiv.style.display = 'none';
    }

    const customSelect = document.getElementById('custom-direction');
    const hiddenSelect = document.getElementById('form-direction');

    if (customSelect && hiddenSelect) {
      const textEl = customSelect.querySelector('.custom-select__text');
      const options = customSelect.querySelectorAll('.custom-select__option');

      customSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelect.classList.toggle('open');
        customSelect.setAttribute('aria-expanded', customSelect.classList.contains('open'));
      });

      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          textEl.textContent = option.textContent;
          textEl.classList.remove('placeholder');
          hiddenSelect.value = option.dataset.value;
          hiddenSelect.dispatchEvent(new Event('change'));
          options.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          customSelect.classList.remove('open');
          customSelect.setAttribute('aria-expanded', 'false');
          clearDirectionError();
        });
      });

      customSelect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); customSelect.classList.toggle('open'); }
        if (e.key === 'Escape') { customSelect.classList.remove('open'); customSelect.setAttribute('aria-expanded', 'false'); }
      });

      document.addEventListener('click', () => {
        customSelect.classList.remove('open');
        customSelect.setAttribute('aria-expanded', 'false');
      });
    }
    // ---- /Кастомный dropdown ----

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('form-name').value.trim();
      const company = document.getElementById('form-company').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const direction = document.getElementById('form-direction').value;

      // Проверка имени
      if (!name) {
        showError('form-name', 'error-name', 'Пожалуйста, введите ваше имя');
        isValid = false;
      } else {
        clearError('form-name', 'error-name');
      }

      // Проверка компании
      if (!company) {
        showError('form-company', 'error-company', 'Пожалуйста, укажите вашу компанию');
        isValid = false;
      } else {
        clearError('form-company', 'error-company');
      }

      // Проверка телефона (полная маска "+7 (999) 123-45-67" имеет длину 18 символов)
      if (!phone || phone === '+7 (' || phone === '+7') {
        showError('form-phone', 'error-phone', 'Пожалуйста, введите номер телефона');
        isValid = false;
      } else if (phone.length < 18) {
        showError('form-phone', 'error-phone', 'Пожалуйста, введите номер телефона полностью');
        isValid = false;
      } else {
        clearError('form-phone', 'error-phone');
      }

      // Проверка email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        showError('form-email', 'error-email', 'Пожалуйста, введите адрес почты');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError('form-email', 'error-email', 'Введите корректный email (например, partner@company.ru)');
        isValid = false;
      } else {
        clearError('form-email', 'error-email');
      }

      // Проверка выбранного направления
      if (!direction) {
        showDirectionError('Пожалуйста, выберите направление сотрудничества');
        isValid = false;
      } else {
        clearDirectionError();
      }

      if (isValid) {
        // Симулируем отправку формы
        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        setTimeout(() => {
          // Успешный исход
          form.reset();
          successAlert.style.display = 'block';
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить запрос';

          // Скрываем сообщение об успехе через 7 секунд
          setTimeout(() => {
            successAlert.style.display = 'none';
          }, 7000);
        }, 1500);
      }
    });
  }


  // ==========================================
  // 6. ИНТЕРФАКТИВНАЯ ЛОГИКА ТАБОВ ПРОЕКТОВ
  // ==========================================
  const tabButtons = document.querySelectorAll('.projects-tabs .tab-btn');
  const tabPanes = document.querySelectorAll('.tab-content .tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none';
      });
      
      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.style.display = 'block';
        setTimeout(() => {
          activePane.classList.add('active');
        }, 10);
      }
    });
  });


  // ==========================================
  // 7. ГЛОБАЛЬНАЯ ФУНКЦИЯ ВЫБОРА НАПРАВЛЕНИЯ
  // ==========================================
  window.selectDirection = function(directionVal, subjectText) {
    const selectEl = document.getElementById('form-direction');
    const messageEl = document.getElementById('form-message');
    const contactsSection = document.getElementById('contacts');

    if (selectEl) {
      selectEl.value = directionVal;
      selectEl.dispatchEvent(new Event('change'));
    }

    const cs = document.getElementById('custom-direction');
    if (cs) {
      const option = cs.querySelector(`[data-value="${directionVal}"]`);
      if (option) {
        cs.querySelector('.custom-select__text').textContent = option.textContent;
        cs.querySelector('.custom-select__text').classList.remove('placeholder');
        cs.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        cs.classList.remove('error');
        document.getElementById('error-direction').style.display = 'none';
      }
    }

    if (messageEl && subjectText) {
      messageEl.value = subjectText;
    }

    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

});
