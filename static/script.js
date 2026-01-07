document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const impuestoRate = 0.10;
    let productoPendiente = null;
    let modalAbierto = false;
    let verificado = false; // Persistente hasta que se finalice la compra o se vacíe el carrito

    // Elementos del DOM
    const listaCarrito = document.getElementById("lista-carrito");
    const subtotalEl = document.getElementById("subtotal");
    const impuestoEl = document.getElementById("impuesto");
    const totalEl = document.getElementById("total");
    const procesarBtn = document.getElementById("procesar");
    const voidTotalBtn = document.getElementById("void-total");

    // Crear modal dinámicamente
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Verificación de Edad Requerida</h3>
            <p>Ingrese la fecha de nacimiento</p>
            <input type="date" id="fecha-nacimiento">
            <div class="modal-buttons">
                <button id="verificar-edad">ENTER</button>
                <button id="cancelar-edad">CANCELAR</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.style.display = "none";

    const verificarBtn = modal.querySelector("#verificar-edad");
    const cancelarBtn = modal.querySelector("#cancelar-edad");

    // Mostrar modal de verificación de edad
    function pedirFechaNacimiento(producto) {
        if (modalAbierto) return;
        productoPendiente = producto;
        modal.style.display = "flex";
        modalAbierto = true;
    }

    // Verificar edad al hacer clic en ENTER
    verificarBtn.addEventListener("click", () => {
        const fecha = document.getElementById("fecha-nacimiento").value;
        if (!fecha) {
            alert("Por favor, ingresa una fecha válida.");
            return;
        }

        const edad = calcularEdad(fecha);
        if (edad >= 18) {
            carrito.push(productoPendiente);
            actualizarCarrito();
            productoPendiente = null;
            verificado = true; // Mantiene la verificación activa durante la sesión de compra
        } else {
            alert("El cliente es menor de edad. No se puede vender el producto.");
            productoPendiente = null;
        }

        modal.style.display = "none";
        document.getElementById("fecha-nacimiento").value = "";
        modalAbierto = false;
    });

    // Cerrar modal al cancelar
    cancelarBtn.addEventListener("click", () => {
        productoPendiente = null;
        modal.style.display = "none";
        document.getElementById("fecha-nacimiento").value = "";
        modalAbierto = false;
    });

    // Agregar producto al carrito
    document.querySelectorAll(".producto").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nombre = btn.dataset.nombre;
            const precio = parseFloat(btn.dataset.precio);
            const alcohol = parseInt(btn.dataset.es_alcohol);

            // Si es producto con alcohol, verificar solo si no ha sido verificado ya
            if (alcohol != 0 && !verificado) {
                pedirFechaNacimiento({ id, nombre, precio, cantidad: 1 });
                return;
            }

            // Si ya fue verificado o no es alcohol, agregar directamente
            const existente = carrito.find(p => p.id === id);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }
            actualizarCarrito();
        });
    });

    // Actualizar lista del carrito
    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let subtotal = 0;

        carrito.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;

            const voidBtn = document.createElement("button");
            voidBtn.textContent = "VOID";
            voidBtn.classList.add("eliminar");
            voidBtn.addEventListener("click", () => eliminarDelCarrito(item.nombre));

            li.appendChild(voidBtn);
            listaCarrito.appendChild(li);

            subtotal += item.precio * item.cantidad;
        });

        const impuesto = subtotal * impuestoRate;
        const total = subtotal + impuesto;

        subtotalEl.textContent = subtotal.toFixed(2);
        impuestoEl.textContent = impuesto.toFixed(2);
        totalEl.textContent = total.toFixed(2);
    }

    // Eliminar producto del carrito
    function eliminarDelCarrito(nombre) {
        const index = carrito.findIndex(p => p.nombre === nombre);
        if (index !== -1) {
            carrito.splice(index, 1);
            actualizarCarrito();
        }
    }

    // Vaciar todo el carrito
    voidTotalBtn.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito ya está vacío.");
            return;
        }

        const confirmar = confirm("¿Deseas vaciar el carrito?");
        if (confirmar) {
            carrito.length = 0;
            actualizarCarrito();
            verificado = false; // Se reinicia la verificación al vaciar el carrito
            alert("El carrito ha sido vaciado.");
        }
    });

    // Procesar compra
    procesarBtn.addEventListener("click", async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const venta = {
            detalles: carrito,
            total: parseFloat(totalEl.textContent)
        };

        try {
            const res = await fetch("/procesar_venta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(venta)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Compra procesada correctamente.");
                carrito.length = 0;
                actualizarCarrito();
                verificado = false; // Se reinicia al finalizar transacción
            } else {
                alert("Error al procesar la compra: " + (data.message || ""));
            }
        } catch (e) {
            console.error("Error al conectar a Flask:", e);
            alert("Error al conectar al servidor.");
        }
    });

    // TABS DE CATEGORÍAS
    const tabs = document.querySelectorAll(".tab");
    const productosBtns = document.querySelectorAll(".producto");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const categoriaSeleccionada = tab.dataset.categoria;

            // Quitar clase activa de todas las pestañas
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Mostrar solo productos de la categoría seleccionada
            productosBtns.forEach(btn => {
                btn.style.display = (btn.dataset.categoria === categoriaSeleccionada) ? "block" : "none";
            });
        });
    });

    // Activar automáticamente la primera pestaña al cargar
    if (tabs.length > 0) {
        tabs[0].classList.add("active");
        const primeraCategoria = tabs[0].dataset.categoria;
        productosBtns.forEach(btn => {
            btn.style.display = (btn.dataset.categoria === primeraCategoria) ? "block" : "none";
        });
    }

    // Calcular edad
    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return edad;
    }
});
