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
import PoliklinikPage from "./container/PoliklinikPageContainer";
import DaftarAntrianPoliPage from "./container/DaftarAntrianPoliPageContainer";
import DaftarTungguPage from "./container/DaftarTungguPageContainer";
import InputBarangApotekPage from "./container/InputBarangApotekPageContainer";
import RekamMedikPasienPage from "./container/RekamMedikPasienPageContainer";
// import InputDiagnosaPage from "./container/InputDiagnosaPageContainer";
import InputDiagnosaPage from "./container/dokter/InputDiagnosaPageContainer";
import InputConsDiagPage from "./container/admin/InputConsDiagPageContainer";
import InputDiagObatPage from "./container/dokter/InputDiagObatPageContainer";

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
		// InputDiagnosaPage: { screen: InputDiagnosaPage },
		InputDiagnosaPage: { screen: InputDiagnosaPage },
		InputConsDiagPage: { screen: InputConsDiagPage },
		InputDiagObatPage: { screen: InputDiagObatPage },
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
