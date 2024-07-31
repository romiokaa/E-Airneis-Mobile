import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';   

import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';   

import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import   
 { CardField, StripeProvider } from '@stripe/stripe-react-native'; // Assurez-vous d'avoir installé cette bibliothèque
 import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface pour typer les données utilisateur
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  paymentMethod?: string;
  token: string;
  password?: string;
}

interface AppError {
    message: string;
    // Autres propriétés éventuelles de l'erreur
  }  

const AccountSettings: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<keyof User | null>(null);
  const passwordFieldName: keyof User = 'password'; // Variable pour le nom du champ "password"

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const storedUserString = await AsyncStorage.getItem('user');
            if (storedUserString) {
                const storedUser: User = JSON.parse(storedUserString);
                setUserData(storedUser);
                reset(storedUser);
            } else {
                navigation.navigate('Login'); 
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
            setApiErrors("Une erreur est survenue lors de la récupération des données utilisateur.");
        }
    };

    fetchUserData();
}, [navigation, reset]);  

const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userDataToUpdate = data as User;
    setIsLoading(true);
    setApiErrors(null);
    setSuccessMessage(null);
  
    try {
      const storedUserString = await AsyncStorage.getItem('user');
      if (storedUserString) {
        const storedUser: User = JSON.parse(storedUserString);
  
        const response = await axios.put(
          `http://localhost:8000/api/account/${storedUser.user.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${storedUser.token}` }, // Correction de l'erreur "token is not defined"
          }
        );
  
        if (response.status === 200) {
          setSuccessMessage('Informations mises à jour avec succès !');
          const updatedData: User = response.data; // Utilisez response.data directement
          setUserData(updatedData);
          reset(updatedData); 
          setEditing(null);
          await AsyncStorage.setItem('user', JSON.stringify(updatedData)); 
        } else {
          const errorData = response.data; // Utilisez response.data directement
          setApiErrors(errorData.error || 'Erreur lors de la mise à jour.');
        }
      }
    } catch (error: any) { 
      console.error("Erreur lors de la mise à jour des données utilisateur:", error);
      setApiErrors(error.message || 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeleteField = async (field: keyof User) => {
    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer votre ${field} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const storedUserString = await AsyncStorage.getItem('user');
            if (storedUserString) {
              const storedUser: User = JSON.parse(storedUserString);
              if (!storedUser || !storedUser.token || !storedUser.id) { // Correction de la vérification de storedUser.user
                console.error('User data or token is missing or invalid:', storedUser);
                navigation.navigate('Login');
                return;
              }
  
              try {
                const response = await axios.delete(`http://localhost:8000/api/account/${storedUser.id}/${field}`, { // Correction de l'URL
                  headers: { Authorization: `Bearer ${storedUser.token}` },
                });
  
                if (response.status !== 200) { // Vérification du code de status
                  const errorData = response.data;
                  throw new Error(errorData.error || 'Erreur lors de la suppression du champ');
                }
  
                setValue(field, '');
                setSuccessMessage(`Champ ${field} supprimé avec succès !`);
  
                // Mise à jour de userData en utilisant un type optionnel (Partial<User>)
                const updatedUserData: Partial<User> = { ...userData };
                delete updatedUserData[field];

                if (updatedUserData.id) { // Vérifiez que l'ID est toujours présent
                setUserData(updatedUserData as User); // Conversion en User après la suppression
                await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
                } else {
                // Gérez le cas où l'ID est manquant (erreur inattendue)
                console.error('ID utilisateur manquant après la suppression du champ.');
                }
              } catch (error: any) {
                console.error(error);
                setApiErrors(error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
              }
            }
          },
        },
      ]
    );
  };
  

  const startEditing = (field: keyof User) => {
    setEditing(field);
  };

  const cancelEditing = () => {
    setEditing(null);
    if (userData) { // Vérifiez que userData n'est pas null
      reset(userData);
    }
  };
  

  const handleCardDetailsChange = (cardDetails : any) => {
    // Gérer les détails de la carte avec Stripe
    console.log(cardDetails);
  };

  const handleChange = (name: keyof User, value: string) => {
    setValue(name, value); // Mettre à jour la valeur du champ dans l'état du formulaire
  };

  const renderField = (fieldName: keyof User, label: string, keyboardType?: any) => {
    const isEditing = editing === fieldName;
  
    if (userData && userData[fieldName]) { 
      return (
        <View style={styles.formGroup}>
          <Text style={styles.label}>{label}:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder={label}
              {...register(fieldName, { required: true })}
              defaultValue={userData[fieldName].toString()} // Pas besoin de ?? ici
              onChangeText={(text) => handleChange(fieldName, text)}
              keyboardType={keyboardType}
            />
          ) : (
            <View style={styles.row}>
              <Text>{userData[fieldName]}</Text> // Pas besoin de ?? ici
              <TouchableOpacity onPress={() => startEditing(fieldName)}>
                <Text style={styles.editButton}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteField(fieldName)}>
                <Text style={styles.deleteButton}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
          {errors[fieldName]?.message && (
            <Text style={styles.errorText}>{errors[fieldName]?.message.toString()}</Text>
          )}
        </View>
      );
    } else {
      // userData n'est pas encore chargé ou la propriété n'existe pas
      return null; // Ou un autre composant approprié (ex: ActivityIndicator)
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paramètres du compte</Text>

          <View style={styles.form}>
            {renderField('firstName', 'Prénom')}
            {renderField('lastName', 'Nom')}
            {renderField('email', 'Email', 'email-address')}

        {/* Mot de passe */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nouveau mot de passe:</Text>
          {typeof editing === 'string' && editing === 'password' && ( // Correction de la comparaison
            <>
              <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                {...register("password", { minLength: 8 })}
                secureTextEntry={true}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                {...register("confirmPassword", {
                  validate: (value) => value === watch('password') || "Les mots de passe ne correspondent pas",
                })}
                secureTextEntry={true}
              />
            </>
          )}
          {errors.password?.message && <Text style={styles.errorText}>{errors.password.message}</Text>}
          {errors.confirmPassword?.message && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
        </View>

            {/* Adresse, ville, pays, téléphone */}
            {renderField('address', 'Adresse')}
            {renderField('city', 'Ville')}
            {renderField('country', 'Pays')}
            {renderField('phoneNumber', 'Téléphone', 'phone-pad')}

            {/* Boutons Enregistrer et Annuler */}
            {editing && (
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                  <Text style={styles.buttonText}>Enregistrer les modifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Messages de succès et d'erreur */}
            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
            {apiErrors && <Text style={styles.errorMessage}>{apiErrors}</Text>}
          </View>
        </View>
      ) : (
        <Text>Chargement des données utilisateur...</Text>
      )}
    </ScrollView>
  );
};  

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Pour occuper environ la moitié de la largeur
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Pour occuper environ la moitié de la largeur
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});


export default AccountSettings;
