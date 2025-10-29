import React from "react";
import { View,ImageBackground, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
const RoleScreen = ({ navigation }) => {
  return (
       <ImageBackground
            source={require("./bg.jpeg")} 
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "purple",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Select Your Role
      </Text>

    
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("StudentSignup")}
      >
        <Ionicons name="school" size={40} color="purple" />
        <Text style={styles.cardText}>I am a Student</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Createprofile")}
      >
        <Ionicons name="person" size={40} color="purple" />
        <Text style={styles.cardText}>I am a Teacher</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("InstitutionProfile")}
      >
        <Ionicons name="business" size={40} color="purple" />
        <Text style={styles.cardText}>I am an Institute</Text>
      </TouchableOpacity>
      </ImageBackground>
   
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    width: "90%",
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "purple",
    marginTop: 10,
  },
};

export default RoleScreen;