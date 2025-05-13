import React from 'react';
import { Button, Text, View } from 'react-native';
import { auth } from '../../firebase';

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
