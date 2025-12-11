import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UpdateTeacherProfile = ({ navigation, route }) => {
  const profileData = route?.params?.profileData || null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [highestQualification, setHighestQualification] = useState(null);
  const qualificationData = [
    { label: "Bachelor’s (BA / BSc / BS / B.Ed)", value: "bachelors" },
    { label: "Master’s (MA / MSc / MS / M.Ed)", value: "masters" },
    { label: "M.Phil", value: "mphil" },
    { label: "PhD / Doctorate", value: "phd" },
    { label: "Diploma (1–3 Years)", value: "diploma" },
    { label: "Professional Certification (ACCA, CA, CFA)", value: "professional" },
    { label: "IT/Skill Certification (React, Python, AWS, etc.)", value: "it" },

  ];
  const [preferredteachinglevel, setPreferredTeachingLevel] = useState(null);
  const teachingLevelData = [
    { label: "Primary (Grade 1–5)", value: "primary" },
    { label: "Middle (Grade 6–8)", value: "middle" },
    { label: "High School (Grade 9–10)", value: "highschool" },
    { label: "Intermediate (Grade 11–12)", value: "intermediate" },
    { label: "Undergraduate (Bachelor’s Level)", value: "undergrad" },
    { label: "Postgraduate (Master’s/PhD Level)", value: "postgrad" },
    { label: "Professional Courses (IT, Skills, Test Prep)", value: "professional" },
  ];
  const [preferredteachingtype, setPreferredTeachingType] = useState(null);
  const teachingTypeData = [
    { label: "Home Tuition", value: "home" },
    { label: "School/College", value: "school" },
    { label: "Online Classes", value: "online" },
    { label: "Courses", value: "exam" },
  ];

  const [experience, setExperience] = useState("");
  const [teachingsubjects, setTeachingsubjects] = useState(null);
  const subjectsData = [
    { label: "Mathematics", value: "math" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Biology", value: "biology" },
    { label: "English", value: "english" },
    { label: "Computer Science", value: "cs" },
    { label: "Urdu", value: "urdu" },
    { label: "Islamiyat", value: "islamiyat" },
    { label: "Pakistan Studies", value: "pakstudies" },
    { label: "React.js", value: "react" },
    { label: "Node.js", value: "node" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Web Development", value: "webdev" },
    { label: "Mobile App Development", value: "mobiledev" },
    { label: "Machine Learning", value: "ml" },
    { label: "Artificial Intelligence", value: "ai" },
  ];
  const [location, setLocation] = useState(null);
  const locationData = [
    { label: "Lahore", value: "lahore" },
    { label: "Karachi", value: "karachi" },
    { label: "Islamabad", value: "islamabad" },
    { label: "Faisalabad", value: "faisalabad" },
    { label: "Multan", value: "multan" },
    { label: "Peshawar", value: "peshawar" },
    { label: "Quetta", value: "quetta" },
  ];

  // Load existing profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        let data = profileData;
        
        // If profileData not passed, fetch from Firebase
        if (!data) {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser?.uid) {
            const docSnap = await getDoc(doc(db, "users", currentUser.uid));
            if (docSnap.exists()) {
              data = { id: docSnap.id, ...docSnap.data() };
            }
          }
        }

        if (data) {
          // Pre-fill form fields with existing data
          setName(data.fullname || data.name || "");
          setEmail(data.email || "");
          setHighestQualification(data.highestqualification || data.qualification || null);
          setPreferredTeachingLevel(data.preferredteachinglevel || data.teachinglevel || null);
          setPreferredTeachingType(data.preferredteachingtype || data.teachingtype || null);
          setExperience(data.experience || "");
          setTeachingsubjects(data.teachingsubjects || data.subjects || null);
          setLocation(data.location || data.address || null);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, [profileData]);

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
          Update Teacher Profile
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
        {/* Profile Photo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Upload")}
          style={{ alignItems: "center", marginBottom: 20 }}
        >
          <Ionicons name="person-circle-outline" size={80} color="gray" />
          <Text style={{ color: "purple", fontWeight: "bold" }}>Change Photo</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Name
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="person-circle-outline" size={20} color="purple" />
          <TextInput
            value={name}
            onChangeText={(e) => setName(e)}
            placeholder="Enter Name"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Email */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Email
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="mail-outline" size={20} color="purple" />
          <TextInput
            value={email}
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Highest Qualification */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Highest Qualification
        </Text>
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
          <MaterialIcons name="school" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={qualificationData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={highestQualification}
            onChange={(item) => {
              setHighestQualification(item.value);
            }}

          />

        </View>

        {/* Preferred Teaching Level */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Preferred Teaching Level
        </Text>
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
          <Ionicons name="book-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={teachingLevelData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={preferredteachinglevel}
            onChange={(item) => {
              setPreferredTeachingLevel(item.value);
              
              
            }}

          />
        </View>

        {/* Preferred Teaching Type */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Preferred Teaching Type
        </Text>
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
          <Ionicons name="layers-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={teachingTypeData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={preferredteachingtype}
            onChange={(item) => {
              setPreferredTeachingType(item.value);
            }}
          />
        </View>

        {/* Experience */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Experience
        </Text>
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
          <Ionicons name="briefcase-outline" size={20} color="purple" />
          <TextInput
            value={experience}
            onChangeText={setExperience}
            placeholder="Enter Experience"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Teaching Subjects */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Teaching Subjects
        </Text>
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
          <Ionicons name="book" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={subjectsData}
            labelField="label"
            valueField="value"
            placeholder="Select Subject"
            value={teachingsubjects}
            onChange={(item) => {
              setTeachingsubjects(item.value);
            }}
          />
        </View>

        {/* Location */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Location
        </Text>
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
          <Ionicons name="location-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={locationData}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            value={location}
            onChange={(item) => {
              setLocation(item.value);
            }}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={() => {
            // Pass all current form data to EditDocs
            const formData = {
              name,
              email,
              highestQualification,
              preferredteachinglevel,
              preferredteachingtype,
              experience,
              teachingsubjects,
              location,
              profileData: profileData, // Pass original profile data too
            };
            navigation.navigate("EditDocs", { formData, profileData });
          }}
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UpdateTeacherProfile;



// import React from "react";
// import { View, Text, Image, TouchableOpacity } from "react-native";

// export default function ProfileScreen() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         paddingTop: 50,
//         backgroundColor: "#f2f2f2",
//       }}
//     >
//       {/* Teacher Profile Picture */}
//       <Image
//         source={{
//           uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//         }}
//         style={{
//           width: 100,
//           height: 100,
//           borderRadius: 50,
//           marginBottom: 15,
//         }}
//       />

//       {/* Teacher Name & Subject */}
//       <Text style={{ fontSize: 22, fontWeight: "bold", color: "purple" }}>
//         John Doe
//       </Text>
//       <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
//         Mathematics Teacher
//       </Text>

//       {/* Details Section */}
//       <View
//         style={{
//           width: "90%",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           backgroundColor: "#fff",
//           padding: 15,
//           borderRadius: 10,
//           marginBottom: 10,
//           elevation: 2,
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: "bold" }}>Experience:</Text>
//         <Text style={{ fontSize: 16, color: "gray" }}>5 Years</Text>
//       </View>

//       <View
//         style={{
//           width: "90%",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           backgroundColor: "#fff",
//           padding: 15,
//           borderRadius: 10,
//           marginBottom: 10,
//           elevation: 2,
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: "bold" }}>Qualification:</Text>
//         <Text style={{ fontSize: 16, color: "gray" }}>M.Sc. Mathematics</Text>
//       </View>

//       <View
//         style={{
//           width: "90%",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           backgroundColor: "#fff",
//           padding: 15,
//           borderRadius: 10,
//           marginBottom: 10,
//           elevation: 2,
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: "bold" }}>Location:</Text>
//         <Text style={{ fontSize: 16, color: "gray" }}>Lahore, Pakistan</Text>
//       </View>

//       {/* Edit Profile Button */}
//       <TouchableOpacity
//         style={{
//           marginTop: 30,
//           backgroundColor: "purple",
//           padding: 12,
//           borderRadius: 10,
//           width: "60%",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
//           Edit Profile
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }