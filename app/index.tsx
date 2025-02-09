import { Ionicons } from "@expo/vector-icons";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  AccessibilityInfo,
  TouchableWithoutFeedback, // Adicione esta linha
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ActivityIndicator,
} from "react-native";
import * as Speech from "expo-speech";

export default function Camera() {
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para controlar a fala
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | null>(
    null
  ); // Uri da imagem capturada para fundo
  const [imageRotation, setImageRotation] = useState(0); // Rotação da imagem
  const [loadingProgress, setLoadingProgress] = useState(new Animated.Value(0)); // Para a barra de progresso
  const cameraRef = useRef<CameraView | null>(null);

  const toggleCameraFacing = () => {
    if (isUploading) return; // Evita alternar enquanto uma imagem está sendo enviada
    setFacing((current) => (current === "back" ? "front" : "back"));
    AccessibilityInfo.announceForAccessibility("Câmera alternada");
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureState.dx > 100) {
          toggleCameraFacing();
        } else if (gestureState.dx < -100) {
          toggleCameraFacing();
        }
      },
    })
  ).current;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Precisamos de sua permissão para acessar a câmera
        </Text>
        <Button
          onPress={requestPermission}
          title="Conceder permissão"
          accessibilityLabel="Botão para conceder permissão à câmera"
        />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (isCapturing) return; // Evita múltiplos cliques rápidos
    setIsCapturing(true);

    if (cameraRef.current) {
      try {
        const options = { quality: 1, base64: false, exif: true };
        const photo = await cameraRef.current.takePictureAsync(options);

        if (photo?.uri) {
          setBackgroundImageUri(photo.uri);
          Speech.speak("Imagem capturada");

          // Verifica a orientação da imagem nos dados EXIF
          const orientation = photo.exif?.Orientation;
          let rotation = 0;
          if (orientation === 3) {
            rotation = 180;
          } else if (orientation === 6) {
            rotation = 90;
          } else if (orientation === 8) {
            rotation = -90;
          }
          setImageRotation(rotation);

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
            await sendPhotoToBackend(photo);
            setIsUploading(false);
          }
        } else {
          Speech.speak("Erro ao capturar a imagem");
        }
      } catch (error) {
        console.error("Erro ao capturar a imagem:", error);
      } finally {
        setIsCapturing(false); // Libera para próxima captura
      }
    }
  };

  const sendPhotoToBackend = async (photo: CameraCapturedPicture) => {
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

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Tela principal"
      {...panResponder.panHandlers}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {!processedText && !errorMessage ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onTouchEnd={handleTakePhoto}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
              accessibilityLabel="Alternar câmera"
              accessibilityHint="Alterna entre a câmera frontal e traseira"
            >
              <Ionicons name="camera-reverse-outline" size={44} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : null}

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
        <View style={styles.processedTextContainer}>
          <View style={styles.topIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={resetState}
              accessibilityLabel="Fechar"
              accessibilityHint="Fecha a tela atual"
            >
              <Ionicons name="close-circle" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleSpeaking}
              accessibilityLabel={isSpeaking ? "Pausar fala" : "Ouvir texto"}
              accessibilityHint={
                isSpeaking ? "Pausa a fala atual" : "Inicia a leitura do texto"
              }
            >
              <Ionicons
                name={isSpeaking ? "volume-mute" : "volume-high"}
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.processedTextWrapper}>
            <Text style={styles.processedText}>
              {processedText || errorMessage}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  camera: {
    flex: 1,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#FF9500",
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  processedTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    marginTop: 50,
  },
  processedTextWrapper: {
    marginTop: 50,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  processedText: {
    fontSize: 18,
    color: "white",
    textAlign: "left",
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconButton: {
    padding: 10,
  },
});
