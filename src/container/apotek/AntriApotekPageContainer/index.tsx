import React from "react";
import { observer, inject } from "mobx-react/native";
import AntriApotekPage from "../../../stories/screens/apotek/AntriApotekPage";
import { db } from "../../../firebase";
// import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
}
export interface State {}

@inject ("pasienStore", "mainStore")
@observer
export default class AntriApotekPageContainer extends React.Component<Props, State> {

	componentDidMount() {
		db.GetAllPasienStatusApotekNOK().then(snapshot => {
			this.props.pasienStore.itemsPasien = snapshot.val();
		});
	}

	_onClickConfirmObat() {
		console.log(this.props.pasienStore);
	}

	render() {
		// console.log(this.props.pasienStore.itemsPasien);
		let list = this.props.pasienStore.itemsPasien ? this.props.pasienStore.itemsPasien : undefined;
		return <AntriApotekPage
					navigation={this.props.navigation}
					lists={list}
					onClickconfirmObat={() => this._onClickConfirmObat()}
				/>;
	}
}
