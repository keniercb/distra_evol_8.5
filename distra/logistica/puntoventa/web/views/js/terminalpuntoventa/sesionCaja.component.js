Ext.ns('LOG.fac.puntoventa');
LOG.fac.puntoventa.sesionCaja = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        var me = this;
        this.model = new LOG.fac.puntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa/'
        });
        LOG.fac.puntoventa.sesionCaja.superclass.constructor.call(this, config);
       this.cmbCaja.getStore().on({
            load: function () {
                if (this.data.length === 0) {
                    mostrarMensaje(3, me.idioma.msgFailIniciarSesion);
                }

            }
        });
    },
    initComponent: function () {
        var me = this;
        LOG.fac.puntoventa.sesionCaja.superclass.initComponent.call(this);
        this.width = 500;
        this.height = 125;
        this.title = this.idioma.tlIniciarSesion;
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            text: this.idioma.lbBtnIniciar,
            handler: function () {
                if (me.frmIniciarSesion.getForm().isValid() && me.frmIniciarSesion.getForm().isDirty()
                /*&& me.txtEfectivo.getValue()>0*/) {
                    console.info('aqui poner noobligatorio');
                    console.info(me);                    
                    me.model.iniciarSesion({
                        idcaja: me.cmbCaja.getValue(),
                        efectivo: (me.txtEfectivo.getValue())?me.txtEfectivo.getValue():0
                    }, function (rd) {
                        me.close();
                        me.puntoventa = new LOG.fac.puntoventa.View({
                            idioma: me.idioma,
                            datos: rd.datos,
                            acciones: me.acciones || null,
                            tasacambio: rd.tasacambio
                        });
                    });
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.listaBotones.getItem(0), 'handler', function () {
            window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
        });
        this.cmbCaja =  new LOG.util.SelectorTF({
            fieldLabel :this.idioma.lbCmbCaja,
            title :this.idioma.lbCmbCaja,
            url : 'cargarCajas',
            controller : '',
            valueField : 'idcaja',
            displayField : 'concat',
            hiddenName : 'idcaja',
            columns : [
                /*{
                    header : 'Código',
                    dataIndex : 'codigo',
                    width : 120
                },*/{
                    header : this.idioma.lbCmbCaja,
                    dataIndex : 'concat',
                    width : 250,
                    autoExpand : true
                }
            ],
            listeners: {
                select: function (cmb) {
                    /*if(cmb.isDirty() && cmb.isValid()){

                    }*/
                    me.listaBotones.getItem(2).enable();
                }
            }
        });
        /*this.cmbCaja = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCmbCaja,
            name: 'idcaja',
            url: 'cargarCajas',
            valueField: 'idcaja',
            displayField: 'concat',
            anchor: '90%',
            allowBlank: false,
            editable: true,
            lazyInit:false,
            selectOnFocus:false,
            forceSelection: true,
            clearFilterOnReset:true,
            //disabled:true,
            listeners: {
                select: function (cmb) {
                    /!*if (cmb.isDirty() && cmb.isValid() && me.txtEfectivo.isDirty() && me.txtEfectivo.isValid()
                        && me.txtEfectivo.getValue()>0) {
                        me.listaBotones.getItem(2).enable();
                    } else {
                        me.listaBotones.getItem(2).disable();
                    }*!/
                    if(cmb.isDirty() && cmb.isValid()){
                        me.listaBotones.getItem(2).enable();
                    }
                        
                    //cmb.reset();
                }
            }
        });*/
        this.txtEfectivo = LOG.util.Prototipos.inputDecimal({
            //allowBlank: false,
            maxLength: 17,
            regex: LOG.util.Regex.importe,
            regexText: LOG.util.Idioma.ttregexTextimporte,
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbTxtEfectivo/*,
            listeners: {
                focus:function(){
                  me.cmbCaja.enable();
                },
                keyup: function (num) {
                    if (num.isDirty() && num.isValid() && me.cmbCaja.isDirty() && me.cmbCaja.isValid()
                        && me.txtEfectivo.getValue()>0) {
                        me.listaBotones.getItem(2).enable();
                    } else {
                        me.listaBotones.getItem(2).disable();
                    }                
                }
            }*/
        });
        this.clmFrm = LOG.util.UIManager.initColumnForm({
            idioma: this.idioma
        });
        this.clmFrm.addComponent(this.cmbCaja);
        this.clmFrm.addComponent(this.txtEfectivo);
        this.frmIniciarSesion = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: this.clmFrm

        });
        this.add(this.frmIniciarSesion);
    }
});