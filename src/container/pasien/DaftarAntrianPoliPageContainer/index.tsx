import * as React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarAntrianPoliPage from "../../../stories/screens/pasien/DaftarAntrianPoliPage";
import {
	View,
	Text,
	Card,
	CardItem,
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
	nomorAntri: any;
	isStatusPasien;
	isDokters;
	isDokterPeriksa;
	isNomorAntrian;
}

@inject("mainStore", "pasienStore")
@observer
export default class DaftarAntrianPoliPageContainer extends React.Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			chosenDate: new Date(),
			nomorAntri: "",
			isStatusPasien: "Umum",
			isDokters: [],
			isDokterPeriksa: "",
			isNomorAntrian: "",
		};
	}

	componentDidMount() {
		this.getNoAntri();
		this.setState({
			isStatusPasien: this.props.pasienStore.stoStatusPasien,
		});
		this._getListDokter();
	}

	getNoAntri() {
		// console.log(this.props);
		db.getNumberLastAntrian()
			.then(res => {
				this.setState({ nomorAntri: res.val() + 1 });
				// console.log(res.val());
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
		snapshot.forEach(function(childSnapshot) {
			const item = childSnapshot.val();
			item.key = childSnapshot.key;
			returnArr.push(item);
		});
		return returnArr;
	}

	handleAntriPoli( uid, uName) {
		db.getNumberLastAntrian()
			.then(res => {
				db.doPasienDaftarAntrian(
					uid,
					uName,
					res.val() + 1,
					this.state.isDokterPeriksa,
					moment().format("YYYY-MMM-DD"),
					this.state.isStatusPasien,
				);
				this.setState({ nomorAntri: res.val() + 1 });
				this.props.mainStore.nomorAntrianPoli = this.state.nomorAntri;
			});
			this.setState({ isNomorAntrian: this.state.nomorAntri });
			this.props.navigation.navigate("Home");
	}

	render() {
		// console.log(this.state);
		const { currentUid, currentUsername } = this.props.mainStore;

		const formListDokter = (
			<Card>
				{ this.state.isDokters.map(element =>
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
				<Card>
					<CardItem>
						<View style={{padding: 1, flexDirection: "column"}}>
							<Text>Dokter Periksa : { this.state.isDokterPeriksa ? this.state.isDokterPeriksa : "belum ada pilihan dokter" }</Text>
							<Text>Nomor Antrian : { this.state.isNomorAntrian ? this.state.isNomorAntrian : "belum ada pilihan nomor antrian" }</Text>
						</View>
					</CardItem>
				</Card>
				{ this.state.isStatusPasien === "Umum" ? formListDokter : undefined }
				<Card>
					<CardItem footer button
						onPress={() => this.handleAntriPoli(currentUid, currentUsername)}
						>
						<Text>Daftar Antrian Poli ke - { this.state.nomorAntri ? this.state.nomorAntri : "loading data..." }</Text>
					</CardItem>
				</Card>
			</View>
		);

		return <DaftarAntrianPoliPage
					navigation={this.props.navigation}
					forms = {Forms}
				/>;
	}
}
