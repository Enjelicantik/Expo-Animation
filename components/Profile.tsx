import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const Profile: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>Sarah Johnson</Text>
                <Text style={styles.age}>25 tahun</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tentang Saya</Text>
                <Text style={styles.sectionContent}>
                    Love traveling and photography 📸{'\n'}
                    Saya suka menjelajahi tempat-tempat baru dan mengabadikan momen indah melalui lensa kamera.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hobi</Text>
                <View style={styles.hobbyContainer}>
                    <View style={styles.hobbyTag}>
                        <Text style={styles.hobbyText}>✈️ Traveling</Text>
                    </View>
                    <View style={styles.hobbyTag}>
                        <Text style={styles.hobbyText}>📸 Photography</Text>
                    </View>
                    <View style={styles.hobbyTag}>
                        <Text style={styles.hobbyText}>☕ Coffee</Text>
                    </View>
                    <View style={styles.hobbyTag}>
                        <Text style={styles.hobbyText}>📚 Reading</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lokasi</Text>
                <Text style={styles.sectionContent}>Jakarta, Indonesia</Text>
            </View>
        </ScrollView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    age: {
        fontSize: 18,
        color: '#666',
    },
    section: {
        backgroundColor: '#FFF',
        padding: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    sectionContent: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    hobbyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    hobbyTag: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    hobbyText: {
        fontSize: 14,
        color: '#1976D2',
    },
});

