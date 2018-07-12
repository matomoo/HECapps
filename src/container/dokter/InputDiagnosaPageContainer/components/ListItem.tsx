import React, {
		Component,
	} from "react";
	import {CardItem, Icon, Text} from "native-base";
	// import styles from "../styles/mainStyles";

	export interface Props {
		task: any;
		onTaskCompletion: Function;
	}
	// export interface State {}
	export default class ListItem extends Component<Props> {
		render() {
			return (
				<CardItem>
						<Icon name="md-create" />
						<Text>{this.props.task.name}</Text>
						<Icon name="md-checkmark" onPress={() => this.props.onTaskCompletion()}/>
				</CardItem>
			);
		}
	}
