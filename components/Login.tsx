import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });

      console.log('Login successful', response.data);

      localStorage.setItem('user', JSON.stringify(response.data));
      navigation.navigate('Accueil'); 
    } catch (error: any) {
      console.error('Login failed', error.response?.data || error.message);
      setError(error.response?.data.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Chargement...' : 'SE CONNECTER'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            Pas de compte? Inscrivez-vous.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (styles pour le container, titre, formulaire, input, etc.)
});

export default Login;
