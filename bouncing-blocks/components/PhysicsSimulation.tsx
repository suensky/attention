import { useRef, useEffect, useState } from 'react';
import styles from './PhysicsSimulation.module.css';

interface PhysicsSimulationProps {
  leftBlockMass: number;
  rightBlockMass: number;
  isSimulating: boolean;
}

interface BlockState {
  position: number;
  velocity: number;
  mass: number;
  width: number;
}

const PhysicsSimulation: React.FC<PhysicsSimulationProps> = ({
  leftBlockMass,
  rightBlockMass,
  isSimulating,
}) => {
  const animationRef = useRef<number>(0);
  const leftBlockRef = useRef<BlockState>({
    position: 0,
    velocity: 0,
    mass: 0,
    width: 0
  });
  const rightBlockRef = useRef<BlockState>({
    position: 0,
    velocity: 0,
    mass: 0,
    width: 0
  });
  const lastTimeRef = useRef<number>(0);
  
  // Constants
  const CONTAINER_WIDTH = 600;
  const MIN_BLOCK_WIDTH = 40;
  const MAX_ADDITIONAL_WIDTH = 60;
  const WALL_WIDTH = 10;
  const INITIAL_VELOCITY = -150; // pixels per second, negative means moving left
  
  const [blocks, setBlocks] = useState({
    left: {
      position: WALL_WIDTH + 50,
      velocity: 0,
      mass: leftBlockMass,
      width: MIN_BLOCK_WIDTH + (leftBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
    },
    right: {
      position: CONTAINER_WIDTH - 100,
      velocity: 0,
      mass: rightBlockMass,
      width: MIN_BLOCK_WIDTH + (rightBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
    }
  });
  
  // Update block masses when they change
  useEffect(() => {
    if (!isSimulating) {
      const newLeftBlock = {
        position: WALL_WIDTH + 50,
        velocity: 0,
        mass: leftBlockMass,
        width: MIN_BLOCK_WIDTH + (leftBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
      };
      
      const newRightBlock = {
        position: CONTAINER_WIDTH - 100,
        velocity: 0,
        mass: rightBlockMass,
        width: MIN_BLOCK_WIDTH + (rightBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
      };
      
      setBlocks({
        left: newLeftBlock,
        right: newRightBlock
      });
      
      leftBlockRef.current = newLeftBlock;
      rightBlockRef.current = newRightBlock;
    }
  }, [leftBlockMass, rightBlockMass, isSimulating]);
  
  // Handle simulation start/stop
  useEffect(() => {
    if (isSimulating) {
      // Set initial velocity for right block
      const updatedRightBlock = {
        ...rightBlockRef.current,
        velocity: INITIAL_VELOCITY
      };
      
      rightBlockRef.current = updatedRightBlock;
      
      setBlocks(prev => ({
        ...prev,
        right: updatedRightBlock
      }));
      
      // Reset animation timing
      lastTimeRef.current = 0;
      
      // Start animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else {
      // Reset positions and velocities
      const newLeftBlock = {
        position: WALL_WIDTH + 50,
        velocity: 0,
        mass: leftBlockMass,
        width: MIN_BLOCK_WIDTH + (leftBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
      };
      
      const newRightBlock = {
        position: CONTAINER_WIDTH - 100,
        velocity: 0,
        mass: rightBlockMass,
        width: MIN_BLOCK_WIDTH + (rightBlockMass / 10) * MAX_ADDITIONAL_WIDTH,
      };
      
      leftBlockRef.current = newLeftBlock;
      rightBlockRef.current = newRightBlock;
      
      setBlocks({
        left: newLeftBlock,
        right: newRightBlock
      });
      
      // Stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, leftBlockMass, rightBlockMass]); // Removed blocks from dependencies
  
  const updateSimulation = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(updateSimulation);
      return;
    }
    
    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
    lastTimeRef.current = timestamp;
    
    // Use the ref values for calculation
    let leftBlock = { ...leftBlockRef.current };
    let rightBlock = { ...rightBlockRef.current };
    
    // Update positions based on velocities
    leftBlock.position += leftBlock.velocity * deltaTime;
    rightBlock.position += rightBlock.velocity * deltaTime;
    
    // Check for collision with wall
    if (leftBlock.position <= WALL_WIDTH) {
      leftBlock.position = WALL_WIDTH;
      leftBlock.velocity = -leftBlock.velocity; // Elastic collision with wall
    }
    
    // Check for collision between blocks
    const leftBlockRight = leftBlock.position + leftBlock.width;
    const rightBlockLeft = rightBlock.position;
    
    if (leftBlockRight >= rightBlockLeft) {
      // Elastic collision formula
      const m1 = leftBlock.mass;
      const m2 = rightBlock.mass;
      const v1 = leftBlock.velocity;
      const v2 = rightBlock.velocity;
      
      leftBlock.velocity = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      rightBlock.velocity = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
      
      // Adjust positions to prevent overlap
      const overlap = leftBlockRight - rightBlockLeft;
      leftBlock.position -= overlap / 2;
      rightBlock.position += overlap / 2;
    }
    
    // Update refs
    leftBlockRef.current = leftBlock;
    rightBlockRef.current = rightBlock;
    
    // Update state (less frequently to avoid too many renders)
    setBlocks({
      left: leftBlock,
      right: rightBlock
    });
    
    // Continue animation if still simulating
    if (isSimulating) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  };
  
  return (
    <div className={styles.simulationContainer} style={{ width: CONTAINER_WIDTH }}>
      <div className={styles.wall} style={{ width: WALL_WIDTH }}></div>
      <div 
        className={styles.block} 
        style={{ 
          left: `${blocks.left.position}px`,
          width: `${blocks.left.width}px`,
          height: `${MIN_BLOCK_WIDTH + (blocks.left.width - MIN_BLOCK_WIDTH)}px`,
        }}
      >
        {leftBlockMass}kg
      </div>
      <div 
        className={styles.block} 
        style={{ 
          left: `${blocks.right.position}px`,
          width: `${blocks.right.width}px`,
          height: `${MIN_BLOCK_WIDTH + (blocks.right.width - MIN_BLOCK_WIDTH)}px`,
        }}
      >
        {rightBlockMass}kg
      </div>
    </div>
  );
};

export default PhysicsSimulation; 