export type DocsCodeTab = { value: string; label: string; code: string }

const KEY = 'pay_sk_...'

export function samplesCreatePayment(origin: string): DocsCodeTab[] {
  return [
    {
      value: 'curl',
      label: 'cURL',
      code: `curl -sS -X POST ${origin}/v1/payments \\
  -H "Authorization: Bearer ${KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{"amount":"299","client_reference":"order-1234"}'`,
    },
    {
      value: 'js',
      label: 'JavaScript',
      code: `const res = await fetch(\`${origin}/v1/payments\`, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ${KEY}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '299',
    client_reference: 'order-1234',
  }),
})
const data = await res.json()
if (!res.ok) throw new Error(data.error ?? res.statusText)
console.log(data)`,
    },
    {
      value: 'python',
      label: 'Python',
      code: `import requests

r = requests.post(
    "${origin}/v1/payments",
    headers={
        "Authorization": "Bearer ${KEY}",
        "Content-Type": "application/json",
    },
    json={"amount": "299", "client_reference": "order-1234"},
)
r.raise_for_status()
print(r.json())`,
    },
    {
      value: 'php',
      label: 'PHP',
      code: `<?php
$ch = curl_init('${origin}/v1/payments');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${KEY}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => '{"amount":"299","client_reference":"order-1234"}',
    CURLOPT_RETURNTRANSFER => true,
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo $body;`,
    },
    {
      value: 'go',
      label: 'Go',
      code: `package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

func main() {
	payload := map[string]string{
		"amount":             "299",
		"client_reference":   "order-1234",
	}
	b, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "${origin}/v1/payments", bytes.NewReader(b))
	req.Header.Set("Authorization", "Bearer ${KEY}")
	req.Header.Set("Content-Type", "application/json")
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	println(string(body))
}`,
    },
  ]
}

export function samplesGetPayment(origin: string): DocsCodeTab[] {
  return [
    {
      value: 'curl',
      label: 'cURL',
      code: `curl -sS "${origin}/v1/payments/<PAYMENT_UUID>" \\
  -H "Authorization: Bearer ${KEY}"`,
    },
    {
      value: 'js',
      label: 'JavaScript',
      code: `const id = '<PAYMENT_UUID>'
const res = await fetch(\`${origin}/v1/payments/\${id}\`, {
  headers: { Authorization: 'Bearer ${KEY}' },
})
const data = await res.json()
console.log(data)`,
    },
    {
      value: 'python',
      label: 'Python',
      code: `import requests

payment_id = "<PAYMENT_UUID>"
r = requests.get(
    f"${origin}/v1/payments/{payment_id}",
    headers={"Authorization": "Bearer ${KEY}"},
)
r.raise_for_status()
print(r.json())`,
    },
    {
      value: 'php',
      label: 'PHP',
      code: `<?php
$id = '<PAYMENT_UUID>';
$ch = curl_init('${origin}/v1/payments/' . $id);
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ${KEY}'],
    CURLOPT_RETURNTRANSFER => true,
]);
echo curl_exec($ch);
curl_close($ch);`,
    },
    {
      value: 'go',
      label: 'Go',
      code: `package main

import (
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("GET", "${origin}/v1/payments/<PAYMENT_UUID>", nil)
	req.Header.Set("Authorization", "Bearer ${KEY}")
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	println(string(body))
}`,
    },
  ]
}

export function samplesCancelPayment(origin: string): DocsCodeTab[] {
  return [
    {
      value: 'curl',
      label: 'cURL',
      code: `curl -sS -X POST "${origin}/v1/payments/<PAYMENT_UUID>/cancel" \\
  -H "Authorization: Bearer ${KEY}"`,
    },
    {
      value: 'js',
      label: 'JavaScript',
      code: `const id = '<PAYMENT_UUID>'
const res = await fetch(\`${origin}/v1/payments/\${id}/cancel\`, {
  method: 'POST',
  headers: { Authorization: 'Bearer ${KEY}' },
})
const data = await res.json()
console.log(data)`,
    },
    {
      value: 'python',
      label: 'Python',
      code: `import requests

payment_id = "<PAYMENT_UUID>"
r = requests.post(
    f"${origin}/v1/payments/{payment_id}/cancel",
    headers={"Authorization": "Bearer ${KEY}"},
)
r.raise_for_status()
print(r.json())`,
    },
    {
      value: 'php',
      label: 'PHP',
      code: `<?php
$id = '<PAYMENT_UUID>';
$ch = curl_init('${origin}/v1/payments/' . $id . '/cancel');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ${KEY}'],
    CURLOPT_RETURNTRANSFER => true,
]);
echo curl_exec($ch);
curl_close($ch);`,
    },
    {
      value: 'go',
      label: 'Go',
      code: `package main

import (
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("POST", "${origin}/v1/payments/<PAYMENT_UUID>/cancel", nil)
	req.Header.Set("Authorization", "Bearer ${KEY}")
	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	println(string(body))
}`,
    },
  ]
}

export function samplesVerifyWebhook(): DocsCodeTab[] {
  return [
    {
      value: 'node',
      label: 'Node.js',
      code: `import crypto from 'crypto'

export function verifyPayWebhook(rawBody, timestampHeader, signatureHex, secret) {
  const msg = \`\${timestampHeader}.\${rawBody}\`
  const mac = crypto.createHmac('sha256', secret).update(msg, 'utf8').digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(signatureHex, 'hex'))
  } catch {
    return false
  }
}`,
    },
    {
      value: 'python',
      label: 'Python',
      code: `import hmac
import hashlib

def verify_pay_webhook(raw_body: str, ts: str, sig_hex: str, secret: str) -> bool:
    msg = f"{ts}.{raw_body}"
    mac = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, sig_hex)`,
    },
    {
      value: 'php',
      label: 'PHP',
      code: `<?php
function verify_pay_webhook(string $rawBody, string $ts, string $sigHex, string $secret): bool {
    $msg = $ts . '.' . $rawBody;
    $mac = hash_hmac('sha256', $msg, $secret);
    return hash_equals($mac, $sigHex);
}`,
    },
    {
      value: 'go',
      label: 'Go',
      code: `package payhook

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

func Verify(rawBody, ts, sigHex, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(ts + "." + rawBody))
	want := mac.Sum(nil)
	got, err := hex.DecodeString(sigHex)
	if err != nil || len(got) != len(want) {
		return false
	}
	return hmac.Equal(want, got)
}`,
    },
    {
      value: 'rust',
      label: 'Rust',
      code: `use hex;
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

pub fn verify(raw_body: &str, ts: &str, sig_hex: &str, secret: &str) -> bool {
    let mut mac = match HmacSha256::new_from_slice(secret.as_bytes()) {
        Ok(m) => m,
        Err(_) => return false,
    };
    mac.update(format!("{ts}.{raw_body}").as_bytes());
    let expected = hex::encode(mac.finalize().into_bytes());
    expected == sig_hex
}`,
    },
  ]
}
