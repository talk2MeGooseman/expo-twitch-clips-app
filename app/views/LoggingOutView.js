import React, { PureComponent } from "react";
import { Text, AsyncStorage } from "react-native";
import { NavigationActions  } from "react-navigation";

class LoggingOutView extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params;
        return {
            title: 'Log Out',
        };
    };

    componentDidMount() {
        AsyncStorage.clear(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                key: null, // Needed to go back to screen in separate stack
                actions: [
                  NavigationActions.navigate({ routeName: 'SplashScreen'})
                ]
            })
            this.props.navigation.dispatch(resetAction);
        });
    }

    render() {
        return(<Text>Logging Out</Text>);
    }
}

export default LoggingOutView;