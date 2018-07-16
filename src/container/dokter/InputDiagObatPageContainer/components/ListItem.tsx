import React, {
		Component,
	} from "react";
	import {CardItem, Icon, Text,
			Left,
			Right,
			Button,
	} from "native-base";
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
						{/* <Icon name="md-create" /> */}
						<Left>
							<Text>{this.props.task.namaObat} - {this.props.task.jumlahObat}</Text>
						</Left>
						<Right>
							{/* <Icon name="md-checkmark" onPress={() => this.props.onTaskCompletion()}/> */}
							<Button transparent
								style={{ height: 10 }}
								onPress={() => this.props.onTaskCompletion()}>
								<Icon name="md-checkmark" />
							</Button>
						</Right>
				</CardItem>
			);
		}
	}
