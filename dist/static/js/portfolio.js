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
     currentPreviewIndex: 1,
  },
  
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.headerScroll();
      this.textScramble();
      this.splitNavObserver();
      this.mouseMoveGradient();
      this.slideshow();
      this.previewer(); 
      this.responsiveNav();
    });
  },

   previewer() {
        window.updatePreview = (index) => this.updatePreview(index);
        window.openModalForCurrent = () => this.openModalForCurrent();

        this.updatePreview(1);
    },


    updatePreview(index) {
        const slides = document.querySelectorAll("#myModal .mySlides");
        const thumbnails = document.querySelectorAll(".thumbnail-img");
        if (slides.length === 0) return;

        if (index > slides.length) { index = 1; }
        if (index < 1) { index = slides.length; }
        
        this.state.currentPreviewIndex = index;

        const previewViewer = document.getElementById("preview-viewer");
        const slideToShow = slides[index - 1];
        const mediaElement = slideToShow.querySelector('img, video');
        if (!mediaElement) return;

        const clonedMedia = mediaElement.cloneNode(true);
        
        if (clonedMedia.tagName === 'VIDEO') {
            clonedMedia.muted = true;
            clonedMedia.controls = false;
            clonedMedia.play().catch(e => console.log("Autoplay blocked."));
        }

        previewViewer.innerHTML = '';
        previewViewer.appendChild(clonedMedia);
        
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        if (thumbnails[index - 1]) {
            thumbnails[index - 1].classList.add('active');
        }
    },


    openModalForCurrent() {
    this.state.slideIndex = this.state.currentPreviewIndex;
    this.showSlides();
    this.openModal();
  },


    

  openModal() {
    document.getElementById("myModal").style.display = "block";
  },

  closeModal() {
    document.getElementById("myModal").style.display = "none";
  },
  
  slideshow() {
    window.openModal = () => this.openModal();
    window.closeModal = () => this.closeModal();
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
    const slides = document.querySelectorAll("#myModal .mySlides");
    if (slides.length === 0) return;

    if (this.state.slideIndex > slides.length) { this.state.slideIndex = 1 }
    if (this.state.slideIndex < 1) { this.state.slideIndex = slides.length }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[this.state.slideIndex - 1].style.display = "block";
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
      document.querySelectorAll('#project-card-container').forEach(container => {
          const title = container.querySelector('#project-card-tool');
          if (title) {
              container.addEventListener('mouseover', () => scrambleOnHover(title));
              container.addEventListener('mouseleave', () => resetText(title));
          }
          else {
              console.warn("No title found in project card container.");
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
        rootMargin: '-20% 0px -20% 0px',
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


