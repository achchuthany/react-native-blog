import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/colors";

export default function AddCommentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Comment</Text>
      <Text style={styles.body}>Write a new comment on a post here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
