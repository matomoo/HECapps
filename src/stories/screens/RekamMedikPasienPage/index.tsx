import * as React from "react";
import { Container, Header, Title, Content, Text,
			// Button, Icon, Right,
			Left, Body,
			// List,
			// ListItem,
			Card,
			CardItem,
			H2,
			// Footer,
			// View,
} from "native-base";
// import _ from "lodash";
import FooterNav from "../../../navigation/FooterNav";
import styles from "./styles";

export interface Props {
	navigation: any;
	pasienUsername: any;
	// pasienRekamMedik: any;
	userRole: any;
	selectedCard;
	viewRiwayatRekamMedik;
	// viewRiwayatRekamMedikObat;
	transaksiNomorFaktur;
}
export interface State {}
class RekamMedikPasienPage extends React.Component<Props, State> {

	render() {
		// const key = this.props.navigation.state.params.name.key;

		return (
			<Container style={styles.container}>
				<Header>
					{/* <Left>
						<Button transparent onPress={() => this.props.navigation.goBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left> */}

					<Body style={{ flex: 3 }}>
						<Title>Profil Pasien</Title>
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
					{/* <Card> */}
						{/* <CardItem> */}
							{ this.props.viewRiwayatRekamMedik }
						{/* </CardItem> */}
						{/* <CardItem>
							{ this.props.viewRiwayatRekamMedikObat }
						</CardItem> */}
					{/* </Card> */}
					<Card>
						{ this.props.selectedCard }
					</Card>
				</Content>
				{ this.props.userRole !== "dokter" &&
					<FooterNav navigation={this.props.navigation} />
				}
			</Container>
		);
	}
}

export default RekamMedikPasienPage;