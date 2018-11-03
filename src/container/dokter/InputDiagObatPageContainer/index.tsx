import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { db } from "../../../firebase/firebase";
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
import ListItem from "./components/ListItem";
import { Platform, View } from "react-native";
// import firebase from "firebase";
// import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore;
	mainStore;
}
export interface State {
	consObats;
	tasksObat;
	transaksiTotalObat;

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

@inject("pasienStore", "mainStore")
@observer
export default class InputDiagObatPageContainer extends React.Component<Props, State> {
	tasksTransaksiKeluar;
	tasksRef: any;
	tasksDb: any;
	constObat: any;

	constructor(props) {
		super(props);
		this.tasksTransaksiKeluar = db.ref(`transaksiKeluar`);

		this.tasksRef = db.ref(`rekamMedikObatTemp`);
		this.tasksDb = db.ref(`rekamMedikDbObat`);
		this.constObat = db.ref("apotekStokBarang");

		this.state = {
			consObats: [],
			tasksObat: [],
			transaksiTotalObat: 0,

			user: undefined,
			loading: false,
			newJumlahObat: "",
			tasks: [],
			active: true,
			selected1: "-Pilih Obat-",
			obats: [],
			staPasienRekamMedik: 0,
			staDokterRekamMedik: 0,
			};
		}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				const consObats = [];
				Object.keys(r1).map(r2 => {
					consObats.push({
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
					consObats: consObats,
				});
			}).catch((err) => {
				console.log(err);
			});
	}

	_addTask() {
		const {
					// currentPasienTerpilihUid, currentPasienTerpilihUsername,
					stoHargaBeliObat,
					stoHargaJualObat,
					stoJumlahObat,
					stoSatuanObat,
					stoJenisObat,
					stoIdObat,
		} = this.props.pasienStore;
		// const { currentUid, currentUsername } = this.props.mainStore;
		if (this.state.selected1 === "-Pilih Obat-" || this.state.selected1 === "Idle") {
			return;
		}
		this.state.tasksObat.push({
			idObat: stoIdObat,
			namaObat: this.state.selected1,
			hargaBeliObat: stoHargaBeliObat,
			hargaJualObat: stoHargaJualObat,
			jumlahObatStok: stoJumlahObat,
			jumlahObatKeluar: this.state.newJumlahObat,
			satuanObat: stoSatuanObat,
			jenisObat: stoJenisObat,
			});
		this.setState({
			newJumlahObat: "",
			transaksiTotalObat: (parseInt(this.state.newJumlahObat, 10) * parseInt(stoHargaJualObat, 10)) + parseInt(this.state.transaksiTotalObat, 10),
		});
		// Toast.show({
		// 	text: "Task added succesfully",
		// 	duration: 2000,
		// 	position: "center",
		// 	textStyle: { textAlign: "center" },
		// });
		// console.log(this.state.tasksObat);
	}

	componentDidMount() {
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.listenForTasks(this.state.tasksObat);
		this.getFirstData(this.constObat);
		db.ref(`pasiens/${currentPasienTerpilihUid}`).once("value")
			.then(c1 => {
				this.setState({
					staPasienRekamMedik: c1.val().pasienRekamMedik,
					staDokterRekamMedik: c1.val().dokterRekamMedik,
				});
			});
	}

	listenForTasks(p) {
		this.setState({
			tasksObat: p,
		});
	}

	_handleSaveTasksToFb() {
		const { transaksiKeluarFbKey } = this.props.mainStore;
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.props.mainStore.transaksiTotalObatOnUpdate(this.state.transaksiTotalObat);
		db.ref(`transaksiKeluar/${transaksiKeluarFbKey}`).update({
			itemObat: JSON.stringify(this.state.tasksObat),
			transaksiTotalObat: this.state.transaksiTotalObat,
		});

		this.state.tasksObat.forEach(element => {
			db.ref(`apotekStokBarang/${element.idObat}`).update({
				jumlahAS : parseInt(element.jumlahObatStok, 10) - parseInt(element.jumlahObatKeluar, 10),
			});
		});

		this.props.navigation.navigate("RekamMedikPasienPage", {name : {currentPasienTerpilihUid}} );
	}

	deleteItem = key => {
		const filteredItems = this.state.tasksObat.filter(item => {
			return item.namaObat !== key;
		});
		let sum = 0;
		filteredItems.forEach(function(obj) {
			return sum += parseInt(obj.hargaJualObat, 10);
		});
		this.setState({
			tasksObat: filteredItems,
			transaksiTotalObat: sum,
		});
	}

	_renderItem(task) {
		const onTaskCompletion = () => {
			this.deleteItem(task.namaObat);
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
		this.props.pasienStore._handleNameObatSelected(value, this.state.consObats);
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
		const { pasienStore } = this.props;
		const content = this.state.loading ?
			<ActivityIndicator size="large"/> :
			<Card dataArray={this.state.tasksObat}
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
										{ this.make_list(this.state.consObats, "-Pilih Obat-") }
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

}
