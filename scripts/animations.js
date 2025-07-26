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

function clear_intro_spans(obj_tag) {
    const spans = document.querySelectorAll(obj_tag);
    spans.forEach(sp => {
        sp.innerHTML = ""
    });
}

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

