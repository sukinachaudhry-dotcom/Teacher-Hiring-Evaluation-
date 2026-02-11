import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { doc, getDoc, setDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Alert } from 'react-native';
import { useSelector } from "react-redux";

const JobDetail = ({ route, navigation }) => {
  const jobId = route?.params?.jobId;
  const isHomeTuition = route?.params?.isHomeTuition || false;
  const [job, setJob] = useState(null);
  const [inst, setInst] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const {user  } = useSelector((state)=>state.home)
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
        
        if (isHomeTuition) {
          // Load from hiring requests collection for home tuition jobs
          const jref = doc(db, "hiring requests", jobId);
          const jsnap = await getDoc(jref);
          if (jsnap.exists()) {
            const jdata = { id: jsnap.id, ...jsnap.data() };
            setJob(jdata);
            if (jdata.studentId) {
              const iref = doc(db, "users", jdata.studentId);
              const isnap = await getDoc(iref);
              if (isnap.exists()) setInst(isnap.data());
            }
            // Check if user has already applied
            await checkIfApplied();
          }
        } else {
          // Load from post jobs collection for institution jobs
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
        }
      } catch (error) {
        console.error('Error loading job details:', error);
        Alert.alert('Error', 'Failed to load job details');
      }
    };
    load();
  }, [jobId, isHomeTuition]);

  const handleApply = async () => {
    try {
      console.log('Jobdetails: Starting application process');
      // const user = user.uid ;
      if (!user) {
        console.log('Jobdetails: No user found');
        Alert.alert('Authentication Required', 'Please log in to apply for this job');
        navigation.navigate('Login');
        return;
      }

      if (hasApplied) {
        console.log('Jobdetails: User already applied');
        Alert.alert('Already Applied', `You've already applied for this job. Status: ${applicationStatus}`);
        return;
      }

      setIsApplying(true);
      
      if (isHomeTuition) {
        console.log('Jobdetails: Applying for home tuition job');
        // For home tuition, update the hiring request status
        const hiringRequestRef = doc(db, 'hiring requests', jobId);
        await updateDoc(hiringRequestRef, {
          status: 'Applied',
          teacherId: user.uid,
          teacherName: user.fullname || user.name || 'Teacher',
          teacherPhoto: user.profileImage || user.profilePicUrl || null,
          appliedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        setHasApplied(true);
        setApplicationStatus('Applied');
        
        Alert.alert('Application Successful', 'Your application has been submitted successfully!');
        navigation.goBack();
      } else {
        console.log('Jobdetails: Applying for institution job');
        // For institution jobs, create a new application document
        const applicationRef = doc(collection(db, 'applications'));
        const applicationData = {
          id: applicationRef.id,
          jobId: jobId,
          jobTitle: job.jobTitle || job.jobVacancy,
          institutionId: job.institutionId,
          institutionName: inst?.institutionname || '',
          applicantId: user.uid,
          userId: user.uid,
          status: 'Pending',
          appliedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          jobLocation: job.location || '',
          jobType: job.jobType || 'Full-time',
          salary: job.salary || 'Negotiable'
        };

        console.log('Jobdetails: Creating application with data:', applicationData);
        await setDoc(applicationRef, applicationData);
        console.log('Jobdetails: Application created successfully');

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
      }
      
    } catch (error) {
      console.error('Jobdetails: Error applying for job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Header Section with Image */}
      <View style={{ backgroundColor: "#fff", paddingBottom: 20 }}>
        {inst?.profileImage || inst?.profilePicUrl ? (
        <Image
            source={{ uri: inst.profileImage || inst.profilePicUrl }}
            style={{ width: "100%", height: 250, resizeMode: "cover" }}
        />
      ) : (
          <View style={{ width: "100%", height: 250, backgroundColor: "purple", justifyContent: "center", alignItems: "center" }}>
            <Ionicons name={isHomeTuition ? "person" : "business"} size={80} color="#fff" />
          </View>
        )}
        
        {/* Job Title Card */}
        <View style={{ 
          backgroundColor: "#fff", 
          marginTop: -30, 
          marginHorizontal: 20, 
          borderRadius: 15, 
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1a1a1a", marginBottom: 8 }}>
        {job?.jobTitle || job?.jobVacancy || "Job Details"}
      </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "purple", marginBottom: 12 }}>
            {isHomeTuition ? (job?.studentName || "Student") : (inst?.institutionname || "Institution")}
          </Text>
          
          {/* Quick Info Row */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {isHomeTuition ? (
              <>
                <View style={{ 
                  flexDirection: "row", 
                  alignItems: "center", 
                  backgroundColor: "#f0f0f0",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}>
                  <Ionicons name="home-outline" size={16} color="purple" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, color: "#555", fontWeight: "500" }}>
                    Home Tuition
                  </Text>
                </View>
              </>
            ) : (
              <>
                {inst?.type && (
                  <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    backgroundColor: "#f0f0f0",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}>
                    <Ionicons name="briefcase-outline" size={16} color="purple" style={{ marginRight: 6 }} />
                    <Text style={{ fontSize: 13, color: "#555", fontWeight: "500" }}>
                      {inst.type.charAt(0).toUpperCase() + inst.type.slice(1)}
                    </Text>
          </View>
                )}
              </>
            )}
            {(job?.location || inst?.address) && (
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                backgroundColor: "#f0f0f0",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Ionicons name="location-outline" size={16} color="purple" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 13, color: "#555", fontWeight: "500" }}>
                  {job?.location || inst?.address}
        </Text>
      </View>
            )}
            {job?.salary && (
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                backgroundColor: "#f0f0f0",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Ionicons name="cash-outline" size={16} color="purple" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 13, color: "#555", fontWeight: "500" }}>
                  {job.salary}
        </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Job Details Section */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        {/* Requirements Section */}
      <View style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        elevation: 3,
        }}>
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
              <Ionicons name="document-text-outline" size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1a1a1a" }}>
              Job Requirements
          </Text>
        </View>

          {job?.subject && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 12,
              paddingLeft: 52,
            }}>
              <Ionicons name="book-outline" size={20} color="purple" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Subject</Text>
                <Text style={{ fontSize: 15, color: "#1a1a1a", fontWeight: "500" }}>
                  {job.subject}
                </Text>
              </View>
            </View>
          )}

          {job?.experience && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 12,
              paddingLeft: 52,
            }}>
              <Ionicons name="briefcase-outline" size={20} color="purple" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Experience Required</Text>
                <Text style={{ fontSize: 15, color: "#1a1a1a", fontWeight: "500" }}>
                  {job.experience}
                </Text>
              </View>
            </View>
          )}

          {job?.jobType && (
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              paddingLeft: 52,
            }}>
              <Ionicons name="time-outline" size={20} color="purple" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Job Type / Timing</Text>
                <Text style={{ fontSize: 15, color: "#1a1a1a", fontWeight: "500" }}>
                  {job.jobType}
          </Text>
        </View>
            </View>
          )}

          {job?.requirements && (
            <View style={{ 
              marginTop: 15,
              paddingTop: 15,
              borderTopWidth: 1,
              borderTopColor: "#e0e0e0",
            }}>
              <Text style={{ fontSize: 13, color: "#888", marginBottom: 8, paddingLeft: 52 }}>Detailed Requirements</Text>
              <Text style={{ fontSize: 14, color: "#444", lineHeight: 22, paddingLeft: 52 }}>
                {job.requirements}
              </Text>
            </View>
          )}
      </View>

        {/* Description Section */}
        {job?.description && (
      <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
        elevation: 3,
          }}>
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
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1a1a1a" }}>
                Job Description
              </Text>
            </View>
            <Text style={{ fontSize: 15, color: "#444", lineHeight: 24, paddingLeft: 52 }}>
              {job.description}
        </Text>
          </View>
        )}

        {/* Institution Details */}
        {inst && (
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginBottom: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}>
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
                <Ionicons name="business-outline" size={20} color="#fff" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1a1a1a" }}>
                About Institution
        </Text>
      </View>

            {inst?.email && (
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                marginBottom: 12,
                paddingLeft: 52,
              }}>
                <Ionicons name="mail-outline" size={18} color="purple" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 14, color: "#444" }}>{inst.email}</Text>
              </View>
            )}
            
            {inst?.phonenumber && (
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                marginBottom: 12,
                paddingLeft: 52,
              }}>
                <Ionicons name="call-outline" size={18} color="purple" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 14, color: "#444" }}>{inst.phonenumber}</Text>
              </View>
            )}
            
            {inst?.address && (
              <View style={{ 
                flexDirection: "row", 
                alignItems: "flex-start", 
                paddingLeft: 52,
              }}>
                <Ionicons name="location-outline" size={18} color="purple" style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={{ fontSize: 14, color: "#444", flex: 1 }}>{inst.address}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Apply Button Section */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      <TouchableOpacity 
        onPress={handleApply}
        disabled={isApplying || hasApplied}
        style={{
            backgroundColor: hasApplied 
              ? (applicationStatus === 'Approved' ? '#4CAF50' : applicationStatus === 'Rejected' ? '#F44336' : '#FF9800')
              : 'purple',
            paddingVertical: 18,
            paddingHorizontal: 30,
            borderRadius: 12,
          alignItems: "center",
            justifyContent: "center",
          opacity: isApplying ? 0.7 : 1,
            shadowColor: "purple",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: hasApplied ? 0 : 0.3,
            shadowRadius: 8,
            elevation: hasApplied ? 0 : 5,
            flexDirection: "row",
        }}
      >
        {isApplying ? (
            <>
              <Ionicons name="hourglass-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>Applying...</Text>
            </>
        ) : hasApplied ? (
            <>
              {applicationStatus === 'Approved' && (
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              {applicationStatus === 'Rejected' && (
                <Ionicons name="close-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              {applicationStatus === 'Pending' && (
                <Ionicons name="time-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>
            {applicationStatus === 'Approved' ? 'Application Approved' : 
             applicationStatus === 'Rejected' ? 'Application Rejected' : 
             'Application Submitted'}
          </Text>
            </>
        ) : (
            <>
              <Ionicons name="send-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>Apply Now</Text>
            </>
        )}
      </TouchableOpacity>
        
      {hasApplied && applicationStatus === 'Pending' && (
          <View style={{
            marginTop: 15,
            backgroundColor: "#FFF3E0",
            padding: 15,
            borderRadius: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#FF9800",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Ionicons name="information-circle" size={18} color="#FF9800" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#E65100" }}>
                Application Status
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#666", lineHeight: 18, paddingLeft: 26 }}>
          Your application is under review. We'll notify you once there's an update.
        </Text>
          </View>
      )}
      </View>
    </ScrollView>
  );
};

export default JobDetail;
