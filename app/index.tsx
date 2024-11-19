import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

      // Obter Blob da imagem
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "photo.jpg");

      const backendResponse = await fetch("http://10.8.34.4:5000/process", {
        method: "POST",
        body: formData,
      });

      if (!backendResponse.ok) {
        throw new Error("Erro no processamento do backend");
      }

      const result = await backendResponse.json();
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
