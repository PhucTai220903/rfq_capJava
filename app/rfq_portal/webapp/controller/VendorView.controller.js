sap.ui.define([
    "rfqportal/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (BaseController, JSONModel, MessageToast) => {
    "use strict";

    return BaseController.extend("rfqportal.controller.VendorView", {
        onInit() {
        }
        
        // Các formatters đã inherit từ BaseController
        // Chỉ cần implement logic riêng cho VendorView
    });
});