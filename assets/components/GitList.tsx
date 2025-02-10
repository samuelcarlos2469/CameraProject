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
    <View style={styles.containerLista}>
      {linkedInProfiles.map((profile, index) => (
        <TouchableOpacity
          key={index}
          style={styles.profileButton}
          onPress={() => Linking.openURL(profile.url)}
        >
          <Text style={styles.profileText}>{profile.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
