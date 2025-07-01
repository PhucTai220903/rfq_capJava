sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (Controller) => {
  "use strict";

  return Controller.extend("rfqportal.controller.App", {
      onInit() {
          this._setupSideNavigation();
      },

      _setupSideNavigation: function() {
          var oSideNavigation = this.byId("sideNavigation");
          if (oSideNavigation) {
              oSideNavigation.attachItemSelect(this.onNavigationItemSelect.bind(this));
              this._setDefaultSelection();
          }
      },

      _setDefaultSelection: function() {
          var oSideNavigation = this.byId("sideNavigation");
          if (oSideNavigation) {
              var oDashboardItem = this._findNavigationItemByKey("dashboard");
              if (oDashboardItem) {
                  oSideNavigation.setSelectedItem(oDashboardItem);
              }
          }
      },

      _findNavigationItemByKey: function(sKey) {
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

      onSideNavButtonPress: function() {
          var oSideNavigation = this.byId("sideNavigation");
          var bExpanded = oSideNavigation.getExpanded();
          oSideNavigation.setExpanded(!bExpanded);
      },

      onNavigationItemSelect: function(oEvent) {
          var oItem = oEvent.getParameter("item");
          var sKey = oItem.getKey();
          
          if (sKey && sKey.startsWith("parent-")) {
              var bExpanded = oItem.getExpanded();
              oItem.setExpanded(!bExpanded);
              return;
          }
          
          var oRouter = this.getOwnerComponent().getRouter();
          
          switch(sKey) {
                case "dashboard":
                    oRouter.navTo("RouteDashboard");
                    break;
                case "rfq":
                    oRouter.navTo("RouteRFQView");
                    break;
                case "purchase-request":
                    break;
                case "purchase-order":
                    break;
                case "contract":
                    oRouter.navTo("RouteContract");
                    break;
                case "vendor":
                    oRouter.navTo("RouteVendor");
                    break;
                case "inventory":
                    break;
                case "reporting":
                    break;
                case "account":
                    break;
                default:
                    console.log("Unknown navigation key:", sKey);
                    break;
          }
      }
  });
});