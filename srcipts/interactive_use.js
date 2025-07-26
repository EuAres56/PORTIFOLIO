// Função para abrir/fechar a navbar
function toggle_nav_menu() {
    const btnNavToggle = document.getElementById('navbar-toggle');
    const navBar = document.getElementById('navbar');
    const pages = document.querySelectorAll('.slide');

    if (navBar && btnNavToggle) {
        if (window.innerWidth > 768) {
            // Fecha navbar
            if (!navBar.classList.contains('navbar-close')) {
                pages.forEach(pg => {
                    pg.style.paddingLeft = "var(--padding_page_y)";
                });

                navBar.classList.add('navbar-close');
                btnNavToggle.style.transform = `translateX(0px)`;
                btnNavToggle.style.setProperty("--rotation", "225deg");
                btnNavToggle.style.setProperty("--position_x", "5px");
                btnNavToggle.style.setProperty("--position_y", "-5px");
                btnNavToggle.style.setProperty("--sha_togge", "-3px 2px");
            }
            // Abre navbar
            else {
                pages.forEach(pg => {
                    pg.style.paddingLeft = "calc(250px + var(--padding_page_y))";
                });

                navBar.classList.remove('navbar-close');
                btnNavToggle.style.transform = `translateX(249px)`;
                btnNavToggle.style.setProperty("--rotation", "45deg");
                btnNavToggle.style.setProperty("--position_x", "0px");
                btnNavToggle.style.setProperty("--position_y", "0px");
                btnNavToggle.style.setProperty("--sha_togge", "3px 2px");
            }
        } else if (window.innerWidth > 600) {
            return;
        } else {
            // Fecha navbar (mobile)
            if (!navBar.classList.contains('navbar-close')) {
                navBar.classList.add('navbar-close');
                btnNavToggle.style.transform = `translateX(0) rotateZ(0deg)`;
            }
            // Abre navbar (mobile)
            else {
                navBar.classList.remove('navbar-close');
                btnNavToggle.style.transform = `translateX(calc(100dvw - 2.5rem)) rotateZ(180deg)`;
            }
        }
    }
}

// Espera o DOM carregar e aplica o evento
document.addEventListener('DOMContentLoaded', () => {
    const btnNavToggle = document.getElementById('navbar-toggle');
    if (btnNavToggle) {
        btnNavToggle.addEventListener('click', toggle_nav_menu);
    }
});
