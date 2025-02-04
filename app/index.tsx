import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
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
  TouchableWithoutFeedback,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import * as Speech from "expo-speech";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para controlar a fala
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | null>(
    null
  ); // Uri da imagem capturada para fundo
  const [loadingProgress, setLoadingProgress] = useState(new Animated.Value(0)); // Para a barra de progresso
  const cameraRef = useRef<CameraView | null>(null);

  const toggleCameraFacing = () => {
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
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: false,
        exif: false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      if (photo?.uri) {
        // Verifica se a foto é válida
        setBackgroundImageUri(photo.uri); // Define a imagem capturada como plano de fundo
        await sendPhotoToBackend(photo);
      } else {
        console.error("Erro ao capturar a foto.");
        AccessibilityInfo.announceForAccessibility("Erro ao capturar a foto");
      }
    }
  };

  const sendPhotoToBackend = async (photo: any) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as unknown as Blob);

      // Inicia animação da barra de progresso
      Animated.timing(loadingProgress, {
        toValue: 1,
        duration: 1000, // Duração da animação
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

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
    setIsSpeaking(true); // Marca que está falando
  };

  const stopSpeaking = () => {
    Speech.stop(); // Para a fala
    setIsSpeaking(false); // Marca que não está mais falando
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking(processedText || "Nenhum texto encontrado.");
    }
  };

  const resetState = () => {
    stopSpeaking();
    setProcessedText(null);
    setErrorMessage(null);
    setBackgroundImageUri(null); // Reseta a imagem de fundo
    loadingProgress.setValue(0); // Reseta o progresso de carregamento
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
      {!processedText && !errorMessage && (
        <TouchableWithoutFeedback onPress={handleTakePhoto}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
                accessibilityLabel="Alternar câmera"
                accessibilityHint="Alterna entre a câmera frontal e traseira"
              >
                <AntDesign name="retweet" size={44} color="black" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </TouchableWithoutFeedback>
      )}

      {/* Exibe a imagem capturada como fundo com esmaecimento */}
      {backgroundImageUri && (
        <View style={styles.backgroundImageContainer}>
          <Animated.Image
            source={{ uri: backgroundImageUri }}
            style={[styles.backgroundImage, { opacity: loadingProgress }]}
          />
        </View>
      )}

      {/* Barra de progresso enquanto carrega */}
      {isUploading && (
        <View style={styles.loadingBarContainer}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                width: loadingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
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
              <AntDesign name="close" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleSpeaking}
              accessibilityLabel={isSpeaking ? "Pausar fala" : "Ouvir texto"}
              accessibilityHint={
                isSpeaking ? "Pausa a fala atual" : "Inicia a leitura do texto"
              }
            >
              <AntDesign
                name={isSpeaking ? "pausecircle" : "sound"}
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
  loadingBarContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  loadingBar: {
    height: 4,
    backgroundColor: "#FF9500",
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
