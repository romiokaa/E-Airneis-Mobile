import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message';

const RegisterForm: React.FC = () => {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!firstname || !lastname || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires !');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        firstname,
        lastname,
        email,
        password,
        role: 'user',
      });

      console.log('Registration successful', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Affichez une notification de succès
      Toast.show({
        type: 'success',
        text1: 'Inscription réussie !',
      });
      
      navigation.navigate('Accueil'); 

    } catch (error: any) {
      console.error('Registration failed', error.response?.data || error.message);
      
      // Affichez une notification d'erreur avec le message de l'erreur
      Toast.show({
        type: 'error',
        text1: error.response?.data.message || 'Une erreur est survenue',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ToastContainer />
      <Text style={styles.title}>Inscription</Text>
      <View style={styles.form}>
        {/* ... champs de saisie pour firstname, lastname, email, password ... */}
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={firstname}
          onChangeText={setFirstname}
        />

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={lastname}
          onChangeText={setLastname}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'INSCRIRE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Déjà un compte ? Connectez-vous.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 10,
        textAlign: 'center',
        color: 'blue',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
export default RegisterForm;
