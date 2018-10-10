import MainStore from "../store/DomainStore/HomeStore";
import LoginStore from "../store/ViewStore/LoginViewStore";
import DaftarUserStore from "../store/ViewStore/DaftarUserViewStore";
import PasienStore from "../store/DomainStore/PasienStore";
import InputDiagnosaStore from "../store/ViewStore/InputDiagnosaViewStore";
import InputBarangApotekStore from "../store/ViewStore/InputBarangApotekViewStore";
import InputConsDiagStore from "../store/ViewStore/InputConsDiagViewStore";
import ManagementViewStore from "../store/ViewStore/ManagementViewStore";

export default function() {
	const mainStore = new MainStore();
	const loginForm = new LoginStore();
	const daftarUserForm = new DaftarUserStore();
	const pasienStore = new PasienStore();
	const inputDiagnosaStore = new InputDiagnosaStore();
	const inputBarangApotekStore = new InputBarangApotekStore();
	const inputConsDiagStore = new InputConsDiagStore();
	const managementViewStore = new ManagementViewStore();

	return {
		loginForm,
		mainStore,
		daftarUserForm,
		pasienStore,
		inputDiagnosaStore,
		inputBarangApotekStore,
		inputConsDiagStore,
		managementViewStore,
	};
}
