import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body,
			List,
			ListItem,
			Card,
} from "native-base";
import moment from "moment";
import FooterNav from "../../../../navigation/FooterNav";
import styles from "./styles";
export interface Props {
	navigation: any;
	lists: any;
	onPilihPasien: Function;
}
export interface State {}
class DaftarTungguPage extends React.Component<Props, State> {

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
						<Title>List Daftar Tunggu Poliklinik</Title>
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
					<Text>{ moment().format("YYYY-MM-DD") }</Text>
					<Card>
					{ !!this.props.lists &&
						<List>
							{Object.keys(this.props.lists).map(key =>
								this.props.lists[key].flagActivity === "antriPoliklinik" &&
								<ListItem
									key={key}
									onPress={() => this.props.navigation.navigate("RekamMedikPasienPage", {name: {key}} )}
									>
									<Left><Text>{this.props.lists[key].profil.username}</Text></Left>
								</ListItem>,
							)}
						</List>
					}
					</Card>
				</Content>
				<FooterNav navigation={this.props.navigation} />
			</Container>
		);
	}
}

export default DaftarTungguPage;
