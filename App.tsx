import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ProjectsProvider } from './src/store/projects';
import { RootNavigator } from './src/navigation/RootNavigator';
import { indexFeatures } from './src/services/spotlight';

function Inner() {
  const { mode } = useTheme();

  useEffect(() => {
    indexFeatures();
  }, []);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProjectsProvider>
            <Inner />
          </ProjectsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
