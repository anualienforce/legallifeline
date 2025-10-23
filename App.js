import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // ✅ Expo-compatible import

import Home from "./components/Home";
import Site from "./components/Site";
import SOS from "./components/SOS";
import News from "./components/News";
import YourRights from "./components/YourRights";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // ✅ move headerShown here (correct prop name)
          tabBarActiveTintColor: "#cdba6d",
          tabBarInactiveTintColor: "#323a43",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#cdba6d",
            borderTopWidth: 1,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Site"
          component={Site}
          options={{
            tabBarLabel: "Site",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="web" color={color} size={size} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              Linking.openURL("https://legallifelines.co.uk/");
            },
          }}
        />
        <Tab.Screen
          name="SOS"
          component={SOS}
          options={{
            tabBarLabel: "SOS",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="shield-alert"
                color={color}
                size={33}
              />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={News}
          options={{
            tabBarLabel: "News",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="email-newsletter"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="YourRights"
          component={YourRights}
          options={{
            tabBarLabel: "Your Rights",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="newspaper"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
