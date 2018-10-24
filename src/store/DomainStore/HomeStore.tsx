import { observable,
			action,
		} from "mobx";
// import { db } from "../../firebase";

class HomeStore {
	@observable currentUid = "";
	@observable currentUsername = "";
	@observable currentUserRole = "";
	@observable transaksiNomorFakturKeluar = "ny";
	@observable transaksiKeluarFbKey;
	@observable transaksiTotalDiag;
	@observable transaksiTotalObat;
	@observable transaksiKeluarTimestamp;
	@observable transaksiKeluarTanggal;

	@action
	transaksiNomorFakturKeluarOnChange(x) {
		if (this.transaksiNomorFakturKeluar === "ny") {
			this.transaksiNomorFakturKeluar = x ;
		}
	}

	@action
	transaksiKeluarFbKeyOnUpdate(x) {
		this.transaksiKeluarFbKey = x;
	}

	@action
	transaksiTotalDiagOnUpdate(x) {
		this.transaksiTotalDiag = x;
	}

	@action
	transaksiTotalObatOnUpdate(x) {
		this.transaksiTotalObat = x;
	}

	@action
	transaksiKeluarTimestampOnUpdate(x) {
		this.transaksiKeluarTimestamp = x;
	}

	@action
	transaksiKeluarTanggalOnUpdate(x) {
		this.transaksiKeluarTanggal = x;
	}

	@action resetNomorFaktur() {
		this.transaksiNomorFakturKeluar = "ny";
	}

}

export default HomeStore;
