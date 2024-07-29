import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { CardField, StripeProvider } from '@stripe/stripe-react-native'; // Assurez-vous d'avoir installé cette bibliothèque

const AccountSettings: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.token && storedUser.user && storedUser.user.id) {
        try {
          const response = await axios.get(`http://localhost:8000/api/account/${storedUser.user.id}`, {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          });
          if (response.status === 200) {
            setUserData(response.data);
            reset(response.data); // Initialize the form with user data
          } else {
            throw new Error('Erreur lors de la récupération des données utilisateur');
          }
        } catch (error) {
          console.error(error);
          setApiErrors(error.message);
        }
      } else {
        navigation.navigate('Login'); // Rediriger vers l'écran de connexion
      }
    };

    fetchUserData();
  }, [navigation, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiErrors(null);
    setSuccessMessage(null);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.token || !storedUser.user || !storedUser.user.id) {
      console.error('User data or token is missing or invalid:', storedUser);
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/account/${storedUser.user.id}`, data, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });

      if (response.status === 200) {
        setSuccessMessage('Informations mises à jour avec succès !');
        const updatedData = await response.json(); 
        setUserData(updatedData); 
        reset(updatedData); 
        setEditing(null);
      } else {
        const errorData = await response.json();
        setApiErrors(errorData.errors || { general: 'Erreur lors de la mise à jour.' });
      }
    } catch (error) {
      console.error(error);
      setApiErrors({ general: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteField = async (field: string) => {
    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer votre ${field} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser.token || !storedUser.user || !storedUser.user.id) {
              console.error('User data or token is missing or invalid:', storedUser);
              navigation.navigate('Login');
              return;
            }

            try {
              const response = await axios.delete(`http://localhost:8000/api/account/<span class="math-inline">\{storedUser\.user\.id\}/</span>{field}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
              });

              if (!response.ok) {
                throw new Error('Erreur lors de la suppression du champ');
              }

              setValue(field, ''); // Efface la valeur du champ dans le formulaire
              setSuccessMessage(`Champ ${field} supprimé avec succès !`);
            } catch (error) {
              console.error(error);
              setApiErrors({ general: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
            }
          },
        },
      ]
    );
  };

  const startEditing = (field: string) => {
    setEditing(field);
  };

  const cancelEditing = () => {
    setEditing(null);
    reset(userData); // Réinitialise le formulaire avec les données d'origine
  };

  const handleCardDetailsChange = (cardDetails) => {
    // Gérer les détails de la carte avec Stripe
    console.log(cardDetails);
  };

  const renderField = (fieldName: string, label: string, keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url') => {
    const isEditing = editing === fieldName;

    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>{label}:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder={label}
            {...register(fieldName, { required: true })}
            defaultValue={userData[fieldName] || ''}
            onChangeText={(text) => handleChange(fieldName, text)}
            keyboardType={keyboardType}
          />
        ) : (
          <View style={styles.row}>
            <Text>{userData[fieldName] || "Non renseigné"}</Text>
            <TouchableOpacity onPress={() => startEditing(fieldName)}>
              <Text style={styles.editButton}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteField(fieldName)}>
              <Text style={styles.deleteButton}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        {errors[fieldName] && <Text style={styles.errorText}>{errors[fieldName].message}</Text>}
      </View>
    );
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
              {editing === 'password' ? (
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
              ) : (
                <TouchableOpacity onPress={() => startEditing('password')}>
                  <Text style={styles.editButton}>Modifier le mot de passe</Text>
                </TouchableOpacity>
              )}
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
            </View>

            {/* Adresse, ville, pays, téléphone */}
            {renderField('address', 'Adresse')}
            {renderField('city', 'Ville')}
            {renderField('country', 'Pays')}
            {renderField('phoneNumber', 'Téléphone', 'phone-pad')}

            {/* Moyen de paiement */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Moyen de paiement :</Text>
              {editing === 'paymentMethod' ? (
                <Picker
                  selectedValue={watch('paymentMethod')}
                  onValueChange={(itemValue) => setValue('paymentMethod', itemValue)}
                >
                  <Picker.Item label="Sélectionnez un moyen de paiement" value="" />
                  <Picker.Item label="Carte de crédit" value="credit_card" />
                  <Picker.Item label="PayPal" value="paypal" />
                </Picker>
              ) : (
                <View style={styles.row}>
                  <Text>{userData.paymentMethod || "Aucun moyen de paiement enregistré"}</Text>
                  <TouchableOpacity onPress={() => startEditing('paymentMethod')}>
                    <Text style={styles.editButton}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors.paymentMethod && <Text style={styles.errorText}>{errors.paymentMethod.message}</Text>}
            </View>

            {/* Champ pour les détails de la carte */}
            {editing === 'paymentMethod' && watch('paymentMethod') === 'credit_card' && (
              <StripeProvider publishableKey="VOTRE_CLE_PUBLIABLE_STRIPE">
                <CardField
                  postalCodeEnabled={false}
                  style={styles.cardField}
                  onCardChange={handleCardDetailsChange}
                />
              </StripeProvider>
            )}
          </View>
        </View>
      ) : (
        <Text>Chargement des données utilisateur...</Text>
      )}

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  // ... autres styles ...
});

export default AccountSettings;
