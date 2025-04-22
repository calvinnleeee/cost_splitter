import { useFocusEffect, useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function Index() {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace('/home');
  });
  return <Text>Redirecting...</Text>;  
}
