import { Image, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { Button, TextInput } from "react-native-paper";

export default function index() {
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: Colors.lite,
                paddingLeft: 20,
                paddingRight: 20,
            }}
        >
            <Image
                style={{ width: "100%", height: 200 }}
                source={require("../../assets/images/login-logo.jpg")}
            ></Image>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        color: Colors.primary,
                        fontSize: 30,
                        fontWeight: "bold",
                    }}
                >
                    Hello{" "}
                </Text>
                <Text
                    style={{
                        color: Colors.text1,
                        fontSize: 30,
                        fontWeight: "bold",
                    }}
                >
                    again
                </Text>
            </View>
            <Text
                style={{
                    color: Colors.text2,
                    fontSize: 16,
                    textAlign: "center",
                    marginHorizontal: 20,
                    fontWeight: "semibold",
                }}
            >
                Welcome back, we are happy to see you again.
            </Text>
            <TextInput
                mode="outlined"
                style={{
                    width: "100%",
                    marginTop: 20,
                    backgroundColor: Colors.lite,
                }}
                label="Email address or phone number"
                left={<TextInput.Icon icon={`email`} />}
            />
            <TextInput
                mode="outlined"
                style={{
                    width: "100%",
                    marginTop: 20,
                    backgroundColor: Colors.lite,
                }}
                secureTextEntry={showPassword ? false : true}
                label="Password"
                left={<TextInput.Icon icon={`lock`} />}
                right={
                    showPassword ? (
                        <TextInput.Icon
                            onPress={() => setShowPassword(false)}
                            icon={`eye-off`}
                        />
                    ) : (
                        <TextInput.Icon
                            onPress={() => setShowPassword(true)}
                            icon={`eye`}
                        />
                    )
                }
            />
            <Text
                style={{
                    color: Colors.error,
                    marginTop: 10,
                    fontSize: 14,
                    fontWeight: "bold",
                    marginLeft: "auto",
                }}
            >
                Forgot password?
            </Text>
            <Button
                mode="contained"
                style={{
                    width: "100%",
                    padding: 4,
                    marginTop: 20,
                    backgroundColor: Colors.primary,
                }}
                labelStyle={{
                    color: Colors.lite,
                    fontWeight: "bold",
                }}
            >
                Sign in
            </Button>
        </View>
    );
}
