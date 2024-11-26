import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false); // Para controlar o estado de upload
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
        <Button onPress={requestPermission} title="grant permission" />
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
        base64: true,
        exif: false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      await sendPhotoToBackend(photo);
    }
  };

  const sendPhotoToBackend = async (photo: any) => {
    try {
      setIsUploading(true);

      // Criar o FormData e adicionar o arquivo
      const formData = new FormData();
      formData.append(
        "image",
        {
          uri: photo.uri, // URI da imagem capturada
          type: "image/jpeg", // Tipo do arquivo
          name: "photo.jpg", // Nome do arquivo
        } as unknown as Blob // Type assertion para evitar erro TS
      );

      // Enviar usando fetch
      const response = await fetch(
        "https://9c62-200-19-35-2.ngrok-free.app/process",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json(); // Supondo que o backend retorna JSON
      console.log("Resultado do processamento:", result);
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "gray",
    borderRadius: 10,
  },
});
