import * as React from "react";
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body,
			// Card,
			// Form,
			// Textarea,
			// Item,
			// Input,
			// Label,
			Footer,
} from "native-base";
import styles from "./styles";

export interface Props {
	onSimpan: Function;
	navigationBack: Function;
	inputDiagnosaForm: any;
	pilihanDiagnosa: any;
}
export interface State {}

class InputDiagnosaPage extends React.Component<Props, State> {
	render() {
		// const param = this.props.navigation.state.params.name.key;

		return (
			<Container style={styles.container}>
				<Header>
					<Left>
						<Button transparent onPress={() => this.props.navigationBack()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
						<Body style={{ flex: 3 }}>
							<Title>Input Diagnosa</Title>
						</Body>
					<Right />
				</Header>

				<Content>
					{/* {this.props.inputDiagnosaForm} */}
					{this.props.pilihanDiagnosa}
				</Content>
				<Footer>
					<Content>
						<Button
							full
							// style={styles.Item}
							onPress={() => this.props.onSimpan()}
							>
							<Text>Simpan</Text>
						</Button>
					</Content>
				</Footer>

			</Container>
		);
	}
}

export default InputDiagnosaPage;
