import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Helper/firebaseHelper';
import { useSelector } from 'react-redux';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [applicationCount, setApplicationCount] = useState(0);
  const user = useSelector(state => state.home.user);

  useEffect(() => {
    const fetchApplicationsCount = async () => {
      if (!user?.uid) return;

      try {
        // Get all jobs for this institution
        const jobsQuery = query(
          collection(db, 'post jobs'),
          where('institutionId', '==', user.uid)
        );
        
        const jobsSnapshot = await getDocs(jobsQuery);
        let totalApplications = 0;
        
        // Count all applications across all jobs
        for (const jobDoc of jobsSnapshot.docs) {
          const jobData = jobDoc.data();
          if (jobData.applications && Array.isArray(jobData.applications)) {
            totalApplications += jobData.applications.length;
          }
        }
        
        setApplicationCount(totalApplications);
      } catch (error) {
        console.error('Error fetching applications count:', error);
      }
    };

    fetchApplicationsCount();
  }, [user?.uid]);

  const handleApplicantsPress = (route, isFocused) => {
    if (!isFocused) {
      navigation.navigate('Applicants');
    }
  };

  const renderTabIcon = (route, index, isFocused) => {
    const descriptor = descriptors[route.key];
    // Safely extract options without accessing ref
    const options = descriptor?.options || {};
    const label = options.tabBarLabel || options.title || route.name;

    let iconName;
    if (route.name === 'Home') {
      iconName = isFocused ? 'home' : 'home-outline';
    } else if (route.name === 'Applicants') {
      iconName = isFocused ? 'people' : 'people-outline';
    } else if (route.name === 'Profile') {
      iconName = isFocused ? 'person' : 'person-outline';
    } else if (route.name === 'Jobs') {
      iconName = isFocused ? 'briefcase' : 'briefcase-outline';
    } else if (route.name === 'Tests') {
      iconName = isFocused ? 'document-text' : 'document-text-outline';
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (route.name === 'Applicants') {
            handleApplicantsPress(route, isFocused);
          } else if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
        style={styles.tab}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={iconName}
            size={24}
            color={isFocused ? '#007AFF' : '#8E8E93'}
          />
          {route.name === 'Applicants' && applicationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {applicationCount > 9 ? '9+' : applicationCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.label, { color: isFocused ? '#007AFF' : '#8E8E93' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return renderTabIcon(route, index, isFocused);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  iconContainer: {
    position: 'relative',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomTabBar;
