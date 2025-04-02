import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNotification } from '@/context/NotificationContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  const { notification, expoPushToken, error} = useNotification();

  if(error){
    return <ThemedText>Error: {error.message}</ThemedText>
  }

  return (
    <ThemedView style={{flex: 1, padding: 10,}}>
      <SafeAreaView style={{flex: 1}}>
        <ThemedText type='subtitle'>Your push token</ThemedText>
        <ThemedText >{expoPushToken}</ThemedText>
        <ThemedText type='subtitle'>Last notification</ThemedText>
        <ThemedText >{notification?.request.content.title}</ThemedText>
        <ThemedText >{JSON.stringify(notification?.request.content.data, null, 2)}</ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
