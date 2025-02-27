"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import PhysicsSimulation from '../components/PhysicsSimulation';

export default function Home() {
  const [leftBlockMass, setLeftBlockMass] = useState<number>(1);
  const [rightBlockMass, setRightBlockMass] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  // Convert slider value (0-100) to mass (1-1000000) using exponential scale
  const sliderToMass = (sliderValue: number): number => {
    // Transform 0-100 to 0-6 (for log10 of 1 to 1000000)
    const exponent = (sliderValue / 100) * 6;
    // Calculate mass: 10^exponent
    return Math.floor(Math.pow(10, exponent));
  }
  
  // Convert mass (1-1000000) to slider value (0-100)
  const massToSlider = (mass: number): number => {
    // Get the log10 of the mass (0-6 range)
    const exponent = Math.log10(mass);
    // Transform to 0-100 scale
    return (exponent / 6) * 100;
  }
  
  const handleLeftMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = Number(e.target.value);
    setLeftBlockMass(sliderToMass(sliderValue));
  };
  
  const handleRightMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = Number(e.target.value);
    setRightBlockMass(sliderToMass(sliderValue));
  };
  
  const handleLeftMassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    
    // Validate the input
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 1000000) {
      value = 1000000;
    }
    
    setLeftBlockMass(Math.floor(value));
  };
  
  const handleRightMassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    
    // Validate the input
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 1000000) {
      value = 1000000;
    }
    
    setRightBlockMass(Math.floor(value));
  };
  
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
          <div className={styles.inputGroup}>
            <input 
              id="leftMass"
              type="range" 
              min="0" 
              max="100" 
              value={massToSlider(leftBlockMass)}
              onChange={handleLeftMassChange}
              disabled={isSimulating}
              step="0.1"
              className={styles.slider}
            />
            <input
              type="number"
              min="1"
              max="1000000"
              value={leftBlockMass}
              onChange={handleLeftMassInput}
              disabled={isSimulating}
              className={styles.numberInput}
            />
            <span className={styles.unit}>kg</span>
          </div>
        </div>
        
        <div className={styles.massControl}>
          <label htmlFor="rightMass">Right Block Mass:</label>
          <div className={styles.inputGroup}>
            <input 
              id="rightMass"
              type="range" 
              min="0" 
              max="100" 
              value={massToSlider(rightBlockMass)}
              onChange={handleRightMassChange}
              disabled={isSimulating}
              step="0.1"
              className={styles.slider}
            />
            <input
              type="number"
              min="1"
              max="1000000"
              value={rightBlockMass}
              onChange={handleRightMassInput}
              disabled={isSimulating}
              className={styles.numberInput}
            />
            <span className={styles.unit}>kg</span>
          </div>
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
