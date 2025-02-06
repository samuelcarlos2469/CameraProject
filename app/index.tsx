import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./CameraScreen";
import ListScreen from "./ListScreen";

type RootStackParamList = {
  CameraScreen: undefined;
  ListScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ title: "Câmera" }}
      />
      <Stack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{ title: "LinkedIn" }}
      />
    </Stack.Navigator>
  );
}
