import * as React from "react";
import PoliklinikPage from "../../../stories/screens/resepsionis/PoliklinikPage";
import {
			// Form,
			Picker,
			Card,
			Text,
			CardItem,
			Content,
			View,
			Button,
			DatePicker,
		} from "native-base";
import { Platform } from "react-native";
import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";
import moment from "moment";

export interface Props {
	navigation: any;
}

export interface State {
	selected1: any;
	selected2: any;
	services: any;
	isDokters;
	tasks;
	chosenDate;
	sttSchedule;
}

export default class PoliklinikPageContainer extends React.Component<Props, State> {
	scheduleOfPoli;

	constructor(props) {
		super(props);
		this.scheduleOfPoli = db1.db.ref(`poliklinik/scheduleOfPoli`);
		this.state = {
			selected1: "select",
			selected2: "select",
			services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
			isDokters: [],
			tasks: [],
			chosenDate: new Date(),
			sttSchedule: [],
		};
		this.setDate = this.setDate.bind(this);
	}

	setDate(newDate) {
		this.setState({ chosenDate: newDate });
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

	onValueChangePoli1(value: string) {
		this.setState({
			selected1: value,
		});
	}

	onValueChangePoli2(value: string) {
		this.setState({
			selected2: value,
		});
	}

	make_list(list, item0) {
		const d = list.map((data, i) => {
			return (
				<Picker.Item label={data.username} value={data.username} key={i}/>
			);
		});
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="Idle" key="99999"/>);
		}
		return d;
	}

	componentDidMount() {
		// db.getPoli().then(c1 => {
		// 	// console.log(c1);
		// 	this.setState({
		// 		selected1: c1.val().poli1.dokter,
		// 		selected2: c1.val().poli2.dokter,
		// 	});
		// });
		this.getScheduleOfPoli(this.scheduleOfPoli);
		this._getListDokter();
	}

	getScheduleOfPoli( p ) {
		p.once("value")
			.then((result) => {
				// const r1 = result.val();
				const r2 = [];
				// r2.push(r1);
				result.forEach(el => {
					r2.push(el.val());
				});
				this.setState({
					sttSchedule: r2,
				});
				console.log(this.state.sttSchedule);
				// this.props.managementViewStore.jasaMedik = r1.jasaMedik;
				// this.props.managementViewStore.sarana = r1.sarana;
				// this.props.managementViewStore.belanjaModal = r1.belanjaModal;
				// this.props.managementViewStore.saham = r1.saham;
			}).catch((err) => {
				console.log(err);
		});
	}

	_handlePoli() {
		const { selected1, selected2, chosenDate } = this.state;
		db.doUpdateScheduleOfPoli(moment(chosenDate).format("YYYY-MMM-DD"), selected1, selected2);
		db.getDaftarTungguxxByTanggal(moment().format("YYYY-MMM-DD"))
			.then(c1 => {
				const tasks = [];
				c1.forEach(c2 => {
					tasks.push({
						_key: c2.key,
					});
					db.doUpdatePolidaftarTunggu(c2.key, "Poli1");
					db.doUpdateFlagActivity(c2.key, "antriPoliklinikByToday");
				});
				this.setState({ tasks: tasks });
			});
		// console.log("tasks", this.state.tasks, moment().format("YYYY-MMM-DD"));
	}

	// _handlePoli1(value) {
	// 	db.doUpdateDokterPoli1(value);
	// 	db.getDaftarTungguxxByTanggal(moment().format("YYYY-MMM-DD"))
	// 		.then(c1 => {
	// 			const tasks = [];
	// 			c1.forEach(c2 => {
	// 				tasks.push({
	// 					_key: c2.key,
	// 				});
	// 				db.doUpdatePolidaftarTunggu(c2.key, "Poli1");
	// 				db.doUpdateFlagActivity(c2.key, "antriPoliklinikByToday");
	// 			});
	// 			this.setState({ tasks: tasks });
	// 		});
	// 		console.log("tasks", this.state.tasks, moment().format("YYYY-MMM-DD"));
	// }

	// _handlePoli2(value) {
	// 	db.doUpdateDokterPoli2(value);
	// }

	render() {
		// console.log(this.state);
		const forms = (
			<View>
				<Card>
					<CardItem>
						<DatePicker
							defaultDate={new Date()}
							minimumDate={new Date(2018, 1, 1)}
							maximumDate={new Date(2018, 12, 31)}
							locale={"en"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType={"fade"}
							androidMode={"default"}
							placeHolderText="Select date"
							textStyle={{ color: "green" }}
							placeHolderTextStyle={{ color: "#d3d3d3" }}
							onDateChange={this.setDate}
							/>
					</CardItem>
					<CardItem>
						<Text>Tanggal: {this.state.chosenDate.toString().substr(4, 12)}</Text>
					</CardItem>
					<CardItem >
						<Text>Poliklinik 1</Text>
					</CardItem>
					<CardItem>
						<Content>
							<View style={{ flexDirection: "column" }}>
								<Picker
									iosHeader="Select one"
									mode="dropdown"
									selectedValue={this.state.selected1}
									onValueChange={this.onValueChangePoli1.bind(this)}
								>
								{ this.make_list(this.state.isDokters, "Poli Idle") }
								</Picker>
							</View>
						</Content>
					</CardItem>
					<CardItem>
						<Text>Poliklinik 2</Text>
					</CardItem>
					<CardItem>
						<Content>
							<View style={{ flexDirection: "column" }}>
								<Picker
									iosHeader="Select one"
									mode="dropdown"
									selectedValue={this.state.selected2}
									onValueChange={this.onValueChangePoli2.bind(this)}
								>
								{ this.make_list(this.state.isDokters, "Poli Idle") }
								</Picker>
							</View>
						</Content>
					</CardItem>
					<CardItem>
						<Content>
							<Button full block
								onPress={() => this._handlePoli()}
							>
								<Text>Simpan Data</Text>
							</Button>
						</Content>
					</CardItem>
				</Card>
			</View>
		);

		const skedul = (
			<View>
				<Text>Schedule of Poliklinik</Text>
				{ this.state.sttSchedule.map(el =>
				<Card key={el._key}>
					<CardItem>
						<View>
							<Text>{ el.tanggal }</Text>
							<Text>Poli1 - Dokter: { el.poli1DokterName }</Text>
							<Text>Poli2 - Dokter: { el.poli2DokterName }</Text>
						</View>
					</CardItem>
				</Card>,
				)}
			</View>
		);

		return <PoliklinikPage
					navigation={this.props.navigation}
					forms= {forms}
					skedul={skedul}
				/>;
	}
}
