export interface TwilioConfig {
  twilioSid: string;
  twilioToken: string;
  twilioFrom: string;
}

export interface SMSSendResult {
  success: boolean;
  gateway: 'twilio' | 'textbelt' | 'failed';
  message: string;
  error?: string;
}

/**
 * Sends a real SMS containing the OTP verification code to the target phone number.
 * Attempts to use Twilio if credentials are provided or present in environment.
 * Otherwise, falls back to the Textbelt public free-tier gateway.
 */
export async function sendSMSOTP(
  phoneNumber: string,
  otpCode: string,
  twilioConfig?: TwilioConfig
): Promise<SMSSendResult> {
  const messageBody = `HoverPay Secure Verification Key: ${otpCode}. Enter this to attest your ambient UPI Lite signature.`;

  // Standardize phone format if needed (simple check, e.g., ensure it has +)
  let formattedPhone = phoneNumber.trim();
  if (!formattedPhone.startsWith('+')) {
    // If it starts with a country code e.g. 91, add +
    if (formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`; // default to India country code
    } else {
      formattedPhone = `+${formattedPhone}`;
    }
  }

  // 1. Check for Twilio Credentials (provided config takes precedence, then environment)
  const sid = twilioConfig?.twilioSid || process.env.NEXT_PUBLIC_TWILIO_SID || "";
  const token = twilioConfig?.twilioToken || process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN || "";
  const from = twilioConfig?.twilioFrom || process.env.NEXT_PUBLIC_TWILIO_FROM_NUMBER || "";

  if (sid.trim() && token.trim() && from.trim()) {
    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
      
      const headers = new Headers();
      // Basic Auth: base64(AccountSid:AuthToken)
      headers.set('Authorization', 'Basic ' + btoa(`${sid.trim()}:${token.trim()}`));
      headers.set('Content-Type', 'application/x-www-form-urlencoded');

      const body = new URLSearchParams({
        To: formattedPhone,
        From: from.trim(),
        Body: messageBody
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: body.toString()
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          gateway: 'twilio',
          message: `SMS sent securely via Twilio (Message ID: ${data.sid})`
        };
      } else {
        return {
          success: false,
          gateway: 'failed',
          message: `Twilio Error: ${data.message || 'Unknown error'}`,
          error: data.code?.toString()
        };
      }
    } catch (e: any) {
      return {
        success: false,
        gateway: 'failed',
        message: `Twilio connection failed: ${e.message || e}`,
        error: e.toString()
      };
    }
  }

  // 2. Fall back to Textbelt free API
  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: messageBody,
        key: 'textbelt' // Textbelt public free testing key
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        gateway: 'textbelt',
        message: 'SMS sent via Textbelt free gateway'
      };
    } else {
      return {
        success: false,
        gateway: 'failed',
        message: `Textbelt Gateway Rate-Limited: ${data.error || 'IP quota reached'}`
      };
    }
  } catch (e: any) {
    return {
      success: false,
      gateway: 'failed',
      message: `Failed to connect to Textbelt public relay: ${e.message || e}`
    };
  }
}
