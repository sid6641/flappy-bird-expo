import React from 'react';
import { View, Image } from 'react-native';

export const Bird = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.position[0];
  const y = props.position[1];

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: '#FFFF00', // Yellow bird
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Red beak */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: height / 2 - 3,
          width: 8,
          height: 6,
          backgroundColor: '#FF0000',
          borderRadius: 2,
        }}
      />
      {/* Eye */}
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: height / 3,
          width: 6,
          height: 6,
          backgroundColor: '#000000',
          borderRadius: 3,
        }}
      />
    </View>
  );
}; 