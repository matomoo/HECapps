import * as React from "react";
import { observer, inject } from "mobx-react/native";
import InputConsDiagPage from "../../../stories/screens/admin/InputConsDiagPage";
import { Card,
			Form,
			Item,
			Label,
			Input,
} from "native-base";
import { db } from "../../../firebase";

export interface Props {
	navigation: any;
	inputConsDiagStore: any;
}
export interface State {}

@inject("inputConsDiagStore")
@observer
export default class InputConsDiagPageContainer extends React.Component<Props, State> {
	namaDiagInput: any;
	hargaDiagInput: any;

	_handleInputDiag() {
		const { namaDiag, hargaDiag } = this.props.inputConsDiagStore;
		db.doInputConsDiag( namaDiag, hargaDiag );
		this.props.inputConsDiagStore.clearStore();
		this.props.navigation.navigate("Home");
	}

	render() {
		const form = this.props.inputConsDiagStore;

		const FormInputDiag = (
			<Card>
				<Form>
					<Item stackedLabel error={form.namaABMError ? true : false}>
						<Label>Nama Diagnosa</Label>
						<Input
							ref={c => (this.namaDiagInput = c)}
							value={form.namaDiag}
							style={{ marginLeft: 10 }}
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.namaDiagOnChange(e)}
						/>
					</Item>
					<Item stackedLabel error={form.jumlahABMError ? true : false}>
						<Label>Harga Diagnosa</Label>
						<Input
							ref={c => (this.hargaDiagInput = c)}
							value={form.hargaDiag}
							style={{ marginLeft: 10 }}
							keyboardType="numeric"
							// onBlur={() => form.validateUsername()}
							onChangeText={e => form.hargaDiagOnChange(e)}
						/>
					</Item>
				</Form>
			</Card>
		);

		return <InputConsDiagPage
					navigation={this.props.navigation}
					inputFormDiag={FormInputDiag}
					handleInputDiag={ () => this._handleInputDiag() }
				/>;
	}
}
