import { FractalField } from "./FractalField";

import "./scss/styles";

const canvas = <HTMLCanvasElement>document.getElementById("fractal");
const context: CanvasRenderingContext2D = canvas.getContext("2d");
const field = new FractalField(15, context, {
   speed: 100,
   attempts: 100,
   canvasOptions: { pixelSize: 20 },
});
field.start();
