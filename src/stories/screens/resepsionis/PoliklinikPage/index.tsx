import * as React from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Body } from "native-base";
import FooterNav from "../../../../navigation/FooterNav";
import styles from "./styles";
export interface Props {
	navigation: any;
	forms: any;
	skedul;
}
export interface State {}
class PoliklinikPage extends React.Component<Props, State> {
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
						<Title>Pengaturan Poliklinik</Title>
					</Body>

					{/* <Right>
						<Button transparent onPress={() => this.props.navigation.navigate("Home")}>
							<Icon
								active
								name="home"
							/>
						</Button>
					</Right> */}
				</Header>

				<Content padder>
					{ this.props.forms }
					{ this.props.skedul }
				</Content>
				<FooterNav navigation={this.props.navigation} />
			</Container>
		);
	}
}

export default PoliklinikPage;
