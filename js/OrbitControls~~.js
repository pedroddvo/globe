import { Vector3 } from './three.js';

let radius = 10;

export class OrbitControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.mouseDown = false;

        this.mouseClickX = 0.0;
        this.mouseClickY = 0.0;

        this.deltaX = 0.0;
        this.deltaY = 0.0;

        this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.domElement.addEventListener('mousedown',   this.onMouseDown.bind(this));
        this.domElement.addEventListener('mouseup',     this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        this.mouseDown = true;
        this.mouseClickX = event.clientX;
        this.mouseClickY = event.clientY;
    }

    onMouseUp(event) {
        this.mouseDown = false;
    }

    onPointerMove(event) {
        if (!this.mouseDown) return;

        let dx = this.mouseClickX - event.clientX;
        let dy = this.mouseClickY - event.clientY;
        let ddx = this.deltaX - dx;
        let ddy = this.deltaY - dy;

        let offsetX = this.camera.position.x + ddx;
        let offsetY = this.camera.position.y + ddy;

        let magnitudeX = Math.sqrt(offsetX*offsetX + 10*10);
        let magnitudeY = Math.sqrt(offsetY*offsetY + 10*10);

        let aX = Math.atan(ddx / this.deltaX);
        let aY = Math.atan(ddy / this.deltaY);

        this.camera.position.x = (10/magnitudeX) * offsetX;
        this.camera.position.y = (10/magnitudeY) * offsetY;
        this.camera.lookAt(0, 0, 0);

        this.deltaX = dx;
        this.deltaY = dy;
    }
}
