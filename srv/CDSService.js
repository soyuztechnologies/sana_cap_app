const cds = require('@sap/cds')

module.exports = class CDSService extends cds.ApplicationService { init() {

  const { ProductSet, POItemSet } = cds.entities('CDSService')

  this.before (['CREATE', 'UPDATE'], ProductSet, async (req) => {
    console.log('Before CREATE/UPDATE ProductSet', req.data)
  })
  this.after ('READ', ProductSet, async (productSet, req) => {

      ///step 1: get all product ids in an array
      const ids = productSet.map(shalini => shalini.ProductId);

      //step 2: get the count of times it was sold in items
      //SELECT ProductId, COUNT(ProductId) as anubhav from Items GROUP BY ProductId 
      //WHERE ProductId = [ids]
      const productCount = await SELECT.from(POItemSet)
                                       .columns('ProductId', {'func': 'count', as : 'anubhav'})
                                       .where({'ProductId': {in : ids}})
                                       .groupBy('ProductId');

      //productCount = [{id,anubhav},{id,anubhav},{id,anubhav},...]
      for(const wa of productSet){
        const rec = productCount.find(pc => pc.ProductId === wa.ProductId);
        wa.soldCount = rec ? rec.anubhav : 0
      }

  })
  this.before (['CREATE', 'UPDATE'], POItemSet, async (req) => {
    console.log('Before CREATE/UPDATE POItemSet', req.data)
  })
  this.after ('READ', POItemSet, async (pOItemSet, req) => {
    console.log('After READ POItemSet', pOItemSet)
  })


  return super.init()
}}
