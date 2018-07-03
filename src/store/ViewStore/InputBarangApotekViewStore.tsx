import { observable, action } from "mobx";
// import { db } from "../../firebase";

class InputBarangApotekStore {
	@observable idABM = "";
	@observable idAS = "";
	@observable namaABM = "";
	@observable namaABMError = "";
	@observable jumlahABM = "0";
	@observable jumlahABMError = "";
	@observable satuanABM = "";
	@observable listSatuanABM = ["buah", "biji"];
	@observable hargaBeliABM = "0";
	@observable hargaBeliABMError = "";
	@observable jenisABM = "";
	@observable listJenisABM = ["BHP", "Non BHP"];

	@action
	namaABMonChange(x) {
		this.namaABM = x;
	}

	@action
	jumlahABMonChange(x) {
		this.jumlahABM = x;
		// this.validateString();
	}

	@action
	hargaBeliABMonChange(x) {
		this.hargaBeliABM = x;
		// this.validateString();
	}

	// @action
	// getIdAS() {
	// 	db.getIdAS(this.namaABM).then(c => {
	// 		this.idAS = c.val();
	// 	});
	// }

	@action
	clearStore() {
		this.namaABM = "";
		this.jumlahABM = "";
		// this.satuanABM = "buah";
		this.hargaBeliABM = "";
		// this.jenisABM = "";
	}
}

export default InputBarangApotekStore;
