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

//index.html
function searchBoxSection() {
	//get values
	const checkIn = document.getElementById("searchCheckIn").value;
	const checkOut = document.getElementById("searchCheckOut").value;

	

	const guests = document.getElementById("searchGuests").value;

	//validator empty values
	if (checkIn === "" || checkOut === "") {
		let message = document.getElementById("error");
		message.classList.add("color: error");
	}
}
