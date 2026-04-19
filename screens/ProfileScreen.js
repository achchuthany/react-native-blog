import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "../utils/colors";
import { clearToken } from "../utils/tokenHelper";

export default function ProfileScreen({ navigation }) {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await clearToken();
      navigation.replace("SignIn");
    } catch (error) {
      Alert.alert("Sign Out Error", "Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.body}>User profile details will appear here.</Text>
      <TouchableOpacity
        style={[
          styles.signOutButton,
          signingOut && styles.signOutButtonDisabled,
        ]}
        onPress={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
