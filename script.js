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
    // Carregar modal PIX
fetch("pixModal.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("pixContainer").innerHTML = data;
  });
    
// ========================
  // Carrossel dinâmico
  // ========================
  if (document.getElementById("carouselSlides")) {
    let carouselImages = JSON.parse(localStorage.getItem("carousel")) || [
      "imagens/imagem1.jpg",
      "imagens/imagem2.jpg",
      "imagens/imagem3.jpg"
    ];

    const slidesContainer = document.getElementById("carouselSlides");
    const dotsContainer = document.getElementById("carouselDots");

    slidesContainer.innerHTML = "";
    dotsContainer.innerHTML = "";

    carouselImages.forEach((img, index) => {
      slidesContainer.innerHTML += `
        <div class="slide ${index === 0 ? "active" : ""}">
          <img src="${img}" alt="Evento ${index + 1} - Educandário">
        </div>
      `;
      dotsContainer.innerHTML += `<span class="dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>`;
    });

    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    function showSlide(n) {
      slides[currentIndex].classList.remove("active");
      dots[currentIndex].classList.remove("active");
      currentIndex = (n + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
      dots[currentIndex].classList.add("active");
    }

    document.getElementById("prevBtn").addEventListener("click", () => showSlide(currentIndex - 1));
    document.getElementById("nextBtn").addEventListener("click", () => showSlide(currentIndex + 1));
    dots.forEach(dot => dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.index));
    }));

    // Troca automática a cada 5s
    setInterval(() => showSlide(currentIndex + 1), 5000);
  }
});
// ========================
// Pastas da Transparência
// ========================
if (document.getElementById("foldersContainer")) {
  let folders = JSON.parse(localStorage.getItem("folders")) || [
    { name: "Relatórios", image: "imagens/pasta1.png", documents: [] },
    { name: "Balanços", image: "imagens/pasta2.png", documents: [] },
    { name: "Projetos", image: "imagens/pasta3.png", documents: [] },
    { name: "Outros", image: "imagens/pasta4.png", documents: [] }
  ];

  const container = document.getElementById("foldersContainer");

  function renderFolders() {
    container.innerHTML = "";
    folders.forEach((folder, index) => {
      container.innerHTML += `
        <div class="folder">
          <img src="${folder.image}" alt="${folder.name}" class="folder-img">
          <h3>${folder.name}</h3>
          <button onclick="alert('Em breve: abrir ${folder.name}')">Abrir</button>
        </div>
      `;
    });
  }

  renderFolders();
}