const RoomType = Object.freeze({
	SUITE: "suite",
	DOUBLES: "doubles",
	INDIVIDUAL: "individual",
	DELUXE: "deluxe",
	PRESIDENTIAL: "presidential",
	PENTHOUSE: "penthouse",
});

class Reserva{
    constructor (user, date, roomType){
        this.user = user;
        this.date =  date;
        this.roomType = roomType;
    }

    getDate(){
        return this.date;
    }
}

