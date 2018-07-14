import { observable, action } from "mobx";
import _ from "lodash";

class PasienStore {
	@observable hasErrored = false;
	@observable isLoading = true;
	@observable itemsPasien = {};
	@observable items2Pasien = {};
	@observable itemsRekamMedikPasien = {};
	@observable currentPasienUid = "";
	@observable currentPasienUsername = "";
	@observable currentPasienRole = "";
	@observable currentPasienTerpilihUid = "";
	@observable currentPasienTerpilihUsername = "";
	@observable analysis = "";
	@observable obat = "";
	@observable stoHargaDiag = "";

	@action
	fetchItems(data) {
		this.itemsPasien = data;
		this.isLoading = false;
	}

	@action
	analysisOnChange(param) {
		this.analysis = param;
		// this.validateEmail();
	}

	@action
	obatOnChange(param) {
		this.obat = param;
		// this.validateEmail();
	}

	@action
	_handleNameDiagSelected( p, q ) {
		try {
			const a = _.find(q, { namaDiag: p });
			// console.log(a);
			this.stoHargaDiag = a.hargaDiag;
		} catch (error) {
			// console.log(error);
		}
	}

	@action
	_handleGetNameFromKey( p, q ) {
		try {
			this.currentPasienTerpilihUid = p;
			this.currentPasienTerpilihUsername = q.profil.username;
		} catch (error) {
			// console.log(error);
		}
	}

}

export default PasienStore;
