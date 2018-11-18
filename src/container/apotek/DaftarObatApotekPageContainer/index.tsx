import React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarObatApotekPage from "../../../stories/screens/apotek/DaftarObatApotekPage";
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
	mainStore: any;
	inputBarangApotekStore;
}
export interface State {
	listObats;
}

@inject ("mainStore", "inputBarangApotekStore")
@observer
export default class DaftarObatApotekPageContainer extends React.Component<Props, State> {
	taskObat;

	constructor(props) {
		super(props);
		this.taskObat = db1.db.ref(`apotekStokBarang`);
		this.state = {
			listObats: [],
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
					listObats: r1,
				});

			}).catch((err) => {
				console.log(err);
		});
	}

	componentDidMount() {
		this.getFirstData(this.taskObat);
	}

	_onApotekUbahData( p ) {
		this.props.inputBarangApotekStore.modalApotekStok( p.idAS, p.namaAS, p.hargaBeliAS,
			p.satuanAS, p.jenisAS, p.jumlahAS, p.hargaJualAS,
		);
		// this.props.inputBarangApotekStore.flagActionUpdate("update");
		this.props.navigation.navigate("InputBarangApotekPage", {action: "update"});
	}

	render() {
		console.log(this.state.listObats);
		const {listObats } = this.state;
		const viewObats = (
			<View>
				{ listObats.map(el =>
					<Card key={el.idAS}>
							<CardItem>
								<Text>{el.namaAS} - {el.satuanAS} - {el.jenisAS}</Text>
							</CardItem>
							<CardItem>
								<Text>Jumlah: {el.jumlahAS}</Text>
							</CardItem>
							<CardItem>
								<Text>Harga Beli: {el.hargaBeliAS}</Text>
							</CardItem>
							<CardItem>
								<Text>Harga Jual: {el.hargaJualAS}</Text>
							</CardItem>
							<CardItem button
								onPress={() => this._onApotekUbahData(el) } >
								<Icon active name="md-send" /><Text>Ubah Data Obat</Text>
							</CardItem>
						</Card>,
					)
				}
			</View>
		);

		return <DaftarObatApotekPage
					navigation={this.props.navigation}
					viewObats = {viewObats}
				/>;
	}
}
