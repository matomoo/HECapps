import * as React from "react";
import { observer, inject } from "mobx-react/native";
// import _ from "lodash";
import { db } from "../../firebase";
import * as db1 from "../../firebase/firebase";

import RekamMedikPasienPage from "../../stories/screens/RekamMedikPasienPage";
import { List,
			ListItem,
			Left,
			Right,
			Text,
			Icon,
			Card, CardItem,
			View,
} from "native-base";
// import Content from "../../theme/components/Content";
// import moment from "moment";
// import {RNHTMLtoPDF} from "react-native-html-to-pdf";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
	managementViewStore;
}

export interface State {}

@inject ("pasienStore", "mainStore", "managementViewStore")
@observer
export default class RekamMedikPasienPageContainer extends React.Component<Props, State> {
	selectedCard;
	transaksi;
	taskManagement;
	taskShare;

	constructor(props) {
		super(props);
		this.transaksi = db1.db.ref(`transaksi/transaksiNomorFakturKeluar`);
		this.taskManagement = db1.db.ref(`management/percentageOfShare`);
		const { currentUid } = this.props.mainStore;
		this.taskShare = db1.db.ref(`management/percentageOfShareDetail/${currentUid}`);

		// this.state = {
		// 	// jasaMedikInput: this.taskManagement.jasaMedik,
		// 		};
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				if (this.props.mainStore.transaksiNomorFakturKeluar === "ny") {
					db1.db.ref(`transaksi`).update({
						transaksiNomorFakturKeluar : parseInt(r1, 10) + 1,
					});
				}
				this.props.mainStore.transaksiNomorFakturKeluarOnChange(r1);
			}).catch((err) => {
				console.log(err);
		});
	}

	componentDidMount() {
		const { currentUserRole } = this.props.mainStore;
		if (currentUserRole === "dokter") {
			this.getFirstData(this.transaksi);
			this.getFirstDataManagement(this.taskManagement, this.taskShare);
		} else if (currentUserRole === "pasien") {
			db.GetRekamMedikPasien(this.props.navigation.state.params.name.key).then(snapshot => {
				this.props.pasienStore.itemsPasien = snapshot.val();
				this.props.pasienStore.currentPasienTerpilihUsername = snapshot.val().profil.username;
			});
		}
		this._getRekamMedik(
			this.props.navigation.state.params.name.key ?
			this.props.navigation.state.params.name.key :
			this.props.navigation.state.params.name.currentPasienTerpilihUid);
		// console.log("props", this.props.navigation.state.params.name.key);
	}

	getFirstDataManagement( p, q ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				this.props.managementViewStore.jasaMedik = r1.jasaMedik;
				this.props.managementViewStore.sarana = r1.sarana;
				this.props.managementViewStore.belanjaModal = r1.belanjaModal;
				this.props.managementViewStore.saham = r1.saham;
			}).catch((err) => {
				console.log(err);
		});

		q.once("value")
			.then((rest) => {
				// console.log("res", res);
				const res = rest.val();
				this.props.managementViewStore.shareJasaMedikOnUpdate ( res.shareJasaMedik );
				this.props.managementViewStore.shareSaranaOnUpdate ( res.shareSarana );
				this.props.managementViewStore.shareBelanjaModalOnUpdate ( res.shareBelanjaModal );
				this.props.managementViewStore.shareSahamOnUpdate ( res.shareSaham );
			}).catch((err) => {
				console.log(err);
			});
	}

	async _getRekamMedik(uKey) {
		// console.log("pasienStore", this.props.pasienStore);
		this.props.pasienStore.itemsRekamMedikPasien = [];
		// this.props.pasienStore.itemsRekamMedikDiagPasien = [];
		// this.props.pasienStore.itemsRekamMedikObatPasien = [];
		this.props.pasienStore._handleGetNameFromKey(
			uKey,
			this.props.pasienStore.itemsPasien[uKey],
		);
		// const { currentPasienNomorRekamMedik } = this.props.pasienStore;
		await db.GetRekamMedikPasienX4(uKey).then(c1 => {
			c1.forEach(c2 => {
				const res = c2.val();
				// console.log("res", res);
				this.props.pasienStore.itemsRekamMedikPasien.push( res );
				// this.props.pasienStore.itemsRekamMedikDiagPasien.push( JSON.parse(res.itemDiag) );
				// this.props.pasienStore.itemsRekamMedikObatPasien.push( JSON.parse(res.itemObat) );
			});
			// console.log("pasienStore", this.props.pasienStore);
		});
	}

	_onSimpanRekamMedik() {
		const { currentUid, transaksiTotalDiag, transaksiTotalObat, transaksiNomorFakturKeluar,
				transaksiKeluarTimestamp, transaksiKeluarTanggal } = this.props.mainStore;
		const { jasaMedik, sarana, belanjaModal, saham, shareJasaMedik, shareSarana, shareBelanjaModal, shareSaham } = this.props.managementViewStore;
		const { currentPasienTerpilihUid } = this.props.pasienStore;

		db1.db.ref(`management/percentageOfShareDetail/${currentUid}`).update({
			shareJasaMedik: isNaN(shareJasaMedik)
							? (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(jasaMedik, 10) / 100
							: parseInt(shareJasaMedik, 10) + ((parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(jasaMedik, 10) / 100),
			shareSarana: isNaN(shareSarana)
							? (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(sarana, 10) / 100
							: parseInt(shareSarana, 10) + ((parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(sarana, 10) / 100),
			shareBelanjaModal: isNaN(shareBelanjaModal)
							? (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(belanjaModal, 10) / 100
							: parseInt(shareBelanjaModal, 10) + ((parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(belanjaModal, 10) / 100),
			shareSaham: isNaN(shareSaham)
							? (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(saham, 10) / 100
							: parseInt(shareSaham, 10) + ((parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(saham, 10) / 100),
		});

		db1.db.ref(`management/percentageOfShareDetail/${currentUid}/${transaksiNomorFakturKeluar}`).update({
			transaksiKeluarTanggal: transaksiKeluarTanggal,
			transaksiKeluarTimestamp: transaksiKeluarTimestamp,
			transaksiNomorFakturKeluar: transaksiNomorFakturKeluar,
			shareJasaMedik: (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(jasaMedik, 10) / 100,
			shareSarana: (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(sarana, 10) / 100,
			shareBelanjaModal: (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(belanjaModal, 10) / 100,
			shareSaham: (parseInt(transaksiTotalDiag, 10) + parseInt(transaksiTotalObat, 10)) * parseInt(saham, 10) / 100,
		});
		this.props.mainStore.resetNomorFaktur();
		db1.db.ref(`pasiens/${currentPasienTerpilihUid}`)
			.update({
				flagActivity: "updateRekamMedikDone",
			});
		this.props.navigation.navigate("Home");
		// console.log(this.props.managementViewStore);
	}

	_onApotekSimpanData( p ) {
		const { currentUserRole } = this.props.mainStore;
		if (currentUserRole === "apotek") {
			const { currentPasienTerpilihUid } = this.props.pasienStore;
			db1.db.ref(`transaksiKeluar/${p}`).update({
				statusApotek: "Sudah",
			});
			db1.db.ref(`pasiens/${currentPasienTerpilihUid}`)
			.update({
				flagActivity: "updateApotekDone",
			});
			this.props.navigation.navigate("Home");
		}
	}

	_onBillingSimpanData( p ) {
		const { currentUserRole } = this.props.mainStore;
		if (currentUserRole === "billing") {
			const { currentPasienTerpilihUid } = this.props.pasienStore;
			db1.db.ref(`transaksiKeluar/${p}`).update({
				statusBilling: "Sudah",
			});
			db1.db.ref(`pasiens/${currentPasienTerpilihUid}`)
				.update({
					flagActivity: "userIdle",
					dokterPeriksa: "-",
					nomorAntrianPasien: 9999,
					tanggalBooking: "",
			});
			db1.db.ref(`daftarTunggu`).child(`${currentPasienTerpilihUid}`).remove();
			this.props.navigation.navigate("Home");
			// this.createPDF();
			// console.log("og pdf");
		}
	}

	// async createPDF() {
	// 	let options = {
	// 		html: "<h1>PDF TEST</h1>",
	// 		fileName: "test",
	// 		directory: "Documents",
	// 	};

	// 	try {
	// 		let file = await RNHTMLtoPDF.convert(options);
	// 		alert(file.filePath);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// 	console.log("og pdf2");
	// 	}

	render() {
		// console.log(this.props.navigation);
		const { currentPasienTerpilihUsername,
				currentPasienTerpilihUid,
				itemsRekamMedikPasien,
				// itemsRekamMedikDiagPasien, itemsRekamMedikObatPasien
				} = this.props.pasienStore;
		const { currentUserRole, transaksiNomorFaktur } = this.props.mainStore;
		const key = currentPasienTerpilihUid;
		// console.log( itemsRekamMedikPasien);
		const menuDokter = (
			<List>
				<ListItem
					key="3"
					onPress={() => this.props.navigation.navigate("InputDiagnosaPage", {name : {key}} )}
					>
					<Left><Text>Input Diagnosa</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
				<ListItem
					key="2"
					onPress={() => this.props.navigation.navigate("InputDiagObatPage", {name : {key}} )}
					>
					<Left><Text>Input Obat</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
				<ListItem
					key="4"
					onPress={() => this._onSimpanRekamMedik() }
					>
					<Left><Text>Simpan Rekam Medik</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
			</List>
		);

		// const menuApotek = props => (
		// 	<CardItem button
		// 		onPress={() => this._onApotekSimpanData(props._key) } >
		// 		<Text>Status Apotek: { props.statusApotek }</Text>
		// 	</CardItem>
		// );

		// const menuBilling = (
		// 	<List>
		// 		<ListItem
		// 			key="6"
		// 			onPress={() => this._onBillingSimpanData() }
		// 			>
		// 			<Left><Text>Simpan Data</Text></Left>
		// 			<Right><Icon active name="ios-arrow-forward"/></Right>
		// 		</ListItem>
		// 	</List>
		// );

		if (currentUserRole === "apotek") {
			// this.selectedCard = menuApotek;
		} else if (currentUserRole === "dokter") {
			this.selectedCard = menuDokter;
		} else if (currentUserRole === "billing") {
			// this.selectedCard = menuBilling;
		} else if (currentUserRole === "resepsionis") {
			// selectedCard = menuResepsionis;
		}

		const viewRiwayatRekamMedik = (
			// console.log("pasienStore", this.props.pasienStore)
			<View>
				{ itemsRekamMedikPasien.map(el =>
						(currentUserRole === "dokter"
						|| currentUserRole === "apotek" && el.statusApotek === "Belum"
						|| currentUserRole === "billing" && el.statusBilling === "Belum"
						|| currentUserRole === "pasien"
						) &&
						<Card key={el.transaksiNomorFakturKeluar}>
							<CardItem>
								<Text>{el.tanggalPeriksa} ({el.transaksiNomorFakturKeluar})</Text>
							</CardItem>
							<CardItem>
								<Text>
									Total Faktur: {parseInt(el.transaksiTotalDiag, 10) + parseInt(el.transaksiTotalObat, 10)}
								</Text>
							</CardItem>
							<CardItem>
								<Text>Diag: { JSON.parse(el.itemDiag).map( el1 => el1.namaDiag ).join(", ") }</Text>
							</CardItem>
							<CardItem>
								<Text>Obat : { typeof el.itemObat !== "undefined" &&
											JSON.parse(el.itemObat).map( el1 => el1.namaObat ).join(", ")
										}
								</Text>
							</CardItem>
							<CardItem></CardItem>
							{ currentUserRole === "apotek" &&
								<CardItem button
									onPress={() => this._onApotekSimpanData(el._key) } >
									<Text>Status Apotek: { el.statusApotek }</Text>
								</CardItem>
							}
							{ currentUserRole === "billing" &&
								<CardItem button
									onPress={() => this._onBillingSimpanData(el._key) } >
									<Text>Status Billing: { el.statusBilling }</Text>
								</CardItem>
							}
						</Card>,
					)
				}
			</View>
		);

		return <RekamMedikPasienPage
					navigation={this.props.navigation}
					pasienUsername = {currentPasienTerpilihUsername}
					userRole = { currentUserRole }
					selectedCard = { this.selectedCard }
					viewRiwayatRekamMedik = { viewRiwayatRekamMedik }
					transaksiNomorFaktur = { transaksiNomorFaktur }
					/>;
	}
}