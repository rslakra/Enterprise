package com.rslakra.iws.ecommerce.project.persistence.entity;

import java.util.Arrays;

/**
 * @author Rohtash Lakra
 * @created 3/8/24 1:51 PM
 */
public enum Category {

    OTHER,
    NONE,
    ;

    /**
     * Returns the <code>Category</code> for the provided <code>category</code>  .
     *
     * @param category
     * @return
     */
    public static Category ofString(String category) {
        return Arrays.stream(values())
            .filter(entry -> entry.name().equalsIgnoreCase(category))
            .findFirst()
            .orElse(null);
    }

}
