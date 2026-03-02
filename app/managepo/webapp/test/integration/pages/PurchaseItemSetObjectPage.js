sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'sana.ab.managepo',
            componentId: 'PurchaseItemSetObjectPage',
            contextPath: '/PurchaseOrderSet/Items'
        },
        CustomPageDefinitions
    );
});