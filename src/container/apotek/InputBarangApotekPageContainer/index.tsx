import * as React from "react";
import InputBarangApotekPage from "../../../stories/screens/apotek/InputBarangApotekPage";
import {
	Card,
	Form,
	Item,
	Input,
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
import ModalListStokApotek from "../../../modals/ModalListStokApotek";

export interface Props {
	navigation: any;
	mainStore: any;
	inputBarangApotekStore: any;
}
export interface State {
	satuanABMPilih: any;
	jenisABMPilih: any;
	modalNamaAS: any;
}

@inject("mainStore", "inputBarangApotekStore")
@observer
export default class InputBarangApotekPageContainer extends React.Component<Props, State> {
	// idASInput: any;
	namaABMInput: any;
	jumlahABMInput: any;
	hargaBeliABMInput: any;
	hargaJualABMInput: any;

	constructor() {
		super();
		this.state = {
			satuanABMPilih: "pilih",
			jenisABMPilih: "pilih",
			modalNamaAS: "",
		};
	}

	componentDidMount() {
		console.log(this.props.navigation);
		const form = this.props.inputBarangApotekStore;
		// const action = this.props.navigation.params.
		if (this.props.navigation.state.params.action === "new") {
			form.clearStore();
		}
	}

	_handleInputBarang() {
		const { namaABM, jumlahABM, hargaBeliABM, hargaJualABM, satuanABMPilih, jenisABMPilih } = this.props.inputBarangApotekStore;
		db.doApotekBarangMasukxxInput( namaABM, jumlahABM, hargaBeliABM, hargaJualABM, satuanABMPilih, jenisABMPilih );
		db.getIdAS(namaABM).then(c1 => {
			// console.log(c1.val());
			if (c1.val()) {
				// console.log("disini buat update jumlah");
				c1.forEach(c2 => {
					// console.log(c2.val());
					db.doApotekStokxxUpdateStok( c2.key, parseInt(c2.val().jumlahAS, 10) + parseInt(jumlahABM, 10) );
					return true;
				});
			} else {
				db.doApotekStokxxInput(
					namaABM,
					parseInt(jumlahABM, 10),
					parseInt(hargaBeliABM, 10),
					parseInt(hargaJualABM, 10),
					satuanABMPilih,
					jenisABMPilih,
				);
			}
		});
		this.props.inputBarangApotekStore.clearStore();
		this.props.navigation.navigate("Home");
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

	_handleValueChangePic1(value: string) {
		// this.setState({ satuanABMPilih: value });
		this.props.inputBarangApotekStore.satuanABMPilih = value;
	}

	_handleValueChangePic2(value: string) {
		// this.setState({ jenisABMPilih: value });
		this.props.inputBarangApotekStore.jenisABMPilih = value;
	}

	render() {
		// console.log(this.props);
		const form = this.props.inputBarangApotekStore;
		// form.clearStore();

		const FormInputBarang = (
			<Card>
				<Form>
					<Item error={form.namaABMError ? true : false}>
						<Label>Nama Barang</Label>
						<Input
							ref={c => (this.namaABMInput = c)}
							value={form.namaABM}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.namaABMonChange(e)}
						/>
						{/* <Icon
							active
							// onPress={() => {}}
							name="home"
						/> */}
						<ModalListStokApotek/>
					</Item>
					<Item stackedLabel error={form.jumlahABMError ? true : false}>
						<Label>Jumlah Barang</Label>
						<Input
							ref={c => (this.jumlahABMInput = c)}
							value={form.jumlahABM}
							style={{ marginLeft: 10 }}
							keyboardType="numeric"
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.jumlahABMonChange(e)}
						/>
					</Item>
					<Item stackedLabel error={form.hargaBeliABMError ? true : false}>
						<Label>Harga Beli Barang</Label>
						<Input
							ref={c => (this.hargaBeliABMInput = c)}
							value={form.hargaBeliABM}
							style={{ marginLeft: 10 }}
							keyboardType="numeric"
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.hargaBeliABMonChange(e)}
						/>
					</Item>
					<Item stackedLabel error={form.hargaJualABMError ? true : false}>
						<Label>Harga Jual Barang</Label>
						<Input
							ref={c => (this.hargaJualABMInput = c)}
							value={form.hargaJualABM}
							style={{ marginLeft: 10 }}
							keyboardType="numeric"
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.hargaJualABMonChange(e)}
						/>
					</Item>
					<Label
						style={{ marginLeft: 15, marginTop: 5,  color: "#575757" }}
						>Satuan Barang
					</Label>
					<Picker
						placeholder="Satuan Barang"
						iosHeader="-Pilih Satuan Barang-"
						mode="dropdown"
						style={{ marginLeft: 15 }}
						selectedValue={form.satuanABMPilih}
						onValueChange={this._handleValueChangePic1.bind(this)}
						>
						{ this._make_list(this.props.inputBarangApotekStore.listSatuanABM, "-Pilih Satuan Barang-")}
					</Picker>
					<Label
						style={{ marginLeft: 15, marginTop: 5,  color: "#575757" }}
						>Jenis Barang
					</Label>
					<Picker
						iosHeader="-Pilih Jenis Barang-"
						mode="dropdown"
						style={{ marginLeft: 15 }}
						selectedValue={form.jenisABMPilih}
						onValueChange={this._handleValueChangePic2.bind(this)}
						>
						{ this._make_list(this.props.inputBarangApotekStore.listJenisABM, "-Pilih Jenis Barang-")}
					</Picker>
					<Separator />
					<Button block onPress={() => this._handleInputBarang()}>
						<Text>Simpan Data</Text>
					</Button>
				</Form>
			</Card>
		);

		return <InputBarangApotekPage
					navigation={this.props.navigation}
					formInputBarang={FormInputBarang}
					handleInputBarang={() => this._handleInputBarang()}
				/>;
	}
}
