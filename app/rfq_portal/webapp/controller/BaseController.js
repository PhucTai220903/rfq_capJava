sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("rfqportal.controller.BaseController", {
        
        formatStatus: function(sStatus) {
            if (!sStatus) {
                return "";
            }
            
            const statusMap = {
                "A": "Active",
                "I": "Inactive",
                "P": "Pending"
            };
            
            return statusMap[sStatus] || sStatus;
        },

        formatStatusState: function(sStatus) {
            if (!sStatus) {
                return "None";
            }
            
            // Return valid ObjectStatus state values
            const stateMap = {
                "A": "Success",     // Active
                "I": "Error",       // Inactive  
                "P": "Warning"      // Pending
            };
            
            return stateMap[sStatus] || "None";
        },

        formatRole: function(sRole) {
            if (!sRole) {
                return "";
            }
            
            const roleMap = {
                "A": "Admin",
                "B": "Buyer", 
                "V": "Vendor"
            };
            
            return roleMap[sRole] || sRole;
        },

        onNavBack: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDashboard");
        }
    });
});