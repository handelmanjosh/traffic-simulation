import { Environment, Road } from "./environment";

type VehicleType = 'car' | 'truck' | 'bigtruck';
type VehicleDriver = 'bad' | 'decent' | 'good'
type WeightedNumber<T> = [T, number][]
const typeColors = {'car' : 'blue', 'truck': 'cyan', 'bigtruck' : 'purple'}
const typeDrivers = {'bad' : 'red', 'decent' : 'yellow', 'good' : 'green'}
export class VehicleController {
    Vehicles: Vehicle[];
    pastCollisions: number[];
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
            const vehicle = new Vehicle(loc[0], loc[1], dir, type, driver, canvas);
            this.Vehicles.push(vehicle);
        }
        this.pastCollisions = [];
    }
    draw = () => {
        this.checkCollisions();
        this.Vehicles.forEach(vehicle => vehicle.draw(this.context));
    }
    checkCollisions = () => {
        let totalCollisions = 0
        this.Vehicles.forEach(vehicle1 => {
            this.Vehicles.forEach(vehicle2 => {
                if (vehicle1 === vehicle2) return;
                if (vehicleDistance(vehicle1, vehicle2) < 4) {
                    totalCollisions++;
                }
            })
        });
        this.pastCollisions.push(totalCollisions / 2 / this.Vehicles.length);
        if (this.pastCollisions.length > 50) {
            this.pastCollisions.splice(0, 1);
        }
        let total = 0;
        for (const num of this.pastCollisions) total += num;
        return total / this.pastCollisions.length;
    }
}
const vehicleDistance = (v1: Vehicle, v2: Vehicle) => {
    return Math.sqrt((v2.x - v1.x)**2 + (v2.y - v1.y)**2);
}

export class Vehicle {
    x: number;
    y: number;
    dir: [number, number];
    type: VehicleType;
    driver: VehicleDriver;
    canvas: HTMLCanvasElement;
    constructor(x: number, y: number, dir: [number, number], type: VehicleType, driver: VehicleDriver, canvas: HTMLCanvasElement) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.type = type;
        this.driver = driver;
        this.canvas = canvas;
    }
    move = () => {
        this.x += this.dir[0] % this.canvas.width;
        this.y += this.dir[1] % this.canvas.height;
        if (this.y < 0) {
            this.y += this.canvas.height;
        }
        if (this.x < 0) {
            this.x += this.canvas.width;
        }
        this.checkBounding()
    }
    checkBounding = () => {
        if (Math.floor(this.x % 40) === 0 && Math.floor(this.y % 40) === 0) {
            const dir = Math.random() < .5 ? -1 : 1;
            const willTurn = Math.random() < .5 ? true : false;
            if (willTurn) {
                if (this.dir[0] === 0) { 
                    this.dir = [dir, 0];
                } else {
                    this.dir = [0, dir];
                }
            }
        }
    }
    draw = (context: CanvasRenderingContext2D) => {
        this.move();
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
    const r = Math.random();
    for (let i = 0; i < weighted.length; i++) {
        if (r < weighted[i][1]) {
            return weighted[i][0];
        }
    }
    return weighted[weighted.length - 1][0];
}
