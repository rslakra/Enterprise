"""Transaction type identifiers for payment ledger entries."""

from enum import Enum, auto


class TransactionType(Enum):
    """Direction and purpose of a payment or ledger movement."""

    DEBIT = auto()       # Money out — reduces the account balance
    CREDIT = auto()      # Money in — increases the account balance
    TRANSFER = auto()    # Move funds between two accounts (internal)
    WITHDRAWAL = auto()  # Cash or funds pulled out to an external destination
    DEPOSIT = auto()     # Cash or funds added from an external source
    PAYMENT = auto()     # Outbound payment to a merchant or payee
    RECEIPT = auto()     # Inbound payment received from a payer
    OTHER = auto()       # Fallback when no specific type applies

    @classmethod
    def from_string(cls, value: str) -> "TransactionType":
        """Parse a string into a member (case-insensitive; spaces/hyphens → underscores)."""
        normalized = value.strip().upper().replace(" ", "_").replace("-", "_")
        try:
            return cls[normalized]
        except KeyError:
            raise ValueError(f"Invalid transaction type: {value!r}") from None
