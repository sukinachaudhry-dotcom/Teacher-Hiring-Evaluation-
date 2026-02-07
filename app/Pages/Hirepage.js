// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

// export default function HirePage() {
//   // 👉 yeh status backend/API se aayega
//   const [status, setStatus] = useState("rejected");
//   // options: "pending" | "accepted" | "rejected"

//   useEffect(() => {
//     // Example: future me API call yahan se hoga
//     // setStatus("accepted") ya setStatus("rejected")
//   }, []);

//   const getStatusMessage = () => {
//     if (status === "pending") {
//       return "⏳ Your request has been sent. Waiting for teacher's response...";
//     } else if (status === "accepted") {
//       return "🎉 Congratulations! Your request has been accepted by the teacher.";
//     } else if (status === "rejected") {
//       return "❌ Sorry, your request was rejected by the teacher.";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         {/* Teacher Info */}
//         <View style={styles.teacherBox}>
//           <Image source={require("./Ali.jpeg")} style={styles.avatar} />
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.name}>Ahmed</Text>
//             <Text style={styles.subject}>Computer Science Teacher</Text>
//             <Text style={styles.school}>Progressive Public School</Text>
//           </View>
//         </View>

//         {/* Status Box */}
//         <View style={styles.statusBox}>
//           <Text style={styles.statusText}>{status.toUpperCase()}</Text>
//           <Text style={styles.message}>{getStatusMessage()}</Text>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.btnRow}>
//           {status === "pending" && (
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: "purple" }]}
//               onPress={() => alert("Request cancelled")}
//             >
//               <Text style={styles.btnText}>Cancel Request</Text>
//             </TouchableOpacity>
//           )}

//           {status === "accepted" && (
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: "purple" }]}
//               onPress={() => alert("Opening chat with teacher...")}
//             >
//               <Text style={styles.btnText}>Go to Chat</Text>
//             </TouchableOpacity>
//           )}

//           {status === "rejected" && (
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: "purple" }]}
//               onPress={() => alert("Sending new request...")}
//             >
//               <Text style={styles.btnText}>Send New Request</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#d8b4e2", // soft purple background
//     justifyContent: "center", // center vertically
//     alignItems: "center", // center horizontally
//     padding: 20,
//   },
//   card: {
//     width: "95%",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     elevation: 5,
//   },
//   teacherBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     backgroundColor: "#f3e8ff",
//     borderRadius: 12,
//     padding: 12,
//     elevation: 3,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: "purple",
//   },
//   name: { fontSize: 18, fontWeight: "bold", color: "#000" },
//   subject: { fontSize: 14, color: "purple", marginTop: 4 },
//   school: { fontSize: 12, color: "#666", marginTop: 2 },

//   statusBox: {
//     padding: 15,
//     borderWidth: 2,
//     borderColor: "purple",
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   statusText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 6,
//     textAlign: "center",
//     color: "purple",
//   },
//   message: { fontSize: 14, color: "#444", textAlign: "center" },

//   btnRow: {
//     alignItems: "center",
//     marginTop: 15,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 25,
//     elevation: 2,
//     width: "70%",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: { color: "white", fontSize: 16, fontWeight: "600" },
// });

//2nd
// 
//3rd
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const HirePage = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 🔹 Dummy data instead of Firestore fetch
//     const dummyTeachers = [
//       {
//         id: "t1",
//         teacherName: "Sir Ahmed Khan",
//         subject: "Mathematics",
//         hireDate: "2025-11-01",
//         status: "Active",
//         teacherProfilePic:
//           "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//       },
//       {
//         id: "t2",
//         teacherName: "Miss Sana Malik",
//         subject: "English Literature",
//         hireDate: "2025-10-25",
//         status: "Completed",
//         teacherProfilePic:
//           "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
//       },
//       {
//         id: "t3",
//         teacherName: "Sir Bilal Qureshi",
//         subject: "Physics",
//         hireDate: "2025-09-18",
//         status: "Active",
//         teacherProfilePic:
//           "https://cdn-icons-png.flaticon.com/512/145/145867.png",
//       },
//     ];

//     // Simulate loading time
//     setTimeout(() => {
//       setTeachers(dummyTeachers);
//       setLoading(false);
//     }, 1500);
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#007BFF" />
//         <Text>Loading your teachers...</Text>
//       </View>
//     );
//   }

