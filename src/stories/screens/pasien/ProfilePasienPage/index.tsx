import * as React from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Body,
			// List, ListItem, Text, Card,
} from "native-base";
import {
	// StyleSheet, TouchableOpacity,
	Text,
	View,
	Image,
} from "react-native";
import FooterNav from "../../../../navigation/FooterNav";
import styles from "./styles";
export interface Props {
	navigation: any;
	Users;
	handleUpdatePasien;
}
export interface State {}
class ProfilePasienPage extends React.Component<Props, State> {

	render() {
		// console.log(this.props.Users);
		const { Users } = this.props;
		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={() =>
							this.props.navigation.goBack()
						}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>

					<Body style={{ flex: 3 }}>
						<Title>Profile Pasien</Title>
					</Body>

					{/* <Right>
						<Button transparent>
							<Icon
								active
								name="md-create"
								onPress={() =>
									this.props.handleUpdatePasien(this.props.Users)
								}
							/>
						</Button>
					</Right> */}
				</Header>

				<Content padder>
					{ Users.map( el =>
							<View key="{el.profil._key}" style={styles.container}>
								<View style={styles.header}></View>
								<Image style={styles.avatar} source={{uri: "https://bootdey.com/img/Content/avatar/avatar6.png"}}/>
								<View style={styles.body}>
									<View style={styles.bodyContent}>
									<Text style={styles.namex}>{ el.profil.username }</Text>
									<Text style={styles.info}>{ el.profil.email }</Text>
									<Text style={styles.description}>{ el.profil.gender }</Text>
									<Text style={styles.description}>{ el.profil.handphone }</Text>
									<Text style={styles.description}>{ el.profil.description }</Text>
									<Text style={styles.description}>{ el.profil.alamat }</Text>
									{/* <TouchableOpacity style={styles.buttonContainer}>
										<Text>Opcion 1</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.buttonContainer}>
										<Text>Opcion 2</Text>
									</TouchableOpacity> */}
									</View>
								</View>
							</View>,
						)
					}
				</Content>
				<FooterNav navigation={this.props.navigation} />
			</Container>
		);
	}
}

export default ProfilePasienPage;
