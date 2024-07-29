import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Toast } from 'react-native-toast-message';

const Confirmation: React.FC = () => {
  const navigation = useNavigation();
  const [orderNumber, setOrderNumber] = useState(null);
  const orderDate = new Date();

  const panier = JSON.parse(sessionStorage.getItem('panier')) || [];
  const totalTTC = parseFloat(sessionStorage.getItem('totalTTC')) || 0;

  useEffect(() => {
    const generateOrderNumber = () => {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      return `E-${randomDigits}S`;
    };

    const sendOrderData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token || !userData.user || !userData.user.id) {
          console.error('User data or token is missing or invalid:', userData);
          navigation.navigate('Login');
          return;
        }

        const response = await axios.post(`http://localhost:8000/api/order/${userData.user.id}/create`, {
          orderDate: orderDate.toISOString().slice(0, 10),
          totalAmount: totalTTC,
        }, {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });

        if (response.status === 201) {
          toast.show({ type: 'success', text1: 'La commande a bien été enregistrée !' });
          setOrderNumber(response.data.orderId);
          const orderId = response.data.orderId;

          try {
            const orderDetailsData = panier.map(item => ({
              product_id: item.productId,
              quantity: item.quantite,
              unit_price: item.prix,
            }));

            const detailsResponse = await axios.post(
              `http://localhost:8000/api/orders/${orderId}/details`,
              orderDetailsData,
              {
                headers: {
                  Authorization: `Bearer ${userData.token}`,
                },
              }
            );

            if (detailsResponse.status === 201) {
              console.log('Détails de la commande envoyés avec succès');
            } else {
              console.error(
                'Erreur lors de l\'envoi des détails de la commande :',
                detailsResponse.data
              );
              toast.show({ type: 'error', text1: detailsResponse.data.error || 'Une erreur est survenue.' });
            }
          } catch (error) {
            console.error('Erreur lors de l\'envoi des détails de la commande:', error);
            toast.show({ type: 'error', text1: 'Une erreur est survenue lors de l\'envoi des détails de la commande.' });
          }
        } else {
          console.error('Erreur lors de l\'enregistrement de la commande :', response.data);
          toast.show({ type: 'error', text1: response.data.error || 'Une erreur est survenue.' });
        }
      } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        toast.show({ type: 'error', text1: 'Une erreur est survenue lors de la création de la commande.' });
      }
    };

    if (panier.length > 0 && !orderNumber) {
      setOrderNumber(generateOrderNumber());
      sendOrderData();
      localStorage.removeItem('guestCart');
      sessionStorage.removeItem('panier');
      sessionStorage.removeItem('totalTTC');
    }
  }, []);

  return (
    <View style={styles.container}>
      <ToastContainer />
      <Text style={styles.title}>Commande effectuée ✓</Text>
      <Text style={styles.message}>Merci pour votre achat !</Text>
      {orderNumber && <Text>Votre commande a bien été enregistrée sous le numéro {orderNumber}.</Text>}
      <Text>Date de la commande : {orderDate.toLocaleDateString()}</Text>
      <Text>Montant total : {totalTTC.toFixed(2)} €</Text>
      <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
        <Text style={styles.link}>Vous pouvez suivre son état depuis votre espace client.</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Accueil')}>
        <Text style={styles.button}>CONTINUER MES ACHATS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles ici
});

export default Confirmation;
