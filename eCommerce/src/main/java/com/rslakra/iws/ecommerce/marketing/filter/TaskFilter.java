package com.rslakra.iws.ecommerce.marketing.filter;

import com.rslakra.appsuite.spring.filter.AbstractFilter;
import com.rslakra.iws.ecommerce.task.persistence.entity.Task;

import java.util.Map;

/**
 * @author Rohtash Lakra
 * @created 2/8/23 1:06 PM
 */
public final class TaskFilter extends AbstractFilter<Task> {


    public static final String ID = "id";
    public static final String TITLE = "title";
    public static final String PRIORITY = "priority";
    public static final String DESCRIPTION = "description";
    public static final String USER_ID = "userId";

    /**
     * @param allParams
     */
    public TaskFilter(Map<String, Object> allParams) {
        super(allParams);
    }

}
