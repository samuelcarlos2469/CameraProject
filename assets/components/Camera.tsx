import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView } from "expo-camera";
import { TouchableOpacity, View, GestureResponderEvent } from "react-native";
import { cameraStyles } from "../style/styles";
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
      handleTakePhoto();
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
        style={cameraStyles.cameraView}
        facing={facing}
        ref={cameraRef}
      >
        <View style={cameraStyles.buttonContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={cameraStyles.cameraButton}
            onPress={toggleCameraFacing}
            accessibilityLabel="Alternar câmera"
            accessibilityHint="Alterna entre a câmera frontal e traseira"
          >
            <Ionicons name="camera-reverse-outline" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={cameraStyles.cameraButton} // Aplica o mesmo estilo para uniformizar
            onPress={() => navigation.navigate("ListScreen")}
          >
            <Ionicons name="logo-github" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </TouchableOpacity>
  );
}
