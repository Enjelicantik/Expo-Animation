import React, { useCallback } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.6;

const CARD_DATA = [
    {
        id: 1,
        name: 'Sarah',
        age: 25,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        bio: 'Love traveling and photography 📸',
    },
    {
        id: 2,
        name: 'Emma',
        age: 28,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        bio: 'Coffee enthusiast ☕ | Book lover 📚',
    },
    {
        id: 3,
        name: 'Olivia',
        age: 26,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        bio: 'Yoga instructor 🧘 | Nature lover 🌿',
    },
    {
        id: 4,
        name: 'Sophia',
        age: 24,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        bio: 'Artist 🎨 | Music lover 🎵',
    },
    {
        id: 5,
        name: 'Isabella',
        age: 27,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        bio: 'Adventure seeker 🏔️ | Foodie 🍕',
    },
];

interface CardProps {
    card: typeof CARD_DATA[0];
    index: number;
    totalCards: number;
    translateX: SharedValue<number>;
    translateY: SharedValue<number>;
    isTopCard: boolean;
    isSwiping: boolean;
}

const Card: React.FC<CardProps> = ({ card, index, totalCards, translateX, translateY, isTopCard, isSwiping }) => {

    const animatedStyle = useAnimatedStyle(() => {
        if (!isTopCard) {
            const scale = interpolate(
                index,
                [0, 1, 2],
                [1, 0.95, 0.9],
                Extrapolation.CLAMP
            );
            const opacity = interpolate(
                index,
                [0, 1, 2],
                [1, 0.8, 0.6],
                Extrapolation.CLAMP
            );
            return {
                transform: [{ scale }],
                opacity,
            };
        }

        const rotate = interpolate(
            translateX.value,
            [-width, 0, width],
            [-30, 0, 30],
            Extrapolation.CLAMP
        );

        const opacity = 1;

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
            ],
            opacity,
        };
    });

    const likeOverlayStyle = useAnimatedStyle(() => {
        if (!isTopCard) return { opacity: 0 };

        const opacity = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0.5, 1],
            Extrapolation.CLAMP
        );

        return { 
            opacity,
            transform: [{ scale }],
        };
    });

    const nopeOverlayStyle = useAnimatedStyle(() => {
        if (!isTopCard) return { opacity: 0 };

        const opacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0.5],
            Extrapolation.CLAMP
        );

        return { 
            opacity,
            transform: [{ scale }],
        };
    });

    const cardStyle = useAnimatedStyle(() => {
        if (isTopCard && isSwiping) {
            return {
                pointerEvents: 'none' as const,
            };
        }
        return {};
    });

    return (
        <Animated.View
            style={[
                styles.card,
                animatedStyle,
                cardStyle,
                {
                    zIndex: totalCards - index,
                },
            ]}
        >
            <Image
                source={{ uri: card.image }}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <View style={styles.cardOverlay} />
            <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>Card {card.id}</Text>
                <Text style={styles.cardName}>
                    {card.name}, {card.age}
                </Text>
                <Text style={styles.cardBio}>{card.bio}</Text>
            </View>

            <Animated.View style={[styles.iconBadge, styles.heartIcon, likeOverlayStyle]}>
                <Text style={styles.iconText}>❤️</Text>
            </Animated.View>

            <Animated.View style={[styles.iconBadge, styles.xIcon, nopeOverlayStyle]}>
                <Text style={styles.iconText}>✕</Text>
            </Animated.View>
        </Animated.View>
    );
};

