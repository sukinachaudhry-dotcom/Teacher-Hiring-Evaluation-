// // CoursePage.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function CoursePage({ navigation, route }) {
//   const { subject, courses } = route.params;
//   const [search, setSearch] = useState("");

//   const filteredCourses = courses.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const CourseCard = ({ course }) => (
//     <View
//       style={{
//         width: "48%",
//         backgroundColor: "#d8b4e2",
//         borderRadius: 10,
//         padding: 10,
//         marginBottom: 15,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//         borderWidth: 2,
//         borderColor: "purple",
//       }}
//     >
//       <Image
//         source={course.img}
//         style={{
//           width: 60,
//           height: 60,
//           borderRadius: 30,
//           alignSelf: "center",
//         }}
//       />
//       <Text
//         style={{
//           marginTop: 5,
//           fontWeight: "bold",
//           textAlign: "center",
//           color: "purple",
//         }}
//       >
//         {course.name}
//       </Text>
//       <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
//         {course.desc}
//       </Text>
//       <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
//         {course.exp}
//       </Text>

//       <View style={{ flexDirection: "row", marginTop: 10 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "purple",
//             padding: 8,
//             borderRadius: 20,
//             flex: 1,
//             marginRight: 5,
//           }}
//           onPress={() => alert(`Details of ${course.name}`)}
//         >
//           <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
//             Detail
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "purple",
//             padding: 8,
//             borderRadius: 20,
//             flex: 1,
//             marginLeft: 5,
//           }}
//           onPress={() => alert(`Viewing ${course.name}`)}
//         >
//           <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
//             View
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       {/* Purple Header */}
//       <View
//         style={{
//           paddingVertical: 12,
//           paddingHorizontal: 12,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//           backgroundColor: "purple",
//         }}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={26} color="white" />
//         </TouchableOpacity>

//         <TextInput
//           placeholder={`Search ${subject} Courses`}
//           placeholderTextColor="#ddd"
//           value={search}
//           onChangeText={setSearch}
//           style={{
//             flex: 1,
//             backgroundColor: "#fff",
//             marginHorizontal: 10,
//             borderRadius: 20,
//             paddingHorizontal: 15,
//             height: 40,
//             fontSize: 14,
//           }}
//         />

//         <TouchableOpacity>
//           <Ionicons name="notifications" size={26} color="white" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={{ padding: 10 }}>
//         <View
//           style={{
//             flexDirection: "row",
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//           }}
//         >
//           {filteredCourses.length > 0 ? (
//             filteredCourses.map((course, i) => (
//               <CourseCard key={i} course={course} />
//             ))
//           ) : (
//             <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
//               No {subject} courses found
//             </Text>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
