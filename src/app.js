import './scss/base.scss';

var canvas = document.querySelector("#town"),
    ctx = canvas.getContext('2d'),
    data,
    canvas2,
    ctx2,
    rafAnim = null,
    amount = 1000,
    flakes;

init();

/////

function init() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth;

    var img = new Image();

    img.onload = function () {
        ctx.drawImage(img, 0, 0, 800, 800, 0, 0, canvas.width, canvas.height);
        data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        initSnowFlakesCanvas();
        initSnow();
    }

    img.crossOrigin = "Anonymous";
    img.src = "./images/town.svg";
}

function initSnowFlakesCanvas() {
    canvas2 = document.querySelector("#snowFlakes");
    ctx2 = canvas2.getContext('2d');
    canvas2.width = canvas.offsetWidth;
    canvas2.height = canvas.offsetWidth;
}

function initSnow() {
    var radius = canvas.width * 0.2875,
        offsetX = canvas.width / 2,
        offsetY = canvas.width * 0.4,
        x,
        ylim,
        y;

    window.addEventListener("click", shakeGlobe);
    window.addEventListener("touchstart", shakeGlobe);

    ctx2.fillStyle = "rgba(255,255,255,0.7)";
    flakes = [];

    for (var i = 0; i < amount; i++) {
        x = Math.random() * 2 * radius - radius;
        ylim = Math.sqrt(radius * radius - x * x);
        y = Math.random() * ylim - ylim;
        flakes.push(new Flake(x + offsetX, y + offsetY));
    }

    if (rafAnim === null) {
        rafAnim = window.requestAnimationFrame(render);
    }
}

function Flake(x, y, color) {
    var destination;

    this.x = Math.floor(x);
    this.y = Math.floor(y);

    for (var i = this.y; i < canvas.width; i++) {
        if (data[((this.x + (canvas.width * i)) * 4 + 3)] > 10) {
            destination = parseInt(i - 1);
            i = canvas.width;
        } else {
            destination = canvas.width;
        }
    }

    this.finalY = destination;
    this.r = Math.random() * 2;
    this.speedY = Math.random() + 0.2;
}

Flake.prototype.render = function () {
    if (this.finalY > this.y) {
        this.y += this.speedY;
    }

    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx2.fill();
}

function render(a) {
    window.requestAnimationFrame(render);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    for (var i = 0; i < amount; i++) {
        flakes[i].render();
    }
};

function shakeGlobe() {
    var globe = document.querySelector("#globe");

    window.removeEventListener("click", shakeGlobe);
    window.removeEventListener("touchstart", shakeGlobe);

    TweenMax.to(canvas2, 0.5, {
        opacity: 0
    });

    TweenMax.to(globe, .1, {
        rotationZ: 25,
        ease: Quad.easeInOut,
        yoyo: true,
        repeat: 5,
        onComplete: initSnow
    });

    TweenMax.to(canvas2, 0.5, {
        opacity: 1,
        delay: "0.6"
    });
}