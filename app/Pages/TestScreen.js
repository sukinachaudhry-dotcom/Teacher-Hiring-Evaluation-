import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export default function TestScreen({ navigation, route }) {
    const { testId, jobId, jobTitle } = route.params || {};
    const [testData, setTestData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);

    useEffect(() => {
        fetchTestData();
    }, [testId]);

    const fetchTestData = async () => {
        try {
            if (!testId) {
                Alert.alert('Error', 'Test ID not found');
                navigation.goBack();
                return;
            }

            const testDoc = await getDoc(doc(db, 'tests', testId));
            if (testDoc.exists()) {
                setTestData(testDoc.data());
            } else {
                Alert.alert('Error', 'Test not found');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error fetching test:', error);
            Alert.alert('Error', 'Failed to load test');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const calculateScore = () => {
        if (!testData?.questions) return 0;
        
        let correct = 0;
        testData.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        
        return Math.round((correct / testData.questions.length) * 100);
    };

    const submitTest = async () => {
        if (Object.keys(selectedAnswers).length !== testData?.questions?.length) {
            Alert.alert('Warning', 'Please answer all questions before submitting');
            return;
        }

        try {
            setSubmitting(true);
            const auth = getAuth();
            const currentUser = auth.currentUser;

            const score = calculateScore();
            const passed = score >= (testData.passingScore || 70);

            // Save test result
            await addDoc(collection(db, 'testResults'), {
                testId,
                jobId,
                teacherId: currentUser.uid,
                teacherEmail: currentUser.email,
                score,
                passed,
                totalQuestions: testData.questions.length,
                correctAnswers: Object.keys(selectedAnswers).filter(index => 
                    selectedAnswers[index] === testData.questions[index].correctAnswer
                ).length,
                answers: selectedAnswers,
                submittedAt: new Date().toISOString(),
                jobTitle
            });

            console.log('✅ Test result saved:', {
                testId,
                jobId,
                teacherId: currentUser.uid,
                score,
                passed
            });

            setTestCompleted(true);
            Alert.alert(
                passed ? '✅ Test Passed!' : '❌ Test Failed',
                `Your score: ${score}%\n${passed ? 'You can now apply for this job!' : 'You need to retake the test to apply.'}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (passed) {
                                navigation.goBack();
                            } else {
                                setTestCompleted(false);
                                setSelectedAnswers({});
                                setCurrentQuestion(0);
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error submitting test:', error);
            Alert.alert('Error', 'Failed to submit test');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="purple" />
                <Text style={styles.loadingText}>Loading test...</Text>
            </View>
        );
    }

    if (testCompleted) {
        return (
            <View style={styles.container}>
                <View style={styles.completedContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                    <Text style={styles.completedTitle}>Test Submitted!</Text>
                    <Text style={styles.completedText}>Your test has been submitted successfully.</Text>
                </View>
            </View>
        );
    }

    if (!testData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Test not available</Text>
            </View>
        );
    }

    const question = testData.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{jobTitle} - Test</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of {testData.questions.length}
                </Text>
            </View>

            {/* Question */}
            <ScrollView style={styles.content}>
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>
                        {currentQuestion + 1}. {question.question}
                    </Text>
                    
                    <View style={styles.optionsContainer}>
                        {question.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    selectedAnswers[currentQuestion] === option && styles.selectedOption
                                ]}
                                onPress={() => handleAnswerSelect(currentQuestion, option)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedAnswers[currentQuestion] === option && styles.selectedOptionText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
                    onPress={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                {currentQuestion === testData.questions.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.disabledButton]}
                        onPress={submitTest}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                                <Text style={styles.buttonText}>Submit Test</Text>
                            </>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => setCurrentQuestion(prev => Math.min(testData.questions.length - 1, prev + 1))}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    completedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    completedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    completedText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'purple',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    progressContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'purple',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#f3e5f5',
        borderColor: 'purple',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedOptionText: {
        color: 'purple',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'purple',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
