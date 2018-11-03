import * as React from "react";
import { observer, inject } from "mobx-react/native";
import PengaturanPage from "../../../stories/screens/pasien/PengaturanPage";
import { Form,
	Picker,
	Card,
	Text,
	CardItem,
	Content,
	View,
} from "native-base";
import { Platform } from "react-native";
import { db } from "../../../firebase";

export interface Props {
	navigation: any;
	mainStore;
}
export interface State {
	selected1: any;
	services: any;
}

@inject("mainStore")
@observer
export default class PengaturanPageContainer extends React.Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			selected1: "select",
			services: ["Umum", "BPJS"],
		};
	}

	onValueChangePoli1(value: string) {
		const uid = this.props.navigation.state.params.name.key;
		this.setState({
			selected1: value,
		});
		db.doUpdateStatusPasien( uid, value );
		this.props.navigation.navigate("Home");
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

	async componentDidMount() {
		await db.getPasienInfoFromFb(this.props.navigation.state.params.name.key).then(c1 => {
			// console.log(c1);
			this.setState({
				selected1: c1.val().statusPasien,
			});
		});
	}

	render() {
		const forms = (
			<View>
				<Card>
					<CardItem header>
						<Text>Pengaturan Pasien</Text>
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
			</View>
		);

		return <PengaturanPage
					navigation={this.props.navigation}
					forms= {forms}
				/>;
	}
}
