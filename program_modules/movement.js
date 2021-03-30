const prompt = require('prompt-sync')({ sigint: true });

class Movers {
	constructor() {
		this.player = new Player();
		this.puppies = [];
	}
	returnHome() {
		this.player.startOver();
		this.puppies.forEach((puppie) => puppie.startOver());
	}

	returnAvailablePlayers() {
		let searchingPuppies = this.puppies.filter((puppy) => puppy.searching);
		if (searchingPuppies.length > 0) {
			console.log(
				`there ${
					searchingPuppies.length === 1
						? 'is one puppy'
						: 'are ' + searchingPuppies.length + ' puppies'
				} searching for your hat, let's  see how they do!`
			);
			return searchingPuppies;
		} else {
			return [this.player];
		}
	}

	addPuppies(num) {
		for (let i = 0; i < num; i++) {
			this.puppies.push(new Puppy());
		}
	}
}

class Mover {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.directions = [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		];
	}
	decideOnMove() {
		return [0, 0];
	}
	movePerson() {
		let choice = this.decideOnMove();
		this.y += choice[0];
		this.x += choice[1];
	}
	moveToStartingPosition() {
		this.x = 0;
		this.y = 0;
	}
	outsideField() {
		this.moveToStartingPosition();
	}
	inHole() {
		this.moveToStartingPosition();
	}
	startOver() {
		this.moveToStartingPosition();
	}
}

class Player extends Mover {
	constructor() {
		super();
		this.type = 'player';
	}
	outsideField() {
		super.outsideField();
		console.log(
			'you fell of the edge of the street!!!\nyou do manage to climb back though.'
		);
	}
	inHole() {
		super.inHole();
		console.log('you fell in a hole!!\nyou do manage to climb back though.');
	}
	decideOnMove() {
		console.log(
			'which way to go?\na for left\nd for right\nw for up\ns for down:'
		);
		let choice = prompt('');

		while (!['a', 's', 'd', 'w'].includes(choice)) {
			console.log('incorrect choice, please type a, s, d or w.');
			choice = prompt('');
		}
		let chosenDirection = [];
		if (choice == 'a') {
			chosenDirection = this.directions[3];
		} else if (choice == 'd') {
			chosenDirection = this.directions[1];
		} else if (choice == 'w') {
			chosenDirection = this.directions[2];
		} else if (choice == 's') {
			chosenDirection = this.directions[0];
		}
		return chosenDirection;
	}
}

class Puppy extends Mover {
	constructor() {
		super();
		this.movesMade = 0;
		this.searchedAt = [0];
		this.searching = true;
		this.type = 'puppy';
	}
	outsideField() {
		super.outsideField();
		this.searching = false;
		console.log(
			'a puppy fell of the edge of the street!!!\nshe manages to climb back but stops searching.'
		);
	}
	inHole() {
		super.inHole();
		this.searching = false;
		console.log(
			'a puppy fell in a hole!!!\nshe manages to climb back but stops searching.'
		);
	}
	decideOnMove() {
		let possibleMoves = this.movesMade < 2 ? 2 : 4;
		let chosenDirection = this.directions[
			Math.floor(Math.random() * possibleMoves)
		];

		return chosenDirection;
	}

	movePerson() {
		let choice = this.decideOnMove();
		this.y += choice[0];
		this.x += choice[1];
		let moveNumberfied = this.y * 100 + this.x;
		if (!this.searchedAt.includes(moveNumberfied)) {
			this.movesMade += 1;
			this.searchedAt.push(moveNumberfied);
		} else {
			this.y -= choice[0];
			this.x -= choice[1];
		}
	}
	startOver() {
		super.startOver();
		this.searching = true;
		this.movesMade = 0;
		this.searchedAt = [0];
	}
}
module.exports.Movers = Movers;
