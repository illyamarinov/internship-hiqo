const pageChangeEvent = function(page) {
	const event = new CustomEvent('pageChanged', { detail: page });
	const app = document.querySelector('#app');
	app.dispatchEvent(event);
}

export {
	pageChangeEvent
};
