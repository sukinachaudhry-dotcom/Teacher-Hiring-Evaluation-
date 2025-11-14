import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { doc, getDoc, setDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Alert } from 'react-native';
import { useSelector } from "react-redux";

const JobDetail = ({ route, navigation }) => {
  const jobId = route?.params?.jobId;
  const [job, setJob] = useState(null);
  const [inst, setInst] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const {user  } = useSelector((state)=>state.home)
  alert (user.uid )
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');

  // Check if user has already applied
  const checkIfApplied = async () => {
    try {
      // const user = user.uid;
      if (!user) return;

      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef,
        where('jobId', '==', jobId),
        where('applicantId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const application = querySnapshot.docs[0].data();
        setHasApplied(true);
        setApplicationStatus(application.status || 'Pending');
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

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
          // Check if user has already applied
          await checkIfApplied();
        }
      } catch (error) {
        console.error('Error loading job details:', error);
        Alert.alert('Error', 'Failed to load job details');
      }
    };
    load();
  }, [jobId]);

  const handleApply = async () => {
    try {
      // const user = user.uid ;
      if (!user) {
        Alert.alert('Authentication Required', 'Please log in to apply for this job');
        navigation.navigate('Login');
        return;
      }

      if (hasApplied) {
        Alert.alert('Already Applied', `You've already applied for this job. Status: ${applicationStatus}`);
        return;
      }

      setIsApplying(true);
      
      // Create a new application document
      const applicationRef = doc(collection(db, 'applications'));
      const applicationData = {
        id: applicationRef.id,
        jobId: jobId,
        jobTitle: job.jobTitle || job.jobVacancy,
        institutionId: job.institutionId,
        institutionName: inst?.institutionname || '',
        applicantId: user.uid,
        status: 'Pending',
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        jobLocation: job.location || '',
        jobType: job.jobType || 'Full-time',
        salary: job.salary || 'Negotiable'
      };

      await setDoc(applicationRef, applicationData);

      setHasApplied(true);
      setApplicationStatus('Pending');
      
      // Navigate to Submitted screen with application data
      navigation.navigate('Submitted', {
        applicationId: applicationRef.id,
        jobTitle: applicationData.jobTitle,
        institutionName: applicationData.institutionName,
        appliedDate: new Date().toLocaleDateString(),
        status: 'Pending'
      });
      
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

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
      <TouchableOpacity 
        onPress={handleApply}
        disabled={isApplying || hasApplied}
        style={{
          marginTop: 30,
          backgroundColor: hasApplied ? '#888' : 'purple',
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          opacity: isApplying ? 0.7 : 1,
        }}
      >
        {isApplying ? (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Applying...</Text>
        ) : hasApplied ? (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {applicationStatus === 'Approved' ? 'Application Approved' : 
             applicationStatus === 'Rejected' ? 'Application Rejected' : 
             'Application Submitted'}
          </Text>
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Apply Now</Text>
        )}
      </TouchableOpacity>
      {hasApplied && applicationStatus === 'Pending' && (
        <Text style={{ marginTop: 10, textAlign: 'center', color: '#555' }}>
          Your application is under review. We'll notify you once there's an update.
        </Text>
      )}
    </ScrollView>
  );
};

export default JobDetail;
