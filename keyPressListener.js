export class keyPressListener {
    constructor(keyCode,callback) {
        let keySafe = true
        this.keydownFunction = event => {
            if (event.code === keyCode) {
                if (keySafe) {
                    callback()
                    keySafe = false
                }
            }
    }
    this.keyUpFunction = event => {
    if (event.code === keyCode) {
        keySafe = true
    }
    }
    document.addEventListener("keydown", this.keydownFunction)
    document.addEventListener("keyup", this.keyUpFunction)
}

unbind() {
    document.removeEventListener("keydown", this.keydownFunction)
    document.removeEventListener("keyup", this.keyUpFunction)
}

}

