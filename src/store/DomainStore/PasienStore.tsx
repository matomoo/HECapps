import { observable, action } from "mobx";
import _ from "lodash";

class PasienStore {
	@observable hasErrored = false;
	@observable isLoading = true;
	@observable itemsPasien = {};
	@observable itemsRekamMedikPasien = [];
	@observable itemsRekamMedikDiagPasien = [];
	@observable itemsRekamMedikObatPasien = [];
	@observable currentPasienTerpilihUid = "";
	@observable currentPasienTerpilihUsername = "";
	@observable stoHargaDiag = "";
	@observable currentPasienNomorRekamMedik = "";
	@observable currentDokterNomorRekamMedik = "";

	@observable stoHargaBeliObat: "";
	@observable stoHargaJualObat: "";
	@observable stoJumlahObat: "";
	@observable stoSatuanObat: "";
	@observable stoJenisObat: "";
	@observable stoIdObat: "";

	@observable stoStatusPasien: "";
	@observable stoPasienFlagActivity;

	@observable Users;

	@action
	_handleUserUpdate ( p ) {
		this.Users = p;
	}

	@action
	fetchItems(data) {
		this.itemsPasien = data;
		this.isLoading = false;
	}

	@action
	_handleStatusPasien(p, q) {
		this.stoStatusPasien = p;
		this.stoPasienFlagActivity = q;
		// this.isLoading = false;
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
			this.currentPasienNomorRekamMedik = q.pasienRekamMedik;
			this.currentDokterNomorRekamMedik = q.dokterRekamMedik;
		} catch (error) {
			// console.log(error);
		}
	}

	@action
	_handleNameObatSelected( p, q ) {
		try {
			const a = _.find(q, { namaObat: p });
			// console.log(a);
			this.stoHargaBeliObat = a.hargaBeliObat;
			this.stoHargaJualObat = a.hargaJualObat;
			this.stoJumlahObat = a.jumlahObat.toString();
			this.stoSatuanObat = a.satuanObat;
			this.stoJenisObat = a.jenisObat;
			this.stoIdObat = a._key;
		} catch (error) {
			// console.log(error);
		}
	}

	@action
	clearStore() {
		this.hasErrored = false;
		this.isLoading = true;
		this.itemsPasien = {};
		this.itemsRekamMedikDiagPasien = [];
		this.currentPasienTerpilihUid = "";
		this.currentPasienTerpilihUsername = "";
		this.stoHargaDiag = "";
		this.currentPasienNomorRekamMedik = "";
		this.currentDokterNomorRekamMedik = "";
	}

}

export default PasienStore;
