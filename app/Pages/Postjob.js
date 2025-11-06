import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { addData } from "../Helper/firebaseHelper";

export default function Postjob() {
  const navigation = useNavigation();
  
  // State variables to store form data
  const [jobTitle, setJobTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle job posting
  const handleSubmit = async () => {
    // Step 1: Validate that all required fields are filled
    if (!jobTitle || !subject || !experience || !jobType || !salary || !location || !description || !requirements) {
      Alert.alert("Error", "Please fill all fields before posting.");
      return;
    }

    try {
      // Step 2: Show loading state
      setLoading(true);

      // Step 3: Get the current logged-in institution's ID
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to post a job.");
        setLoading(false);
        return;
      }

      // Get institution ID (uid)
      const institutionId = currentUser.uid;

      // Step 4: Prepare job data to save in Firestore
      const jobData = {
        // Institution ID - This is REQUIRED and will identify which institution posted this job
        institutionId: institutionId,
        
        // All job information from the form
        jobTitle: jobTitle,
        subject: subject,
        experience: experience,
        jobType: jobType,
        salary: salary,
        location: location,
        description: description,
        requirements: requirements,
        
        // Additional metadata
        createdAt: new Date().toISOString(), // When the job was posted
        status: "active", // Job status (active, closed, etc.)
      };

      // Step 5: Save job data to Firestore collection "post jobs"
      // This will create a new document in the "post jobs" collection
      const docId = await addData("post jobs", jobData);

      if (docId) {
        // Step 6: Show success message
        Alert.alert("Success", "✅ Job Posted Successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Step 7: Navigate back to home page
              navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert("Error", "Failed to post job. Please try again.");
      }
    } catch (error) {
      // Handle any errors
      console.error("Error posting job:", error);
      Alert.alert("Error", error.message || "Something went wrong. Please try again.");
    } finally {
      // Step 8: Hide loading state
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "Black",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Post a New Job
      </Text>

      {/* Job Title */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Job Title</Text>
      <TextInput
        placeholder="e.g. Math Teacher Required"
        value={jobTitle}
        onChangeText={setJobTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Subject */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Subject</Text>
      <TextInput
        placeholder="e.g. Physics, English"
        value={subject}
        onChangeText={setSubject}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Experience */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
        Experience Required
      </Text>
      <TextInput
        placeholder="e.g. 2+ Years"
        value={experience}
        onChangeText={setExperience}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Job Type */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Job Type</Text>
      <TextInput
        placeholder="e.g. Full-time / Part-time / Online"
        value={jobType}
        onChangeText={setJobType}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Salary */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Salary Range</Text>
      <TextInput
        placeholder="e.g. 40,000 - 60,000 PKR"
        value={salary}
        onChangeText={setSalary}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Location */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Location</Text>
      <TextInput
        placeholder="e.g. Lahore / Online"
        value={location}
        onChangeText={setLocation}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
        }}
      />
      {/* Requirements */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Requirements</Text>
      <TextInput
        placeholder="List required qualifications, skills, etc."
        value={requirements}
        onChangeText={setRequirements}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          height: 70,
          marginBottom: 20,
          textAlignVertical: "top",
        }}
      />

      {/* Description */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>Description</Text>
      <TextInput
        placeholder="Enter job details here..."
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 10,
          height: 100,
          marginBottom: 20,
          textAlignVertical: "top",
        }}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {loading ? "Posting Job..." : "Post Job"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
