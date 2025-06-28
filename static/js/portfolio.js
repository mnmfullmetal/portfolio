const App = {
  config: {
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
    scrambleIterationSpeed: 1 / 3,
    scrambleFrameDuration: 30,
    headerHideThreshold: 40,
  },
  state: {
    lastScrollTop: 0,
    slideIndex: 1,
    isThrottled: false,
  },
  
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.headerScroll();
      this.textScramble();
      this.splitNavObserver();
      this.mouseMoveGradient();
      this.slideshow(); 
      this.responsiveNav();
    });
  },

  headerScroll() {
    const header = document.getElementById("main-header");
    if (!header) return;

    const onScroll = () => {
      if (this.state.isThrottled) return;
      this.state.isThrottled = true;

      setTimeout(() => {
        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        header.style.opacity = (currentScrollTop < 20) ? '1' : '0.70';
        if (currentScrollTop > this.config.headerHideThreshold) {
          header.classList.toggle("nav-hidden", currentScrollTop > this.state.lastScrollTop);
        } else {
          header.classList.remove("nav-hidden");
        }
        this.state.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        this.state.isThrottled = false;
      }, 100); 
    };
    
    window.addEventListener('scroll', onScroll);
  },
  
  textScramble() {
      const scrambleOnHover = (element) => {
          const originalText = element.dataset.value;
          if (!originalText || element.scrambleInterval) return;

          let iteration = 0;
          element.scrambleInterval = setInterval(() => {
              element.innerText = originalText.split("").map((letter, index) => {
                  return index < iteration ? originalText[index] : this.config.letters[Math.floor(Math.random() * this.config.letters.length)];
              }).join("");

              if (iteration >= originalText.length) {
                  clearInterval(element.scrambleInterval);
                  element.scrambleInterval = null;
              }
              iteration += this.config.scrambleIterationSpeed;
          }, this.config.scrambleFrameDuration);
      };

      const resetText = (element) => {
          if (element.scrambleInterval) {
              clearInterval(element.scrambleInterval);
              element.scrambleInterval = null;
          }
          if (element.dataset.value) {
              element.innerText = element.dataset.value;
          }
      };

      document.querySelectorAll('#project-container').forEach(container => {
          const title = container.querySelector('#project-title');
          if (title) {
              container.addEventListener('mouseover', () => scrambleOnHover(title));
              container.addEventListener('mouseleave', () => resetText(title));
          }
      });
      
      this.scramble = scrambleOnHover;
      this.resetText = resetText;
  },
  
  splitNavObserver() {
    const navLinks = document.querySelectorAll('#split-nav-links a');
    const sections = document.querySelectorAll('.scroll-section');
    if (navLinks.length === 0 || sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    this.resetText(link);
                    if (link.getAttribute('href') === `#${activeSectionId}`) {
                        link.classList.add('active');
                        this.scramble(link);
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => this.scramble(link));
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                this.resetText(link);
            }
        });
    });
  },
  
  mouseMoveGradient() {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            document.body.style.setProperty('--x', `${e.clientX}px`);
            document.body.style.setProperty('--y', `${e.clientY}px`);
        });
    });
  },
  
  slideshow() {
    const slideshows = document.querySelectorAll('.slideshow-container');
    if (slideshows.length === 0) return;

    this.showSlides(this.state.slideIndex);

    window.plusSlides = (n) => {
      this.state.slideIndex += n;
      this.showSlides();
    };
    window.currentSlide = (n) => {
      this.state.slideIndex = n;
      this.showSlides();
    };
  },

  showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;

    if (this.state.slideIndex > slides.length) { this.state.slideIndex = 1 }
    if (this.state.slideIndex < 1) { this.state.slideIndex = slides.length }

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active-slide');
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[this.state.slideIndex - 1].classList.add('active-slide');
    dots[this.state.slideIndex - 1].className += " active";
  },
  
  responsiveNav() {
      const icon = document.querySelector('.topnav a.icon');
      if (!icon) return;

      icon.addEventListener('click', () => {
          const topnav = document.getElementById("myTopnav");
          if (topnav) {
              topnav.classList.toggle('responsive');
          }
      });
  }
};

App.init();


