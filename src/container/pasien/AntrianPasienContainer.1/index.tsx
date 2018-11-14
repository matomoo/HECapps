import * as React from "react";
import { observer, inject } from "mobx-react/native";
import {
	// Container, Header, Title,
	Content,
	View, Text, Button,
	Card, CardItem,
	// Icon,
	// Left, Right, Body,
} from "native-base";
import {
	Modal,
	// TouchableHighlight,
	// Text, View, StyleSheet,
}
from "react-native";
import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";
import moment from "moment";
// import styles from "./styles";

export interface Props {
	mainStore?;
	// navigation: any;
}
export interface State {
	listUsers;
	modalVisible;
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
			modalVisible: false,
		};
	}

	toggleModal(visible) {
		this.setState({ modalVisible: visible });
	}

	componentDidMount() {
		this.getFirstData(this.taskUser);
	}

	componentDidUpdate() {
		this.getFirstData(this.taskUser);
	}

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
	}

	handleAntriPoli( ) {
		const { listUsers } = this.state;
		// console.log(listUsers[0].profil.username);
		db.getNumberLastAntrian()
			.then(res => {
				// console.log(res);
				listUsers.forEach(el => {
					db.doPasienDaftarAntrian(
						el.profil._key,
						el.profil.username,
						res.val(),
						el.statusPasien === "BPJS" ? "UMUM" : "BPJS",
						moment().format("YYYY-MM-DD"),
						el.statusPasien,
					);
				});
			});
	}

	render() {
		// console.log(this.state);
		const { listUsers } = this.state;
		// const param = this.props.navigation.state.params;
		return (
			<View padder>
				<Modal animationType = {"slide"} transparent = {false}
					visible = {this.state.modalVisible}
					onRequestClose = {() => { console.log("Modal has been closed."); }}
				>
					{ listUsers.map(el =>
						<Content padder>
							<Card key="1">
								<CardItem header>
									<View>
										<Text>Informasi status pasien</Text>
									</View>
								</CardItem>
								<CardItem>
									<View>
										<Text>Status Pasien: { el.statusPasien }</Text>
									</View>
								</CardItem>
							</Card>
							<Card key="3">
								<CardItem header>
									<Text>Informasi nomor antrian</Text>
								</CardItem>
								<CardItem>
									<Text>Nomor Antrian: { el.flagActivity === "antriPoliklinik" ? el.nomorAntrianPasien : "Belum mendaftar antrian." }</Text>
								</CardItem>
								<CardItem>
									<View>
										<Button block onPress={() => this.handleAntriPoli()}>
											<Text>Ambil Nomor Antrian</Text>
										</Button>
									</View>
								</CardItem>
							</Card>
						</Content>,
						)
					}

					<View padder>
						<Button block onPress={() => this.toggleModal(!this.state.modalVisible) }>
							<Text>Close</Text>
						</Button>
					</View>
				</Modal>
				<View padder>
				{ listUsers.map(el =>
					<Card key="2">
						<CardItem header button bordered
							onPress = {() => { this.toggleModal(true); } }
						>
							<Text>Informasi status pasien dan nomor antrian</Text>
						</CardItem>
						<CardItem>
							<Text>Status Pasien: { el.statusPasien }</Text>
						</CardItem>
						<CardItem>
							<Text>Nomor Antrian: { el.flagActivity === "antriPoliklinik" ? el.nomorAntrianPasien : "Belum mendaftar antrian." }</Text>
						</CardItem>
					</Card>,
				)}
				</View>
			</View>
		);
	}
}
