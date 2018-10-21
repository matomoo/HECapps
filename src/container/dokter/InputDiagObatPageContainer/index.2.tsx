import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { db } from "../../../firebase/firebase";
import { ActivityIndicator,
			// TextInput,
} from "react-native";
import { Header, Container, Title, Content, Icon,  Card,
			CardItem,
			Button,
			Toast,
			Form,
			Picker,
			Text,
			Item,
			Label,
			Input,
			Left,
			Body,
			Right,
			Footer,
		} from "native-base";
import ListItem from "./components/ListItem";
import { Platform, View } from "react-native";
import firebase from "firebase";
import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore;
	mainStore;
	managementViewStore;
}
export interface State {
	loading;
	user;
	newJumlahObat;
	tasks;
	active;
	selected1;
	// services;
	obats;
	staPasienRekamMedik;
	staDokterRekamMedik;
}

@inject("pasienStore", "mainStore", "managementViewStore")
@observer
export default class InputDiagObatPageContainer extends React.Component<Props, State> {
	tasksRef: any;
	tasksDb: any;
	constObat: any;
	taskManagement;

	constructor(props) {
		super(props);
		this.tasksRef = db.ref(`rekamMedikObatTemp`);
		this.tasksDb = db.ref(`rekamMedikDbObat`);
		this.constObat = db.ref("apotekStokBarang");
		this.taskManagement = db.ref(`management/percentageOfShare`);
		this.state = {
			user: undefined,
			loading: false,
			newJumlahObat: "",
			tasks: [],
			active: true,
			selected1: "-Pilih Obat-",
			// services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
			obats: [],
			staPasienRekamMedik: 0,
			staDokterRekamMedik: 0,
			};
		}

	componentWillMount() {
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.getFirstData(this.constObat);
		db.ref(`pasiens/${currentPasienTerpilihUid}`).once("value")
			.then(c1 => {
				// console.log("pasienRekamMedik: ", c1.val().pasienRekamMedik);
				// console.log("dokterRekamMedik: ", c1.val().dokterRekamMedik);
				this.setState({
					staPasienRekamMedik: c1.val().pasienRekamMedik,
					staDokterRekamMedik: c1.val().dokterRekamMedik,
				});
			});
		this.getFirstDataManagement(this.taskManagement);
		console.log( this.props.mainStore );
	}

	getFirstDataManagement( p ) {
		p.once("value")
			.then((result) => {
				// console.log(result.val().jasaMedik);
				const r1 = result.val();
				this.props.managementViewStore.jasaMedik = r1.jasaMedik;
				this.props.managementViewStore.sarana = r1.sarana;
				this.props.managementViewStore.belanjaModal = r1.belanjaModal;
				this.props.managementViewStore.saham = r1.saham;
				// Object.keys(r1).map(r2 => {
				// 	console.log(r1[r2]);
				// });
			}).catch((err) => {
				console.log(err);
		});
	}

	getFirstData( constObat ) {
		constObat.once("value")
			.then((result) => {
				// console.log(result.val());
				const r1 = result.val();
				const obats = [];
				Object.keys(r1).map(r2 => {
					// console.log(r1[r2].namaDiag);
					obats.push({
						_key: r1[r2].idAS,
						namaObat: r1[r2].namaAS,
						hargaBeliObat: r1[r2].hargaBeliAS,
						hargaJualObat: r1[r2].hargaJualAS,
						jumlahObat: r1[r2].jumlahAS,
						satuanObat: r1[r2].satuanAS,
						jenisObat: r1[r2].jenisAS,
					});
				});
				this.setState({
					obats: obats,
				});
				// console.log(this.state.obats);
			}).catch((err) => {
				console.log(err);
		});
	}

	componentDidMount() {
		// start listening for firebase updates
		this.listenForTasks(this.tasksRef);
		}

	// listener to get data from firebase and update listview accordingly
	listenForTasks(tasksRef) {
		tasksRef.on("value", (dataSnapshot) => {
			const tasks = [];
			dataSnapshot.forEach((child) => {
				tasks.push({
					// name: child.val().name,
					_key: child.key,
					idObat: child.val().idObat,
					namaObat: child.val().namaObat,
					hargaBeliObat: child.val().hargaBeliObat,
					hargaJualObat: child.val().hargaJualObat,
					jumlahObatStok: child.val().jumlahObatStok,
					jumlahObatKeluar: child.val().jumlahObatKeluar,
					satuanObat: child.val().satuanObat,
					jenisObat: child.val().jenisObat,
					pasienId: child.val().pasienId,
					pasienNama: child.val().pasienNama,
					dokterPeriksaId: child.val().dokterPeriksaId,
					dokterPeriksaNama: child.val().dokterPeriksaNama,
					timestamp: child.val().timestamp,
					tanggalPeriksa: child.val().tanggalPeriksa,
					pasienNoRekamMedik: child.val().pasienNoRekamMedik,
					dokterNoRekamMedik: child.val().dokterNoRekamMedik,
				});
			});
			this.setState({
				tasks: tasks,
			});
		});
	}

