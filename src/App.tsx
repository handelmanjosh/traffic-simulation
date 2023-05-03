import React, { useEffect, useRef, useState } from 'react';
import { Environment } from './components/environment';
import { VehicleController } from './components/car';
import Graph from './components/Graph';

let ran = 0;
let environment: Environment;
let cars: VehicleController;
let context: CanvasRenderingContext2D;
let start: boolean = false;
function App() {
  const [started, setStarted] = useState<boolean>(false);
  const [carNumber, setCarNumber] = useState<number>(100);
  const canvasRef = useRef<any>(null);
  useEffect(() => {
    if (ran === 1) return;
    canvasRef.current.width = 800;
    canvasRef.current.height = 800;
    ran++;
    context = canvasRef.current.getContext("2d");
    environment = new Environment(canvasRef.current, context);
    environment.draw();
    frame();
  }, [])
  const frame = () => {
    if (start) {
      environment.draw();
      cars.draw();
    }
    requestAnimationFrame(frame);
  }
  const begin = () => {
    environment = new Environment(canvasRef.current, context);
    const types: [any, number][] = [['car', .5], ['truck', .85], ['bigtruck', 1]];
    const drivers: [any, number][] = [['bad', .25], ['decent', .75], ['good', 1]]; 
    cars = new VehicleController(carNumber, types, drivers, environment, canvasRef.current, context);
    start = true;
    setStarted(true);
  }
  const end = () => {
    start = false;
    setStarted(false);
  }
  const getCollisionRate = () => {
    return cars?.checkCollisions() ?? 0;
  }
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full h-auto">
      <p className='text-2xl'>Traffic simulation</p>
      <div className="flex flex-row justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-center">
          <Graph title="Collison Rate" max={1} min={0} getParameter={getCollisionRate} color="red" />
        </div>
      <canvas ref={canvasRef} className='' />
      {started ? 
        <button className="py-4 px-8 bg-blue-400 hover:brightness-90 active:brightness-75 rounded-lg" onClick={end}>
          End
        </button>
      :
      <div className="flex flex-col justify-center items-center gap-2">
        <button 
          className="py-4 px-8 bg-blue-400 hover:brightness-90 active:brightness-75 rounded-lg"
          onClick={begin}
        >
          Start
        </button>
        <div className="flex flex-col justify-center items-center">
          <input 
            type="range"  
            value={carNumber}
            min={10}
            max={1000}
            step={2}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCarNumber(Number(event.target.value))}
          />
          <p className="text-center text-xl">{`# of cars: ${carNumber}`}</p>
        </div>
      </div>
      }
      </div>
    </div>
  );
}

export default App;
