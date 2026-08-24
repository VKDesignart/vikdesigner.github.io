(() => {
  const body = document.body;

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  const setMenu = (open) => {
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));

    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));

    body.classList.toggle('modal-open', open);
  };

  menuToggle.addEventListener('click', () => {
    setMenu(!mobileMenu.classList.contains('is-open'));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });


  /* ANIMAÇÕES AO ROLAR */

  const revealItems = document.querySelectorAll('.reveal');

  revealItems.forEach(el => {
    const delay = Number(el.dataset.delay || 0);

    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  const io = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('is-visible');

        io.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.12
  });

  revealItems.forEach(el => io.observe(el));


  /* FILTROS DOS PROJETOS */

  const filters = document.querySelectorAll('.filter-btn');

  const cards = document.querySelectorAll('.project-card');

  filters.forEach(btn => {

    btn.addEventListener('click', () => {

      filters.forEach(b => {
        b.classList.remove('is-active');
      });

      btn.classList.add('is-active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {

        const categories =
          (card.dataset.categories || '').split(' ');

        card.hidden =
          filter !== 'all' &&
          !categories.includes(filter);

      });

    });

  });


  /* MODAL DOS CASES */

  const modal =
    document.getElementById('case-modal');

  const panel =
    modal.querySelector('.case-panel');

  const content =
    document.getElementById('case-content');

  const counter =
    document.getElementById('case-counter');

  const closeButtons =
    modal.querySelectorAll(
      '.case-close, .case-backdrop'
    );

  const projectOrder = [
    'nah',
    'tokyo',
    'lua'
  ];

  let activeProject = null;


  const openCase = (project) => {

    const template =
      document.getElementById(
        `case-${project}`
      );

    if (!template) return;

    activeProject = project;

    content.replaceChildren(
      template.content.cloneNode(true)
    );

    counter.textContent =
      `${String(
        projectOrder.indexOf(project) + 1
      ).padStart(2, '0')} / ${String(
        projectOrder.length
      ).padStart(2, '0')}`;

    modal.classList.add('is-open');

    modal.setAttribute(
      'aria-hidden',
      'false'
    );

    body.classList.add('modal-open');

    panel.scrollTop = 0;

    setTimeout(() => {
      panel.focus();
    }, 40);


    content
      .querySelectorAll('[data-next]')
      .forEach(btn => {

        btn.addEventListener(
          'click',
          () => {
            openCase(btn.dataset.next);
          }
        );

      });

  };


  const closeCase = () => {

    modal.classList.remove('is-open');

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    body.classList.remove('modal-open');

    const trigger =
      document.querySelector(
        `[data-project="${activeProject}"]`
      );

    if (trigger) {
      trigger.focus();
    }

    activeProject = null;
  };


  cards.forEach(card => {

    card.addEventListener(
      'click',
      () => {
        openCase(card.dataset.project);
      }
    );

  });


  closeButtons.forEach(btn => {

    btn.addEventListener(
      'click',
      closeCase
    );

  });


  document.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Escape' &&
        modal.classList.contains('is-open')
      ) {
        closeCase();
      }

    }
  );


  /* FORMULÁRIO */

  const contactForm =
    document.getElementById(
      'contact-form'
    );

  const formNote =
    document.getElementById(
      'form-note'
    );


  contactForm.addEventListener(
    'submit',
    async e => {

      e.preventDefault();

      const data =
        new FormData(contactForm);

      const text =
`Olá! Vim pelo site da Vik Designer.

Nome: ${data.get('name')}
Serviço: ${data.get('service')}

Projeto:
${data.get('message')}`;


      try {

        await navigator.clipboard.writeText(
          text
        );

        formNote.textContent =
          'Mensagem copiada. Agora é só colar no seu WhatsApp, Instagram ou e-mail.';

      } catch {

        formNote.textContent =
          'Sua mensagem está pronta: copie o texto do projeto e envie pelo seu canal preferido.';

      }

    }
  );

})();