import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { setRole, setUser } from '../Redux/Slices/HomeDataSlice';
import { logout } from "../Helper/firebaseHelper";
import { getAuth } from "firebase/auth";
import { getDataById } from "../Helper/firebaseHelper";
import { persistor } from '../Redux/Store/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector(state => state.home.user);
    console.log(reduxUser, "reduxUser");
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    // Refetch user data when screen comes into focus (e.g., after profile update)
    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    );

    useEffect(() => {
        // Reset image error when user data changes
        setImageError(false);
    }, [userData]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (user) {
                const userProfile = await getDataById("users", user.uid);
                if (userProfile) {
                    setUserData(userProfile);
                } else {
                    // Fallback to Redux user data
                    setUserData(reduxUser || {});
                }
            } else {
                setUserData(reduxUser || {});
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData(reduxUser || {});
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Show loading indicator
                            setLoading(true);
                            
                            // Step 1: Sign out from Firebase Auth
                            await logout();
                            
                            // Step 2: Clear Redux state
                            dispatch(setRole(""));
                            dispatch(setUser({}));
                            
                            // Step 3: Clear persisted Redux state
                            await persistor.purge();
                            
                            // Step 4: Clear AsyncStorage (additional cleanup)
                            try {
                                await AsyncStorage.clear();
                            } catch (storageError) {
                                console.warn("Error clearing AsyncStorage:", storageError);
                                // Continue with logout even if storage clear fails
                            }
                            
                            // Step 5: Reset local state
                            setUserData(null);
                            setImageError(false);
                            
                            // Step 6: Navigate to login screen with complete reset
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });
                        } catch (error) {
                            console.error("Logout error:", error);
                            setLoading(false);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#d8b4e2' }}>
                <ActivityIndicator size="large" color="purple" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    const displayName = userData?.name || userData?.fullname || userData?.institutionname || "User";
    const displayEmail = userData?.email || "No email";
    // Check all possible profile picture field names used across different user types
    const profileImage = userData?.profilePicUrl || userData?.profileImage || userData?.photoUrl || userData?.photo || null;

    return (
        <ScrollView style={{ backgroundColor: '#d8b4e2', flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 30 }}>
                <View style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 40, 
                    backgroundColor: "white", 
                    justifyContent: "center", 
                    alignItems: "center",
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: "#fff"
                }}>
                    {profileImage && !imageError ? (
                        <Image 
                            source={{ uri: profileImage }} 
                            style={{ width: 80, height: 80, borderRadius: 40 }}
                            onError={() => setImageError(true)}
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="person" size={40} color="#000" />
                    )}
                </View>
                <View style={{ padding: 10, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
                        {displayName}
                    </Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>
                        {displayEmail}
                    </Text>
                </View>
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