sap.ui.define(
  ["rfqportal/controller/BaseController"],
  function (BaseController) {
    "use strict";

    return BaseController.extend(
      "rfqportal.controller.BuyerController.AppBuyer",
      {
        onInit: function () {
          console.log("AppBuyer Controller Initialized");
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
