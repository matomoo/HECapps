import * as React from "react";
import PoliklinikPage from "../../stories/screens/PoliklinikPage";
import { Form,
			Picker,
			Card,
			Text,
			CardItem,
			Content,
			View,
		} from "native-base";
import { Platform } from "react-native";
import { db } from "../../firebase";

export interface Props {
	navigation: any;
}

export interface State {
	selected1: any;
	selected2: any;
	services: any;
}

export default class PoliklinikPageContainer extends React.Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			selected1: "select",
			selected2: "select",
			services: ["Dokter A", "Dokter B", "Dokter C", "Dokter D", "Dokter E"],
		};
	}

	onValueChangePoli1(value: string) {
		this.setState({
			selected1: value,
		});
		db.doUpdateDokterPoli1(value);
	}

	onValueChangePoli2(value: string) {
		this.setState({
			selected2: value,
		});
		db.doUpdateDokterPoli2(value);
	}

	make_list(list, item0) {
		const d = list.map((data, i) => {
			return (
				<Picker.Item label={data} value={data} key={i}/>
			);
		});
		// i did this because no need in ios :P
		if ( Platform.OS === "android") {
			d.unshift(<Picker.Item label={item0} value="Idle" key="99999"/>);
		}
		return d;
		// and that's how you are ready to go, because this issue isn't fixed yet (checked on 28-Dec-2017)
	}

	async componentWillMount() {
		await db.getPoli().then(c1 => {
			// console.log(c1);
			this.setState({
				selected1: c1.val().poli1.dokter,
				selected2: c1.val().poli2.dokter,
			});
		});
	}

	render() {
		const forms = (
			<View>
				<Card>
					<CardItem header>
						<Text>Poliklinik 1</Text>
					</CardItem>
					<CardItem>
						<Content>
							<Form>
								<Picker
								iosHeader="Select one"
								mode="dropdown"
								selectedValue={this.state.selected1}
								onValueChange={this.onValueChangePoli1.bind(this)}
								>
								{ this.make_list(this.state.services, "Idle") }
								</Picker>
							</Form>
						</Content>
					</CardItem>
				</Card>
				<Card>
					<CardItem header>
						<Text>Poliklinik 2</Text>
					</CardItem>
					<CardItem>
						<Content>
						{/* <Body> */}
							<Form>
								<Picker
								iosHeader="Select one"
								mode="dropdown"
								selectedValue={this.state.selected2}
								onValueChange={this.onValueChangePoli2.bind(this)}
								>
								{ this.make_list(this.state.services, "Idle") }
								</Picker>
							</Form>
						{/* </Body> */}
						</Content>
					</CardItem>
				</Card>
			</View>
		);

		return <PoliklinikPage
					navigation={this.props.navigation}
					forms= {forms}
				/>;
	}
}
