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
		db.getNumberLastAntrian(moment().format("YYYY-MM-DD"))
			.then(res => {
				this.setState({ nomorAntriFromFb: res.val() === null ? 1 : res.val() });
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
				moment().add(1, "days").format("YYYY-MM-DD"),
				this.state.isStatusPasien,
			);
		}
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
					<CardItem>
						<Text>Daftar Antrian Poli ke -
								{this.state.sttFlagActivity === "antriPoliklinik"
									? this.state.nomorAntriFromFb + " pada tanggal " + (moment().add(1, "days").format("YYYY-MM-DD") )
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
