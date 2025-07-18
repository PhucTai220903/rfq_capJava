using {RFQ} from '../db/schema';

service VendorService @(path: '/vendor') {
    entity RFQs           as projection on RFQ.RFQ;
    entity RFQItems       as projection on RFQ.RFQ_Item;
    entity Quotations     as projection on RFQ.QUOTATION;
    entity QuotationItems as projection on RFQ.QUOTATION_Item;
    entity Suppliers      as projection on RFQ.SUPPLIER;
    entity History        as projection on RFQ.HISTORY;
    entity UoMs           as projection on RFQ.UoM;
    entity Vendors        as projection on RFQ.VENDOR;
}
