import React, { useEffect, useRef } from 'react';
import { Environment } from './components/environment';
import { VehicleController } from './components/car';

let ran = 0;
let environment: Environment;
let cars: VehicleController;
const types: [any, number][] = [['car', 50], ['truck', 35], ['bigtruck', 15]];
const drivers: [any, number][] = [['bad', 25], ['decent', 50], ['good', 25]];
function App() {
  const canvasRef = useRef<any>(null);
  useEffect(() => {
    if (ran === 1) return;
    canvasRef.current.width = 800;
    canvasRef.current.height = 800;
    ran++;
    const context: CanvasRenderingContext2D = canvasRef.current.getContext("2d");
    environment = new Environment(canvasRef.current, context);
    cars = new VehicleController(100, types, drivers, environment, canvasRef.current, context)
    frame();
  }, [])
  const frame = () => {
    environment.draw();
    cars.draw();
    requestAnimationFrame(frame);
  }
  return (
    <div className="flex flex-col justify-center items-center w-full h-auto">
      <p className='text-2xl'>Traffic simulation</p>
      <canvas ref={canvasRef} className='' />
    </div>
  );
}

export default App;
