sap.ui.define(
  ["sap/ui/core/mvc/Controller", "rfqportal/services/BaseService"],
  function (Controller, BaseService) {
    "use strict";

    return Controller.extend("rfqportal.components.admin.controller.AppAdmin", {
      onInit: function () {
        var defaultLanguage = BaseService.getDefaultLanguage();
        console.log("Default Language: ", defaultLanguage);
        var oModel = new sap.ui.model.json.JSONModel({
          selectedLanguage: defaultLanguage,
        });
        this.getView().setModel(oModel, "oModel");

        var i18nModel = BaseService.createI18nModel(defaultLanguage);
        this.getView().setModel(i18nModel, "i18n");

        this._setupAdminInterface();

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Dashboard");
      },

      onLanguageChange: function (oEvent) {
        var selectedKey = oEvent.getParameter("selectedItem").getKey();
        BaseService.setLanguageForView(this.getView(), selectedKey);
      },

      _setupAdminInterface: function () {
        var oSideNavigation = this.byId("sideNavigation");
        if (oSideNavigation) {
          oSideNavigation.attachItemSelect(
            this.onNavigationItemSelect.bind(this)
          );
          this._setDefaultSelection();
        }
      },

      _setDefaultSelection: function () {
        var oSideNavigation = this.byId("sideNavigation");
        if (oSideNavigation) {
          var oDashboardItem = this._findNavigationItemByKey("dashboard");
          if (oDashboardItem) {
            oSideNavigation.setSelectedItem(oDashboardItem);
          }
        }
      },

      _findNavigationItemByKey: function (sKey) {
        var oSideNavigation = this.byId("sideNavigation");
        var aItems = oSideNavigation.getItem().getItems();

        for (var i = 0; i < aItems.length; i++) {
          var aSubItems = aItems[i].getItems();
          for (var j = 0; j < aSubItems.length; j++) {
            if (aSubItems[j].getKey() === sKey) {
              return aSubItems[j];
            }
          }
        }
        return null;
      },

      onSideNavButtonPress: function () {
        var oSideNavigation = this.byId("sideNavigation");
        var bExpanded = oSideNavigation.getExpanded();
        oSideNavigation.setExpanded(!bExpanded);
      },

      onNavigationItemSelect: function (oEvent) {
        var oItem = oEvent.getParameter("item");
        var sKey = oItem.getKey();

        if (sKey && sKey.startsWith("parent-")) {
          var bExpanded = oItem.getExpanded();
          oItem.setExpanded(!bExpanded);
          return;
        }

        var oRouter = this.getOwnerComponent().getRouter();

        switch (sKey) {
          case "dashboard":
            oRouter.navTo("Dashboard");
            break;
          case "rfq":
            oRouter.navTo("RFQView");
            break;
          case "contract":
            oRouter.navTo("ContractView");
            break;
          case "vendor":
            oRouter.navTo("VendorView");
            break;
          default:
            break;
        }
      },
    });
  }
);
