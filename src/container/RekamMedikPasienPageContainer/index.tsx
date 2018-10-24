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
} from "native-base";
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
		// let now = moment().format("YYYY-MMM-DD");
		// console.log(now, moment().format("LLLL"));

		this.getFirstData(this.transaksi);
		this._getRekamMedik(
			this.props.navigation.state.params.name.key ?
			this.props.navigation.state.params.name.key :
			this.props.navigation.state.params.name.currentPasienTerpilihUid);
		this.getFirstDataManagement(this.taskManagement, this.taskShare);
		console.log("storeHome", this.props.mainStore);
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
		this.props.pasienStore.itemsRekamMedikPasien = [];
		this.props.pasienStore.itemsRekamMedikObatPasien = [];
		this.props.pasienStore._handleGetNameFromKey(
			// this.props.navigation.state.params.name.key,
			uKey,
			this.props.pasienStore.itemsPasien[uKey],
		);
		const { currentPasienNomorRekamMedik } = this.props.pasienStore;
		await db.GetRekamMedikPasienX3(uKey, currentPasienNomorRekamMedik.toString()).then(c1 => {
			// console.log(currentPasienNomorRekamMedik);
			// const snap = c1.val();
			// Object.keys(snap).map(c2 => {
			// 	this.props.pasienStore.itemsRekamMedikPasien.push
			// })
			// this.props.pasienStore.itemsRekamMedikPasien = c1.val() ;
			c1.forEach(c2 => {
				this.props.pasienStore.itemsRekamMedikPasien.push(c2.val());
				// console.log(c2.val());
			});
		});
		await db.GetRekamMedikObatPasienX3(uKey, currentPasienNomorRekamMedik.toString()).then(d1 => {
			d1.forEach(d2 => {
				this.props.pasienStore.itemsRekamMedikObatPasien.push(d2.val());
			});
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
				itemsRekamMedikPasien,
				itemsRekamMedikObatPasien } = this.props.pasienStore;
		const { currentUserRole, transaksiNomorFaktur } = this.props.mainStore;
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
			<List>
				<ListItem key="0">
					<Text> { !!itemsRekamMedikPasien.length && itemsRekamMedikPasien[0].tanggalPeriksa }
					</Text>
				</ListItem>
				<ListItem key="1">
					<Text>Diagnosa</Text>
				</ListItem>
				{ itemsRekamMedikPasien.map(el =>
					<ListItem
						key={el._key}
						>
						<Text>{" - "}{el.namaDiag}</Text>
					</ListItem>,
					)
				}
			</List>
		);

		const viewRiwayatRekamMedikObat = (
			<List>
				{/* <ListItem key="0">
					<Text> { !!itemsRekamMedikObatPasien.length && itemsRekamMedikObatPasien[0].tanggalPeriksa }
					</Text>
				</ListItem> */}
				<ListItem key="1">
					<Text>Obat</Text>
				</ListItem>
				{ itemsRekamMedikObatPasien.map(el =>
					<ListItem
						key={el._key}
						>
						<Text>{" - "}{el.namaObat}</Text>
					</ListItem>,
					)
				}
			</List>
		);

		return <RekamMedikPasienPage
					navigation={this.props.navigation}
					pasienUsername = {currentPasienTerpilihUsername}
					// pasienRekamMedik = {this.props.pasienStore.itemsRekamMedikPasien.rekamMedik }
					userRole = { currentUserRole }
					selectedCard = { this.selectedCard }
					viewRiwayatRekamMedik = { viewRiwayatRekamMedik }
					viewRiwayatRekamMedikObat = { viewRiwayatRekamMedikObat }
					transaksiNomorFaktur = { transaksiNomorFaktur }
					/>;
	}
}
