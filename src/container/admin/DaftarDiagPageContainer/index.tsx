import React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarDiagPage from "../../../stories/screens/admin/DaftarDiagPage";
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
	inputConsDiagStore: any;
	mainStore: any;
}
export interface State {
	listDiags;
}

@inject ("inputConsDiagStore", "mainStore")
@observer
export default class DaftarDiagPageContainer extends React.Component<Props, State> {
	taskDiag;

	constructor(props) {
		super(props);
		this.taskDiag = db1.db.ref(`constant`);
		this.state = {
			listDiags: [],
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
					listDiags: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
	}

	componentDidMount() {
		this.getFirstData(this.taskDiag);
	}

	_onUpdateDiag( p ) {
		this.props.inputConsDiagStore.namaDiagOnChange(p.namaDiag);
		this.props.inputConsDiagStore.hargaDiagOnChange(p.hargaDiag);
		this.props.inputConsDiagStore.daftarDiagOnUpdate( p );
		this.props.navigation.navigate("InputConsDiagPage", { action: "update"} );
	}

	render() {
		console.log(this.state.listDiags);
		const {listDiags } = this.state;
		const viewDiags = (
			<View>
				{ listDiags.map(el =>
					<Card key={el.idDiag}>
							<CardItem>
								<Text>{el.namaDiag}</Text>
							</CardItem>
							<CardItem>
								<Text>{el.hargaDiag}</Text>
							</CardItem>
							<CardItem button
								onPress={() => this._onUpdateDiag(el) } >
								<Icon active name="md-send" /><Text>Ubah Diag</Text>
							</CardItem>
						</Card>,
					)
				}
			</View>
		);

		return <DaftarDiagPage
					navigation={this.props.navigation}
					viewDiags = {viewDiags}
				/>;
	}
}
