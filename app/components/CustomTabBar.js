import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
        let count = 0;
        
        for (const jobDoc of jobsSnapshot.docs) {
          const jobData = jobDoc.data();
          if (jobData.applications) {
            count += jobData.applications.length;
          }
        }
        
        setApplicationCount(count);
      } catch (error) {
        console.error('Error fetching applications count:', error);
      }
    };

    fetchApplicationsCount();
  }, [user?.uid]);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        } else if (route.name === 'Jobs') {
          iconName = 'briefcase';
        } else if (route.name === 'Applicants') {
          iconName = 'people';
        } else if (route.name === 'Tests') {
          iconName = 'document-text';
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <View>
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
