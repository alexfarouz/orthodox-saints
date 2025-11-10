import * as Notifications from "expo-notifications";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function Index() {
  const [now, setNow] = useState(new Date());
  const [followClock, setFollowClock] = useState(true);
  const [manualHour, setManualHour] = useState(0); // 0..23

  useEffect(() => {
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

        {/* Optional: remove this if you don't need it */}
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
    fontWeight: "700",
  },
  captionSep: {
    fontWeight: "400",
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
