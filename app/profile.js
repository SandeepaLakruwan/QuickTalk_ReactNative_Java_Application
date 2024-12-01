import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BlackCode, GreenCode, IpAddress, TextBoldFont, TextFont, TitleFont, WhiteCode, YellowCode } from "../Context";
import * as ImagePicker from 'expo-image-picker';
import { router, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { FontAwesome6 } from "@expo/vector-icons";
import { Footer } from "../components/Footer";

SplashScreen.preventAutoHideAsync();

export default function profile() {

    const photoPath = require("../assets/images/add-user.png");
    const [getShowPassword, setShowPassword] = useState(false);

    const [getImage, setImage] = useState(null);

    const [getId, setId] = useState("");
    const [getMobile, setMobile] = useState("");
    const [getFirstName, setFirstName] = useState("");
    const [getLastName, setLastName] = useState("");
    const [getPassword, setPassword] = useState("");

    const [loaded, error] = useFonts(
        {
            "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
            "OpenSans_SemiCondensed-Regular": require("../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
            "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
        }
    );

    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                setMobile(user.mobile);
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setPassword(user.password);
                setId(user.id);

                setImage(`${IpAddress}/avatar_images/${getMobile}.png`);

            }

            fetchData();
        }, [getMobile]
    );

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={["#1e1f24", "#23232b"]} style={stylesheet.view1}>
            <StatusBar hidden={false} />
            <ScrollView style={stylesheet.view3}>
                <View style={stylesheet.view2}>

                    <Text style={stylesheet.text1}>Profile</Text>

                    <Pressable onPress={
                        async () => {
                            let result = await ImagePicker.launchImageLibraryAsync(
                                {
                                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                                    allowsEditing: true,
                                    aspect: [4, 4],
                                    quality: 1,
                                }
                            );

                            if (!result.canceled) {
                                setImage(result.assets[0].uri);
                            }
                        }
                    } style={stylesheet.avatar1}>
                        <Image source={getImage} style={stylesheet.avatar1} contentFit={'contain'} onError={
                            () => {
                                setImage(photoPath);
                            }
                        } />
                    </Pressable>

                    <Text style={stylesheet.text3}>Mobile</Text>
                    <TextInput style={stylesheet.input1} inputMode={'tel'} editable={false} value={getMobile} maxLength={10} onChangeText={
                        (text) => {
                            setMobile(text);
                        }
                    } />

                    <Text style={stylesheet.text3}>First Name</Text>
                    <TextInput style={stylesheet.input1} inputMode={'text'} value={getFirstName} onChangeText={
                        (text) => {
                            setFirstName(text);
                        }
                    } />

                    <Text style={stylesheet.text3}>Last Name</Text>
                    <TextInput style={stylesheet.input1} inputMode={'text'} value={getLastName} onChangeText={
                        (text) => {
                            setLastName(text);
                        }
                    } />

                    <Text style={stylesheet.text3}>Password</Text>
                    <View style={stylesheet.view5}>
                        <TextInput style={stylesheet.input2} inputMode={'text'} value={getPassword} secureTextEntry={!getShowPassword} maxLength={20} onChangeText={
                            (text) => {
                                setPassword(text);
                            }
                        } />
                        <Pressable style={stylesheet.pressable3} onPress={
                            () => {
                                setShowPassword(!getShowPassword);
                            }
                        }>
                            <FontAwesome6 name={getShowPassword ? "eye-slash" : "eye"} size={20} color={`${WhiteCode}`} />
                        </Pressable>
                    </View>


                    <Pressable style={stylesheet.pressable1} onPress={
                        async () => {

                            let formData = new FormData();
                            formData.append("id", getId);
                            formData.append("mobile", getMobile);
                            formData.append("firstName", getFirstName);
                            formData.append("lastName", getLastName);
                            formData.append("password", getPassword);

                            if (getImage != photoPath) {

                                formData.append("avatarImage",
                                    {
                                        name: "avatar",
                                        type: "image/png",
                                        uri: getImage,
                                    }
                                );

                            }

                            let response = await fetch(
                                `${IpAddress}/UpdateProfile`,
                                {
                                    method: "POST",
                                    body: formData,
                                }
                            );

                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    //user registration complete
                                    Alert.alert("Success", json.message);
                                } else {
                                    //problem occured
                                    Alert.alert("Error", json.message);
                                }

                            }

                        }
                    }>
                        <FontAwesome6 name={"user"} size={20} color={"black"} />
                        <Text style={stylesheet.text5}>Save Changes</Text>
                    </Pressable>

                    <Pressable style={stylesheet.pressable2} onPress={
                        async () => {
                            try {

                                let userJson = await AsyncStorage.getItem("user");
                                let user = JSON.parse(userJson);

                                const response = await fetch(`${IpAddress}/UserOffline?id=${user.id}`);
                                if (response.ok) {
                                    console.log('Status updated successfully.');
                                }

                                await AsyncStorage.removeItem('user');
                                router.replace("/");
                                console.log('User data removed');
                            } catch (error) {
                                console.error('Error clearing user data:', error);
                            }

                        }
                    }>
                        <FontAwesome6 name={"right-to-bracket"} size={20} color={"black"} />
                        <Text style={stylesheet.text5}>Sign Out</Text>
                    </Pressable>

                </View>

                <View style={stylesheet.view4}>
                    <Footer />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        view2: {
            width: 350,
            rowGap: 5,
        },
        view3: {
            alignSelf: "center",
            marginTop: 30,
        },
        text1: {
            fontSize: 32,
            color: "#fed47e",
            alignSelf: "center",
            fontFamily: `${TitleFont}`,
            marginBottom: 20,
        },
        image1: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        avatar1: {
            width: 100,
            height: 100,
            borderRadius: 50,
            borderColor: "#8ac187",
            borderWidth: 3,
            backgroundColor: "#1e1f24",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
        },
        input1: {
            width: "100%",
            height: 40,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            paddingStart: 10,
            borderBottomColor: `${WhiteCode}`,
            color: `${WhiteCode}`,
            marginBottom: 10,
        },
        input2: {
            width: "85%",
            height: 40,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            paddingStart: 10,
            borderBottomColor: `${WhiteCode}`,
            color: `${WhiteCode}`,
            marginBottom: 10,
        },
        text3: {
            fontSize: 16,
            fontFamily: `${TextBoldFont}`,
            color: `${WhiteCode}`
        },
        pressable1: {
            height: 50,
            backgroundColor: `${GreenCode}`,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginTop: 15,
            flexDirection: "row",
            columnGap: 15,
        },
        text5: {
            fontSize: 20,
            fontFamily: `${TextFont}`,
            color: "black",
        },
        view4: {
            marginTop: 30,
            width: 350,
        },
        pressable2: {
            height: 50,
            backgroundColor: `${YellowCode}`,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            columnGap: 15,
        },
        view5: {
            flexDirection: "row",
            columnGap: 10,
        },
        pressable3: {
            justifyContent: "center",
            alignItems: "center",
        }
    }
);