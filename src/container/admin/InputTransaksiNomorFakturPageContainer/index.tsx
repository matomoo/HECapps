import * as React from "react";
import { observer, inject } from "mobx-react/native";
import InputTransaksiNomorFakturPage from "../../../stories/screens/admin/InputTransaksiNomorFakturPage";
import { Card,
			Form,
			Item,
			Label,
			Input,
			Separator, Button, Text,
} from "native-base";
import { db } from "../../../firebase";

export interface Props {
	navigation: any;
	mainStore;
}
export interface State {}

@inject("mainStore")
@observer
export default class InputTransaksiNomorFakturPageContainer extends React.Component<Props, State> {
	transaksiFakturKeluarInput: any;

	_handleInputDiag() {
		const { transaksiNomorFakturKeluar } = this.props.mainStore;
		db.doInputTransaksiNomorFakturKeluar( transaksiNomorFakturKeluar );
		// this.props.mainStore.clearStore();
		this.props.navigation.navigate("Home");
	}

	render() {
		const form = this.props.mainStore;

		const FormInputDiag = (
			<Card>
				<Form>
					<Item stackedLabel error={form.namaABMError ? true : false}>
						<Label>Input Transaksi Faktur Keluar</Label>
						<Input
							ref={c => (this.transaksiFakturKeluarInput = c)}
							value={form.transaksiFakturKeluarInput}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.transaksiNomorFakturKeluarOnChange(e)}
						/>
					</Item>
					<Separator />
					<Button block onPress={() => this._handleInputDiag()}>
						<Text>Simpan Data</Text>
					</Button>
				</Form>
			</Card>
		);

		return <InputTransaksiNomorFakturPage
					navigation={this.props.navigation}
					inputFormDiag={FormInputDiag}
					handleInputDiag={ () => this._handleInputDiag() }
				/>;
	}
}
