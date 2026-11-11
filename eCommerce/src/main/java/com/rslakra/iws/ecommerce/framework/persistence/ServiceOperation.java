package com.rslakra.iws.ecommerce.framework.persistence;

/**
 * The first reference to CRUD operations came from Haim Kilov in 1990 in an article titled, “From semantic to
 * object-oriented data modeling.” However, the term was first made popular by James Martin’s 1983 book, Managing the
 * Data-base Environment.
 *
 * <p>
 * Here’s a breakdown:
 * <pre>
 *  CREATE: Performs the INSERT statement to create a new record in SQL databases.
 *  READ: Reads the table records based on the primary keynoted within the input parameter.
 *  UPDATE: Executes an UPDATE statement on the table based on the specified primary key for a record within the WHERE
 *   clause of the statement.
 *  DELETE: Deletes a specified row in the WHERE clause.
 * </pre>
 *
 * <url>https://www.objectdb.com/java/jpa/persistence/retrieve</url>
 *
 * @author Rohtash Lakra
 * @created 8/4/21 6:12 PM
 */
public enum ServiceOperation {

    /* Performs the INSERT statement to create a new record in SQL databases. */
    CREATE,

    /* Deletes a specified row in the WHERE clause. */
    DELETE,

    /* Reads the table records based on the primary keynoted within the input parameter. */
    READ,

    /*
     * Executes an UPDATE statement on the table based on the specified primary key for a record within the WHERE clause
     * of the statement.
     */
    UPDATE;
}
