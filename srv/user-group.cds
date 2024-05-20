service UserManagement {
    entity BTPUser {
        key id           : String;
            userName     : String;
            firstName    : String;
            middleName   : String;
            lastName     : String;
            emails       : String;
            active       : Boolean;
            userId       : String;
            mobileNo     : String;
            mailVerified : Boolean;
            AdminType    : String;
            Account      : String
    }

    entity Groups {
        key id          : String;
            groupName   : String;
            description : String;
            members     : array of Member; //Array of String;
    }

    type Member {
        value : String;
    }
}
