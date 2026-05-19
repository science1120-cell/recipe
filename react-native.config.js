/** Use the legacy RNCAsyncStorage pod (stable with Expo SDK 54 + New Architecture). */
module.exports = {
  dependencies: {
    "@react-native-async-storage/async-storage": {
      platforms: {
        ios: {
          podspecPath:
            "node_modules/@react-native-async-storage/async-storage/RNCAsyncStorage.podspec",
        },
        android: {
          sourceDir:
            "node_modules/@react-native-async-storage/async-storage/android",
          packageImportPath:
            "import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;",
          packageInstance: "new AsyncStoragePackage()",
        },
      },
    },
  },
};
