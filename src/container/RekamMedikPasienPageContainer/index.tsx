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

	componentWillMount() {
		this.getFirstData(this.transaksi);
		this._getRekamMedik(
			this.props.navigation.state.params.name.key ?
			this.props.navigation.state.params.name.key :
			this.props.navigation.state.params.name.currentPasienTerpilihUid);
		this.getFirstDataManagement(this.taskManagement, this.taskShare);
		// console.log("storeHome", this.props.mainStore);
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

	// async _getRekamMedik(uKey) {
	// 	this.props.pasienStore.itemsRekamMedikPasien = [];
	// 	this.props.pasienStore.itemsRekamMedikObatPasien = [];
	// 	this.props.pasienStore._handleGetNameFromKey(
	// 		// this.props.navigation.state.params.name.key,
	// 		uKey,
	// 		this.props.pasienStore.itemsPasien[uKey],
	// 	);
	// 	const { currentPasienNomorRekamMedik } = this.props.pasienStore;
	// 	await db.GetRekamMedikPasienX3(uKey, currentPasienNomorRekamMedik.toString()).then(c1 => {
	// 		c1.forEach(c2 => {
	// 			this.props.pasienStore.itemsRekamMedikPasien.push(c2.val());
	// 		});
	// 	});
	// 	await db.GetRekamMedikObatPasienX3(uKey, currentPasienNomorRekamMedik.toString()).then(d1 => {
	// 		d1.forEach(d2 => {
	// 			this.props.pasienStore.itemsRekamMedikObatPasien.push(d2.val());
	// 		});
	// 	});
	// }

	async _getRekamMedik(uKey) {
		// console.log("storeHome", this.props);
		this.props.pasienStore.itemsRekamMedikDiagPasien = [];
		this.props.pasienStore.itemsRekamMedikObatPasien = [];
		this.props.pasienStore._handleGetNameFromKey(
			uKey,
			this.props.pasienStore.itemsPasien[uKey],
		);
		// const { currentPasienNomorRekamMedik } = this.props.pasienStore;
		await db.GetRekamMedikPasienX4(uKey).then(c1 => {
			c1.forEach(c2 => {
				const res = c2.val();
				console.log("res", res);
				this.props.pasienStore.itemsRekamMedikPasien.push( res );
				this.props.pasienStore.itemsRekamMedikDiagPasien.push( JSON.parse(res.itemDiag) );
				this.props.pasienStore.itemsRekamMedikObatPasien.push( JSON.parse(res.itemObat) );
			});
			// console.log("pasienStore", this.props.pasienStore);
		});
	}

	_onSimpanRekamMedik() {
		const { currentUid, transaksiTotalDiag, transaksiTotalObat, transaksiNomorFakturKeluar,
				transaksiKeluarTimestamp, transaksiKeluarTanggal } = this.props.mainStore;
		const { jasaMedik, sarana, belanjaModal, saham, shareJasaMedik, shareSarana, shareBelanjaModal, shareSaham } = this.props.managementViewStore;

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
		this.props.navigation.navigate("Home");
		// console.log(this.props.managementViewStore);
	}

	render() {
		// console.log(this.props.navigation);
		const { currentPasienTerpilihUsername,
				currentPasienTerpilihUid,
				// itemsRekamMedikDiagPasien,
				// itemsRekamMedikObatPasien
				} = this.props.pasienStore;
		const { currentUserRole, transaksiNomorFaktur } = this.props.mainStore;
		const { itemsRekamMedikPasien } = this.props.pasienStore;
		const key = currentPasienTerpilihUid;

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

		if (currentUserRole === "admin") {
			// selectedCard = cardAdmin;
		} else if (currentUserRole === "dokter") {
			this.selectedCard = menuDokter;
		} else if (currentUserRole === "pasien") {
			// selectedCard = cardPasien;
		} else if (currentUserRole === "resepsionis") {
			// selectedCard = menuResepsionis;
		}

		const viewRiwayatRekamMedik = (
			// console.log("pasienStore", this.props.pasienStore)
			<View>
			{ itemsRekamMedikPasien.map(el =>
					<Card key={el.transaksiNomorFakturKeluar}>
						<CardItem>
							<Text>{el.tanggalPeriksa}</Text>
						</CardItem>
						<CardItem>
							{ JSON.parse(el.itemDiag).map( el1 =>
								<Text key={el1.namaDiag}>{ el1.namaDiag }</Text>,
							) }
						</CardItem>
						<CardItem>
							{ JSON.parse(el.itemObat).map( el1 =>
								<Text key={el1.namaObat}>{ el1.namaObat }</Text>,
							) }
						</CardItem>
					</Card>,
				)
			}
			</View>
		);

		// const viewRiwayatRekamMedik = (
		// 	<List>
		// 		<ListItem key="0">
		// 			<Text> { !!itemsRekamMedikDiagPasien.length && itemsRekamMedikDiagPasien[0].tanggalPeriksa }
		// 			</Text>
		// 		</ListItem>
		// 		<ListItem key="1">
		// 			<Text>Diagnosa</Text>
		// 		</ListItem>
		// 		{ itemsRekamMedikDiagPasien.map(el =>
		// 			<ListItem
		// 				key={el.namaDiag}
		// 				>
		// 				<Text>{" - "}{el.namaDiag}</Text>
		// 			</ListItem>,
		// 			)
		// 		}
		// 	</List>
		// );

		// const viewRiwayatRekamMedikObat = (
		// 	<List>
		// 		{/* <ListItem key="0">
		// 			<Text> { !!itemsRekamMedikObatPasien.length && itemsRekamMedikObatPasien[0].tanggalPeriksa }
		// 			</Text>
		// 		</ListItem> */}
		// 		<ListItem key="1">
		// 			<Text>Obat</Text>
		// 		</ListItem>
		// 		{ itemsRekamMedikObatPasien.map(el =>
		// 			<ListItem
		// 				key={el.namaObat}
		// 				>
		// 				<Text>{" - "}{el.namaObat}</Text>
		// 			</ListItem>,
		// 			)
		// 		}
		// 	</List>
		// );

		return <RekamMedikPasienPage
					navigation={this.props.navigation}
					pasienUsername = {currentPasienTerpilihUsername}
					// pasienRekamMedik = {this.props.pasienStore.itemsRekamMedikPasien.rekamMedik }
					userRole = { currentUserRole }
					selectedCard = { this.selectedCard }
					viewRiwayatRekamMedik = { viewRiwayatRekamMedik }
					// viewRiwayatRekamMedikObat = { viewRiwayatRekamMedikObat }
					transaksiNomorFaktur = { transaksiNomorFaktur }
					/>;
	}
}
