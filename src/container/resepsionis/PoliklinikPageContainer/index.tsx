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
		} from "native-base";
import { Platform } from "react-native";
import { db } from "../../../firebase";
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
}

export default class PoliklinikPageContainer extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selected1: "select",
			selected2: "select",
			services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
			isDokters: [],
			tasks: [],
		};
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
		// i did this because no need in ios :P
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="Idle" key="99999"/>);
		}
		return d;
		// and that's how you are ready to go, because this issue isn't fixed yet (checked on 28-Dec-2017)
	}

	componentDidMount() {
		db.getPoli().then(c1 => {
			// console.log(c1);
			this.setState({
				selected1: c1.val().poli1.dokter,
				selected2: c1.val().poli2.dokter,
			});
		});
		this._getListDokter();
	}

	_handlePoli1(value) {
		db.doUpdateDokterPoli1(value);
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
			console.log("tasks", this.state.tasks, moment().format("YYYY-MMM-DD"));
	}

	_handlePoli2(value) {
		db.doUpdateDokterPoli2(value);
	}

	render() {
		console.log(this.state);
		const forms = (
			<View>
				<Card>
					<CardItem header>
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
								<Button full block
									onPress={() => this._handlePoli1(this.state.selected1)}
								>
									<Text>Simpan Data</Text>
								</Button>
							</View>
						</Content>
					</CardItem>
				</Card>
				<Card>
					<CardItem header>
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
								<Button full block
									onPress={() => this._handlePoli2(this.state.selected2)}
								>
									<Text>Simpan Data</Text>
								</Button>
							</View>
						</Content>
					</CardItem>
				</Card>
			</View>
		);

		return <PoliklinikPage
					navigation={this.props.navigation}
					forms= {forms}
				/>;
	}
}
