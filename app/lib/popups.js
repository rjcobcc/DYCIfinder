let popupsLoaded = false
let activePopup = null
let activeResolve = null

function clearActive(result = null) {
    if (activePopup) {
        activePopup.remove()
        activePopup = null
    }
    if (activeResolve) {
        activeResolve(result)
        activeResolve = null
    }
}



async function loadPopups() {
    if (popupsLoaded) return

    const res = await fetch("./assets/popups.html")
    const html = await res.text()

    document.body.insertAdjacentHTML("beforeend", html)

    popupsLoaded = true
}



export async function popupMessage(content = "...") {
    await loadPopups()

    clearActive()

    return new Promise((resolve) => {
        const tpl = document.getElementById("popup-message")
        const node = tpl.content.cloneNode(true)

        const container = node.querySelector(".popup-container")
        const ok = node.querySelector(".popup-confirm")

        node.querySelector(".popup-content-container").innerHTML = content

        activePopup = container
        activeResolve = resolve

        ok.onclick = () => {
            clearActive(true)
        }

        document.body.appendChild(node)
    })
}



export async function popupLoading() {
    await loadPopups()

    clearActive()

    return new Promise((resolve) => {
        const tpl = document.getElementById("popup-loading")
        const node = tpl.content.cloneNode(true)

        const container = node.querySelector(".popup-container")

        activePopup = container
        activeResolve = resolve

        document.body.appendChild(node)
    })
}



export async function popupConfirm(content = "...") {
    await loadPopups()

    clearActive(false)

    return new Promise((resolve) => {
        const tpl = document.getElementById("popup-confirm")
        const node = tpl.content.cloneNode(true)

        const container = node.querySelector(".popup-container")
        const text = node.querySelector(".popup-content-container")
        const ok = node.querySelector(".popup-confirm")
        const cancel = node.querySelector(".popup-cancel")

        text.innerHTML = content

        activePopup = container
        activeResolve = resolve

        ok.onclick = () => {
            clearActive(true)
        }

        cancel.onclick = () => {
            clearActive(false)
        }

        document.body.appendChild(node)
    })
}