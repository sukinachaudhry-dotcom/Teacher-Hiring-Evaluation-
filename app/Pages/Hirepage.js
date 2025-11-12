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
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HirePage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "HiredTeachers"), where("studentId", "==", user.uid));

    // ✅ Real-time listener (no need for getDocs)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teacherList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading your teachers...</Text>
      </View>
    );
  }

  if (teachers.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="school-outline" size={50} color="gray" />
        <Text style={{ marginTop: 10 }}>You haven’t hired any teachers yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("TeacherProfile", { teacherId: item.teacherId })}
          >
            <Image
              source={{ uri: item.teacherProfilePic || "https://via.placeholder.com/100" }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.teacherName}</Text>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.date}>Hired on: {item.hireDate}</Text>
              <Text
                style={[
                  styles.status,
                  { color: item.status === "Active" ? "green" : "gray" },
                ]}
              >
                {item.status}
              </Text>
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
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subject: {
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  status: {
    marginTop: 4,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
