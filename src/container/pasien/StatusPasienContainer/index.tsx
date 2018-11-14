import * as React from "react";
import { observer, inject } from "mobx-react/native";
import {
	// Container, Header, Title,
	// Content, Button,
	View, Text,
	Card, CardItem,
	// Icon,
	// Left, Right, Body,
} from "native-base";
// import {
// 	Modal,
// 	// TouchableHighlight,
// 	// Text, View, StyleSheet,
// }
// from "react-native";
// import { db } from "../../../firebase";
// import moment from "moment";
import * as db1 from "../../../firebase/firebase";
import { TouchableOpacity } from "react-native";
// import styles from "./styles";

export interface Props {
	mainStore?;
	onPress;
	pasienStore?;
	// navigation: any;
}
export interface State {
	listUsers;
}

@inject("mainStore", "pasienStore")
@observer

export default class BlankPageContainer extends React.Component<Props, State> {
taskUser;

	constructor(props) {
		super(props);
		const { currentUid } = this.props.mainStore;
		this.taskUser = db1.db.ref(`pasiens/${currentUid}`);
		this.state = {
			listUsers: [],
		};
	}

	componentDidMount() {
		this.getFirstData(this.taskUser);
	}

	// componentDidUpdate() {
	// 	this.getFirstData(this.taskUser);
	// }

	async getFirstData( p ) {
		await p.once("value")
			.then((result) => {
				const r1 = [];
				r1.push(result.val());
				this.setState({
					listUsers: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
		this.props.pasienStore._handleStatusPasien(
			this.state.listUsers[0].statusPasien,
			this.state.listUsers[0].flagActivity,
			);
		// console.log(this.state.listUsers[0].statusPasien);
	}

	render() {
		// console.log(this.state);
		const { listUsers } = this.state;
		// const param = this.props.navigation.state.params;
		return (
			<View >
				<TouchableOpacity
					onPress={this.props.onPress}
					>
					{ listUsers.map(el =>
						<Card key="1" >
							<CardItem>
								<Text>Informasi status pasien</Text>
							</CardItem>
							<CardItem>
								<Text>Status Pasien: { el.statusPasien }</Text>
							</CardItem>
						</Card>,
					)}
				</TouchableOpacity>
			</View>
		);
	}
}
