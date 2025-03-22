import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

let pipeId = 0;

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const Physics = (entities, { time }) => {
  const bird = entities.bird;
  
  // Apply gravity to bird
  if (bird) {
    bird.velocity += 0.25;
    bird.position[1] += bird.velocity;
    
    // Check if bird hits the floor
    if (bird.position[1] + bird.size[1] / 2 > height - 50) {
      bird.position[1] = height - 50 - bird.size[1] / 2;
      entities.checkCollisions.engine(entities, { dispatch: entities.checkCollisions.args[0] });
    }
    
    // Check if bird hits the ceiling
    if (bird.position[1] - bird.size[1] / 2 < 0) {
      bird.position[1] = bird.size[1] / 2;
      bird.velocity = 0;
    }
  }
  
  // Move pipes
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0) {
      entities[key].position[0] -= 2;
    }
  });
  
  return entities;
};

export const CreatePipe = (entities, { time, dispatch }) => {
  // Create new pipes every 2 seconds
  if (time.current % 120 === 0) {
    const pipeWidth = entities.createPipe.args[2];
    const pipeGap = entities.createPipe.args[3];
    const screenHeight = entities.createPipe.args[1];
    
    // Random pipe ratio (how much of the screen is top pipe)
    const pipeRatio = randomBetween(0.1, 0.6);
    
    pipeId += 1;
    
    entities[`pipe${pipeId}`] = {
      position: [width, 0],
      size: [pipeWidth, screenHeight],
      pipeRatio: pipeRatio,
      pipeGap: pipeGap,
      scored: false,
      renderer: <Pipe />
    };
  }
  
  return entities;
};

export const CleanPipes = (entities) => {
  // Remove pipes that are off screen
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0 && key !== 'createPipe') {
      if (entities[key].position[0] < -entities[key].size[0]) {
        delete entities[key];
      }
    }
  });
  
  return entities;
};

export const CheckCollisions = (entities, { dispatch }) => {
  const bird = entities.bird;
  const setRunning = entities.checkCollisions.args[0];
  const setScore = entities.checkCollisions.args[1];
  
  // Check for collisions with pipes
  Object.keys(entities).forEach(key => {
    if (key.indexOf('pipe') === 0 && key !== 'createPipe') {
      const pipe = entities[key];
      const pipeX = pipe.position[0];
      const pipeWidth = pipe.size[0];
      const pipeRatio = pipe.pipeRatio;
      const pipeGap = pipe.pipeGap;
      const screenHeight = pipe.size[1];
      
      // Check if bird passed the pipe (for scoring)
      if (!pipe.scored && pipeX + pipeWidth < bird.position[0] - bird.size[0] / 2) {
        pipe.scored = true;
        dispatch({ type: 'score' });
      }
      
      // Check for collision with pipe
      if (
        bird.position[0] + bird.size[0] / 2 > pipeX &&
        bird.position[0] - bird.size[0] / 2 < pipeX + pipeWidth
      ) {
        // Check collision with top pipe
        if (bird.position[1] - bird.size[1] / 2 < screenHeight * pipeRatio) {
          dispatch({ type: 'game-over' });
        }
        
        // Check collision with bottom pipe
        if (bird.position[1] + bird.size[1] / 2 > screenHeight * pipeRatio + pipeGap) {
          dispatch({ type: 'game-over' });
        }
      }
    }
  });
  
  return entities;
};

// Handle bird flap
export const HandleFlap = (entities, { touches, dispatch }) => {
  touches.filter(t => t.type === 'press').forEach(() => {
    entities.bird.velocity = -5;
  });
  
  return entities;
}; 