import * as React from "react";
import { Container, Header, Title, Content,
		Text,
		// View,
		Button, Icon, Left, Body, Footer } from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
	formInputBarang: any;
	handleUpdateRole: any;
}
export interface State {}
class UpdateProfileDokterPage extends React.Component<Props, State> {
	render() {
		// const param = this.props.navigation.state.params;
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title>Update User Information</Title>
					</Body>
					{/* <Right>
						<Button transparent>
							<Icon
								active
								name="home"
								onPress={() => this.props.navigation.navigate("Home")}
							/>
						</Button>
					</Right> */}
				</Header>
				<Content padder>
					{this.props.formInputBarang}
				</Content>
				<Footer>
					<Content>
						<Button block onPress={() => this.props.handleUpdateRole()}>
							<Text>Simpan Data</Text>
						</Button>
					</Content>
				</Footer>
			</Container>
		);
	}
}

export default UpdateProfileDokterPage;
