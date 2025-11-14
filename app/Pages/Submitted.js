import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ApplicationSuccess({ route, navigation }) {
  const { jobTitle, institutionName, appliedDate, status } = route.params || {};
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 }}>
      
      {/* Success Icon */}
      <Ionicons name="checkmark-circle-outline" size={80} color="green" />

      {/* Message */}
      <Text style={styles.title}>Application Submitted!</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.label}>Job Title:</Text> {jobTitle || 'N/A'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Institution:</Text> {institutionName || 'N/A'}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Applied On:</Text> {appliedDate || new Date().toLocaleDateString()}</Text>
        <Text style={[styles.status, {color: status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : '#FFA500'}]}>
          Status: {status || 'Pending'}
        </Text>
      </View>
      
      <Text style={styles.message}>
        Your application has been successfully submitted. You can track the status in My Applications.
      </Text>
      <Text style={styles.note}>You will be notified if the institute shortlists you.</Text>

      {/* Buttons */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate("Application")}
      >
        <Text style={styles.buttonText}>Go to My Applications</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, {backgroundColor: '#6a1b9a'}]}
        onPress={() => navigation.navigate("Home1")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22, 
    fontWeight: "bold", 
    marginTop: 15, 
    color: "#333",
    textAlign: 'center'
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15
  },
  detailText: {
    fontSize: 15,
    marginVertical: 5,
    color: '#333'
  },
  label: {
    fontWeight: '600',
    color: '#555'
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0'
  },
  message: {
    fontSize: 14, 
    textAlign: "center", 
    color: "#555", 
    marginVertical: 10,
    lineHeight: 20
  },
  note: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: "purple", 
    padding: 12, 
    borderRadius: 25, 
    width: "80%", 
    marginTop: 10
  },
  buttonText: {
    color: "#fff", 
    textAlign: "center", 
    fontSize: 16,
    fontWeight: '500'
  }
});
