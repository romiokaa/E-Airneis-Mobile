import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import Carousel from '../components/Carousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import CategoryItem from '../components/CategoryItem';
import ProductItem from '../components/ProductItem';

const { width } = Dimensions.get('window');

// Composant AccueilScreen
const Accueil = ({ navigation }) => {
  const [carouselData, setCarouselData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [highlanders, setHighlanders] = useState([]);

  useEffect(() => {
    // Récupérer les données du backoffice avec axios
    axios.get('https://192.168.1.110:8000/api/accueil') // Remplacez par votre URL
      .then(response => {
        setCarouselData(response.data.carousel);
        setCategories(response.data.categories);
        setHighlanders(response.data.highlanders);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des données:", error);
      });
  }, []);

  return (
    // <ScrollView style={styles.container}>
    //   <Carousel data={carouselData} /> 
    //   <Text style={styles.fixedText}>Votre texte fixe ici</Text>

    //   {/* Grille des catégories */}
    //   <View style={styles.categoryGrid}>
    //     {categories.map(category => (
    //       <CategoryItem key={category.id} category={category} navigation={navigation} />
    //     ))}
    //   </View>

    //   <Text style={styles.highlandersTitle}>Les Highlanders du moment</Text>

    //   {/* Grille des produits */}
    //   <View style={styles.productGrid}>
    //     {highlanders.map(product => (
    //       <ProductItem key={product.id} product={product} navigation={navigation} />
    //     ))}
    //   </View>
    // </ScrollView>
    <ScrollView style={styles.container}>
    <Carousel data={carouselData} />
    <Text style={styles.fixedText}>Votre texte fixe ici</Text>

    {/* Utilisation des composants de grille */}
    <CategoryGrid categories={categories} navigation={navigation} />
    <Text style={styles.highlandersTitle}>Les Highlanders du moment</Text>
    <ProductGrid products={highlanders} navigation={navigation} />

  </ScrollView>
  );
};

// Styles (à personnaliser selon vos besoins)
const styles = StyleSheet.create({
 // ... (styles pour le container, les grilles, les items, le texte, etc.)
});

export default Accueil;
