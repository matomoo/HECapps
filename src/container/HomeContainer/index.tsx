import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { CardItem,
			Left,
			Text,
			Right,
			Icon,
			List,
			ListItem,
		} from "native-base";

import Home from "../../stories/screens/Home";
import { db } from "../../firebase";

export interface Props {
	navigation: any;
	mainStore: any;
	authRole: any;
}
export interface State {}

@inject("mainStore")
@observer
export default class HomeContainer extends React.Component<Props, State> {

	componentWillMount() {
		// this.props.mainStore.fetchItems(data);
		this.onAmbilDataAwalAplikasi();
	}

	componentDidMount() {
			this.onAmbilDataAwalPasien();
	}

	async onAmbilDataAwalAplikasi() {
		const { currentUid } = this.props.mainStore;
		await db.GetSingleUsers(currentUid).then(snapshot => {
			this.props.mainStore.currentUsername = snapshot.val().username;
			this.props.mainStore.currentUserRole = snapshot.val().role;
		});
		// console.log(this.props);
		this.onAmbilDataAwalPasien();
	}

	onAmbilDataAwalPasien() {
		const { currentUserRole, currentUid } = this.props.mainStore;
			if (currentUserRole === "pasien") {
				db.getNomorAntrianPasien(currentUid)
					.then(res => {
						this.props.mainStore.nomorAntrianPoli = res.val();
					});
		}
	}

	render() {
		const list = this.props.mainStore.items.toJS();
		const key = this.props.mainStore.currentUid;
		const { currentUserRole, nomorAntrianPoli } = this.props.mainStore;

		const cardPasien = (
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
					<Left><Text>Daftar Antrian Poliklinik { nomorAntrianPoli ? " - " + nomorAntrianPoli : " - loading data..." }</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
			</List>
		);

		const cardResepsionis = (
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
		);

		const cardAdmin = (
			<CardItem
					button
					// onPress={() => this.props.navigation.navigate("PasienPage")}
					>
					<Left><Text>Ubah Role</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
		);

		const cardDokter = (
				<CardItem
					button
					onPress={() => this.props.navigation.navigate("PasienPage")} >
					<Left><Text>List Daftar Tunggu</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</CardItem>
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

		const cardApotek = (
			<List>
				<ListItem
					button
					onPress={() => this.props.navigation.navigate("DaftarApotekPage")}
					>
					<Left><Text>List Daftar Obat Apotek</Text></Left>
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
			list={list}
			authUser={this.props.mainStore.currentUsername}
			authRole={this.props.mainStore.currentUserRole}
			authUid={this.props.mainStore.currentUid}
			selectedCard = {selectedCard}
		/>;
	}
}
