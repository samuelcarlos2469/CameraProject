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
} from "react-native";
import * as Speech from "expo-speech"; // Importando o expo-speech

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

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

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: false,
        exif: false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      await sendPhotoToBackend(photo);
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
        return;
      }

      const result = await response.json();
      setProcessedText(result.text || "Nenhum texto encontrado.");
      setErrorMessage(null);
      Speech.speak(result.text || "Nenhum texto encontrado."); // Fala a resposta processada
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      setErrorMessage("Erro ao enviar a imagem. Tente novamente.");
      setProcessedText(null);
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    // Parando a fala e resetando os estados
    Speech.stop();
    setProcessedText(null);
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {!processedText && !errorMessage && (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <AntDesign name="retweet" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleTakePhoto}
              disabled={isUploading}
            >
              <AntDesign
                name="camera"
                size={44}
                color={isUploading ? "gray" : "black"}
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {(processedText || errorMessage) && (
        <View style={styles.processedTextContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={resetState}>
            <AntDesign name="close" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.processedText}>
            {processedText || errorMessage}
          </Text>
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
  processedTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  processedText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF9500",
    borderRadius: 25,
    padding: 10,
  },
});
