import { AsyncStorage } from "react-native";
import { auth } from "./firebase";
// import { promisify } from 'es6-promisify';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
	auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
	auth.signInWithEmailAndPassword(email, password);
	// try {
	// 	await AsyncStorage.setItem("@HEC2:key", "nok");
	// 	} catch (error) {
	// 	// Error saving data
	// 	}

// Sign Out
export const doSignOut = async () => {
	auth.signOut();
	try {
		AsyncStorage.clear();
		// await AsyncStorage.setItem("@HEC2:key", "nok");
		} catch (error) {
		// Error saving data
		}
	};

// IsAuthUser?
export const doAuthUser = (authUser) =>
	auth.onAuthStateChanged(authUser);