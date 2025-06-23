
let lastScrollTop = 0;


function toggleResponsiveness() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

window.onscroll = () => {scrollFunction()};

function scrollFunction() {
  const header = document.getElementById("main-header");
  let currentScrollTop = window.scrollY || document.documentElement.scrollTop;

  if (currentScrollTop < 2) {
    header.style.opacity = '0.95';
  } else {
    header.style.opacity = '0.70'; 
  }

  if (currentScrollTop > 40) { 
    if (currentScrollTop > lastScrollTop) {
      header.classList.add("nav-hidden");
    } else {
      header.classList.remove("nav-hidden");
    }
  } else {
    header.classList.remove("nav-hidden");
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('#split-nav-links a');
    const sections = document.querySelectorAll('.scroll-section');

      if (navLinks.length === 0 || sections.length === 0) {
        console.error('CRITICAL ERROR: Could not find nav links or scroll sections. Please check your HTML for a <div id="split-nav-links"> and <section class="scroll-section"> tags.');
        return; 
    }

 const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', 
    threshold: 0.1 
};

    const observerCallback = (entries, observer) => {
    const lastVisibleEntry = entries.find(entry => entry.isIntersecting);

    if (!lastVisibleEntry) {
        return;
    }

    const activeSectionId = lastVisibleEntry.target.getAttribute('id');

    const activeLink = document.querySelector(`#split-nav-links a[href="#${activeSectionId}"]`);

    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    if (activeLink) {
        activeLink.classList.add('active');
    }
};

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(lnk => lnk.classList.remove('active'));
            link.classList.add('active');
        });
    });
});