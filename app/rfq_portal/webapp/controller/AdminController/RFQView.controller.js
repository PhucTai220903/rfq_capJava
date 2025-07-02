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
            this._oDateFormat = DateFormat.getDateInstance({
                style: "short"
            });
            var oFilterModel = new sap.ui.model.json.JSONModel({
                ID: [],
                title: [],
                status: []
            });
            this.getView().setModel(oFilterModel, "filters");
        },

        onRefresh: function() {
            const oTable = this.byId("rfqTable");
            if (oTable) {
                const oBinding = oTable.getBinding("rows");
                if (oBinding) {
                    oBinding.refresh();
                    MessageToast.show("Table refreshed");
                } else {
                    MessageToast.show("No binding found");
                }
            }
        },

        formatDate: function(sDate) {
            if (!sDate) {
                return "";
            }
            const oDate = new Date(sDate);
            if (isNaN(oDate.getTime())) {
                return sDate;
            }
            return oDate.toLocaleDateString("en-GB");
        },

        onViewDetail: function(oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            if (!oBindingContext) {
                MessageToast.show("No data selected");
                return;
            }
            this._showDetailDialogWithContext(oBindingContext);
        },

        _showDetailDialogWithContext: function(oBindingContext) {
            const oView = this.getView();
            if (!this._oDetailDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "rfqportal.fragment.detailPopup",
                    controller: this
                }).then((oDialog) => {
                    this._oDetailDialog = oDialog;
                    oView.addDependent(this._oDetailDialog);
                    if (oDialog.oPopup && typeof oDialog.oPopup.setModal === "function") {
                        oDialog.oPopup.setModal(false);
                    }
                    this._oDetailDialog.setBindingContext(oBindingContext);
                    this._oDetailDialog.open();
                }).catch(() => {
                    MessageToast.show("Error loading detail dialog");
                });
            } else {
                this._oDetailDialog.setBindingContext(oBindingContext);
                this._oDetailDialog.open();
            }
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
                }).catch(() => {
                    MessageToast.show("Error loading detail dialog");
                });
            } else {
                this._bindDialogToContext(sRFQId);
            }
        },

        _bindDialogToContext: function(sRFQId) {
            try {
                const oModel = this.getView().getModel();
                if (oModel && oModel.getMetadata().getName() === "sap.ui.model.odata.v4.ODataModel") {
                    const sPath = `/RFQs(${sRFQId})`;
                    const mParameters = {};
                    const oContextBinding = oModel.bindContext(sPath, null, mParameters);
                    oContextBinding.requestObject().then((oData) => {
                        if (oData) {
                            const oDialogModel = new JSONModel(oData);
                            this._oDetailDialog.setModel(oDialogModel);
                            this._oDetailDialog.open();
                        } else {
                            MessageToast.show("No data found for this RFQ");
                        }
                    }).catch(() => {
                        const oBindingContext = this.getView().byId("rfqTable").getBinding("rows").getCurrentContexts().find(ctx =>
                            ctx.getProperty("ID") === sRFQId
                        );
                        if (oBindingContext) {
                            this._oDetailDialog.setBindingContext(oBindingContext);
                            this._oDetailDialog.open();
                        } else {
                            MessageToast.show("Error loading RFQ data");
                        }
                    });
                } else {
                    MessageToast.show("Unsupported model type");
                }
            } catch (oError) {
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

        onFilterSearch: function(oEvent) {
            var oFilters = this.getView().getModel("filters").getData();

            var aFilters = [];
            if (oFilters.ID && oFilters.ID.length > 0) {
                oFilters.ID.forEach(function(oCond) {
                    if (oCond.values && oCond.values[0]) {
                        aFilters.push(new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oCond.values[0]));
                    }
                });
            }
            if (oFilters.title && oFilters.title.length > 0) {
                oFilters.title.forEach(function(oCond) {
                    if (oCond.values && oCond.values[0]) {
                        aFilters.push(new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, oCond.values[0]));
                    }
                });
            }
            if (oFilters.status && oFilters.status.length > 0) {
                oFilters.status.forEach(function(oCond) {
                    if (oCond.values && oCond.values[0]) {
                        aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, oCond.values[0]));
                    }
                });
            }

            var oTable = this.byId("rfqTable");
            if (oTable) {
                var oBinding = oTable.getBinding("rows");
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
            }
        }
    });
});