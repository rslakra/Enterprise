"""Card network / brand identifiers for card-present and card-not-present payments."""

from enum import Enum, auto


class CardType(Enum):
    """Payment card network or brand (BIN/IIN scheme family)."""

    VISA = auto()              # Visa Inc.
    MASTERCARD = auto()        # Mastercard International
    AMERICAN_EXPRESS = auto()  # American Express (often abbreviated AMEX)
    DISCOVER = auto()          # Discover Financial Services
    DINERS_CLUB = auto()       # Diners Club International
    JCB = auto()               # Japan Credit Bureau
    UNIONPAY = auto()          # China UnionPay
    MAESTRO = auto()           # Maestro (Mastercard debit)
    MIR = auto()               # Mir (National Payment Card System, Russia)
    RUPAY = auto()             # RuPay (National Payments Corporation of India)
    OTHER = auto()             # Unknown or unsupported network

    @classmethod
    def from_string(cls, value: str) -> "CardType":
        """Parse a string into a member (case-insensitive; spaces/hyphens → underscores)."""
        normalized = value.strip().upper().replace(" ", "_").replace("-", "_")
        # Common alias used in APIs and UI labels
        if normalized == "AMEX":
            normalized = "AMERICAN_EXPRESS"
        try:
            return cls[normalized]
        except KeyError:
            raise ValueError(f"Invalid card type: {value!r}") from None
