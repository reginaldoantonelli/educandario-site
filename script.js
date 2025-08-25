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

      // Depois que o footer carregar, inicializa o botão Doar
      let script = document.createElement("script");
      script.src = "doacao.js";
      document.body.appendChild(script);
    });
    
});
