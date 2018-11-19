import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { CardItem,
			Left,
			Text,
			Right,
			Icon,
			List,
			ListItem,
			Card,
			View,
			// Content,
		} from "native-base";

import Home from "../../stories/screens/Home";
import AntrianPasien from "../pasien/AntrianPasienContainer";
import StatusPasien from "../pasien/StatusPasienContainer";
import { db } from "../../firebase";
import { AsyncStorage } from "react-native";

// console.disableYellowBox = true;

export interface Props {
	navigation: any;
	mainStore: any;
	authRole: any;
	pasienStore;
}
export interface State {
	myPoli: any;
	myNomorAntrian: any;
	myDokter;
}

@inject("mainStore", "pasienStore")
@observer
export default class HomeContainer extends React.Component<Props, State> {

	constructor() {
		super();
		// prepare to disable all state
		this.state = {
			myPoli: "",
			myNomorAntrian: "",
			myDokter: "",
		};
	}

	componentDidMount() {
		// console.log("did");
		this.onAmbilDataAwalAplikasi();
		// this.onAmbilDataAwalPasien();
	}

	async onAmbilDataAwalAplikasi() {
		const { currentUid } = this.props.mainStore;
		await db.GetSingleUsers(currentUid).then(snapshot => {
			this.props.mainStore.currentUsername = snapshot.val().username;
			this.props.mainStore.currentUserRole = snapshot.val().role;
		});
		// await this.onAmbilDataAwalPasien();
		// const value = AsyncStorage.getItem("@MySuperStore:xockey");
		// if (value !== null ) {
		await AsyncStorage.setItem("@MySuperStore:xockey", currentUid);
		// }
	}
	// prepare to delete this
	// async onAmbilDataAwalPasien() {
	// 	const { currentUid, currentUserRole, currentUsername } = this.props.mainStore;
	// 	if ( currentUserRole === "pasien" ) {
	// 		await db.getNomorAntrianPasien(currentUid)
	// 			.then(res => {
	// 				this.props.mainStore.nomorAntrianPoli = res.val();
	// 				this.setState({
	// 					myNomorAntrian: res.val().nomorAntrianPasien,
	// 					myDokter: res.val().dokterPeriksa,
	// 				});
	// 				// console.log(this.props);
	// 			});
	// 		await db.getPasienInfoFromFb(currentUid)
	// 			.then( res => {
	// 				this.props.pasienStore.stoStatusPasien = res.val().statusPasien;
	// 			});
	// 	} else if ( currentUserRole === "dokter" ) {
	// 		await db.getPolixxByDokter( currentUsername ).then(c1 => {
	// 			// console.log(c1.val());
	// 			const c2 = c1.val();
	// 			Object.keys(c2).map(c3 => {
	// 				// console.log(c2);
	// 				this.setState({
	// 					myPoli: c2[c3].poli,
	// 				});
	// 				// console.log(this.state.myPoli);
	// 			});
	// 		}).catch(() => {
	// 			this.setState({
	// 				myPoli: "Idle",
	// 			});
	// 		});
	// 	}
	// }

