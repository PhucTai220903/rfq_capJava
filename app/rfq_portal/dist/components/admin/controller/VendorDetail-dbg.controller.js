sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "rfqportal/services/BaseService",
  ],
  (Controller, MessageToast, Filter, FilterOperator, BaseService) => {
    "use strict";

    return Controller.extend(
      "rfqportal.components.admin.controller.VendorDetail",
      {
        formatStatus: BaseService.formatStatus,
        formatStatusState: BaseService.formatStatusState,
        formatDate: BaseService.formatDate,

        onInit() {
          // Listen for binding context changes
          this.getView().attachAfterRendering(this._onAfterRendering, this);
        },

        _onAfterRendering() {
          // Load RFQs when view is rendered and has binding context
          const oBindingContext = this.getView().getBindingContext();
          if (oBindingContext) {
            const sVendorId = oBindingContext.getProperty("ID");
            if (sVendorId) {
              // Gọi hàm load quotations
              this._loadVendorQuotations(sVendorId);
            }
          }
        },

        onBeforeShow() {
          // Called when view becomes visible
          const oBindingContext = this.getView().getBindingContext();
          if (oBindingContext) {
            const sVendorId = oBindingContext.getProperty("ID");
            if (sVendorId) {
              // Gọi hàm load quotations
              this._loadVendorQuotations(sVendorId);
            }
          }
        },

        // Add method to refresh RFQs when binding context changes
        setBindingContext(oContext) {
          // Call parent method
          if (this.getView().setBindingContext) {
            this.getView().setBindingContext(oContext);
          }

          // Load RFQs for new vendor
          if (oContext) {
            const sVendorId = oContext.getProperty("ID");
            if (sVendorId) {
              // Gọi hàm load quotations thay vì RFQs
              this._loadVendorQuotations(sVendorId);
            }
          }
        },

        _loadVendorQuotations(sVendorId) {
          console.log("Loading quotations for vendor:", sVendorId);

          const oTable = this.byId("vendorRFQsTable");
          if (oTable) {
            oTable.unbindItems();
            oTable.bindItems({
              path: "/QuotationDetails", // Sử dụng entity mới
              filters: [
                new Filter("vendorId", FilterOperator.EQ, sVendorId), // Filter theo vendorId
              ],
              template: new sap.m.ColumnListItem({
                type: "Navigation",
                press: this.onRFQPress.bind(this),
                cells: [
                  // Hiển thị thông tin RFQ
                  new sap.m.Text({ text: "{rfqId}" }),
                  new sap.m.Text({ text: "{rfqTitle}" }),
                  new sap.m.ObjectStatus({
                    text: {
                      path: "status",
                      formatter: this.formatStatus.bind(this),
                    },
                    state: {
                      path: "status",
                      formatter: this.formatStatusState.bind(this),
                    },
                  }),
                  new sap.m.Text({
                    text: {
                      path: "created_at",
                      formatter: this.formatDate.bind(this),
                    },
                  }),
                  new sap.m.Link({
                    text: "View Details",
                    press: this.onViewRFQQuotations.bind(this),
                  }),
                ],
              }),
            });
          }
        },

        onRFQPress(oEvent) {
          const oContext = oEvent.getSource().getBindingContext();
          if (oContext) {
            const sRFQId = oContext.getProperty("rfqId");
            const sRFQTitle = oContext.getProperty("rfqTitle");
            const sVendorName = oContext.getProperty("vendorName");
            MessageToast.show(
              `Navigate to RFQ: ${sRFQTitle} (${sRFQId}) from ${sVendorName}`
            );
          }
        },

        onViewRFQQuotations(oEvent) {
          const oContext = oEvent.getSource().getBindingContext();
          if (oContext) {
            const sQuotationId = oContext.getProperty("ID");
            const sRFQTitle = oContext.getProperty("rfqTitle");
            const sVendorName = oContext.getProperty("vendorName");
            MessageToast.show(
              `Quotation ID: ${sQuotationId} for RFQ: ${sRFQTitle} by ${sVendorName}`
            );
          }
        },

        getInitials(sName) {
          if (!sName) return "";
          const aWords = sName.split(" ");
          return aWords
            .map((word) => word.charAt(0))
            .join("")
            .substr(0, 2)
            .toUpperCase();
        },

        onEdit() {
          MessageToast.show("Edit functionality not implemented yet");
        },

        onDelete() {
          const oContext = this.getView().getBindingContext();
          if (oContext) {
            const sVendorName = oContext.getProperty("name");
            MessageToast.show(
              `Delete vendor: ${sVendorName} - Not implemented yet`
            );
          }
        },

        onContact() {
          const oContext = this.getView().getBindingContext();
          if (oContext) {
            const sEmail = oContext.getProperty("email");
            if (sEmail) {
              window.open(`mailto:${sEmail}`, "_blank");
            } else {
              MessageToast.show("No email address found");
            }
          }
        },

        handleClose() {
          // Call parent controller's close method
          const oParentView = this.getView().getParent();
          if (
            oParentView &&
            oParentView.getController &&
            oParentView.getController().onCloseDetail
          ) {
            oParentView.getController().onCloseDetail();
          } else {
            // Fallback - find the FCL and set layout
            let oControl = this.getView().getParent();
            while (oControl && !oControl.isA("sap.f.FlexibleColumnLayout")) {
              oControl = oControl.getParent();
            }
            if (oControl) {
              oControl.setLayout("OneColumn");
            }
          }
        },
      }
    );
  }
);
