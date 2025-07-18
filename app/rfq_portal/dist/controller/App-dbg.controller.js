sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("rfqportal.controller.App", {
      onInit: function () {},

      onGoToApplication: function () {
        var oRouter = this.getOwnerComponent().getRouter();

        jQuery.ajax({
          url: "/odata/v4/admin/getUserRoles",
          method: "GET",
          success: function (data) {
            var aRoles = data.value || [];

            if (aRoles.includes("ADMIN")) {
              oRouter.navTo("RouteAppAdmin");
            } else if (aRoles.includes("BUYER")) {
              oRouter.navTo("RouteAppBuyer");
            } else if (aRoles.includes("VENDOR")) {
              oRouter.navTo("RouteAppVendor");
            } else {
              MessageToast.show("Bạn không có quyền truy cập.");
            }
          },
          error: function () {
            MessageToast.show("Không thể kiểm tra quyền truy cập.");
          },
        });
      },
    });
  }
);
