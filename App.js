import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Bird } from './components/Bird';
import { Floor } from './components/Floor';
import { Physics, CreatePipe, CleanPipes, CheckCollisions } from './systems';

const { width, height } = Dimensions.get('window');
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const BIRD_SIZE = 30;

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  const gameEngineRef = useRef(null);

  useEffect(() => {
    setGameEngine(gameEngineRef.current);
  }, []);

  const resetGame = () => {
    if (gameEngine) {
      gameEngine.swap({
        physics: { engine: Physics },
        createPipe: { engine: CreatePipe, args: [width, height, PIPE_WIDTH, PIPE_GAP] },
        cleanPipes: { engine: CleanPipes },
        checkCollisions: { engine: CheckCollisions, args: [setRunning, setScore] },
        bird: {
          position: [width / 4, height / 2],
          velocity: 0,
          size: [BIRD_SIZE, BIRD_SIZE],
          renderer: <Bird />
        },
        floor: {
          position: [0, height - 100],
          size: [width, 100],
          renderer: <Floor width={width} />
        }
      });
      setScore(0);
      setRunning(true);
    }
  };

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      if (score > bestScore) {
        setBestScore(score);
      }
      setRunning(false);
      setShowStartScreen(true);
    } else if (e.type === 'score') {
      setScore(score + 1);
    }
  };

  const startGame = () => {
    setShowStartScreen(false);
    resetGame();
  };

  const handleScreenTap = () => {
    console.log('Screen tapped!');
    if (running && gameEngine) {
      console.log('Dispatching flap event');
      gameEngine.dispatch({ type: 'flap' });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[Physics, CreatePipe, CleanPipes, CheckCollisions]}
        entities={{
          physics: { engine: Physics },
          createPipe: { engine: CreatePipe, args: [width, height, PIPE_WIDTH, PIPE_GAP] },
          cleanPipes: { engine: CleanPipes },
          checkCollisions: { engine: CheckCollisions, args: [setRunning, setScore] },
          bird: {
            position: [width / 4, height / 2],
            velocity: 0,
            size: [BIRD_SIZE, BIRD_SIZE],
            renderer: <Bird />
          },
          floor: {
            position: [0, height - 100],
            size: [width, 100],
            renderer: <Floor width={width} />
          }
        }}
        running={running}
        onEvent={onEvent}
      />
      
      {running && (
        <TouchableOpacity 
          style={styles.touchOverlay} 
          activeOpacity={1} 
          onPress={handleScreenTap}
        />
      )}

      {running && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      )}

      {showStartScreen && (
        <View style={styles.startScreen}>
          <Text style={styles.title}>Flappy Bird</Text>
          {score > 0 && (
            <View style={styles.scoreBoard}>
              <Text style={styles.scoreLabel}>Score: {score}</Text>
              <Text style={styles.scoreLabel}>Best Score: {bestScore}</Text>
            </View>
          )}
          <Text style={styles.instructions}>Tap to flap</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>{score > 0 ? 'Play Again' : 'Start Game'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70C5CE', // Classic Flappy Bird sky blue
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  startScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  scoreBoard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#DEB887',
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#E67E22', // Orange button like in original game
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#D35400',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
}); 