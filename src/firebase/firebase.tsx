import firebase from "firebase";

const config = {
	apiKey: "AIzaSyCyk2tCYvBTadh0Aj1fDKb4QS2WQ6qB6Xw",
	authDomain: "hecapps-d0308.firebaseapp.com",
	databaseURL: "https://hecapps-d0308.firebaseio.com",
	projectId: "hecapps-d0308",
	storageBucket: "hecapps-d0308.appspot.com",
	messagingSenderId: "56075593644",
};

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
	db,
	auth,
};