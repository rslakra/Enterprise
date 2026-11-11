package com.rslakra.iws.ecommerce.account.filter;

import com.rslakra.appsuite.spring.filter.DefaultFilter;
import com.rslakra.iws.ecommerce.account.persistence.entity.User;

import java.util.Map;

/**
 * @author Rohtash Lakra
 * @created 2/8/23 1:06 PM
 */
public final class UserFilter extends DefaultFilter<User> {

    /**
     * @param allParams
     */
    public UserFilter(Map<String, Object> allParams) {
        super(allParams);
    }
}
