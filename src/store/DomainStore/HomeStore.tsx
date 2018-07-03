import { observable,
			// action
		} from "mobx";
// import { db } from "../../firebase";

class HomeStore {
	// @observable hasErrored = false;
	// @observable isLoading = true;
	// @observable items = [];
	@observable currentUid = "";
	@observable currentUsername = "";
	@observable currentUserRole = "";
	// @observable nomorAntrianPoli = "";

	// @action
	// fetchItems(data) {
	// 	this.items = data;
	// 	this.isLoading = false;
	// }

	// @action
	// updateNomorAntrianPoli() {
	// 	db.getNumberLastAntrian()
	// 		.then(res => {
	// 			this.nomorAntrianPoli = res.val() + 1;
	// 		});
	// }

}

export default HomeStore;
