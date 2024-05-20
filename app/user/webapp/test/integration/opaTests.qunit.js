sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/user/user/test/integration/FirstJourney',
		'com/user/user/test/integration/pages/BTPUserList',
		'com/user/user/test/integration/pages/BTPUserObjectPage'
    ],
    function(JourneyRunner, opaJourney, BTPUserList, BTPUserObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/user/user') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBTPUserList: BTPUserList,
					onTheBTPUserObjectPage: BTPUserObjectPage
                }
            },
            opaJourney.run
        );
    }
);