package com.rslakra.iws.ecommerce.process;

import java.util.Arrays;

/**
 * Keeps in alphabetical order.
 *
 * @author Rohtash Lakra
 * @created 3/8/24 1:43 PM
 */
public enum Severity {
    BLOCKER,
    CRITICAL,
    MAJOR,
    MINOR,
    NORMAL,
    TRIVIAL,
    ;

    /**
     * Returns the <code>Severity</code> for the provided <code>severity</code>  .
     *
     * @param severity
     * @return
     */
    public static Severity ofString(String severity) {
        return Arrays.stream(values())
            .filter(entry -> entry.name().equalsIgnoreCase(severity))
            .findFirst()
            .orElse(null);
    }
}
