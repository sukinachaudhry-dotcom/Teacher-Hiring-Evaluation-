import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useDispatch } from 'react-redux';
import { setRole } from '../Redux/Slices/HomeDataSlice';
import { logout } from "../Helper/firebaseHelper";

const Settings = ({ navigation }) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(setRole(""));
    };

    return (
        <ScrollView style={{ backgroundColor: '#d8b4e2', height: '1000%' }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 30 }}>
                {/* <View style={{ width: '19%', height: 60, borderRadius: 30, backgroundColor: "white", justifyContent: "center", alignItems: "center", }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Upload")}  >
                        <Ionicons name="person" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}> Haya Pectrus</Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>haya12@gmail.com</Text>
                </View> */}

            </View>

            <View
                style={{ backgroundColor: "#fffefeff", borderRadius: 15, paddingVertical: 25 }} >
                

                <TouchableOpacity onPress={() => navigation.navigate("Privacy")} style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="settings-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Privacy Setting</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("PrivacyPolicy")}
                    style={{flexDirection: "row",alignItems: "center",padding: 15,}}
                >
                    <Ionicons name="document-text-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>
                        Privacy Policy
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="gray"style={{ marginLeft: "auto" }}
                    />
                </TouchableOpacity>
                                <TouchableOpacity
                    onPress={() => navigation.navigate("TermAndConditions")}
                    style={{flexDirection: "row",alignItems: "center",padding: 15,}}
                >
                    <Ionicons name="book-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>
                        Term And Conditions
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="gray"style={{ marginLeft: "auto" }}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ChangePass")} style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="shield-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Deleteprofile")} style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="trash-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Delete Account</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="log-out-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Log out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Settings