package com.rslakra.iws.bo.common;

import com.rslakra.iws.bo.finance.ClaimType;

import java.util.Set;

public enum UncoveredClaimType {
    
    AUTO_RENTAL_CLAIM(ClaimType.AUTO_RENTAL_COVERAGE,
            Set.of("Any Obligation Assumed Under Agreement",
                    "Any Violation of Rental Agreement or Terms of Benefits",
                    "Injury of Anyone (including You) or  Damage to Anything (inside or outside) Vehicle",
                    "Lost or Theft of Personal Belongings",
                    "Personal Liability"
            )
    ),
    BAGGAGE_DELAY_CLAIM(ClaimType.BAGGAGE_DELAY_INSURANCE,
            Set.of("Hearing Aids",
                    "Artificial Teeth, Dental bridges or Prosthetic Devices",
                    "Tickets, Documents, Money, Securities, Checks",
                    "Business Samples",
                    "Jewelry and Watches"
            )
    ),
    EXTENDED_WARRANTY_CLAIM(ClaimType.EXTENDED_WARRANTY_PROTECTION,
            Set.of("Boats, Automobiles, Aircraft",
                    "Rented or Leased Items",
                    "Computer Software",
                    "Medical Equipment",
                    "Used or Pre-owned Items"
            )
    ),
    LOST_LUGGAGE_CLAIM(ClaimType.LOST_LUGGAGE_REIMBURSEMENT,
            Set.of("Items Removed from Carry-On Baggage",
                    "Documents or valuable papers",
                    "Money",
                    "Securities",
                    "Tickets",
                    "Checks",
                    "Traveler's Check",
                    "Furs"
            )
    ),
    PURCHASE_PROTECTION_CLAIM(ClaimType.PURCHASE_PROTECTION,
            Set.of("Living Animals and Plants",
                    "Antiques or collectible Items",
                    "Money",
                    "Boats, Automobiles, Aircraft",
                    "Computer Software",
                    "Items Purchased for Resale",
                    "Medical Equipment"
            )
    ),
    ROADSIDE_ASSISTANCE_CLAIM(ClaimType.ROADSIDE_ASSISTANCE,
            Set.of()
    ),
    TRAVEL_ACCIDENT_CLAIM(ClaimType.TRAVEL_ACCIDENT_INSURANCE,
            Set.of("Entering, or Existing Aircraft",
                    "Emotional Trauma, Mental or Physical Illness, Disease etc.",
                    "Any occurrence while incarcerated",
                    "Suicide, attempted suicide"
            )
    ),
    TRAVEL_EMERGENCY_CLAIM(ClaimType.TRAVEL_EMERGENCY_ASSISTANCE,
            Set.of()
    ),
    TRIP_CANCELLATION_INTERRUPTION_CLAIM(ClaimType.TRIP_CANCELLATION_INTERRUPTION_INSURANCE,
            Set.of("A change in plans, financial circumstances",
                    "A Pre-existing condition"
            )
    ),
    ADDITIONAL_TERMS_CLAIM(ClaimType.ADDITIONAL_TERMS,
            Set.of()
    ),
    ;
    
    private ClaimType claimType;
    private Set<String> notCovered;
    
    /**
     * @param claimType
     * @param notCovered
     */
    UncoveredClaimType(ClaimType claimType, Set<String> notCovered) {
        this.claimType = claimType;
        this.notCovered = notCovered;
    }
    
}
