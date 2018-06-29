import { observable,
			// action
		} from "mobx";

class InputDiagnosaStore {
	@observable selectedDiagnosa = [];
	@observable listDiagnosa = "";
	@observable checkbox1 = false;
	@observable checkbox2 = false;
	@observable checkbox3 = false;
	@observable index = 0;

	addListItem ( item, harga ) {
		this.selectedDiagnosa.push({
			index: this.index,
			name: item,
			harga: harga,
		});
		this.index++;
	}

	resetForm () {
		this.selectedDiagnosa = [];
		this.listDiagnosa = "";
		this.checkbox1 = false;
		this.checkbox2 = false;
		this.checkbox3 = false;
		this.index = 0;
	}
}

export default InputDiagnosaStore;