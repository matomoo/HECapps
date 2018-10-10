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
