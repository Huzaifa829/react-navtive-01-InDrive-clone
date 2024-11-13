import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/config/firebase/config';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // Toggle between Login and Sign Up
  const handleToggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Reset input fields and error states
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Handle Firebase login
  const handleLogin = async () => {
    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setError('Please check your email and password format.');
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setVisible(true);
    setError('');
    // ...
  })
  .catch((error) => {
    setError("Invalid User Register please...");
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    
  });
    // try {
    //   await signInWithEmailAndPassword(auth, email, password)
    //   setVisible(true);
    //   setError('');
    // } catch (error) {
    //   setError(error.message);
    // }
    setLoading(false);
  };

  // Handle Firebase sign up
  const handleSignUp = async () => {
    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setError('Please check your email and password format.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    setVisible(true);
    setError('');
    // ...
  })
  .catch((error) => {
    setError(error.message);
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ..
  });
    // try {
    //   await createUserWithEmailAndPassword(auth, email, password)
    //   setVisible(true);
    //   setError('');
    // } catch (error) {
    //   setError(error.message);
    // }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Welcome back!' : 'Create your account'}</Text>
      </View>
      
      <View style={styles.form}>
        <TextInput
          style={[styles.input, !emailRegex.test(email) && email ? styles.errorInput : null]}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        
        <TextInput
          style={[styles.input, !passwordRegex.test(password) && password ? styles.errorInput : null]}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        
        {!isLogin && (
          <TextInput
            style={[styles.input, confirmPassword !== password && confirmPassword ? styles.errorInput : null]}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
        )}
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={isLogin ? handleLogin : handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          )}
        </TouchableOpacity>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </Text>
          <TouchableOpacity onPress={handleToggle}>
            <Text style={styles.switchButton}>{isLogin ? 'Sign Up' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {isLogin ? 'Logged in successfully!' : 'Signed up successfully!'}
      </Snackbar>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    marginVertical: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#ff4d4d',
  },
  button: {
    height: 50,
    backgroundColor: '#34a853',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginVertical: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  switchText: {
    color: '#666',
  },
  switchButton: {
    color: '#34a853',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
