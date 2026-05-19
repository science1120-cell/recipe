# Recipes Journal

食譜日記 App（Expo + Expo Router + Supabase）。可安裝在 iPhone 上獨立使用，**不需要 Expo Go**。

## 環境設定

1. 安裝依賴：`npm install`
2. 複製環境變數：`cp .env.example .env`
3. 在 `.env` 填入 Supabase 專案的：
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. 在 [Supabase SQL Editor](https://supabase.com/dashboard) 執行 `supabase/schema.sql`（若尚未建立資料表）

## 在真實 iPhone 上安裝（不用 Expo Go）

### 方式 A：USB 連線直接安裝（建議）

1. 用 USB 將 iPhone 連到 Mac，在手機上點「信任此電腦」
2. 在 Xcode 開啟：`open ios/RecipesJournal.xcworkspace`
3. 上方選單選你的 **實體 iPhone**（不是 Simulator）
4. 第一次需設定簽章：Target **RecipesJournal** → **Signing & Capabilities** → 選你的 Apple ID Team
5. 在專案目錄執行：

**日常用手機使用（建議，不需開 Metro）：**

```bash
npm run ios:release
```

等同 `npm run ios:standalone`。會把 JavaScript 打包進 App，可離線開啟。

**開發除錯**（需 Mac 與 iPhone 同一 Wi‑Fi，且 Metro 在跑）：

```bash
npm run ios:device
```

若出現紅屏 `No script URL provided`，代表裝的是 Debug 版但手機連不到 Metro。請改跑 `npm run ios:release`，或在 Mac 先執行 `npx expo start --lan` 後重新安裝 Debug 版。

6. 若手機出現「未受信任的開發者」，到 **設定 → 一般 → VPN 與裝置管理** 信任你的開發者憑證

### 方式 B：模擬器測試

```bash
npm run ios
```

## 使用真實資料庫

- 登入畫面輸入 **Email + 密碼**（會自動註冊或登入 Supabase Auth）
- **不要點「Try demo mode」**，示範模式不會寫入資料庫
- 食譜、收藏會存到 Supabase，並依使用者帳號隔離（RLS）

## 常用指令

| 指令 | 說明 |
|------|------|
| `npm run prebuild` | 重新產生 `ios/`、`android/` 原生專案 |
| `npm run ios:release` / `ios:standalone` | Release 建置（內嵌 JS，手機可離線用） |
| `npm run ios:device` | Debug 建置（需 Metro，開發用） |
| `npm run android:device` | 建置並安裝到 Android 手機 |

## 注意

- `npm install` 會自動執行 `scripts/fix-async-storage-pod.js`，修正 iOS 原生建置相容性
- 若曾用 Expo Go 掃 QR Code，請改用手機主畫面上的 **Recipes Journal** App 圖示開啟
