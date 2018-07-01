import * as React from "react";
import { Platform } from "react-native";
import { Container, Content, Header, Body, Button, Text, View, Footer } from "native-base";
import { Image } from "react-native";
// import styles from "./styles";
export interface Props {
	loginForm: any;
	onLogin: Function;
	onDaftarUser: Function;
}

export interface State {}
class Login extends React.Component<Props, State> {
	render() {
		return (
			<Container>
				<Header style={{ height: 150 }}>
					<Body style={{ alignItems: "center" }}>
						<Image source={require("../../../../assets/HEC_w150.jpg")} />
						<View padder>
							<Text style={{ color: Platform.OS === "ios" ? "#000" : "#FFF" }} />
						</View>
					</Body>
				</Header>
				<Content>
					{this.props.loginForm}
					<View padder>
						<Button block onPress={() => this.props.onLogin()}>
							<Text>Login</Text>
						</Button>
					</View>
					<View padder>
						<Button block onPress={() => this.props.onDaftarUser()}>
							<Text>Daftar</Text>
						</Button>
					</View>
				</Content>
				<Footer style={{ backgroundColor: "#F8F8F8" }}>
					<View style={{ alignItems: "center", opacity: 0.5, flexDirection: "row" }}>
						<View padder>
							<Text style={{ color: "#000" }}>Apps of HEC</Text>
						</View>
					</View>
				</Footer>
			</Container>
		);
	}
}

export default Login;
