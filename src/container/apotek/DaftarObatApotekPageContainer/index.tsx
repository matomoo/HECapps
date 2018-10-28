import React from "react";
import { observer, inject } from "mobx-react/native";
import DaftarObatApotekPage from "../../../stories/screens/apotek/DaftarObatApotekPage";
// import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";

import { List,
	ListItem,
	Left,
	Right,
	Text,
	Icon,
	Card, CardItem,
	View,
} from "native-base";

// import moment from "moment";

export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
	inputBarangApotekStore;
}
export interface State {
	listObats;
}

@inject ("pasienStore", "mainStore", "inputBarangApotekStore")
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

	componentWillMount() {
		this.getFirstData(this.taskObat);
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
