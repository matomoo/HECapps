import * as React from "react";
import DaftarAntrianPoliPage from "../../stories/screens/DaftarAntrianPoliPage";
import {
	Content,
	Text,
} from "native-base";
import { DatePickerIOS } from "react-native";

export interface Props {
	navigation: any;
}
export interface State {
	chosenDate: any;
}

export default class DaftarAntrianPoliPageContainer extends React.Component<Props, State> {

	constructor(props) {
		super(props);
		this.state = {
			chosenDate: new Date(),
		};
		this.setDate = this.setDate.bind(this);
	}

	setDate(newDate) {
		this.setState({ chosenDate: newDate });
	}

	render() {
		const Forms = (
			<Content>
				<DatePickerIOS
					date={this.state.chosenDate}
					onDateChange={this.setDate}
				/>
				<Text>
					Date: {this.state.chosenDate.toString().substr(4, 12)}
				</Text>
		</Content>
		);

		return <DaftarAntrianPoliPage
					navigation={this.props.navigation}
					forms = {Forms}
				/>;
	}
}
