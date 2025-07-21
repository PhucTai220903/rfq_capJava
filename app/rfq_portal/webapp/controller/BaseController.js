sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("rfqportal.controller.BaseController", {
      /**
       * Convenience method for getting the router.
       * @returns {sap.ui.core.routing.Router} the router for this component
       */
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      /**
       * Convenience method for getting the view model by name in every controller of the application.
       * @param {string} sName the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model in every controller of the application.
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Convenience method for getting the resource bundle.
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      formatStatus: function (sStatus) {
        if (!sStatus) {
          return "";
        }

        const statusMap = {
          A: "Active",
          I: "Inactive",
          P: "Pending",
        };

        return statusMap[sStatus] || sStatus;
      },

      formatStatusState: function (sStatus) {
        if (!sStatus) {
          return "None";
        }

        const stateMap = {
          A: "Success",
          I: "Error",
          P: "Warning",
        };

        return stateMap[sStatus] || "None";
      },

      formatRole: function (sRole) {
        if (!sRole) {
          return "";
        }

        const roleMap = {
          A: "Admin",
          B: "Buyer",
          V: "Vendor",
        };

        return roleMap[sRole] || sRole;
      },

      formatDate: function (sDate) {
        if (!sDate) {
          return "";
        }
        const oDate = new Date(sDate);
        if (isNaN(oDate.getTime())) {
          return sDate;
        }
        return oDate.toLocaleDateString("en-GB");
      },

      getInitials: function (sName) {
        if (!sName) return "";
        const aWords = sName.split(" ");
        return aWords
          .map((word) => word.charAt(0))
          .join("")
          .substr(0, 2)
          .toUpperCase();
      },

      onNavBack: function () {
        var oRouter = this.getRouter();
        oRouter.navTo("RouteDashboard");
      },

      /**
       * Validate user access to specific route based on role
       * @param {string} sRequiredRole - Required role (admin, buyer, vendor)
       * @throws {Error} Throws error if user doesn't have access
       */
      validateRouteAccess: function (sRequiredRole) {
        var oAppConfigModel = this.getOwnerComponent().getModel("appConfig");

        if (!oAppConfigModel) {
          MessageToast.show("Không thể xác định thông tin người dùng.");
          throw new Error(
            "AppConfig model not found - Authentication required"
          );
        }

        var sCurrentRole = oAppConfigModel.getProperty("/currentRole");

        if (!sCurrentRole) {
          MessageToast.show(
            "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
          );
          throw new Error("User role not found - Authentication required");
        }

        if (sCurrentRole !== sRequiredRole) {
          MessageToast.show(
            `Bạn không có quyền truy cập trang này. Quyền yêu cầu: ${sRequiredRole.toUpperCase()}`
          );
          throw new Error(
            `Access denied. Required role: ${sRequiredRole}, User role: ${sCurrentRole}`
          );
        }

        return true;
      },

      /**
       * @returns {string|null}
       */
      getCurrentUserRole: function () {
        var oAppConfigModel = this.getOwnerComponent().getModel("appConfig");
        return oAppConfigModel
          ? oAppConfigModel.getProperty("/currentRole")
          : null;
      },

      _redirectBasedOnRole: function (aRoles, oRouter) {
        if (aRoles.includes("BUYER")) {
          oRouter.navTo("RouteAppBuyer");
        } else if (aRoles.includes("VENDOR")) {
          oRouter.navTo("RouteAppVendor");
        } else if (aRoles.includes("ADMIN")) {
          oRouter.navTo("RouteAppAdmin");
        } else {
          window.location.href = "/";
        }
      },
    });
  }
);
