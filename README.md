# Recipes Journal

Mobile recipe journal app built with Expo + Expo Router + Supabase.

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env vars:
   - `cp .env.example .env`
3. Fill in Supabase keys in `.env`.
4. Run:
   - `npm run start`

## Notes

- Includes onboarding, calendar home, recipes, ideas, favorites, profile, recipe detail, and edit mode.
- Uses fallback in-memory data when Supabase keys are missing.
