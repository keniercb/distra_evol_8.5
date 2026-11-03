Ext.onReady(function () {
    var me = this;
    this.defaultComponentsValue = {
        paperSize: "A4",
        orientation: "Horizontal",
        reportType: "HTML"
    };

    var data = window.parent.datareporte;

    Ext.Ajax.request({
        scope: this,
        url: 'asociacionesReporte',
        params: {},
        success: function (response) {
            var me = this;
            this.datos = Ext.decode(response.responseText);
            this.printView = new SCFPrintViewPanel(this.datos, "/contabilidad/comun/SCFPrintView/", this.defaultComponentsValue);
            /*var myMask = new Ext.LoadMask(me.getEl(), {msg: this.idioma.msgCargando});
            myMask.show();*/

            this.task = {
                run: function () {
                    if (window.parent.datareporte) {

                        me.printView.fBUILDReport();
                        window.parent.datareporte = false;
                    }
                },
                interval: 500
            }

            Ext.TaskMgr.start(this.task);
            this.viewport = new Ext.Viewport({
                layout: 'fit',
                items: [this.printView]

            })
        }
    });


    /*this.on('show', function() {
        var myMask = new Ext.LoadMask(this.getView().getEl(), {msg: this.idioma.msgCargando});
        myMask.show();
    });*/
});
