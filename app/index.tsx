import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
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
        "https://airedale-touched-mainly.ngrok-free.app/process",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      console.log("Imagem processada:", result);
      setProcessedImage(result.processed_image); // Mostrando imagem processada
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
      {processedImage && (
        <View style={styles.imageContainer}>
          <Text>Imagem Processada:</Text>
          <Image source={{ uri: processedImage }} style={styles.image} />
        </View>
      )}
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
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
});
