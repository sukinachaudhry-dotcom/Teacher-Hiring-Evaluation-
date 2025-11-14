import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const JobDetail = ({ route, navigation }) => {
  const jobId = route?.params?.jobId;
  const [job, setJob] = useState(null);
  const [inst, setInst] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!jobId) return;
        const jref = doc(db, "post jobs", jobId);
        const jsnap = await getDoc(jref);
        if (jsnap.exists()) {
          const jdata = { id: jsnap.id, ...jsnap.data() };
          setJob(jdata);
          if (jdata.institutionId) {
            const iref = doc(db, "users", jdata.institutionId);
            const isnap = await getDoc(iref);
            if (isnap.exists()) setInst(isnap.data());
          }
        }
      } catch {}
    };
    load();
  }, [jobId]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Job Image */}
      {inst?.profileImage ? (
        <Image
          source={{ uri: inst.profileImage }}
          style={{ width: "100%", height: 200, borderRadius: 15, marginBottom: 20 }}
        />
      ) : (
        <Image
          source={require("./School.jpeg")}
          style={{ width: "100%", height: 200, borderRadius: 15, marginBottom: 20 }}
        />
      )}

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {job?.jobTitle || job?.jobVacancy || "Job Details"}
      </Text>

      {/*  Teacher Info */}
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{inst?.institutionname || ""}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Ionicons name="briefcase-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>{inst?.type || "Institute"}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Ionicons name="location-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>
          Location: {job?.location || inst?.address || ""}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="calendar-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>
          Established: {inst?.createdAt ? new Date(inst.createdAt).getFullYear() : ""}
        </Text>
      </View>

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
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <Ionicons name="book-outline" size={18} color="#444" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#444" }}>
            Subject: {job?.subject || "N/A"}
          </Text>
        </View>

        {/* Experience with Icon */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="briefcase-outline" size={18} color="#444" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#444" }}>
            Experience: {job?.experience || "N/A"}
          </Text>
        </View>
      </View>

      {/* Description */}
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
        <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
          {job?.description || ""}
        </Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity onPress={() => navigation.navigate("Submitted")}
        style={{
          marginTop: 30,
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
       
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Apply Now
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default JobDetail;
