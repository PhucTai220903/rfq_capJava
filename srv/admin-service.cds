using {RFQ} from '../db/schema';

service AdminService @(path: '/admin')@(requires: 'ADMIN') {
    annotate RFQItems with @restrict: [{
        grant: ['*'],
        to   : ['ADMIN']
    }];

    annotate RFQs with @restrict: [{
        grant: ['*'],
        to   : ['ADMIN']
    }];

    entity RFQs             as
        projection on RFQ.RFQ {
            *,
            items as RFQItems
        };

    entity RFQItems         as projection on RFQ.RFQ_Item;
    entity Buyers           as projection on RFQ.BUYER;
    entity Vendors          as projection on RFQ.VENDOR;
    entity Suppliers        as projection on RFQ.SUPPLIER;

    @cds.redirection.target
    entity Quotations       as projection on RFQ.QUOTATION;

    entity QuotationItems   as projection on RFQ.QUOTATION_Item;
    entity History          as projection on RFQ.HISTORY;
    entity UoMs             as projection on RFQ.UoM;

    entity VendorRFQs       as
        projection on RFQ.SUPPLIER {
            ID,
            supplier_id,
            invited_at,
            status,
            remarks,
            rfq_id.ID          as rfqId,
            rfq_id.title       as rfqTitle,
            rfq_id.description as rfqDescription,
            rfq_id.due_date    as dueDate,
            rfq_id.status      as rfqStatus,
            rfq_id.created_at  as rfqCreatedAt
        };

    entity QuotationDetails as
        projection on RFQ.QUOTATION {
            ID,
            submission_date,
            currency,
            status,
            total_amount,
            created_at,

            // Thông tin RFQ
            rfq_id.ID           as rfqId,
            rfq_id.title        as rfqTitle,
            rfq_id.description  as rfqDescription,
            rfq_id.due_date     as rfqDueDate,
            rfq_id.status       as rfqStatus,

            // Thông tin Vendor
            supplier_id.ID      as vendorId,
            supplier_id.name    as vendorName,
            supplier_id.email   as vendorEmail,
            supplier_id.country as vendorCountry,
            supplier_id.phone   as vendorPhone,
            supplier_id.status  as vendorStatus
        };
}
