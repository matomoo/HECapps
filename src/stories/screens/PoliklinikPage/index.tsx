import * as React from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body } from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
	forms: any;
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
						<Title>Poliklinik</Title>
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
					{ this.props.forms }
				</Content>
			</Container>
		);
	}
}

export default PoliklinikPage;
