using { RFQ } from '../db/schema';

service AdminService @(path:'/admin')
{
    annotate RFQItems with @restrict :
    [
        { grant : [ '*' ], to : [ 'ADMIN' ] }
    ];

    annotate RFQs with @restrict :
    [
        { grant : [ '*' ], to : [ 'ADMIN' ] }
    ];

    entity RFQs as
        projection on RFQ.RFQ {
           *,
            items as RFQItems 
        };

    entity RFQItems as
        projection on RFQ.RFQ_Item;

    entity Buyers as
        projection on RFQ.BUYER;

    entity Vendors as
        projection on RFQ.VENDOR;

    entity Suppliers as
        projection on RFQ.SUPPLIER;

    entity Quotations as
        projection on RFQ.QUOTATION;

    entity QuotationItems as
        projection on RFQ.QUOTATION_Item;

    entity History as
        projection on RFQ.HISTORY;

    entity UoMs as
        projection on RFQ.UoM;
}

service BuyerService @(path:'/buyer')
{
    annotate RFQs with @restrict :
    [
        { grant : [ '*' ], to : [ 'ADMIN' ] }
    ];

    entity RFQs as
        projection on RFQ.RFQ;

    entity RFQItems as
        projection on RFQ.RFQ_Item;

    entity Suppliers as
        projection on RFQ.SUPPLIER;

    entity Quotations as
        projection on RFQ.QUOTATION;

    entity QuotationItems as
        projection on RFQ.QUOTATION_Item;

    entity History as
        projection on RFQ.HISTORY;

    entity UoMs as
        projection on RFQ.UoM;

    entity Buyers as
        projection on RFQ.BUYER;

    entity Vendors as
        projection on RFQ.VENDOR;
}

service ReferenceService @(path:'/reference')
{
    @readonly
    entity UoMs as
        projection on RFQ.UoM;
}

service VendorService @(path:'/vendor')
{
    entity RFQs as
        projection on RFQ.RFQ;

    entity RFQItems as
        projection on RFQ.RFQ_Item;

    entity Quotations as
        projection on RFQ.QUOTATION;

    entity QuotationItems as
        projection on RFQ.QUOTATION_Item;

    entity Suppliers as
        projection on RFQ.SUPPLIER;

    entity History as
        projection on RFQ.HISTORY;

    entity UoMs as
        projection on RFQ.UoM;

    entity Vendors as
        projection on RFQ.VENDOR;
}
