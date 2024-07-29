import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Login from '../LoginPage/LoginForm';
import { CardField, StripeProvider } from '@stripe/stripe-react-native';
import Confirmation from './Confirmation';
import { Toast } from 'react-native-toast-message';

const stripePromise = loadStripe('pk_test_51PfKZmKixfMhfPrWZ2P1UQnTDA7ohWcfHkcDWiIc6tniqXtBo22m28m8TQAGZqHuReZ0Uo8dWUt8CSrnzI4IEONR00iLw1yFqJ');

const Checkout: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [useExistingData, setUseExistingData] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totalTTC, setTotalTTC] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fieldData = [
    // ... (Données des champs)
  ];

  useEffect(() => {
    const fetchTotalTTC = async () => {
      const storedTotalTTC = sessionStorage.getItem('totalTTC');
      if (storedTotalTTC) {
        const parsedTotalTTC = parseFloat(storedTotalTTC);
        setTotalTTC(parsedTotalTTC);
        try {
          const response = await fetch('http://localhost:8000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalTTC: parsedTotalTTC }),
          });
          const data = await response.json();
          if (data.error) {
            setErrorMessage(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        } catch (error) {
          setErrorMessage('Erreur réseau lors de la création du Payment Intent');
        }
      } else {
        console.error("Total TTC non trouvé dans sessionStorage");
      }
    };

    fetchTotalTTC();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.token && storedUser.user && storedUser.user.id) {
        try {
          const response = await fetch(`http://localhost:8000/api/account/${storedUser.user.id}`, {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }

          const data = await response.json();
          setUserData(data);

          if (useExistingData && data) {
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            // ... (Set other fields)
          }
          setStep(2);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate, useExistingData]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: backendError, clientSecret } = await fetch(
      'http://localhost:8000/create-payment-intent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalTTC: totalTTC,
        }),
      }
    ).then(r => r.json());

    if (backendError) {
      setErrorMessage(backendError.message);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:8000/confirmation',
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An unexpected error occurred.');
    }

    setShowConfirmation(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {/* ... (étape 1 : composant Login) */}

        {/* ... (étape 2 : formulaire avec les champs de saisie, CardField, boutons, etc.) */}
    </ScrollView>
  );
};
// ... (styles)
export default Checkout;
