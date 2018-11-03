// @flow
import * as React from "react";
import { Item, Input, Icon, Form, Toast } from "native-base";
import { observer, inject } from "mobx-react/native";
import { auth } from "../../firebase";
import Login from "../../stories/screens/Login";
import {Keyboard, AsyncStorage} from "react-native";

export interface Props {
	navigation: any;
	loginForm: any;
	mainStore: any;
}
export interface State {}

@inject("loginForm", "mainStore")
@observer
export default class LoginContainer extends React.Component<Props, State> {
	emailInput: any;
	pwdinput: any;

	async componentDidMount() {
		const value = await AsyncStorage.getItem("@MySuperStore:xockey");
		// console.log(value);
		if (value !== "nok") {
			this.props.mainStore.currentUid = value;
			// this.props.loginForm.clearStore();
			this.props.navigation.navigate("Drawer");
			// console.log(value);
		}
	}

	login() {
		this.props.loginForm.validateForm();
		if (this.props.loginForm.isValid) {
			auth.doSignInWithEmailAndPassword(this.props.loginForm.email, this.props.loginForm.password)
				.then((authUser) => {
					// this.isValid = true;
					// console.log(this.props);
					this.props.mainStore.currentUid = authUser.user.uid;
					this.props.loginForm.clearStore();
					this.props.navigation.navigate("Drawer");
					// console.log(authUser.user.uid);
					// try {
					// 	AsyncStorage.setItem("@HEC2:key", authUser.user.uid);
					// 	} catch (error) {
					// 	// Error saving data
					// 	}
				})
				.catch(error => {
					// this.props.loginForm.responseFirebase = error.message;
					console.log(error.message);
					Toast.show({
						text: error.message,
						duration: 5000,
						position: "top",
						textStyle: { textAlign: "center" },
					});
				});
		} else {
			Toast.show({
				text: "Enter Valid Email & password!",
				duration: 2000,
				position: "top",
				textStyle: { textAlign: "center" },
			});
		}
		Keyboard.dismiss();
	}

	daftarUser() {
		this.props.navigation.navigate("DaftarUser");
	}

	render() {
		const form = this.props.loginForm;
		const Fields = (
			<Form>
				<Item error={form.emailError ? true : false}>
					<Icon active name="person" />
					<Input
						placeholder="Email"
						keyboardType="email-address"
						ref={c => (this.emailInput = c)}
						value={form.email}
						onBlur={() => form.validateEmail()}
						onChangeText={e => form.emailOnChange(e)}
					/>
				</Item>
				<Item error={form.passwordError ? true : false}>
					<Icon active name="unlock" />
					<Input
						placeholder="Password"
						ref={c => (this.pwdinput = c)}
						value={form.password}
						onBlur={() => form.validatePassword()}
						onChangeText={e => form.passwordOnChange(e)}
						secureTextEntry={true}
					/>
				</Item>
			</Form>
		);
		return <Login
					loginForm={Fields}
					onLogin={() => this.login()}
					onDaftarUser={() => this.daftarUser()}
				/>;
	}
}
