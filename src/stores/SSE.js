import { observable, action } from 'mobx';

export default class SSE {
	@observable items = [];
  events = null;

	addItem(e) {
    let data = JSON.parse(e.data);
		this.items.unshift({id: Math.random(), msg: data.msg});
	}

  @action listenForEvents() {
      if(!this.events) {
        this.events = new EventSource('/api/sse');
        this.events.addEventListener('sse', this.addItem.bind(this), false);
      }
  }
  @action stopListening() {
      //this.events.removeEventListener('sse', this.addItem.bind(this));
      //console.log(this.events.close())
  }
}
