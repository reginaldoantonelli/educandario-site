document.addEventListener("DOMContentLoaded", () => {
  // Carregar header
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  // Carregar footer
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
});
let index = 0;

function showSlide(i) {
  const slides = document.querySelectorAll(".slide");
  if (i >= slides.length) index = 0;
  if (i < 0) index = slides.length - 1;

  slides.forEach((slide, idx) => {
    slide.style.transform = `translateX(${100 * (idx - index)}%)`;
  });
}

function nextSlide() {
  index++;
  showSlide(index);
}

function prevSlide() {
  index--;
  showSlide(index);
}

// inicia carrossel
document.addEventListener("DOMContentLoaded", () => {
  showSlide(index);
  setInterval(nextSlide, 5000); // troca a cada 5s

  document.querySelector(".next").addEventListener("click", nextSlide);
  document.querySelector(".prev").addEventListener("click", prevSlide);
});