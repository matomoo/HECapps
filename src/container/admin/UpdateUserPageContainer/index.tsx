import * as React from "react";
import UpdateUserPage from "../../../stories/screens/admin/UpdateUserPage";
import {
	Card,
	Form,
	// Item,
	CardItem,
	// Input,
	Picker,
	Label,
	Button,
	// Icon,
	Text,
	Separator,
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
	userRolePilih;
	roles;
}

@inject("mainStore", "pasienStore")
@observer
export default class UpdateUserPageContainer extends React.Component<Props, State> {
	// idASInput: any;
	userRoleInput: any;

	constructor() {
		super();
		this.state = {
			userRolePilih: "",
			roles: ["dokter", "pasien", "apotek", "billing", "resepsionis"],
		};
	}

	componentDidMount() {
		console.log(this.props.navigation);
		// const form = this.props.pasienStore;
		// if (this.props.navigation.state.params.action === "new") {
		// 	form.clearStore2();
		// }
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

	_handlePilihRole( p) {
		// console.log( p );
		this.setState ({
			userRolePilih: p,
		});
	}

	_handleUpdateUserRole() {
		const form = this.props.pasienStore;
		db.doPasienxxUpdateRole(form.Users.profil._key, this.state.userRolePilih);
		this.props.navigation.navigate("Home");
	}

	render() {
		// console.log(this.props.pasienStore);
		const form = this.props.pasienStore;
		// form.clearStore();

		const FormInputBarang = (
			<Card>
					<CardItem>
						<Text>Nama User : { form.Users.profil.username}</Text>
					</CardItem>
					<CardItem>
						<Text>Email User: { form.Users.profil.email}</Text>
					</CardItem>
				<Form>
					<Label
						style={{ marginLeft: 15, marginTop: 5,  color: "#575757" }}
						>User Role ({ form.Users.profil.role})
					</Label>
					<Picker
						placeholder="User Role"
						iosHeader="-Pilih User Role-"
						mode="dropdown"
						style={{ marginLeft: 15 }}
						selectedValue={this.state.userRolePilih}
						onValueChange={this._handlePilihRole.bind(this)}
						>
						{ this._make_list(this.state.roles, "-Pilih User Role-")}
					</Picker>
					<Separator />
					<Button block onPress={() => this._handleUpdateUserRole()}>
						<Text>Simpan Data</Text>
					</Button>
				</Form>
			</Card>
		);

		return <UpdateUserPage
					navigation={this.props.navigation}
					formInputBarang={FormInputBarang}
					handleUpdateRole={() => this._handleUpdateUserRole()}
				/>;
	}
}
