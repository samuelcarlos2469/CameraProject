import { useState, useCallback } from "react";
import * as ImageManipulator from "expo-image-manipulator";

const useImageOrientation = () => {
  const [imageRotation, setImageRotation] = useState(0);

  const fixImageOrientation = useCallback(async (photo: any) => {
    try {
      const { width, height } = photo;
      let rotate = 0;

      if (width > height) {
        rotate = 90; // Rotate to landscape
      }

      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ rotate }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImageRotation(rotate); // Atualiza o estado da rotação
      return manipulatedPhoto;
    } catch (error) {
      console.error("Erro ao corrigir a orientação da imagem:", error);
      return photo; // Retorna a foto original em caso de erro
    }
  }, []);

  return {
    imageRotation,
    fixImageOrientation,
  };
};

export default useImageOrientation;
