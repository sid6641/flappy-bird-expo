import React from 'react';
import { View } from 'react-native';

export const Pipe = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.position[0];
  const y = props.position[1];

  const pipeRatio = 0.15; // Cap height ratio
  const capHeight = width * pipeRatio;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    >
      {/* Main pipe body */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#4EC24E', // Bright green
          borderWidth: 2,
          borderColor: '#2E8B57', // Darker green border
        }}
      />
      
      {/* Pipe cap */}
      <View
        style={{
          position: 'absolute',
          left: -5,
          right: -5,
          height: capHeight,
          backgroundColor: '#4EC24E',
          borderWidth: 2,
          borderColor: '#2E8B57',
          ...(y === 0 ? { bottom: 0 } : { top: 0 }),
        }}
      />
      
      {/* Pipe highlights */}
      <View
        style={{
          position: 'absolute',
          left: width / 3,
          width: 5,
          top: 0,
          bottom: 0,
          backgroundColor: '#7FFF00', // Light green highlight
          opacity: 0.5,
        }}
      />
    </View>
  );
}; 