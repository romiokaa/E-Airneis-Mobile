// import React from 'react';
// import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import styles from '../assets/css/styles';

// interface Category {
//     nom: string;
//     images: any;
// }

// interface Products {
//     nom: string;
//     images: any;
//     prix?: string;
// }

// const carrouselImages = [
//     require('@/assets/images/carrousel.jpg'),
//     require('@/assets/images/carrousel.jpg'),
//     require('@/assets/images/carrousel.jpg')
// ];

// const categories: Category[] = [
//     { nom: 'Lit', images: require('@/assets/images/temps.png')},
//     { nom: 'Canapé', images: require('@/assets/images/temps.png')},
//     { nom: 'Chaise', images: require('@/assets/images/temps.png')},
//     { nom: 'Table', images: require('@/assets/images/temps.png')}
// ];

// const products: Product[] = [
//     {nom: 'Table en marbre', prix: '500€', images: require('@/assets/images/temps.png')},
//     {nom: 'Chaise en bois', prix: '150€', images: require('@/assets/images/temps.png')},
//     {nom: 'Canapé en cuir', prix: '1200€', images: require('@/assets/images/temps.png')},
//     {nom: 'Lit en bois', prix: '450€', images: require('@/assets/images/temps.png')},
// ];

// export default Home;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Utilisez une bibliothèque de carrousel compatible avec React Native
import axios from 'axios';
// import Popup from './popUp'; // Assurez-vous que votre composant Popup est compatible avec React Native

const baseUrl = '/img/'; // Assurez-vous que l'URL de base des images est correcte pour React Native

const Home = ({ navigation }) => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const defaultImage = baseUrl + 'React-JS';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Récupérer les données du backoffice avec axios
    axios.get('http://localhost:8000/api/produits')
      .then(response => {
        setProduits(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits :', error);
      });

    axios.get('http://localhost:8000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories :', error);
      });

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselSlide}>
      <Image source={{ uri: item.productPhotos[0] ? baseUrl + item.productPhotos[0].photoUrl : defaultImage }} style={styles.carouselImage} />
    </View>
  );

  return (
    <ScrollView style={styles.homePage}>

      {/* Carrousel */}
      <Carousel
        data={produits}
        renderItem={renderCarouselItem}
        sliderWidth={width} // Largeur du carrousel
        itemWidth={width} // Largeur d'un élément du carrousel
        autoplay={true}
        autoplayInterval={5000}
        loop={true}
      />

      {/* Popup */}
      {showPopup && (
        <Popup
          message={`Bienvenue, ${JSON.parse(localStorage.getItem('user')).firstname}!`}
          onClose={handleClosePopup}
        />
      )}

      {/* Slogan */}
      <Text style={styles.slogan}>
        VENANT DES HAUTES TERRES D'ECOSSE
        {"\n"}
        NOS MEUBLES SONT IMMORTELS
      </Text>

      {/* Grille des catégories */}
      <View style={styles.categoryGrid}>
        {categories.slice(0, 3).map((category) => (
          <TouchableOpacity 
            key={category.categoryId}
            onPress={() => navigation.navigate('CategoryDetails', { category })}
            style={styles.categoryItem}
          >
            <Image
              source={{ uri: category.defaultPhotoUrl ? baseUrl + category.defaultPhotoUrl : defaultImage }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{category.categoryName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Les Highlanders du moment */}
      <Text style={styles.highlandersTitle}>Les Highlanders du moment</Text>

      {/* Grille des produits */}
      <View style={styles.productGrid}>
        {produits.slice(0, 3).map((produit) => (
          <TouchableOpacity
            key={produit.productId}
            onPress={() => navigation.navigate('ProductDetails', { product: produit })} 
            style={styles.productItem}
          >
            <Image source={{ uri: produit.productPhotos[0] ? baseUrl + produit.productPhotos[0].photoUrl : defaultImage }} style={styles.productImage} />
            <Text style={styles.productText}>{produit.Nom}</Text>
            <Text style={styles.productPrice}>Prix : {produit.prix} €</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Styles (à personnaliser)
const styles = StyleSheet.create({
  // ... styles pour les éléments de la page ...
});

export default Home;
