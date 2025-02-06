import { useState, useRef } from "react";
import {
  View,
  StatusBar,
  Animated,
  ActivityIndicator,
  Text,
  Button,
} from "react-native";
import { useCameraSetup } from "../assets/hooks/useCameraSetup";
import CameraComponent from "../assets/components/Camera";
import { TextProcessor } from "../assets/components/TextProcessor";
import { styles } from "../assets/style/style";
import * as Speech from "expo-speech";
import { CameraCapturedPicture } from "expo-camera";

export default function CameraScreen() {
  const {
    permission,
    requestPermission,
    facing,
    toggleCameraFacing,
    panResponder,
    cameraRef,
  } = useCameraSetup();
  const [isUploading, setIsUploading] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | null>(
    null
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (photo?.uri) {
        setBackgroundImageUri(photo.uri);
        await processImage(photo);
      }
    }
  };

  const processImage = async (photo: CameraCapturedPicture) => {
    setIsUploading(true);
    try {
      // Implementar lógica de upload aqui
      const mockText = "Texto processado com sucesso";
      setProcessedText(mockText);
      startSpeaking(mockText);
    } catch (error) {
      setErrorMessage("Erro no processamento");
    } finally {
      setIsUploading(false);
    }
  };

  const startSpeaking = (text: string) => {
    Speech.speak(text, { onDone: () => setIsSpeaking(false) });
    setIsSpeaking(true);
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else if (processedText) {
      startSpeaking(processedText);
    }
  };

  const resetState = () => {
    Speech.stop();
    setProcessedText(null);
    setErrorMessage(null);
    setBackgroundImageUri(null);
    imageOpacity.setValue(0);
    imageScale.setValue(0.9);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Precisamos de sua permissão para acessar a câmera
        </Text>
        <Button
          title="Conceder permissão"
          onPress={requestPermission}
          accessibilityLabel="Botão para conceder permissão à câmera"
        />
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Tela principal"
      {...panResponder.panHandlers}
    >
      <StatusBar barStyle="light-content" translucent />

      {!processedText && !errorMessage && (
        <CameraComponent
          facing={facing}
          cameraRef={cameraRef}
          toggleCameraFacing={toggleCameraFacing}
          handleTakePhoto={handleTakePhoto}
        />
      )}

      {backgroundImageUri && (
        <Animated.Image
          source={{ uri: backgroundImageUri }}
          style={[
            styles.backgroundImage,
            { opacity: imageOpacity, transform: [{ scale: imageScale }] },
          ]}
        />
      )}

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9500" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      {(processedText || errorMessage) && (
        <TextProcessor
          processedText={processedText}
          errorMessage={errorMessage}
          isSpeaking={isSpeaking}
          toggleSpeaking={toggleSpeaking}
          resetState={resetState}
        />
      )}
    </View>
  );
}
