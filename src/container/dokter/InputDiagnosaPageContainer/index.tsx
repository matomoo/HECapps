import * as React from "react";
// import InputDiagnosaPage from "../../../stories/screens/dokter/InputDiagnosaPage";
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
// import styles from "./styles/mainStyles";
import ListItem from "./components/ListItem";
import { Platform, View } from "react-native";
import firebase from "firebase";
import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore;
	mainStore;
}
export interface State {
	loading;
	user;
	newTask;
	tasks;
	active;
	selected1;
	services;
	diags;
	staPasienRekamMedik;
	staDokterRekamMedik;
}

@inject("pasienStore", "mainStore")
@observer
export default class InputDiagnosaPageContainer extends React.Component<Props, State> {
	tasksRef: any;
	tasksDb: any;
	constDiag: any;

	constructor(props) {
		super(props);
		this.tasksRef = db.ref(`rekamMedik`);
		this.tasksDb = db.ref(`rekamMedikDb`);
		this.constDiag = db.ref("constant").orderByChild("flag").equalTo("diagnosa");
		this.state = {
			user: undefined,
			loading: false,
			newTask: "",
			tasks: [],
			active: true,
			selected1: "-Pilih Diagnosa-",
			services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
			diags: [],
			staPasienRekamMedik: 0,
			staDokterRekamMedik: 0,
			};
		}

	componentWillMount() {
		const { currentPasienTerpilihUid } = this.props.pasienStore;
		this.getFirstData(this.constDiag);
		db.ref(`pasiens/${currentPasienTerpilihUid}`).once("value")
			.then(c1 => {
				// console.log("pasienRekamMedik: ", c1.val().pasienRekamMedik);
				// console.log("dokterRekamMedik: ", c1.val().dokterRekamMedik);
				this.setState({
					staPasienRekamMedik: c1.val().pasienRekamMedik + 1,
					staDokterRekamMedik: c1.val().dokterRekamMedik + 1,
				});
			});
		// console.log(this.props.mainStore);
	}

	getFirstData( constDiag ) {
		constDiag.once("value")
			.then((result) => {
				// this.setState({ diags: result.val() });
				const r1 = result.val();
				const diags = [];
				Object.keys(r1).map(r2 => {
					// console.log(r1[r2].namaDiag);
					diags.push({
						namaDiag: r1[r2].namaDiag,
						_key: r1[r2].idDiag,
						hargaDiag: r1[r2].hargaDiag,
					});
				});
				this.setState({
					diags: diags,
				});
				// console.log(r1.namaDiag);
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
					namaDiag: child.val().namaDiag,
					hargaDiag: child.val().hargaDiag,
					pasienId: child.val().pasienId,
					pasienNama: child.val().pasienNama,
					dokterPeriksaNama: child.val().dokterPeriksaNama,
					dokterPeriksaId: child.val().dokterPeriksaId,
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
		// console.log("task value",this.state.newTask);
		const { currentPasienTerpilihUid, currentPasienTerpilihUsername, stoHargaDiag } = this.props.pasienStore;
		const { currentUid, currentUsername } = this.props.mainStore;
		if (this.state.selected1 === "-Pilih Diagnosa-" || this.state.selected1 === "Idle") {
			return;
		}
		this.tasksRef.push({
			namaDiag: this.state.selected1,
			hargaDiag: stoHargaDiag,
			pasienId: currentPasienTerpilihUid,
			pasienNama: currentPasienTerpilihUsername,
			dokterPeriksaId: currentUid,
			dokterPeriksaNama: currentUsername,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			tanggalPeriksa: moment().format("YYYY-MMM-DD"),
			pasienNoRekamMedik: currentPasienTerpilihUid + "-" + this.state.staPasienRekamMedik,
			dokterNoRekamMedik: currentUid + "-" + this.state.staDokterRekamMedik,
			});
		this.setState({newTask: ""});
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
			// console.log(element);
			this.tasksDb.push(element);
			this.tasksRef.child(element._key).remove();
		});
		db.ref(`pasiens/${currentPasienTerpilihUid}`)
			.update({
				pasienRekamMedik: this.state.staPasienRekamMedik,
				dokterRekamMedik: this.state.staDokterRekamMedik,
				// flagActivity: "hasilDiagnosaDone",
			});
		this.props.navigation.navigate("RekamMedikPasienPage", {name : {currentPasienTerpilihUid}} );
	}

	_renderItem(task) {
		// console.log("task",task._key);
		// console.log("props", this.props);

		const onTaskCompletion = () => {
			// console.log("clickrecived",this.tasksRef.child(task._key).remove());
			this.tasksRef.child(task._key).remove().then(
				function() {
				// fulfillment
				// alert("The task " + task.name + " has been completed successfully");
				Toast.show({
					text: "The task " + task.namaDiag + " has been completed successfully",
					duration: 2000,
					position: "center",
					textStyle: { textAlign: "center" },
				});
			},
			function() {
				// fulfillment
				// alert("The task " + task.name + " has not been removed successfully");
				Toast.show({
					text: "The task " + task.namaDiag + " has not been removed successfully",
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
		this.props.pasienStore._handleNameDiagSelected(value, this.state.diags);
		// db.doUpdateDokterPoli1(value);
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
		// console.log("tasks value", this.state.tasks);
		// console.log("props:", this.props);
		// If we are loading then we display the indicator, if the account is null and we are not loading
		// Then we display nothing. If the account is not null then we display the account info.
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
										{ this.make_list(this.state.diags, "-Pilih Diagnosa-") }
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

	// render() {
	// 	return <InputDiagnosaPage
	// 				navigation={this.props.navigation}
	// 			/>;
	// }
}
