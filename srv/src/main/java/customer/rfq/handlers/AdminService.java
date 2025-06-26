package customer.rfq.handlers;

import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;

import java.time.Instant;

@Component
@ServiceName("AdminService")
public class AdminService implements EventHandler {

    private final Messages messages;

    public AdminService(Messages messages) {
        this.messages = messages;
    }

    // Before creating RFQ - Add created_at timestamp and validation
    @Before(event = "CREATE", entity = "RFQs")
    public void beforeCreateRFQ(CdsCreateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            entry.put("created_at", Instant.now());
            
            // Validate required fields
            if (entry.get("title") == null || entry.get("title").toString().trim().isEmpty()) {
                messages.error("RFQ title is required");
            }
            
            if (entry.get("due_date") == null) {
                messages.error("RFQ due date is required");
            }
            
            // Set default status if not provided
            if (entry.get("status") == null) {
                entry.put("status", "A"); // Active status
            }
        });
    }

    // Before updating RFQ - Add validation
    @Before(event = "UPDATE", entity = "RFQs")
    public void beforeUpdateRFQ(CdsUpdateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            // Validate title if being updated
            if (entry.containsKey("title") && 
                (entry.get("title") == null || entry.get("title").toString().trim().isEmpty())) {
                messages.error("RFQ title cannot be empty");
            }
        });
    }

    // After reading RFQ - Add computed fields
    @After(event = "READ", entity = "RFQs")
    public void afterReadRFQ(CdsReadEventContext context) {
        context.getResult().forEach(rfq -> {
            // Add computed field for status description
            String status = rfq.get("status") != null ? rfq.get("status").toString() : null;
            String statusText = getStatusDescription(status);
            rfq.put("statusText", statusText);
        });
    }

    // Before creating Quotation - Add validation and timestamps
    @Before(event = "CREATE", entity = "Quotations")
    public void beforeCreateQuotation(CdsCreateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            entry.put("created_at", Instant.now());
            entry.put("submission_date", Instant.now());
            
            // Validate required fields
            if (entry.get("rfq_id_ID") == null) {
                messages.error("RFQ ID is required for quotation");
            }
            
            if (entry.get("supplier_id_ID") == null) {
                messages.error("Supplier ID is required for quotation");
            }
            
            // Set default status
            if (entry.get("status") == null) {
                entry.put("status", "A"); // Active
            }
            
            // Set default currency if not provided
            if (entry.get("currency_code") == null) {
                entry.put("currency_code", "USD");
            }
        });
    }

    // After reading Quotations - Add computed fields
    @After(event = "READ", entity = "Quotations")
    public void afterReadQuotation(CdsReadEventContext context) {
        context.getResult().forEach(quotation -> {
            // Add status description
            String status = quotation.get("status") != null ? quotation.get("status").toString() : null;
            String statusText = getStatusDescription(status);
            quotation.put("statusText", statusText);
        });
    }

    // Before creating Buyer - Add timestamps
    @Before(event = "CREATE", entity = "Buyers")
    public void beforeCreateBuyer(CdsCreateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            entry.put("created_at", Instant.now());
            
            // Validate email
            String email = entry.get("email") != null ? entry.get("email").toString() : null;
            if (email == null || !email.contains("@")) {
                messages.error("Valid email is required");
            }
            
            // Set default status
            if (entry.get("status") == null) {
                entry.put("status", "A");
            }
        });
    }

    // Before creating Vendor - Add timestamps
    @Before(event = "CREATE", entity = "Vendors")
    public void beforeCreateVendor(CdsCreateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            entry.put("created_at", Instant.now());
            
            // Validate email
            String email = entry.get("email") != null ? entry.get("email").toString() : null;
            if (email == null || !email.contains("@")) {
                messages.error("Valid email is required");
            }
            
            // Set default status
            if (entry.get("status") == null) {
                entry.put("status", "A");
            }
        });
    }

    // Before creating Supplier relation - Add timestamps
    @Before(event = "CREATE", entity = "Suppliers")
    public void beforeCreateSupplier(CdsCreateEventContext context) {
        context.getCqn().entries().forEach(entry -> {
            entry.put("invited_at", Instant.now());
            
            // Set default status
            if (entry.get("status") == null) {
                entry.put("status", "A");
            }
        });
    }

    // Helper method to get status description
    private String getStatusDescription(String status) {
        if (status == null) return "Unknown";
        
        switch (status) {
            case "A":
                return "Active";
            case "I":
                return "Inactive";
            case "P":
                return "Pending";
            default:
                return "Unknown";
        }
    }
}
