Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.winInfoConexion = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 400;
        this.height = 300;
        this.resizable = false;
        this.usarAplicar = false;
        this.idComponent = 'wAddConex';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winInfoConexion.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.guardarInfoConexion(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        this.comboTipo = new LOG.util.ComboBox({
            name: 'tipo',
            editable:false,
            displayField: 'denominacion',
            dataIndex: 'tipo',            
            //disabled: true,// (this.action == 'mod') ? true : false,
            fieldLabel: this.idioma.tfTipoCon,
            //autoCargar: true,
            //allowBlank: false,
            emptyText: this.idioma.lbTxtSelect,
            autoHeight: true,
            store: new Ext.data.ArrayStore({
                fields: ['tipo', 'denominacion'],
                data: [
                    ['PS', 'Prestashop'],
                    ['OP', 'Opencart']
                ]
            }),
            listeners: {
                select: function (campo, value) {
                    campo.setValue(value.data.tipo);
                }
            }
        });

        this.txtfieldUrl = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfURL,
            anchor: '100%',
            editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                }
            }
        });
        this.txtfieldClave = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.tfClave,
            anchor: '80%',
            editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                }
            }
        });

        this.btnProbarConex = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnProbarConex,
            //disabled: true,
            //height: 30,
            width: 40,
            iconCls: 'derecha',
            tooltip: this.idioma.ttBtnProbarConex,
            handler: function () {
                var params = me.getParams(true);

                me.modelo.guardarInfoConexion(params, function () {
                    me.getStorePrincipal().reload();
                });
            }
        });
        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,

        });
        this.clsSuperior.addComponent(this.comboTipo);
        this.clsSuperior.addComponent(this.txtfieldUrl);
        this.clsSuperior.addComponent(this.txtfieldClave);
        this.fsDatosCaja = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosCaja,this.btnProbarConex]
        });
        this.add(this.pMain);
    },
    getParams: function (test) {
        var params = {};
        var me = this;          
        var selected = me._parent.getSmPrincipal().getSelected();
        //params.action = 'mod';
        params.tipo = me.comboTipo.getValue();
        params.url = me.txtfieldUrl.getValue();
        params.clave = me.txtfieldClave.getValue();
        params.idareaventa = selected.data.idareaventa;
        params.test = test;
        return params;
    }
});