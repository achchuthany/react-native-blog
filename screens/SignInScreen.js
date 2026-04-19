import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getToken, setToken } from "../utils/tokenHelper";
import { COLORS } from "../utils/colors";
import { apiClient } from "../utils/api";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        navigation.replace("Main");
      }
    };
    checkToken();
  }, []);

  async function handleSignIn() {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("auth/login", {
        email: email.trim(),
        password,
      });
      if (response.status === 200) {
        const { token } = response.data.data;
        await setToken(token);
        navigation.replace("Main");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials and try again.";
      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog App</Text>
      <Text style={styles.subtitle}>Sign In</Text>

      <View style={styles.inputRow}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
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
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  inputRow: {
    width: "80%",
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
  },
  button: {
    width: "80%",
    padding: 14,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
