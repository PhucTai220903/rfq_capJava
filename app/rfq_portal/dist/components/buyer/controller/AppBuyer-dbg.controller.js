sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("rfqportal.components.buyer.controller.AppBuyer", {
      onInit: function () {
        var systemLanguage = navigator.language || "en";
        var supportedLanguages = ["en", "vi", "kr"];
        var defaultLanguage = supportedLanguages.includes(systemLanguage)
          ? systemLanguage
          : "en";

        var oModel = new sap.ui.model.json.JSONModel({
          selectedLanguage: defaultLanguage,
        });
        this.getView().setModel(oModel);

        // Thiết lập mô hình i18n
        var i18nModel = new sap.ui.model.resource.ResourceModel({
          bundleName: "rfqportal.components.buyer.i18n.i18n",
          bundleLocale: defaultLanguage,
        });
        this.getView().setModel(i18nModel, "i18n");

        this._setupBuyerInterface();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Dashboard");
      },

      _setupBuyerInterface: function () {
        var oSideNavigation = this.byId("sideNavigation_buyer"); // Đảm bảo ID khớp với view
        if (oSideNavigation) {
          oSideNavigation.attachItemSelect(
            this.onNavigationItemSelect.bind(this)
          );
          this._setDefaultSelection();
        } else {
          console.error("SideNavigation not found in view.");
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
        var oSideNavigation = this.byId("sideNavigation_buyer");
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
          case "create-rfq":
            oRouter.navTo("CreateRFQ");
            break;
          case "my-rfq":
            oRouter.navTo("BuyerRFQList");
            break;
          case "quotations":
            oRouter.navTo("BuyerQuotations");
            break;
          case "purchase-order":
            oRouter.navTo("PurchaseOrders");
            break;
          case "vendor-management":
            oRouter.navTo("VendorManagement");
            break;
          case "contracts":
            oRouter.navTo("Contracts");
            break;
          case "reports":
            oRouter.navTo("Reports");
            break;
          case "profile":
            oRouter.navTo("Profile");
            break;
          case "preferences":
            oRouter.navTo("Preferences");
            break;
          default:
            MessageToast.show("Invalid navigation key: " + sKey);
        }
      },

      onLanguageChange: function (oEvent) {
        var selectedKey = oEvent.getParameter("selectedItem").getKey();

        // Cập nhật ngôn ngữ trong model
        this.getView().getModel().setProperty("/selectedLanguage", selectedKey);

        // Cập nhật mô hình i18n
        var i18nModel = new sap.ui.model.resource.ResourceModel({
          bundleName: "rfqportal.components.buyer.i18n.i18n",
          bundleLocale: selectedKey,
        });
        this.getView().setModel(i18nModel, "i18n");
      },
    });
  }
);
