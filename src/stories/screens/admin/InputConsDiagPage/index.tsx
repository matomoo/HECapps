import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, Footer } from "native-base";

import styles from "./styles";
export interface Props {
	navigation: any;
	inputFormDiag: any;
	handleInputDiag: Function;
}
export interface State {}
class InputConsDiagPage extends React.Component<Props, State> {
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
						<Title>Input Constant Diagnosa</Title>
					</Body>

					<Right />
				</Header>

				<Content padder>
					{ this.props.inputFormDiag }
				</Content>

				<Footer>
					<Content>
						<Button block onPress={() => this.props.handleInputDiag()}>
							<Text>Simpan Data</Text>
						</Button>
					</Content>
				</Footer>
			</Container>
		);
	}
}

export default InputConsDiagPage;
