(() => {
    const container = document.getElementById("page-intro");

    // Cria e injeta canvas dentro do container
    const canvas = document.createElement("canvas");
    canvas.id = 'canvas-intro'
    container.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let width, height;

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const NUM_SHAPES = 25;
    const MAX_SPEED = 0.3;
    const MOUSE_RADIUS = 300;
    const EXPLOSION_RADIUS = 250;
    const EXPLOSION_FORCE = 10;
    const BLUR_DURATION = 500;

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
            size: 20 + Math.random() * 40,
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
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
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

            for (let i = 0; i < shapes.length; i++) {
                for (let j = i + 1; j < shapes.length; j++) {
                    const s1 = shapes[i];
                    const s2 = shapes[j];

                    const dx = s2.x - s1.x;
                    const dy = s2.y - s1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = s1.size + s2.size;

                    if (dist < minDist && dist > 0) {
                        // Normal unit vector
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Tangent vector
                        const tx = -ny;
                        const ty = nx;

                        // Projeção das velocidades nas direções normal e tangente
                        const dpTan1 = s1.vx * tx + s1.vy * ty;
                        const dpTan2 = s2.vx * tx + s2.vy * ty;

                        const dpNorm1 = s1.vx * nx + s1.vy * ny;
                        const dpNorm2 = s2.vx * nx + s2.vy * ny;

                        // Troca velocidades normais (massa igual)
                        const m1 = dpNorm2;
                        const m2 = dpNorm1;

                        // Atualiza velocidades
                        s1.vx = tx * dpTan1 + nx * m1;
                        s1.vy = ty * dpTan1 + ny * m1;
                        s2.vx = tx * dpTan2 + nx * m2;
                        s2.vy = ty * dpTan2 + ny * m2;

                        // Corrige sobreposição suavemente
                        const overlap = 0.5 * (minDist - dist + 0.1); // +0.1 para evitar zero absoluto
                        s1.x -= nx * overlap;
                        s1.y -= ny * overlap;
                        s2.x += nx * overlap;
                        s2.y += ny * overlap;
                    }
                }
            }


            // Bordas
            if (shape.x < 0 || shape.x > width) shape.vx *= -1;
            if (shape.y < 0 || shape.y > height) shape.vy *= -1;

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

            // Fricção
            shape.vx *= 0.98;
            shape.vy *= 0.98;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Degradê circular de fundo escurecido
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.max(width, height) / 1.5;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0, "rgba(139, 139, 139, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
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

    window.addEventListener("mouseleave", () => {
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

