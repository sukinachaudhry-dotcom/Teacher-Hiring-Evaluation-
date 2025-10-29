import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";

const EditDocs = ({ navigation }) => {
  const [resume, setResume] = useState("MyResume.pdf");
  const [certificates, setCertificates] = useState("TeachingCertificate.png");
  const [availability, setAvailability] = useState(null);
  const availabilityData = [
    { label: "Morning (8am–12pm)", value: "morning" },
    { label: "Afternoon (12pm–4pm)", value: "afternoon" },
    { label: "Evening (4pm–8pm)", value: "evening" },
    { label: "Night (After 8pm)", value: "night" },
    { label: "Weekdays Only", value: "weekdays" },
    { label: "Weekends Only", value: "weekends" },
    { label: "Flexible", value: "flexible" },
  ];
  const [languages, setLanguages] = useState(null);
 const languageData = [
    { label: "English", value: "english" },
    { label: "Urdu", value: "urdu" },
    { label: "French", value: "french" },
    { label: "Spanish", value: "spanish" },
    { label: "Arabic", value: "arabic" },
    
  ];
  const [bio, setBio] = useState("I am a passionate teacher with 3 years of experience...");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      {/* Header */}
      <View
        style={{
          height: 150,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
          Update Documents & Availability
        </Text>
      </View>

      {/* Form */}
      <View
        style={{
          padding: 20,
          marginTop: -20,
          backgroundColor: "white",
          borderRadius: 50,
        }}
      >
        {/* Resume Upload */}
         <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Resume / CV</Text>
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <TouchableOpacity
                    onPress={() => console.log("Upload Document clicked")}
                    style={{
                      flex: 1,
                      backgroundColor: "#d8b4e2",
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      borderRadius: 20,
                      marginRight: 5,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>Upload Document</Text>
                  </TouchableOpacity>
        
                  <TouchableOpacity
                    onPress={() => console.log("Generate AI Resume clicked")}
                    style={{
                      flex: 1,
                      backgroundColor: "#a855f7",
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, flexDirection: "row" }}>Generate AI Resume</Text>
                  </TouchableOpacity>
                </View>

        {/* Certificates */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Certificates</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="medal-outline" size={20} color="purple" />
          <TextInput
            value={certificates}
            onChangeText={setCertificates}
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Availability */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Availability</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="time-outline" size={20} color="purple"  style={{ marginRight: 8 }}/>
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={availabilityData}
            labelField="label"
            valueField="value"
            placeholder="Select Availability"
            value={availability}
            onChange={item => setAvailability(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Languages */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Languages Known</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="language-outline" size={20} color="purple" style={{ marginRight: 8 }} />
           <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={languageData}
            labelField="label"
            valueField="value"
            placeholder="Select Language"
            value={languages}
            onChange={item => setLanguages(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Bio */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Bio / Introduction</Text>
        <View
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={{ height: 80, color: "#999" }}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={() => {
            alert("Profile saved successfully!");
            navigation.navigate("Home1");
          }}
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditDocs;
