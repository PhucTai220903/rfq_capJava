sap.ui.define(
  ["rfqportal/controller/BaseController", "sap/m/MessageToast"],
  function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend(
      "rfqportal.controller.BuyerController.AppBuyer",
      {
        onInit: function () {
          console.log("AppBuyer Controller Initialized");

          try {
            // Validate buyer access
            this.validateRouteAccess("buyer");

            // Setup Buyer-specific functionality
            this._setupBuyerInterface();
          } catch (error) {
            console.error("Buyer access validation failed:", error.message);
            // Error handling - user will see MessageToast from validateRouteAccess
            setTimeout(() => {
              this.getRouter().navTo("RouteApp");
            }, 2000);
          }
        },

        _setupBuyerInterface: function () {
          console.log("Setting up Buyer interface...");
          // Add Buyer-specific initialization logic here
        },

        onSideNavButtonPress: function () {
          var oSideNavigation = this.byId("sideNavigation_buyer");
          var bExpanded = oSideNavigation.getExpanded();
          oSideNavigation.setExpanded(!bExpanded);
        },
      }
    );
  }
);
