import { View, Text, TouchableOpacity, Linking } from "react-native";
import { listStyles } from "../style/styles";

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
    <View style={listStyles.container}>
      {linkedInProfiles.map((profile, index) => (
        <TouchableOpacity
          key={index}
          style={listStyles.profileButton}
          onPress={() => Linking.openURL(profile.url)}
        >
          <Text style={listStyles.profileText}>{profile.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
