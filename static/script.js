document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const impuestoRate = 0.10;

    const listaCarrito = document.getElementById("lista-carrito");
    const subtotalEl = document.getElementById("subtotal");
    const impuestoEl = document.getElementById("impuesto");
    const totalEl = document.getElementById("total");
    const procesarBtn = document.getElementById("procesar");

    // Agregar producto al carrito
    document.querySelectorAll(".producto").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const nombre = btn.dataset.nombre;
            const precio = parseFloat(btn.dataset.precio);

            const existente = carrito.find(p => p.id === id);
            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
        });
    });

    // Actualizar la lista del carrito y totales
    function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let subtotal = 0;

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;

        // Crear botón "Void"
        const voidBtn = document.createElement("button");
        voidBtn.textContent = "VOID";
        voidBtn.classList.add("eliminar");
        voidBtn.addEventListener("click", () => {
            eliminarDelCarrito(item.nombre);
        });

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

    // Botón "VOID TOTAL"
    const voidTotalBtn = document.getElementById("void-total");
    voidTotalBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }
        const confirmar = confirm("¿Estás seguro de que deseas vaciar el carrito?");
        if (confirmar){
            carrito.length = 0;
            actualizarCarrito();
            alert("El carrito ha sido vaciado.");
        } else {
            alert("Operacion Cancelada.");
        }
    });


    // Procesar compra
    procesarBtn.addEventListener("click", async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const total = parseFloat(totalEl.textContent);

        const venta = {
            detalles: carrito,
            total: total
        };

        const res = await fetch("/procesar_venta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(venta)
        });

        if (res.ok) {
            alert("✅ Compra procesada correctamente!");
            carrito.length = 0;
            actualizarCarrito();
        } else {
            alert("❌ Error al procesar la compra.");
        }
    });
});

// Tabs de categorías
const tabs = document.querySelectorAll(".tab");
const productosBtns = document.querySelectorAll(".producto");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const categoriaSeleccionada = tab.dataset.categoria;

        // Activar la pestaña seleccionada
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Mostrar solo los productos de esa categoría
        productosBtns.forEach(btn => {
            if (btn.dataset.categoria === categoriaSeleccionada) {
                btn.style.display = "block";
            } else {
                btn.style.display = "none";
            }
        });
    });
});

// Activar la primera pestaña al cargar
if (tabs.length > 0) {
    tabs[0].classList.add("active");
    const primeraCategoria = tabs[0].dataset.categoria;
    productosBtns.forEach(btn => {
        btn.style.display = (btn.dataset.categoria === primeraCategoria) ? "block" : "none";
    });
}