/**
 * @file hotel.js
 * @description Lógica central del sistema de reservas, incluyendo modelos POO,
 * filtrado por disponibilidad real y cálculo de precios dinámicos.
 */

// ---- ENUMS ----

/** @enum {string} Categorías de habitaciones disponibles */
const ROOMTYPE = Object.freeze({
	SUITE: "suite",
	DOUBLES: "doubles",
	INDIVIDUAL: "individual",
	DELUXE: "deluxe",
	PRESIDENTIAL: "presidential",
	PENTHOUSE: "penthouse",
});

/** @enum {string} Tipos de estado para mensajes de interfaz */
const TYPESTATUS = Object.freeze({
	SUCCESS: "success",
	ERROR: "error",
	WARNING: "warning",
});

/** @enum {string} Nombres de las colecciones en LocalStorage */
const TYPESDB = Object.freeze({
	RESERVA: "reserva",
	CLIENT: "client",
	ROOM: "room",
	INIT: "initialData",
});

// --- MODELOS (POO) ----

/**
 * Clase que representa una Reserva
 */
class Reserva {
	/**
	 * @param {string} email - Email del cliente
	 * @param {Object} date - Rango de fechas
	 * @param {string} date.checkIn - Fecha de entrada (YYYY-MM-DD)
	 * @param {string} date.checkOut - Fecha de salida (YYYY-MM-DD)
	 * @param {string} roomCode - Código único de la habitación asignada
	 * @param {number} total - Coste total calculado de la estancia
	 */

	constructor(email, date, roomCode, total) {
		this.user = email;
		this.date = date;
		this.roomCode = roomCode;
		this.total = total;
	}

	getType() {
		return TYPESDB.RESERVA;
	}

	/** @returns {Object} Representación plana para almacenamiento */
	getInfo() {
		return {
			user: this.user,
			date: this.date,
			roomCode: this.roomCode,
			total: this.total,
		};
	}
}

/**
 * Clase que representa un Cliente
 */
class Client {
	/**
	 * @param {string} email - Email de contacto
	 * @param {string} telf - Teléfono
	 * @param {string} nombre - Nombre
	 * @param {string} apellido - Apellido
	 * @param {string} dni - DNI/NIE
	 */
	constructor(email, telf, nombre, apellido, dni) {
		this.email = email;
		this.telf = telf;
		this.nombre = nombre;
		this.apellido = apellido;
		this.dni = dni;
	}

	getType() {
		return TYPESDB.CLIENT;
	}

	getInfo() {
		return {
			email: this.email,
			telf: this.telf,
			nombre: this.nombre,
			apellido: this.apellido,
			dni: this.dni,
		};
	}
}

/**
 * Clase que representa una Habitación del Hotel
 */
class Room {
	/**
	 * @param {string} code - Identificador (ej: '101')
	 * @param {string} type - Categoría (ROOMTYPE)
	 * @param {number} maxGuest - Capacidad máxima
	 * @param {number} price - Precio por noche
	 */
	constructor(code, type, maxGuest, price) {
		this.code = code;
		this.type = type;
		this.maxGuest = maxGuest;
		this.price = price;
	}

	getType() {
		return TYPESDB.ROOM;
	}

	getInfo() {
		return {
			code: this.code,
			type: this.type,
			maxguest: this.maxGuest,
			price: this.price,
		};
	}
}

// ---- DATOS INICIALES (Seed) ----

const roomData = [
	new Room("101", ROOMTYPE.INDIVIDUAL, 1, 45.0),
	new Room("102", ROOMTYPE.INDIVIDUAL, 1, 45.0),
	new Room("201", ROOMTYPE.DOUBLES, 2, 75.0),
	new Room("202", ROOMTYPE.DOUBLES, 2, 75.0),
	new Room("301", ROOMTYPE.DELUXE, 2, 120.0),
	new Room("401", ROOMTYPE.SUITE, 2, 180.0),
	new Room("501", ROOMTYPE.PRESIDENTIAL, 2, 450.0),
	new Room("PH-01", ROOMTYPE.PENTHOUSE, 2, 950.0),
];

// ---- FUNCIONES DE UTILIDAD ----

/**
 * Calcula el número de noches entre dos fechas.
 * @param {string} checkIn
 * @param {string} checkOut
 * @returns {number}
 */
