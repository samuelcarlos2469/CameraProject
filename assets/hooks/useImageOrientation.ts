import { useState, useCallback } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraCapturedPicture } from "expo-camera";

const useImageOrientation = () => {
    const [imageRotation, setImageRotation] = useState(0);
  
    const fixImageOrientation = useCallback(async (photo: CameraCapturedPicture) => {
      try {
        const { exif = {} } = photo;
        let rotate = 0;
  
        // Mapeamento simplificado
        const EXIF_MAP: { [key: number]: number } = {
          3: 180,
          6: 90,
          8: -90
        };
  
        rotate = EXIF_MAP[exif.Orientation || 1] || 0;
  
        // Não force landscape automaticamente
        const manipulatedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          rotate !== 0 ? [{ rotate }] : [],
          { 
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false
          }
        );
  
        setImageRotation(rotate);
        return manipulatedPhoto;
      } catch (error) {
        console.error("Erro ao corrigir orientação:", error);
        return photo;
      }
    }, []);
  
    return { imageRotation, fixImageOrientation };
  };
export default useImageOrientation;