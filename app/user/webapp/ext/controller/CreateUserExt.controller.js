sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox"],
  function (ControllerExtension, MessageBox) {
    "use strict";
 
    return ControllerExtension.extend(
      "com.user.user.ext.controller.CreateUserExt",
      {
        override: {
          /**
           * Called when a controller is instantiated and its View controls (if available) are already created.
           * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
           * @memberOf com.user.user.ext.controller.ObjectPage
           */
          onInit: function () {
            // you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
            var oModel = this.base.getExtensionAPI().getModel();
            // this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
          },
        },
        onCreateUser: function () {
          this.createFragment = sap.ui.xmlfragment(
            "com.user.user.ext.fragments.createUser",
            this
          );
          this.getView().addDependent(this.createFragment);
          // sap.ui.getCore().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
          this.createFragment.open();
          this.onSign()
        },
        create_CloseBtn: function () {
          this.createFragment.destroy();
        },
        click: function () {
          alert('gchg');
        },
        onUpdateUser: function () {
          let aContexts = this.base.getExtensionAPI().getSelectedContexts();
          if (aContexts.length === 1) {
            let oContext = aContexts[0];
            let oData = oContext.getObject();
            debugger;
            this.updateFragment = sap.ui.xmlfragment(
              "com.user.user.ext.fragments.updateUser",
              this
            );
            this.getView().addDependent(this.updateFragment);
            this.updateFragment.open();
 
            sap.ui.getCore().byId("inputIDUserName").setValue(oData.userName);
            sap.ui.getCore().byId("inputIDFirstName").setValue(oData.firstName);
            sap.ui.getCore().byId("inputIDMiddleName").setValue(oData.middleName);
            sap.ui.getCore().byId("inputIDLastName").setValue(oData.lastName);
            sap.ui.getCore().byId("inputIDEmailId").setValue(oData.emails);
            sap.ui.getCore().byId("inputIDMobilNo").setValue(oData.mobileNo);
            sap.ui.getCore().byId("inputIDUserType").setSelectedKey(oData.AdminType);
            sap.ui.getCore().byId("inputIDAccount").setSelectedKey(oData.Account);
 
          } else {
            sap.m.MessageBox.error("Please Select only One User");
            return;
          }
        },
 
        update_CloseBtn: function () {
          this.updateFragment.destroy();
        },
        onSubmitCreate: function (oEvent) {
          var that = this;
          let oModel = this.getView().getModel();
          let oBindList = oModel.bindList("/BTPUser");
 
          let userName = sap.ui.getCore().byId("inputIDUserName").getValue();
          let firstName = sap.ui.getCore().byId("inputIDFirstName").getValue();
          let middleName = sap.ui.getCore().byId("inputIDMiddleName").getValue();
          let lastName = sap.ui.getCore().byId("inputIDLastName").getValue();
          let emails = sap.ui.getCore().byId("inputIDEmailId").getValue();
          let mobileNo = sap.ui.getCore().byId("inputIDMobilNo").getValue();
          let adminType = sap.ui.getCore().byId("inputIDUserType").getSelectedKey();
          let account = sap.ui.getCore().byId("inputIDAccount").getSelectedKey();
 
          const data = {
            userName: userName,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            emails: emails,
            mobileNo: mobileNo,
            AdminType: adminType,
            Account: account,
          }
          oBindList.create(data);
 
          oBindList
            .requestContexts()
            .then((req) => {
              that.getView().getModel().refresh();
              that.createFragment.destroy();
              MessageBox.success("User Created successfully");
            })
            .catch((err) => MessageBox.error(err));
        },
        onSubmitUpdate: function (oEvent) {
          var that = this;
          that.getView().setBusy(true);
          let filterName = this.base.getExtensionAPI().getSelectedContexts()[0].getValue().userName;
          // let id = this.base.getExtensionAPI().getSelectedContexts()[0].getValue().id;
          let userName = sap.ui.getCore().byId("inputIDUserName").getValue();
          let firstName = sap.ui.getCore().byId("inputIDFirstName").getValue();
          let middleName = sap.ui.getCore().byId("inputIDMiddleName").getValue();
          let lastName = sap.ui.getCore().byId("inputIDLastName").getValue();
          let emails = sap.ui.getCore().byId("inputIDEmailId").getValue();
          let mobileNo = sap.ui.getCore().byId("inputIDMobilNo").getValue();
          let adminType = sap.ui.getCore().byId("inputIDUserType").getSelectedKey();
          let account = sap.ui.getCore().byId("inputIDAccount").getSelectedKey();
 
          let oModel = this.getView().getModel();
          let oBindList = oModel.bindList("/BTPUser");
          let aFilter = new sap.ui.model.Filter(
            "userName",
            sap.ui.model.FilterOperator.EQ,
            filterName
          );
 
          oBindList
            .filter(aFilter)
            .requestContexts()
            .then(function (aContexts) {
              aContexts[0].setProperty("userName", userName);
              aContexts[0].setProperty("firstName", firstName);
              aContexts[0].setProperty("middleName", middleName);
              aContexts[0].setProperty("lastName", lastName);
              aContexts[0].setProperty("emails", emails);
              aContexts[0].setProperty("mobileNo", mobileNo);
              aContexts[0].setProperty("AdminType", adminType);
              aContexts[0].setProperty("Account", account);
              that.updateFragment.destroy();
              that.getView().getModel().refresh();
              MessageBox.success("User Updated successful");
              that.getView().setBusy(false);
            })
            .catch((err) => { MessageBox.error("Error is : " + err); that.getView().setBusy(false); });
        },
        onAvatarChange: function (oEvent) {
          var oFileUploader = oEvent.getSource();
          var oAvatarImage = this.getView().byId("avatarImage");
 
          if (oFileUploader && oFileUploader.files.length > 0) {
            var oFile = oFileUploader.files[0];
            var oReader = new FileReader();
            oReader.onload = function (e) {
              oAvatarImage.setSrc(e.target.result);
            };
 
            oReader.readAsDataURL(oFile);
          }
        },
 
        onSignatureChange: function (oEvent) {
          var oFileUploader = oEvent.getSource();
          var oSignatureImage = this.getView().byId("signatureImage");
 
          if (oFileUploader && oFileUploader.files.length > 0) {
            var oFile = oFileUploader.files[0];
            var oReader = new FileReader();
 
            oReader.onload = function (e) {
              oSignatureImage.setSrc(e.target.result);
            };
 
            oReader.readAsDataURL(oFile);
          }
        },
        onPress: function () {
          sap.ui.getCore().byId("fileUploader").openFilePicker();
        },
 
        onFileSelectionChange: function (oEvent) {
          var oFileUploader = oEvent.getSource();
          var oAvatar = sap.ui.getCore().byId("userAvatar");
          var oFile = oEvent.getParameter("files")[0];
          var oReader = new FileReader();
 
          oReader.onload = function (e) {
            var sUrl = e.target.result;
            oAvatar.setSrc(sUrl);
          };
 
          oReader.readAsDataURL(oFile);
        },
 
        onUploadComplete: function (oEvent) {
          var response = oEvent.getParameter("response");
        },
      },
    );
  }
);
 