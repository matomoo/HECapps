// @flow
import * as React from "react";
import { Item, Input, Icon, Form, Toast } from "native-base";
import { observer, inject } from "mobx-react/native";

import DaftarUser from "../../stories/screens/DaftarUser";
import { auth, db } from "../../firebase";

export interface Props {
	navigation: any;
	daftarUserForm: any;
}
export interface State {}

@inject("daftarUserForm")
@observer
export default class DaftarUserContainer extends React.Component<Props, State> {
	usernameInput: any;
	emailInput: any;
	pwdOneinput: any;
	pwdTwoinput: any;

	login() {
		const { usernameError, emailError, passwordOneError, passwordTwoError } = this.props.daftarUserForm;
		const message = [];
		this.props.daftarUserForm.validateForm();
		if (this.props.daftarUserForm.isValid) {
			auth.doCreateUserWithEmailAndPassword(this.props.daftarUserForm.email, this.props.daftarUserForm.passwordOne)
				.then((authUser) => {
					db.doCreateUser(authUser.user.uid, this.props.daftarUserForm.username, this.props.daftarUserForm.email, this.props.daftarUserForm.userRole);
					this.props.navigation.navigate("Drawer");
					this.props.daftarUserForm.clearStore();
				})
				.catch(error => {
					Toast.show({
						text: error.message,
						duration: 5000,
						position: "top",
						textStyle: { textAlign: "center" },
					});
				});
		} else {
			// console.log(this.props);
			message.push(
				usernameError === undefined	? "" : usernameError,
				emailError === undefined ? "" : emailError,
				passwordOneError === undefined ? "" : passwordOneError,
				passwordTwoError === undefined ? "" : passwordTwoError,
			);
			Toast.show({
				text:
					message.join(", "),
				duration: 2000,
				position: "top",
				textStyle: { textAlign: "center" },
			});
		}
	}
	backTo() {
		this.props.navigation.goBack();
	}

	render() {
		const form = this.props.daftarUserForm;
		const Fields = (
			<Form>
				<Item error={form.usernameError ? true : false}>
					<Icon active name="person" />
					<Input
						placeholder="Username"
						ref={c => (this.usernameInput = c)}
						value={form.username}
						onBlur={() => form.validateUsername()}
						onChangeText={e => form.usernameOnChange(e)}
					/>
				</Item>
				<Item error={form.emailError ? true : false}>
					<Icon active name="paper" />
					<Input
						placeholder="Email"
						keyboardType="email-address"
						ref={c => (this.emailInput = c)}
						value={form.email}
						onBlur={() => form.validateEmail()}
						onChangeText={e => form.emailOnChange(e)}
					/>
				</Item>
				<Item error={form.passwordOneError ? true : false}>
					<Icon active name="unlock" />
					<Input
						placeholder="Password"
						ref={c => (this.pwdOneinput = c)}
						value={form.passwordOne}
						onBlur={() => form.validatePasswordOne()}
						onChangeText={e => form.passwordOneOnChange(e)}
						secureTextEntry={true}
					/>
				</Item>
				<Item error={form.passwordTwoError ? true : false}>
					<Icon active name="unlock" />
					<Input
						placeholder="Konfirmasi Password"
						ref={c => (this.pwdTwoinput = c)}
						value={form.passwordTwo}
						onBlur={() => form.validatePasswordTwo()}
						onChangeText={e => form.passwordTwoOnChange(e)}
						secureTextEntry={true}
					/>
				</Item>
			</Form>
		);
		return <DaftarUser
			daftarUserForm={Fields}
			onLogin={() => this.login()}
			onNavBack={() => this.backTo()}
			/>;
	}
}
