import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView } from "expo-camera";
import { TouchableOpacity, View, GestureResponderEvent } from "react-native";
import { styles } from "../style/style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRef } from "react";

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
  const lastTap = useRef(0);

  const handleDoubleTap = (event: GestureResponderEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleTakePhoto(); // Se for um toque duplo, tira a foto
    }
    lastTap.current = now;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{ flex: 1 }}
      onPress={handleDoubleTap}
    >
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        pointerEvents="auto"
      >
        <View style={styles.buttonContainer} pointerEvents="box-none">
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
    </TouchableOpacity>
  );
}
