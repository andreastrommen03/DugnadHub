// src/app/authentication.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthSession } from "../providers/authctx";

export default function AuthenticationScreen() {
  const { signIn, signUp } = useAuthSession();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email || !password) return;

    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);

      router.replace("/(protected)/(tabs)");
    } catch (e) {
      Alert.alert("Feil", "Kunne ikke logge inn.");
    }
  };

  return (
    <View className="flex-1 bg-[#20202A] justify-center px-6">
      <Text className="text-white text-2xl font-bold text-center mb-8">
        {mode === "login" ? "Logg inn" : "Registrer deg"}
      </Text>

      <Text className="text-white mb-1">E-post</Text>
      <TextInput
        className="bg-white px-4 py-2 rounded-md mb-4"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text className="text-white mb-1">Passord</Text>
      <TextInput
        className="bg-white px-4 py-2 rounded-md mb-6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        className="bg-[#FF9B52] py-3 rounded-full mb-4"
        onPress={submit}
      >
        <Text className="text-white text-center font-semibold">
          {mode === "login" ? "Logg inn" : "Registrer meg"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
        <Text className="text-[#F7853E] text-center">
          {mode === "login"
            ? "Har du ikke konto? Registrer deg"
            : "Har du allerede konto? Logg inn"}
        </Text>
      </Pressable>
    </View>
  );
}
