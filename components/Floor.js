import React from 'react';
import { View } from 'react-native';

export const Floor = (props) => {
  const width = props.width;
  
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: width,
        height: 100,
      }}
    >
      {/* Ground */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          backgroundColor: '#DEB887', // Sandy color
          borderTopWidth: 3,
          borderColor: '#8B4513', // Brown border
        }}
      />
      
      {/* Grass */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 80,
          height: 20,
          backgroundColor: '#8CC152', // Grass green
          borderTopWidth: 3,
          borderColor: '#5D8C3A', // Darker green
        }}
      />
    </View>
  );
}; 