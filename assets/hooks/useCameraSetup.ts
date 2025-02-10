import { useState, useRef } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import {
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  AccessibilityInfo,
} from "react-native";

export const useCameraSetup = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Se for um toque leve (pouco movimento), não ativa o PanResponder
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Só ativa se o movimento for grande o suficiente
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          toggleCameraFacing();
        } else if (gestureState.dx < -100) {
          toggleCameraFacing();
        }
      },
    })
  ).current;

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
    AccessibilityInfo.announceForAccessibility("Câmera alternada");
  };

  return {
    permission,
    requestPermission,
    facing,
    toggleCameraFacing,
    panResponder,
    cameraRef,
  };
};
