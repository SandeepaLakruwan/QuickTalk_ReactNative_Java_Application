import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { BlackCode, BlackGreenCode, GreenCode, IpAddress, TextBoldFont, TextFont, TitleFont, WhiteCode, YellowCode } from '../Context';
import { Footer } from '../components/Footer';
import { registerRootComponent } from 'expo';
import { ChatHeader } from '../components/ChatHeader';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function home() {

  const [getChatArray, setChatArray] = useState([]);

  const [getSearch, setSearch] = useState("");

  const [loaded, error] = useFonts(
    {
      "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
      "OpenSans_SemiCondensed-Regular": require("../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
      "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    }
  );

  useEffect(
    () => {
      async function fetchData() {

        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        let response = await fetch(`${IpAddress}/LoadChatList?id=${user.id}&text=${getSearch}`);

        if (response.ok) {
          let json = await response.json();

          if (json.status) {
            let chatArray = json.jsonChatArray;
            setChatArray(chatArray);
          }
        }
      }
      fetchData();
    }, [getSearch]
  );

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
      <StatusBar hidden={false} />
      <ChatHeader name={"Find"}/>

      <View style={stylesheet.view4}>
        <TextInput style={stylesheet.input1} onChangeText={
          (text) => {
            setSearch(text);
          }
        } />
        <View>
          <FontAwesome6 name={"magnifying-glass"} size={25} color={"white"} />
        </View>
      </View>

      <View style={stylesheet.scrollView2}>

        <FlashList
          data={getChatArray}
          renderItem={
            ({ item }) =>
              item.other_user_status == 1 ?
                (<Pressable style={stylesheet.view9} onPress={
                  () => {
                    router.push(
                      {
                        pathname: "/chat",
                        params: item
                      }
                    );
                  }
                }>
                  {item.avatar_image_found ?
                    <Image source={`${IpAddress}/avatar_images/${item.other_user_mobile}.png`} style={stylesheet.photo1} contentFit={'contain'} />
                    :
                    <View style={stylesheet.view10}>
                      <Text style={stylesheet.text7}>{item.other_user_avatar_letters}</Text>
                    </View>
                  }
                </Pressable>)
                : null
          }
          estimatedItemSize={200}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={stylesheet.view11}>
        <FlashList
          data={getChatArray}
          renderItem={
            ({ item }) =>
                <Pressable style={stylesheet.view5} onPress={
                  () => {
                    router.push(
                      {
                        pathname: "/chat",
                        params: item
                      }
                    );
                  }
                }>
                  <View style={item.other_user_status == 1 ? stylesheet.view6_2 : stylesheet.view6_1}>
                    {item.avatar_image_found ?
                      <Image source={`${IpAddress}/avatar_images/${item.other_user_mobile}.png`} style={stylesheet.image1} contentFit={'contain'} />
                      :
                      <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                    }
                  </View>

                  <View style={stylesheet.view8}>
                    <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text4} numberOfLines={1}>{item.message}</Text>
                    <View style={stylesheet.view7}>
                      {item.unseenMessage == true ? <Text style={stylesheet.text8}>New</Text> : null}
                      <Text style={stylesheet.text5}>{item.dateTime}</Text>
                      {item.messageUser == true ? (item.chat_status_id == 1 ?
                        <FontAwesome6 name={"check-double"} size={20} color={"green"} />
                        : <FontAwesome6 name={"check"} size={20} color={"white"} />
                      ) : null}
                    </View>
                  </View>
                </Pressable>

          }
          estimatedItemSize={200}
        />
      </View>
      <View style={stylesheet.view12}>
        <View style={stylesheet.view13}>
          <Pressable onPress={
            () => {
              router.replace("/home");
            }
          }>
            <FontAwesome6 name={"house"} size={25} color={"black"} />
          </Pressable>
        </View>
        <View style={stylesheet.view13}>
        <Pressable style={stylesheet.pressable2} onPress={
            () => {
              router.replace("/userlist");
            }
          }>
            <FontAwesome6 name={"magnifying-glass"} size={25} color={"black"} />
          </Pressable>
        </View>
        <View style={stylesheet.view13}>
        <Pressable onPress={
            () => {
              router.push("/profile");
            }
          }>
            <FontAwesome6 name={"user"} size={25} color={"black"} />
          </Pressable>
        </View>
      </View>

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
  input1: {
    height: 40,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    fontFamily: "",
    fontSize: 18,
    flex: 1,
    paddingStart: 5,
    borderColor: `${WhiteCode}`,
    color:`${WhiteCode}`,
  },
  view2: {
    flex: 1,
    rowGap: 10,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  scrollView: {
    flex: 1,
    marginVertical: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  view3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "red",
    marginHorizontal: 10,
  },
  view4: {
    flexDirection: "row",
    columnGap: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    margin: 5,
    marginTop: 15,
  },
  scroll_view: {
    height: 100,
  },
  view5: {
    flexDirection: "row",
    columnGap: 10,
    padding: 10,
    borderRadius: 5,
    margin: 3,
    backgroundColor: `${BlackGreenCode}`
  },
  view6_1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${WhiteCode}`,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: `${YellowCode}`,
    justifyContent: "center",
    alignItems: "center",
  },
  view6_2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${WhiteCode}`,
    borderStyle: "solid",
    borderWidth: 6,
    borderColor: `${GreenCode}`,
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    fontFamily: `${TitleFont}`,
    fontSize: 20,
    color: `${YellowCode}`
  },
  text4: {
    fontFamily: `${TextBoldFont}`,
    fontSize: 16,
    color: `${WhiteCode}`
  },
  text5: {
    fontFamily: `${TextFont}`,
    fontSize: 14,
    color: `${WhiteCode}`
  },
  scrollview1: {
    marginTop: 30,
  },
  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text6: {
    fontSize: 20,
    fontFamily: `${TitleFont}`,
    color: `${BlackCode}`
  },
  text7: {
    fontSize: 20,
    fontFamily: `${TitleFont}`,
    color: `${WhiteCode}`,
    alignSelf: "center",
  },
  image1: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
  view8: {
    flex: 1,
  },
  scrollView2: {
    columnGap: 10,
    flexDirection: "row",
    height: 80,
    width: "100%",
  },
  view9: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
  photo1: {
    width: 50,
    height: 50,
    borderColor: `${GreenCode}`,
    borderRadius: 50,
    borderWidth: 2,
  },
  view10: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: `${GreenCode}`,
  },
  view11: {
    flex: 1,
    width: "100%",
  },
  text8: {
    fontFamily: `${TextFont}`,
    fontSize: 12,
    color: `${GreenCode}`
  },
  view12: {
    alignSelf: "flex-end",
    flexDirection: "row",
    backgroundColor: "#b3a16b",
    borderRadius: 30,
    width: "100%",
    height: 70,
  },
  view13: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressable2:{
    height:60,
    width:60,
    borderRadius:30,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#d4c392",
  }

});
