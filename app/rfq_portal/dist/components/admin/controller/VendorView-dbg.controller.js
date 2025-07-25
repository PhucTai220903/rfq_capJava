sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/f/library",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "rfqportal/services/BaseService",
  ],
  (
    Controller,
    MessageToast,
    fioriLibrary,
    XMLView,
    Filter,
    FilterOperator,
    BaseService
  ) => {
    "use strict";

    return Controller.extend(
      "rfqportal.components.admin.controller.VendorView",
      {
        formatStatus: BaseService.formatStatus,
        formatStatusState: BaseService.formatStatusState,

        onInit() {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("VendorView")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
          this._updateLayout(fioriLibrary.LayoutType.OneColumn);
        },

        _bindVendorTable() {
          const oTable = this.byId("vendorTable");
          const oModel = this.getView().getModel();
          oTable.unbindItems();
          oTable.bindItems({
            path: "/Vendors",
            template: new sap.m.ColumnListItem({
              press: this.onVendorPress.bind(this),
              type: "Navigation",
              cells: [
                new sap.m.Text({ text: "{ID}" }),
                new sap.m.Text({ text: "{name}" }),
                new sap.m.Text({ text: "{email}" }),
                new sap.m.Text({ text: "{country}" }),
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
              ],
            }),
            parameters: {
              expand: "rfqs,quotations",
              select:
                "ID,name,email,country,status,created_at,contactPerson,phone,address,website,rfqCount,quotationCount",
            },
          });
        },

        onVendorPress(oEvent) {
          const oBindingContext = oEvent.getSource().getBindingContext();
          if (!oBindingContext) {
            MessageToast.show("No vendor data found");
            return;
          }
          const sVendorId = oBindingContext.getProperty("ID");
          this._showVendorDetail(sVendorId, oBindingContext);
        },

        _showVendorDetail(sVendorId, oBindingContext) {
          const oFCL = this.byId("fcl");
          if (!oFCL) {
            return;
          }
          if (!this._oVendorDetailView) {
            XMLView.create({
              id: this.getView().getId() + "--vendorDetail",
              viewName: "rfqportal.components.admin.view.VendorDetail",
            })
              .then((oDetailView) => {
                this._oVendorDetailView = oDetailView;
                this._oVendorDetailView.setModel(this.getView().getModel());
                oFCL.addMidColumnPage(this._oVendorDetailView);
                this._oVendorDetailView.setBindingContext(oBindingContext);
                const oDetailController =
                  this._oVendorDetailView.getController();
                if (oDetailController && oDetailController.setBindingContext) {
                  oDetailController.setBindingContext(oBindingContext);
                }
                this._updateLayout(
                  fioriLibrary.LayoutType.TwoColumnsMidExpanded
                );
              })
              .catch(() => {
                MessageToast.show("Error loading vendor details");
              });
          } else {
            this._oVendorDetailView.setBindingContext(oBindingContext);
            const oDetailController = this._oVendorDetailView.getController();
            if (oDetailController && oDetailController.setBindingContext) {
              oDetailController.setBindingContext(oBindingContext);
            }
            this._updateLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
          }
        },

        onRFQPress(oEvent) {
          const oContext = oEvent.getSource().getBindingContext();
          const sRFQId = oContext.getProperty("rfq_id");
          MessageToast.show(`Navigate to RFQ: ${sRFQId}`);
        },

        onViewRFQQuotations(oEvent) {
          const oContext = oEvent.getSource().getBindingContext();
          const sRFQId = oContext.getProperty("rfq_id");
          const sVendorId = oContext.getProperty("supplier_id");
          MessageToast.show(`Loading quotations for RFQ ${sRFQId}`);
        },

        _updateLayout(sLayout) {
          const oFCL = this.byId("fcl");
          if (oFCL) {
            oFCL.setLayout(sLayout);
          }
        },

        onCloseDetail() {
          this._updateLayout(fioriLibrary.LayoutType.OneColumn);
        },

        onRefresh() {
          const oTable = this.byId("vendorTable");
          if (oTable && oTable.getBinding("items")) {
            oTable.getBinding("items").refresh();
            MessageToast.show("Vendor list refreshed");
          }
        },

        onSearch(oEvent) {
          const sQuery = oEvent.getParameter("newValue");
          const oTable = this.byId("vendorTable");
          const oBinding = oTable.getBinding("items");

          if (sQuery && sQuery.length > 0) {
            const aFilters = [
              new Filter("name", FilterOperator.Contains, sQuery),
              new Filter("email", FilterOperator.Contains, sQuery),
              new Filter("country", FilterOperator.Contains, sQuery),
            ];
            const oFilter = new Filter(aFilters, false);
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([]);
          }
        },
      }
    );
  }
);
