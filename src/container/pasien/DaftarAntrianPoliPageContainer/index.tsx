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
		const { currentUid } = this.props.mainStore;
		// console.log(currentUid);
		db.getNumberLastAntrian(currentUid)
			.then(res => {
				// console.log("hahaha", res.val());
				this.setState({ nomorAntri: res.val() });
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
		db.getNumberLastAntrian(uid)
			.then(res => {
				db.doPasienDaftarAntrian(
					uid,
					uName,
					res.val() + 1,
					this.state.isDokterPeriksa,
					moment().format("YYYY-MM-DD"),
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
						<Text>Daftar Antrian Poli ke - {this.state.nomorAntri ? this.state.nomorAntri : "Belum mengambil nomor antrian"}</Text>
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
