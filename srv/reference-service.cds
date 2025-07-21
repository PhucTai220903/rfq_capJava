using {RFQ} from '../db/schema';

service ReferenceService @(path: '/reference') {
    entity UoMs as projection on RFQ.UoM;

    function getUserRoles() returns array of String;
}
