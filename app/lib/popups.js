export function showOKPopup(message = "OK") {
  return new Promise((resolve) => {

    // Remove existing popup
    const existing = document.getElementById("dyci-popup");
    if (existing) existing.remove();

    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "dyci-popup";
    overlay.className = "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center";
    overlay.style = "background: rgba(0,0,0,.4); z-index: 9999;";

    // Popup
    const popup = document.createElement("div");
    popup.className = "form-card";
    popup.style.maxWidth = "400px";
    popup.style.width = "90%";

    popup.innerHTML = `
      <div class="d-flex flex-column text-center">
        <p class="mb-3">${message}</p>

        <div class="d-flex justify-content-center">
          <button class="btn btn-primary btn-sm" id="dyci-ok">
            <b>OK</b>
          </button>
        </div>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    function close() {
      overlay.remove();
      resolve(); // 👈 THIS makes it "wait"
    }

    popup.querySelector("#dyci-ok").onclick = close;

    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
  });
}