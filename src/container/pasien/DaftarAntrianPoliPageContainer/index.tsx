import * as React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarAntrianPoliPage from "../../../stories/screens/pasien/DaftarAntrianPoliPage";
import {
	View,
	Text,
	Card,
	CardItem,
	Button,
} from "native-base";
import { db } from "../../../firebase";
import moment from "moment";

export interface Props {
	navigation: any;
	mainStore: any;
	pasienStore;
}

export interface State {
	chosenDate: any;
	nomorAntriFromFb: any;
	isStatusPasien;
	isDokters;
	isDokterPeriksa;
	sttFlagActivity;
}

@inject("mainStore", "pasienStore")
@observer
export default class DaftarAntrianPoliPageContainer extends React.Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			chosenDate: new Date(),
			nomorAntriFromFb: "",
			isStatusPasien: "Umum",
			isDokters: [],
			isDokterPeriksa: "",
			sttFlagActivity: "",
		};
	}

	componentDidMount() {
		this.getNoAntri();
		this.setState({
			isStatusPasien: this.props.pasienStore.stoStatusPasien,
			sttFlagActivity: this.props.pasienStore.stoPasienFlagActivity,
		});
		this._getListDokter();
	}

	getNoAntri() {
		// const { currentUid } = this.props.mainStore;
		// console.log(currentUid);
		db.getNumberLastAntrian(moment().format("YYYY-MM-DD"))
			.then(res => {
				// console.log("hahaha", res.val());
				this.setState({ nomorAntriFromFb: res.val() === null ? 1 : res.val() });
				// if (res.val() !== null ) {
				// }
			});
	}

	_getListDokter() {
		db.getListAllDokter()
			.then(c1 => {
				this.setState({
					isDokters: this.snapshotToArray(c1),
				});
			});
	}

	snapshotToArray(snapshot) {
		const returnArr = [];
		snapshot.forEach(function (childSnapshot) {
			const item = childSnapshot.val();
			item.key = childSnapshot.key;
			returnArr.push(item);
		});
		return returnArr;
	}

	handleAntriPoli(uid, uName) {
		if (this.state.sttFlagActivity === "userIdle") {
			console.log("proses");
			db.doPasienDaftarAntrian(
				uid,
				uName,
				parseInt(this.state.nomorAntriFromFb, 10),
				this.state.isDokterPeriksa ? this.state.isDokterPeriksa : "BPJS",
				moment().format("YYYY-MM-DD"),
				this.state.isStatusPasien,
			);
		}
		// db.getNumberLastAntrian(uid)
		// 	.then(res => {
		// 		db.doPasienDaftarAntrian(
		// 			uid,
		// 			uName,
		// 			res.val(),
		// 			this.state.isDokterPeriksa ? this.state.isDokterPeriksa : "BPJS",
		// 			moment().format("YYYY-MM-DD"),
		// 			this.state.isStatusPasien,
		// 		);
		// 		// this.setState({ nomorAntriFromFb: res.val() + 1 });
		// 		// this.props.mainStore.nomorAntriFromFbanPoli = this.state.nomorAntriFromFb;
		// 	});
		// this.setState({ isNomorAntriFromFban: this.state.nomorAntriFromFb });
		this.props.navigation.navigate("Home");
	}

	// db.doPasienDaftarAntrian(
	// 	el.profil._key,
	// 	el.profil.username,
	// 	res.val(),
	// 	el.statusPasien === "BPJS" ? "UMUM" : "BPJS",
	// 	moment().format("YYYY-MM-DD"),
	// 	el.statusPasien,
	// );

	render() {
		// console.log(this.state);
		const { currentUid, currentUsername } = this.props.mainStore;

		const formListDokter = (
			<Card>
				{this.state.isDokters.map(element =>
					<CardItem button
						key={element.username}
						onPress={() => this.setState({ isDokterPeriksa: element.username })}
					>
						<Text> {element.username} </Text>
					</CardItem>,
				)}
			</Card>
		);

		const Forms = (
			<View>
				{this.state.isStatusPasien === "Umum" ? formListDokter : undefined}
				<Card>
					<CardItem
					// footer button
					// onPress={() => this.handleAntriPoli(currentUid, currentUsername)}
					>
						<Text>Daftar Antrian Poli ke -
								{this.state.sttFlagActivity === "antriPoliklinik"
									? this.state.nomorAntriFromFb
									: "Belum mendaftar antrian."}</Text>
					</CardItem>
					<CardItem>
						<View>
							<Button block onPress={() => this.handleAntriPoli(currentUid, currentUsername)}>
								<Text>Ambil Nomor Antrian</Text>
							</Button>
						</View>
					</CardItem>
				</Card>
			</View>
		);

		return <DaftarAntrianPoliPage
			navigation={this.props.navigation}
			forms={Forms}
		/>;
	}
}
