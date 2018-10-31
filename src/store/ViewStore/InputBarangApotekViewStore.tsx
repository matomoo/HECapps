import { observable, action } from "mobx";
// import { db } from "../../firebase";

class InputBarangApotekStore {
	@observable idABM = "";
	@observable idAS = "";
	@observable namaABM = "";
	@observable namaABMError = "";
	@observable jumlahABM = "";
	@observable jumlahABMError = "";
	@observable satuanABM = "";
	@observable listSatuanABM = ["buah", "biji"];
	@observable hargaBeliABM = "";
	@observable hargaBeliABMError = "";
	@observable hargaJualABM = "";
	@observable hargaJualABMError = "";
	@observable jenisABM = "";
	@observable listJenisABM = ["BHP", "Non BHP"];
	@observable satuanABMPilih: "pilih";
	@observable jenisABMPilih: "pilih";

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

	@action
	hargaJualABMonChange(x) {
		this.hargaJualABM = x;
		// this.validateString();
	}

	// @action
	// getIdAS() {
	// 	db.getIdAS(this.namaABM).then(c => {
	// 		this.idAS = c.val();
	// 	});
	// }

	@action
	modalApotekStok( a, b, c, d, e, f?, g?) {
		// console.log(a);
		this.idABM = a;
		this.namaABM = b;
		this.hargaBeliABM = c.toString();
		this.satuanABMPilih = d;
		this.jenisABMPilih = e;
		this.jumlahABM = f.toString();
		this.hargaJualABM = g.toString();
	}

	@action
	clearStore() {
		this.idABM = "";
		this.namaABM = "";
		this.hargaBeliABM = "";
		this.jumlahABM = "";
		this.satuanABMPilih = "pilih";
		this.jenisABMPilih = "pilih";
		this.hargaJualABM = "";
	}
}

export default InputBarangApotekStore;
