import * as React from "react";
// import InputDiagnosaPage from "../../../stories/screens/dokter/InputDiagnosaPage";
import { db } from "../../../firebase/firebase";
import { ActivityIndicator,
			TextInput,
} from "react-native";
import { Header, Container, Title, Content, Icon,  Card,
			// CardItem,
			Button,
			Toast,
			Footer } from "native-base";
import styles from "./styles/mainStyles";
import ListItem from "./components/ListItem";

export interface Props {
	navigation: any;
}
export interface State {
	loading;
	user;
	newTask;
	tasks;
	active;
}
export default class InputDiagnosaPageContainer extends React.Component<Props, State> {
	tasksRef: any;

	constructor(props) {
		super(props);
		this.tasksRef = db.ref(`rekamMedik`);
		this.state = {
			user: undefined,
			loading: false,
			newTask: "",
			tasks: [],
			active: true,
			};
		}

	componentDidMount() {
		// start listening for firebase updates
		this.listenForTasks(this.tasksRef);
		}

	// listener to get data from firebase and update listview accordingly
	listenForTasks(tasksRef) {
		tasksRef.on("value", (dataSnapshot) => {
			const tasks = [];
			dataSnapshot.forEach((child) => {
				tasks.push({
				name: child.val().name,
				_key: child.key,
				});
			});

			this.setState({
				tasks: tasks,
			});
		});
	}

	// add a new task to firebase app
	_addTask() {
		// console.log("task value",this.state.newTask);
		if (this.state.newTask === "") {
			return;
		}
		this.tasksRef.push({ name: this.state.newTask});
		this.setState({newTask: ""});
		Toast.show({
			text: "Task added succesfully",
			duration: 3000,
			position: "center",
			textStyle: { textAlign: "center" },
		});
	}

	_renderItem(task) {
		// console.log("task",task._key);
		const onTaskCompletion = () => {
			// console.log("clickrecived",this.tasksRef.child(task._key).remove());
			this.tasksRef.child(task._key).remove().then(
				function() {
				// fulfillment
				// alert("The task " + task.name + " has been completed successfully");
			},
			function() {
				// fulfillment
				// alert("The task " + task.name + " has not been removed successfully");
			});
			};

		return (
			<ListItem task={task} onTaskCompletion={onTaskCompletion} />
		);
	}

	logout() {
		this.props.navigation.navigate("Home");
	}

	render() {
		console.log("tasks value", this.state);
		// If we are loading then we display the indicator, if the account is null and we are not loading
		// Then we display nothing. If the account is not null then we display the account info.
		const content = this.state.loading ?
		<ActivityIndicator size="large"/> :
			// this.state.user &&
				<Content>
					<Card dataArray={this.state.tasks}
					renderRow={(task) => this._renderItem(task)} >
					</Card>
				</Content>
			;
		// console.log("loading user", this.state.user, this.state.loading);

		return (
			<Container>
				<Header>
					<Button transparent>
						<Icon name="ios-menu" />
					</Button>
					<Title>To Do</Title>
					<Button transparent onPress={() => this.logout()}>
							<Icon name="ios-arrow-back" />
					</Button>
				</Header>
				{content}
				<Footer
					style={styles.footer}
					>
					<TextInput
						value={this.state.newTask}
						style={styles.textEdit}
						onChangeText={(text) => this.setState({newTask: text})}
						placeholder="New Task"
					/>
					<Button
						active={this.state.active}
						transparent
						onPress={() => this._addTask()}>
						<Icon name="md-add"	/>
					</Button>
				</Footer>

			</Container>
		);
	}

	// render() {
	// 	return <InputDiagnosaPage
	// 				navigation={this.props.navigation}
	// 			/>;
	// }
}
