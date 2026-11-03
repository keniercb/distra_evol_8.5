Ext.define('Dashboard.controller.AppCntrl', {
    extend: 'Ext.app.Controller',
    views: ['Viewport'],
    refs: [{
        ref: 'view', selector: 'Viewport'
    }],
    init: function () {
        this.listen({
            component: {

            }
        });
    },
    showMsg: function (msg) {
        var el = Ext.get('app-msg'),
            msgId = Ext.id();

        this.msgId = msgId;
        el.update(msg).show();

        Ext.defer(this.clearMsg, 3000, this, [msgId]);
    },

    clearMsg: function (msgId) {
        if (msgId === this.msgId) {
            Ext.get('app-msg').hide();
        }
    }

});


