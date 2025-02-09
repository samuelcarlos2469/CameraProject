import { Ionicons } from "@expo/vector-icons";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  AccessibilityInfo,
  PanResponder,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import * as Speech from "expo-speech";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | null>(
    null
  );
  const cameraRef = useRef<CameraView | null>(null);

  // Animação para o overlay de processamento
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleCameraFacing = () => {
    if (isUploading) return;
    setFacing((current) => (current === "back" ? "front" : "back"));
    Speech.speak("Câmera alternada");
  };

  const handleTakePhoto = async () => {
    if (isUploading) return;

    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        exif: true,
      });

      if (photo?.uri) {
        setBackgroundImageUri(photo.uri);
        Speech.speak("Processando imagem");

        // Mostra overlay de processamento
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        await sendPhotoToBackend(photo);
      }
    } catch (error) {
      console.error("Erro:", error);
      Speech.speak("Erro ao processar imagem");
    }
  };

  const sendPhotoToBackend = async (photo: CameraCapturedPicture) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const response = await fetch(
        "https://backendcameraproject.onrender.com/catch",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      setProcessedText(result.text || "Nenhum texto identificado");
      Speech.speak(result.text || "Nenhum texto identificado");
    } catch (error) {
      setErrorMessage("Erro na conexão");
      Speech.speak("Erro ao conectar com o servidor");
    } finally {
      setIsUploading(false);
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const resetState = () => {
    setProcessedText(null);
    setErrorMessage(null);
    setBackgroundImageUri(null);
    Speech.stop();
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos de acesso à câmera para funcionar
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          accessibilityLabel="Conceder permissão"
        >
          <Text style={styles.permissionButtonText}>Permitir acesso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {/* Área principal da câmera */}
      {!processedText && (
        <TouchableWithoutFeedback
          onPress={handleTakePhoto}
          accessibilityLabel="Toque para capturar imagem"
        >
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableTorch={false}
          >
            {/* Botão de informações (placeholder) */}
            <TouchableOpacity
              style={styles.infoButton}
              accessibilityLabel="Informações do projeto"
              accessibilityHint="Mostra detalhes sobre os criadores do aplicativo"
            >
              <Ionicons name="information-circle" size={34} color="white" />
            </TouchableOpacity>

            {/* Botão para virar câmera */}
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
              accessibilityLabel="Alternar câmera"
            >
              <Ionicons name="camera-reverse" size={34} color="white" />
            </TouchableOpacity>
          </CameraView>
        </TouchableWithoutFeedback>
      )}

      {/* Overlay de processamento */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {backgroundImageUri && (
          <Animated.Image
            source={{ uri: backgroundImageUri }}
            style={[styles.backgroundImage]}
            blurRadius={4}
          />
        )}
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Processando...</Text>
      </Animated.View>

      {/* Tela de resultados */}
      {(processedText || errorMessage) && (
        <View style={styles.resultContainer}>
          <Animated.Image
            source={{ uri: backgroundImageUri! }}
            style={[styles.backgroundImage, styles.dimmedBackground]}
          />

          <View style={styles.resultControls}>
            <TouchableOpacity
              onPress={resetState}
              style={styles.controlButton}
              accessibilityLabel="Fechar resultados"
            >
              <Ionicons name="close" size={34} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Speech.stop()}
              style={styles.controlButton}
              accessibilityLabel="Parar leitura"
            >
              <Ionicons name="stop-circle" size={34} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.resultContent}>
            <Text style={styles.resultText}>
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
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  permissionButton: {
    backgroundColor: "#FF9500",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  flipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  dimmedBackground: {
    opacity: 0.4,
  },
  loadingText: {
    color: "white",
    fontSize: 20,
    marginTop: 20,
  },
  resultContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  resultControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 40,
  },
  controlButton: {
    padding: 15,
  },
  resultContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  resultText: {
    color: "white",
    fontSize: 20,
    lineHeight: 28,
  },
});
