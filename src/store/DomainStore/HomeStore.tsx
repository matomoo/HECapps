import { observable, action } from "mobx";

class HomeStore {
	@observable hasErrored = false;
	@observable isLoading = true;
	@observable items = [];
	@observable currentUid = "";
	@observable currentUsername = "";
	@observable currentUserRole = "";

	@action
	fetchItems(data) {
		this.items = data;
		this.isLoading = false;
	}

}

export default HomeStore;
