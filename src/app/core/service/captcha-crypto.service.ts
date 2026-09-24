import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CaptchaCryptoService {

    private readonly ENCRYPTION_PASSPHRASE = 'passkey';


    public async getCryptoKey(): Promise<CryptoKey> {
        const enc = new TextEncoder().encode(this.ENCRYPTION_PASSPHRASE);
        const digest = await crypto.subtle.digest('SHA-256', enc); // 32 bytes -> AES-256
        return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
    }

    public async encryptState(plainText: string): Promise<string> {
        const key = await this.getCryptoKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cipherBuf = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            new TextEncoder().encode(plainText)
        );

        const combined = new Uint8Array(iv.length + cipherBuf.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(cipherBuf), iv.length);

        let binary = '';
        combined.forEach(b => binary += String.fromCharCode(b));
        return btoa(binary);
    }

    public async decryptState(stored: string): Promise<string> {
        const key = await this.getCryptoKey();
        const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
        const iv = combined.slice(0, 12);
        const cipherBytes = combined.slice(12);

        const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBytes);
        return new TextDecoder().decode(plainBuf);
    }
}