Ext.ns('LOG.lb.importar')

LOG.lb.importar.View = Ext.extend(LOG.util.Window, {
    width: 600,
    height: 120,
    resizable: false,
    usarAplicar: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        var _this = this;

        this.idioma = LOG.util.UIManager.apply(LOG.lb.importar.Idioma, LOG.util.Idioma);
        config.title = this.idioma.tltitle;

        this.fpImportar = LOG.util.UIManager.initForm({
            fileUpload: true,
            frame: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 50,
            region: 'center',
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            items: [
                {
                    xtype: 'fileupload',
                    emptyText: _this.idioma.lbSellecionArchivo,
                    fieldLabel: _this.idioma.lbArchivo,
                    name: 'file-path',
                    buttonCfg: {
                        text: '...',
                    }
                },
                {
                    xtype: 'hidden',
                    name: 'class'
                },
                {
                    xtype: 'hidden',
                    name: 'params'
                }
            ]
        });
        this.fpImportar.getForm().setValues({class: config.class});
        this.fpImportar.getForm().setValues({params: Ext.encode(config.params)});
        config.items = [this.fpImportar];
        LOG.lb.importar.View.superclass.constructor.call(this, config);
    },
    aceptarFn: function() {
        var _this = this;

        if (!this.fpImportar.getForm().isValid()) {
            mostrarMensaje(3, this.idioma.msjNoSeleccionarArchivo);
        }
        else {
            //Ext.MessageBox.wait(this.idioma.msjImportando, this.idioma.msgEspere || '...');
            this.fpImportar.getForm().submit({
                url: '/logistica/utiles/importar/index.php/importar/importarFichero',
                success: function(form, action) {
                    Ext.MessageBox.hide();
                    if (!action.result.error) {
                        mostrarMensaje(1, _this.idioma.msjImportar);
                    }
                    if (typeof _this.fn == 'function') {
                        _this.fn.createDelegate(this, [action.result]).call();
                    }
                },
                failure: function(form, action) {
                    if (action.result.mensaje == 2) {
                        mostrarMensaje(3, _this.idioma.msjNoFormato);
                    } else if (action.result.mensaje == 4) {
                        mostrarMensaje(2, _this.idioma.msjError1);
                    } else if (action.result.mensaje == 5) {
                        mostrarMensaje(3, _this.idioma.msjFormatoExcel);
                    } 
                    else if (action.result.mensaje == 6) {
                        mostrarMensaje(3,_this.idioma.msjErrorOperacion);
                    } 
                    else {
                        mostrarMensaje(3, _this.idioma.msjError2);
                    }
                }
            });
        }
    }
});

