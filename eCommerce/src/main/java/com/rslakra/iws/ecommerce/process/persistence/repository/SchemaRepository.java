package com.rslakra.iws.ecommerce.process.persistence.repository;

import com.rslakra.appsuite.spring.persistence.repository.BaseRepository;
import com.rslakra.iws.ecommerce.process.persistence.entity.Schema;
import org.springframework.stereotype.Repository;

/**
 * @author Rohtash Lakra
 * @created 2/7/23 2:25 PM
 */
@Repository
public interface SchemaRepository extends BaseRepository<Schema, Long> {

}
