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

	constructor(props) {
		super(props);
		this.transaksi = db1.db.ref(`transaksi/transaksiNomorFakturKeluar`);
		this.taskManagement = db1.db.ref(`management/percentageOfShare`);
		// this.state = {
		// 	// jasaMedikInput: this.taskManagement.jasaMedik,
		// 		};
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				this.props.mainStore.transaksiNomorFakturKeluarOnChange(r1);
				db1.db.ref(`transaksi`).update({
					transaksiNomorFakturKeluar : parseInt(r1, 10) + 1,
				});
				// console.log(r1);
				// console.log(this.props.mainStore);
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
		this.getFirstDataManagement(this.taskManagement);
	}

	getFirstDataManagement( p ) {
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
