import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../style/style";

export const TextProcessor = ({
  processedText,
  errorMessage,
  isSpeaking,
  toggleSpeaking,
  resetState,
}: {
  processedText: string | null;
  errorMessage: string | null;
  isSpeaking: boolean;
  toggleSpeaking: () => void;
  resetState: () => void;
}) => (
  <View style={styles.processedTextContainer}>
    <View style={styles.topIcons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={resetState}
        accessibilityLabel="Fechar"
        accessibilityHint="Fecha a tela atual"
      >
        <Ionicons name="close-circle" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={toggleSpeaking}
        accessibilityLabel={isSpeaking ? "Pausar fala" : "Ouvir texto"}
        accessibilityHint={
          isSpeaking ? "Pausa a fala atual" : "Inicia a leitura do texto"
        }
      >
        <Ionicons
          name={isSpeaking ? "volume-mute" : "volume-high"}
          size={32}
          color="white"
        />
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.processedTextWrapper}>
      <Text style={styles.processedText}>{processedText || errorMessage}</Text>
    </ScrollView>
  </View>
);
