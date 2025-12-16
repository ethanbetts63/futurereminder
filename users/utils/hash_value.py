import hashlib
import hmac

def hash_pii(value: str, salt: str) -> str:
    """
    Creates a secure, salted hash (HMAC-SHA256) of a given string value.

    This is used to anonymize personally identifiable information (PII) before
    storing it for long-term audit purposes.

    Args:
        value: The string to be hashed (e.g., an email address).
        salt: A secret key to use for the HMAC process.

    Returns:
        A hex-encoded string of the hash.
    """
    if not isinstance(value, str) or not isinstance(salt, str):
        return ""
        
    value_bytes = value.encode('utf-8')
    salt_bytes = salt.encode('utf-8')
    
    hashed_value = hmac.new(salt_bytes, value_bytes, hashlib.sha256)
    
    return hashed_value.hexdigest()
