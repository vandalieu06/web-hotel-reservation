// ---- ENUMS ----
const ROOMTYPE = Object.freeze({
	SUITE: "suite",
	DOUBLES: "doubles",
	INDIVIDUAL: "individual",
	DELUXE: "deluxe",
	PRESIDENTIAL: "presidential",
	PENTHOUSE: "penthouse",
});

const TYPESTATUS = Object.freeze({
	SUCCESS: "success",
	ERROR: "error",
	WARNING: "warning",
});

const TYPESDB = Object.freeze({
	RESERVA: "reserva",
	CLIENT: "client",
	ROOM: "room",
	INIT: "initialData",
});

// --- MODELS ----
class Reserva {
	constructor(email, date, roomType, numRoom) {
		this.user = email;
		this.date = date;
		this.roomType = roomType;
		this.numRoom = numRoom;
	}

	getType() {
		return TYPESDB.RESERVA;
	}

	getInfo() {
		return {
			user: this.user,
			date: this.date,
			roomType: this.roomType,
			numRoom: this.numRoom,
		};
	}
}

class Client {
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

class Room {
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

// ---- EXAMPLE DATA ----
const roomData = [
	new Room("101", ROOMTYPE.INDIVIDUAL, 1, 45.0),
	new Room("102", ROOMTYPE.INDIVIDUAL, 1, 45.0),
	new Room("103", ROOMTYPE.INDIVIDUAL, 1, 50.0),
	new Room("104", ROOMTYPE.INDIVIDUAL, 1, 50.0),
	new Room("105", ROOMTYPE.INDIVIDUAL, 1, 60.0),
	new Room("201", ROOMTYPE.DOUBLES, 2, 75.0),
	new Room("202", ROOMTYPE.DOUBLES, 2, 75.0),
	new Room("203", ROOMTYPE.DOUBLES, 2, 80.0),
	new Room("204", ROOMTYPE.DOUBLES, 2, 80.0),
	new Room("205", ROOMTYPE.DOUBLES, 2, 85.0),
	new Room("206", ROOMTYPE.DOUBLES, 2, 85.0),
	new Room("207", ROOMTYPE.DOUBLES, 2, 90.0),
	new Room("208", ROOMTYPE.DOUBLES, 2, 95.0),
	new Room("301", ROOMTYPE.DELUXE, 1, 120.0),
	new Room("302", ROOMTYPE.DELUXE, 1, 120.0),
	new Room("303", ROOMTYPE.DELUXE, 2, 140.0),
	new Room("304", ROOMTYPE.DELUXE, 2, 140.0),
	new Room("305", ROOMTYPE.DELUXE, 2, 150.0),
	new Room("401", ROOMTYPE.SUITE, 1, 180.0),
	new Room("402", ROOMTYPE.SUITE, 1, 180.0),
	new Room("403", ROOMTYPE.SUITE, 2, 220.0),
	new Room("404", ROOMTYPE.SUITE, 2, 220.0),
	new Room("405", ROOMTYPE.SUITE, 2, 250.0),
	new Room("501", ROOMTYPE.PRESIDENTIAL, 1, 400.0),
	new Room("502", ROOMTYPE.PRESIDENTIAL, 1, 450.0),
	new Room("503", ROOMTYPE.PRESIDENTIAL, 2, 500.0),
	new Room("504", ROOMTYPE.PRESIDENTIAL, 2, 550.0),
	new Room("PH-01", ROOMTYPE.PENTHOUSE, 1, 800.0),
	new Room("PH-02", ROOMTYPE.PENTHOUSE, 2, 950.0),
	new Room("PH-03", ROOMTYPE.PENTHOUSE, 2, 1200.0),
];

// ---- START LOGIC ----

// Obtiene los datos almacenados en LocalStorage por nombre de colección
function getDataLocalStorage(dbName) {
	const data = localStorage.getItem(dbName);
	if (data === null) return [];
	return JSON.parse(data);
}

// Guarda un objeto o array en LocalStorage bajo un nombre específico
function saveInLocalStorage(dbName, data) {
	localStorage.setItem(dbName, JSON.stringify(data));
}

// Inicializa la base de datos de habitaciones con datos de ejemplo si está vacía
function seedRooms() {
	const roomsToSave = roomData.map((room) => room.getInfo());
	saveInLocalStorage(TYPESDB.ROOM, roomsToSave);
}

// Muestra un mensaje de error, éxito o advertencia en un elemento específico del DOM
function typeCustomErrorMessage(idElement, status, message) {
	const span = document.getElementById(idElement);
	if (!span) return;

	span.className = "";
	switch (status.toLowerCase()) {
		case TYPESTATUS.ERROR:
			span.classList.add("messageError");
			span.innerText = message;
			break;
		case TYPESTATUS.SUCCESS:
			span.classList.add("messageSuccess");
			span.innerText = message;
			break;
		case TYPESTATUS.WARNING:
			span.classList.add("messageWarning");
			span.innerText = message;
			break;
	}
}

// Genera el código HTML para una tarjeta de habitación en la página principal
function ComponentHotelRoom(code, type, maxGuest, price) {
	return `
    <div class="col-lg-4 col-md-6">
        <div class="card room-card h-100 shadow-sm">
            <div class="room-image-container position-relative">
                <img src="https://placehold.co/600x400" alt="${type}" class="room-image img-fluid rounded-top" />
                <span class="availability-badge available position-absolute top-0 end-0 m-2">Disponible</span>
            </div>
            <div class="room-card-body p-3 d-flex flex-column">
                <h3 class="room-title mb-2 text-capitalize">${type}</h3>
                <div class="room-features mb-2 text-muted small">
                    <span class="me-3"><i class="bi bi-people"></i> ${maxGuest} personas</span>
                    <span><i class="bi bi-door-closed"></i> Hab. ${code}</span>
                </div>
                <p class="room-description flex-grow-1">Habitación ${type.toLowerCase()} equipada con todas las comodidades.</p>
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

// Genera una opción para el elemento select de selección de habitación
function ComponentSelectRoom(code, type) {
	return `<option value="${code}">Habitación ${code} - ${type}</option>`;
}

// Gestiona la lógica de búsqueda de habitaciones desde la caja de búsqueda principal
function searchBoxSection(e) {
	if (e) e.preventDefault();
	const dateCheckIn = document.getElementById("searchCheckIn")?.value;
	const dateCheckOut = document.getElementById("searchCheckOut")?.value;
	const countGuests =
		parseInt(document.getElementById("searchGuests")?.value, 10) || 0;

	if (!dateCheckIn || !dateCheckOut || countGuests === 0) {
		typeCustomErrorMessage(
			"error",
			TYPESTATUS.ERROR,
			"Por favor, complete todos los campos.",
		);
		return;
	}

	const newCheckInDate = new Date(dateCheckIn);
	const newCheckOutDate = new Date(dateCheckOut);

	if (newCheckInDate > newCheckOutDate) {
		typeCustomErrorMessage(
			"error",
			TYPESTATUS.ERROR,
			"El check-in no puede ser posterior al check-out.",
		);
		return;
	}

	const initialData = {
		checkIn: dateCheckIn,
		checkOut: dateCheckOut,
		guests: countGuests,
	};
	saveInLocalStorage(TYPESDB.INIT, initialData);
	displayRooms();
}

// Filtra y muestra las habitaciones disponibles en el contenedor correspondiente
function displayRooms() {
	const roomsContainer = document.getElementById("roomsContainer");
	if (!roomsContainer) return;
	roomsContainer.innerHTML = "";

	const rooms = getDataLocalStorage(TYPESDB.ROOM);
	const initialData = getDataLocalStorage(TYPESDB.INIT);
	const requiredGuests = parseInt(initialData.guests, 10) || 0;

	let filteredRooms = rooms;
	if (requiredGuests !== 0) {
		filteredRooms = rooms.filter((room) => room.maxguest === requiredGuests);
	}

	filteredRooms.forEach((room) => {
		roomsContainer.innerHTML += ComponentHotelRoom(
			room.code,
			room.type,
			room.maxguest,
			room.price,
		);
	});

	document.querySelectorAll(".btn-reserva").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const codeRoom = e.target.id.split("-")[2];
			const datos = getDataLocalStorage(TYPESDB.INIT);
			const newDatos = { ...datos, codeRoom: codeRoom };
			saveInLocalStorage(TYPESDB.INIT, newDatos);
			window.location.href = "src/pages/form.html";
		});
	});
}
displayRooms();

// Rellena el formulario de reserva con los datos previos seleccionados por el usuario
function printFormOrder() {
	const dataRoomUser = getDataLocalStorage(TYPESDB.ROOM);
	const formSelectRoom = document.getElementById("roomType");
	if (!formSelectRoom) return;

	dataRoomUser.forEach((room) => {
		formSelectRoom.innerHTML += ComponentSelectRoom(room.code, room.type);
	});

	const initData = getDataLocalStorage(TYPESDB.INIT);
	if (initData?.codeRoom) {
		formSelectRoom.value = initData.codeRoom;
		document.getElementById("formCheckIn").value = initData.checkIn || "";
		document.getElementById("formCheckOut").value = initData.checkOut || "";
		document.getElementById("formGuests").value = initData.guests || "";
	}
}

// Gestiona el envío del formulario de reserva y guarda los datos finales del cliente
function confirmBook() {
	const formDataUser = document.getElementById("reservationForm");
	if (!formDataUser) return;

	formDataUser.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(formDataUser);

		let isValid = true;
		for (const [key, value] of formData) {
			if (value === "" && key !== "terms") {
				isValid = false;
				break;
			}
		}

		if (!isValid) {
			typeCustomErrorMessage(
				"messageInfoUser",
				TYPESTATUS.ERROR,
				"Por favor, complete todos los campos.",
			);
			return;
		}

		const client = new Client(
			formData.get("email"),
			formData.get("phone"),
			formData.get("firstName"),
			formData.get("lastName"),
			formData.get("dni"),
		);

		const book = new Reserva(
			formData.get("email"),
			{
				checkIn: formData.get("checkIn"),
				checkOut: formData.get("checkOut"),
			},
			formData.get("roomType"),
			formData.get("roomType"),
		);

		const clients = getDataLocalStorage(TYPESDB.CLIENT);
		clients.push(client.getInfo());
		saveInLocalStorage(TYPESDB.CLIENT, clients);

		const reservas = getDataLocalStorage(TYPESDB.RESERVA);
		reservas.push(book.getInfo());
		saveInLocalStorage(TYPESDB.RESERVA, reservas);

		typeCustomErrorMessage(
			"messageInfoUser",
			TYPESTATUS.SUCCESS,
			"¡Reserva confirmada! Gracias por elegirnos.",
		);

		if (typeof bootstrap !== "undefined") {
			const modalElement = document.getElementById("confirmationModal");
			if (modalElement) {
				const modal = new bootstrap.Modal(modalElement);
				document.getElementById("confirmEmail").innerText = client.email;
				modal.show();
			}
		}
	});
}

// Punto de entrada principal que inicializa la aplicación según la página actual
document.addEventListener("DOMContentLoaded", () => {
	if (getDataLocalStorage(TYPESDB.ROOM).length === 0) {
		seedRooms();
	}

	const path = window.location.pathname;
	const isHome =
		path.endsWith("index.html") || path === "/" || path.endsWith("/");
	const isFormPage = path.includes("form.html");

	if (isHome) {
		const searchForm = document.getElementById("searchForm");
		if (searchForm) searchForm.addEventListener("submit", searchBoxSection);
		displayRooms();
	}

	if (isFormPage) {
		printFormOrder();
		confirmBook();
	}
});
