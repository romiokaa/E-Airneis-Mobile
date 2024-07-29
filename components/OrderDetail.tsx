import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const baseUrl = 'https://votre-domaine.com/img/'; // Remplacez par votre URL de base

interface OrderDetailProps {
  route: {
    params: {
      orderId: number;
    };
  };
}

const OrderDetail: React.FC<OrderDetailProps> = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultImage = "votre_image_par_defaut";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Erreur lors du chargement de la commande : ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; 
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!order) {
    return <Text>La commande n'a pas été trouvée.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Détails de la commande #{orderId}</Text>

      {/* Informations client */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Informations client</Text>
        <Text>Nom : {order.user.firstName} {order.user.lastName}</Text>
        <Text>Email : {order.user.email}</Text>
      </View>

      {/* Détails du panier */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Panier</Text>
        {order.orderDetails.map((detail) => (
          <View key={detail.product.productId} style={styles.detailItem}>
            <Image
              source={{ uri: detail.product.productPhotos[0]?.photoUrl ? baseUrl + detail.product.productPhotos[0]?.photoUrl : defaultImage }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{detail.product.Nom}</Text>
              <Text>Description: {detail.product.description}</Text>
              <Text>Quantité: {detail.quantity}</Text>
              <Text>Prix unitaire: {parseFloat(detail.product.prix).toFixed(2)} €</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Livraison et Facturation */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Livraison</Text>
        {order.user.address ? (
          <Text>Adresse : {order.user.address}</Text>
        ) : (
          <Text>Adresse non renseignée</Text>
        )}
        {order.shippingCodePostal ? (
          <Text>Code postal : {order.shippingCodePostal}</Text>
        ) : (
          <Text>Code postal non renseigné</Text>
        )}

        <Text style={styles.subtitle}>Facturation</Text>
        <Text>Moyen de Paiement : {order.user.paymentMethod || "Non renseigné"}</Text>
      </View>
      
      {/* Paiement */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Paiement</Text>
        <Text>Statut du paiement : Confirmé</Text>
        {order.orderDetails.map((detail) => (
          <Text key={detail.product.productId}>
            Montant payé ({detail.product.Nom}): {(detail.quantity * detail.product.prix).toFixed(2)} €
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  section: { marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productImage: { width: 50, height: 50, marginRight: 10 },
  productDetails: {},
  productName: { fontWeight: 'bold' },
  error: { color: 'red' },
});

export default OrderDetail;
