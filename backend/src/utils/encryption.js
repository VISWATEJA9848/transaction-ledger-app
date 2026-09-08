const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

function getKey() {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        throw new Error("ENCRYPTION_KEY is missing from .env");
    }

    const buffer = Buffer.from(key, "hex");

    if (buffer.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)");
    }

    return buffer;
}

function encrypt(text) {
    if (text === null || text === undefined) {
        return text;
    }

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        getKey(),
        iv
    );

    let encrypted = cipher.update(String(text), "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex")
    };
}

function decrypt(data) {
    if (!data) {
        return data;
    }

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        getKey(),
        Buffer.from(data.iv, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(data.authTag, "hex")
    );

    let decrypted = decipher.update(
        data.encrypted,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};