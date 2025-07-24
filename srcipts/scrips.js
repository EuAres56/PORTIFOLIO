const cabeca = document.getElementById('avatar-cabeca');
const pescoco = document.getElementById('avatar-pescoco');
const scene = document.getElementById('navbar');
const avatar_border = document.getElementById('home-perfil__avatar-border');
const palpebra = document.getElementById("avatar-palpebras");
const olhos = document.getElementById("avatar-olhos");
const olho = document.querySelectorAll('.avatar-olho');
const iris = document.querySelectorAll('.avatar-iris');

let autoAnimation = null;
let angleX = 0;
let angleY = 100;
let isTouching = false;
let isMouseInside = false;

function aplicarMovimentos(percentX, percentY) {
    const cab_rot_x = percentY * -12;
    const cab_rot_y = (percentX * 30);
    const pesc_rot_X = percentY * -2;
    const pesc_rot_Y = (percentX * 10);
    const pesq_sca_y = 1 + Math.abs(percentY * -1) * 0.12;
    const iri_mov_x = (percentX * 11);
    const iri_mov_y = (percentY * 2) + 2.5;
    const cab_sha_x = (percentX * -3) + 5;
    const cab_sha_y = (percentY * -50) + 10;
    const border_rotate = percentX * 440;

    // avatar_border.style.setProperty('--rotate-img', `${border_rotate}deg`);
    cabeca.style.setProperty('--cab-sha-x', `${cab_sha_x}px`);
    cabeca.style.setProperty('--cab-sha-y', `${cab_sha_y}px`);
    cabeca.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    cabeca.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    olhos.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    olhos.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    palpebra.style.setProperty('--cab-rotate-x', `${cab_rot_x}deg`);
    palpebra.style.setProperty('--cab-rotate-y', `${cab_rot_y}deg`);
    pescoco.style.setProperty('--pesc-rotate-x', `${pesc_rot_X}deg`);
    pescoco.style.setProperty('--pesc-rotate-y', `${pesc_rot_Y}deg`);
    pescoco.style.setProperty('--pesc-scale-y', `${pesq_sca_y}`);

    iris.forEach(obj => {
        obj.style.setProperty('--iri-mov-y', `${iri_mov_y}px`);
        obj.style.setProperty('--iri-mov-x', `${iri_mov_x}px`);
    });
}

function piscar() {
    palpebra.style.setProperty("--fechar-palpebra", "1"); // fecha
    setTimeout(() => {
        palpebra.style.setProperty("--fechar-palpebra", "0"); // abre
    }, 200); // duração do piscar
}

function loopPiscar() {
    const intervalo = Math.random() * 3000 + 3000; // 3–6s
    setTimeout(() => {
        piscar();
        loopPiscar();
    }, intervalo);
}
function startAutoAnimation() {
    if (autoAnimation) return;

    // Aguarda 50ms para aplicar a classe (ajustável)
    setTimeout(() => {
        // avatar_border.classList.add('smooth-transition');
        cabeca.classList.add('smooth-transition');
        pescoco.classList.add('smooth-transition');
        iris.forEach(obj => obj.classList.add('smooth-transition'));
    }, 500);

    autoAnimation = setInterval(() => {
        angleX += 0.02;
        angleY += 0.015;

        const percentX = Math.sin(angleX) * 0.3;
        const percentY = Math.cos(angleY) * 0.3;

        aplicarMovimentos(percentX, percentY);
    }, 16);
}

function stopAutoAnimation() {
    if (autoAnimation) {
        clearInterval(autoAnimation);
        autoAnimation = null;
    }

    // avatar_border.classList.remove('smooth-transition');
    cabeca.classList.remove('smooth-transition');
    pescoco.classList.remove('smooth-transition');
    iris.forEach(obj => obj.classList.remove('smooth-transition'));
}

// Mouse - desktop
scene.addEventListener('mousemove', (e) => {
    stopAutoAnimation();

    const { width, height } = scene.getBoundingClientRect();
    const x = e.clientX - scene.offsetLeft;
    const y = e.clientY - scene.offsetTop;

    const percentX = (x / width - 0.5);
    const percentY = (y / height - 0.5);

    aplicarMovimentos(percentX, percentY);
    isMouseInside = true;
});

// Suaviza retorno da animação ao sair do mouse
scene.addEventListener('mouseleave', () => {
    isMouseInside = false;

    // Delay antes de iniciar auto animação para suavizar a transição
    setTimeout(() => {
        if (!isMouseInside && !isTouching) {
            startAutoAnimation();
        }
    }, 100);
});

// Touch - mobile
scene.addEventListener('touchstart', () => {
    isTouching = true;
    stopAutoAnimation();
}, { passive: true });

