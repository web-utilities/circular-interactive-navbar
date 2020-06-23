import config from './config.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_SIZE = config.canvasSize;

canvas.height = CANVAS_SIZE;
canvas.width = CANVAS_SIZE;