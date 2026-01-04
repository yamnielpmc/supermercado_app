document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const impuestoRate = 0.10;

    const cashierName = document.getElementById("cashier-id");
    const listaCarrito = document.getElementById("lista-carrito");
    const subtotalEl = document.getElementById("subtotal");
    const impuestoEl = document.getElementById("impuesto");
    const totalEl = document.getElementById("total");
    const procesarBtn = document.getElementById("procesar");

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = '<div class="modal-content"><h3>Verificacion de Edad Requirida</h3><p>Ingrese la fecha de nacimiento</p><input type="date" id="fecha-nacimiento"><div class="modal-buttons"><button id="verificar-edad">ENTER</button><button id="cancelar-edad">CANCELAR</button></div></div>';

    document.body.appendChild(modal);
    modal.style.display = "none";

    document.getElementById("verificar-edad").addEventListener("click", () => {
    const fecha = document.getElementById("fecha-nacimiento").value;
    if (!fecha) {
        alert("Por favor, ingresa una fecha valida!");
        return;
    }

    const edad = calcularEdad(fecha);
    if(edad >= 18) {
        carrito.push(productoPendiente);
        productoPendiente = null;
        modal.style.display = "none";
        document.getElementById("fecha-nacimiento").value = "";
        actualizarCarrito();
    }else{
        alert("El cliente es menor de edad. No se le puede vender el producto.")
        modal.style.display = "none";
    }
});

    document.getElementById("cancelar-edad").addEventListener("click", () => {
        modal.style.display = "none";
        productoPendiente = null;
        document.getElementById("fecha-nacimiento").value = "";
    });

    let productoPendiente = null;

    // Agregar producto al carrito
    document.querySelectorAll(".producto").forEach(btn => {
        btn.addEventListener("click", () => {
            // Obtener datos del producto desde la base de datos
            const id = btn.dataset.id;
            const nombre = btn.dataset.nombre;
            const precio = parseFloat(btn.dataset.precio);
            const categoria = btn.dataset.categoria.toLowerCase();

            if(categoria === "alcohol" || categoria === "tabaco" || categoria === "alcohol x mayor"){
                productoPendiente = {id, nombre, precio, cantidad: 1};
                modal.style.display = "flex";
                return;
            }
            // Verificar si el producto ya está en el carrito
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
    // Limpiar la lista actual
    listaCarrito.innerHTML = "";
    let subtotal = 0;

    // Mostrar cada producto en el carrito
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

        // Agregar botón al elemento de la lista
        li.appendChild(voidBtn);
        listaCarrito.appendChild(li);

        subtotal += item.precio * item.cantidad;
    });

    // Calcular totales
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

    // Pedir Fecha de Nacimiento
    function fechaNacimiento() {

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

        // Preparar datos de la venta
        const venta = {
            detalles: carrito,
            total: parseFloat(totalEl.textContent)
        };

        console.log("Procesando venta:", venta);

        // Enviar datos al servidor Flask
        try {
            const res = await fetch("/procesar_venta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(venta)
            });

            // Obtener respuesta del servidor
            const data = await res.json();

            // Manejar la respuesta
            if (res.ok) {
                alert("Compra procesada correctamente!");
                carrito.length = 0;
                actualizarCarrito();
            } else {
                alert("Error al procesar la compra.");
        }
    } catch (e) {
        console.error("Error al conectar a Flask:", e);
        alert("Error al conectar al servidor.");
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

    function calcularEdad(fechaNacimiento){
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if(mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }