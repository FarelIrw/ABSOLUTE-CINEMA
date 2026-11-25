import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { exploreStyles } from "../../styles/exploreStyles";

type PlanCode = "free" | "standard" | "premium";

interface PlanItem {
  code: PlanCode;
  name: string;
  priceLabel: string;
  description: string;
}

const PLANS: PlanItem[] = [
  {
    code: "free",
    name: "Free",
    priceLabel: "Gratis",
    description: "Akses katalog film dasar dan daftar favorit standar.",
  },
  {
    code: "standard",
    name: "Standard",
    priceLabel: "Rp 49.000 / bln",
    description: "Kualitas HD, tanpa iklan pengganggu, dan sinkronisasi multi-sesi.",
  },
  {
    code: "premium",
    name: "Premium",
    priceLabel: "Rp 99.000 / bln",
    description: "Kualitas Full HD / 4K, akses awal konten, dan prioritas akun.",
  },
];

export default function SubscriptionScreen() {
  const { user } = useAuth();

  const [activePlan, setActivePlan] = useState<PlanCode>("free");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [savingPlan, setSavingPlan] = useState<PlanCode | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadSubscription = useCallback(
    async (isRefresh = false) => {
      if (!user) {
        setActivePlan("free");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMsg(null);

      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("plan_code")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          setErrorMsg("Gagal memuat status langganan.");
          return;
        }

        const code = data?.plan_code;
        if (code === "free" || code === "standard" || code === "premium") {
          setActivePlan(code);
        } else {
          setActivePlan("free");
        }
      } catch {
        setErrorMsg("Terjadi kesalahan jaringan saat memuat langganan.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      loadSubscription(false);
    }, [loadSubscription])
  );

  const handleSelectPlan = async (targetPlan: PlanCode) => {
    if (!user || savingPlan !== null || targetPlan === activePlan) return;

    setSavingPlan(targetPlan);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            plan_code: targetPlan,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        setErrorMsg("Gagal memperbarui paket langganan.");
        return;
      }

      setActivePlan(targetPlan);
      setSuccessMsg(`Paket aktif diperbarui menjadi ${targetPlan.toUpperCase()}.`);
    } catch {
      setErrorMsg("Terjadi kesalahan saat menyimpan paket langganan.");
    } finally {
      setSavingPlan(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[exploreStyles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.hintText}>Memuat status langganan...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[exploreStyles.container, styles.screen]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadSubscription(true)}
          tintColor="#ffffff"
        />
      }
    >
      <Text style={styles.heading}>Langganan</Text>
      <Text style={styles.subheading}>
        {user
          ? `Akun: ${user.callsign} • Paket saat ini: ${activePlan.toUpperCase()}`
          : "Masuk untuk mengatur paket langganan"}
      </Text>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {successMsg ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {PLANS.map((plan) => {
          const isCurrent = activePlan === plan.code;
          const isSavingThis = savingPlan === plan.code;

          return (
            <View
              key={plan.code}
              style={[styles.card, isCurrent && styles.activeCard]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.priceText}>{plan.priceLabel}</Text>
              </View>

              <Text style={styles.planDesc}>{plan.description}</Text>

              <Pressable
                style={[
                  styles.actionBtn,
                  isCurrent && styles.currentBtn,
                  savingPlan !== null && !isSavingThis && styles.disabledBtn,
                ]}
                onPress={() => handleSelectPlan(plan.code)}
                disabled={isCurrent || savingPlan !== null || !user}
              >
                {isSavingThis ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text
                    style={[
                      styles.actionBtnText,
                      isCurrent && styles.currentBtnText,
                    ]}
                  >
                    {isCurrent ? "Paket Aktif" : `Pilih ${plan.name}`}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 96,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  subheading: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  hintText: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 13,
  },
  successBox: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.4)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    color: "#86efac",
    fontSize: 13,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#181820",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#262633",
    gap: 8,
  },
  activeCard: {
    borderColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  priceText: {
    color: "#d4d4d8",
    fontSize: 13,
    fontWeight: "600",
  },
  planDesc: {
    color: "#a1a1aa",
    fontSize: 13,
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: 6,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  currentBtn: {
    backgroundColor: "#272733",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },
  currentBtnText: {
    color: "#a1a1aa",
  },
});