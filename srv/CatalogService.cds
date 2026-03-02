using { anubhav.db.master, anubhav.db.transaction } from '../db/datamodel';

service CatalogService @(path: 'CatalogService') {

    //OData Entity - which offers FREE - CURDQ
    entity EmployeeSet as projection on master.employees;
    entity BusinessPartnerSet as projection on master.businesspartner;
    entity ProductSet as projection on master.product;
    entity AddressSet as projection on master.address;
    entity StatusCode as projection on master.StatusCode;
    entity PurchaseOrderSet @(odata.draft.enabled: true,
                              Common.DefaultValuesFunction: 'getSanaValues' ) as projection on transaction.purchaseorder{
        *,
        case OVERALL_STATUS
            when 'P' then 'Pending'
            when 'N' then 'New'
            when 'A' then 'Approved'
            when 'X' then 'Rejected'
            when 'D' then 'Delivered'
            else 'Unknown' end as OverallStatus : String(10),
        case OVERALL_STATUS
            when 'P' then 2
            when 'N' then 2
            when 'A' then 3
            when 'X' then 1
            when 'D' then 3
            else 3 end as IconColor: Integer
    }
    actions{
        //instance bound action hence i am entitled to get PO primary key as input automatically
        action boost() returns PurchaseOrderSet;
        @cds.odata.bindingparameter.name: '_anubhav'
        @Common.SideEffects :{
            TargetProperties: ['_anubhav/OVERALL_STATUS']
        }
        action setOrderProcessing() returns PurchaseOrderSet;
    };
    entity PurchaseItemSet as projection on transaction.poitems;
    function getSanaValues() returns PurchaseOrderSet;
    function getLargestOrder() returns array of PurchaseOrderSet;

}
