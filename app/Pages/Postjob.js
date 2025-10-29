import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Postjob() {
  const [jobTitle, setJobTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log({
      jobTitle,
      subject,
      experience,
      jobType,
      salary,
      location,
      description,
    });
    alert("✅ Job Posted Successfully!");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "purple",
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
          borderColor: "purple",
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
          borderColor: "purple",
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
          borderColor: "purple",
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
          borderColor: "purple",
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
          borderColor: "purple",
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
          borderColor: "purple",
          borderRadius: 10,
          padding: 10,
          marginBottom: 15,
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
          borderColor: "purple",
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
        style={{
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Post Job
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
