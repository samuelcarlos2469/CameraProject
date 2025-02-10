import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../style/style";

const linkedInProfiles = [
  {
    name: "Rai Fernandes",
    url: "https://github.com/RaiFernandesdosSantos",
  },
  {
    name: "Samuel Carlos",
    url: "https://github.com/samuelcarlos2469",
  },
];

export default function GitList() {
  return (
    <View style={styles.container}>
      {linkedInProfiles.map((profile, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => Linking.openURL(profile.url)}
        >
          <Text>{profile.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
