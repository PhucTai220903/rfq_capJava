sap.ui.define(
  [
    "rfqportal/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (BaseController, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("rfqportal.controller.VendorDetail", {
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
            this._loadVendorRFQs(sVendorId);
          }
        }
      },

      onBeforeShow() {
        // Called when view becomes visible
        const oBindingContext = this.getView().getBindingContext();
        if (oBindingContext) {
          const sVendorId = oBindingContext.getProperty("ID");
          if (sVendorId) {
            this._loadVendorRFQs(sVendorId);
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
            this._loadVendorRFQs(sVendorId);
          }
        }
      },

      _loadVendorRFQs(sVendorId) {
        const oRFQTable = this.byId("vendorRFQsTable");
        if (oRFQTable) {
          oRFQTable.unbindItems();
          oRFQTable.bindItems({
            path: "/VendorRFQs",
            filters: [
              new Filter("supplier_id_ID", FilterOperator.EQ, sVendorId),
            ],
            template: new sap.m.ColumnListItem({
              press: this.onRFQPress.bind(this),
              type: "Navigation",
              cells: [
                new sap.m.Text({ text: "{rfqId}" }),
                new sap.m.Text({ text: "{rfqTitle}" }),
                new sap.m.ObjectStatus({
                  text: "{rfqStatus}",
                  state: {
                    path: "rfqStatus",
                    formatter: this.formatStatusState.bind(this),
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
          MessageToast.show(`Navigate to RFQ: ${sRFQId}`);
        }
      },

      onViewRFQQuotations(oEvent) {
        const oContext = oEvent.getSource().getBindingContext();
        if (oContext) {
          const sRFQId = oContext.getProperty("rfqId");
          const sVendorId = oContext.getProperty("supplier_id_ID");
          MessageToast.show(`Loading quotations for RFQ ${sRFQId}`);
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
    });
  }
);
