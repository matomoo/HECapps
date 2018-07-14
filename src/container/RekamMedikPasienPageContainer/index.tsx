import * as React from "react";
import { observer, inject } from "mobx-react/native";
// import _ from "lodash";
import { db } from "../../firebase";

import RekamMedikPasienPage from "../../stories/screens/RekamMedikPasienPage";
import { List,
			ListItem,
			Left,
			Right,
			Text,
			Icon,
} from "native-base";
// import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
}

export interface State {}

@inject ("pasienStore", "mainStore")
@observer
export default class RekamMedikPasienPageContainer extends React.Component<Props, State> {
	selectedCard;
	// rmDiagTitle: any;
	// rmDiagContent: any;
	// rmObatTitle: any;
	// rmObatContent: any;

	// constructor(props) {
	// 	super(props);
	// }

	// listDetailRekamMedik = () => {
	// 	const { rekamMedik } = this.props.pasienStore.itemsRekamMedikPasien;
	// 	const aax = rekamMedik;
	// 	try {
	// 		Object.keys(aax).map(keyx1 => {
	// 			this.rmDiagTitle = keyx1;
	// 			this.rmDiagContent = JSON.parse(aax[keyx1].hasilDiagnosa);
	// 			this.rmObatTitle = keyx1;
	// 			this.rmObatContent = JSON.parse(aax[keyx1].hasilObat);
	// 			},
	// 		);
	// 	} catch  (error) {
	// 		// console.log(error);
	// 	}
	// }

	componentWillMount() {
		// let now = moment().format("YYYY-MMM-DD");
		// console.log(now, moment().format("LLLL"));

		this._getRekamMedik(this.props.navigation.state.params.name.key);
	}

	async _getRekamMedik(uKey) {
		await db.GetRekamMedikPasienX2(uKey).then(snapshot => {
			// console.log(snapshot.val());
			this.props.pasienStore.itemsRekamMedikPasien = snapshot.val() ;
			this.props.pasienStore._handleGetNameFromKey(
				this.props.navigation.state.params.name.key,
				this.props.pasienStore.itemsPasien[this.props.navigation.state.params.name.key],
			);
		});
	}

	render() {
		// console.log(this.props);
		const { currentPasienTerpilihUsername, currentPasienTerpilihUid } = this.props.pasienStore;
		const { currentUserRole } = this.props.mainStore;
		const key = currentPasienTerpilihUid;

		const menuDokter = (
			<List>
				<ListItem
					key="3"
					onPress={() => this.props.navigation.navigate("InputDiagnosaPage", {name : {key}} )}
					>
					<Left><Text>Input Diagnosa</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
				<ListItem
					key="2"
					onPress={() => this.props.navigation.navigate("InputObat", {name : {key}} )}
					>
					<Left><Text>Input Obat</Text></Left>
					<Right><Icon active name="ios-arrow-forward"/></Right>
				</ListItem>
			</List>
		);

		if (currentUserRole === "admin") {
			// selectedCard = cardAdmin;
		} else if (currentUserRole === "dokter") {
			this.selectedCard = menuDokter;
		} else if (currentUserRole === "pasien") {
			// selectedCard = cardPasien;
		} else if (currentUserRole === "resepsionis") {
			// selectedCard = menuResepsionis;
		}

		return <RekamMedikPasienPage
					navigation={this.props.navigation}
					pasienUsername = {currentPasienTerpilihUsername}
					// pasienRekamMedik = {this.props.pasienStore.itemsRekamMedikPasien.rekamMedik }
					userRole = { currentUserRole }
					selectedCard = { this.selectedCard }
					/>;
	}
}
