sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.user.user',
            componentId: 'BTPUserList',
            contextPath: '/BTPUser'
        },
        CustomPageDefinitions
    );
});