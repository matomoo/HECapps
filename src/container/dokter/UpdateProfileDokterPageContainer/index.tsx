import * as React from "react";
import UpdateProfileDokterPage from "../../../stories/screens/dokter/UpdateProfileDokterPage";
import {
	Card,
	Form,
	Item,
	// CardItem,
	Input,
	Picker,
	Label,
	// Button,
	// Icon,
	// Text,
	// Right,
	// Left,
} from "native-base";
import { Platform } from "react-native";
import { observer, inject } from "mobx-react/native";
import { db } from "../../../firebase";

export interface Props {
	navigation: any;
	mainStore: any;
	pasienStore: any;
}
export interface State {
	sttKey;
	sttUsername;
	sttEmail;
	sttRole;
	sttGender;
	sttHandphone;
	sttAlamat;
	sttDescription;
	Genders;
	userRolePilih;
	roles;
}

@inject("mainStore", "pasienStore")
@observer
export default class UpdateProfileDokterPageContainer extends React.Component<Props, State> {
	// idASInput: any;
	inpUsername;
	inpEmail;
	inpRole;
	inpGender;
	inpHandphone;
	inpAlamat;
	inpDescription;
	userRoleInput: any;

	constructor() {
		super();
		this.state = {
			sttKey: "",
			sttUsername: "",
			sttEmail: "",
			sttRole: "",
			sttGender: "",
			sttHandphone: "",
			sttAlamat: "",
			sttDescription: "",
			Genders: ["Pria", "Wanita"],
			userRolePilih: "",
			roles: ["dokter", "pasien", "apotek", "billing", "resepsionis"],
		};
	}

	componentDidMount() {
		// console.log(this.props.pasienStore);
		const { Users } = this.props.pasienStore;
		Users.forEach(el => {
			this.setState({
				sttKey: el.profil._key,
				sttUsername: el.profil.username,
				sttEmail: el.profil.email,
				sttRole: el.profil.role,
				sttGender: el.profil.gender,
				sttHandphone: el.profil.handphone,
				sttAlamat: el.profil.alamat,
				sttDescription: el.profil.description,
			});
		});
	}

	_handleUsernameChange( p ) {
		this.setState({
			sttUsername: p,
		});
	}

	_handleEmailChange( p ) {
		this.setState({
			sttEmail: p,
		});
	}

	_handleGenderChange( p ) {
		this.setState({
			sttGender: p,
		});
	}

	_handleHandphoneChange( p ) {
		this.setState({
			sttHandphone: p,
		});
	}

	_handleAlamatChange( p ) {
		this.setState({
			sttAlamat: p,
		});
	}

	_handleDescriptionChange( p ) {
		this.setState({
			sttDescription: p,
		});
	}

	_handleInputBarang() {
		// const { namaABM, jumlahABM, hargaBeliABM, hargaJualABM, satuanABMPilih, jenisABMPilih } = this.props.inputBarangApotekStore;
		// db.doApotekBarangMasukxxInput( namaABM, jumlahABM, hargaBeliABM, hargaJualABM, satuanABMPilih, jenisABMPilih );
		// db.getIdAS(namaABM).then(c1 => {
		// 	// console.log(c1.val());
		// 	if (c1.val()) {
		// 		// console.log("disini buat update jumlah");
		// 		c1.forEach(c2 => {
		// 			// console.log(c2.val());
		// 			db.doApotekStokxxUpdateStok( c2.key, parseInt(c2.val().jumlahAS, 10) + parseInt(jumlahABM, 10) );
		// 			return true;
		// 		});
		// 	} else {
		// 		db.doApotekStokxxInput(
		// 			namaABM,
		// 			parseInt(jumlahABM, 10),
		// 			parseInt(hargaBeliABM, 10),
		// 			parseInt(hargaJualABM, 10),
		// 			satuanABMPilih,
		// 			jenisABMPilih,
		// 		);
		// 	}
		// });
		// this.props.inputBarangApotekStore.clearStore();
		// this.props.navigation.navigate("Home");
	}

	_make_list(list, item0) {
		const d = list.map((data, i) => {
			return (
				<Picker.Item label={data} value={data} key={i}/>
			);
		});
		// i did this because no need in ios :P
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="99999" key="99999"/>);
		}
		return d;
		// and that's how you are ready to go, because this issue isn't fixed yet (checked on 28-Dec-2017)
	}

	// _handlePilihRole( p) {
	// 	// console.log( p );
	// 	this.setState ({
	// 		userRolePilih: p,
	// 	});
	// }

	_handleUpdateProfileDokter() {
		// const form = this.props.pasienStore;
		db.doPasienxxUpdateProfilDokter(this.state.sttKey,
			this.state.sttUsername,
			this.state.sttEmail,
			this.state.sttGender,
			this.state.sttHandphone,
			this.state.sttAlamat,
			this.state.sttDescription,
			);
		this.props.navigation.navigate("Home");
	}

	render() {
		// console.log(this.state);
		// const form = this.props.pasienStore;
		// form.clearStore();

		const FormInputBarang = (
			<Card>
				<Form>
					<Item stackedLabel >
						<Label>Username</Label>
						<Input
							ref={c => (this.inpUsername = c)}
							value={this.state.sttUsername}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => this._handleUsernameChange(e)}
						/>
					</Item>
					<Item stackedLabel >
						<Label>Email</Label>
						<Input
							ref={c => (this.inpEmail = c)}
							value={this.state.sttEmail}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => this._handleEmailChange(e)}
						/>
					</Item>
					<Label
						style={{ marginLeft: 15, marginTop: 5,  color: "#575757" }}
						>Gender
					</Label>
					<Picker
						placeholder="Gender"
						iosHeader="-Pilih Gender-"
						mode="dropdown"
						style={{ marginLeft: 15 }}
						selectedValue={this.state.sttGender}
						onValueChange={this._handleGenderChange.bind(this)}
						>
						{ this._make_list(this.state.Genders, "-Pilih Gender-")}
					</Picker>
					<Item stackedLabel >
						<Label>Handphone</Label>
						<Input
							ref={c => (this.inpHandphone = c)}
							value={this.state.sttHandphone}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => this._handleHandphoneChange(e)}
						/>
					</Item>
					<Item stackedLabel >
						<Label>Alamat</Label>
						<Input
							ref={c => (this.inpAlamat = c)}
							value={this.state.sttAlamat}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => this._handleAlamatChange(e)}
						/>
					</Item>
					<Item stackedLabel >
						<Label>Deskripsi</Label>
						<Input
							ref={c => (this.inpDescription = c)}
							value={this.state.sttDescription}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => this._handleDescriptionChange(e)}
						/>
					</Item>
				</Form>
			</Card>
		);

		return <UpdateProfileDokterPage
					navigation={this.props.navigation}
					formInputBarang={FormInputBarang}
					handleUpdateRole={() => this._handleUpdateProfileDokter()}
				/>;
	}
}
