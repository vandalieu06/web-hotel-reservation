//CONST rooms
const RoomType = Object.freeze({
	SUITE: "suite",
	DOUBLES: "doubles",
	INDIVIDUAL: "individual",
	DELUXE: "deluxe",
	PRESIDENTIAL: "presidential",
	PENTHOUSE: "penthouse",
});

//Class
class Reserva {
	constructor(email, date, roomType, numRoom) {
		this.user = email;
		this.date = date;
		this.roomType = roomType;
		this.numRoom = numRoom;
	}

	getDate() {
		return this.date;
	}
}

class Client {
	constructor(email, telf) {
		this.email = email;
		this.telf = telf;
	}

	getEmail() {
		return this.email;
	}

	setTelf(telf) {
		this.telf = telf;
	}
}

//aux functions
function typeMessage(messageType, idElement, message) {
	let span = document.getElementById(idElement);

	switch (messageType) {
		case "error":
			span.classList.add("messageError");
			span.innerText = message;
			break;

		case "success":
			span.classList.add("messageSuccess");
			span.innerText = message;
			break;

		case "warning":
			span.classList.add("messageWarning");
			span.innerText = message;
			break;
	}
}

//index.html
function searchBoxSection() {
	//get values
	let checkIn = document.getElementById("searchCheckIn").value;
	let checkOut = document.getElementById("searchCheckOut").value;
	let guests = document.getElementById("searchGuests").value;

	//validator empty values
	if (checkIn === "" || checkOut === "") {
		typeMessage("error", "error", "Porfavor, seleccione una fecha");
		return;
	}

	//Date transform
	checkInDate = new Date(checkIn);
	checkOutDate = new Date(checkOut);

	//size validator
	if (checkInDate > checkOutDate) {
		typeMessage(
			"error",
			"error",
			"No puede ser el checkIn después del checkOut"
		);
	}

	//create semi-object
	const datosIniciales = {
		checkIn,
		checkOut,
		guests: Number(guests),
	};

	localStorage.setItem("DatosIniciales", JSON.stringify(datosIniciales));
}

// form.html
