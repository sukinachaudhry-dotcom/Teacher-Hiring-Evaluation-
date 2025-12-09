import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { getDataById } from '../Helper/firebaseHelper';

export default function ChatScreen({ navigation, route }) {
  const { conversationId, otherUser } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      navigation.goBack();
      return;
    }

    // Fetch current user data
    getDataById('users', user.uid).then((userData) => {
      if (userData) {
        setCurrentUser({
          _id: user.uid,
          name: userData.name || userData.fullname || userData.institutionname || 'User',
          avatar: userData.profilePicUrl || userData.profileImage || userData.photoUrl || null,
        });
      }
      setLoading(false);
    });

    // Set up real-time listener for messages
    if (conversationId) {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messageList.push({
            id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            senderId: data.senderId,
            senderName: data.senderName || 'User',
            senderAvatar: data.senderAvatar || null,
          });
        });
        setMessages(messageList);
        
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          if (flatListRef.current && messageList.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      });

      // Mark messages as read
      markAsRead(conversationId, user.uid);

      return () => unsubscribe();
    }
  }, [conversationId, navigation]);

  const markAsRead = async (convId, userId) => {
    try {
      const convRef = doc(db, 'conversations', convId);
      await updateDoc(convRef, {
        [`unreadCount.${userId}`]: 0,
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !currentUser || !conversationId || sending) {
      return;
    }

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      // Add message to Firestore
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, {
        text: text,
        senderId: currentUser._id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        createdAt: serverTimestamp(),
      });

      // Update conversation with last message
      const convRef = doc(db, 'conversations', conversationId);
      const auth = getAuth();
      const user = auth.currentUser;
      const otherUserId = otherUser?.id;

      if (otherUserId) {
        const convDoc = await getDoc(convRef);
        const currentUnread = convDoc.data()?.unreadCount?.[otherUserId] || 0;
        
        await updateDoc(convRef, {
          lastMessage: text,
          lastMessageTime: serverTimestamp(),
          [`unreadCount.${otherUserId}`]: currentUnread + 1,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(text); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const messageDate = date instanceof Date ? date : new Date(date);
    const diff = now - messageDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser?._id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.messageRight : styles.messageLeft
      ]}>
        {!isCurrentUser && (
          <Image
            source={item.senderAvatar ? { uri: item.senderAvatar } : require('./Ali.jpeg')}
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft
        ]}>
          {!isCurrentUser && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.messageTextRight : styles.messageTextLeft
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.messageTimeRight : styles.messageTimeLeft
          ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
        {isCurrentUser && (
          <Image
            source={currentUser.avatar ? { uri: currentUser.avatar } : require('./Ali.jpeg')}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser || !conversationId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Unable to load chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {otherUser?.photoUrl ? (
          <Image source={{ uri: otherUser.photoUrl }} style={styles.headerAvatar} />
        ) : (
          <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
            <Ionicons name="person" size={20} color="#666" />
          </View>
        )}
        <Text style={styles.headerName}>{otherUser?.name || 'User'}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerAvatarPlaceholder: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  messageBubbleLeft: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: 'purple',
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTextLeft: {
    color: '#000',
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  messageTimeLeft: {
    color: '#999',
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
