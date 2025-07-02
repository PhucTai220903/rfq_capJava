sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("rfqportal.controller.Guest", {
        onNavigateToAdmin: function () {
            UIComponent.getRouterFor(this).navTo("RouteAppAdmin");
        },

        onNavigateToVendor: function () {
            UIComponent.getRouterFor(this).navTo("RouteVendor");
        },

        onNavigateToBuyer: function () {
            // Tạm thời navigate tới một route có sẵn
            UIComponent.getRouterFor(this).navTo("RouteContract");
        }
    });
});