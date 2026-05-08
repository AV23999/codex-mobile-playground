// Biometric authentication using expo-local-authentication
// Install: npx expo install expo-local-authentication
import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
}

export async function getBiometricType() {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'Touch ID';
  return 'Biometric';
}

export async function authenticateWithBiometric(reason = 'Verify your identity to access Nova Chat') {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
    fallbackLabel: 'Use PIN',
  });
  return result.success;
}

export async function authenticatePayment(amount, currency = 'USD') {
  return await authenticateWithBiometric(
    `Authorize payment of ${currency} ${amount} with Nova Pay`
  );
}