scene.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const { width, height } = scene.getBoundingClientRect();
    const x = touch.clientX - scene.offsetLeft;
    const y = touch.clientY - scene.offsetTop;

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

// Piscar automático
loopPiscar();

// Piscar ao clicar na tela
scene.addEventListener("click", () => {
    piscar();
});

// Abre e fecha navbar
function toggle_nav_menu() {
    const btnNavToggle = document.getElementById('navbar-toggle');
    const icon = document.getElementById('navbar-toggle-icon')
    const navBar = document.getElementById('navbar');
    const pages = document.querySelectorAll('.slide')
    console.log(window.innerWidth)
    if (navBar && btnNavToggle) {
        if (window.innerWidth > 768) {
            // Fecha navbar
            if (!navBar.classList.contains('navbar-close')) {
                pages.forEach(pg => {
                    pg.style.paddingLeft = "var(--padding_page_y)";
                });

                navBar.classList.add('navbar-close')
                btnNavToggle.style.transform = `translateX(0px)`;
                icon.style.transform = `rotateZ(180deg)`;
            }
            // Abre navbar
            else {
                pages.forEach(pg => {
                    pg.style.paddingLeft = "calc(250px + var(--padding_page_y))";
                });
                navBar.classList.remove('navbar-close')
                btnNavToggle.style.transform = `translateX(249px)`;
                icon.style.transform = `rotateZ(0deg)`;

            }
        } else if (window.innerWidth > 600) {
            return
        } else {
            // Fecha navbar
            if (!navBar.classList.contains('navbar-close')) {
                navBar.classList.add('navbar-close')
                btnNavToggle.style.transform = `translateX(0) rotateZ(0deg)`;
            }
            // Abre navbar
            else {
                navBar.classList.remove('navbar-close')
                btnNavToggle.style.transform = `translateX(calc(100dvw - 2.5rem)) rotateZ(180deg)`;


            }
        }
    }
}


// Array para armazenar os timeouts e poder limpá-los se necessário
const typewriterTimeouts = []; // Certifique-se que esta variável está definida globalmente ou em um escopo acessível

function typeWriter(text, elementId, speed = 100, add_class = null, callback = null) {
    const el = document.getElementById(elementId);
    el.innerHTML = ''; // Garante que o elemento está vazio antes de começar a digitar
    let i = 0;

    // Se houver uma classe para adicionar ao elemento principal (o span 'intro-writer')
    if (add_class && !el.classList.contains(add_class)) {
        el.classList.add(add_class);
    }

    function typing() {
        if (i < text.length) {
            const char = text.charAt(i);
            const charSpan = document.createElement('span'); // Cria um span para cada caractere
            charSpan.classList.add('char'); // Adiciona a classe 'char' para o CSS de animação
            charSpan.textContent = char;
            el.appendChild(charSpan); // Adiciona o span da letra ao elemento principal

            i++;
            const timeoutId = setTimeout(typing, speed);
            typewriterTimeouts.push(timeoutId); // Armazena o ID do timeout
        } else {
            // Após terminar a digitação
            if (add_class && el.classList.contains(add_class)) {
                // Se a classe foi adicionada para o efeito de digitação e precisa ser removida
                // Isso é menos comum quando o 'char' faz o efeito, mas pode ser útil para outras classes.
                el.classList.remove(add_class);
            }
            if (callback) {
                callback();
            }
        }
    }

    typing();
}

// Seu bloco de chamadas typeWriter permanece o mesmo
// limpa os spans da intro para receber texto
function clear_intro_spans(obj_tag) {
    const spans = document.querySelectorAll(obj_tag);
    spans.forEach(sp => {
        sp.innerHTML = ""
    });
}

// Certifique-se que typewriterTimeouts é declarado (pode ser no topo do seu script JS)
// let typewriterTimeouts = []; // Se não estiver já declarado

document.addEventListener('DOMContentLoaded', () => { // Adicione isso se ainda não tiver
    clear_intro_spans('.intro-writer'); // Limpa os spans existentes antes de digitar

    // Insere intro de apresentação
    typeWriter("Prazer,", "intro-writer-1", 100, null, () => {
        typeWriter("eu sou o ", "intro-writer-2", 50, null, () => {
            typeWriter("Ares", "intro-writer-3", 50, null, () => {
                typeWriter("Dev Full Stack", "intro-writer-4", 50, null, () => {
                    // Última callback, se precisar de algo ao final de tudo
                });
            });
        });
    });
});

