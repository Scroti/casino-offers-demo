package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
)

// RandomHex returns a cryptographically random hex string of length 2*n.
func RandomHex(n int) (string, error) {
	buf := make([]byte, n)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

// RandomDigits returns a numeric code of length n (e.g. "428193").
func RandomDigits(n int) (string, error) {
	out := make([]byte, n)
	max := big.NewInt(10)
	for i := 0; i < n; i++ {
		x, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}
		out[i] = '0' + byte(x.Int64())
	}
	return string(out), nil
}

// Hash returns a hex sha256 of the input. Used for refresh-token storage so
// we can revoke specific sessions without keeping plaintext tokens in the DB.
func Hash(s string) string {
	h := sha256.Sum256([]byte(s))
	return fmt.Sprintf("%x", h)
}