function calculateNights(checkIn, checkOut) {
	const start = new Date(checkIn);
	const end = new Date(checkOut);
	const diffTime = end - start;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Comprueba si dos rangos de fechas se solapan (Lógica de ocupación).
 */
function areDatesOverlapping(s1, e1, s2, e2) {
	return new Date(s1) < new Date(e2) && new Date(s2) < new Date(e1);
}

/** Mezcla aleatoria de array para visualización */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/** Obtener datos de LocalStorage */
function getDataLocalStorage(dbName) {
	const data = localStorage.getItem(dbName);
	return data ? JSON.parse(data) : [];
}

/** Guardar datos en LocalStorage */
function saveInLocalStorage(dbName, data) {
	localStorage.setItem(dbName, JSON.stringify(data));
}

/** Inicializa las habitaciones si el almacenamiento está vacío */
function seedRooms() {
	const roomsToSave = roomData.map((room) => room.getInfo());
	saveInLocalStorage(TYPESDB.ROOM, roomsToSave);
}

/** Muestra mensajes de error/éxito en la interfaz */
function typeCustomErrorMessage(idElement, status, message) {
	const span = document.getElementById(idElement);
	if (!span) return;
	span.className = "";
	span.classList.add(
		status === TYPESTATUS.ERROR
			? "messageError"
			: status === TYPESTATUS.SUCCESS
				? "messageSuccess"
				: "messageWarning",
	);
	span.innerText = message;
}

// ---- COMPONENTES DE INTERFAZ ----

/** Genera el HTML de una tarjeta de habitación */
function ComponentHotelRoom(code, type, maxGuest, price) {
	return `
    <div class="col-lg-3 col-md-6">
        <div class="card room-card h-100 shadow-sm">
            <div class="room-image-container position-relative">
                <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=80" alt="${type}" class="room-image img-fluid rounded-top" />
                <span class="bg-white fw-bold availability-badge available position-absolute top-0 end-0 m-2">Disponible</span>
            </div>
            <div class="room-card-body p-3 d-flex flex-column">
                <h3 class="room-title mb-2 text-capitalize">${type}</h3>
                <div class="room-features mb-2 text-muted small">
                    <span class="me-3"><i class="bi bi-people"></i> ${maxGuest} pers.</span>
                    <span><i class="bi bi-door-closed"></i> Hab. ${code}</span>
                </div>
                <div class="room-price d-flex align-items-end justify-content-between">
                    <div>
                        <span class="price-amount fs-4 fw-bold">€${price}</span>
                        <span class="price-period text-muted">/ noche</span>
                    </div>
                    <button id="btn-reserva-${code}" class="btn-reserva btn btn-primary btn-sm">Reservar</button>
                </div>
            </div>
        </div>
    </div>`;
}

// ---- LÓGICA DE NEGOCIO ----

/**
 * Procesa la búsqueda inicial desde el index
 */
function searchBoxSection(e) {
	if (e) e.preventDefault();
	const checkIn = document.getElementById("searchCheckIn")?.value;
	const checkOut = document.getElementById("searchCheckOut")?.value;
	const guests =
		parseInt(document.getElementById("searchGuests")?.value, 10) || 0;

	if (!checkIn || !checkOut || guests === 0) {
		typeCustomErrorMessage(
			"error",
			TYPESTATUS.ERROR,
			"Completa todos los campos.",
		);
		return;
	}

	if (new Date(checkIn) >= new Date(checkOut)) {
		typeCustomErrorMessage(
			"error",
			TYPESTATUS.ERROR,
			"El check-out debe ser después del check-in.",
		);
		return;
	}

	saveInLocalStorage(TYPESDB.INIT, { checkIn, checkOut, guests });
	displayRooms();
}

/**
 * Filtra y muestra las habitaciones disponibles
 */
function displayRooms() {
	const container = document.getElementById("roomsContainer");
	if (!container) return;
	container.innerHTML = "";

	const rooms = getDataLocalStorage(TYPESDB.ROOM);
	const initialData = getDataLocalStorage(TYPESDB.INIT);
	const reservas = getDataLocalStorage(TYPESDB.RESERVA);

	// FILTRADO REAL
	const filteredRooms = rooms.filter((room) => {
		if (room.maxguest < initialData.guests) return false;
		const isOccupied = reservas.some(
			(res) =>
				res.roomCode === room.code &&
				areDatesOverlapping(
					initialData.checkIn,
					initialData.checkOut,
					res.date.checkIn,
					res.date.checkOut,
				),
		);
		if (isOccupied) return false;
		return true;
	});

	if (filteredRooms.length === 0) {
		container.innerHTML =
			"<p class='text-center w-100 my-5'>No hay habitaciones disponibles para estas fechas o capacidad.</p>";
		return;
	}

	shuffleArray(filteredRooms).forEach((room) => {
		container.innerHTML += ComponentHotelRoom(
			room.code,
			room.type,
			room.maxguest,
			room.price,
		);
	});

	// Eventos para botones de reserva
	document.querySelectorAll(".btn-reserva").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const code = e.target.id.split("-")[2];
			const currentInit = getDataLocalStorage(TYPESDB.INIT);
			saveInLocalStorage(TYPESDB.INIT, { ...currentInit, codeRoom: code });
			window.location.href = "src/pages/form.html";
		});
	});
}

