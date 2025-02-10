// style.ts
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styles = StyleSheet.create({
    imageFix: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      position: 'absolute',
    },
  });

export const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cameraView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.overlayDark,
  },
  loadingText: {
    color: theme.colors.lightText,
    fontSize: theme.fontSizes.subtitle,
    marginTop: theme.spacing.md,
  },
});

export const textProcessorStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlayDark,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  scroll: {
    flex: 1,
    marginTop: theme.spacing.md,
  },
  text: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.lightText,
    lineHeight: theme.lineHeights.body,
  },
  iconButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.overlayLight,
  },
});

export const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  profileButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  profileText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.lightText,
    fontWeight: "600",
  },
});

export const baseStyles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeading: {
    fontSize: theme.fontSizes.title,
    color: theme.colors.text,
    lineHeight: theme.lineHeights.title,
    fontWeight: "bold",
  },
});