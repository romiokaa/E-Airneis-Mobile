import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
    Image, Switch, Picker
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const baseUrl = '/img/'; // Assurez-vous que cette URL est correcte pour React Native

const RecherchePage = () => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        materiaux: [],
        prixMin: '',
        prixMax: '',
        categories: '',
        enStock: false,
    });
    const [sort, setSort] = useState('prix-asc');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories :', error);
            });
    }, []);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/api/recherche', {
                params: {
                    search: searchTerm,
                    materiaux: filters.materiaux.length > 0 ? filters.materiaux.join(',') : null,
                    prixMin: filters.prixMin !== '' ? filters.prixMin : null,
                    prixMax: filters.prixMax !== '' ? filters.prixMax : null,
                    categories: filters.categories,
                    enStock: filters.enStock,
                    sort,
                },
            });

            setProducts(response.data);
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm, filters, sort]);


    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
    };

    const handleFilterChange = (filterName: string, filterValue: any) => {
        setFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };

            if (Array.isArray(prevFilters[filterName])) {
                if (prevFilters[filterName].includes(filterValue)) {
                    updatedFilters[filterName] = prevFilters[filterName].filter(item => item !== filterValue);
                } else {
                    updatedFilters[filterName] = [...prevFilters[filterName], filterValue];
                }
            } else {
                updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const handleSortChange = (value: string) => {
        setSort(value);
    };

    const handleSubmit = () => {
        fetchData();
        setShowFilters(false);
    };

    const handleToggleFilters = () => {
        setShowFilters(prevState => !prevState);
    };
// ...

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.productCard}
    >
      <Image
        source={{ uri: item.productPhotos[0]?.photoUrl ? baseUrl + item.productPhotos[0]?.photoUrl : defaultImage }}
        style={styles.productImage}
      />
      <View style={styles.productCardDetails}>
        <Text style={styles.productCardTitle}>{item.Nom}</Text>
        <Text style={styles.productCardPrice}>{item.prix} €</Text>
        <Text style={styles.productCardStock}>
          {item.Stock > 0 ? "En stock" : "Stock épuisé"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.recherchePage}>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterContainer}>
          {/* ... filtres ... */}
        </View>
      )}

      <View style={styles.sortAndFilters}>
        <Picker
          style={styles.sortPicker}
          selectedValue={sort}
          onValueChange={handleSortChange}
        >
          <Picker.Item label="Prix croissant" value="prix-asc" />
          <Picker.Item label="Prix décroissant" value="prix-desc" />
        </Picker>
        <TouchableOpacity onPress={handleToggleFilters} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text>Chargement en cours...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId.toString()}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
        />
      )}

      {!isLoading && products.length === 0 && (
        <Text>Aucun produit ne correspond à votre recherche.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    // ... styles ...
});

export default RecherchePage;
