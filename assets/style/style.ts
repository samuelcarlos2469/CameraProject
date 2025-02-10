import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  containerLista: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileButton: {
    backgroundColor: "#0077B5", // Cor de fundo do botão
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Borda arredondada
    marginBottom: 10, // Espaço entre os itens
    width: "90%", // Ocupa boa parte da tela
    alignItems: "center", // Centraliza o texto
    elevation: 5, // Efeito de sombra para Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileText: {
    fontSize: 18,
    color: "white", // Cor do texto
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row", // Garante que os botões fiquem lado a lado
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    width: 80, // Define uma largura fixa para ambos os botões
    height: 80, // Define uma altura fixa para ambos os botões
    marginHorizontal: 16,
    backgroundColor: "#FF9500", // Cor do fundo igual para ambos
    borderRadius: 50, // Borda arredondada
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: "center", // Centraliza o ícone dentro do botão
    justifyContent: "center", // Centraliza o ícone dentro do botão
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
  },
  processedTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    marginTop: 50,
  },
  processedTextWrapper: {
    marginTop: 50,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  processedText: {
    fontSize: 18,
    color: "white",
    textAlign: "left",
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  iconButton: {
    padding: 10,
  },
});
