import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function InstBrowse({ navigation }) {
  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>

      {/* Header */}
      <View
        style={{
          backgroundColor: 'purple',
          paddingVertical: 10,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#999"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
          }}
        />
      </View>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
  <View style={{ flexDirection: "row" }}>
    <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")}
              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>Institution Jobs</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("PrivBrowse")}
              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>Private Jobs</Text>
    </TouchableOpacity>
    
  </View>
</ScrollView>

      {/* Jobs List */}
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>

        {/* Job Card 1 */}
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
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Mathematics Teacher Required</Text>
          <Text>City School, Lahore</Text>
          <Image
            source={require("./School.jpeg")}
            style={{ width: 80, height: 80, borderRadius: 10, alignSelf: "flex-end", marginTop: -40 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>47 min ago</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Class: 9th</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Rs. 35,000</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Experience: 5 years</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Card 2 */}
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
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Physics Teacher Required</Text>
          <Text>Science Academy, Karachi</Text>
          <Image
            source={require("./School2.jpeg")}
            style={{ width: 80, height: 80, borderRadius: 10, alignSelf: "flex-end", marginTop: -40 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>1 hr ago</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Class: 10th</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Rs. 40,000</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Experience: 3 years</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Card 3 - College */}
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
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Chemistry Lecturer Required</Text>
          <Text>National College, Islamabad</Text>
          <Image
            source={require("./School.jpeg")}
            style={{ width: 80, height: 80, borderRadius: 10, alignSelf: "flex-end", marginTop: -40 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>2 hrs ago</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Class: 12th</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Rs. 45,000</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Experience: 4 years</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Job Card 4 - University */}
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
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>Computer Science Lecturer Required</Text>
          <Text>National University, Karachi</Text>
          <Image
            source={require("./School.jpeg")}
            style={{ width: 80, height: 80, borderRadius: 10, alignSelf: "flex-end", marginTop: -40 }}
          />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>3 hrs ago</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Class: Undergraduate</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Rs. 50,000</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
            <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text>Experience: 5 years</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}
              style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
