const cabeca = document.getElementById('avatar-cabeca');
const img_cabeca = document.getElementById('avatar-img-cabeca');
const pescoco = document.getElementById('avatar-pescoco');
const scene = document.getElementById('navbar');
const avatar_border = document.getElementById('home-perfil__avatar-border');
const palpebra = document.getElementById("avatar-palpebras");
const olhos = document.getElementById("avatar-olhos");
const olho = document.querySelectorAll('.avatar-olho');
const iris = document.querySelectorAll('.avatar-iris');

let autoAnimationId = null;
let angleX = 0;
let angleY = 100;
let isTouching = false;
let isMouseInside = false;

function aplicarMovimentos(percentX, percentY) {
    const cab_rot_x = percentY * -12;
    const cab_rot_y = percentX * 30;
    const pesc_rot_X = percentY * -2;
    const pesc_rot_Y = percentX * 10;
    const pesq_sca_y = 1 + Math.abs(percentY) * 0.12;
    const iri_mov_x = percentX * 4;
    const iri_mov_y = (percentY * 2) + 2.5;
    const cab_sha_x = (percentX * -3) + 8;
    const cab_sha_y = (percentY * -20) + 10;
    const border_rotate = percentX * 440;

    img_cabeca.style.setProperty('--cab-sha-x', `${percentX}%`);
    img_cabeca.style.setProperty('--cab-sha-y', `${percentY}%`);
    cabeca.style.setProperty('--cab-sha-x', `${cab_sha_x}px`);
    cabeca.style.setProperty('--cab-sha-y', `${cab_sha_y}px`);
    cabeca.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    cabeca.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    olhos.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    olhos.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    palpebra.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    palpebra.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    palpebra.style.setProperty('--cab-sha-x', `${cab_sha_x}px`);
    palpebra.style.setProperty('--cab-sha-y', `${cab_sha_y}px`);
    pescoco.style.setProperty('--pesc-rotate-x', `${pesc_rot_X}deg`);
    pescoco.style.setProperty('--pesc-rotate-y', `${pesc_rot_Y}deg`);
    pescoco.style.setProperty('--pesc-scale-y', `${pesq_sca_y}`);

    iris.forEach(obj => {
        obj.style.setProperty('--iri-mov-x', `${iri_mov_x}px`);
        obj.style.setProperty('--iri-mov-y', `${iri_mov_y}px`);
    });
}

function piscar() {
    palpebra.style.setProperty("--fechar-palpebra", "1");
    setTimeout(() => {
        palpebra.style.setProperty("--fechar-palpebra", "0");
    }, 200);
}

function loopPiscar() {
    const intervalo = Math.random() * 3000 + 3000;
    setTimeout(() => {
        piscar();
        loopPiscar();
    }, intervalo);
}

function autoAnimarFrame() {
    angleX += 0.02;
    angleY += 0.015;

    const percentX = Math.sin(angleX) * 0.5;
    const percentY = Math.cos(angleY) * 0.7;

    aplicarMovimentos(percentX, percentY);

    autoAnimationId = requestAnimationFrame(autoAnimarFrame);
}

function startAutoAnimation() {
    if (autoAnimationId) return;

    setTimeout(() => {
        cabeca.classList.add('smooth-transition');
        pescoco.classList.add('smooth-transition');
        iris.forEach(obj => obj.classList.add('smooth-transition'));
    }, 500);

    autoAnimarFrame();
}

function stopAutoAnimation() {
    if (autoAnimationId) {
        cancelAnimationFrame(autoAnimationId);
        autoAnimationId = null;
    }

    cabeca.classList.remove('smooth-transition');
    pescoco.classList.remove('smooth-transition');
    iris.forEach(obj => obj.classList.remove('smooth-transition'));
}

// Mouse - desktop
scene.addEventListener('mousemove', (e) => {
    stopAutoAnimation();

    const { width, height, left, top } = scene.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = (x / width - 0.5);
    const percentY = (y / height - 0.5);

    aplicarMovimentos(percentX, percentY);
    isMouseInside = true;
});

scene.addEventListener('mouseleave', () => {
    isMouseInside = false;
    setTimeout(() => {
        if (!isMouseInside && !isTouching) startAutoAnimation();
    }, 100);
});

// Touch - mobile
scene.addEventListener('touchstart', () => {
    isTouching = true;
    stopAutoAnimation();
}, { passive: true });

scene.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const { width, height, left, top } = scene.getBoundingClientRect();
    const x = touch.clientX - left;
    const y = touch.clientY - top;

    const percentX = (x / width - 0.5);
    const percentY = (y / height - 0.5);

    aplicarMovimentos(percentX, percentY);
}, { passive: true });

scene.addEventListener('touchend', () => {
    isTouching = false;
    setTimeout(() => {
        if (!isMouseInside) startAutoAnimation();
    }, 100);
});

scene.addEventListener('touchcancel', () => {
    isTouching = false;
    setTimeout(() => {
        if (!isMouseInside) startAutoAnimation();
    }, 100);
});

// Piscar automático e ao clicar
loopPiscar();
scene.addEventListener("click", piscar);

// Inicia animação ao carregar
document.addEventListener('DOMContentLoaded', startAutoAnimation);
