import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body,
			// List, ListItem,
			Card,
} from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
	viewObats;
}
export interface State {}
class DaftarObatPage extends React.Component<Props, State> {

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
						<Title>Daftar Obat Apotek</Title>
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
					{this.props.viewObats}
				</Content>
			</Container>
		);
	}
}

export default DaftarObatPage;