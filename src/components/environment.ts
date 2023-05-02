
export class Environment {
    Roads: Road[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.Roads = [];
        this.canvas = canvas;
        this.context = context;
        for (let i = 0; i <= canvas.width; i += 40) {
            const road = new Road([i, 0], [i, canvas.height]);
            this.Roads.push(road);
        }
        for (let i = 0; i <= canvas.height; i += 40) {
            const road = new Road([0, i], [canvas.width, i]);
            this.Roads.push(road);
        }
    }
    genLocation = (): [number, number][] => {
        const road = this.Roads[Math.floor(Math.random() * this.Roads.length)];
        const dir = road.genDir();
        return [[randomBetween(road.start[0], road.end[0]), randomBetween(road.start[1], road.end[1])], dir]
    }
    draw = () => {
        this.Roads.forEach(road => road.draw(this.context));
    }
}

export class Road {
    start: [number, number];
    end: [number, number];
    constructor(start: [number, number], end: [number, number]) {
        this.start = start;
        this.end = end;
    }
    draw = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.moveTo(this.start[0], this.start[1]);
        context.lineTo(this.end[0], this.end[1]);
        context.stroke();
    }
    genDir = (): [number, number] => {
        if (this.start[0] === this.end[0]) {
            return [0, choice()];
        } else {
            return [choice(), 0];
        }
    }
}

const randomBetween = (a: number, b: number): number => {
    return a + Math.floor(Math.random() * (b - a))
}
const choice = () => {
    return Math.random() < .5 ? -1 : 1;
}