/**
 * Restringe las acciones que puede realizar un usuario
 */
var actionValidate = {
    actions: new Array(),
    validate: function (fn,scope) {
        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            params: {
                idfuncionalidad: window.frameElement.id
            },
            callback: function (opts, success, response) {
                if (success) {
                    var grantedActions = Ext.decode(response.responseText),
                        codMsg = grantedActions.codMsg;
                    if (!codMsg) {
                        for (var k in grantedActions) {
                            var id = grantedActions[k].abreviatura,
                                cmp = Ext.getCmp(id);
                            if (cmp) {
                                cmp.show();
                            }
                            if (id) {
                                actionValidate.actions[id] = true;
                            }
                        }
                        if(typeof fn =='function'){
                            fn.call(scope || this)
                        }
                    }
                }
            }
        });
    }
};