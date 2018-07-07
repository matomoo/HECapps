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
