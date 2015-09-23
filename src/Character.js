/** A class for managing data related to novel characters */
export class Character {
	/**@param {object} eVNM_char - The eVNML data to instantiate from
	 * @param {type} paramName - paramDesc */
	constructor(eVNML_char) {
		this.name = eVNML_char['first name'] || eVNML_char['name'];
		this.lname = eVNML_char['last name'] || null;
		this.color = eVNML_char['color'] || eVNML_char['colour'] || '#FFF';
		this.images = eVNML_char['images'] || {};
	}
}
