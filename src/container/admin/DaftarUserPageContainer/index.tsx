import React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarUserPage from "../../../stories/screens/admin/DaftarUserPage";
// import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";

import {
	// List, ListItem, Left, Right,
	Icon,
	Text,
	Card, CardItem,
	View,
} from "native-base";

// import moment from "moment";

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
export default class DaftarUserPageContainer extends React.Component<Props, State> {
	taskUser;

	constructor(props) {
		super(props);
		this.taskUser = db1.db.ref(`pasiens`);
		this.state = {
			listUsers: [],
		};
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = [];
				result.forEach(el => {
					r1.push(el.val());
				});
				this.setState({
					listUsers: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
	}

	componentDidMount() {
		this.getFirstData(this.taskUser);
	}

	_onUpdateUserRole( p ) {
		this.props.pasienStore._handleUserUpdate(p);
		this.props.navigation.navigate("UpdateUserPage");
	}

	render() {
		// console.log(this.state.listUsers);
		const {listUsers } = this.state;
		const viewUsers = (
			<View>
				{ listUsers.map(el =>
					<Card key={el.profil._key}>
							<CardItem>
								<Text>{el.profil.username}</Text>
							</CardItem>
							<CardItem>
								<Text>{el.profil.email}</Text>
							</CardItem>
							<CardItem>
								<Text>{el.profil.role}</Text>
							</CardItem>
							<CardItem button
								onPress={() => this._onUpdateUserRole(el) } >
								<Icon active name="md-send" /><Text>Ubah Role</Text>
							</CardItem>
						</Card>,
					)
				}
			</View>
		);

		return <DaftarUserPage
					navigation={this.props.navigation}
					viewUsers = {viewUsers}
				/>;
	}
}
