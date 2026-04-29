
export function previewImage(input, previewId, removeBtnId) {
    const removeBtn = document.getElementById(removeBtnId);
    const preview = document.getElementById(previewId);
    const reader = new FileReader();

    if (!input.files || !input.files[0]) {
        clearImage(input.id, previewId, removeBtnId);
        return;
    }

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        removeBtn.style.display = "inline-block";
    };

    reader.readAsDataURL(input.files[0]);
}



export function clearImage(inputId, previewId, removeBtnId) {
    const removeBtn = document.getElementById(removeBtnId);
    const preview = document.getElementById(previewId);
    const input = document.getElementById(inputId);

    input.value = "";
    preview.src = "";
    preview.style.display = "none";
    removeBtn.style.display = "none";
}