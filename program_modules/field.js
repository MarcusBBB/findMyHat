var term = require('terminal-kit').terminal;
const prompt = require('prompt-sync')({ sigint: true });

class Field {
	constructor() {
		this.level = 0;
		this.baseWidth = 3;
		this.baseHeight = 3;
		this.percentageHoles = 0;
		this.image = {};
		this.image.hat = '^';
		this.image.hole = 'O';
		this.image.fieldCharacter = '░';
		this.image.pathCharacter = '*';
	}
	createField() {
		this.hatFound = false;
		let newField = [];
		this.fieldWidth = this.baseWidth + this.level;
		this.fieldHeight = this.baseHeight + this.level;
		for (let i = 0; i < this.fieldHeight; i++) {
			let newLine = [];
			for (let j = 0; j < this.fieldWidth; j++) {
				let tile =
					Math.random() < (this.percentageHoles + this.level * 5) / 100
						? this.image.hole
						: this.image.fieldCharacter;
				newLine.push(tile);
			}
			newField.push(newLine);
		}
		let hatX = 0;
		let hatY = 0;
		while (hatX < this.fieldWidth - 2 && hatY < this.fieldHeight - 2) {
			hatX = Math.floor(Math.random() * this.fieldWidth);
			hatY = Math.floor(Math.random() * this.fieldHeight);
		}
		console.log(hatY, hatX);
		newField[hatY][hatX] = this.image.hat;
		if (this.solvableField(newField)) {
			this.field = newField;
		} else {
			// the field is unsolvable, a new one is made
			this.createField();
		}
	}
	solvableField(field) {
		let placesToCheck = [[0, 0]];
		let checked = [0];
		while (placesToCheck.length > 0) {
			let pos = placesToCheck.shift();
			for (let change of [
				[-1, 0],
				[1, 0],
				[0, -1],
				[0, 1],
			]) {
				let newX = pos[1] + change[1];
				let newY = pos[0] + change[0];
				if (
					!(
						newX < 0 ||
						newX >= this.fieldWidth ||
						newY < 0 ||
						newY >= this.fieldHeight
					)
				) {
					if (field[newX][newY] === this.image.hat) {
						return true;
					}
					let stringOfNewPos = newY * 100 + newX;
					if (
						!(
							field[newX][newY] === this.image.hole ||
							checked.includes(stringOfNewPos)
						)
					) {
						placesToCheck.push([newY, newX]);
						checked.push(stringOfNewPos);
					}
				}
			}
		}
		return false;
	}

	personOutsideField(person) {
		return (
			person.x < 0 ||
			person.x >= this.fieldWidth ||
			person.y < 0 ||
			person.y >= this.fieldHeight
		);
	}
	personInHole(person) {
		return this.field[person.y][person.x] === this.image.hole;
	}
	foundTheHat(person) {
		return this.field[person.y][person.x] === this.image.hat;
	}
	checkPosition(person) {
		console.log('checking position of ', person.y, person.x);
		if (this.personOutsideField(person)) {
			person.outsideField();
		} else if (this.personInHole(person)) {
			person.inHole();
		} else if (this.foundTheHat(person)) {
			console.log(
				`you found your hat! And under it ${
					this.level === 0
						? 'is a sweet puppy'
						: 'are ' + (this.level + 1) + ' sweet puppies'
				} that will try to catch your hat for you next time :)`
			);
			this.hatFound = true;
			this.level += 1;
			prompt(
				`press enter to continue, your puppies will first look for your hat and if they don't succeed, you can.`
			);
		}
	}
	print(player, puppies) {
		for (let puppy of puppies) {
			this.field[puppy.y][puppy.x] = term.red.str('P');
		}
		this.field[player.y][player.x] = term.red.str(this.image.pathCharacter);
		console.log('\n');
		for (let line of this.field) {
			console.log(line.join(''));
		}
		console.log('\n');
		for (let puppy of puppies) {
			this.field[puppy.y][puppy.x] = term.white.str(this.image.fieldCharacter);
		}
		this.field[player.y][player.x] = term.white.str(this.image.fieldCharacter);
	}
}

module.exports.Field = Field;
