  const cds = require('@sap/cds')

  module.exports = class CatalogService extends cds.ApplicationService { init() {

    const { EmployeeSet, BusinessPartnerSet, AddressSet, ProductSet, PurchaseOrderSet, PurchaseItemSet } = cds.entities('CatalogService')

    this.before (['CREATE', 'UPDATE'], EmployeeSet, async (req) => {
      //console.log('Before CREATE/UPDATE EmployeeSet', req.data)

      //get the data which was sent by user
      const salary = req.data.salaryAmount;
      if(salary > 1000000){
        //raise an exception - contaminate the incoming request
        req.error(500, "Dude, No one allowed a million salary");
      }


    })
    this.after ('READ', EmployeeSet, async (employeeSet, req) => {
      console.log('After READ EmployeeSet', employeeSet)
    })
    this.before (['CREATE', 'UPDATE'], BusinessPartnerSet, async (req) => {
      console.log('Before CREATE/UPDATE BusinessPartnerSet', req.data)
    })
    this.after ('READ', BusinessPartnerSet, async (businessPartnerSet, req) => {
      console.log('After READ BusinessPartnerSet', businessPartnerSet)
    })
    this.before (['CREATE', 'UPDATE'], AddressSet, async (req) => {
      console.log('Before CREATE/UPDATE AddressSet', req.data)
    })
    this.after ('READ', AddressSet, async (addressSet, req) => {
      console.log('After READ AddressSet', addressSet)
    })
    this.before (['CREATE', 'UPDATE'], ProductSet, async (req) => {
      console.log('Before CREATE/UPDATE ProductSet', req.data)
    })
    this.after ('READ', ProductSet, async (productSet, req) => {
      console.log('After READ ProductSet', productSet)
    })
    this.before (['CREATE', 'UPDATE'], PurchaseOrderSet, async (req) => {
      console.log('Before CREATE/UPDATE PurchaseOrderSet', req.data)
    })
    this.after ('READ', PurchaseOrderSet, async (purchaseOrderSet, req) => {
      //console.log('After READ PurchaseOrderSet', purchaseOrderSet)

      for (let i = 0; i < purchaseOrderSet.length; i++) {
        const element = purchaseOrderSet[i];
        if(!element.NOTE){
          element.NOTE = 'No Note Found!';
        }
      }

    })
    this.before (['CREATE', 'UPDATE'], PurchaseItemSet, async (req) => {
      console.log('Before CREATE/UPDATE PurchaseItemSet', req.data)
    })
    this.after ('READ', PurchaseItemSet, async (purchaseItemSet, req) => {
      console.log('After READ PurchaseItemSet', purchaseItemSet)
    })

    this.on('boost', async(req) => {
      
      try {
        //also get the key
        const ID = req.params[0]; //{NODE_KEY : 'JIUJI54154454DCUI'}
        //CDS Query Language - to perform all db operations
        var tx = cds.tx(req);
        //fire update on DB  -- UPDATE INTO tab USING .... WHERE key
        await tx.update(PurchaseOrderSet).with({
          GROSS_AMOUNT: {'+=' : 20000},
          NOTE: 'Boosted!!'
        }).where(ID);

        return await tx.read(PurchaseOrderSet).where(ID);

      } catch (error) {
        return 'Error ' + error.toString();
      }


    });

    this.on('setOrderProcessing', async(req) => {
      
      try {
        //also get the key
        const ID = req.params[0]; //{NODE_KEY : 'JIUJI54154454DCUI'}
        //CDS Query Language - to perform all db operations
        var tx = cds.tx(req);
        //fire update on DB  -- UPDATE INTO tab USING .... WHERE key
        await tx.update(PurchaseOrderSet).with({
          OVERALL_STATUS: 'D',
          NOTE: 'Delivered!'
        }).where(ID);

        return await tx.read(PurchaseOrderSet).where(ID);

      } catch (error) {
        return 'Error ' + error.toString();
      }


    });

    this.on('getLargestOrder', async(req) => {
      
      try {
        //CDS Query Language - to perform all db operations
        var tx = cds.tx(req);
        //fire update on DB  -- UPDATE INTO tab USING .... WHERE key
        const lt_orders = await tx.read(PurchaseOrderSet).orderBy({
          GROSS_AMOUNT: 'desc'
        }).limit(3);

        return lt_orders;

      } catch (error) {
        return 'Error ' + error.toString();
      }


    });


    this.on('getSanaValues', async(req) => {
      
      return {
        OVERALL_STATUS : 'N'
      }


    });


    return super.init()
  }}
