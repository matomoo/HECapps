import * as React from "react";
import { observer, inject } from "mobx-react/native";
// import _ from "lodash";
import { db } from "../../firebase";

import RekamMedikPasienPage from "../../stories/screens/RekamMedikPasienPage";
export interface Props {
	navigation: any;
	pasienStore: any;
	mainStore: any;
}

export interface State {}

@inject ("pasienStore", "mainStore")
@observer
export default class RekamMedikPasienPageContainer extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		// console.log("Rekam Medik Pasien Container - Constructor");
		// console.log(this.props);
	}
	// componentDidMount(){
	// 	console.log("Rekam Medik Pasien Container - DidMount");
	// }
	componentWillMount() {
		db.GetRekamMedikPasien(this.props.navigation.state.params.name.key).then(snapshot => {
			this.props.pasienStore.itemsRekamMedikPasien = snapshot.val() ;
			this.props.pasienStore.currentPasienTerpilihUsername = this.props.pasienStore.itemsRekamMedikPasien.profil.username;
			this.props.pasienStore.currentPasienTerpilihUid = this.props.navigation.state.params.name.key;
			// this.props.pasienStore.itemsRekamMedikPasien = _.map(snapshot.val(), (value, key) => ({key, value}) )
			// const arrRekamMedikPasien = _.map(this.props.pasienStore.itemRekamMedikPasien, (value, key) => ({key, value}) )
			// console.log("Rekam Medik Pasien Container - WillMount");
			// console.log(this.props.pasienStore.itemsRekamMedikPasien.rekamMedik);
			// console.log(this.props.pasienStore.currentPasienUid);
			// console.log(snapshot.val());
		});
		// const arr = _.map( this.props.pasienStore.itemsPasien, (value, key) => ({key, value}) );

		// const objPasienTerpilih = _.find(
		// 			arr,
		// 			{key : this.props.navigation.state.params.name.key},
		// 		);
		// // console.log(this.props.navigation.state.params.name.key)
		// // console.log(objPasienTerpilih);
		// this.props.pasienStore.currentPasienTerpilihUsername = objPasienTerpilih.value.username;
		// this.props.pasienStore.currentPasienTerpilihUid = this.props.navigation.state.params.name.key;
		// // this.props.pasienStore.currentPasienRole = objPasienTerpilih.value.role;
	}

	simpanPasienKeDaftarPeriksa() {
		db.doSimpanDaftarTunggu(this.props.navigation.state.params.name.key);
		this.props.navigation.navigate("PasienPage");
		// console.log(this.props.navigation.state.params.name.key);
		// console.log(this.props);
	}

	render() {

		// console.log("Rekam Medik Pasien Container - Render");
		// console.log(objPasienTerpilih);
		// console.log(this.props.pasienStore);
		const { currentPasienTerpilihUsername } = this.props.pasienStore;
		const { currentUserRole } = this.props.mainStore;

		return <RekamMedikPasienPage
					navigation={this.props.navigation}
					pasienUsername = {currentPasienTerpilihUsername}
					pasienRekamMedik = {this.props.pasienStore.itemsRekamMedikPasien.rekamMedik }
					userRole = {currentUserRole}
					onSimpanPasienKeDaftarPeriksa = {() => this.simpanPasienKeDaftarPeriksa()}
					/>;
		// return <RekamMedikPasienPage
		// 			navigation={this.props.navigation}
		// 			pasienRekamMedik = {this.props.pasienStore.itemsRekamMedikPasien ? this.props.pasienStore.itemsRekamMedikPasien : undefined }
		// />;
	}
}
