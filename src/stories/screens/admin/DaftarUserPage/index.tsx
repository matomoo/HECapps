import * as React from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body,
			// List, ListItem, Text, Card,
} from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
	viewUsers;
}
export interface State {}
class DaftarUserPage extends React.Component<Props, State> {

	render() {
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>

					<Body style={{ flex: 3 }}>
						<Title>Daftar User</Title>
					</Body>

					<Right>
						<Button transparent>
							<Icon
								active
								name="home"
								onPress={() => this.props.navigation.navigate("Home")}
							/>
						</Button>
					</Right>
				</Header>

				<Content padder>
					{this.props.viewUsers}
				</Content>
			</Container>
		);
	}
}

export default DaftarUserPage;
