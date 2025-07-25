using {RFQ} from '../db/schema';

service BuyerService @(path: '/buyer')@(requires: 'BUYER') {
    annotate RFQs with @restrict: [{
        grant: ['*'],
        to   : ['BUYER']
    }];

    entity RFQs           as projection on RFQ.RFQ;
    entity RFQItems       as projection on RFQ.RFQ_Item;
    entity Suppliers      as projection on RFQ.SUPPLIER;
    entity Quotations     as projection on RFQ.QUOTATION;
    entity QuotationItems as projection on RFQ.QUOTATION_Item;
    entity History        as projection on RFQ.HISTORY;
    entity UoMs           as projection on RFQ.UoM;
    entity Buyers         as projection on RFQ.BUYER;
    entity Vendors        as projection on RFQ.VENDOR;
}
