import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const TermAndConditions = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.heading}>Terms & Conditions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>
          Thank you for using the Teacher Hiring Evaluation App (the "App"). By
          accessing or using the App, you agree to the following terms and
          conditions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>1. Account Usage</Text>
        <Text style={styles.text}>
          • Teachers and institutions must provide accurate, up-to-date
          information during registration.
          {"\n"}• Users are responsible for safeguarding their account credentials
          and all activity under their account.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>2. Evaluation Tests</Text>
        <Text style={styles.text}>
          • Institutions may create evaluation tests for teachers.
          {"\n"}• Teachers must complete tests honestly and independently.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>3. Hiring & Data Sharing</Text>
        <Text style={styles.text}>
          • Evaluation results and relevant profile details may be shared with
          verified institutions for hiring purposes.
          {"\n"}• The App facilitates connections and does not guarantee job
          placement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>4. Prohibited Conduct</Text>
        <Text style={styles.text}>
          • Users must not provide false information or misuse the App for
          fraudulent or unlawful purposes.
          {"\n"}• Unauthorized access, scraping, or attempts to interfere with the
          App's operation are strictly prohibited.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>5. Liability</Text>
        <Text style={styles.text}>
          • The App is provided “as is,” without warranties of any kind. We are
          not responsible for hiring outcomes or decisions made by institutions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>6. Changes</Text>
        <Text style={styles.text}>
          • We may update these Terms & Conditions periodically. Material
          changes will be reflected here with an updated effective date.
        </Text>
      </View>

      <View style={styles.footerBox}>
        <Text style={styles.footer}>Effective Date: November 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f5ff' },
  content: { padding: 20 },
  header: {
    backgroundColor: 'purple',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: { fontSize: 22, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  subheading: { fontSize: 16, fontWeight: '700', color: '#6b21a8', marginBottom: 8 },
  text: { fontSize: 16, color: '#333', lineHeight: 24 },
  bold: { fontWeight: 'bold' },
  footerBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  footer: { textAlign: 'center', color: '#555', fontSize: 13 },
});

export default TermAndConditions;
