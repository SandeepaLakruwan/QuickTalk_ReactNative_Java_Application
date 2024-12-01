import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BlackCode, BlackGreenCode, GreenCode, IpAddress, SemiGreenCode, TextFont, TitleFont, WhiteCode, YellowCode } from "../Context";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //get parameters
    const item = useLocalSearchParams();
    
    //store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");

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

    //fetch chat array from server
    useEffect(
        () => {
            let intervalId;

            async function fetchChatArray() {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(`${IpAddress}/LoadChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}`);
                if (response.ok) {
                    let chatArray = await response.json();
                    setChatArray(chatArray);
                }
            }
            fetchChatArray();

            intervalId = setInterval(() => {
                fetchChatArray();
            }, 5000);

            return () => {
                if (intervalId) {
                    clearInterval(intervalId);  // Clear interval when unmounted or when the effect re-runs
                }
            }
        }, []
    );

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={["#1e1f24", "#23232b"]} style={stylesheet.view1}>
            <StatusBar hidden={false} />

            <View style={stylesheet.view2}>
                <View style={item.other_user_status == 1 ? stylesheet.view3_1 : stylesheet.view3_2}>
                    {item.avatar_image_found == "true" ?
                        (<Image style={stylesheet.image1} source={`${IpAddress}/avatar_images/${item.other_user_mobile}.png`} contentFit={"contain"} />)
                        : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }
                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                                <Text style={stylesheet.text5}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text4}>{item.datetime}</Text>
                                    {item.side == "right" ?
                                        (item.status == 1 ?
                                            <FontAwesome6 name={"check-double"} size={15} color={"green"} />
                                            : <FontAwesome6 name={"check"} size={15} color={"black"} />)
                                        : null
                                    }
                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />

            </View>

            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} value={getChatText} onChangeText={
                    (text) => { setChatText(text) }
                } />
                <Pressable onPress={
                    async () => {

                        if (getChatText.length == 0) {
                            Alert.alert("Warning", "Please enter your message.");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch(`${IpAddress}/SendChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}&message=${getChatText}`);
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success == true) {
                                    console.log("Message send");
                                    setChatText("");
                                }
                            }
                        }

                    }
                }>
                    <FontAwesome6 name={"paper-plane"} size={25} color={"white"} />
                </Pressable>
            </View>

        </LinearGradient>

    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,

        },
        view2: {
            padding: 10,
            paddingTop: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 20,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: `${BlackGreenCode}`
        },
        view3_1: {
            backgroundColor: `${BlackCode}`,
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: `${GreenCode}`,
            borderWidth: 2,
        },
        view3_2: {
            backgroundColor: `${BlackCode}`,
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: `${YellowCode}`,
            borderWidth: 2,
        },
        view4: {
            rowGap: 5,
        },
        image1: {
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignSelf: "center",
        },
        text1: {
            fontSize: 38,
            fontFamily: `${TitleFont}`,
            color: `${WhiteCode}`
        },
        text2: {
            fontSize: 24,
            fontFamily: `${TextFont}`,
            color: `${WhiteCode}`
        },
        text3: {
            fontSize: 16,
            fontFamily: `${TextFont}`,
            color: `${GreenCode}`
        },
        view5_1: {
            backgroundColor: `${SemiGreenCode}`,
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,

        },
        view5_2: {
            backgroundColor: `${YellowCode}`,
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
            width: ""
        },
        view6: {
            flexDirection: "row",
            columnGap: 10,
        },
        text4: {
            fontSize: 12,
            fontFamily: `${TitleFont}`,
        },
        text5: {
            fontSize: 18,
            fontFamily: `${TextFont}`,
            color: `${BlackCode}`
        },
        view7: {
            flexDirection: "row",
            columnGap: 15,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            margin: 10,
        },
        input1: {
            height: 40,
            borderRadius: 10,
            borderStyle: "solid",
            borderColor: `${WhiteCode}`,
            borderWidth: 1,
            fontFamily: "",
            fontSize: 18,
            flex: 1,
            paddingStart: 10,
            color:`${WhiteCode}`,
        },
        pressable1: {
            backgroundColor: "blue",
            width: 30,
            height: 30,
            borderRadius: 15,
            padding: 20,
        },
        center_view: {
            flex: 1,
            marginVertical: 20,
        }
    }
);