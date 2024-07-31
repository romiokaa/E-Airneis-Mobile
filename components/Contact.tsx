import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setServerErrors({}); 

    try {
      const response = await axios.post('http://localhost:8000/api/contact', formData);

      if (response.status === 200) {
        Alert.alert('Succès', 'Message envoyé avec succès !');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setServerErrors(response.data.error || { general: 'Une erreur est survenue.' });
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setServerErrors({ general: 'Erreur réseau. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contactez-nous</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom*</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
          {serverErrors.name && <Text style={styles.errorText}>{serverErrors.name}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Envoi...' : 'Envoyer'}</Text>
        </TouchableOpacity>

        {serverErrors.general && <Text style={styles.errorText}>{serverErrors.general}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default Contact;
