import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const baseUrl = 'http://192.168.1.110:8081/assets/images/';

const Panier: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute(); 

  const [panier, setPanier] = useState([]);
  const [userId, setUserId] = useState(null);
  const [totalTTC, setTotalTTC] = useState(0);

  useEffect(() => {
    const fetchPanier = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      try {
        if (userData && userData.user && userData.user.id) {
          setUserId(userData.user.id);
          const response = await axios.get(`http://localhost:8000/api/panier/${userData.user.id}`);
          setPanier(response.data);
        } else {
          const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
          setPanier(guestCart.map(item => ({
            ...item,
            productId: parseInt(item.productId, 10) || 0,
            prix: parseFloat(item.prix) || 0,
            quantite: parseInt(item.quantite, 10) || 0,
          })));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
      }
    };

    fetchPanier();
  }, []);

  useEffect(() => {
    const newTotalTTC = panier.reduce((total, produit) => total + produit.prix * produit.quantite, 0) * 1.2; 
    setTotalTTC(newTotalTTC);
  }, [panier]);

  const handleModifierProduit = async (productId, newQuantite) => {
    try {
      if (userId) {
        await axios.put(`http://localhost:8000/api/panier/${productId}/${userId}`, { quantite: newQuantite });
      } else {
        const updatedPanier = panier.map(p =>
          p.productId === productId ? { ...p, quantite: newQuantite } : p
        );
        localStorage.setItem('guestCart', JSON.stringify(updatedPanier));
      }
      fetchPanier(userId);
      toast.show({ type: 'success', text1: 'Quantité mise à jour !' });
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité :', error);
      toast.show({ type: 'error', text1: 'Erreur lors de la modification.' });
    }
  };

  const handleSupprimerProduit = async (productId) => {
    try {
      if (userId) {
        await axios.delete(`http://localhost:8000/api/panier/${productId}/${userId}`);
      } else {
        const updatedPanier = panier.filter(p => p.productId !== productId);
        localStorage.setItem('guestCart', JSON.stringify(updatedPanier));
      }
      fetchPanier(userId);
      toast.show({ type: 'success', text1: 'Produit supprimé du panier !' });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
      toast.show({ type: 'error', text1: 'Erreur lors de la suppression.' });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      {item.photoUrl && (
        <Image source={{ uri: baseUrl + item.photoUrl }} style={styles.productImage} />
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.Nom}</Text>
        <Text style={styles.productPrice}>{item.prix} €</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleModifierProduit(item.productId, item.quantite - 1)}>
            <Feather name="minus-circle" size={20} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={item.quantite.toString()}
            keyboardType="numeric"
            onChangeText={(text) => handleModifierProduit(item.productId, parseInt(text, 10) || 1)} 
          />
          <TouchableOpacity onPress={() => handleModifierProduit(item.productId, item.quantite + 1)}>
            <Feather name="plus-circle" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleSupprimerProduit(item.productId)}>
          <Feather name="trash-2" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier</Text>
      <ToastContainer />
      <FlatList
        data={panier}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
        ListEmptyComponent={<Text>Votre panier est vide.</Text>}
      />
      {panier.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total TTC: {totalTTC.toFixed(2)} €</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Checkout', { panier })} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Passer la commande</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default Panier;
