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
import * as db1 from "../../../firebase/firebase";
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
	listPolis;
	tanggalBooking;
}

@inject("mainStore", "pasienStore")
@observer
export default class DaftarAntrianPoliPageContainer extends React.Component<Props, State> {
taskPoli;

	constructor(props) {
		super(props);
		this.taskPoli = db1.db.ref(`poliklinik/scheduleOfPoli`);
		this.state = {
			nomorAntriFromFb: "",
			isStatusPasien: "Umum",
			isDokters: [],
			isDokterPeriksa: "",
			sttFlagActivity: "",
			listPolis: [],
			tanggalBooking: "",
		};
	}

	componentDidMount() {
		this.getNoAntri();
		this.getFirstData( this.taskPoli );
	}

	getNoAntri() {
		db.getNumberLastAntrian(moment().format("YYYY-MM-DD"))
			.then(res => {
				this.setState({
					nomorAntriFromFb: res.val() === null ? 1 : res.val(),
					isStatusPasien: this.props.pasienStore.stoStatusPasien,
				sttFlagActivity: this.props.pasienStore.stoPasienFlagActivity,
				});
			});
	}

	async getFirstData( p ) {
		await p.once("value")
			.then((result) => {
				const r1 = [];
				result.forEach(el => {
					r1.push(el.val());
				});
				this.setState({
					listPolis: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
	}

	handleAntriPoli(uid, uName) {
		if (this.state.sttFlagActivity === "userIdle") {
			console.log("proses");
			db.doPasienDaftarAntrian(
				uid,
				uName,
				parseInt(this.state.nomorAntriFromFb, 10),
				this.state.isDokterPeriksa ? this.state.isDokterPeriksa : "BPJS",
				this.state.isStatusPasien === "UMUM" ? moment().add(1, "days").format("YYYY-MM-DD") : this.state.tanggalBooking ,
				this.state.isStatusPasien,
			);
		}
		this.props.navigation.navigate("Home");
	}

	render() {
		console.log(this.state);
		const { currentUid, currentUsername } = this.props.mainStore;

		const formListDokter = (
			<Card>
				<CardItem>
					<Text>Pilih tanggal booking berikut:</Text>
				</CardItem>
				{this.state.listPolis.map(element =>
					<CardItem button bordered
						key={element._key}
						onPress={() => this.setState({
							isDokterPeriksa: element.poli1DokterName,
							tanggalBooking: element.tanggal,
						})}
					>
						<View>
							<Text>Tanggal periksa: {element.tanggal}</Text>
							<Text>Dokter Poli 1: {element.poli1DokterName}</Text>
							{/* <Text>Dokter Poli 2: {element.poli2DokterName}</Text> */}
						</View>
					</CardItem>,
				)}
			</Card>
		);

		const Forms = (
			<View>
				{this.state.isStatusPasien === "Umum" ? formListDokter : undefined}
				<Card>
					<CardItem>
						<View>
							<Text>Dokter periksa: {this.state.isDokterPeriksa}</Text>
							<Text>Daftar Antrian Poli ke -
									{this.state.sttFlagActivity === "antriPoliklinik"
										? this.state.nomorAntriFromFb + " pada tanggal " + this.state.tanggalBooking
										: " Belum mendaftar antrian."}</Text>
						</View>
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
