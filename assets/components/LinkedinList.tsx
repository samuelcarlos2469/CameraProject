import { View, Text, TouchableOpacity, Linking } from "react-native";
import { styles } from "../style/style";

const linkedInProfiles = [
  { name: "Meu LinkedIn", url: "https://www.linkedin.com/in/seu-perfil" },
  {
    name: "LinkedIn do Amigo",
    url: "https://www.linkedin.com/in/perfil-do-amigo",
  },
];

export default function LinkedInList() {
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
