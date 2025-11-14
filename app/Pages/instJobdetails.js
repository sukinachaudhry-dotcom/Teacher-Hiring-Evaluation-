import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const instJobdetails = ({ route, navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe && unsubscribe();
  }, []);

  const name = profile?.institutionname || "";
  const website = profile?.website || "";
  const type = profile?.type || "";
  const location = profile?.address || "";
  const hours = profile?.hours || "";
  const jobDescription = profile?.jobDescription || "";
  const yearsRequired = profile?.yearsRequired || "";
  const createdAtYear = profile?.createdAt ? new Date(profile.createdAt).getFullYear() : "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Job Image */}
      {profile?.profileImage ? (
        <Image
          source={{ uri: profile.profileImage }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 15,
            marginBottom: 20,
          }}
        />
      ) : null}

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {name || (loading ? "Loading..." : "")}
      </Text>

      {/*  Info */}
      {!!website && <Text style={{ fontSize: 16, fontWeight: "600", color: "#1a0dab" }}>{website}</Text>}
      {!!type && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <Ionicons name="briefcase-outline" size={18} color="#555" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#555" }}>{type}</Text>
        </View>
      )}
      {!!location && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <Ionicons name="location-outline" size={18} color="#555" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#555" }}>
            Address: {location}
          </Text>
        </View>
      )}
      {!!hours && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="calendar-outline" size={18} color="#555" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#555" }}>
            Operating Hours: {hours}
          </Text>
        </View>
      )}

      {/* Job Requirements */}
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
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Requirements:
        </Text>
        {!!yearsRequired && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="briefcase-outline" size={18} color="#444" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, color: "#444" }}>
              Years Required: {yearsRequired}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {!!jobDescription ? (
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
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Job Description:
          </Text>
          {!!jobDescription && (
            <Text style={{ fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 6 }}>
              {jobDescription}
            </Text>
          )}
        </View>
      ) : null}

      {/* Edit Button */}
      <TouchableOpacity onPress={() => navigation.navigate("EditInstitutionProfile")}
        style={{
          marginTop: 30,
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default instJobdetails;
