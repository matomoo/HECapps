import { observable, action } from "mobx";
// import { db } from "../../firebase";

class InputConsDiagStore {
	// @observable id = "";
	@observable namaDiag = "";
	@observable hargaDiag = "";

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
	clearStore() {
		this.namaDiag = "";
		this.hargaDiag = "";
	}
}

export default InputConsDiagStore;
