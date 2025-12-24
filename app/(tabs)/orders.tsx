import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const IMAGES = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    'https://images.unsplash.com/photo-1527477396000-e27137b2a0b8?w=400',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
];

const Orders = () => {
    const translateY = useSharedValue(100);
    const [visible, setVisible] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;

        if (y > 0) {
            setVisible(true);

            if (hideTimer.current) {
                clearTimeout(hideTimer.current);
            }

            hideTimer.current = setTimeout(() => {
                setVisible(false);
            }, 1000);
        }
    };

    useEffect(() => {
        translateY.value = withTiming(visible ? 0 : 100, {
            duration: 400,
        });
    }, [visible, translateY]);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleCheckout = () => {
        alert('Checkout berhasil!');
    };

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <Animated.View
                        key={i}
                        entering={FadeInRight.delay(i * 100)}
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 20,
                            height: 250,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            borderRadius: 15,
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            source={{ uri: IMAGES[i % IMAGES.length] }}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            resizeMode="cover"
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: 15,
                            }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                                {i}
                            </Text>
                        </View>
                    </Animated.View>
                ))}
            </Animated.ScrollView>

            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        bottom: 10,
                        width: '96%',
                        marginHorizontal: 10,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    buttonStyle,
                ]}
            >
                <Pressable onPress={handleCheckout}>
                    <Text style={{ color: 'white', fontSize: 20 }}>
                        Button checkout
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default Orders;
