import { Dimensions } from 'react-native';
import { Pipe } from './components/Pipe';

const { width } = Dimensions.get('window');
const PIPE_WIDTH = 60;

// Physics system - handles gravity and flap events
export const Physics = (entities, { touches, events, dispatch }) => {
  const bird = entities.bird;
  
  console.log('Physics system running, bird position:', bird.position[1], 'velocity:', bird.velocity);
  
  // Handle flap events
  if (events && events.length) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].type === 'flap') {
        bird.velocity = -8; // Negative velocity makes the bird go up
        console.log('Bird flapped! New velocity:', bird.velocity);
      }
    }
  }
  
  // Apply gravity
  bird.velocity = bird.velocity + 0.5; // Gravity effect
  bird.position[1] = bird.position[1] + bird.velocity;
  
  return entities;
};

// Create pipes at regular intervals
export const CreatePipe = (entities, { time, dispatch }) => {
  // Check if we need to create a new pipe
  if (!entities.createPipe.lastCreatedAt || time.current - entities.createPipe.lastCreatedAt > 2000) {
    const [width, height, pipeWidth, pipeGap] = entities.createPipe.args;
    
    // Random gap position
    const gapStart = Math.floor(Math.random() * (height - 300 - pipeGap)) + 100;
    
    // Create top pipe
    const pipeTopId = `pipe-top-${Date.now()}`;
    entities[pipeTopId] = {
      position: [width, 0],
      size: [pipeWidth, gapStart],
      scored: false,
      renderer: <Pipe />
    };
    
    // Create bottom pipe
    const pipeBottomId = `pipe-bottom-${Date.now()}`;
    entities[pipeBottomId] = {
      position: [width, gapStart + pipeGap],
      size: [pipeWidth, height - gapStart - pipeGap],
      scored: false,
      renderer: <Pipe />
    };
    
    // Update last created time
    entities.createPipe.lastCreatedAt = time.current;
  }
  
  // Move all pipes to the left
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0) {
      entities[key].position[0] -= 3; // Pipe speed
      
      // Check if bird passed the pipe for scoring
      if (!entities[key].scored && 
          entities.bird.position[0] > entities[key].position[0] + entities[key].size[0]) {
        entities[key].scored = true;
        // Only dispatch score once per pipe pair
        if (key.indexOf('pipe-top') === 0) {
          dispatch({ type: 'score' });
        }
      }
    }
  });
  
  return entities;
};

// Remove pipes that have gone off screen
export const CleanPipes = (entities) => {
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0 && entities[key].position[0] < -PIPE_WIDTH) {
      delete entities[key];
    }
  });
  
  return entities;
};

// Check for collisions between bird and pipes/floor/ceiling
export const CheckCollisions = (entities, { dispatch }) => {
  const bird = entities.bird;
  const [setRunning, setScore] = entities.checkCollisions.args;
  
  // Check floor collision
  if (bird.position[1] + bird.size[1] >= entities.floor.position[1]) {
    dispatch({ type: 'game-over' });
  }
  
  // Check ceiling collision
  if (bird.position[1] <= 0) {
    dispatch({ type: 'game-over' });
  }
  
  // Check pipe collisions
  let birdBox = {
    x1: bird.position[0],
    y1: bird.position[1],
    x2: bird.position[0] + bird.size[0],
    y2: bird.position[1] + bird.size[1]
  };
  
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0) {
      let pipe = entities[key];
      let pipeBox = {
        x1: pipe.position[0],
        y1: pipe.position[1],
        x2: pipe.position[0] + pipe.size[0],
        y2: pipe.position[1] + pipe.size[1]
      };
      
      if (boxesCollide(birdBox, pipeBox)) {
        dispatch({ type: 'game-over' });
      }
    }
  });
  
  return entities;
};

// Helper function to check collision between two boxes
const boxesCollide = (box1, box2) => {
  return (box1.x1 < box2.x2 &&
          box1.x2 > box2.x1 &&
          box1.y1 < box2.y2 &&
          box1.y2 > box2.y1);
}; 