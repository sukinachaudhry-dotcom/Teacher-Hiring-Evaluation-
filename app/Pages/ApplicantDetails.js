import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ApplicantDetails = () => {
  const route = useRoute();
  const { applicant } = route.params || {};

  if (!applicant) {
    return (
      <View style={styles.container}>
        <Text>No applicant data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {applicant.applicantInfo?.photoURL ? (
          <Image 
            source={{ uri: applicant.applicantInfo.photoURL }} 
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {applicant.applicantInfo?.displayName?.[0]?.toUpperCase() || 'A'}
            </Text>
          </View>
        )}
        <Text style={styles.name}>
          {applicant.applicantInfo?.displayName || 'No Name'}
        </Text>
        <Text style={styles.email}>{applicant.applicantInfo?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Applied On:</Text>
          <Text style={styles.detailValue}>
            {new Date(applicant.appliedAt?.toDate()).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[
            styles.statusBadge,
            { 
              backgroundColor: applicant.status === 'accepted' ? '#4CAF50' : 
                             applicant.status === 'rejected' ? '#F44336' : '#FFC107',
              color: ['accepted', 'rejected'].includes(applicant.status) ? 'white' : 'black'
            }
          ]}>
            {applicant.status || 'pending'}
          </Text>
        </View>
      </View>

      {applicant.coverLetter && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Letter</Text>
          <Text style={styles.coverLetter}>{applicant.coverLetter}</Text>
        </View>
      )}

      {/* Add more sections for resume, test results, etc. as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#666',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    marginBottom: 10,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#666',
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  coverLetter: {
    lineHeight: 22,
    color: '#333',
  },
});

export default ApplicantDetails;
