const { Field } = require('./program_modules/field.js');
const { Movers } = require('./program_modules/movement');

let myField = new Field();
let myMovers = new Movers();
myField.createField();

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
myField.print(myMovers.player, myMovers.puppies);
let playing = true;
while (playing) {
	while (!myField.hatFound) {
		let players = myMovers.returnAvailablePlayers();
		if (players[0].type === 'puppy') {
			players.forEach((player) => {
				player.movePerson();
				myField.checkPosition(player);
				myField.print(myMovers.player, myMovers.puppies);
				sleep(300);
			});
		} else {
			players[0].movePerson();
			myField.checkPosition(players[0]);
			myField.print(myMovers.player, myMovers.puppies);
		}
	}
	console.log('hat found, so here!');
	myMovers.addPuppies(myField.level);
	myMovers.returnHome();
	myField.createField();
}

/* while (
		myField.puppies.reduce((acc, puppy) => {
			if (puppy.searching) {
				acc += 1;
			}
			console.log(acc);
			return acc;
		}, 0) > 0
	) {
		myField.puppies.forEach(puppy) => {
			
		}
	}
	console.log(
		'which way to go?\na for left\nd for right\nw for up\ns for down:'
	);
	let move = prompt('');

	while (!['a', 's', 'd', 'w'].includes(move)) {
		console.log('incorrect choice, please type a, s, d or w.');
		move = prompt('');
	}

	myField.moveControlablePlayer(move);
}
console.log('you win!'); */
