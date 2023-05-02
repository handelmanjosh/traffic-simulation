import { Environment, Road } from "./environment";

type VehicleType = 'car' | 'truck' | 'bigtruck';
type VehicleDriver = 'bad' | 'decent' | 'good'
type WeightedNumber<T> = [T, number][]
const typeColors = {'car' : 'blue', 'truck': 'cyan', 'bigtruck' : 'purple'}
const typeDrivers = {'bad' : 'red', 'decent' : 'yellow', 'good' : 'green'}
export class VehicleController {
    Vehicles: Vehicle[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(n: number, types: WeightedNumber<VehicleType>, drivers: WeightedNumber<VehicleDriver>, environment: Environment, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.Vehicles = [];
        this.canvas = canvas;
        this.context = context;
        for (let i = 0; i < n; i++) {
            const type = selectFromWeighted(types);
            const driver = selectFromWeighted(drivers);
            const data: [number, number][] = environment.genLocation();
            const [loc, dir]: [number, number][] = data;
            const vehicle = new Vehicle(loc[0], loc[1], dir, type, driver);
            this.Vehicles.push(vehicle);
        }
    }
    draw = () => {
        this.Vehicles.forEach(vehicle => vehicle.draw(this.context));
    }
}


export class Vehicle {
    x: number;
    y: number;
    dir: [number, number];
    type: VehicleType;
    driver: VehicleDriver;
    constructor(x: number, y: number, dir: [number, number], type: VehicleType, driver: VehicleDriver) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.type = type;
        this.driver = driver;
    }
    move = () => {
        this.x += this.dir[0];
        this.y += this.dir[1];
        this.checkBounding()
    }
    checkBounding = () => {

    }
    draw = (context: CanvasRenderingContext2D) => {
        //this.move();
        context.beginPath();
        context.fillStyle = typeColors[this.type];
        context.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        context.fill();

        context.beginPath();
        context.fillStyle = typeDrivers[this.driver];
        context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}
function selectFromWeighted<T>(weighted: WeightedNumber<T>): T {
    const pos = Math.floor(Math.random() * weighted.length);
    const result = weighted[pos][0];
    weighted[pos][1]--;
    if (weighted[pos][1] === 0 ) {
        weighted.splice(pos, 1);
    }
    return result;
}