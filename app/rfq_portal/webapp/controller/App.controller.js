sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("rfqportal.controller.App", {
      onInit: function () {},

      onGoToApplication: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        var oAppConfigModel = this.getOwnerComponent().getModel("appConfig");

        if (!oAppConfigModel) {
          MessageToast.show("Không thể tìm thấy thông tin vai trò người dùng.");
          return;
        }

        var sRole = oAppConfigModel.getProperty("/currentRole");

        // Điều hướng dựa trên vai trò đã được kiểm tra ở Component.js
        switch (sRole) {
          case "admin":
            oRouter.navTo("RouteAppAdmin");
            break;
          case "buyer":
            oRouter.navTo("RouteAppBuyer");
            break;
          case "vendor":
            oRouter.navTo("RouteAppVendor");
            break;
          default:
            MessageToast.show("Bạn không có quyền truy cập.");
            oRouter.navTo("RouteApp"); // Redirect về trang chính
            break;
        }
      },
    });
  }
);
