
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

  if (currentScrollTop < 20) {
    header.style.opacity = '1';
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



let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

document.addEventListener('DOMContentLoaded', () => {


    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

    const scramble = (element) => {
        const originalText = element.dataset.value;
        if (!originalText) {
            return;
        }

        let iteration = 0;
        clearInterval(element.scrambleInterval); 

        element.scrambleInterval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(element.scrambleInterval);
            }

            iteration += 1/3;
        }, 30);
    };
    
    const resetText = (element) => {
        clearInterval(element.scrambleInterval);
        if (element.dataset.value) {
            element.innerText = element.dataset.value;
        }
    };



    const navLinks = document.querySelectorAll('#split-nav-links a');
    const sections = document.querySelectorAll('.scroll-section');

    if (navLinks.length > 0 && sections.length > 0) {

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            const lastVisibleEntry = entries.find(entry => entry.isIntersecting);
            if (!lastVisibleEntry) return;

            const activeSectionId = lastVisibleEntry.target.getAttribute('id');
            const activeLink = document.querySelector(`#split-nav-links a[href="#${activeSectionId}"]`);

            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            if (activeLink) {
                activeLink.classList.add('active');
                scramble(activeLink); 
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(lnk => {
                    lnk.classList.remove('active');
                    resetText(lnk); 
                });
                link.classList.add('active');
                scramble(link); 
            });

            link.addEventListener('mouseover', () => scramble(link));
            link.addEventListener('mouseleave', () => {
                if (!link.classList.contains('active')) {
                    resetText(link); 
                }
            });
        });
    }



    const projectContainers = document.querySelectorAll('#project-container');
    projectContainers.forEach(container => {
        const title = container.querySelector('#project-title');
        if (!title) return;

        container.addEventListener('mouseover', () => {
            scramble(title); 
        });

        container.addEventListener('mouseleave', () => {
            resetText(title); 
        });
    });

    document.addEventListener('mousemove', (e) => {
        document.body.style.setProperty('--x', `${e.clientX}px`);
        document.body.style.setProperty('--y', `${e.clientY}px`);
    });

});


