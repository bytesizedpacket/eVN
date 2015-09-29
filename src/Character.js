"use strict"; 

/** A class for managing data related to novel characters */
export class Character {
	/** @param {object} eVNM_char - The eVNML data to instantiate from */
	constructor(eVNML_char) {
		/** Name/First name of the character */
		this.name = eVNML_char['first name'] || eVNML_char['name'];
		/** Last name of the character - optional */
		this.lname = eVNML_char['last name'] || null;
		/** Color of the character's name in the speakerbox */
		this.color = eVNML_char['color'] || eVNML_char['colour'] || '#FFF';
		/** Images/Sprites associated with this character */
		this.images = eVNML_char['images'] || {};
		/** Mood (current sprite) of the character */
		this.mood = 'default';
	}

	/** Gets the sprite of the current mood */
	get cImage() { return this.images[this.mood] };
}
