document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la API al cargar la página
    obtenerDatosDolarBlue();
});

function mostrarMensajeCarga() {
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Cargando...';
}

function obtenerTasaConversion(direccion, data) {
    // Verifica la dirección de la conversión
    if (direccion === 'usdToArs') {
        // Si es de dólar a peso argentino, usa la tasa de compra
        return data.compra;
    } else {
        // Si es de peso argentino a dólar, usa la tasa de venta
        return data.venta;
    }
}

function obtenerDatosDolarBlue() {
    // Muestra el mensaje de carga
    mostrarMensajeCarga();

    // Realiza la llamada a la API
    fetch('https://dolarapi.com/v1/dolares/blue')
        .then(response => response.json())
        .then(data => {
            // Actualiza la interfaz con los datos obtenidos
            actualizarInterfaz(data);
        })
        .catch(error => {
            console.error('Error al obtener datos de la API:', error);
            // Muestra un mensaje de error en caso de fallo
            mostrarMensajeError();
        });
}

function mostrarMensajeError() {
    const resultElement = document.getElementById('result');
    resultElement.textContent = 'Error al cargar los datos. Por favor, intenta de nuevo más tarde.';
}

function actualizarInterfaz(data) {
    const compra = data.compra;
    const venta = data.venta;

    // Muestra el valor del dólar en la interfaz
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Compra: $${compra} - Venta: $${venta}`;
}

function convertirDolar() {
    // Muestra el mensaje de carga con el spinner
    mostrarMensajeCarga();

    // Obtiene los elementos del DOM
    const amountInput = document.getElementById('amountInput');
    const resultElement = document.getElementById('result');
    const conversionResultElement = document.getElementById('conversionResult');
    const conversionDirection = document.getElementById('conversionDirection').value;

    // Obtiene la cantidad ingresada
    const amount = parseFloat(amountInput.value);

    // Verifica si la cantidad es válida
    if (isNaN(amount)) {
        resultElement.textContent = 'Ingrese una cantidad válida.';
        return;
    }

    // Agrega un spinner mientras espera
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role', 'status');

    // Agrega el spinner al resultado
    resultElement.innerHTML = '';
    resultElement.appendChild(spinner);

    // Realiza la llamada a la API después de 3 segundos
    setTimeout(() => {
        fetch('https://dolarapi.com/v1/dolares/blue')
            .then(response => response.json())
            .then(data => {
                // Obtiene la tasa según la dirección de la conversión
                const tasa = obtenerTasaConversion(conversionDirection, data);

                // Verifica si la conversión fue exitosa
                if (isNaN(tasa)) {
                    resultElement.textContent = `Error al obtener la tasa de cambio. Respuesta de la API: ${resultElement.textContent}`;
                    return;
                }

                // Realiza la conversión según la dirección
                const resultadoConversion = conversionDirection === 'usdToArs' ? amount * tasa : amount / tasa;

                // Muestra el resultado después de 3 segundos en el nuevo div
                setTimeout(() => {
                    // Limpiar el contenido actual del nuevo div
                    conversionResultElement.innerHTML = '';
                    // Mostrar el resultado en el nuevo div
                    conversionResultElement.textContent = `Resultado de la conversión: $${resultadoConversion.toFixed(2)}`;

                    // Actualizar también el resultado de compra y venta
                    resultElement.textContent = `Compra: $${data.compra} - Venta: $${data.venta}`;
                }, 500);
            })
            .catch(error => {
                console.error('Error al obtener datos de la API:', error);
                // Muestra un mensaje de error en caso de fallo
                mostrarMensajeError();
            });
    }, 1000);
}


