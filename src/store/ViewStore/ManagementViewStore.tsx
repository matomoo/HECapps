import { observable, action } from "mobx";
// import { db } from "../../firebase";

class ManagementViewStore {
	// @observable id = "";
	@observable jasaMedik = "";
	@observable sarana = "";
	@observable belanjaModal = "";
	@observable saham = "";

	@action
	jasaMedikOnChange(x) {
		this.jasaMedik = x;
	}

	@action
	saranaOnChange(x) {
		this.sarana = x;
	}

	@action
	belanjaModalOnChange(x) {
		this.belanjaModal = x;
	}

	@action
	sahamOnChange(x) {
		this.saham = x;
	}

	@action
	clearStore() {
		this.jasaMedik = "";
		this.sarana = "";
		this.belanjaModal = "";
		this.saham = "";
	}
}

export default ManagementViewStore;