//   if (teachers.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Ionicons name="school-outline" size={50} color="gray" />
//         <Text style={{ marginTop: 10 }}>You haven’t hired any teachers yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={teachers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.card}>
//             <Image
//               source={{
//                 uri:
//                   item.teacherProfilePic ||
//                   "https://via.placeholder.com/100",
//               }}
//               style={styles.image}
//             />
//             <View style={styles.info}>
//               <Text style={styles.name}>{item.teacherName}</Text>
//               <Text style={styles.subject}>{item.subject}</Text>
//               <Text style={styles.date}>Hired on: {item.hireDate}</Text>
//               <Text
//                 style={[
//                   styles.status,
//                   { color: item.status === "Active" ? "green" : "gray" },
//                 ]}
//               >
//                 {item.status}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default HirePage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#f2f2f2",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   image: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 10,
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   subject: {
//     color: "#555",
//   },
//   date: {
//     fontSize: 12,
//     color: "#888",
//   },
//   status: {
//     marginTop: 4,
//     fontWeight: "bold",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

//4th

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import { addData, getOrCreateConversation, getDataById } from "../Helper/firebaseHelper";

const HirePage = () => {
  const [hiringRequests, setHiringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch hiring requests for this student
    const q = query(
      collection(db, "hiring requests"),
      where("studentId", "==", user.uid)
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requests = [];
      
      // Fetch teacher details for each request
      for (const docSnap of snapshot.docs) {
        const requestData = docSnap.data();
        
        // Fetch teacher details from users collection
        let teacherData = null;
        if (requestData.teacherId) {
          try {
            const teacherDoc = await getDoc(doc(db, "users", requestData.teacherId));
            if (teacherDoc.exists()) {
              teacherData = teacherDoc.data();
            }
          } catch (error) {
            console.error("Error fetching teacher data:", error);
          }
        }

        requests.push({
          id: docSnap.id,
          ...requestData,
          teacherData: teacherData,
          teacherName: requestData.teacherName || teacherData?.name || "Teacher",
          teacherSubject: requestData.teacherSubject || teacherData?.teachingsubjects || "",
          teacherLocation: requestData.teacherLocation || teacherData?.location || "",
          teacherPhoto: teacherData?.photoUrl || teacherData?.profileImage || null,
        });
      }

      // Sort by createdAt (most recent first)
      requests.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setHiringRequests(requests);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching hiring requests:", error);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "#4CAF50"; // Green
      case "rejected":
        return "#F44336"; // Red
      case "pending":
        return "purple"; // Purple
      default:
        return "#757575"; // Gray
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "Accepted ✓";
      case "rejected":
        return "Rejected ✗";
      case "pending":
        return "Pending ⏳";
      default:
        return status || "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handleCancelRequest = async (requestId, teacherName, requestData) => {
    if (!requestId) {
      Alert.alert("Error", "Request ID is missing");
      return;
    }

    Alert.alert(
      "Cancel Request",
      `Are you sure you want to cancel the hiring request for ${teacherName}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancellingId(requestId);
              console.log("Cancelling request:", requestId);
              
              const user = auth.currentUser;
              if (!user) {
                Alert.alert("Error", "User not logged in");
                setCancellingId(null);
                return;
              }

              // Get request data before deleting
              const requestDocRef = doc(db, "hiring requests", requestId);
              const requestDoc = await getDoc(requestDocRef);
              
              if (!requestDoc.exists()) {
                Alert.alert("Error", "Request not found");
                setCancellingId(null);
                return;
              }

              const requestInfo = requestDoc.data();
              const teacherId = requestInfo.teacherId;
              const studentName = requestInfo.studentName || "Student";

              console.log("Request info:", { teacherId, studentName, requestId });

              // Delete the hiring request first
              await deleteDoc(requestDocRef);
              console.log("Request deleted successfully");

              // Create notification for teacher about cancellation
              if (teacherId) {
                try {
                  const notificationData = {
                    userId: teacherId, // Teacher's user ID
                    type: "request_cancelled",
                    title: "Request Cancelled",
                    message: `${studentName} has cancelled the hiring request`,
                    requestId: requestId,
                    studentId: user.uid,
                    studentName: studentName,
                    teacherId: teacherId,
                    teacherName: requestInfo.teacherName || "Teacher",
                    read: false,
                    createdAt: new Date().toISOString(),
                  };
                  await addData("notifications", notificationData);
                  console.log("Notification created for teacher");
                } catch (notifError) {
                  console.error("Error creating notification:", notifError);
                  // Continue even if notification fails
                }
              }

              // Clean up related notifications for teacher (optional)
              if (teacherId) {
                try {
                  const notificationsQuery = query(
                    collection(db, "notifications"),
                    where("userId", "==", teacherId),
                    where("requestId", "==", requestId),
                    where("type", "==", "hiring_request")
                  );
                  const notificationsSnapshot = await getDocs(notificationsQuery);
                  if (!notificationsSnapshot.empty) {
                    const deletePromises = notificationsSnapshot.docs.map((notifDoc) =>
                      deleteDoc(doc(db, "notifications", notifDoc.id))
                    );
                    await Promise.all(deletePromises);
                    console.log("Related notifications cleaned up");
                  }
                } catch (cleanupError) {
                  console.error("Error cleaning up notifications:", cleanupError);
                  // Don't fail the whole operation if notification cleanup fails
                }
              }

              setCancellingId(null);
              Alert.alert("Success", "Hiring request cancelled successfully. Teacher has been notified.");
            } catch (error) {
              console.error("Error cancelling request:", error);
              console.error("Error details:", error.message, error.code);
              setCancellingId(null);
              Alert.alert(
                "Error",
                `Failed to cancel request: ${error.message || "Please try again."}`
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Loading your teachers...</Text>
      </View>
    );
  }

  if (hiringRequests.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="school-outline" size={50} color="gray" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>
          You haven't sent any hiring requests yet.
        </Text>
        <Text style={{ marginTop: 5, fontSize: 14, color: "#999" }}>
          Send a request to a teacher to see it here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hiringRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Studentviewprofile", { teacherId: item.teacherId })}
          >
            <Image
              source={
                item.teacherPhoto
                  ? { uri: item.teacherPhoto }
                  : require("./Ali.jpeg")
              }
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.teacherName}</Text>
              <Text style={styles.subject}>{item.teacherSubject || "Subject not specified"}</Text>
              {item.teacherLocation && (
                <Text style={styles.location}>📍 {item.teacherLocation}</Text>
              )}
              <Text style={styles.date}>Request sent: {formatDate(item.createdAt)}</Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
                {item.status?.toLowerCase() === "pending" && (
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      cancellingId === item.id && { opacity: 0.6 }
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log("Cancel button clicked for request:", item.id);
                      if (item.id) {
                        handleCancelRequest(item.id, item.teacherName || "Teacher", item);
                      } else {
                        Alert.alert("Error", "Request ID is missing");
                      }
                    }}
                    disabled={cancellingId === item.id}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>
                      {cancellingId === item.id ? "Cancelling..." : "Cancel Request"}
                    </Text>
                  </TouchableOpacity>
                )}
                {item.status?.toLowerCase() === "accepted" && (
                  <TouchableOpacity
                    style={styles.chatButton}
                    onPress={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      try {
                        const currentUser = auth.currentUser;
                        if (!currentUser) {
                          Alert.alert("Error", "User not logged in");
                          return;
                        }
                        if (!item.teacherId) {
                          Alert.alert("Error", "Teacher ID is missing");
                          return;
                        }
                        const conversationId = await getOrCreateConversation(currentUser.uid, item.teacherId);
                        const otherUser = await getDataById('users', item.teacherId);
                        navigation.navigate('ChatScreen', {
                          conversationId,
                          otherUser: {
                            id: item.teacherId,
                            name: otherUser?.name || otherUser?.fullname || 'Teacher',
                            photoUrl: otherUser?.photoUrl || otherUser?.profileImage || null,
                          }
                        });
                      } catch (error) {
                        console.error('Error starting chat:', error);
                        Alert.alert("Error", "Failed to start chat. Please try again.");
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HirePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#d8b4e2",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: "purple",
    fontWeight: "600",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "purple",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  chatButton: {
    backgroundColor: "purple",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
