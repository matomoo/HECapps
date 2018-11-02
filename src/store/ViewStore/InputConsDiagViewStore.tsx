import { observable, action } from "mobx";
// import { db } from "../../firebase";

class InputConsDiagStore {
	// @observable id = "";
	@observable namaDiag = "";
	@observable hargaDiag = "";
	@observable daftarDiag = [];

	@action
	namaDiagOnChange(x) {
		this.namaDiag = x;
	}

	@action
	hargaDiagOnChange(x) {
		this.hargaDiag = x;
		// this.validateString();
	}

	@action
	daftarDiagOnUpdate(x) {
		this.daftarDiag = x;
	}

	@action
	clearStore() {
		this.namaDiag = "";
		this.hargaDiag = "";
	}
}

export default InputConsDiagStore;
