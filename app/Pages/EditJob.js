import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const EditJob = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    jobTitle: "",
    subject: "",
    experience: "",
    jobType: "",
    salary: "",
    location: "",
    requirements: "",
    description: "",
  });

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        if (!jobId) return;
        const ref = doc(db, "post jobs", jobId);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : {};
        if (!active) return;
        setForm((prev) => ({
          ...prev,
          jobTitle: data.jobTitle || "",
          subject: data.subject || "",
          experience: data.experience || "",
          jobType: data.jobType || "",
          salary: String(data.salary ?? ""),
          location: data.location || "",
          requirements: data.requirements || "",
          description: data.description || "",
        }));
      } catch (e) {
        Alert.alert("Error", "Failed to load job");
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [jobId]);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = async () => {
    try {
      const uid = auth?.currentUser?.uid;
      const ref = doc(db, "post jobs", jobId);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};
      if (data.institutionId && uid && data.institutionId !== uid) {
        Alert.alert("Not allowed", "You can only edit your own job");
        return;
      }
      const payload = {
        jobTitle: form.jobTitle,
        subject: form.subject,
        experience: form.experience,
        jobType: form.jobType,
        salary: form.salary,
        location: form.location,
        requirements: form.requirements,
        description: form.description,
        updatedAt: Date.now(),
      };
      await updateDoc(ref, payload);
      Alert.alert("Saved", "Job updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to update job");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
          Edit Job
        </Text>

        {/* Job Title */}
        <Text style={{ fontWeight: "600", marginBottom: 5 }}>Job Title</Text>
        <TextInput
          placeholder="e.g. Math Teacher Required"
          value={form.jobTitle}
          onChangeText={(t) => onChange("jobTitle", t)}
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
          value={form.subject}
          onChangeText={(t) => onChange("subject", t)}
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
          value={form.experience}
          onChangeText={(t) => onChange("experience", t)}
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
          value={form.jobType}
          onChangeText={(t) => onChange("jobType", t)}
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
          value={form.salary}
          onChangeText={(t) => onChange("salary", t)}
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
          value={form.location}
          onChangeText={(t) => onChange("location", t)}
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
          value={form.requirements}
          onChangeText={(t) => onChange("requirements", t)}
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
          value={form.description}
          onChangeText={(t) => onChange("description", t)}
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
          onPress={onSave}
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
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditJob;
