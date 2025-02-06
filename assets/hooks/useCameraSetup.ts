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
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (Math.abs(gestureState.dx) > 100) {
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