	render() {
		// console.log(this.props.pasienStore);
		const key = this.props.mainStore.currentUid;
		const { currentUserRole } = this.props.mainStore;

		const cardPasien = (
			<View>
				<Card>
					<List>
						<ListItem
							key="1"
							button
							onPress={() => {
								this.props.navigation.navigate("RekamMedikPasienPage", {name: {key}} );
								// this._getRekamMedik({key});
							}}
							>
							<Left><Text>Riwayat Rekam Medik</Text></Left>
							<Right><Icon active name="ios-arrow-forward"/></Right>
						</ListItem>
						{/* <ListItem
							key="2"
							button
							onPress={() => this.props.navigation.navigate("DaftarAntrianPoliPage", {name: {key}} )}
							>
							<Left>
								<View style={{padding: 1, flexDirection: "column"}}>
									<Text>Daftar Antrian Poliklinik { this.state.myNomorAntrian ? " - " + this.state.myNomorAntrian : " - loading data..." }</Text>
									<Text>Dokter periksa: { this.state.myDokter ? this.state.myDokter : "-" }</Text>
								</View>
							</Left>
							<Right><Icon active name="ios-arrow-forward"/></Right>
						</ListItem> */}
						{/* <ListItem
							key="3"
							button
							onPress={() => {
										this.props.navigation.navigate("InputPengaturanPasienPage", {name: {key}} );
									}}
							>
							<Left><Text>Status Pasien - { this.props.pasienStore.stoStatusPasien }</Text></Left>
							<Right><Icon active name="ios-arrow-forward"/></Right>
						</ListItem> */}
						<ListItem
							key="4"
							button
							onPress={() => this.props.navigation.navigate("ProfilePasienPage")} >
							<Left><Text>Profil Pasien</Text></Left>
							<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					</List>
				</Card>
				<StatusPasien onPress={() => this.props.navigation.navigate("InputPengaturanPasienPage", {name: {key}} )} />
				<AntrianPasien onPress={() => this.props.navigation.navigate("DaftarAntrianPoliPage", {name: {key}} )} />
			</View>
		);

		const cardResepsionis = (
			<Card>
				<List>
					<ListItem
						key="1"
						button
						onPress={() => this.props.navigation.navigate("PoliklinikPage")}
						>
						<Left><Text>Pengaturan Poliklinik</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					{/* <ListItem
						key="2"
						button
						onPress={() => this.props.navigation.navigate("PasienPage")}
						>
						<Left><Text>List Daftar Semua Pasien</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem> */}
					<ListItem
						key="3"
						button
						onPress={() => this.props.navigation.navigate("DaftarTungguPage")}
						>
						<Left><Text>List Daftar Tunggu Aktif</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
				</List>
			</Card>
		);

		const cardApotek = (
			<Card>
				<List>
					<ListItem
						key="1"
						button
						onPress={() => this.props.navigation.navigate("InputBarangApotekPage", {action: "new"} )}
					>
						<Left><Text>Input Barang ke Apotek</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					<ListItem
						key="2"
						button
						onPress={() => this.props.navigation.navigate("DaftarObatApotekPage")}
					>
						<Left><Text>List Daftar Obat Apotek</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					<ListItem
						key="3"
						button
						onPress={() => this.props.navigation.navigate("AntriApotekPage")}
					>
						<Left><Text>List Daftar Antri Apotek</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
				</List>
			</Card>
		);

		const cardDokter = (
			<Card>
				<CardItem>
					<Text>Poli : { this.state.myPoli }</Text>
				</CardItem>
				<CardItem
					key="2"
					button
					onPress={() => this.props.navigation.navigate("DaftarTungguPage")} >
					<Left><Text>List Daftar Tunggu</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
				<CardItem
					key="3"
					button
					onPress={() => this.props.navigation.navigate("POfSharePage")} >
					<Left><Text>View percentage of share</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
				{/* <CardItem
					key="4"
					button
					onPress={() => this.props.navigation.navigate("ProfileDokterPage")} >
					<Left><Text>Profil Dokter</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem> */}
			</Card>
		);

		const cardAdmin = (
			<Card>
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("DaftarDiagPage")}
					>
					<Left><Text>Daftar Diagnosis</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("InputConsDiagPage", {flagAction: "new"})}
					>
					<Left><Text>Input Constant Diagnosa</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("InputTransaksiNomorFakturPage")}
					>
					<Left><Text>Input Transaksi Nomor Faktur</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("DaftarUserPage")}
					>
					<Left><Text>Daftar User</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
			</Card>
		);

		const cardBilling = (
			<Card>
				<List>
					<ListItem
						button
						onPress={() => this.props.navigation.navigate("AntriBillingPage")}
					>
						<Left><Text>Antri Billing</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
				</List>
			</Card>
		);

		const cardManagement = (
			<List>
				<ListItem
					button
					onPress={() => this.props.navigation.navigate("ManagementPage")}
				>
					<Left><Text>Pengaturan Percentage of Share</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
			</List>
		);

		let selectedCard;
		if (currentUserRole === "admin") {
			selectedCard = cardAdmin;
		} else if (currentUserRole === "dokter") {
			selectedCard = cardDokter;
		} else if (currentUserRole === "pasien") {
			selectedCard = cardPasien;
		} else if (currentUserRole === "resepsionis") {
			selectedCard = cardResepsionis;
		} else if (currentUserRole === "billing") {
			selectedCard = cardBilling;
		} else if (currentUserRole === "apotek") {
			selectedCard = cardApotek;
		} else if (currentUserRole === "management") {
			selectedCard = cardManagement;
		}

		// console.log(selectedCard);

		return <Home
			navigation={this.props.navigation}
			// list={list}
			authUser={this.props.mainStore.currentUsername}
			authRole={this.props.mainStore.currentUserRole}
			authUid={this.props.mainStore.currentUid}
			selectedCard = {selectedCard}
		/>;
	}
}
