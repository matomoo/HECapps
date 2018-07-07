import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body,
			List,
			ListItem,
			Card,
} from "native-base";

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

					<Right />
				</Header>

				<Content padder>
					<Card>
					{/* <Text>Berisikan daftar pasien</Text> */}
					{ !!this.props.lists &&
						<List>
							{Object.keys(this.props.lists).map(key =>
								<ListItem
									key={key}
									onPress={() => this.props.navigation.navigate("RekamMedikPasienPage", {name: {key}} )}
									// onPress={() => this.props.onPilihPasien({key})}
									// onPress={() => console.log(key)}
									>
									<Left><Text>{this.props.lists[key].profil.username}</Text></Left>
									{/* <Left><Text>{this.props.lists[key].profil.role}</Text></Left> */}
									{/* <Right><Icon active name="ios-arrow-forward"/></Right> */}
								</ListItem>,
							)}
						</List>
					}
					</Card>
				</Content>
			</Container>
		);
	}
}

export default DaftarTungguPage;
