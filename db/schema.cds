namespace RFQ;

using { Currency } from '@sap/cds/common';

using { sap.common.CodeList } from '@sap/cds/common';

entity UoM : CodeList
{
    key code : String(3);
    description : localized String(100);
}

entity BUYER
{
    key ID : UUID;
    created_at : DateTime;
    name : String(100);
    email : String(100);
    role : Role;
    status : Status;
    country : String(100);
}

entity RFQ
{
    key ID : UUID;
    created_at : DateTime;
    title : String(100);
    description : String(100);
    due_date : DateTime;
    status : Status;
    created_by : Association to one BUYER;
    items : Composition of many RFQ_Item on items.frq_id = $self;
}

entity RFQ_Item
{
    key ID : UUID;
    frq_id : Association to one RFQ;
    material_code : String(50);
    description : String(50);
    due_date : DateTime;
    quantity : Decimal(18,2);
    unit_of_measure : Association to one UoM;
}

entity VENDOR
{
    key ID : UUID;
    created_at : DateTime;
    name : String(100);
    email : String(100);
    role : Role;
    status : Status;
    country : String(100);
}

entity SUPPLIER
{
    key ID : UUID;
    rfq_id : Association to one RFQ;
    supplier_id : Association to one VENDOR;
    invited_at : Timestamp;
    status : Status;
    remarks : String(100);
}

entity QUOTATION
{
    key ID : UUID;
    rfq_id : Association to one RFQ;
    supplier_id : Association to one VENDOR;
    submission_date : Timestamp;
    currency : Currency;
    status : Status;
    total_amount : String(100);
    created_at : Timestamp;
}

entity QUOTATION_Item
{
    key ID : UUID;
    quotation_id : Association to one QUOTATION;
    item_id : Association to one RFQ_Item;
    unit_price : Decimal(18,4);
    quantity : Decimal(18,4);
    line_total : Decimal(18,4);
    currency : Currency;
    notes : String(500);
}

entity HISTORY
{
    key ID : UUID;
    quotation_id : Association to one QUOTATION;
    modified_at : Timestamp;
    modified_by : Association to one VENDOR;
    change_log : String(500);
}

type Role : String enum
{
    ADMIN = 'A';
    BUYER = 'B';
    VENDOR = 'V';
}

type Status : String enum
{
    ACTIVE = 'A';
    INACTIVE = 'I';
    PENDING = 'P';
}
