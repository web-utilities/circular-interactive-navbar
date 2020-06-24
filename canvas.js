import config from './config.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_SIZE = config.canvasSize;

canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;

class Navbar {
	constructor(radius, options) {
		this.radius = radius;
		this.options = options;
		for (let option of this.options) {
			option.position = this.randomPointOnBoundary;
			option.iconImage = new Image();
			option.iconImage.src = option.icon;
			option.speed = Math.PI / 180 * (Math.random() / 3 + 0.1);
			option.moving = true;
			option.radius = config.optionRadius;
		}
	}
	
	get randomPointOnBoundary() {
		const theta = Math.random() * Math.PI * 2;
		const randomOffset = Math.random() * config.boundaryRandomness + (1 - config.boundaryRandomness / 2); 
		return {
			x: this.radius * randomOffset * Math.cos(theta),
			y: this.radius * randomOffset *  Math.sin(theta)
		};
	}
	
	getNextPosition(prevPosition, angleChange, clockwise) {
		let theta = Math.atan2(prevPosition.y, prevPosition.x);
		theta += clockwise ? angleChange : -angleChange;
		let radius = Math.sqrt(Math.pow(prevPosition.x, 2) + Math.pow(prevPosition.y, 2));
		return {
			x: radius * Math.cos(theta),
			y: radius * Math.sin(theta)
		};
	}
	
	draw = () => {
		ctx.clearRect(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2, CANVAS_SIZE, CANVAS_SIZE);
		for (let option of this.options) {
			const position = this.getNextPosition(option.position, option.moving ? option.speed : 0, true);
			option.position = position;
			ctx.lineWidth = 5;
			ctx.strokeStyle = option.color;
			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(position.x, position.y, option.radius, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.stroke();
			ctx.save();
			ctx.translate(position.x, position.y);
			ctx.drawImage(option.iconImage, -option.radius * 0.6, -option.radius * 0.6, option.radius * 1.2, option.radius * 1.2);
			ctx.restore();
		}
	}

	animate = () => {
		this.draw();
		requestAnimationFrame(this.animate);
	}
}

const getMousePos = e => {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

const getDistance = (pos1, pos2) => {
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}



ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);

const navbar = new Navbar(config.navbarRadius, config.options);
navbar.animate();

canvas.addEventListener('mousemove', e => {
	let mousePos = getMousePos(e);
	let onTop = -1;
	navbar.options.map((option, i) => {
		if (getDistance(mousePos, {
			x: option.position.x + CANVAS_SIZE / 2, 
			y: option.position.y + CANVAS_SIZE / 2
		}) < option.radius) {
			onTop = i;
		} else {
			option.moving = true;
			option.radius = config.optionRadius;
		}
	});
	if (onTop !== -1) {
		navbar.options[onTop].radius = config.optionRadius + 20;
		navbar.options[onTop].moving = false;
		const temp = navbar.options[onTop];
		navbar.options.splice(onTop, 1);
		navbar.options.push(temp);
	}
});