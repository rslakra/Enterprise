package com.rslakra.iws.ecommerce.framework.service.impl;

import com.rslakra.appsuite.spring.exception.InvalidRequestException;
import com.rslakra.iws.ecommerce.framework.persistence.ServiceOperation;
import com.rslakra.iws.ecommerce.framework.persistence.entity.Bucket;

import java.util.Objects;

/**
 * @author Rohtash Lakra
 * @created 3/15/24 1:07 PM
 */
public class BucketUpdateOperation extends AbstractEntityOperation<Bucket> {

    /**
     *
     */
    public BucketUpdateOperation() {
        super(ServiceOperation.UPDATE);
    }

    /**
     * Update the <code>bucket</code> object.
     *
     * @param bucket
     * @return
     */
    @Override
    public Bucket apply(Bucket bucket) {
        if (Objects.isNull(bucket)) {
            throw new InvalidRequestException();
        }

        // load the existing object from db
        Bucket oldBucket = new Bucket();
        oldBucket.setName(bucket.getName());

        // persist the changes

        return bucket;
    }
}
