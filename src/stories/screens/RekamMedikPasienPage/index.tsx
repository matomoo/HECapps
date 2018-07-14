import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body,
			// List,
			// ListItem,
			Card,
			CardItem,
			H2,
} from "native-base";
// import _ from "lodash";

import styles from "./styles";

export interface Props {
	navigation: any;
	pasienUsername: any;
	// pasienRekamMedik: any;
	userRole: any;
	selectedCard;
}
export interface State {}
class RekamMedikPasienPage extends React.Component<Props, State> {

	render() {
		// const key = this.props.navigation.state.params.name.key;

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>

					<Body style={{ flex: 3 }}>
						<Title>Profil Pasien</Title>
					</Body>

					<Right />
				</Header>

				<Content padder>
					<Card>
						<CardItem>
							<Left>
								<Text>
									{this.props.pasienUsername}
									</Text>
							</Left>
						</CardItem>
					</Card>
					<Text><H2>Riwayat Rekam Medik</H2></Text>
					<Card>
						<CardItem>
							<Text>{" emty"}</Text>
						</CardItem>
					</Card>
					<Card>
						{ this.props.selectedCard }
					</Card>
				</Content>
			</Container>
		);
	}
}

export default RekamMedikPasienPage;