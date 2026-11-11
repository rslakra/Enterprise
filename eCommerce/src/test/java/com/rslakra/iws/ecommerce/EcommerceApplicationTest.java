package com.rslakra.iws.ecommerce;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author Rohtash Lakra
 * @created 5/25/22 4:43 PM
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnableAutoConfiguration(exclude = {SecurityAutoConfiguration.class})
public class EcommerceApplicationTest {

    @LocalServerPort
    private int localServerPort;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void shouldReturn200WhenSendingRequestToController() throws Exception {
        ResponseEntity<String> entity =
            this.testRestTemplate.getForEntity("http://localhost:" + this.localServerPort + "/", String.class);
        assertNotNull(entity);
        // The home page returns HTML, check it's OK or redirected
        assertTrue(entity.getStatusCode().is2xxSuccessful() || entity.getStatusCode().is3xxRedirection(),
            "Expected 2xx or 3xx but got: " + entity.getStatusCode());
    }

    @Test
    public void shouldReturn200WhenSendingRequestToRestEndpoint() throws Exception {
        ResponseEntity<String> entity =
            this.testRestTemplate.getForEntity("http://localhost:" + this.localServerPort + "/rest/roles", String.class);
        assertNotNull(entity);
        assertEquals(HttpStatus.OK, entity.getStatusCode());
    }
}

