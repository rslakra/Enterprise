package com.rslakra.iws.ecommerce.framework.service.impl;

import com.rslakra.appsuite.spring.persistence.entity.AbstractEntity;
import com.rslakra.iws.ecommerce.framework.persistence.ServiceOperation;
import com.rslakra.iws.ecommerce.framework.service.EntityOperation;

/**
 * @author Rohtash Lakra
 * @created 3/15/24 12:57 PM
 */
public abstract class AbstractEntityOperation<T extends AbstractEntity> implements EntityOperation<T> {

    private final ServiceOperation serviceOperation;

    /**
     * @param serviceOperation
     */
    public AbstractEntityOperation(ServiceOperation serviceOperation) {
        this.serviceOperation = serviceOperation;
    }

    /**
     * @return
     */
    @Override
    public ServiceOperation getOperation() {
        return serviceOperation;
    }
}
