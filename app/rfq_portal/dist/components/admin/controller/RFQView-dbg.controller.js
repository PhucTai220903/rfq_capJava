sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "rfqportal/services/BaseService",
  ],
  (
    Controller,
    JSONModel,
    MessageToast,
    Fragment,
    DateFormat,
    Filter,
    FilterOperator,
    BaseService
  ) => {
    "use strict";

    return Controller.extend("rfqportal.components.admin.controller.RFQView", {
      onInit() {
        this._oDateFormat = DateFormat.getDateInstance({
          style: "short",
        });
        var oFilterModel = new JSONModel({
          ID: [],
          title: [],
          status: [],
        });
        this.getView().setModel(oFilterModel, "filters");
      },

      onRefresh: function () {
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

      formatDate: function (sDate) {
        return BaseService.formatDate(sDate);
      },

      formatBusinessDomain: function (sDomain) {
        return BaseService.formatBusinessDomain(sDomain);
      },

      formatStatus: function (sStatus) {
        return BaseService.formatStatus(sStatus);
      },

      formatStatusState: function (sStatus) {
        return BaseService.formatStatusState(sStatus);
      },

      formatRole: function (sRole) {
        return BaseService.formatRole(sRole);
      },

      getInitials: function (sName) {
        return BaseService.getInitials(sName);
      },

      onViewDetail: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext();
        if (!oBindingContext) {
          MessageToast.show("No data selected");
          return;
        }
        this._showDetailDialogWithContext(oBindingContext);
      },

      _showDetailDialogWithContext: function (oBindingContext) {
        const oView = this.getView();
        if (!this._oDetailDialog) {
          Fragment.load({
            id: oView.getId(),
            name: "rfqportal.fragment.detailPopup",
            controller: this,
          })
            .then((oDialog) => {
              this._oDetailDialog = oDialog;
              oView.addDependent(this._oDetailDialog);
              if (
                oDialog.oPopup &&
                typeof oDialog.oPopup.setModal === "function"
              ) {
                oDialog.oPopup.setModal(false);
              }
              this._oDetailDialog.setBindingContext(oBindingContext);
              this._oDetailDialog.open();
            })
            .catch(() => {
              MessageToast.show("Error loading detail dialog");
            });
        } else {
          this._oDetailDialog.setBindingContext(oBindingContext);
          this._oDetailDialog.open();
        }
      },

      onCloseDialog: function () {
        if (this._oDetailDialog) {
          this._oDetailDialog.close();
        }
      },

      onDownloadRFQ: function () {
        MessageToast.show("Download functionality to be implemented");
      },

      onFilterSearch: function (oEvent) {
        var oFilters = this.getView().getModel("filters").getData();

        var aFilters = [];
        if (oFilters.ID && oFilters.ID.length > 0) {
          oFilters.ID.forEach(function (oCond) {
            if (oCond.values && oCond.values[0]) {
              aFilters.push(
                new Filter("ID", FilterOperator.EQ, oCond.values[0])
              );
            }
          });
        }
        if (oFilters.title && oFilters.title.length > 0) {
          oFilters.title.forEach(function (oCond) {
            if (oCond.values && oCond.values[0]) {
              aFilters.push(
                new Filter("title", FilterOperator.Contains, oCond.values[0])
              );
            }
          });
        }
        if (oFilters.status && oFilters.status.length > 0) {
          oFilters.status.forEach(function (oCond) {
            if (oCond.values && oCond.values[0]) {
              aFilters.push(
                new Filter("status", FilterOperator.EQ, oCond.values[0])
              );
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
      },
    });
  }
);
