package com.rslakra.iws.ecommerce.process;

import java.util.Arrays;

/**
 * Keeps in alphabetical order.
 *
 * @author Rohtash Lakra
 * @created 3/8/24 1:45 PM
 */
public enum Priority {
    BLOCKER,
    CRITICAL,
    HIGH,
    LOW,
    MAJOR,
    MEDIUM,
    MINOR,
    NORMAL,
    TRIVIAL,
    URGENT,
    ;

    /**
     * Returns the <code>Priority</code> for the provided <code>priority</code>  .
     *
     * @param priority
     * @return
     */
    public static Priority ofString(String priority) {
        return Arrays.stream(values())
            .filter(entry -> entry.name().equalsIgnoreCase(priority))
            .findFirst()
            .orElse(null);
    }
}
