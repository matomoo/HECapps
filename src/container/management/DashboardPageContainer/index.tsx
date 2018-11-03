import * as React from "react";
import { observer, inject } from "mobx-react/native";
import DashboardPage from "../../../stories/screens/management/DashboardPage";
import { Form,
	Card,
	Text,
	CardItem,
	Content,
	View,
	Item,
	Label,
	Input,
	Button,
} from "native-base";
import { db } from "../../../firebase";
import * as db1 from "../../../firebase/firebase";
// import ManagementViewStore from "../../../store/ViewStore/ManagementViewStore";

export interface Props {
	navigation: any;
	managementViewStore: any;
}
export interface State {}

@inject("managementViewStore")
@observer
export default class DashboardPageContainer extends React.Component<Props, State> {
	jasaMedikInput;
	saranaInput;
	belanjaModalInput;
	sahamInput;
	taskManagement;

	constructor(props) {
		super(props);
		this.taskManagement = db1.db.ref(`management/percentageOfShare`);
		// this.state = {
		// 	// jasaMedikInput: this.taskManagement.jasaMedik,
		// 		};
	}

	componentDidMount() {
		// console.log(this.taskManagement);
		this.getFirstData(this.taskManagement);
		// console.log(ManagementViewStore);
	}

	getFirstData( p ) {
		p.once("value")
			.then((result) => {
				// console.log(result.val().jasaMedik);
				const r1 = result.val();
				this.props.managementViewStore.jasaMedik = r1.jasaMedik;
				this.props.managementViewStore.sarana = r1.sarana;
				this.props.managementViewStore.belanjaModal = r1.belanjaModal;
				this.props.managementViewStore.saham = r1.saham;
				// Object.keys(r1).map(r2 => {
				// 	console.log(r1[r2]);
				// });
			}).catch((err) => {
				console.log(err);
		});
	}

	_handleInputForm() {
		const { jasaMedik, sarana, belanjaModal, saham } = this.props.managementViewStore;
		db.doUpdatePercentageOfShare( jasaMedik, sarana, belanjaModal, saham );
		this.props.managementViewStore.clearStore();
		this.props.navigation.navigate("Home");
	}

	render() {
		const items = this.props.managementViewStore;

		const forms = (
			<View>
				<Card>
					<CardItem header>
						<Text>Pengaturan Percentage of Share</Text>
					</CardItem>
					<CardItem>
						<Content>
							<Form>
								<Item stackedLabel error={items.jasaMedik ? true : false}>
									<Label>Percentage of Jasa Medik</Label>
									<Input
										ref={c => (this.jasaMedikInput = c)}
										value={items.jasaMedik}
										style={{ marginLeft: 10 }}
										// onBlur={() => items.validateUsername()}
										keyboardType="numeric"
										onChangeText={e => items.jasaMedikOnChange(e)}
									/>
								</Item>
								<Item stackedLabel error={items.sarana ? true : false}>
									<Label>Percentage of Sarana</Label>
									<Input
										ref={c => (this.saranaInput = c)}
										value={items.sarana}
										style={{ marginLeft: 10 }}
										// onBlur={() => items.validateUsername()}
										keyboardType="numeric"
										onChangeText={e => items.saranaOnChange(e)}
									/>
								</Item>
								<Item stackedLabel error={items.belanjaModal ? true : false}>
									<Label>Percentage of Belanja Modal</Label>
									<Input
										ref={c => (this.belanjaModalInput = c)}
										value={items.belanjaModal}
										style={{ marginLeft: 10 }}
										// onBlur={() => items.validateUsername()}
										keyboardType="numeric"
										onChangeText={e => items.belanjaModalOnChange(e)}
									/>
								</Item>
								<Item stackedLabel error={items.saham ? true : false}>
									<Label>Percentage of Saham</Label>
									<Input
										ref={c => (this.sahamInput = c)}
										value={items.saham}
										style={{ marginLeft: 10 }}
										// onBlur={() => items.validateUsername()}
										keyboardType="numeric"
										onChangeText={e => items.sahamOnChange(e)}
									/>
								</Item>
								<Button block onPress={() => this._handleInputForm()}>
									<Text>Simpan</Text>
								</Button>
							</Form>
						</Content>
					</CardItem>
				</Card>
			</View>
		);

		return <DashboardPage navigation={this.props.navigation}
								forms = {forms}
				/>;
	}
}
