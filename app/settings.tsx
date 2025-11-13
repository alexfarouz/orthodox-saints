import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const handleDisableNotifications = () => {
    Alert.alert(
      "Disable Notifications",
      "To disable notifications, go to Settings > Notifications > Orthodox Saints and turn off notifications.",
      [{ text: "OK" }]
    );
  };

  const handleWidgetInstructions = () => {
    Alert.alert(
      "Add Widget",
      "1. Long press on your Home Screen\n2. Tap the + button in the top left\n3. Search for 'Orthodox Saints'\n4. Select the small widget\n5. Tap 'Add Widget'",
      [{ text: "OK" }]
    );
  };

  const handleShareApp = () => {
    Alert.alert("Share the app", "Sharing functionality coming soon!", [
      { text: "OK" },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Welcome</Text>
          <TouchableOpacity
            style={styles.chevron}
            onPress={() => {
              /* Could open additional welcome/tutorial */
            }}
          >
            <Text style={styles.chevronText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              A notification arrives every hour.
            </Text>
            <TouchableOpacity onPress={handleDisableNotifications}>
              <Text style={styles.linkText}>Disable</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WIDGETS</Text>
          <View style={styles.card}>
            <View style={styles.widgetPreview}>
              <View style={styles.widgetPlaceholder}>
                <Text style={styles.widgetText}>Widget Preview</Text>
              </View>
            </View>
            <Text style={styles.cardText}>
              You can add a widget, which always displays the current prayer, to
              your Home Screen or Today View.
            </Text>
            <TouchableOpacity onPress={handleWidgetInstructions}>
              <Text style={styles.linkText}>See instructions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.actionRow} onPress={handleShareApp}>
            <Text style={styles.actionText}>Share the app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#0a84ff",
    fontSize: 28,
    fontWeight: "300",
  },
  welcomeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  chevron: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronText: {
    color: "#8e8e93",
    fontSize: 24,
    fontWeight: "400",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: "#8e8e93",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    padding: 16,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  linkText: {
    color: "#0a84ff",
    fontSize: 16,
    fontWeight: "600",
  },
  widgetPreview: {
    marginBottom: 16,
    alignItems: "center",
  },
  widgetPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: "#0a84ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  widgetText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    backgroundColor: "#2c2c2e",
    borderRadius: 12,
    padding: 16,
  },
  actionText: {
    color: "#0a84ff",
    fontSize: 16,
    fontWeight: "600",
  },
});
