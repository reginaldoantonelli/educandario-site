document.addEventListener("DOMContentLoaded", () => {
  // Usa setTimeout porque o modal é carregado dinamicamente
  setTimeout(() => {
    const btn = document.getElementById("doacaoPixBtn");
    const modal = document.getElementById("pixModal");
    const closeBtn = document.getElementById("closeModal");

    if (btn && modal && closeBtn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";

        const pixPayload = "00020126360014BR.GOV.BCB.PIX0114exemplo@pix.com520400005303986540510.005802BR5909Educand6009SAO PAULO62070503***6304ABCD";

        document.getElementById("qrcode").innerHTML = "";
        new QRCode(document.getElementById("qrcode"), {
          text: pixPayload,
          width: 200,
          height: 200
        });
      });

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
      });
    }
  }, 500); // tempo para garantir que o modal foi carregado
});