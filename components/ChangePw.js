import React, { useState } from 'react';
import { 
  View, Text, TextInput, Alert, Button, Pressable } from 'react-native';
import { changePassword } from './Auth';
import styles from '../style/style';

export default ChangePw = ({ navigation, route }) => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePress = () => {
    if (!password) {
      Alert.alert('Password is required.');
    } else if (!confirmPassword) {
      setPassword('');
      Alert.alert('Confirming password is required.');
    } else if (password !== confirmPassword) {
      Alert.alert('Passwords do not match!');
    } else {
      changePassword(password, navigation)
      navigation.navigate('Todo');
    }
  };

  return (
    <View 
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.header}>Todos</Text>
      <Text style={styles.infoText}>
        Change password for the user {route.params.nickname}.
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your new password*"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm your new password*"
        value={confirmPassword}
        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
        secureTextEntry={true}
      />
      <Pressable style={styles.buttonStyle}>
        <Button 
          title="Change password"
          onPress={handlePress} />
      </Pressable>
      <Pressable style={styles.buttonStyle}>
        <Button 
          title="Back to todos"
          onPress={() => navigation.navigate('Todo')} />
      </Pressable>
    </View>
  );
}