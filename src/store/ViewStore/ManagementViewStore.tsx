import { observable, action } from "mobx";
// import { db } from "../../firebase";

class ManagementViewStore {
	// @observable id = "";
	@observable jasaMedik = "";
	@observable sarana = "";
	@observable belanjaModal = "";
	@observable saham = "";
	@observable shareJasaMedik;
	@observable shareSarana;
	@observable shareBelanjaModal;
	@observable shareSaham;

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
	shareJasaMedikOnUpdate(x) {
		this.shareJasaMedik = x;
	}

	@action
	shareSaranaOnUpdate(x) {
		this.shareSarana = x;
	}

	@action
	shareBelanjaModalOnUpdate(x) {
		this.shareBelanjaModal = x;
	}

	@action
	shareSahamOnUpdate(x) {
		this.shareSaham = x;
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
