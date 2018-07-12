import * as React from "react";
import { Item, Input, Form, Label,
			Text,
			Content,
			ListItem,
			CheckBox,
			Body,
			} from "native-base";
import { observer, inject } from "mobx-react/native";
import InputDiagnosaPage from "../../stories/screens/InputDiagnosaPage";
import { db } from "../../firebase";
// import Moment from "react-moment";
import moment from "moment";
import dataDefaultDiagnosa from "./dataDefaultDiagnosa";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
	inputDiagnosaStore: any;

}
export interface State {}

@inject("pasienStore", "inputDiagnosaStore")
@observer
export default class InputDiagnosaPageContainer extends React.Component<Props, State> {
	analysisInput: any;

	constructor(props) {
		super(props);
	}
	toggleSwitch1() {
		this.props.inputDiagnosaStore.checkbox1 = !this.props.inputDiagnosaStore.checkbox1;
		// this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[0].namaDiagnosa );
		// console.log(this.props.inputDiagnosaStore.selectedDiagnosa);
		}
	toggleSwitch2() {
		this.props.inputDiagnosaStore.checkbox2 = !this.props.inputDiagnosaStore.checkbox2;
		// this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[1].namaDiagnosa );
		// console.log(this.props.inputDiagnosaStore.selectedDiagnosa);
	}
	toggleSwitch3() {
		this.props.inputDiagnosaStore.checkbox3 = !this.props.inputDiagnosaStore.checkbox3;
		// this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[2].namaDiagnosa );
		// console.log(this.props.inputDiagnosaStore.selectedDiagnosa);
	}

	onSimpanKeTabelPasien = () => {
		const dateToFormat = new Date();
		// db.doSimpanPasien(this.props.pasienStore.currentPasienTerpilihUid, moment(dateToFormat).format("DD-MMM-YYYY"), this.props.pasienStore.analysis);
		// this.props.navigation.navigate("RekamMedikPasien");
		if (this.props.inputDiagnosaStore.checkbox1) {
			this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[0].namaDiagnosa, dataDefaultDiagnosa[0].harga );
		}
		if (this.props.inputDiagnosaStore.checkbox2) {
			this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[1].namaDiagnosa, dataDefaultDiagnosa[1].harga );
		}
		if (this.props.inputDiagnosaStore.checkbox3) {
			this.props.inputDiagnosaStore.addListItem(dataDefaultDiagnosa[2].namaDiagnosa, dataDefaultDiagnosa[2].harga );
		}
		db.doSimpanDiagnosaPasien(
				this.props.pasienStore.currentPasienTerpilihUid,
				moment(dateToFormat).format("DD-MMM-YYYY"),
				JSON.stringify(this.props.inputDiagnosaStore.selectedDiagnosa),
			);
		// console.log(this.props.inputDiagnosaStore);
		const key = this.props.pasienStore.currentPasienTerpilihUid;
		this.props.navigation.navigate("RekamMedikPasien", {name: { key }});
		// this.props.navigation.goBack();
		this.props.inputDiagnosaStore.resetForm();
	}

	onNavigationBack= () => {
		this.props.navigation.goBack();
	}

	render() {
		const form = this.props.pasienStore;

		const Fields = (
			<Form>
				<Item
					stackedLabel
					bordered
					>
						<Label>Nama Pasien</Label>
						<Text>{form.currentPasienTerpilihUsername}</Text>
				</Item>
				<Item
					stackedLabel
					bordered
					>
					<Label>Input Diagnosa</Label>
					<Input
						// ref={c => (this.analysisInput = c)}
						ref={this.props.inputDiagnosaStore.checkbox1}
						onChangeText={e => form.analysisOnChange(e)}
						multiline={true}
						numberOfLines={10}
						style={{ height: 200, marginLeft: 10, marginTop: 10, textAlignVertical: "top" }}
					/>
				</Item>
			</Form>
		);

		const PilihanDiagnosa = (
			<Content>
				<ListItem button onPress={() => this.toggleSwitch1()}>
					<CheckBox
					checked={this.props.inputDiagnosaStore.checkbox1}
					onPress={() => this.toggleSwitch1()}
					/>
					<Body>
					<Text>{dataDefaultDiagnosa[0].namaDiagnosa}</Text>
					</Body>
				</ListItem>
				<ListItem button onPress={() => this.toggleSwitch2()}>
					<CheckBox
					checked={this.props.inputDiagnosaStore.checkbox2}
					onPress={() => this.toggleSwitch2()}
					/>
					<Body>
					<Text>{dataDefaultDiagnosa[1].namaDiagnosa}</Text>
					</Body>
				</ListItem>
				<ListItem button onPress={() => this.toggleSwitch3()}>
					<CheckBox
					checked={this.props.inputDiagnosaStore.checkbox3}
					onPress={() => this.toggleSwitch3()}
					/>
					<Body>
					<Text>{dataDefaultDiagnosa[2].namaDiagnosa}</Text>
					</Body>
				</ListItem>
			</Content>

		);

		return (
			<InputDiagnosaPage
					inputDiagnosaForm={Fields}
					navigationBack={this.onNavigationBack}
					onSimpan={this.onSimpanKeTabelPasien}
					pilihanDiagnosa={PilihanDiagnosa}
					/>
				);
	}
}
