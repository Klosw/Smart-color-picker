class colorPicker {
    constructor(colorId, buttonId, infoId, hexId, strId) {
        this.$color = document.getElementById(colorId);
        this.$button = document.getElementById(buttonId);
        this.$info = document.getElementById(infoId);
        this.$hex = document.getElementById(hexId);
        this.$str = document.getElementById(strId);
    }

    static showError(error) {
        console.error(error);
    }

    showColor({
        sRGBHex
    }) {
        this.$color.style.backgroundColor = sRGBHex;
        this.$button.classList.add('button--picked');
        this.$str.classList.add('str--picked');
        this.$hex.style.color = colorPicker.invertColor(sRGBHex);
        this.$hex.innerText = sRGBHex.colorHex().toUpperCase();
        navigator.clipboard.writeText(sRGBHex.colorHex().toUpperCase())
        .then(() => {
            this.showInfo();
        })
        .catch(() => {
            this.hideInfo();
        });
    }

    showInfo() {
        this.$info.classList.add('info--picked');
    }

    hideInfo() {
        this.$info.classList.remove('info--picked')
    }

    static invertColor(color) {
        return '#' + (Number(`0x1${color.slice(1)}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
    }

    openEyeDropper() {
        this.eyeDropper
        .open()
        .then((e) => this.showColor(e))
        .catch(colorPicker.showError);
    }

    init() {
        if (window.EyeDropper !== undefined) {
            this.eyeDropper = new window.EyeDropper();
            this.$button.addEventListener('click', () => {
                this.openEyeDropper()
            });
        } else {
            colorPicker.showError('EyeDropper API is not supported on this platform');
        }
    }

}
const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
const picker = new colorPicker(
        'color',
        'button',
        'info',
        'hex',
        'str');

String.prototype.colorHex = function () {
    var that = this;
    try {
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (parseInt(hex, 16) < 16) {
                    hex = "0" + hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        } else if (reg.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return that;
        }
    } catch (e) {
        return e.message;
    }
};

picker.init();
