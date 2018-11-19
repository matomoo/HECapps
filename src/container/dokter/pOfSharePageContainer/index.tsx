import * as React from "react";
import { observer, inject } from "mobx-react/native";
import POfSharePage from "../../../stories/screens/dokter/pOfSharePage";
import { Card,
	Text,
	CardItem,
	// Content,
	View,
	// Item,
	// Label,
	// Input,
	// Button,
} from "native-base";
// import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";
// import ManagementViewStore from "../../../store/ViewStore/ManagementViewStore";

export interface Props {
	navigation: any;
	managementViewStore: any;
	mainStore;
}
export interface State {
	taskShare;
}

@inject("managementViewStore", "mainStore")
@observer
export default class POfSharePageContainer extends React.Component<Props, State> {
	jasaMedikInput;
	saranaInput;
	belanjaModalInput;
	sahamInput;
	taskManagement;

	constructor(props) {
		super(props);
		const { currentUid } = this.props.mainStore;
		this.taskManagement = db1.db.ref(`management/percentageOfShareDetail/${currentUid}`);
		this.state = {
			taskShare: [],
			};
	}

	componentDidMount() {
		this.getFirstData(this.taskManagement);
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				const r1 = result.val();
				// console.log(r1);
				const r2 = [];
				r2.push(r1);
				// console.log(this.state.taskShare);
				this.setState({
					taskShare: r2,
				});
			}).catch((err) => {
				console.log(err);
		});
	}

	render() {
		// console.log(this.state);

		// const items = this.props.managementViewStore;

		const { taskShare } = this.state;
		// console.log( taskShare);

		const forms = (
			<View>
				{ taskShare.map ( el =>
					el !== null &&
					<Card key="1">
						<CardItem header>
							<Text>View Percentage of Share</Text>
						</CardItem>
						<CardItem>
							<Text>Jasa Medik: Rp. { el.shareJasaMedik }</Text>
						</CardItem>
						<CardItem>
							<Text>Sarana: Rp. { el.shareSarana }</Text>
						</CardItem>
						<CardItem>
							<Text>Belanja Modal: Rp. { el.shareBelanjaModal }</Text>
						</CardItem>
						<CardItem>
							<Text>Saham: Rp. { el.shareSaham }</Text>
						</CardItem>
					</Card>,
				) }
			</View>
		);

		return <POfSharePage navigation={this.props.navigation}
					forms = {forms}
				/>;
	}
}
