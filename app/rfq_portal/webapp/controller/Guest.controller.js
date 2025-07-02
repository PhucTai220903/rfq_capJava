sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
], function (Controller, History, UIComponent, MessageBox) {
    "use strict";

    return Controller.extend("rfqportal.controller.Guest", {
        
        onInit: function() {
            // Initialize role data for ComboBox
            var oModel = new sap.ui.model.json.JSONModel({
                roles: [
                    { key: "ADMIN", text: "Administrator" },
                    { key: "VENDOR", text: "Vendor" },
                    { key: "BUYER", text: "Buyer" }
                ],
                username: "",
                password: "",
                selectedRole: "",
                // Thêm role switching data
                currentUser: null,
                availableRoles: [],
                isLoggedIn: false
            });
            this.getView().setModel(oModel);
            
            // Check if user is already logged in
            this._checkExistingSession();
        },

        _checkExistingSession: function() {
            var userSession = sessionStorage.getItem("userSession");
            if (userSession) {
                var sessionData = JSON.parse(userSession);
                var oModel = this.getView().getModel();
                
                oModel.setProperty("/currentUser", sessionData);
                oModel.setProperty("/isLoggedIn", true);
                
                // Determine available roles for the user
                this._setAvailableRoles(sessionData.username);
            }
        },

        _setAvailableRoles: function(username) {
            var availableRoles = [];
            var oModel = this.getView().getModel();
            
            // Admin user can switch to any role
            if (username === "admin") {
                availableRoles = [
                    { key: "ADMIN", text: "Administrator" },
                    { key: "BUYER", text: "Buyer (as Admin)" },
                    { key: "VENDOR", text: "Vendor (as Admin)" }
                ];
            } else if (username === "vendor") {
                availableRoles = [
                    { key: "VENDOR", text: "Vendor" }
                ];
            } else {
                // Other users can only use their assigned role
                availableRoles = [
                    { key: "BUYER", text: "Buyer" }
                ];
            }
            
            oModel.setProperty("/availableRoles", availableRoles);
        },

        onLogin: function() {
            var oModel = this.getView().getModel();
            var sUsername = oModel.getProperty("/username");
            var sPassword = oModel.getProperty("/password");
            var sRole = oModel.getProperty("/selectedRole");

            if (!sUsername || !sPassword || !sRole) {
                MessageBox.error("Please fill in all required fields.");
                return;
            }

            this._authenticateUser(sUsername, sPassword, sRole);
        },

        _authenticateUser: function(username, password, role) {
            var that = this;
            
            // Mock authentication - replace with real backend call
            if (this._validateCredentials(username, password)) {
                var sessionData = {
                    username: username,
                    role: role,
                    originalRole: role, // Track original role
                    token: "mock-token-" + Date.now(),
                    loginTime: new Date().toISOString()
                };
                
                sessionStorage.setItem("userSession", JSON.stringify(sessionData));
                
                var oModel = this.getView().getModel();
                oModel.setProperty("/currentUser", sessionData);
                oModel.setProperty("/isLoggedIn", true);
                
                // Set available roles
                this._setAvailableRoles(username);
                
                // Navigate based on role
                this._navigateByRole(role);
                
                MessageBox.success("Login successful as " + role);
            } else {
                MessageBox.error("Invalid credentials");
            }
        },

        _validateCredentials: function(username, password) {
            // Mock validation based on your application.yaml
            var validUsers = {
                "admin": "admin",
                "vendor": "vendor"
            };
            
            return validUsers[username] === password;
        },

        // New method: Switch role
        onSwitchRole: function() {
            var that = this;
            var oModel = this.getView().getModel();
            var currentUser = oModel.getProperty("/currentUser");
            var availableRoles = oModel.getProperty("/availableRoles");
            
            if (!currentUser || availableRoles.length <= 1) {
                MessageBox.information("No other roles available for switching.");
                return;
            }
            
            // Create role selection dialog
            this._createRoleSwitchDialog(availableRoles, currentUser);
        },

        _createRoleSwitchDialog: function(availableRoles, currentUser) {
            var that = this;
            
            if (!this._roleSwitchDialog) {
                this._roleSwitchDialog = new sap.m.Dialog({
                    title: "Switch Role",
                    contentWidth: "400px",
                    content: [
                        new sap.m.VBox({
                            class: "sapUiMediumMargin",
                            items: [
                                new sap.m.Label({
                                    text: "Current Role: " + currentUser.role,
                                    class: "sapUiMediumMarginBottom"
                                }),
                                new sap.m.Label({
                                    text: "Switch to:",
                                    class: "sapUiSmallMarginBottom"
                                }),
                                new sap.m.Select({
                                    id: "roleSwitchSelect",
                                    width: "100%",
                                    items: {
                                        path: "/availableRoles",
                                        template: new sap.ui.core.Item({
                                            key: "{key}",
                                            text: "{text}"
                                        })
                                    }
                                })
                            ]
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Switch",
                        type: "Emphasized",
                        press: function() {
                            that._performRoleSwitch();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function() {
                            that._roleSwitchDialog.close();
                        }
                    })
                });
                
                this.getView().addDependent(this._roleSwitchDialog);
            }
            
            this._roleSwitchDialog.setModel(this.getView().getModel());
            this._roleSwitchDialog.open();
        },

        _performRoleSwitch: function() {
            var oSelect = sap.ui.getCore().byId("roleSwitchSelect");
            var sNewRole = oSelect.getSelectedKey();
            
            if (!sNewRole) {
                MessageBox.error("Please select a role to switch to.");
                return;
            }
            
            var oModel = this.getView().getModel();
            var currentUser = oModel.getProperty("/currentUser");
            
            // Update session with new role
            currentUser.role = sNewRole;
            sessionStorage.setItem("userSession", JSON.stringify(currentUser));
            
            // Update model
            oModel.setProperty("/currentUser", currentUser);
            
            // Close dialog
            this._roleSwitchDialog.close();
            
            // Navigate to appropriate service based on new role
            this._navigateByRole(sNewRole);
            
            MessageBox.success("Role switched to " + sNewRole);
        },

        _navigateByRole: function(role) {
            switch(role) {
                case "ADMIN":
                    UIComponent.getRouterFor(this).navTo("RouteAppAdmin");
                    break;
                case "VENDOR":
                    UIComponent.getRouterFor(this).navTo("RouteVendor");
                    break;
                case "BUYER":
                    UIComponent.getRouterFor(this).navTo("RouteBuyer");
                    break;
                default:
                    MessageBox.error("Invalid role specified.");
            }
        },

        onLogout: function() {
            var that = this;
            
            MessageBox.confirm("Are you sure you want to logout?", {
                title: "Confirm Logout",
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        that._performLogout();
                    }
                }
            });
        },

        _performLogout: function() {
            // Clear session
            sessionStorage.removeItem("userSession");
            
            // Reset model
            var oModel = this.getView().getModel();
            oModel.setData({
                roles: [
                    { key: "ADMIN", text: "Administrator" },
                    { key: "VENDOR", text: "Vendor" },
                    { key: "BUYER", text: "Buyer" }
                ],
                username: "",
                password: "",
                selectedRole: "",
                currentUser: null,
                availableRoles: [],
                isLoggedIn: false
            });
            
            // Navigate to login
            UIComponent.getRouterFor(this).navTo("RouteGuest");
            
            sap.m.MessageToast.show("You have been successfully logged out.");
        }
    });
});