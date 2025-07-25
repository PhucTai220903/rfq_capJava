sap.ui.define([], function () {
  "use strict";

  return {
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

    formatBusinessDomain: function (sDomain) {
      if (!sDomain) {
        return "";
      }

      const domainMap = {
        F: "CJ_FOOD",
        H: "CJ_HK",
        E: "CJ_ET",
        O: "CJ_ONS",
      };

      return domainMap[sDomain] || sDomain;
    },

    getDefaultLanguage: function () {
      var systemLanguage = navigator.language || "en";
      var supportedLanguages = ["en", "vi", "kr"];
      return supportedLanguages.includes(systemLanguage)
        ? systemLanguage
        : "en";
    },

    createI18nModel: function (lang) {
      return new sap.ui.model.resource.ResourceModel({
        bundleName: "rfqportal.components.admin.i18n.i18n",
        bundleLocale: lang,
      });
    },

    setLanguageForView: function (oView, lang) {
      // Cập nhật selectedLanguage trong oModel nếu có
      var oModel = oView.getModel("oModel");
      if (oModel && oModel.setProperty) {
        oModel.setProperty("/selectedLanguage", lang);
      }
      // Tạo và set lại i18n model
      var i18nModel = this.createI18nModel(lang);
      oView.setModel(i18nModel, "i18n");
    },
  };
});
