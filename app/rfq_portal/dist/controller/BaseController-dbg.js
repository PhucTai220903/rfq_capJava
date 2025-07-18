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

        // Return valid ObjectStatus state values
        const stateMap = {
          A: "Success", // Active
          I: "Error", // Inactive
          P: "Warning", // Pending
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
       * Check if current user has specific permission
       * @param {string} sRequiredRole - Required role (ADMIN, BUYER, VENDOR)
       * @param {function} fnSuccessCallback - Callback when user has permission
       */
      checkUserPermission: function (sRequiredRole, fnSuccessCallback) {
        var oRouter = this.getOwnerComponent().getRouter();

        jQuery.ajax({
          url: "odata/v4/admin/getUserRoles",
          method: "GET",
          success: function (data) {
            var aRoles = data.value || [];

            if (aRoles.includes(sRequiredRole)) {
              if (fnSuccessCallback) {
                fnSuccessCallback(aRoles);
              }
            } else {
              MessageToast.show(
                `Bạn không có quyền truy cập trang ${sRequiredRole}.`
              );
              oRouter.navTo("RouteApp");
            }
          },
        });
      },

      /**
       * Check Admin permission specifically
       */
      checkAdminPermission: function (fnSuccessCallback, fnErrorCallback) {
        this.checkUserPermission("ADMIN", fnSuccessCallback, fnErrorCallback);
      },

      /**
       * Check Buyer permission specifically
       */
      checkBuyerPermission: function (fnSuccessCallback, fnErrorCallback) {
        this.checkUserPermission("BUYER", fnSuccessCallback, fnErrorCallback);
      },

      /**
       * Check Vendor permission specifically
       */
      checkVendorPermission: function (fnSuccessCallback, fnErrorCallback) {
        this.checkUserPermission("VENDOR", fnSuccessCallback, fnErrorCallback);
      },

      /**
       * Redirect user based on their roles
       */
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
