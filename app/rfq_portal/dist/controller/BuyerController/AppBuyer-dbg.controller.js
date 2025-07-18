sap.ui.define(
  ["rfqportal/controller/BaseController"],
  function (BaseController) {
    "use strict";

    return BaseController.extend(
      "rfqportal.controller.BuyerController.AppBuyer",
      {
        onInit: function () {
          console.log("AppBuyer Controller Initialized");

          // Kiểm tra quyền BUYER
          this.checkBuyerPermission(
            // Success callback
            function (aRoles) {
              console.log("User has BUYER permission:", aRoles);
              this._setupBuyerInterface();
            }.bind(this),
            // Error callback
            function (aRoles) {
              console.log("User doesn't have BUYER permission:", aRoles);
              // Custom error handling if needed
            }
          );
        },

        _setupBuyerInterface: function () {
          // Initialize buyer-specific functionality here
          console.log("Setting up buyer interface...");
          // Add any buyer-specific initialization logic
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
