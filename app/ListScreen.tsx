import { View } from "react-native";
import LinkedInList from "../assets/components/LinkedinList";
import { styles } from "../assets/style/style";

export default function ListScreen() {
  return (
    <View style={styles.container}>
      <LinkedInList />
    </View>
  );
}
