package com.rslakra.iws.ecommerce.framework.service;

import com.rslakra.appsuite.spring.persistence.entity.AbstractEntity;
import com.rslakra.iws.ecommerce.framework.persistence.ServiceOperation;

/**
 *
 * @author Rohtash Lakra
 * @created 3/15/24 12:53 PM
 */
public interface EntityOperation<T extends AbstractEntity> {

    ServiceOperation getOperation();

    T apply(T t);
}