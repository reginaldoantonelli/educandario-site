document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pixModal");
  const closeModal = document.getElementById("closeModal");
  const qrcodeEl = document.getElementById("qrcode");

  // Delegação de evento para o botão Doar
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#doacaoPixBtn");
    if (btn) {
      e.preventDefault();
      modal.style.display = "block";

      // Gera QRCode
      if (qrcodeEl) {
        qrcodeEl.innerHTML = "";
        new QRCode(qrcodeEl, {
          text: "00020126360014BR.GOV.BCB.PIX0114exemplo@pix.com520400005303986540510.005802BR5909Educand6009SAO PAULO62070503***6304ABCD",
          width: 200,
          height: 200
        });
      }
    }
  });

  // Fechar modal no X
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fechar modal clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});