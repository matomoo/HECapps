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
		} from "native-base";

import Home from "../../stories/screens/Home";
import { db } from "../../firebase";

export interface Props {
	navigation: any;
	mainStore: any;
	authRole: any;
}
export interface State {
	myPoli: any;
	myNomorAntrian: any;
}

@inject("mainStore")
@observer
export default class HomeContainer extends React.Component<Props, State> {

	constructor() {
		super();
		this.state = {
			myPoli: "",
			myNomorAntrian: "",
		};
	}

	async componentWillMount() {
		// console.log("will");
		await this.onAmbilDataAwalAplikasi();
		// await this.onAmbilDataAwalPasien();
	}

	async componentDidMount() {
		// console.log("did");
		await this.onAmbilDataAwalPasien();
	}

	async onAmbilDataAwalAplikasi() {
		const { currentUid } = this.props.mainStore;
		await db.GetSingleUsers(currentUid).then(snapshot => {
			this.props.mainStore.currentUsername = snapshot.val().username;
			this.props.mainStore.currentUserRole = snapshot.val().role;
		});
		// console.log(this.props);
		await this.onAmbilDataAwalPasien();
	}

	async onAmbilDataAwalPasien() {
		const { currentUid, currentUserRole, currentUsername } = this.props.mainStore;
		if (currentUserRole === "pasien") {
			await db.getNomorAntrianPasien(currentUid)
				.then(res => {
					this.props.mainStore.nomorAntrianPoli = res.val();
					this.setState({ myNomorAntrian: res.val() });
					// console.log(this.props);
				});
		} else if ( currentUserRole === "dokter" ) {
			await db.getPolixxByDokter( currentUsername ).then(c1 => {
				// console.log(c1.val());
				const c2 = c1.val();
				Object.keys(c2).map(c3 => {
					// console.log(c2);
					this.setState({
						myPoli: c2[c3].poli,
					});
					// console.log(this.state.myPoli);
				});
			}).catch(() => {
				this.setState({
					myPoli: "Idle",
				});
			});
		}
	}

	render() {
		// const list = this.props.mainStore.items.toJS();
		const key = this.props.mainStore.currentUid;
		const { currentUserRole } = this.props.mainStore;

		const cardPasien = (
			<Card>
				<List>
					<ListItem
						key="1"
						button
						onPress={() => this.props.navigation.navigate("RekamMedikPasien", {name: {key}} )}
						>
						<Left><Text>Riwayat Rekam Medik</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					<ListItem
						key="2"
						button
						onPress={() => this.props.navigation.navigate("DaftarAntrianPoliPage", {name: {key}} )}
						>
						<Left><Text>Daftar Antrian Poliklinik { this.state.myNomorAntrian ? " - " + this.state.myNomorAntrian : " - loading data..." }</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
				</List>
			</Card>
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
						onPress={() => this.props.navigation.navigate("InputBarangApotekPage")}
						>
						<Left><Text>Input Barang ke Apotek</Text></Left>
						<Right><Icon active name="ios-arrow-forward"/></Right>
					</ListItem>
					<ListItem
						key="2"
						button
						onPress={() => this.props.navigation.navigate("DaftarApotekPage")}
						>
						<Left><Text>List Daftar Obat Apotek</Text></Left>
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
			</Card>
		);

		const cardAdmin = (
			<Card>
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("InputConsDiagPage")}
					>
					<Left><Text>Input Constant Diagnosa</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
			</Card>
		);

		const cardBilling = (
			<List>
				<ListItem
					button
					onPress={() => this.props.navigation.navigate("DaftarBillingPage")}
					>
					<Left><Text>List Daftar Billing</Text></Left>
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
