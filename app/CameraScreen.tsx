import { useState, useRef } from "react";
import {
  View,
  StatusBar,
  Animated,
  ActivityIndicator,
  Text,
  Button,
  AccessibilityInfo,
  Easing,
} from "react-native";
import { useCameraSetup } from "../assets/hooks/useCameraSetup";
import CameraComponent from "../assets/components/Camera";
import { TextProcessor } from "../assets/components/TextProcessor";
import { styles } from "../assets/style/style";
import * as Speech from "expo-speech";
import { CameraCapturedPicture } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

const fixImageOrientation = async (photo: CameraCapturedPicture) => {
  try {
    // 📌 Garante que a rotação seja correta baseada no tamanho da imagem
    const { width, height } = photo;
    let rotate = 0;

    if (width > height) {
      // Se a largura for maior que a altura, significa que está na horizontal
      rotate = 90; // Rotaciona para ficar em retrato
    }

    const manipulatedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ rotate }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipulatedPhoto;
  } catch (error) {
    console.error("Erro ao corrigir a orientação da imagem:", error);
    return photo; // Retorna a imagem original caso falhe
  }
};

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
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;
  const [loadingProgress, setLoadingProgress] = useState(new Animated.Value(0));

  const handleTakePhoto = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    if (cameraRef.current) {
      try {
        const options = { quality: 1, base64: false, exif: true };
        const photo = await cameraRef.current.takePictureAsync(options);

        if (photo?.uri) {
          // 📌 Corrige a orientação antes de definir a imagem
          const fixedPhoto = await fixImageOrientation(photo);

          setBackgroundImageUri(fixedPhoto.uri);
          Speech.speak("Imagem capturada");

          // Reset animações
          imageOpacity.setValue(0);
          imageScale.setValue(0.9);

          // Inicia animação da imagem
          Animated.parallel([
            Animated.timing(imageOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(imageScale, {
              toValue: 1,
              duration: 1000,
              easing: Easing.quad,
              useNativeDriver: true,
            }),
          ]).start();

          if (!isUploading) {
            setIsUploading(true);
            await processImage(fixedPhoto);
            setIsUploading(false);
          }
        } else {
          Speech.speak("Erro ao capturar a imagem");
        }
      } catch (error) {
        console.error("Erro ao capturar a imagem:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const processImage = async (photo: CameraCapturedPicture) => {
    try {
      setIsUploading(true);
      Speech.speak("Processando...");
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as unknown as Blob);

      const response = await fetch(
        "https://backendcameraproject.onrender.com/catch",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erro desconhecido");
        setProcessedText(null);
        console.error(
          "Erro do backend:",
          errorData.error || "Erro desconhecido"
        );
        AccessibilityInfo.announceForAccessibility("Erro do backend");
        return;
      }

      const result = await response.json();
      setProcessedText(result.text || "Nenhum texto encontrado.");
      setErrorMessage(null);
      startSpeaking(result.text || "Nenhum texto encontrado."); // Inicia a fala
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      setErrorMessage("Erro ao enviar a imagem. Tente novamente.");
      setProcessedText(null);
      AccessibilityInfo.announceForAccessibility("Erro ao enviar a imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const startSpeaking = (text: string) => {
    Speech.speak(text, { onDone: () => setIsSpeaking(false) });
    setIsSpeaking(true);
    AccessibilityInfo.announceForAccessibility("Leitura iniciada");
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
    AccessibilityInfo.announceForAccessibility("Leitura pausada");
  };

  const toggleSpeaking = () => {
    if (!processedText) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking(processedText);
    }
  };

  const resetState = () => {
    stopSpeaking();
    setProcessedText(null);
    setErrorMessage(null);
    setBackgroundImageUri(null);
    imageOpacity.setValue(0);
    imageScale.setValue(0.9);
    loadingProgress.setValue(0);
    AccessibilityInfo.announceForAccessibility("Estado reiniciado");
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
      pointerEvents="auto"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

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
            {
              opacity: imageOpacity,
              transform: [
                { scale: imageScale },
                { rotate: `${imageRotation}deg` },
              ],
            },
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
