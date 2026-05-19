import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, H1, Input, PillButton, Screen } from '@/components/recipes-ui';
import { Colors, Fonts } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function OnboardingScreen() {
  const { signInOrSignUpWithEmail, enterDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  // When Supabase is not configured, allow entering with any input (demo mode).
  const canSubmit = useMemo(
    () => (!isSupabaseConfigured || (email.trim().length > 3 && password.length >= 6)) && !submitting,
    [email, password, submitting]
  );

  async function onGetStarted() {
    try {
      setErrorText('');
      setSubmitting(true);
      await signInOrSignUpWithEmail(email.trim(), password);
    } catch (e: any) {
      const message = e?.message ?? 'Please try again.';
      setErrorText(message);
      Alert.alert('Could not sign in', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {!isSupabaseConfigured && (
          <View style={styles.demoBanner}>
            <Body style={styles.demoBannerText}>
              ✦ Preview mode — Supabase not set up yet. Tap "Preview App" to browse all screens.
            </Body>
          </View>
        )}

        <View style={{ paddingTop: isSupabaseConfigured ? 50 : 16 }}>
          <H1>Recipes Journal</H1>
          {__DEV__ && !isSupabaseConfigured && (
            <Pressable onPress={enterDemoMode} style={({ pressed }) => [styles.previewLink, pressed && { opacity: 0.5 }]}>
              <Text style={styles.previewLinkText}>先預覽，不登入 →</Text>
            </Pressable>
          )}
          <View style={{ height: 18 }} />
          <Body>
            Hello there,
            {'\n\n'}Cooking takes effort.
            {'\n'}You did it great.
            {'\n\n'}Take a breath, relax, and write down the recipe you just made, so you can recreate the delicious moment anytime.
          </Body>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.form}>
          {isSupabaseConfigured ? (
            <>
              <Body>Email</Body>
              <View style={{ height: 10 }} />
              <Input value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />

              <View style={{ height: 16 }} />
              <Body>Password</Body>
              <View style={{ height: 10 }} />
              <Input value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
              <View style={{ height: 18 }} />
            </>
          ) : (
            <View style={{ height: 18 }} />
          )}

          <PillButton
            title={submitting ? '...' : isSupabaseConfigured ? 'Get Started' : 'Preview App'}
            onPress={onGetStarted}
            style={{ ...styles.ctaButton, ...(!canSubmit ? { opacity: 0.5 } : {}) }}
          />
          {errorText ? (
            <>
              <View style={{ height: 8 }} />
              <Body muted>{errorText}</Body>
            </>
          ) : null}
          <View style={{ height: 10 }} />
          {isSupabaseConfigured && <Body muted>Password must be at least 6 characters.</Body>}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: 'transparent',
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 28,
  },
  demoBanner: {
    backgroundColor: Colors.light.accent + '33',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 50,
    marginBottom: 4,
  },
  demoBannerText: {
    fontSize: 13,
  },
  previewLink: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  previewLinkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: Colors.light.muted,
    textDecorationLine: 'underline',
  },
  ctaButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
});

