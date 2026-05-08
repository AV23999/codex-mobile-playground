import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NovaLogo({ size = 40 }: { size?: number }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.letter, { fontSize: size * 0.45 }]}>N</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#4f8ef7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#fff',
    fontWeight: '700',
  },
});
