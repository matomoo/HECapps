import React from "react";
import { observer, inject } from "mobx-react/native";
import ProfileDokterPage from "../../../stories/screens/dokter/ProfileDokterPage";
import * as db1 from "../../../firebase/firebase";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
}
export interface State {
	listUsers;
}

@inject ("pasienStore", "mainStore")
@observer
export default class ProfileDokterPageContainer extends React.Component<Props, State> {
	taskUser;

	constructor(props) {
		super(props);
		const { currentUid } = this.props.mainStore;
		this.taskUser = db1.db.ref(`pasiens/${currentUid}`);
		this.state = {
			listUsers: [],
		};
	}

	async getFirstData( p ) {
		await p.once("value")
			.then((result) => {
				const r1 = [];
				r1.push(result.val());
				this.setState({
					listUsers: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
	}

	_onUpdateUserRole( p ) {
		this.props.pasienStore._handleUserUpdate(p);
		this.props.navigation.navigate("UpdateProfileDokterPage");
	}

	componentDidMount() {
		this.getFirstData(this.taskUser);
	}

	render() {
		const {listUsers } = this.state;
		const Users = listUsers;

		return <ProfileDokterPage
					navigation={this.props.navigation}
					Users = {Users}
					handleUpdateDokter = {() => this._onUpdateUserRole( Users ) }
				/>;
	}
}
