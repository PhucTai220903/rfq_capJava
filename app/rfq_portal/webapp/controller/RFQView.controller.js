sap.ui.define([
    "rfqportal/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat"
], (BaseController, JSONModel, MessageToast, Fragment, DateFormat) => {
    "use strict";

    return BaseController.extend("rfqportal.controller.RFQView", {
        onInit() {
            // Initialize date formatter
            this._oDateFormat = DateFormat.getDateInstance({
                style: "short"
            });
        },

        // Add missing methods from view
        onRefresh: function() {
            const oTable = this.byId("rfqTable");
            if (oTable) {
                const oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                    MessageToast.show("Table refreshed");
                } else {
                    MessageToast.show("No binding found");
                }
            }
        },

        onCreateRFQ: function() {
            MessageToast.show("Create RFQ functionality to be implemented");
        },

        onRowPress: function(oEvent) {
            // Handle row selection if needed
            const oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
            }
        },

        onEditRFQ: function(oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
                const sRFQId = oBindingContext.getProperty("ID");
                MessageToast.show(`Edit RFQ ${sRFQId} - To be implemented`);
            }
        },

        onViewDetail: function(oEvent) {
            // Get the binding context from the button's parent row
            const oBindingContext = oEvent.getSource().getBindingContext();
            
            if (!oBindingContext) {
                MessageToast.show("No data selected");
                return;
            }
            
            const sRFQId = oBindingContext.getProperty("ID");
            this._showDetailDialog(sRFQId);
        },

        _showDetailDialog: function(sRFQId) {
            const oView = this.getView();
            
            if (!this._oDetailDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "rfqportal.fragment.detailPopup",
                    controller: this
                }).then((oDialog) => {
                    this._oDetailDialog = oDialog;
                    oView.addDependent(this._oDetailDialog);
                    this._bindDialogToContext(sRFQId);
                }).catch((oError) => {
                    console.error("Error loading fragment:", oError);
                    MessageToast.show("Error loading detail dialog");
                });
            } else {
                this._bindDialogToContext(sRFQId);
            }
        },

        _bindDialogToContext: function(sRFQId) {
            try {
                const oModel = this.getView().getModel();
                
                // Create binding path
                const sPath = `/RFQs(${sRFQId})`;
                
                // Use the exact same expand parameters as your working request
                const mParameters = {
                    $expand: "created_by,items($expand=unit_of_measure),RFQItems($expand=frq_id,unit_of_measure)",
                    $select: "*"
                };
                
                // Method 2: Set up event handlers first, then initialize
                const oContextBinding = oModel.bindContext(sPath, null, mParameters);
                
                oContextBinding.attachEventOnce("dataReceived", () => {
                    const oContext = oContextBinding.getBoundContext();
                    
                    if (oContext) {
                        // Bind the dialog to the expanded context
                        this._oDetailDialog.setBindingContext(oContext);
                        this._oDetailDialog.open();
                    } else {
                        MessageToast.show("Failed to load RFQ details");
                    }
                });
                
                // Handle errors
                oContextBinding.attachEvent("dataReceived", (oEvent) => {
                    const oError = oEvent.getParameter("error");
                    if (oError) {
                        console.error("Error loading data:", oError);
                        MessageToast.show("Error loading data: " + oError.message);
                    }
                });
                
                // Force the request to start
                oContextBinding.initialize();
                
            } catch (oError) {
                console.error("Error binding dialog context:", oError);
                MessageToast.show("Error loading detailed data: " + oError.message);
            }
        },

        onCloseDialog: function() {
            if (this._oDetailDialog) {
                this._oDetailDialog.close();
            }
        },

        onDownloadRFQ: function() {
            MessageToast.show("Download functionality to be implemented");
        },

        // Formatter functions
        formatDate: function(sDate) {
            if (!sDate) {
                return "";
            }
            try {
                // Handle ISO 8601 date format from OData V4
                const oDate = new Date(sDate);
                if (isNaN(oDate.getTime())) {
                    console.warn("Invalid date:", sDate);
                    return sDate;
                }
                return this._oDateFormat ? this._oDateFormat.format(oDate) : oDate.toLocaleDateString();
            } catch (e) {
                console.error("Date formatting error:", e);
                return sDate || "";
            }
        },

        formatStatus: function(sStatus) {
            if (!sStatus) {
                return "";
            }
            
            // Handle backend status values (A, I, P) based on response
            const statusMap = {
                "A": "Active",
                "I": "Inactive",
                "P": "Pending"
            };
            
            return statusMap[sStatus] || sStatus.charAt(0).toUpperCase() + sStatus.slice(1);
        },

        formatStatusState: function(sStatus) {
            if (!sStatus) {
                return "None";
            }
            
            // Handle backend status values (A, I, P) - Return valid ObjectStatus states
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
            
            // Based on response, role "B" = Buyer
            const roleMap = {
                "A": "Admin",
                "B": "Buyer",
                "V": "Vendor"
            };
            
            return roleMap[sRole] || sRole;
        }
    });
});