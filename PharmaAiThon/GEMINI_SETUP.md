# Gemini API Setup Guide for Pharmatec

## Quick Setup (3 Steps)

### Step 1: Get Your API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key" (free tier available)
3. Copy your API key

### Step 2: Add API Key to Your App
Open `lib/services/gemini_service.dart` and replace:
```dart
static const String _apiKey = 'YOUR_GEMINI_API_KEY_HERE';
```

With your actual key:
```dart
static const String _apiKey = 'sk-xxxxxxxxxxxxxxxxxxxxx';
```

### Step 3: Install Dependencies
Run in terminal:
```bash
flutter pub get
```

## Features

✅ **Real AI Responses** - Gemini AI powers intelligent responses  
✅ **Context-Aware** - Understands Pharmatec features  
✅ **Chat History** - Maintains conversation context  
✅ **Error Handling** - Graceful fallback for API issues  
✅ **French Language** - Full French support  

## Usage

The chatbot automatically:
- Initializes Gemini when you open the Assistant
- Maintains chat context across messages
- Provides intelligent responses about Pharmatec features
- Handles errors gracefully

## API Limits (Free Tier)

- **Rate**: 60 requests/minute
- **Requests/day**: 1,500
- **Cost**: Free

## Security Best Practices

⚠️ **Important**: Don't commit your API key!

### Option 1: Environment Variables (Recommended)
```bash
export GEMINI_API_KEY='your_key_here'
```

### Option 2: Config File (For Development)
1. Create `lib/config/.env` (add to .gitignore)
2. Load with: `String apiKey = dotenv.env['GEMINI_API_KEY']!;`

### Option 3: Backend Server
- Send requests through your own backend server
- Server handles API key securely

## Troubleshooting

### Error: "Invalid API key"
- Double-check your API key in GeminiService
- Ensure no extra spaces or quotes

### Error: "Rate limit exceeded"
- Wait a few minutes
- Implement request queuing for production

### No response from Gemini
- Check internet connection
- Verify API key is active
- Check Gemini API status

## Testing

Test your setup in chatbot_screen.dart:
1. Open Assistant tab
2. Type a question like "What can this app do?"
3. You should get an AI-powered response

## Next Steps

- Customize system prompt in GeminiService
- Add image recognition with vision capabilities
- Implement multi-language support
- Add conversation persistence to local database