const TinderStack: React.FC = () => {
    const [swipedCardIds, setSwipedCardIds] = React.useState<Set<number>>(new Set());
    const [swipingCardId, setSwipingCardId] = React.useState<number | null>(null);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const availableCards = React.useMemo(() => {
        return CARD_DATA.filter(card => !swipedCardIds.has(card.id));
    }, [swipedCardIds]);

    const activeCards = React.useMemo(() => {
        const cards = [];
        const maxCards = Math.min(3, availableCards.length);
        for (let i = 0; i < maxCards; i++) {
            if (availableCards[i]) {
                cards.push(availableCards[i]);
            }
        }
        return cards;
    }, [availableCards]);

    const markCardAsSwiped = useCallback((cardId: number) => {
        setSwipedCardIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(cardId);
            return newSet;
        });
    }, []);

    const handleSwipeComplete = useCallback((direction: 'left' | 'right', cardId: number) => {
        const swipedCard = CARD_DATA.find(card => card.id === cardId);
        if (swipedCard) {
            if (direction === 'right') {
                console.log('Liked card:', swipedCard.name);
            } else {
                console.log('Passed card:', swipedCard.name);
            }
        }

        setTimeout(() => {
            translateX.value = 0;
            translateY.value = 0;
            setSwipingCardId(null);
        }, 150);
    }, [translateX, translateY]);

    const handleSwipeAnimationComplete = useCallback((direction: 'left' | 'right', cardId: number) => {
        setTimeout(() => {
            markCardAsSwiped(cardId);
            handleSwipeComplete(direction, cardId);
        }, 400);
    }, [markCardAsSwiped, handleSwipeComplete]);

    const handleButtonPress = useCallback((direction: 'left' | 'right') => {
        const currentAvailableCards = CARD_DATA.filter(card => !swipedCardIds.has(card.id));
        const cardToSwipe = currentAvailableCards[0];
        
        if (!cardToSwipe) return;
        
        setSwipingCardId(cardToSwipe.id);
        
        const toX = direction === 'right' ? width * 1.5 : -width * 1.5;
        
        translateX.value = withSpring(toX, {
            damping: 20,
            stiffness: 150,
            mass: 0.3,
        });
        translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 150,
            mass: 0.3,
        }, () => {
            handleSwipeAnimationComplete(direction, cardToSwipe.id);
        });
    }, [translateX, translateY, handleSwipeAnimationComplete, swipedCardIds]);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-20, 20])
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.3;
        })
        .onEnd((event) => {
            const swipeDistance = Math.abs(translateX.value);
            const swipeDirection = translateX.value > 0 ? 'right' : 'left';

            const currentAvailableCards = CARD_DATA.filter(card => !swipedCardIds.has(card.id));
            const cardToSwipe = currentAvailableCards[0];

            if (swipeDistance > SWIPE_THRESHOLD && cardToSwipe) {
                runOnJS(setSwipingCardId)(cardToSwipe.id);

                const toX = swipeDirection === 'right' ? width * 1.5 : -width * 1.5;
                const toY = event.translationY * 0.3;

                translateX.value = withSpring(toX, {
                    damping: 20,
                    stiffness: 150,
                    mass: 0.3,
                });
                translateY.value = withSpring(toY, {
                    damping: 20,
                    stiffness: 150,
                    mass: 0.3,
                }, () => {
                    runOnJS(handleSwipeAnimationComplete)(swipeDirection, cardToSwipe.id);
                });
            } else {
                translateX.value = withSpring(0, {
                    damping: 25,
                    stiffness: 150,
                });
                translateY.value = withSpring(0, {
                    damping: 25,
                    stiffness: 150,
                });
            }
        });

    return (
        <View style={styles.container}>
            {activeCards.length > 0 ? (
                <>
                    <View style={styles.stackContainer}>
                        {activeCards.map((card, index) => {
                            const isCardSwiping = swipingCardId === card.id && index === 0;
                            return (
                                <Card
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    totalCards={activeCards.length}
                                    translateX={translateX}
                                    translateY={translateY}
                                    isTopCard={index === 0}
                                    isSwiping={isCardSwiping}
                                />
                            );
                        })}
                    </View>

                    <GestureDetector gesture={panGesture}>
                        <View style={styles.gestureArea} />
                    </GestureDetector>

                    <View style={styles.actionButtons}>
                        <Pressable 
                            style={styles.button}
                            onPress={() => handleButtonPress('left')}
                        >
                            <Text style={[styles.buttonText, styles.nopeButton]}>✕</Text>
                        </Pressable>
                        <Pressable 
                            style={styles.button}
                            onPress={() => handleButtonPress('right')}
                        >
                            <Text style={[styles.buttonText, styles.likeButton]}>♥</Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Semua kartu sudah di-swipe! 🎉</Text>
                    <Pressable 
                        style={styles.resetButton}
                        onPress={() => setSwipedCardIds(new Set())}
                    >
                        <Text style={styles.resetButtonText}>Mulai Ulang</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default TinderStack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    stackContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: 'relative',
    },
    card: {
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    cardInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    cardNumber: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        opacity: 0.9,
    },
    cardName: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    cardBio: {
        color: '#FFF',
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    iconBadge: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 8,
    },
    heartIcon: {
        top: 15,
        left: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    xIcon: {
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    iconText: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    gestureArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 40,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 24,
    },
    likeButton: {
        color: '#4CAF50',
    },
    nopeButton: {
        color: '#F44336',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    resetButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resetButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

