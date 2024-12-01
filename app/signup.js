import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { BlackCode, GreenCode, IpAddress, TextBoldFont, TextFont, TitleFont, WhiteCode } from '../Context';
import { Footer } from '../components/Footer';
import { registerRootComponent } from 'expo';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function signup() {


  const logoPath = require("../assets/images/logo.png");
  const photoPath = require("../assets/images/photos.png");

  const [getImage, setImage] = useState(photoPath);

  const [loaded, error] = useFonts(
    {
      "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
      "OpenSans_SemiCondensed-Regular": require("../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
      "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    }
  );
 
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }


  return (
    <LinearGradient colors={["#1e1f24", "#23232b"]} style={stylesheet.view1}>
      <StatusBar hidden={false}/>
      <ScrollView>
        <View style={stylesheet.view2}>
          <Image source={logoPath} style={stylesheet.image1} contentFit={'contain'} />

          <View style={stylesheet.view3}>
            <View style={stylesheet.view4}>
              <Text style={stylesheet.text1}>Create Your Account</Text>

            </View>

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
              <Image source={getImage} style={stylesheet.avatar1} contentFit={'contain'} />
            </Pressable>

          </View>

          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput style={stylesheet.input1} inputMode={'tel'} maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }
          } />

          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput style={stylesheet.input1} inputMode={'text'} onChangeText={
            (text) => {
              setFirstName(text);
            }
          }/>

          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput style={stylesheet.input1} inputMode={'text'} onChangeText={
            (text) => {
              setLastName(text);
            }
          } />

          <Text style={stylesheet.text3}>Password</Text>
          <TextInput style={stylesheet.input1} inputMode={'text'} secureTextEntry={true} maxLength={20} onChangeText={
            (text) => {
              setPassword(text);
            }
          } />

          <Pressable style={stylesheet.pressable1} onPress={
            async () => {

              let formData = new FormData();
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
                `${IpAddress}/SignUp`,
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
                  router.replace("/");
                } else {
                  //problem occured
                  Alert.alert("Error", json.message);
                }

              }

            }
          }>
            <FontAwesome6 name={"right-to-bracket"} size={20} color={"black"} />
            <Text style={stylesheet.text5}>Sign Up</Text>
          </Pressable>

          <Pressable style={stylesheet.pressable2} onPress={
            () => {
              router.replace("/");
            }
          }>
            <Text style={stylesheet.text4}>Already Registered? Go to Sign In</Text>
          </Pressable>

          <Footer/>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    rowGap: 10,
  },
  image1: {
    height: 100,
    width: "100%",
    alignSelf: "center",

  },
  input1: {
    width: "100%",
    height: 50,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    paddingStart: 10,
    borderColor: `${WhiteCode}`,
    color:`${WhiteCode}`,
  },
  text1: {
    fontSize: 32,
    color: "#fed47e",
    alignSelf: "center",
    fontFamily: `${TitleFont}`,
  },
  text2: {
    fontSize: 18,
    color: `${WhiteCode}`,
    alignSelf: "center",
    paddingBottom: 10,
    fontFamily: `${TextFont}`,
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
  text4: {
    fontSize: 17,
    fontFamily: `${TextFont}`,
    color: `${WhiteCode}`,
  },
  text5: {
    fontSize: 20,
    fontFamily: `${TextFont}`,
    color: "black",
  },
  pressable2: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
  },
  background1: {
    position: "absolute",
    width: 100,
    height: 100,
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
  view2: {
    flex: 1,
    rowGap: 10,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
  view3: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
  },
  view4: {
    flexDirection: "column",
    flex: 3,
  },
  
});
