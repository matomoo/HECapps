import React from "react";
import { observer, inject } from "mobx-react/native";
// import DaftarUserPage from "../../../stories/screens/admin/DaftarUserPage";
// import { db } from "../../../firebase";
// import * as db1 from "../../../firebase/firebase";
import styles from "./styles";
import {
	// List, ListItem, Left, Right,
	Icon,
	Text, Button,
	// Card, CardItem,
	// View,
	Footer, FooterTab,
} from "native-base";

// import moment from "moment";

export interface Props {
	navigation?;
	mainStore?;
}
export interface State {
	// listUsers;
}

@inject ("mainStore")
@observer
export default class FooterNav extends React.Component<Props, State> {

	render() {
		return (
			<Footer>
					<FooterTab style={styles.footerTab}>
						<Button
							onPress={() => this.props.navigation.navigate("Home")}
						>
							{/* <View style={styles.footerIcon}> */}
								<Icon name="apps" style={styles.footerIcon}/>
								<Text style={styles.footerIcon}>Home</Text>
							{/* </View> */}
						</Button>
						<Button
							onPress={() => this.props.navigation.navigate("ProfilePasienPage")}
						>
							<Icon name="person" style={styles.footerIcon}/>
							<Text style={styles.footerIcon}>Profile</Text>
						</Button>
					</FooterTab>
				</Footer>
		);
	}
}
