
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector("i");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const currentYear = document.getElementById("year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const setTheme = (isLight) => {
  document.body.classList.toggle("light-theme", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");

  if (themeIcon) {
    themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
  }
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  setTheme(true);
} else {
  setTheme(false);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light-theme");
    setTheme(isLight);
  });
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

const sections = document.querySelectorAll("main section[id]");
const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
};

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const showFieldError = (field, message) => {
  const errorElement = field.parentElement.querySelector(".error-message");
  field.classList.add("invalid");
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearFieldError = (field) => {
  const errorElement = field.parentElement.querySelector(".error-message");
  field.classList.remove("invalid");
  if (errorElement) {
    errorElement.textContent = "";
  }
};

if (contactForm) {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const formStatus = document.querySelector(".form-status");

  [nameField, emailField, messageField].forEach((field) => {
    field?.addEventListener("input", () => clearFieldError(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    if (!name) {
      showFieldError(nameField, "Please enter your name.");
      hasError = true;
    }

    if (!email) {
      showFieldError(emailField, "Please enter your email.");
      hasError = true;
    } else if (!emailPattern.test(email)) {
      showFieldError(emailField, "Please enter a valid email address.");
      hasError = true;
    }

    if (!message) {
      showFieldError(messageField, "Please enter a message.");
      hasError = true;
    }

    if (hasError) {
      if (formStatus) {
        formStatus.textContent = "Please fix the highlighted fields.";
        formStatus.classList.remove("success");
        formStatus.classList.add("error");
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = "Your message was sent successfully!";
      formStatus.classList.remove("error");
      formStatus.classList.add("success");
    }

    contactForm.reset();
  });
}
