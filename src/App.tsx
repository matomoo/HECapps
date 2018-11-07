import React from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import { Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

import Login from "./container/LoginContainer";
import Home from "./container/HomeContainer";
import BlankPage from "./container/BlankPageContainer";
import Sidebar from "./container/SidebarContainer";
import DaftarUser from "./container/DaftarUserContainer";
import PoliklinikPage from "./container/resepsionis/PoliklinikPageContainer";
import DaftarAntrianPoliPage from "./container/pasien/DaftarAntrianPoliPageContainer";
import DaftarTungguPage from "./container/resepsionis/DaftarTungguPageContainer";
import InputBarangApotekPage from "./container/apotek/InputBarangApotekPageContainer";
import RekamMedikPasienPage from "./container/RekamMedikPasienPageContainer";
import InputDiagnosaPage from "./container/dokter/InputDiagnosaPageContainer";
import InputConsDiagPage from "./container/admin/InputConsDiagPageContainer";
import InputDiagObatPage from "./container/dokter/InputDiagObatPageContainer";
import InputPengaturanPasienPage from "./container/pasien/PengaturanPageContainer";
import ManagementPage from "./container/management/DashboardPageContainer";
import InputTransaksiNomorFakturPage from "./container/admin/InputTransaksiNomorFakturPageContainer";
import POfSharePage from "./container/dokter/pOfSharePageContainer";
import AntriApotekPage from "./container/apotek/AntriApotekPageContainer";
import AntriBillingPage from "./container/billing/AntriBillingPageContainer";
import DaftarObatApotekPage from "./container/apotek/DaftarObatApotekPageContainer";
import DaftarUserPage from "./container/admin/DaftarUserPageContainer";
import UpdateUserPage from "./container/admin/UpdateUserPageContainer";
import DaftarDiagPage from "./container/admin/DaftarDiagPageContainer";
import ProfileDokterPage from "./container/dokter/ProfileDokterPageContainer";
import UpdateProfileDokterPage from "./container/dokter/UpdateProfileDokterPageContainer";
import ProfilePasienPage from "./container/pasien/ProfilePasienPageContainer";
import UpdateProfilePasienPage from "./container/pasien/UpdateProfilePasienPageContainer";

const Drawer = DrawerNavigator(
	{
		Home: { screen: Home },
	},
	{
		drawerWidth: deviceWidth - 50,
		drawerPosition: "left",
		contentComponent: props => <Sidebar {...props} />,
	},
);

const App = StackNavigator(
	{
		Login: { screen: Login },
		BlankPage: { screen: BlankPage },
		Drawer: { screen: Drawer },
		DaftarUser: {screen: DaftarUser },
		PoliklinikPage: { screen: PoliklinikPage },
		DaftarAntrianPoliPage: { screen: DaftarAntrianPoliPage },
		DaftarTungguPage: { screen: DaftarTungguPage},
		InputBarangApotekPage: { screen: InputBarangApotekPage },
		RekamMedikPasienPage: { screen: RekamMedikPasienPage },
		InputDiagnosaPage: { screen: InputDiagnosaPage },
		InputConsDiagPage: { screen: InputConsDiagPage },
		InputDiagObatPage: { screen: InputDiagObatPage },
		InputPengaturanPasienPage: { screen: InputPengaturanPasienPage },
		ManagementPage: { screen: ManagementPage },
		InputTransaksiNomorFakturPage : { screen: InputTransaksiNomorFakturPage },
		POfSharePage: { screen: POfSharePage },
		AntriApotekPage: { screen: AntriApotekPage },
		AntriBillingPage: { screen: AntriBillingPage },
		DaftarObatApotekPage: { screen: DaftarObatApotekPage },
		DaftarUserPage: { screen: DaftarUserPage },
		UpdateUserPage: { screen: UpdateUserPage },
		DaftarDiagPage: { screen: DaftarDiagPage },
		ProfileDokterPage: { screen: ProfileDokterPage },
		UpdateProfileDokterPage: { screen: UpdateProfileDokterPage },
		ProfilePasienPage: { screen: ProfilePasienPage },
		UpdateProfilePasienPage: { screen: UpdateProfilePasienPage },
	},
	{
		initialRouteName: "Login",
		headerMode: "none",
	},
);

export default () => (
	<Root>
		<App />
	</Root>
);
