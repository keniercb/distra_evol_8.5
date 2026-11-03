Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.winAdicionarcaja = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 1000;
        this.height = 550;
        this.resizable = false;
        this.usarAplicar = false;
        this.idComponent = 'wAddCaja';
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        LOG.fac.configuracionpuntoventa.winAdicionarcaja.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var params = {
                    datos: Ext.encode(me.getParams()),
                    action: this.action,
                    cajaArea: true
                };
                me.modelo.salvar(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        this.getCajasAsignadas();
        if (this.action === 'mod') {
            this.filloutData();
        }
    },
    ventanaAdicionar: function () {
        var me = this;
        this.comboCaja = new Ext.erp.comboNomenclador({
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTipocaja',
            idnom: 'idtipocaja',
            name: 'tipocaja',
            anchor: '0%',
            disabled: /*true,*/ (this.action == 'mod') ? true : false,
            fieldLabel: this.idioma.tfDenominacion,
            //autoCargar: true,
            allowBlank: false,
            emptyText: this.idioma.lbTxtSelect,
            autoHeight: true,
            listeners: {
                select: function (cmb) {
                    if (cmb.isValid() && me.comboArea.isValid() && !me.comboArea.disabled && me.pRelacionar.stGridDerecho.data.items.length > 0) {
                        me.listaBotones.getItem(2).enable();
                    }
                },
                render: function (cmb) {
                    cmb.setEditable(false);
                }
            }
        });

        this.comboArea = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgArea,
            name: 'idareaventa',
            url: 'cargarAreaCaja',
            valueField: 'idareaventa',
            displayField: 'coddenominacion',
            anchor: '50%',
            disabled: (this.action == 'mod') ? true : false,
            allowBlank: false,
            editable: false,
            typeAhead: false,
            listeners: {
                select: function (cmb) {
                    me.comboCaja.getStore().load();
                    if (me.action === 'add') {
                        if (cmb.isValid() && me.comboCaja.isValid() && !me.comboCaja.disabled && me.pRelacionar.stGridDerecho.data.items.length > 0) {
                            me.listaBotones.getItem(2).enable();
                        }
                    } else {
                        if (cmb.isValid() && me.pRelacionar.stGridDerecho.data.items.length > 0) {
                            me.listaBotones.getItem(2).enable();
                        }
                    }
                }
            }
        });

        this.stTipoImpresion = new Ext.data.SimpleStore({
            fields: ['idmodeloimpresion', 'modeloimpresion'],
            data: [[1, 'Factura comercial'], [2, 'Ticket de venta']]
        });

        this.comboTipoImpresion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.tlTipoModeloImp,
            name: 'idmodeloimpresion',
            store: this.stTipoImpresion,
            valueField: 'idmodeloimpresion',
            displayField: 'modeloimpresion',
            anchor: '50%',
            //disabled: (this.action == 'mod') ? true : false,
            //allowBlank: false,
            editable: false,
            typeAhead: false
        });

        this.txtConsumerKey = new LOG.util.Prototipos.inputTexto({
            maxLength: 200,
            fieldLabel: this.idioma.tlConsumerKey,
            emptyText: this.idioma.lbIntroducirConsumerKey,
            anchor: '100%',
            //disabled:true,
            //editable: false,  
            minChars: 8,
            enableKeyEvents: true,
            listeners: {}
        });

        this.txtConsumerSecret = new LOG.util.Prototipos.inputTexto({
            maxLength: 200,
            fieldLabel: this.idioma.tlConsumerSecret,
            emptyText: this.idioma.lbIntroducirConsumerSecret,
            anchor: '100%',
            //disabled:true,
            //editable: false, 
            minChars: 8,
            enableKeyEvents: true,
            listeners: {}
        });

        this.stTipoCaja = new Ext.data.SimpleStore({
            fields: ['idtiporegistradora', 'tipocaja'],
            data: [[-1, 'S/D'],[1, 'QPOS'], [2, 'APOS']]
        });

        this.comboTipoCaja = new LOG.util.ComboBox({
            fieldLabel: 'Tipo de caja',
            name: 'idtiporegistradora',
            store: this.stTipoCaja,
            valueField: 'idtiporegistradora',
            displayField: 'tipocaja',
            anchor: '50%',
            //disabled: (this.action == 'mod') ? true : false,
            //allowBlank: false,
            editable: false,
            typeAhead: false,
            listeners: {
                select: function(cb) {
                    if (cb.getValue() && cb.getValue() != -1) {
                        //me.chxFactSistema.inputValue = 1;
                        me.tab.getTemplateByIndex(1).enable();
                    } else {
                        //me.chxFactSistema.inputValue = 0;
                        me.tab.getTemplateByIndex(1).disable();
                    }
                }
            }
        });

        LOG.util.UIManager.encadenaFn(this.comboArea.getStore(), 'fireEvent', function (e, st, rd) {
            if (e == 'beforeload') {
                st.baseParams.cmbArea = true;
            } else if (rd && rd.length == 0) {
                me.comboArea.disable();
            }
        }, 'SENTVALUE');

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2,
        });
        this.clsSuperior.addComponent(this.comboCaja);
        this.clsSuperior.addComponent(this.comboArea);
        this.clsSuperior.addComponent(this.txtConsumerKey);
        this.clsSuperior.addComponent(this.txtConsumerSecret);
        this.clsSuperior.addComponent(this.comboTipoImpresion);
        this.clsSuperior.addComponent(this.comboTipoCaja);

        this.fsDatosCaja = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });

        let newcolumstoreder = [
                {
                    name: 'pin'
                }, {
                    name: 'tipo'
                },{
                    name: 'tipocajero'
                }, {
                    name: 'new'
                }
            ],
            newcolumnas = [
                {
                    header: 'PIN',
                    dataIndex: 'pin',
                    editable: true,
                    width: 80,
                    editor: LOG.util.Prototipos.inputEntero({
                        listeners: {
                            focus: function(t) {
                                t.selectText(0, t.getValue().length);
                            }
                        }
                    })
                },
                {
                    header: 'Tipo',
                    dataIndex: 'tipocajero',
                    editable: true,
                    width: 100,
                    editor: new LOG.util.ComboBox({
                        name: 'tipocajero',
                        valueField: 'tipocajero',
                        displayField: 'tipocajero',
                        autoLoad: true,
                        allowBlank: false,
                        editable: false,
                        store: new Ext.data.SimpleStore({
                            fields: ['tipo', 'tipocajero'],
                            data: [
                                [1, me.idioma.lbCajero],
                                [5, me.idioma.lbCajeroSup]
                            ]
                        }),
                        listeners: {
                            select: function (cmb, rd) {
                                me.pRelacionar.gridDerecho.getSelectionModel().getSelected().data.tipo = rd.data.tipo;
                            }
                        }
                    }),
                    renderer: function(v, m, rd) {
                        if (rd.data.tipo) {
                            return rd.data.tipo == 1 ? me.idioma.lbCajero : me.idioma.lbCajeroSup;
                        }
                        return ''
                    }
                }
            ];

        this.pRelacionar = new LOG.fac.configuracionpuntoventa.relacionador({
            comboCaja: this.comboCaja,
            comboArea: this.comboArea,
            _parent: this._parent,
            idIzq: 'idUsuario',
            idDer: 'idUsuario',
            trackResetOnLoad: true,
            idioma: this.idioma,
            region: 'center',
            columnsFieldsDer: newcolumnas,
            storeFieldsDer: newcolumstoreder
        });
        this.pRelacionar.stGridDerecho.addListener('add', function (st, rd) {
            if (me.action === 'add') {
                if (me.comboArea.isValid() && !me.comboArea.disabled && me.comboCaja.isValid() && !me.comboCaja.disabled && rd.length >= 1) {
                    me.listaBotones.getItem(2).enable();
                }
            } else {
                if (me.comboArea.isValid() && rd.length >= 1) {
                    me.listaBotones.getItem(2).enable();
                }
            }
        });
        this.pRelacionar.stGridDerecho.addListener('remove', function (st) {
            if (st.data.items.length == 0) {
                me.listaBotones.getItem(2).disable();
            } else {
                me.listaBotones.getItem(2).enable();
            }
        });
        this.pRelacionar.stGridDerecho.addListener('load', function (st, rd) {
            if (rd.length == 0) {
                me.listaBotones.getItem(2).disable();
            } else {
                me.listaBotones.getItem(2).enable();
            }
        });
        this.tab = new LOG.util.UITabTemplate({
            idioma: me.idioma,
            formaVisualizacion: 'panel',
            region: 'center',
        });

        this.clsConexion = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        this.tfModelo = new LOG.util.Prototipos.inputTexto({
            name: 'modelocaja',
            fieldLabel: 'Modelo',
            maxLength: '15',
            minLength: '1',
            //allowBlank: false,
            regex: LOG.util.Regex.cadena,
            listeners: {
                keyup: function(){

                }
            }
        });

        this.tfIdentificador = new LOG.util.Prototipos.inputTexto({
            name: 'identificador',
            fieldLabel: 'Identificador',
            maxLength: '50',
            minLength: '1',
            //allowBlank: false,
            regex: LOG.util.Regex.cadena,
            listeners: {
                keyup: function(){

                }
            }
        });

        this.tfIp = new LOG.util.Prototipos.inputTexto({
            name: 'ip',
            fieldLabel: 'Direcci\xf3n IP',
            maxLength: '15',
            minLength: '1',
            regex: LOG.util.Regex.cadena,
            listeners: {
                keyup: function(){

                }
            }
        });

        this.clsConexion.addComponent(this.tfModelo);
        this.clsConexion.addComponent(this.tfIdentificador);
        this.clsConexion.addComponent(this.tfIp);

        this.fsDatosConexion = new Ext.form.FieldSet({
            anchor: '98%',
            height: 230,
            items: [this.clsConexion]
        });

        this.tab.addTabToTemplete(new Ext.Panel({
                layout: 'fit',
                region: 'center',
                title: 'Usuarios',
                height: 250,
                items: [me.pRelacionar],
                view: function () {
                    return this;
                }
            })
        );
        this.tab.addTabToTemplete(new Ext.Panel({
                layout: 'fit',
                region: 'center',
                disabled: true,
                title: 'Conexi\xf3n',
                height: 250,
                frame: true,
                items: [me.fsDatosConexion],
                view: function () {
                    return this;
                }
            })
        );
        //this.tProductos.addTabToTemplete(this.pServicios);
        this.tab.init();
        let tabPanel = this.tab.view();
        tabPanel.region = 'center';

        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosCaja, tabPanel]
        });
        this.add(this.pMain);
    },
    getParams: function () {
        var params = {};
        if (this.action == 'add') {
            if (this.comboCaja.isValid()) {
                params.idtipocaja = this.comboCaja.getValue();
            }
            if (this.comboArea.isValid()) {
                params.idareaventa = this.comboArea.getValue();
            }
            if (this.pRelacionar.stGridDerecho.data.items.length > 0) {
                params.idusuarios = this.getUsersAdded();
                console.log(params.idusuarios)
            }
            if (this.txtConsumerKey.getValue() != '') {
                params.consumerkey = this.txtConsumerKey.getValue();
            }
            if (this.txtConsumerSecret.getValue() != '') {
                params.consumersecret = this.txtConsumerSecret.getValue();
            }
            if (this.comboTipoImpresion.getValue() != '') {
                params.idmodeloimpresion = this.comboTipoImpresion.getValue();
            }
            if (this.comboTipoCaja.getValue() != '' && this.comboTipoCaja.getValue() != -1) {
                params.idtiporegistradora = this.comboTipoCaja.getValue();
                if (this.tfModelo.getValue() != '') {
                    params.modelocaja = this.tfModelo.getValue();
                }
                if (this.tfIdentificador.getValue() != '') {
                    params.identificador = this.tfIdentificador.getValue();
                }
                if (this.tfIp.getValue() != '') {
                    params.ip = this.tfIp.getValue();
                }
            }
        } else {
            var selected = this._parent.getSmPrincipal().getSelected();
            params.action = 'mod';
            params.idcaja = selected.data.idcaja;
            params.idtipocaja = selected.data.idtipocaja;
            params.idareaventa = (this.comboArea.isDirty()) ? this.comboArea.getValue() : selected.data.idareaventa;
            params.idusuarios = this.getUsersAdded();
            if (this.txtConsumerKey.getValue() != '') {
                params.consumerkey = this.txtConsumerKey.getValue();
            }
            if (this.txtConsumerSecret.getValue() != '') {
                params.consumersecret = this.txtConsumerSecret.getValue();
            }
            if (this.comboTipoImpresion.getValue() != '') {
                params.idmodeloimpresion = this.comboTipoImpresion.getValue();
            }
            if (this.comboTipoImpresion.getValue() != '') {
                params.modeloimpresion = this.comboTipoImpresion.getRawValue();
            }
            if (this.comboTipoCaja.getValue() != '' && this.comboTipoCaja.getValue() != -1) {
                params.idtiporegistradora = this.comboTipoCaja.getValue();
                if (this.tfModelo.getValue() != '') {
                    params.modelocaja = this.tfModelo.getValue();
                }
                if (this.tfIdentificador.getValue() != '') {
                    params.identificador = this.tfIdentificador.getValue();
                }
                if (this.tfIp.getValue() != '') {
                    params.ip = this.tfIp.getValue();
                }
            }

            /*params.consumerkey = this.txtConsumerKey.getValue();
            params.consumersecret = this.txtConsumerSecret.getValue();*/
        }
        return params;
    },
    getUsersAdded: function () {
        var users = this.pRelacionar.stGridDerecho.data.items, idusuarios = [];
        for (var i = 0; i < users.length; i++) {
            // var idUsuario = users[i].data.idusuario ? users[i].data.idusuario : users[i].data.idUsuario;
            //idusuarios.push(idUsuario);
            if (users[i].data.idusuario || users[i].data.idUsuario) {
                idusuarios.push(users[i].data);
            }

        }
        return idusuarios;
    },
    getCajasAsignadas: function () {
        var me = this;
        this.comboCaja.getStore().fireEvent = this.comboCaja.getStore().fireEvent.createSequence(function (e) {
            if (e == 'load') {
                var cajasAsignadas = me._parent.getStorePrincipal().data.items,
                    cajas = me.comboCaja.getStore().data.items;
                for (var i = 0; i < cajasAsignadas.length; i++) {
                    for (var j = 0; j < cajas.length; j++) {
                        if (cajas[j].data.idtipocaja === cajasAsignadas[i].data.idtipocaja && cajasAsignadas[i].data.idareaventa == me.comboArea.getValue()) {
                            me.comboCaja.getStore().removeAt(j);
                        }
                    }
                }
                if (me.action == 'mod') {
                    me.comboCaja.disable();
                }
                if (cajas == 0) {
                    me.comboCaja.disable();
                }

            }

        });
    },
    filloutData: function () {
        let _this = this;
        var selected = this._parent.getSmPrincipal().getSelected();
        this.pMain.getForm().loadRecord(new Ext.data.Record({
            idareaventa: selected.data.area,
            idtipocaja: selected.data.tipocaja,
            idmodeloimpresion: selected.data.idmodeloimpresion,
            idtiporegistradora: selected.data.idtiporegistradora,
        }));
        if (selected.data.idtiporegistradora) {
            _this.comboTipoCaja.fireEvent('select', _this.comboTipoCaja,
                _this.comboTipoCaja.getStore().getById(selected.data.idtiporegistradora),
                _this.comboTipoCaja.getStore().indexOfId(selected.data.idtiporegistradora), 1);
        }
        this.tfModelo.setValue(selected.data.modelocaja);
        this.tfIdentificador.setValue(selected.data.identificador);
        this.tfIp.setValue(selected.data.ip);
        this.pRelacionar.stGridIzquierdo.reload({
            params: {
                idcaja: selected.data.idcaja
            }
        });
        this.pRelacionar.stGridDerecho.reload({
            params: {
                idcaja: selected.data.idcaja
            }
        });
    }
});