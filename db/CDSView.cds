using { anubhav.db.master, anubhav.db.transaction } from './datamodel';

context CDSView {
    
    define view![POWorklist] as
        select from transaction.purchaseorder{
            key PO_ID as![PurchaseOrderId],
            key Items.PO_ITEM_POS as![ItemPosition],
            PARTNER_GUID.BP_ID as![SupplierId],
            PARTNER_GUID.COMPANY_NAME as![SupplierName],
            GROSS_AMOUNT as![GrossAmount],
            NET_AMOUNT as![NetAmount],
            TAX_AMOUNT as![TaxAmount],
            OVERALL_STATUS as![OrderStatus],
            Items.PRODUCT_GUID.PRODUCT_ID as![ProductId],
            Items.PRODUCT_GUID.DESCRIPTION as![ProductName],
            PARTNER_GUID.ADDRESS_GUID.COUNTRY as![Country]
        };

    define view![ItemView] as 
        select from transaction.poitems{
            PARENT_KEY.PARTNER_GUID.NODE_KEY as![SupplierId],
            PRODUCT_GUID.NODE_KEY as![ProductId],
            CURRENCY as![Currency],
            GROSS_AMOUNT as![GrossAmount],
            NET_AMOUNT as![NetAmount],
            TAX_AMOUNT as![TaxAmount],
            PARENT_KEY.OVERALL_STATUS as![Status]
        };

    //View on View - Lazy loading OR on-demand Join - good for performance when you create Fiori App   
    define view ProductView as select from master.product
    //Mixin is a keyword in CAP to define lose coupling
    //which will never load the items data upfront,when user select a product thats when the join applies
    mixin{
        PO_ORDER: Association[*] to ItemView on PO_ORDER.ProductId = NODE_KEY
    } into {
        NODE_KEY as![ProductId],
        DESCRIPTION as![Description],
        CATEGORY as![Category],
        PRICE as![Cost],
        SUPPLIER_GUID.BP_ID as![SupplierId],
        SUPPLIER_GUID.COMPANY_NAME as![SupplierName],
        SUPPLIER_GUID.ADDRESS_GUID.COUNTRY as![Country],
        //Exposed association, @Runtime the data of items can be loaded ondemand
        PO_ORDER as![To_Items]
    };

    //How can we use views to aggregate data
    define view CProductPurchases as 
        select from ProductView{
            ProductId,
            Country,
            round(sum(To_Items.GrossAmount),2) as![TotalAmount],
            To_Items.Currency 
        } group by ProductId,
            Country, To_Items.Currency ;

}
