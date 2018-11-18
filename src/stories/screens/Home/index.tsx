import * as React from "react";
import {
	Container,
	Header,
	Title,
	Content,
	Text,
	// Button,
	// Icon,
	// Left,
	Body,
	Right,
	Card,
	CardItem,
	// Footer, FooterTab,
	View,
} from "native-base";

import FooterNav from "../../../navigation/FooterNav";
import styles from "./styles";
// import Footer from "../../../theme/components/Footer";

export interface Props {
	navigation: any;
	// list: any;
	authUser: any;
	authRole: any;
	authUid: any;
	selectedCard: any;
}
export interface State {}
class Home extends React.Component<Props, State> {
	render() {
		// const key = this.props.authUid;
		return (
			<Container style={styles.container}>
				<Header>
					{/* <Left>
						<Button transparent>
							<Icon
								active
								name="menu"
								onPress={() => this.props.navigation.navigate("DrawerOpen")}
							/>
						</Button>
					</Left> */}
					<Body>
						<Title>Dashboard</Title>
					</Body>
					<Right />
				</Header>
				<Content
					// style={styles.content}
				>
					<View>
						<Card>
							<CardItem header>
								<Body>
									<Text>Selamat Datang, {this.props.authUser}</Text>
								</Body>
							</CardItem>
						</Card>
						{this.props.selectedCard}
					</View>
				</Content>
				<FooterNav navigation={this.props.navigation} />
			</Container>
		);
	}
}

export default Home;