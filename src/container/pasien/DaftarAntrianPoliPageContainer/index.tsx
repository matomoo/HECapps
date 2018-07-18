import * as React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarAntrianPoliPage from "../../../stories/screens/pasien/DaftarAntrianPoliPage";
import {
	View,
	Text,
	Card,
	CardItem,
} from "native-base";
import { db } from "../../../firebase";

export interface Props {
	navigation: any;
	mainStore: any;
}
export interface State {
	chosenDate: any;
	nomorAntri: any;
}

@inject("mainStore")
@observer
export default class DaftarAntrianPoliPageContainer extends React.Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			chosenDate: new Date(),
			nomorAntri: "",
		};
		// this.setDate = this.setDate.bind(this);
	}

	// setDate(newDate) {
	// 	this.setState({ chosenDate: newDate });
	// }

	componentWillMount() {
		this.getNoAntri();
	}

	getNoAntri() {
		db.getNumberLastAntrian()
			.then(res => {
				this.setState({ nomorAntri: res.val() + 1 });
				// console.log(res.val());
			});
	}

	handleAntriPoli( uid, uName) {
		db.getNumberLastAntrian()
			.then(res => {
				db.doPasienDaftarAntrian(uid, uName, res.val() + 1);
				this.setState({ nomorAntri: res.val() + 1 });
				this.props.mainStore.nomorAntrianPoli = this.state.nomorAntri;
				// console.log(res.val());
			});
		this.props.navigation.navigate("Home");
	}

	render() {
		const { currentUid, currentUsername } = this.props.mainStore;
		const Forms = (
			<View>
				<Card>
					<CardItem footer button
						onPress={() => this.handleAntriPoli(currentUid, currentUsername)}
						>
						<Text>Daftar Antrian Poli ke - { this.state.nomorAntri ? this.state.nomorAntri : "loading data..." }</Text>
					</CardItem>
				</Card>
				<Text>
					{/* Date: {this.state.chosenDate.toString().substr(4, 12)} */}
				</Text>
			</View>
		);

		return <DaftarAntrianPoliPage
					navigation={this.props.navigation}
					forms = {Forms}
				/>;
	}
}
