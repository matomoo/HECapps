import * as React from "react";
import { observer, inject } from "mobx-react/native";
import {
	// Container, Header, Title,
	View, Text,
	// Button, Icon, Left, Right, Body,
} from "native-base";

// import styles from "./styles";

export interface Props {
	// navigation: any;
}
export interface State {}

@inject("mainStore", "pasienStore")
@observer

export default class BlankPageContainer extends React.Component<Props, State> {
	render() {
		// const param = this.props.navigation.state.params;
		return (
				<View padder>
					<Text>Awesome</Text>
				</View>
		);
	}
}
