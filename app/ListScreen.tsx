import { View } from "react-native";
import GitList from "../assets/components/GitList";
import { styles } from "../assets/style/style";

export default function ListScreen() {
  return (
    <View style={styles.container}>
      <GitList />
    </View>
  );
}
