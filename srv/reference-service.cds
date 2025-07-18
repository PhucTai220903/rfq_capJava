using {RFQ} from '../db/schema';

service ReferenceService @(path: '/reference') {
    @readonly
    entity UoMs as projection on RFQ.UoM;
}
