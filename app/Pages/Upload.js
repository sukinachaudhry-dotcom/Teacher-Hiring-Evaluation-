import React, { useState } from "react";
import { View, Text, TouchableOpacity,  ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

import { addData, uploadImageToCloudinary } from "../Helper/firebaseHelper";

export default function Upload() {
  const [imageUrl, setImageUrl] = useState("");
  // const [photo, setPhoto] = useState(null);

  // Dummy function for photo upload
  // const handleUpload = () => {
  //   alert("Upload photo functionality here");
  // };
  const handleSubmit = async () => {

        if ( imageUrl == "") {
            alert("Please fill all fields before submitting.")
            return
        }

        await addData("customer", { imageUrl });
    };
    const handleImagePicker = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType,
                allowsEditing: true,
                quality: 1,
            });


            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const uploadedImageUrl = await uploadImageToCloudinary(imageUri)
                setImageUrl(uploadedImageUrl)
                alert(uploadedImageUrl)
            }


        } catch (error) {

            console.log("Error picking image:", error);

        }
      }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        Upload Your Photo
      </Text>

      {/* Photo Preview */}
                <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: "#d8b4e2",
              justifyContent: "center",
              alignItems: "center",
              marginLeft:93,
              padding:50
            }}
          >
            <Ionicons name="camera-outline" size={40} color="#000" />
          </View>
        
        <Text style={{ marginTop: 10, fontSize: 14, color: "gray",marginLeft:65, padding:10 }}>
          Tap below to upload your photo
        </Text>
      

      {/* Upload Button */}
     
      <TouchableOpacity  onPress={handleImagePicker}      
        style={{
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Upload Photo</Text>
      
      </TouchableOpacity>

      {/* Skip Option */}
      <TouchableOpacity  onPress={() => navigation.navigate("Login")} style={{ alignItems: "center", marginTop: 10 }}>
        <Text style={{ color: "gray", fontSize: 14 }}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
