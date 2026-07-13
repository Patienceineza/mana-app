import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { fontFamily, radii, spacing, TAB_BAR_CLEARANCE, ThemeColors } from '@/constants/theme';

const GRADE_OPTIONS = [
  { key: 'any', label: 'Any Grade' },
  { key: 'A', label: 'Grade A' },
  { key: 'B', label: 'Grade B' },
  { key: 'C', label: 'Grade C' },
];

export default function RequestProductScreen() {
  const { cropName: cropNameParam } = useLocalSearchParams<{ cropName?: string }>();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [cropName, setCropName] = useState(cropNameParam ?? '');
  const [qty, setQty] = useState('');
  const [neededBy, setNeededBy] = useState('');
  const [grade, setGrade] = useState('any');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!cropName.trim() || !qty.trim()) {
      setError('Crop name and quantity are required.');
      return;
    }
    const qtyNumber = Number(qty);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await api.post('/buyer-requests', {
        cropName: cropName.trim(),
        qty: qtyNumber,
        unit: 'kg',
        neededBy: neededBy.trim() || undefined,
        preferredGrade: grade,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successBox}>
            <View style={styles.successIconCircle}>
              <Feather name="check" size={36} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Request Submitted!</Text>
            <Text style={styles.successSubtitle}>
              We've queued your request for {cropName}. We will match it with local farmers and notify you once supply is secured.
            </Text>
          </View>
          <PrimaryButton
            title="View My Requests"
            onPress={() => {
              setSubmitted(false);
              router.replace('/(buyer)/profile');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header Row */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Request Produce</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.instructions}>
            Can't find a crop in the market? Submit a request specifying what you need, and the FreshRoute coordinators will match you with farmers who can harvest it for you.
          </Text>

          <Text style={styles.label}>Crop Name</Text>
          <TextInput
            value={cropName}
            onChangeText={setCropName}
            placeholder="e.g. Avocado, Yellow Tomatoes"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          <Text style={styles.label}>Quantity Needed (kg)</Text>
          <TextInput
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
            placeholder="e.g. 150"
            placeholderTextColor={colors.textFainter}
            style={styles.input}
          />

          <Text style={styles.label}>Preferred Grade</Text>
          <View style={styles.gradeRow}>
            {GRADE_OPTIONS.map((opt) => {
              const active = opt.key === grade;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setGrade(opt.key)}
                  style={[
                    styles.gradeButton,
                    active && { backgroundColor: colors.green, borderColor: colors.green },
                  ]}
                >
                  <Text style={[styles.gradeText, active && { color: '#fff', fontFamily: fontFamily.bold }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Needed By (Date or Info)</Text>
          <TextInput
            value={neededBy}
            onChangeText={setNeededBy}
            placeholder="e.g. 20 Jul, or ASAP"
            placeholderTextColor={colors.textFainter}
            style={[styles.input, { marginBottom: spacing.lg }]}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title="Submit Request"
            onPress={submit}
            loading={submitting}
            disabled={!cropName || !qty}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      height: 54,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
    },
    headerTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 16,
      color: colors.text,
    },
    scrollContent: {
      padding: spacing.xl,
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    instructions: {
      fontFamily: fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textFaint,
      marginBottom: spacing.xl,
    },
    label: {
      fontFamily: fontFamily.bold,
      fontSize: 11,
      color: colors.textFaint,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: spacing.md,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: radii.lg,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 14,
      color: colors.text,
      fontFamily: fontFamily.regular,
    },
    gradeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: spacing.sm,
    },
    gradeButton: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radii.pill,
      paddingVertical: 8,
      paddingHorizontal: 14,
      backgroundColor: colors.surface,
    },
    gradeText: {
      fontFamily: fontFamily.medium,
      fontSize: 12,
      color: colors.text,
    },
    error: {
      color: colors.red,
      fontFamily: fontFamily.medium,
      fontSize: 13,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    successContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.xl,
    },
    successBox: {
      backgroundColor: colors.greenBg,
      borderWidth: 2,
      borderColor: colors.green,
      borderRadius: radii.xl,
      padding: spacing.xl,
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    successIconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    successTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 18,
      color: colors.text,
      marginBottom: 6,
    },
    successSubtitle: {
      fontFamily: fontFamily.regular,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textFaint,
      textAlign: 'center',
    },
  });
