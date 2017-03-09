"use strict";

/* Security constants */

var security = {
    
    ROLES_SECURITY: {
        USER: 1,
        EDITOR: 8,
        ADMINISTRATOR: 16,
        SUPERADMINISTRATOR: 32
    },

    checkMinRole: function(req, minRole) {
        if (!req.isAuthenticated()) { return false; }
        return req.user.securityLevel >= minRole;
    }
}

module.exports = security;