

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
  const navbar = document.getElementById("myTopnav");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navbar.style.fontSize = "1rem";
    navbar.style.backgroundColor = "#0a0216"
    navbar.style.opacity = "95%"
  } else {
    navbar.style.fontSize = "2.5rem";
    navbar.style.backgroundColor = "#0b001f";
    navbar.style.opacity = "100%"
  }
}