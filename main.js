// Preloader animation
(() => {
  const tl = anime.timeline({ easing: "easeOutCubic" });

  tl.add({
    targets: ".preloader-logo",
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 600,
  })
    .add(
      {
        targets: ".preloader-bar-wrapper",
        opacity: [0, 1],
        duration: 300,
      },
      "-=200",
    )
    .add(
      {
        targets: ".preloader-bar-fill",
        width: ["0%", "100%"],
        duration: 1400,
        easing: "easeInOutQuart",
      },
      "-=100",
    )
    .add(
      {
        targets: ".preloader-car",
        left: ["0%", "calc(100% - 2.2rem)"],
        duration: 1400,
        easing: "easeInOutQuart",
      },
      "-=1400",
    )
    .add({
      targets: ".preloader-content",
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 400,
      easing: "easeInCubic",
    })
    .add(
      {
        targets: "#preloader",
        translateY: [0, "-100%"],
        duration: 700,
        easing: "easeInOutCubic",
      },
      "-=100",
    )
    .add(
      {
        targets: ".page-content",
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutCubic",
      },
      "-=500",
    )
    .add(
      {
        targets: [".header", ".whatsapp-float"],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutCubic",
        complete: () => {
          document.getElementById("preloader").style.display = "none";
        },
      },
      "-=700",
    );
})();

document.addEventListener("DOMContentLoaded", () => {
  // Header scroll
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Formulário de contato
  const form = document.querySelector(".contato-form form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    }).then((res) => {
      Toastify({
        text: res.ok
          ? "Mensagem enviada com sucesso!"
          : "Erro ao enviar. Tente novamente.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: res.ok ? "#2ecc71" : "#c0392b",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.85rem",
        },
      }).showToast();
      if (res.ok) form.reset();
    });
  });

  // Contagem animada dos stats
  const counters = document.querySelectorAll(
    ".sobre-stats strong[data-target]",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((el) => {
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix;
          const duration = 1500;
          let start = null;
          const update = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(progress * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.5 },
  );
  observer.observe(document.querySelector(".sobre-stats"));

  // Animação dos cards de serviços
  const cards = document.querySelectorAll(".servico-card");
  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.addEventListener(
          "transitionend",
          () => {
            entry.target.style.transitionDelay = "0s";
          },
          { once: true },
        );
        cardsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    cardsObserver.observe(card);
  });
});
