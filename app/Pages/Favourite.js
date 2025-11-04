import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

const teachers = [
  {
    id: "1",
    name: "Annaya",
    subject: "Classroom Teacher",
    availability: "Available for a job or private lessons",
    experience: "+15 Years Exp",
    image: require("./Ali.jpeg"),

   
  },
  {
    id: "2",
    name: "Haya",
    subject: "English",
    availability: "Available for online private lessons",
    experience: "+4 Years Exp",
    image: require("./Ali.jpeg"),
  },
  {
    id: "3",
    name: "Anas",
    subject: "Physics",
    availability: "Available for offline private lessons",
    experience: "+15 Years Exp",
     image: require("./Ali.jpeg"),
  },
  {
    id: "4",
    name: "Ahmad ",
    subject: "Math",
    availability: "Available for offline private lessons",
    experience: "+10 Years Exp",
    image: require("./Ahmed.jpg"),
  },
];

export default function Favourite() {
  const renderTeacher = ({ item }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 8,
        padding: 10,
        elevation: 3,
      }}
    >
      {/* Image + Heart */}
      <View style={{ position: "relative" }}>
        <Image
          source={item.image}
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            resizeMode: "cover",
          }}
        />
        
      </View>

      {/* Name + Subject */}
      <Text style={{ marginTop: 8, fontWeight: "bold" }}>{item.name}</Text>
      <Text style={{ fontWeight: "600" }}>{item.subject}</Text>
      <Text style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
        {item.availability}
      </Text>

      {/* Experience */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        
          
        <Text style={{ fontSize: 12, color: "#555" }}>{item.experience}</Text>
      </View>

      {/* Stars */}
      {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        {[...Array(5)].map((_, i) => (
          <Image
            key={i}
            source={{
              uri: "https://img.icons8.com/ios/50/000000/star--v1.png",
            }}
            style={{ width: 14, height: 14, tintColor: "gray" }}
          />
        ))}
        <Text style={{ marginLeft: 5, fontSize: 12, color: "#555" }}>(0)</Text>
      </View> */}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      {/* Top Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        
        <TextInput
          placeholder="Search..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
          }}
        />
         
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        {["Computer", "Physics", "Chemistry", "Maths"].map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: tab === "Computer,Physics" ? "#d8b4e2" : "#d8b4e2",
            }}
          >
            <Text style={{ color: tab === "Computer" ? "#fff" : "#fff" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Teachers Grid */}
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