	// add a new task to firebase app
	_addTask() {
		// console.log("_addTask",
		// 				// this.state.tasks,
		// 				this.state.newJumlahObat,
		// 			);
		const { currentPasienTerpilihUid, currentPasienTerpilihUsername,
					stoHargaBeliObat,
					stoHargaJualObat,
					stoJumlahObat,
					stoSatuanObat,
					stoJenisObat,
					stoIdObat,
		} = this.props.pasienStore;
		const { currentUid, currentUsername } = this.props.mainStore;
		if (this.state.selected1 === "-Pilih Obat-" || this.state.selected1 === "Idle") {
			return;
		}
		this.tasksRef.push({
			idObat: stoIdObat,
			namaObat: this.state.selected1,
			hargaBeliObat: stoHargaBeliObat,
			hargaJualObat: stoHargaJualObat,
			jumlahObatStok: stoJumlahObat,
			jumlahObatKeluar: this.state.newJumlahObat,
			satuanObat: stoSatuanObat,
			jenisObat: stoJenisObat,
			pasienId: currentPasienTerpilihUid,
			pasienNama: currentPasienTerpilihUsername,
			dokterPeriksaId: currentUid,
			dokterPeriksaNama: currentUsername,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			tanggalPeriksa: moment().format("YYYY-MMM-DD"),
			pasienNoRekamMedik: currentPasienTerpilihUid + "-" + this.state.staPasienRekamMedik,
			dokterNoRekamMedik: currentUid + "-" + this.state.staDokterRekamMedik,
			});
		Toast.show({
			text: "Task added succesfully",
			duration: 2000,
			position: "center",
			textStyle: { textAlign: "center" },
		});
	}

	_handleSaveTasksToFb() {
		// this.tasksDb.push(this.state.tasks);  // this will save array into Fbase
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.state.tasks.forEach(element => {
			// console.log("_handleSaveTasksToFb => ", element);
			this.tasksDb.push(element);
			this.tasksRef.child(element._key).remove();
			db.ref(`apotekStokBarang/${element.idObat}`).update({
				jumlahAS : element.jumlahObatStok - element.jumlahObatKeluar,
			});
		});
		// db.ref(`pasiens/${currentPasienTerpilihUid}`)
		// 	.update({
		// 		pasienRekamMedik: this.state.staPasienRekamMedik,
		// 		dokterRekamMedik: this.state.staDokterRekamMedik,
		// 		// flagActivity: "hasilDiagnosaDone",
		// 	});
		this.props.navigation.navigate("RekamMedikPasienPage", {name : {currentPasienTerpilihUid}} );
	}

	_renderItem(task) {
		// console.log("task", task._key);
		// console.log("props", this.state.tasks);

		const onTaskCompletion = () => {
			// console.log("clickrecived",this.tasksRef.child(task._key).remove());
			this.tasksRef.child(task._key).remove().then(
				function() {
				// fulfillment
				// alert("The task " + task.name + " has been completed successfully");
				Toast.show({
					text: task.namaObat + " di tambah ke list",
					duration: 2000,
					position: "center",
					textStyle: { textAlign: "center" },
				});
			},
			function() {
				// fulfillment
				// alert("The task " + task.name + " has not been removed successfully");
				Toast.show({
					text: task.namaObat + " di hapus dari list",
					duration: 2000,
					position: "center",
					textStyle: { textAlign: "center" },
				});
			});
			};

		return (
			<ListItem task={task} onTaskCompletion={onTaskCompletion} />
		);
	}

	logout() {
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.props.navigation.navigate("RekamMedikPasienPage", {name: {currentPasienTerpilihUid}} );
	}

	onValueChangePoli1(value: string) {
		this.setState({
			selected1: value,
		});
		this.props.pasienStore._handleNameObatSelected(value, this.state.obats);
		// db.doUpdateDokterPoli1(value);
	}

	make_list(list, item0) {
		const d = list.map((data, i) => {
			return (
				<Picker.Item label={data.namaObat} value={data.namaObat} key={i}/>
			);
		});
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="Idle" key="99999"/>);
		}
		return d;
	}

	render() {
		// console.log("tasks value", this.state.tasks);
		// console.log("props:", this.props);
		// If we are loading then we display the indicator, if the account is null and we are not loading
		// Then we display nothing. If the account is not null then we display the account info.
		const { pasienStore } = this.props;
		const content = this.state.loading ?
		<ActivityIndicator size="large"/> :
			// this.state.user &&
				// <Content>
					<Card dataArray={this.state.tasks}
						renderRow={(task) => this._renderItem(task)} >
					</Card>
				// </Content>
			;
		// console.log("loading user", this.state.user, this.state.loading);

		return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.logout()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Input Obat</Title>
					</Body>
					<Right />
				</Header>
				<Content contentContainerStyle={{ flexGrow: 1 }} >
					<View>
						<CardItem>
							<Content>
								<Form>
									<Picker
										iosHeader="Select one"
										mode="dropdown"
										selectedValue={this.state.selected1}
										onValueChange={this.onValueChangePoli1.bind(this)}
										>
										{ this.make_list(this.state.obats, "-Pilih Obat-") }
									</Picker>
									<Item stackedLabel >
										<Label>Stok Obat { pasienStore.stoJumlahObat } </Label>
										<Input
											// ref={c => (this.hargaBeliABMInput = c)}
											value={ this.state.newJumlahObat }
											// value = { this.props.pasienStore.stoJumlahObat }
											style={{ marginLeft: 5 }}
											keyboardType="numeric"
											// onBlur={() => form.validateUsername()}
											onChangeText={(text) => this.setState({newJumlahObat: text})}
										/>
									</Item>
									<Button block onPress={() => this._addTask()}>
										<Text>Tambah</Text>
									</Button>
								</Form>
							</Content>
						</CardItem>
					</View>
					{content}
				</Content>
				<Footer>
					<Button block onPress={() => this._handleSaveTasksToFb()}>
						<Text>Simpan Data</Text>
					</Button>
				</Footer>
			</Container>
		);
	}

	// render() {
	// 	return <InputDiagObatPage
	// 				navigation={this.props.navigation}
	// 			/>;
	// }
}
