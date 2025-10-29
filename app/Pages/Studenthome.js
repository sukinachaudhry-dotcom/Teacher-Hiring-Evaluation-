import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView ,Dimensions,} from 'react-native';
import { Ionicons , MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";


const { width } = Dimensions.get("window");

export default function App({ navigation }) {
    const images = [
        "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg", // School building
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", // Business handshake (hiring)
        "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg", // Teacher teaching in classroom
      ];
    const teachers = [
        { name: "Ali Hassan", subject: "Computer", exp: "+5 Years Exp", desc: "Available for a job or private lessons", img: require("./Ali.jpeg") },
        { name: "Sara Ali", subject: "Chemistry", exp: "+2 Years Exp", desc: "Available for online private lessons", img: require("./Ali.jpeg") },
        { name: "Usman Khan", subject: "Physics", exp: "+7 Years Exp", desc: "Expert in Physics & Mechanics", img: require("./Ali.jpeg") },
        { name: "Ayesha Noor", subject: "Maths", exp: "+4 Years Exp", desc: "Algebra & Calculus Specialist", img: require("./Ali.jpeg") },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1 }}>

                {/* Header */}
                <View
                    style={{
                        backgroundColor: 'purple',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                

                    <TextInput
                        placeholder="Search Teachers"
                        placeholderTextColor="#999"
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginHorizontal: 10,
                            borderRadius: 20,
                            paddingHorizontal: 15,
                            height: 40,
                        }}
                    />

                    <TouchableOpacity>
                        <Ionicons name="notifications" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Settings")} >
                    <Ionicons name="settings" size={28} color='#fff' />

                </TouchableOpacity>
                </View>

                {/* <View style={{ height: 20 }} /> */}
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Carousel
            loop
            width={width}
            height={150}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: 340, height: "100%", borderRadius: 22, alignSelf: "center", marginTop: 5 }}
                resizeMode="cover"
              />
            )}
          />
        </View>

                {/* Learning System Section */}
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
                    Learning System
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {/* Computer */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <Ionicons name="laptop-outline" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Computer</Text>
            </View>
          </TouchableOpacity>

          {/* Physics */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="atom" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Physics</Text>
            </View>
          </TouchableOpacity>
          {/* Chemistry */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="test-tube" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Chemistry</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="calculator" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Math</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="dna" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Biology</Text>
            </View>
          </TouchableOpacity>

          {/* Islamiyat */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="mosque" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Islamiyat</Text>
            </View>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="history" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>History</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

                {/* Popular Teachers Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Popular Teachers</Text>
                    <Text onPress={() => navigation.navigate("Viewall")}
                        style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                </View>

                {/* Teacher Cards Grid (2 per row) */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                    {teachers.map((teacher, index) => (
                        <View
                            key={index}
                            style={{
                                width: "48%",
                                backgroundColor: '#d8b4e2',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 15,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                                borderWidth: 2,
                                borderColor: "purple"
                            }}
                        >
                            <Image
                                source={teacher.img}
                                style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
                            />
                            <Text style={{ marginTop: 5, fontWeight: 'bold', textAlign: "center" }}>{teacher.name}</Text>
                            <Text style={{ marginTop: 2, fontWeight: 'bold', textAlign: "center" }}>{teacher.subject}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.desc}</Text>
                            <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.exp}</Text>

                            {/* Buttons */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
                                    onPress={() => navigation.navigate("Studentviewprofile")}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
                                    onPress={() => navigation.navigate("Chat")}
                                >
                                    <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