/**
 * Calcula y muestra el precio total en el formulario
 */
function updateTotalPrice() {
	const roomCode = document.getElementById("roomType").value;
	const checkIn = document.getElementById("formCheckIn").value;
	const checkOut = document.getElementById("formCheckOut").value;
	const totalDisplay = document.getElementById("totalPriceDisplay");

	if (roomCode && checkIn && checkOut) {
		const nights = calculateNights(checkIn, checkOut);
		if (nights > 0) {
			const rooms = getDataLocalStorage(TYPESDB.ROOM);
			const room = rooms.find((r) => r.code === roomCode);
			if (room) {
				const total = nights * room.price;
				if (totalDisplay) {
					totalDisplay.innerHTML = `<strong>Total: ${total.toFixed(2)}€</strong> (${nights} noches x ${room.price}€)`;
				}
				return total;
			}
		}
	}
	if (totalDisplay) totalDisplay.innerText = "";
	return 0;
}

/**
 * Prepara el formulario de reserva con los datos del paso anterior
 */
function printFormOrder() {
	const rooms = getDataLocalStorage(TYPESDB.ROOM);
	const select = document.getElementById("roomType");
	if (!select) return;

	// Rellenar select de habitaciones
	rooms.forEach((room) => {
		select.innerHTML += `<option value="${room.code}">Habitación ${room.code} - ${room.type} (${room.price}€/noche)</option>`;
	});

	const init = getDataLocalStorage(TYPESDB.INIT);
	if (init.codeRoom) {
		select.value = init.codeRoom;
		document.getElementById("formCheckIn").value = init.checkIn || "";
		document.getElementById("formCheckOut").value = init.checkOut || "";
		document.getElementById("formGuests").value = init.guests || "";
		updateTotalPrice();
	}

	// Recalcular precio cuando cambien datos clave
	[
		select,
		document.getElementById("formCheckIn"),
		document.getElementById("formCheckOut"),
	].forEach((el) => {
		el.addEventListener("change", updateTotalPrice);
	});
}

/**
 * Procesa la confirmación final de la reserva
 */
function confirmBook() {
	const form = document.getElementById("reservationForm");
	if (!form) return;

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const fd = new FormData(form);
		const checkIn = fd.get("checkIn");
		const checkOut = fd.get("checkOut");
		const roomCode = fd.get("roomType");

		// VALIDACIONES FINALES
		if (new Date(checkIn) >= new Date(checkOut)) {
			typeCustomErrorMessage(
				"messageInfoUser",
				TYPESTATUS.ERROR,
				"La fecha de salida es inválida.",
			);
			return;
		}

		const reservas = getDataLocalStorage(TYPESDB.RESERVA);
		const isOccupied = reservas.some(
			(res) =>
				res.roomCode === roomCode &&
				areDatesOverlapping(
					checkIn,
					checkOut,
					res.date.checkIn,
					res.date.checkOut,
				),
		);

		if (isOccupied) {
			typeCustomErrorMessage(
				"messageInfoUser",
				TYPESTATUS.ERROR,
				"La habitación ya no está disponible para esas fechas.",
			);
			return;
		}

		const total = updateTotalPrice();
		const client = new Client(
			fd.get("email"),
			fd.get("phone"),
			fd.get("firstName"),
			fd.get("lastName"),
			fd.get("dni"),
		);
		const book = new Reserva(
			fd.get("email"),
			{ checkIn, checkOut },
			roomCode,
			total,
		);

		// Persistencia
		const clients = getDataLocalStorage(TYPESDB.CLIENT);
		clients.push(client.getInfo());
		saveInLocalStorage(TYPESDB.CLIENT, clients);

		reservas.push(book.getInfo());
		saveInLocalStorage(TYPESDB.RESERVA, reservas);

		// Feedback visual (Modal)
		if (typeof bootstrap !== "undefined") {
			const modalEl = document.getElementById("confirmationModal");
			if (modalEl) {
				const modal = new bootstrap.Modal(modalEl);
				document.getElementById("confirmEmail").innerText = client.email;
				modal.show();
			}
		}
	});
}

// ---- INICIALIZACIÓN ----
document.addEventListener("DOMContentLoaded", () => {
	if (getDataLocalStorage(TYPESDB.ROOM).length === 0) seedRooms();

	const path = window.location.pathname;
	if (path.endsWith("index.html") || path === "/" || path === "") {
		const sf = document.getElementById("searchForm");
		if (sf) sf.addEventListener("submit", searchBoxSection);
		displayRooms();
	} else if (path.includes("form.html")) {
		printFormOrder();
		confirmBook();
	}
});
