import * as React from "react";
import InputBarangApotekPage from "../../stories/screens/InputBarangApotekPage";
import {
	Card,
	Form,
	Item,
	Input,
	Picker,
	Label,
} from "native-base";
import { Platform } from "react-native";
import { observer, inject } from "mobx-react/native";
import { db } from "../../firebase";

export interface Props {
	navigation: any;
	mainStore: any;
	inputBarangApotekStore: any;
}
export interface State {
	satuanABMPilih: any;
	jenisABMPilih: any;
	idASInput: any;
}

@inject("mainStore", "inputBarangApotekStore")
@observer
export default class InputBarangApotekPageContainer extends React.Component<Props, State> {
	// idASInput: any;
	namaABMInput: any;
	jumlahABMInput: any;
	hargaBeliABMInput: any;

	constructor() {
		super();
		this.state = {
			satuanABMPilih: "pilih",
			jenisABMPilih: "pilih",
			idASInput: "",
		};
	}

	_handleInputBarang() {
		const { namaABM, jumlahABM, hargaBeliABM } = this.props.inputBarangApotekStore;
		db.doApotekBarangMasukxxInput( namaABM, jumlahABM, hargaBeliABM, this.state.satuanABMPilih, this.state.jenisABMPilih );
		db.getIdAS(namaABM).then(c1 => {
			console.log(c1.val());
			if (c1.val()) {
				console.log("disini buat update jumlah");
				// c1.forEach(c2 => {
				// 	console.log(c2.key);
				// 	return true;
				// });
			} else {
				db.doApotekStokxxInput( namaABM, jumlahABM, hargaBeliABM, this.state.satuanABMPilih, this.state.jenisABMPilih );
			}
		});
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
		this.setState({ satuanABMPilih: value });
	}

	_handleValueChangePic2(value: string) {
		this.setState({ jenisABMPilih: value });
	}

	render() {
		// console.log(this.props);
		const form = this.props.inputBarangApotekStore;

		const FormInputBarang = (
			<Card>
				<Form>
					<Item>
						<Label>ID Barang - {form.IdAS}</Label>
					</Item>
					<Item stackedLabel error={form.namaABMError ? true : false}>
						<Label>Nama Barang</Label>
						<Input
							ref={c => (this.namaABMInput = c)}
							value={form.namaABM}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.namaABMonChange(e)}
						/>
					</Item>
					<Item stackedLabel error={form.jumlahABMError ? true : false}>
						<Label>Jumlah Barang</Label>
						<Input
							ref={c => (this.jumlahABMInput = c)}
							value={form.jumlahABM}
							style={{ marginLeft: 10 }}
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
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.hargaBeliABMonChange(e)}
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
						selectedValue={this.state.satuanABMPilih}
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
						selectedValue={this.state.jenisABMPilih}
						onValueChange={this._handleValueChangePic2.bind(this)}
						>
						{ this._make_list(this.props.inputBarangApotekStore.listJenisABM, "-Pilih Jenis Barang-")}
					</Picker>
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