// Animação fundo intro
(() => {
    const container = document.getElementById("page-intro");

    // Cria e injeta canvas dentro do container
    const canvas = document.createElement("canvas");
    canvas.style.position = 'absolute';
    container.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let width, height;

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    // Configurações
    const NUM_SHAPES = 25;
    const MAX_SPEED = 0.3;
    const MOUSE_RADIUS = 300;
    const EXPLOSION_RADIUS = 250;
    const EXPLOSION_FORCE = 10;
    const BLUR_DURATION = 500;

    // Paleta de cores vibrantes em vermelho
    const COLORS = [
        "rgba(255, 0, 0, 0.9)",
        "rgba(255, 0, 51, 0.8)",
        "rgba(255, 56, 66, 0.8)",
        "rgba(255, 7, 58, 0.7)",
        "rgba(255, 0, 21, 0.8)"
    ];

    let mouse = { x: -1000, y: -1000 };
    let shapes = [];
    let explosion = null;

    function createShape() {
        const types = ["circle", "triangle", "square"];
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * MAX_SPEED,
            vy: (Math.random() - 0.5) * MAX_SPEED,
            size: 20 + Math.random() * 40, // maior tamanho
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.0015,
            type: types[Math.floor(Math.random() * types.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
    }

    for (let i = 0; i < NUM_SHAPES; i++) {
        shapes.push(createShape());
    }

    function drawShape(shape) {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.angle);
        ctx.fillStyle = shape.color;
        ctx.shadowColor = "rgba(0, 0, 0, .2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;
        switch (shape.type) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -shape.size);
                ctx.lineTo(shape.size * 1.5, shape.size);
                ctx.lineTo(-shape.size * 1.5, shape.size);
                ctx.closePath();
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(-shape.size, -shape.size, shape.size * 2, shape.size * 2);
                break;
        }
        ctx.restore();
    }

    function update(deltaTime) {
        shapes.forEach(shape => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.angle += shape.angleSpeed;

            if (shape.x < 0) {
                shape.x = 0;
                shape.vx = -shape.vx;
            } else if (shape.x > width) {
                shape.x = width;
                shape.vx = -shape.vx;
            }
            if (shape.y < 0) {
                shape.y = 0;
                shape.vy = -shape.vy;
            } else if (shape.y > height) {
                shape.y = height;
                shape.vy = -shape.vy;
            }

            // Repulsão do mouse
            const dx = shape.x - mouse.x;
            const dy = shape.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.3;
                const angle = Math.atan2(dy, dx);
                shape.vx += Math.cos(angle) * force;
                shape.vy += Math.sin(angle) * force;
            }

            // Explosão ativa
            if (explosion) {
                const elapsed = performance.now() - explosion.startTime;
                if (elapsed > BLUR_DURATION) {
                    explosion = null;
                    canvas.style.filter = "none";
                } else {
                    const dxE = shape.x - explosion.x;
                    const dyE = shape.y - explosion.y;
                    const distE = Math.sqrt(dxE * dxE + dyE * dyE);
                    if (distE < EXPLOSION_RADIUS && distE > 0) {
                        const force = ((EXPLOSION_RADIUS - distE) / EXPLOSION_RADIUS) * EXPLOSION_FORCE;
                        const angle = Math.atan2(dyE, dxE);
                        shape.vx += Math.cos(angle) * force;
                        shape.vy += Math.sin(angle) * force;
                    }
                    const blurAmt = (1 - elapsed / BLUR_DURATION) * 6;
                    canvas.style.filter = `blur(${blurAmt}px)`;
                }
            }

            // Fricção suave para diminuir velocidade
            shape.vx *= 0.98;
            shape.vy *= 0.98;
        });
    }

    function draw() {
        // Cria um objeto de gradiente linear
        // Exemplo: de cima para baixo
        var centerX = width / 2;
        var centerY = height / 2;
        var maxRadius = Math.max(width, height) / 1.5; // Ajuste este valor para controlar a "dispersão" do brilho

        var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);

        // Definindo as cores do gradiente
        // Do cinza escuro para preto puro
        gradient.addColorStop(0, "rgba(145, 145, 145, 1)"); // #1a1a1a (um cinza escuro para o centro)
        gradient.addColorStop(1, "rgb(0, 0, 0)"); // var(--color_bg_tertiary) (preto puro para as bordas)

        // OU com um brilho sutilmente avermelhado no centro:
        // gradient.addColorStop(0, "rgba(255, 0, 55, 0.08)"); // Um vermelho bem transparente para o centro
        // gradient.addColorStop(1, "rgb(0, 0, 0)"); // Preto puro para as bordas

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        shapes.forEach(drawShape);
    }

    let lastTime = performance.now();
    function loop(time) {
        const deltaTime = time - lastTime;
        lastTime = time;
        update(deltaTime);
        draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.addEventListener("mousemove", e => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener("mouseleave", e => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    container.addEventListener("click", e => {
        const rect = container.getBoundingClientRect();
        explosion = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            startTime: performance.now()
        };
    });
})();

// Inicia animação ao carregar
document.addEventListener('DOMContentLoaded', () => {
    startAutoAnimation();
});

