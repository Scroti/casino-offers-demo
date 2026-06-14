package repository

import "encoding/json"

// nonNullJSON returns the given raw message, or a non-nil default when empty.
// Postgres JSONB columns reject SQL NULL when the column is NOT NULL.
func nonNullJSON(raw json.RawMessage, defaultLiteral string) json.RawMessage {
	if len(raw) == 0 {
		return json.RawMessage(defaultLiteral)
	}
	return raw
}
