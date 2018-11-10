import * as React from "react";
// import InputDiagnosaPage from "../../../stories/screens/dokter/InputDiagnosaPage";
import { observer, inject } from "mobx-react/native";
import { db } from "../../../firebase/firebase";
// import * as db1 from "../../../../firebase/firebase";
import { ActivityIndicator,
			// TextInput,
} from "react-native";
import { Header, Container, Title, Content, Icon,  Card,
			CardItem,
			Button,
			// Toast,
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
// import styles from "./styles/mainStyles";
import ListItem from "./components/ListItem";
import { Platform, View } from "react-native";
// import _ from "lodash";
import firebase from "firebase";
import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore;
	mainStore;
}
export interface State {
	consDiags;
	tasksDiagnosa;
	transaksiTotalDiag;

	loading;
	user;
	newTask;
	tasks;
	active;
	selected1;
	services;
	staPasienRekamMedik;
	staDokterRekamMedik;
}

@inject("pasienStore", "mainStore")
@observer
export default class InputDiagnosaPageContainer extends React.Component<Props, State> {
	tasksTransaksiKeluar;
	tasksDiagnosa;

	tasksRef: any;
	tasksDb: any;
	constDiag: any;

	constructor(props) {
		super(props);
		this.tasksTransaksiKeluar = db.ref(`transaksiKeluar`);
		this.constDiag = db.ref("constant").orderByChild("flag").equalTo("diagnosa");

		this.tasksRef = db.ref(`rekamMedik`);
		this.tasksDb = db.ref(`rekamMedikDb`);

		this.state = {
			consDiags: [],
			tasksDiagnosa: [],
			transaksiTotalDiag: 0,

			user: undefined,
			loading: false,
			newTask: "",
			tasks: [],
			active: true,
			selected1: "-Pilih Diagnosa-",
			services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
			staPasienRekamMedik: 0,
			staDokterRekamMedik: 0,
		};
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				const consDiags = [];
				Object.keys(r1).map(r2 => {
					consDiags.push({
						_key: r1[r2].idDiag,
						namaDiag: r1[r2].namaDiag,
						hargaDiag: r1[r2].hargaDiag,
					});
				});
				this.setState({
					consDiags: consDiags,
				});
			}).catch((err) => {
				console.log(err);
		});
	}

	_addTask() {
		const {
			// currentPasienTerpilihUid, currentPasienTerpilihUsername,
			stoHargaDiag } = this.props.pasienStore;
		// const { currentUid, currentUsername, transaksiNomorFakturKeluar } = this.props.mainStore;
		if (this.state.selected1 === "-Pilih Diagnosa-" || this.state.selected1 === "Idle") {
			return;
		}

		this.state.tasksDiagnosa.push({
			namaDiag: this.state.selected1,
			hargaDiag: stoHargaDiag,
		});
		// const sum = parseInt(stoHargaDiag);
		this.setState({
			newTask: "",
			transaksiTotalDiag: parseInt(stoHargaDiag, 10) + parseInt(this.state.transaksiTotalDiag, 10),
		});

		// Toast.show({
		// 	text: "Task added succesfully",
		// 	duration: 2000,
		// 	position: "center",
		// 	textStyle: { textAlign: "center" },
		// });
	}

	componentDidMount() {

		this.listenForTasks(
			// this.tasksRef
				this.state.tasksDiagnosa,
			);

			this.getFirstData(
				this.constDiag,
				// this.tasksTransaksiKeluar
			);

			const { currentPasienTerpilihUid } = this.props.pasienStore;
			db.ref(`pasiens/${currentPasienTerpilihUid}`).once("value")
				.then(c1 => {
					this.setState({
						staPasienRekamMedik: c1.val().pasienRekamMedik + 1,
						staDokterRekamMedik: c1.val().dokterRekamMedik + 1,
					});
				});
		}

	listenForTasks(p) {
			this.setState({
				tasksDiagnosa: p,
			});
	}

	_handleSaveTasksToFb() {
		const {	currentPasienTerpilihUid, currentPasienTerpilihUsername } = this.props.pasienStore;
		const { currentUid, currentUsername, transaksiNomorFakturKeluar } = this.props.mainStore;

		const id = this.tasksTransaksiKeluar.push();
		const key = id.key;
		let localTimestamp = firebase.database.ServerValue.TIMESTAMP;
		this.props.mainStore.transaksiKeluarFbKeyOnUpdate(key);
		this.props.mainStore.transaksiTotalDiagOnUpdate(this.state.transaksiTotalDiag);
		this.props.mainStore.transaksiKeluarTimestampOnUpdate(localTimestamp);
		this.props.mainStore.transaksiKeluarTanggalOnUpdate(moment().format("YYYY-MM-DD"));
		db.ref(`transaksiKeluar/${key}`).update(
			{
			_key: key,
			transaksiNomorFakturKeluar : transaksiNomorFakturKeluar,
			dokterPeriksaId: currentUid,
			dokterPeriksaNama: currentUsername,
			pasienId: currentPasienTerpilihUid,
			pasienNama: currentPasienTerpilihUsername,
			itemDiag: JSON.stringify(this.state.tasksDiagnosa),
			itemObat: JSON.stringify(["-"]),
			pasienNoRekamMedik: currentPasienTerpilihUid + "-" + this.state.staPasienRekamMedik,
			dokterNoRekamMedik: currentUid + "-" + this.state.staDokterRekamMedik,
			transaksiTotalDiag: this.state.transaksiTotalDiag,
			statusBilling: "Belum",
			statusApotek: "Belum",
			tanggalPeriksa: moment().format("YYYY-MM-DD"),
			timestamp: localTimestamp,
		});

		db.ref(`pasiens/${currentPasienTerpilihUid}`)
			.update({
				pasienRekamMedik: this.state.staPasienRekamMedik,
				dokterRekamMedik: this.state.staDokterRekamMedik,
				// flagActivity: "hasilDiagnosaDone",
			});
		this.props.navigation.navigate("RekamMedikPasienPage", {name : {currentPasienTerpilihUid}} );
	}

	deleteItem = key => {
		const filteredItems = this.state.tasksDiagnosa.filter(item => {
			return item.namaDiag !== key;
		});
		let sum = 0;
		filteredItems.forEach(function(obj) {
			return sum += parseInt(obj.hargaDiag, 10);
		});
		this.setState({
			tasksDiagnosa: filteredItems,
			transaksiTotalDiag: sum,
		});
	}

	_renderItem(task) {
		const onTaskCompletion = () => {
			this.deleteItem(task.namaDiag);
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
		this.props.pasienStore._handleNameDiagSelected(value, this.state.consDiags);
	}

	make_list(list, item0) {
		const d = list.map((data, i) => {
			return (
				<Picker.Item label={data.namaDiag} value={data.namaDiag} key={i}/>
			);
		});
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="Idle" key="99999"/>);
		}
		return d;
	}

	render() {
		const content = this.state.loading ?
			<ActivityIndicator size="large"/> :
			<Card dataArray={this.state.tasksDiagnosa}
				renderRow={(task) => this._renderItem(task)} >
			</Card>
			;

		return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={() => this.logout()}>
							<Icon name="ios-arrow-back" />
						</Button>
					</Left>
					<Body>
						<Title>Input Diagnosa</Title>
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
										{ this.make_list(this.state.consDiags, "-Pilih Diagnosa-") }
									</Picker>
									<Item stackedLabel >
										<Label>Note</Label>
										<Input
											// ref={c => (this.hargaBeliABMInput = c)}
											// value={ this.state.newTask }
											value = { this.props.pasienStore.stoHargaDiag }
											style={{ marginLeft: 5 }}
											// keyboardType="numeric"
											// onBlur={() => form.validateUsername()}
											onChangeText={(text) => this.setState({newTask: text})}
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

}
