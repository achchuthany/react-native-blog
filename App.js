import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { House, PlusCircle, User } from "lucide-react-native";

import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddPostScreen from "./screens/AddPostScreen";
import EditPostScreen from "./screens/EditPostScreen";
import AddCommentScreen from "./screens/AddCommentScreen";
import EditCommentScreen from "./screens/EditCommentScreen";
import { COLORS } from "./utils/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.white,
        tabBarActiveBackgroundColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, color }) => <House size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <PlusCircle size={size} color={color} />
          ),
          title: "Add Post",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      >
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          options={{ title: "Add Post" }}
        />
        <Stack.Screen
          name="EditPost"
          component={EditPostScreen}
          options={{ title: "Edit Post" }}
        />
        <Stack.Screen
          name="AddComment"
          component={AddCommentScreen}
          options={{ title: "Add Comment" }}
        />
        <Stack.Screen
          name="EditComment"
          component={EditCommentScreen}
          options={{ title: "Edit Comment" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
