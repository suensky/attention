"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import PhysicsSimulation from '../components/PhysicsSimulation';

export default function Home() {
  const [leftBlockMass, setLeftBlockMass] = useState<number>(1);
  const [rightBlockMass, setRightBlockMass] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  const handleStart = () => {
    setIsSimulating(true);
  };
  
  const handleReset = () => {
    setIsSimulating(false);
  };
  
  return (
    <main className={styles.main}>
      <h1>Elastic Collision Simulation</h1>
      
      <div className={styles.controls}>
        <div className={styles.massControl}>
          <label htmlFor="leftMass">Left Block Mass:</label>
          <input 
            id="leftMass"
            type="range" 
            min="1" 
            max="10" 
            value={leftBlockMass} 
            onChange={(e) => setLeftBlockMass(Number(e.target.value))}
            disabled={isSimulating}
          />
          <span>{leftBlockMass} kg</span>
        </div>
        
        <div className={styles.massControl}>
          <label htmlFor="rightMass">Right Block Mass:</label>
          <input 
            id="rightMass"
            type="range" 
            min="1" 
            max="10" 
            value={rightBlockMass} 
            onChange={(e) => setRightBlockMass(Number(e.target.value))}
            disabled={isSimulating}
          />
          <span>{rightBlockMass} kg</span>
        </div>
        
        <div className={styles.buttons}>
          <button 
            onClick={handleStart} 
            disabled={isSimulating}
          >
            Start
          </button>
          <button 
            onClick={handleReset} 
            disabled={!isSimulating}
          >
            Reset
          </button>
        </div>
      </div>
      
      <PhysicsSimulation 
        leftBlockMass={leftBlockMass}
        rightBlockMass={rightBlockMass}
        isSimulating={isSimulating}
      />
    </main>
  );
}
