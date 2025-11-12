import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const PrivacyPolicy= () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.heading}>Privacy Policy</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>
          Thank you for using the Teacher Hiring Evaluation App (the "App"). Your
          privacy is important to us. This Privacy Policy describes how we
          collect, use, disclose, and protect your information when you use the
          App.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>1. Information We Collect</Text>
        <Text style={styles.text}>
          • Personal Information: Name, email, phone number, subject
          specialization, and years of experience provided during account
          creation.
          {"\n"}• Academic and Professional Data: Qualifications, teaching preferences,
          assessments, and test performance.
          {"\n"}• Usage and Device Data: App activity, login history, and device
          details used to operate, maintain, and improve functionality.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to:
          {"\n"}• Create and manage teacher and institution accounts.
          {"\n"}• Conduct evaluations and share relevant performance insights with
          institutions.
          {"\n"}• Send notifications (for example, job updates, interviews, and
          feedback).
          {"\n"}• Operate, maintain, and enhance the App and its features.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>3. Information Sharing and Disclosure</Text>
        <Text style={styles.text}>
          • We do not sell your personal data.
          {"\n"}• Your profile and relevant evaluation details may be shared with
          verified institutions for hiring purposes.
          {"\n"}• We share information with trusted service providers (for example,
          Firebase) for authentication, database, hosting, and analytics to
          operate the App.
          {"\n"}• We may disclose information to comply with applicable law, legal
          process, or enforce our terms; or to protect our rights, users, or the
          public.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>4. Data Security</Text>
        <Text style={styles.text}>
          • We implement administrative, technical, and organizational safeguards
          to protect your information.
          {"\n"}• Data is stored securely in Firebase with access controls,
          authentication, and encryption where applicable.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>5. Your Rights and Choices</Text>
        <Text style={styles.text}>
          • You may update or delete your profile information within the App.
          {"\n"}• You may request deletion of your data by contacting support.
          {"\n"}• You can adjust notification preferences at any time in Settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>6. Updates to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy periodically. Material changes will
          be reflected in this document with an updated effective date. If
          appropriate, we will provide additional notice within the App.
        </Text>
      </View>

      <View style={styles.footerBox}>
        <Text style={styles.footer}>Effective Date: November 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: 'purple',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
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
  subheading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b21a8',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
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
  footer: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
});

export default PrivacyPolicy;
