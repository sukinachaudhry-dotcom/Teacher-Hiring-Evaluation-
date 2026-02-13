import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import { getAuth } from "firebase/auth";
import { getDataById } from "../Helper/firebaseHelper";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function Viewprofile({ navigation, route }) {
  const { institutionId } = route?.params || {};
  const reduxUser = useSelector(state => state.home.user);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user ID
  const getCurrentUserId = () => {
    if (institutionId) {
      return institutionId; // Viewing other user's profile
    }
    // Viewing own profile - get from auth or Redux
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser?.uid || reduxUser?.uid || reduxUser?.id;
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    
    if (userId) {
      // Set up real-time listener for profile updates
      const unsubscribe = onSnapshot(
        doc(db, "users", userId),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            // Debug: Log bio/introduction fields
            console.log("Profile data loaded:", {
              introduction: data.introduction,
              description: data.description,
              about: data.about,
              bio: data.bio
            });
            setProfileData(data);
            setLoading(false);
          } else {
            // If document doesn't exist, try Redux data
            if (reduxUser && Object.keys(reduxUser).length > 0) {
              setProfileData(reduxUser);
            }
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching profile:", error);
          // Fallback to Redux data
          if (reduxUser && Object.keys(reduxUser).length > 0) {
            setProfileData(reduxUser);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // No user ID - try Redux data
      if (reduxUser && Object.keys(reduxUser).length > 0) {
        setProfileData(reduxUser);
      }
      setLoading(false);
    }
  }, [institutionId]);

  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const userId = getCurrentUserId();
      if (userId) {
        fetchProfile(userId);
      }
    }, [institutionId])
  );

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await getDataById("users", userId);
      if (data) {
        setProfileData(data);
      } else if (reduxUser && Object.keys(reduxUser).length > 0) {
        // Fallback to Redux
        setProfileData(reduxUser);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to Redux
      if (reduxUser && Object.keys(reduxUser).length > 0) {
        setProfileData(reduxUser);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>Profile not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, marginTop: 20 }}
        >
          <Text style={{ color: "#fff" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileImage = profileData.profileImage || profileData.profilePicUrl || profileData.photoUrl || profileData.photo;
  const coverImage = profileData.coverImage || profileImage;
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header Section with Profile Picture */}
      <View style={{ backgroundColor: "purple", paddingBottom: 80 }}>
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={{ width: "100%", height: 200, resizeMode: "cover" }}
          />
        ) : (
          <View style={{ width: "100%", height: 200, backgroundColor: "purple" }} />
        )}
        
        {/* Profile Picture Card */}
        <View style={{ 
          alignItems: "center",
          marginTop: -70,
        }}>
          {profileImage ? (
        <Image
              source={{ uri: profileImage }}
          style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 5,
            borderColor: "#fff",
            backgroundColor: "#eee",
          }}
        />
          ) : (
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 5,
                borderColor: "#fff",
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="person" size={70} color="purple" />
            </View>
          )}
        </View>
      </View>

      {/* Basic Info */}
      <View style={{ alignItems: "center", marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1a1a1a", marginBottom: 4 }}>
          {profileData.name || profileData.fullname || "Teacher"}
        </Text>
        
        {profileData.teachingsubjects && (
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginTop: 4,
            backgroundColor: "#f8f8f8",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20
          }}>
            <Ionicons name="book-outline" size={16} color="purple" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 15, color: "#444", fontWeight: "500" }}>
              {profileData.teachingsubjects}
        </Text>
          </View>
        )}
        
        {profileData.location && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <Ionicons name="location-outline" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 13, color: "#666" }}>
              {profileData.location}
        </Text>
          </View>
        )}
      </View>

      {/* Teacher Details */}
      <View style={{ paddingHorizontal: 20, marginTop: 25 }}>
      <View
        style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: "purple", 
              justifyContent: "center", 
              alignItems: "center",
              marginRight: 12,
            }}>
              <Ionicons name="person-outline" size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1a1a1a" }}>
              Teacher Information
        </Text>
          </View>
          
          {profileData.email && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 12,
              paddingLeft: 52,
            }}>
              <Ionicons name="mail-outline" size={18} color="purple" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 14, color: "#444" }}>{profileData.email}</Text>
            </View>
          )}
          
          {profileData.phonenumber && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 12,
              paddingLeft: 52,
            }}>
              <Ionicons name="call-outline" size={18} color="purple" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 14, color: "#444" }}>{profileData.phonenumber}</Text>
            </View>
          )}
          
          {(profileData.address || profileData.location) && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "flex-start", 
              paddingLeft: 52,
            }}>
              <Ionicons name="location-outline" size={18} color="purple" style={{ marginRight: 10, marginTop: 2 }} />
              <Text style={{ fontSize: 14, color: "#444", flex: 1 }}>
                {profileData.address || profileData.location}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      {(profileData.experience || profileData.qualification) && (
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
        }}
      >
            {profileData.experience && (
        <View
          style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 15,
            alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Ionicons name="briefcase" size={24} color="purple" />
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8, color: "#1a1a1a" }}>
                  {profileData.experience}
                </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 4, textAlign: "center" }}>
                  Experience
          </Text>
        </View>
            )}

            {profileData.qualification && (
        <View
          style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 15,
            alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Ionicons name="school" size={24} color="purple" />
                <Text style={{ fontSize: 14, fontWeight: "600", marginTop: 8, color: "#1a1a1a", textAlign: "center" }}>
                  {profileData.qualification}
          </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 4, textAlign: "center" }}>
                  Qualification
          </Text>
        </View>
            )}
          </View>
        </View>
      )}

      {/* About Section */}
      {(() => {
        const aboutText = profileData.introduction || profileData.description || profileData.about || profileData.bio;
        return aboutText && aboutText.trim() ? (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: "purple", 
                  justifyContent: "center", 
                  alignItems: "center",
                  marginRight: 12,
                }}>
                  <Ionicons name="information-circle-outline" size={20} color="#fff" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1a1a1a" }}>
                  About
            </Text>
              </View>
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 22, paddingLeft: 52 }}>
                {aboutText}
            </Text>
          </View>
        </View>
        ) : null;
      })()}

      {/* Additional Information */}
      <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 30 }}>
      <View
        style={{
          backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <View style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: "purple", 
              justifyContent: "center", 
              alignItems: "center",
              marginRight: 12,
            }}>
              <Ionicons name="list-outline" size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1a1a1a" }}>
              Additional Information
        </Text>
      </View>

          {/* Bio/Description/Introduction */}
          {(() => {
            const bioText = profileData.introduction || profileData.description || profileData.about || profileData.bio;
            // Debug log
            if (bioText) {
              console.log("Bio text found in Additional Information:", bioText);
            }
            return bioText && typeof bioText === 'string' && bioText.trim().length > 0 ? (
              <View style={{ 
                marginBottom: 15,
                paddingLeft: 52,
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0"
              }}>
                <Text style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
                  Bio / Introduction
                </Text>
                <Text style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 20 }}>
                  {bioText.trim()}
                </Text>
              </View>
            ) : null;
          })()}
          
          {Object.keys(profileData).map((key) => {
            // Skip internal fields and already displayed fields
            const skipFields = ['id', 'uid', 'email', 'phonenumber', 'address', 'location', 'institutionname', 'fullname', 'name', 'type', 'subjects', 'teachingsubjects', 'description', 'about', 'bio', 'introduction', 'profileImage', 'profileimage', 'profilepicurl', 'profilepic', 'photoUrl', 'photourl', 'photo', 'coverImage', 'coverimage', 'experience', 'qualification', 'established', 'createdAt', 'updatedAt', 'role', 'password', 'confirmpassword', 'confirmPassword', 'confirm_password', 'profile_pic', 'profile_pic_url', 'profile_url'];
            const keyLower = key.toLowerCase();
            if (skipFields.includes(keyLower) || keyLower.includes('password') || keyLower.includes('created') || keyLower.includes('updated') || !profileData[key] || typeof profileData[key] === 'object') {
              return null;
            }
            return (
              <View key={key} style={{ 
                marginTop: 12,
                paddingLeft: 52,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0"
              }}>
                <Text style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
                <Text style={{ fontSize: 14, color: "#1a1a1a", fontWeight: "500" }}>
                  {String(profileData[key])}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Edit Profile Button - Only show when viewing own profile */}
      {!institutionId && (
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <TouchableOpacity
            onPress={() => {
              const userRole = profileData?.role || reduxUser?.role;
              if (userRole === 'Institution') {
                navigation.navigate('EditInstitutionProfile', { profileData });
              } else {
                navigation.navigate('EditProfile', { profileData });
              }
            }}
        style={{
              backgroundColor: "purple",
              paddingVertical: 16,
              borderRadius: 12,
          flexDirection: "row",
          justifyContent: "center",
              alignItems: "center",
              shadowColor: "purple",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
      )}
    </ScrollView>
  );
}

