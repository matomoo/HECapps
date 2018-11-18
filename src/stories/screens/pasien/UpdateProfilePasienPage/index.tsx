import * as React from "react";
import { Container, Header, Title, Content,
		// Text,
		// View,
		Button, Icon, Left, Body,
		// Footer
		} from "native-base";

import styles from "./styles";
import FooterNav from "../../../../navigation/FooterNav";
export interface Props {
	navigation: any;
	formInputBarang: any;
}
export interface State {}
class UpdateProfilePasienPage extends React.Component<Props, State> {
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
						<Title>Update User Information</Title>
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
					{this.props.formInputBarang}
				</Content>
				<FooterNav navigation={this.props.navigation} />
			</Container>
		);
	}
}

export default UpdateProfilePasienPage;
