import React from "react";
import { observer, inject } from "mobx-react/native";
import AntriBillingPage from "../../../stories/screens/billing/AntriBillingPage";
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
export default class AntriBillingPageContainer extends React.Component<Props, State> {

	componentDidMount() {
		db.GetAllPasienStatusBillingNOK().then(snapshot => {
			this.props.pasienStore.itemsPasien = snapshot.val();
		});
	}

	_onClickConfirmBilling() {
		console.log(this.props.pasienStore);
	}

	render() {
		// console.log(this.props.pasienStore.itemsPasien);
		let list = this.props.pasienStore.itemsPasien ? this.props.pasienStore.itemsPasien : undefined;
		return <AntriBillingPage
					navigation={this.props.navigation}
					lists={list}
					onClickconfirmBilling={() => this._onClickConfirmBilling()}
				/>;
	}
}
