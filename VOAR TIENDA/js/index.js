document.addEventListener('DOMContentLoaded', function() {
    const contenedorJuegos = document.getElementById('contenedorJuegos');
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarritoElemento = document.getElementById('totalCarrito');
    let totalCarrito = parseFloat(totalCarritoElemento.textContent);

    const toastConfig = {
        duration: 3000,
        gravity: 'top',
        position: 'right',
    };

    // guardar el carrito en localStorage
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(Array.from(listaCarrito.children).map(item => item.textContent)));
        localStorage.setItem('totalCarrito', totalCarrito.toFixed(2));
    }

    // Función para cargar el carrito desde localStorage
    function cargarCarritoDesdeLocalStorage() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
        if (carritoGuardado) {
            carritoGuardado.forEach(item => {
                const elementoLista = document.createElement('li');
                elementoLista.textContent = item;
                listaCarrito.appendChild(elementoLista);
            });
        }
        const totalGuardado = localStorage.getItem('totalCarrito');
        if (totalGuardado) {
            totalCarrito = parseFloat(totalGuardado);
            totalCarritoElemento.textContent = totalCarrito.toFixed(2);
        }
    }

    function agregarAlCarrito(juego) {
        const elementoLista = document.createElement('li');
        elementoLista.textContent = juego.titulo; // Corrige acceso a la propiedad 'titulo'
        listaCarrito.appendChild(elementoLista);

        if (juego.precio) {
            totalCarrito += parseFloat(juego.precio);
            totalCarritoElemento.textContent = totalCarrito.toFixed(2);
        }

        // Guardar el carrito en localStorage después de agregar un juego
        guardarCarritoEnLocalStorage();

        // Mostrar notificación de producto agregado al carrito
        Toastify({
            text: `¡${juego.titulo} agregado al carrito!`, // Cambia "title" a "titulo"
            backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
            ...toastConfig,
        }).showToast();
    }

    async function renderizarJuegos() {
        try {
            const url = 'https://free-to-play-games-database.p.rapidapi.com/api/filter?tag=3d.mmorpg.fantasy.pvp&platform=pc';
            const opciones = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '44be1a9a09msh911140abb95b0a0p107ab0jsnf3e26d7550b6',
                    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
                }
            };

            const respuesta = await fetch(url, opciones);
            const datos = await respuesta.json();
            const primerosSeisJuegos = datos.slice(0, 6);

            primerosSeisJuegos.forEach(juego => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';

                const titulo = document.createElement('h2');
                titulo.textContent = juego.titulo; // Cambia "title" a "titulo"

                const imagen = document.createElement('img');
                imagen.src = juego.thumbnail;

                const descripcion = document.createElement('p');
                descripcion.textContent = juego.short_description;

                const precio = document.createElement('p');
                precio.textContent = `Precio: $${juego.price || 'Gratis'}`;

                const botonComprar = document.createElement('button');
                botonComprar.textContent = 'Comprar';
                botonComprar.addEventListener('click', () => agregarAlCarrito(juego));

                tarjeta.appendChild(titulo);
                tarjeta.appendChild(imagen);
                tarjeta.appendChild(descripcion);
                tarjeta.appendChild(precio);
                tarjeta.appendChild(botonComprar);

                contenedorJuegos.appendChild(tarjeta);
            });
        } catch (error) {
            console.error(error);
        }
    }

    renderizarJuegos();

    // Botón para concretar la compra
    const botonConcretarCompra = document.getElementById('botonConcretarCompra');
    botonConcretarCompra.addEventListener('click', function() {
        if (confirm('¿Confirmar compra?\nEstás a punto de concretar la compra. ¿Estás seguro?')) {

            listaCarrito.innerHTML = '';
            totalCarrito = 0;

            totalCarritoElemento.textContent = '0.00';
            localStorage.removeItem('carrito');
            localStorage.removeItem('totalCarrito');


            // Mostrar mensaje de éxito
            alert('Compra realizada! Tu compra se ha realizado con exito.');
        }
    });

});