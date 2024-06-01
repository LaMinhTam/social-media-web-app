import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function index() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);
    return (
        <View>
            <Text>Home</Text>
            <Pressable onPress={() => navigation.navigate("login")}>
                <Text>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({});
