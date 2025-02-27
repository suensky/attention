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
  
  // Add collision counters
  const [wallCollisions, setWallCollisions] = useState(0);
  const [blockCollisions, setBlockCollisions] = useState(0);
  
  // Add velocities to displayed state
  const [leftVelocity, setLeftVelocity] = useState(0);
  const [rightVelocity, setRightVelocity] = useState(0);
  
  // Add zoom state to handle blocks going out of view
  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxExtent, setMaxExtent] = useState(0);
  
  // Constants
  const CONTAINER_WIDTH = 800; // Base width
  const CONTAINER_HEIGHT = 400; // Base height
  const MIN_BLOCK_WIDTH = 30; // Minimum block width
  const MAX_BLOCK_WIDTH = 120; // Maximum block width
  const WALL_WIDTH = 10;
  const INITIAL_VELOCITY = -100;
  const MAX_VELOCITY = 10000; // Maximum velocity to prevent blocks from moving too far in one frame
  
  // Calculate mass ratio for informational purposes
  const massRatio = Math.max(leftBlockMass / rightBlockMass, rightBlockMass / leftBlockMass);
  
  // Calculate block sizes based on masses
  const calculateBlockWidth = (mass: number): number => {
    // Log scale for size with constraints
    const maxMassLog = Math.log10(1000000);
    const massLog = Math.log10(Math.max(1, mass));
    const sizeRatio = massLog / maxMassLog;
    
    return MIN_BLOCK_WIDTH + sizeRatio * (MAX_BLOCK_WIDTH - MIN_BLOCK_WIDTH);
  };
  
  const leftBlockWidth = calculateBlockWidth(leftBlockMass);
  const rightBlockWidth = calculateBlockWidth(rightBlockMass);
  
  // Calculate a closer starting position for right block based on mass ratio
  const calculateRightBlockPosition = () => {
    // For extreme mass ratios, place blocks closer together
    const baseDistance = 150; // Default distance
    const adjustedDistance = Math.max(100, baseDistance - Math.log10(massRatio) * 20);
    
    return WALL_WIDTH + leftBlockWidth + 50 + adjustedDistance;
  };
  
  const [blocks, setBlocks] = useState({
    left: {
      position: WALL_WIDTH + 50,
      velocity: 0,
      mass: leftBlockMass,
      width: leftBlockWidth,
    },
    right: {
      position: calculateRightBlockPosition(), // Dynamic position based on mass ratio
      velocity: 0,
      mass: rightBlockMass,
      width: rightBlockWidth,
    }
  });
  
  // Update block masses when they change
  useEffect(() => {
    if (!isSimulating) {
      const newLeftWidth = calculateBlockWidth(leftBlockMass);
      const newRightWidth = calculateBlockWidth(rightBlockMass);
      
      const newLeftBlock = {
        position: WALL_WIDTH + 50,
        velocity: 0,
        mass: leftBlockMass,
        width: newLeftWidth,
      };
      
      const newRightBlock = {
        position: calculateRightBlockPosition(), // Use dynamic position here too
        velocity: 0,
        mass: rightBlockMass,
        width: newRightWidth,
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
      
      // Reset animation timing and collision counters
      lastTimeRef.current = 0;
      setWallCollisions(0);
      setBlockCollisions(0);
      
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
        width: leftBlockWidth,
      };
      
      const newRightBlock = {
        position: calculateRightBlockPosition(),
        velocity: 0,
        mass: rightBlockMass,
        width: rightBlockWidth,
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
  }, [isSimulating, leftBlockMass, rightBlockMass]);
  
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
    
    // Limit velocities to prevent blocks from moving too far in one frame
    leftBlock.velocity = Math.max(Math.min(leftBlock.velocity, MAX_VELOCITY), -MAX_VELOCITY);
    rightBlock.velocity = Math.max(Math.min(rightBlock.velocity, MAX_VELOCITY), -MAX_VELOCITY);
    
    // Update positions based on velocities
    leftBlock.position += leftBlock.velocity * deltaTime;
    rightBlock.position += rightBlock.velocity * deltaTime;
    
    // Check for collision with wall
    if (leftBlock.position <= WALL_WIDTH) {
      leftBlock.position = WALL_WIDTH;
      leftBlock.velocity = -leftBlock.velocity; // Elastic collision with wall
      setWallCollisions(prev => prev + 1);
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
      
      // Calculate new velocities
      let newV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      let newV2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
      
      // Add a small adjustment to prevent blocks from sticking in extreme mass ratios
      if (Math.abs(newV1) < 0.1 && Math.abs(v1) > 0) {
        newV1 = Math.sign(v1) * 0.1;
      }
      if (Math.abs(newV2) < 0.1 && Math.abs(v2) > 0) {
        newV2 = Math.sign(v2) * 0.1;
      }
      
      leftBlock.velocity = newV1;
      rightBlock.velocity = newV2;
      
      // Adjust positions to prevent overlap
      const overlap = leftBlockRight - rightBlockLeft;
      leftBlock.position -= overlap / 2;
      rightBlock.position += overlap / 2;
      
      setBlockCollisions(prev => prev + 1);
    }
    
    // Calculate the furthest positions of blocks for zoom calculation
    const leftMost = Math.min(WALL_WIDTH, leftBlock.position);
    const rightMost = Math.max(rightBlock.position + rightBlock.width, CONTAINER_WIDTH);
    const currentExtent = rightMost - leftMost;
    
    // If the extent is larger than what we've seen, adjust zoom
    if (currentExtent > maxExtent) {
      setMaxExtent(currentExtent);
      
      // Calculate new zoom level (with some buffer)
      // Limit minimum zoom to 0.5 (50%)
      const newZoom = Math.max(0.2, Math.min(1, CONTAINER_WIDTH / (currentExtent * 1.2)));
      setZoomLevel(newZoom);
    }
    
    // Update refs
    leftBlockRef.current = leftBlock;
    rightBlockRef.current = rightBlock;
    
    // Update velocities for display
    setLeftVelocity(leftBlock.velocity);
    setRightVelocity(rightBlock.velocity);
    
    // Update state
    setBlocks({
      left: leftBlock,
      right: rightBlock
    });
    
    // Continue animation if still simulating
    if (isSimulating) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  };
  
  // Reset max extent and zoom when simulation restarts
  useEffect(() => {
    if (!isSimulating) {
      setMaxExtent(0);
      setZoomLevel(1);
    }
  }, [isSimulating]);
  
  // Format velocity with sign for display
  // Note: In our system, positive velocity means moving right, negative means moving left
  const formatVelocity = (velocity: number): string => {
    const absVelocity = Math.abs(velocity).toFixed(2);
    // For display, we want + for right movement and - for left movement
    return velocity > 0 ? `+${absVelocity}` : `-${absVelocity}`;
  };
  
  return (
    <div>
      <div className={styles.simulationWrapper}>
        <div 
          className={styles.simulationContainer} 
          style={{ 
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'left center'
          }}
        >
          <div className={styles.wall} style={{ width: WALL_WIDTH }}></div>
          <div 
            className={styles.block} 
            style={{ 
              left: `${blocks.left.position}px`,
              width: `${blocks.left.width}px`,
              height: `${blocks.left.width}px`,
              backgroundColor: '#0070f3',
            }}
          >
            {leftBlockMass.toLocaleString()} kg
          </div>
          <div 
            className={styles.block} 
            style={{ 
              left: `${blocks.right.position}px`,
              width: `${blocks.right.width}px`,
              height: `${blocks.right.width}px`,
              backgroundColor: '#ff4500',
            }}
          >
            {rightBlockMass.toLocaleString()} kg
          </div>
        </div>
        
        {zoomLevel < 1 && (
          <div className={styles.zoomIndicator}>
            Zoomed out to {(zoomLevel * 100).toFixed(0)}%
          </div>
        )}
      </div>
      
      <div className={styles.stats}>
        <div className={styles.collisionStats}>
          <div>Wall Collisions: <span className={styles.collisionCount}>{wallCollisions}</span></div>
          <div>Block Collisions: <span className={styles.collisionCount}>{blockCollisions}</span></div>
        </div>
        
        <div className={styles.velocityStats}>
          <div>Left Block Speed: <span className={leftVelocity >= 0 ? styles.positiveVelocity : styles.negativeVelocity}>
            {formatVelocity(leftVelocity)} px/s
          </span></div>
          <div>Right Block Speed: <span className={rightVelocity >= 0 ? styles.positiveVelocity : styles.negativeVelocity}>
            {formatVelocity(rightVelocity)} px/s
          </span></div>
        </div>
        
        {massRatio > 100 && (
          <div className={styles.simulationNote}>
            <strong>Note:</strong> With large mass differences ({massRatio.toFixed(0)}:1), 
            blocks may travel far apart. The simulation will zoom out to keep them visible (min: 20%).
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicsSimulation; 