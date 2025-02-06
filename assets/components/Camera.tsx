import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView } from "expo-camera";
import { TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { styles } from "../style/style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

type RootStackParamList = {
  CameraScreen: undefined;
  ListScreen: undefined;
};

export default function CameraComponent({
  facing,
  cameraRef,
  toggleCameraFacing,
  handleTakePhoto,
}: {
  facing: CameraType;
  cameraRef: React.RefObject<CameraView>;
  toggleCameraFacing: () => void;
  handleTakePhoto: () => void;
}) {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <TouchableWithoutFeedback
      onPress={handleTakePhoto}
      accessibilityLabel="Toque para capturar uma foto"
    >
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraFacing}
            accessibilityLabel="Alternar câmera"
            accessibilityHint="Alterna entre a câmera frontal e traseira"
          >
            <Ionicons name="camera-reverse-outline" size={44} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ListScreen")}>
            <Ionicons name="logo-linkedin" size={32} color="#0077B5" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </TouchableWithoutFeedback>
  );
}
