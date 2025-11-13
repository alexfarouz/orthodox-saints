import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SAINT_BY_HOUR } from "../data/saints-by-hour";

const coptic = require("../assets/images/cross.png");

// Show alerts in foreground while testing
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const hourLabel = (d: Date) => d.toLocaleTimeString([], { hour: "numeric" });

export default function Index() {
  const [now, setNow] = useState(new Date());
  const [followClock] = useState(true); // setFollowClock
  const [manualHour] = useState(0); // setManualHour

  // tick every 30s when following the clock
  useEffect(() => {
    if (!followClock) return;
    const t = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(t);
  }, [followClock]);

  const hour = useMemo(
    () => (followClock ? now.getHours() : manualHour),
    [followClock, manualHour, now]
  );

  const ensurePerms = useCallback(async () => {
    let perms = await Notifications.getPermissionsAsync();
    if (perms.status !== "granted") {
      perms = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
    }
    if (perms.status !== "granted") {
      Alert.alert("Notifications blocked", "Enable notifications in Settings.");
      throw new Error("no-permission");
    }
  }, []);

  // Send a one-off local notification immediately (test button)
  // async function sendTestNotification(item: Item) {
  //   try {
  //     await ensurePerms();
  //     if (Platform.OS === "android") {
  //       await Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.HIGH,
  //         vibrationPattern: [0, 250, 250, 250],
  //         lightColor: "#FFFFFF",
  //       });
  //     }
  //     await Notifications.scheduleNotificationAsync({
  //       content: { title: item.name, body: item.text },
  //       trigger: null, // fire now
  //     });
  //   } catch (e: any) {
  //     console.error(e);
  //     Alert.alert("Error", String(e?.message ?? e));
  //   }
  // }

  const scheduleDailyTopOfHourForever = useCallback(async () => {
    await ensurePerms();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    for (let h = 0; h < 24; h++) {
      const saint = SAINT_BY_HOUR[h];
      await Notifications.scheduleNotificationAsync({
        content: { title: saint.name, body: saint.text },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: h,
          minute: 0,
          repeats: true,
        },
      });
    }
  }, [ensurePerms]);

  // Set-and-forget schedule once when the app first mounts
  useEffect(() => {
    scheduleDailyTopOfHourForever().catch(() => {});
  }, [scheduleDailyTopOfHourForever]);

  const item = SAINT_BY_HOUR[hour];

  return (
    <SafeAreaView style={styles.root}>
      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/settings")}
      >
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={coptic}
          style={styles.cross}
          accessibilityLabel="Coptic cross"
        />

        <Text style={styles.jesusPrayerText}>
          Lord Jesus Christ, Son of God, have mercy on me, a sinner
        </Text>

        <View style={styles.imageWrap}>
          <Image source={item.image} resizeMode="cover" style={styles.image} />
        </View>

        <Text style={styles.timeText}>{hourLabel(now)}</Text>

        <Text style={styles.captionBase}>
          <Text style={styles.captionName}>{item.name}</Text>
          <Text style={styles.captionSep}>: </Text>
          <Text style={styles.captionQuote}>{item.text}</Text>
        </Text>

        {/* TEST CONTROLS - Commented out for production */}
        {/* <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setFollowClock(false);
              setManualHour((h) => (h + 23) % 24);
            }}
          >
            <Text style={styles.btnText}>◀︎ Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, followClock && styles.btnActive]}
            onPress={() => setFollowClock((v) => !v)}
          >
            <Text style={styles.btnText}>
              {followClock ? "Following clock" : "Manual"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setFollowClock(false);
              setManualHour((h) => (h + 1) % 24);
            }}
          >
            <Text style={styles.btnText}>Next ▶︎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => sendTestNotification(item)}
          >
            <Text style={styles.btnText}>Send test notification</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  menuButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  menuIcon: {
    width: 28,
    height: 20,
    justifyContent: "space-between",
  },
  menuLine: {
    height: 3,
    backgroundColor: "white",
    borderRadius: 2,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  imageWrap: {
    width: "92%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "#000",
  },
  image: { width: "100%", height: "100%" },
  jesusPrayerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 16,
    textAlign: "center",
  },
  // TEST BUTTON STYLES - Commented out for production
  // row: {
  //   flexDirection: "row",
  //   gap: 12,
  //   marginTop: 14,
  //   flexWrap: "wrap",
  //   justifyContent: "center",
  // },
  // btn: {
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   borderRadius: 10,
  //   borderColor: "rgba(255,255,255,.25)",
  //   borderWidth: 1,
  // },
  captionBase: {
    color: "white",
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
  },
  captionName: { fontWeight: "700" },
  captionSep: { fontWeight: "400" },
  captionQuote: { fontWeight: "400", fontSize: 16 },
  timeText: {
    color: "white",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
  cross: {
    width: 64,
    height: 64,
    alignSelf: "center",
    marginBottom: 8,
    resizeMode: "contain",
  },
  // btnActive: { backgroundColor: "rgba(255,255,255,.07)" },
  // btnText: { color: "white", fontWeight: "700" },
});
