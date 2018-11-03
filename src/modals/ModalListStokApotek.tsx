import React, { Component } from "react";

import {
	Modal,
	Text,
	TouchableHighlight,
	View,
	StyleSheet,
}
from "react-native";
import {
	Icon,
	List,
	ListItem,
} from "native-base";
import { db } from "../firebase";
import { observer, inject } from "mobx-react/native";

export interface Props {
	inputBarangApotekStore?: any;
}

@inject("inputBarangApotekStore")
@observer
class ModalExample extends Component<Props> {

	state = {
		modalVisible: false,
		arrStok: [],
	};

	toggleModal(visible) {
		this.setState({ modalVisible: visible });
	}

	async _handleGetListApotekStok() {
		await db.getApotekStok().then(c1 => {
			this.setState({ arrStok: this.snapshotToArray(c1)} );
		});
	}

	_handleOnPressListItem ( a ) {
		// console.log(this.props);
		// console.log(a);
		this.props.inputBarangApotekStore.modalApotekStok( a.idAS, a.namaAS, a.hargaBeliAS,
				a.satuanAS, a.jenisAS, a.jumlahAS, a.hargaJualAS,
			);
		this.toggleModal(!this.state.modalVisible);
	}

	snapshotToArray(snapshot) {
		const returnArr = [];
		snapshot.forEach(function(childSnapshot) {
			const item = childSnapshot.val();
			item.key = childSnapshot.key;
			returnArr.push(item);
		});
		return returnArr;
	}

	componentDidMount() {
		this._handleGetListApotekStok();
	}

	render() {
		// console.log(this.props.inputBarangApotekStore);

		return (
			<View style = {styles.container}>
				<Modal animationType = {"slide"} transparent = {false}
					visible = {this.state.modalVisible}
					onRequestClose = {() => { console.log("Modal has been closed."); }}
					>
					<View style = {styles.modal}>
						<Text style = {styles.text}>Modal is open!</Text>
						<List>
							{ !!this.state.arrStok.length &&
								this.state.arrStok.map(el => (
									<ListItem
										key={el.idAS}
										onPress={ () => this._handleOnPressListItem(el) }
									>
										<Text>{el.namaAS}</Text>
									</ListItem>
								))
							}
						</List>
						<TouchableHighlight
							onPress = {() => {this.toggleModal(!this.state.modalVisible); }}>
							<Text style = {styles.text}>Close Modal</Text>
						</TouchableHighlight>
					</View>
				</Modal>
				<TouchableHighlight onPress = {() => { this.toggleModal(true); } }>
				{/* <Text style = {styles.text}>Open Modal</Text> */}
					<Icon
						active
						// onPress={() => {}}
						name="home"
					/>
				</TouchableHighlight>
			</View>
		);
	}
}
export default ModalExample;

const styles = StyleSheet.create ({
	container: {
		alignItems: "center",
		// backgroundColor: "#ede3f2",
		padding: 2,
	},
	modal: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#4A6572",
		padding: 10,
	},
	text: {
		color: "#ffffff",
		marginTop: 10,
	},
	});