import * as Notifications from "expo-notifications";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Item } from "./data/saints";
import { SAINT_BY_HOUR } from "./data/saints-by-hour";
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

// --- Notifications helpers ---------------------------------------------------
async function ensurePerms() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const res = await Notifications.requestPermissionsAsync();
    if (res.status !== "granted") throw new Error("no-permission");
  }
}

// Top of next hour
function nextTopOfHour(from = new Date()) {
  const n = new Date(from);
  n.setMinutes(0, 0, 0);
  if (from.getMinutes() !== 0 || from.getSeconds() !== 0)
    n.setHours(n.getHours() + 1);
  return n;
}

// For quick testing: schedule at the NEXT MINUTE (then repeat hourly)
async function scheduleAtNextMinuteThenHourly(item: Item) {
  await ensurePerms();
  const now = new Date();
  const next = new Date(now.getTime() + 60 * 1000);
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: item.name, body: item.text },
    trigger: {
      type: "calendar",
      hour: next.getHours(),
      minute: next.getMinutes(),
      repeats: true,
    },
  });
  Alert.alert("Scheduled", "It will fire next minute, then hourly from there.");
}

// Real use: schedule the next 48 top-of-the-hour notifications with proper text
async function scheduleNext48Hours() {
  await ensurePerms();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const first = nextTopOfHour();
  const count = 48; // keep well under iOS pending limit (~64)

  for (let i = 0; i < count; i++) {
    const fire = new Date(first.getTime() + i * 60 * 60 * 1000);
    const saint = SAINT_BY_HOUR[fire.getHours()]; // fixed hour→saint mapping
    await Notifications.scheduleNotificationAsync({
      content: { title: saint.name, body: saint.text },
      trigger: fire, // one-off at the exact wall-clock time
    });
  }
  Alert.alert("Scheduled", "Hourly quotes planned for the next 48 hours.");
}

export default function Index() {
  const [now, setNow] = useState(new Date());
  const [followClock, setFollowClock] = useState(true);
  const [manualHour, setManualHour] = useState(0); // 0..23

  useEffect(() => {
    // refresh every 30s when following clock
    if (!followClock) return;
    const t = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(t);
  }, [followClock]);

  const hour = useMemo(
    () => (followClock ? now.getHours() : manualHour),
    [followClock, manualHour, now]
  );

  const item = SAINT_BY_HOUR[hour];

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Image
          source={coptic}
          style={styles.cross}
          accessibilityLabel="Coptic cross"
        />

        <Text style={styles.jesusPrayerText}>
          {"Lord Jesus Christ, Son of God, have mercy on me, a sinner"}
        </Text>

        <View style={styles.imageWrap}>
          <Image source={item.image} resizeMode="cover" style={styles.image} />
        </View>

        <Text style={styles.timeText}>{`${hourLabel(now)}`}</Text>

        <Text style={styles.captionBase}>
          <Text style={styles.captionName}>{item.name}</Text>
          <Text style={styles.captionSep}>: </Text>
          <Text style={styles.captionQuote}>{item.text}</Text>
        </Text>

        {/* Controls */}
        <View style={styles.row}>
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
            onPress={() => scheduleAtNextMinuteThenHourly(item)}
          >
            <Text style={styles.btnText}>Test: next min → hourly</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={scheduleNext48Hours}>
            <Text style={styles.btnText}>Schedule next 48 hrs</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, { marginTop: 10 }]}
          onPress={() => Notifications.cancelAllScheduledNotificationsAsync()}
        >
          <Text style={styles.btnText}>Cancel all</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: "rgba(255,255,255,.25)",
    borderWidth: 1,
  },
  captionBase: {
    color: "white",
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
  },

  captionName: {
    fontWeight: "700", // bold just the saint name
    // or fontFamily: "Inter_700Bold" if using Inter
  },

  captionSep: {
    fontWeight: "400",
    // or fontFamily: "Inter_400Regular"
  },

  captionQuote: {
    fontWeight: "400",
    fontSize: 16,
  },

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
  btnActive: { backgroundColor: "rgba(255,255,255,.07)" },
  btnText: { color: "white", fontWeight: "700" },
});
