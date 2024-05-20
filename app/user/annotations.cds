using UserManagement as service from '../../srv/user-group';
 
annotate service.BTPUser with @(
    UI.HeaderInfo                : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'User',
        TypeNamePlural: 'Users'
    },
    UI.SelectionFields           : [
        userId,
        userName,
        AdminType,
        active
    // middleName,
    // familyName,
    // active,
    // userId,
    // mobileNo,
    // mailVerified
    ],
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'ID',
                Value: id
            },
            {
                $Type: 'UI.DataField',
                Label: 'User Name',
                Value: userName
            },
            {
                $Type: 'UI.DataField',
                Label: 'Given Name',
                Value: firstName
            },
            {
                $Type: 'UI.DataField',
                Label: 'Middle Name',
                Value: middleName
            },
            {
                $Type: 'UI.DataField',
                Label: 'Family Name',
                Value: lastName
            },
            {
                $Type: 'UI.DataField',
                Label: 'Email',
                Value: emails
            },
            {
                $Type: 'UI.DataField',
                Label: 'Status',
                Value: active
            },
            {
                $Type: 'UI.DataField',
                Label: 'User Id',
                Value: userId
            },
            {
                $Type: 'UI.DataField',
                Label: 'Mobile No.',
                Value: mobileNo
            },
            {
                $Type: 'UI.DataField',
                Label: 'mailVerified',
                Value: mailVerified
            }
        ]
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup'
    }],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'User ID',
            Value: userId
        },
        {
            $Type: 'UI.DataField',
            Label: 'User Name',
            Value: userName
        },
        {
            $Type: 'UI.DataField',
            Label: 'Email ID',
            Value: emails,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Mobile No.',
            Value: mobileNo,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Admin Type',
            Value: AdminType,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Account Status',
            Value: active,
        },
       
    ]
);
 
annotate service.BTPUser with {
    userName @Common.Label: 'User Name'
};
 
annotate service.BTPUser with {
    userId @Common.Label: 'User ID'
};
 
annotate service.BTPUser with {
    AdminType @Common.Label: 'User Category'
};
annotate service.BTPUser with {
    active @Common.Label: 'Status'
};
 
annotate service.BTPUser with {
    userId @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'BTPUser',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: userId,
                ValueListProperty: 'userId',
            }, ],
            Label         : 'User ID',
        },
    )
};
 
annotate service.BTPUser with {
    userName @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'BTPUser',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: userName,
                ValueListProperty: 'userName',
            }, ],
            Label         : 'User Name',
        },
        Common.ValueListWithFixedValues: true
    )
};
 
annotate service.BTPUser with {
    AdminType @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'BTPUser',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: AdminType,
                ValueListProperty: 'AdminType',
            }, ],
            Label         : 'User Category',
        },
        Common.ValueListWithFixedValues: true
    )
};
annotate service.BTPUser with {
    active @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'BTPUser',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: active,
                ValueListProperty: 'active',
            }, ],
            Label         : 'Status',
        },
        Common.ValueListWithFixedValues: true
    )
};
 