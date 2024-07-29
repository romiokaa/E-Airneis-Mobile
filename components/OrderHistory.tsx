import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function OrderHistory() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!userData || !userData.token || !userData.user || !userData.user.id) {
          console.error('User data or token is missing or invalid:', userData);
          navigation.navigate('Login'); // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
          return;
        }

        const userId = userData.user.id;
        const response = await axios.get(`http://localhost:8000/api/order/history/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des commandes: " + err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text>Commande #{item.order_id} - {item.order_date}</Text>
      <Text>Montant total: {parseFloat(item.total_amount).toFixed(2)} €</Text>
    </View>
  );

  if (loading) {
    return <Text>Chargement des commandes...</Text>;
  }

  if (error) {
    return <Text style={styles.errorMessage}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes commandes</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorMessage: {
    color: 'red',
  },
});

export default OrderHistory;
