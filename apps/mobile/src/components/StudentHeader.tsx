import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export const StudentHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.hero, { paddingTop: Math.max(insets.top, 24) + 10 }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { color: '#D1FAE5', fontSize: 13, marginTop: 4 },
});
