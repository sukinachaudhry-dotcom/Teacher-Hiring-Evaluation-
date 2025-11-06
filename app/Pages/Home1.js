import { Dimensions, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useEffect } from 'react';
import React, { useState } from 'react';
import { getAllData } from '../Helper/firebaseHelper';
const { width } = Dimensions.get("window");



export default function App({ navigation }) {
    const images = [
        "https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg",
        "https://images.pexels.com/photos/5212335/pexels-photo-5212335.jpeg",
        "https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg",
    ];

    const [data, setData] = useState([]);
    const getDataFromDatabase = async () => {

        const cData = await getAllData("categories");  // Firestore se data fetch

        console.log("this is c data", cData);

        setData(cData)

    };
    useEffect(() => {
        getDataFromDatabase();
    }, [])

    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>

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

                {/* Search Bar */}
                <TextInput
                    placeholder="Search Jobs"
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

                {/* Bell Icon */}
                <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
                    <Ionicons name="notifications" size={28} color='#fff' />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => {
                    // navigate to Settings defined in the parent StudentStack
                    navigation.getParent()?.navigate('Settings');
                }} >
                    <Ionicons name="settings" size={28} color='#fff' />

                </TouchableOpacity>
            </View>
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



            {/* Apply For Section */}
            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
                Apply For
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {/* All */}
                {data?.map((item, index) => (
                    <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name={item.icon} size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.title}</Text>
                    </TouchableOpacity>

                ))}
                {/* School / College */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("ClgJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name={item.icon} size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.title}</Text>
                    </TouchableOpacity> */}

                {/* University */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("UniJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="business-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name2}</Text>
                    </TouchableOpacity> */}

                {/* Home Tuition */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("TuitionJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="home-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name3}</Text>
                    </TouchableOpacity> */}

                {/* Courses */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("CoursesJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="book-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name4}</Text>

                    </TouchableOpacity> */}


            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Institution Jobs</Text>
                <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")} >
                    <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Vertical Job List */}
            <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {/* Job Card 1 */}

                <View style={{
                    backgroundColor: "#d8b4e2",
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 15,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    borderWidth: 2,
                    borderColor: "purple"
                }}>

                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Mathematics Teacher Required For Academy</Text>
                    <Text>City School, Lahore</Text>
                    <View style={{ width: 5, height: 5, borderRadius: 10, marginLeft: 110 }}>
                        <Image
                            source={require("./School.jpeg")}
                            style={{ width: 80, height: 80, borderRadius: 10, marginLeft: 100, marginTop: -25 }}
                        />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>47 min ago</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Class: 9th</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Rs. 35,000</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Experience: 5 years</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}  >Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Job Card 2 */}
                <View style={{
                    backgroundColor: "#d8b4e2",
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 15,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    borderWidth: 2,
                    borderColor: "purple"
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Physics Teacher Required</Text>
                    <Text>Science Academy, Karachi</Text>
                    <View style={{ width: 5, height: 5, borderRadius: 10, marginLeft: 110 }}>
                        <Image
                            source={require("./School2.jpeg")}
                            style={{ width: 80, height: 80, borderRadius: 10, marginLeft: 100, marginTop: -25 }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>1 hr ago</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Class: 10th</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Rs. 40,000</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Experience: 3 years</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Private Jobs</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("PrivBrowse")} >
                        <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>
                {/* Home Tuition Job Card */}
                <View style={{
                    backgroundColor: "#d8b4e2",
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 15,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    borderWidth: 2,
                    borderColor: "purple"
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
                        Home Tuition Required for Student
                    </Text>
                    <Text>Haya from Karachi</Text>
                    <View style={{ width: 5, height: 5, borderRadius: 10, marginLeft: 110 }}>
                        <Image
                            source={require("./School2.jpeg")} // Home tuition institute/student image
                            style={{ width: 80, height: 80, borderRadius: 10, marginLeft: 100, marginTop: -25 }}
                        />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>30 min ago</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Class: 8th</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Rs. 25,000</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                        <Text>Experience: 3 years</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                            <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View
                    style={{
                        backgroundColor: "#d8b4e2",
                        borderRadius: 10,
                        padding: 15,
                        marginBottom: 15,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        borderWidth: 2,
                        borderColor: "purple",
                    }}
                >
                    {/* Course Title */}
                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
                        Web Development Course Tutor Required
                    </Text>
                    <Text>Skill Academy, Lahore</Text>

                    {/* Course Image */}
                    <View
                        style={{
                            width: 5,
                            height: 5,
                            borderRadius: 10,
                            marginLeft: 110,
                        }}
                    >
                        <Image
                            source={require("./School.jpeg")}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 10,
                                marginLeft: 100,
                                marginTop: -25,
                            }}
                        />
                    </View>

                    <View
                        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
                    >
                        <Ionicons
                            name="time-outline"
                            size={18}
                            color="black"
                            style={{ marginRight: 6 }}
                        />
                        <Text>1 hr ago</Text>
                    </View>

                    <View
                        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="black"
                            style={{ marginRight: 6 }}
                        />
                        <Text>Duration: 3 Months</Text>
                    </View>

                    <View
                        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
                    >
                        <Ionicons
                            name="cash-outline"
                            size={18}
                            color="black"
                            style={{ marginRight: 6 }}
                        />
                        <Text>Fee: Rs. 40,000</Text>
                    </View>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
                    >
                        <MaterialCommunityIcons
                            name="book-open-page-variant-outline"
                            size={18}
                            color="black"
                            style={{ marginRight: 6 }}
                        />
                        <Text>Course: React Native Development</Text>
                    </View>

                    <View
                        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
                    >
                        <MaterialCommunityIcons
                            name="briefcase-outline"
                            size={18}
                            color="black"
                            style={{ marginRight: 6 }}
                        />
                        <Text>Experience: 2 years</Text>
                    </View>

                    {/* Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")}
                            style={{
                                backgroundColor: "purple",
                                padding: 8,
                                borderRadius: 20,
                                flex: 1,
                                marginRight: 5,
                            }}
                        >
                            <Text
                                style={{ color: "#fff", textAlign: "center", fontSize: 14 }}
                            >
                                Details
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")}
                            style={{
                                backgroundColor: "purple",
                                padding: 8,
                                borderRadius: 20,
                                flex: 1,
                                marginLeft: 5,
                            }}
                        >
                            <Text
                                style={{ color: "#fff", textAlign: "center", fontSize: 14 }}
                            >
                                Chat
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>




        </ScrollView>
    );
}