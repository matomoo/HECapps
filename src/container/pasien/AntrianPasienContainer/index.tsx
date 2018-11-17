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
import {
// 	Modal,
	// TouchableHighlight,
// 	// Text, View, StyleSheet,
	TouchableOpacity,
}
from "react-native";
// import { db } from "../../../firebase";
// import moment from "moment";
import * as db1 from "../../../firebase/firebase";
// import styles from "./styles";

export interface Props {
	mainStore?;
	onPress?;
	// navigation: any;
}
export interface State {
	listUsers;
	btnDisabled;
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
			btnDisabled: true,
		};
	}

	componentDidMount() {
		this.getFirstData(this.taskUser);
	}

	async getFirstData( p ) {
		await p.once("value")
			.then((result) => {
				const r1 = [];
				r1.push(result.val());
				this.setState({
					listUsers: r1,
					btnDisabled: r1[0].flagActivity === "userIdle" ? false : true,
				});
				console.log(r1);
			}).catch((err) => {
				console.log(err);
		});
	}

	render() {
		const { listUsers } = this.state;
		return (
			<View>
				<TouchableOpacity
						onPress={this.props.onPress}
						disabled={this.state.btnDisabled}
						>
					{ listUsers.map(el =>
						<Card key="2">
							<CardItem>
								<Text>Informasi nomor antrian</Text>
							</CardItem>
							<CardItem>
								<View>
									<Text>Nomor Antrian: { el.flagActivity === "antriPoliklinik"
											? el.nomorAntrianPasien + " pada tanggal " + el.tanggalBooking
											: "Belum mendaftar antrian." }</Text>
									{ el.statusPasien === "Umum" &&
										<Text>Dokter periksa: {el.dokterPeriksa}</Text>
									}
								</View>
							</CardItem>
						</Card>,
					)}
				</TouchableOpacity>
			</View>
		);
	}
}
