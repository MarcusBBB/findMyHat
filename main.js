const { Field } = require('./program_modules/field.js');
const { Movers } = require('./program_modules/movement');
const prompt = require('prompt-sync')({ sigint: true });
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
console.log(
	'You lost your hat. The wind blew it right of your head. You look around and see it on the street: ^\n\
But there could bed holes in the street: O \n\
and if one would walk of the street one would surely hurt oneselves.\n\
If only you had some puppies they could try to get it for you!\n'
);
while (playing) {
	while (!myField.hatFound) {
		let players = myMovers.returnAvailablePlayers();
		if (players[0].type === 'puppy') {
			players.forEach((player) => {
				player.movePerson();
				myField.checkPosition(player);
				myField.print(myMovers.player, myMovers.puppies);
				sleep(100);
			});
			sleep(500);
		} else {
			/* if (myField.level > 0) {
				console.log(
					"All your puppies hurt themselves while trying to get your hat and now stay at the startingposition, \nit's up to you to get your hat back!\n"
				);
			} */
			players[0].movePerson();
			myField.checkPosition(players[0]);
			myField.print(myMovers.player, myMovers.puppies);
		}
	}
	myMovers.addPuppies(myField.level);
	console.log(
		`you found your hat! And under it ${
			myField.level === 1
				? 'is a sweet puppy'
				: 'are ' + myField.level + ' sweet puppies'
		} that will try to catch your hat for you next time :)`
	);
	if (myMovers.puppies.length > 1) {
		console.log(
			`You have found a total of ${myMovers.puppies.length} puppies, all are very happy to search for you!\n`
		);
	}

	prompt(
		`press enter to continue, your puppies will first look for your hat and if they don't succeed, you can get it yourself.`
	);
	myMovers.returnHome();
	myField.createField();
}
