import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { textProcessorStyles } from "../style/styles";

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
  <View style={textProcessorStyles.container}>
    <View style={textProcessorStyles.header}>
      <TouchableOpacity
        style={textProcessorStyles.iconButton}
        onPress={resetState}
        accessibilityLabel="Fechar"
        accessibilityHint="Fecha a tela atual"
      >
        <Ionicons name="close-circle" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={textProcessorStyles.iconButton}
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
    <ScrollView style={textProcessorStyles.scroll}>
      <Text style={textProcessorStyles.text}>
        {processedText || errorMessage}
      </Text>
    </ScrollView>
  </View>
);
