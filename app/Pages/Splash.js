import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

const SplashScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("./Sp.jpeg")} 
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "black",
          marginBottom: 40,
        }}
      >
 The Teacher Hiring {"\n"} Evaluation App
       </Text>

    
      <Text
        style={{
          fontSize: 16,
          color: "purple",
          marginBottom: 50,
        }}
      >
        Smart Hiring, Smarter Teaching
      </Text>

      
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{
          backgroundColor: "purple", 
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 25,
          marginBottom: 60,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Get Started
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 14,
          color: "#fff",
          position: "absolute",
          bottom: 50,
        }}
      >
        📍 Wherever You Are, Whenever You Need ⏰
      </Text>
    </ImageBackground>
  );
};

export default SplashScreen;