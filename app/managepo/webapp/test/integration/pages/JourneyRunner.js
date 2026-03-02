sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sana/ab/managepo/test/integration/pages/PurchaseOrderSetList",
	"sana/ab/managepo/test/integration/pages/PurchaseOrderSetObjectPage",
	"sana/ab/managepo/test/integration/pages/PurchaseItemSetObjectPage"
], function (JourneyRunner, PurchaseOrderSetList, PurchaseOrderSetObjectPage, PurchaseItemSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sana/ab/managepo') + '/test/flp.html#app-preview',
        pages: {
			onThePurchaseOrderSetList: PurchaseOrderSetList,
			onThePurchaseOrderSetObjectPage: PurchaseOrderSetObjectPage,
			onThePurchaseItemSetObjectPage: PurchaseItemSetObjectPage
        },
        async: true
    });

    return runner;
});

