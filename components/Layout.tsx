import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            <Navbar />
            <ScrollView contentContainerStyle={styles.content}>
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent: 'space-between',
    },
    content: {
        flexGrow: 1,
        paddingBottom: 60,
    },
});

export default Layout;