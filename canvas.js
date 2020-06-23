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
		}
	}
	
	get randomPointOnBoundary() {
		const theta = Math.random() * Math.PI * 2;
		return {
			x: this.radius * Math.cos(theta),
			y: this.radius * Math.sin(theta)
		};
	}
	
	getNextPosition(prevPosition, angleChange, clockwise) {
		let theta = Math.atan2(prevPosition.y, prevPosition.x);
		theta += clockwise ? angleChange : -angleChange;
		return {
			x: this.radius * Math.cos(theta),
			y: this.radius * Math.sin(theta)
		};
	}
	
	draw = () => {
		ctx.clearRect(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2, CANVAS_SIZE, CANVAS_SIZE);
		for (let option of this.options) {
			const position = this.getNextPosition(option.position, Math.PI / 180 * 0.5, true);
			option.position = position;
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#cf23c3';
			ctx.beginPath();
			ctx.arc(position.x, position.y, config.optionRadius, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.save();
			ctx.translate(position.x, position.y);
			ctx.drawImage(option.iconImage, -config.optionRadius + 7, -config.optionRadius + 7, config.optionRadius * 2 - 14, config.optionRadius * 2 - 14);
			ctx.restore();
		}
	}

	animate = () => {
		this.draw();
		requestAnimationFrame(this.animate);
	}
}


ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);

const navbarCircle = new Navbar(config.navbarRadius, config.options);
navbarCircle.animate();