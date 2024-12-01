import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BlackCode, GreenCode, IpAddress, TextBoldFont, TitleFont, WhiteCode, YellowCode } from "../Context";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const logoPath = require("../assets/images/logo.png");
const profilePath = require("../assets/images/add-user.png");

export function ChatHeader(props) {

    const [getMobile,setMobile] = useState("");
    const [getImage,setImage] = useState(null);

    useEffect(
        () => {
            async function fetchData() {
    
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                setMobile(user.mobile);
                setImage(`${IpAddress}/avatar_images/${getMobile}.png`);
            }
    
            fetchData();
        }, [getMobile]
    );
    
    return (
        <View style={stylesheet.view1}>
            <Image source={logoPath} style={stylesheet.logo} contentFit={'contain'} />
            <View style={stylesheet.view4}>
                <Text style={stylesheet.text1}>{props.name}</Text>
            </View>
            <View style={stylesheet.view2}>
                <Pressable style={stylesheet.view3} onPress={
                    ()=>{
                        router.push("/profile");
                    }
                }>
                    <Image source={getImage} style={stylesheet.profileImage} contentFit={'contain'} onError={
                        ()=>{
                            setImage(profilePath);
                        }
                    }/>
                </Pressable>
            </View>
        </View>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            height:50,
            flexDirection: "row",
            columnGap: 20,
            marginTop: 10,
            backgroundColor:`${BlackCode}`
        },
        logo: {
            width: 150,
            height: 55,
            flex: 2,
        },
        profileImage: {
            width: 50,
            height: 50,
            borderRadius: 50,
        },
        text1: {
            fontFamily: `${TitleFont}`,
            fontSize: 25,
            marginTop: 10,
            color: `${YellowCode}`,
            alignSelf: "center"
        },
        view2: {
            width: 50,
            height: 50,
            flex: 2,
        },
        view3: {
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: `${BlackCode}`,
            alignSelf: "flex-end"
        },
        view4: {
            flex: 2,
        }
    }
);