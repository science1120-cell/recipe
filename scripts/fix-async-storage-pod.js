/**
 * Expo autolinking picks AsyncStorage.podspec (Kotlin) over RNCAsyncStorage.podspec.
 * The Kotlin pod fails to build without AsyncStorageSpec codegen on Expo SDK 54.
 * Disable it so the stable legacy pod is linked instead.
 */
const fs = require("fs");
const path = require("path");

const podspec = path.join(
  __dirname,
  "../node_modules/@react-native-async-storage/async-storage/AsyncStorage.podspec"
);
const disabled = `${podspec}.disabled`;

if (fs.existsSync(podspec)) {
  fs.renameSync(podspec, disabled);
  console.log("[postinstall] Disabled AsyncStorage.podspec → using RNCAsyncStorage");
} else if (fs.existsSync(disabled)) {
  console.log("[postinstall] AsyncStorage.podspec already disabled");
}
