import { observable, action } from 'mobx';

export default class Items {
	@observable items = [
		{
			id: 1,
			name: "test"
		},
		{
			id: 2,
			name: "Glenn"
		}
	];

	@action addItem(name) {
		this.items.push({id: Math.random(), name});
	}
}
