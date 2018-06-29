import MainStore from "../store/DomainStore/HomeStore";
import LoginStore from "../store/ViewStore/LoginViewStore";
import DaftarUserStore from "../store/ViewStore/DaftarUserViewStore";
import PasienStore from "../store/DomainStore/PasienStore";
import InputDiagnosaStore from "../store/ViewStore/InputDiagnosaViewStore";

export default function() {
	const mainStore = new MainStore();
	const loginForm = new LoginStore();
	const daftarUserForm = new DaftarUserStore();
	const pasienStore = new PasienStore();
	const inputDiagnosaStore = new InputDiagnosaStore();

	return {
		loginForm,
		mainStore,
		daftarUserForm,
		pasienStore,
		inputDiagnosaStore,
	};
}
