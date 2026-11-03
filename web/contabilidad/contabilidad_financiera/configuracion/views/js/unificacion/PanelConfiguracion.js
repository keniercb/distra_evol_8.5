/**
 * Created by Emmanuel on 13/03/2017.
 */
Ext.namespace('Configuracion.Unificacion');
Configuracion.Unificacion.PanelConfiguracion = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbTitleConfiguracion,
            idioma: params.idioma,
            perfil: params.perfil,
        });
        this.createButtonPanel();
        this.initEventsConfiguracion();
        Configuracion.Unificacion.PanelConfiguracion.superclass.constructor.call(this);
    },
    createButtonPanel : function () {

        //-----Moneda Unificar-----------
        this.stMonedaUnificar = new Ext.data.Store({
            url: 'cargarmonedas',
            // autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idmoneda'},
                {name: 'codigoiso'}
            ])
        });
        this.cbMonedaUnificar = new Ext.form.ComboBox({
            name: 'cbMonedaUnificar',
            id: 'cbMonedaUnificar',
            selectOnFocus: true,
            editable: true,
            fieldLabel: this.idioma.lbMonedaUnificar,
            allowBlank: false,
            store: this.stMonedaUnificar,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            anchor: '100%',
            mode: 'local',
            triggerAction: 'all',
        });

        //----------Cuenta-------------
        this.stcuenta = new Ext.data.Store({
            url: 'cargarcuentas',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });

        this.cbCuentas = new Ext.contabilidad.util.linkedCombo({
            id: 'cbcuentascontables',
            store: this.stcuenta,
            fieldLabel: this.idioma.lbCuenta,
            displayField: 'denominacion',
            valueField: 'idcuenta',
            listHeight: 200,
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
        });

        //----Tasa Unificacion-------------
        this.stTasaUnificar = new Ext.data.Store({
            url: 'cargartasas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idtasa'},
                {name: 'nombretasa'},
                {name: 'factordeconversion'}
            ])
        });

        this.cbTasaUnificar = new Ext.form.ComboBox({
            name: 'cbTasaUnificar',
            selectOnFocus: true,
            editable: true,
            fieldLabel: this.idioma.lbTasaUnificar,
            allowBlank: false,
            store: this.stTasaUnificar,
            valueField: 'idtasa',
            displayField: 'nombretasa',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            anchor: '100%',
            mode: 'local',
            triggerAction: 'all',
        });

        this.form = new Ext.FormPanel({
            id: 'formAnt',
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .50,
                    bodyStyle: 'padding:3px',
                    layout: 'form',
                    items: [this.cbMonedaUnificar]
                }, {
                    columnWidth: .50,
                    bodyStyle: 'padding:3px',
                    layout: 'form',
                    items: [this.cbTasaUnificar]
                }]
            } ,this.cbCuentas]
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            disabled:true,
            text: this.idioma.lbGuardar,
            tooltip: this.idioma.lbToolGuardar,
            keys: this.kmGuardar = new Ext.KeyMap(Ext.getBody(), [
                {
                    alt: true,
                    key: 'g',
                    fn: function () {
                        if (!this.btnGuardar.disabled) {
                            this.btnGuardar.fireEvent('click', this.btnGuardar);
                        }
                    },
                    scope: this
                }
            ])
        });
        this.tbar=[this.btnGuardar]
        this.items=[this.form];
    },
    initEventsConfiguracion : function () {
        // scope: this,
        this.cbMonedaUnificar.on({
            scope:this,
            select: function ( combo,  record,  index ) {
                this.functionCargarConfiguracion(record.data.idmoneda);
                this.functionComprobarDatosParaGuardar();
                var baseparam = {
                    idmoneda: record.data.idmoneda
                };
                this.cbCuentas.setBaseParams(baseparam);
            },
            render: function () {
                this.stMonedaUnificar.load();
            }
        });
        this.cbTasaUnificar.on({
            scope:this,
            select: function ( combo,  record,  index ) {
                var idmoneda = this.cbMonedaUnificar.getValue();
                var idtasa = record.data.idtasa;
                this.functionCargarConfiguracion(idmoneda, idtasa);
                this.functionComprobarDatosParaGuardar();
            }
        });
        this.cbCuentas.on({
            scope:this,
            select: function ( combo,  record,  index ) {
                this.functionComprobarDatosParaGuardar();
            }
        });

        this.btnGuardar.on({
            scope:this,
            click : function () {
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);

                var idmoneda= this.cbMonedaUnificar.getValue();
                var idcuentapergan = this.cbCuentas.getValue();
                var idtasa = this.cbTasaUnificar.getValue();

                //Obteniendo la relacion de las cuentas a unificar modificadas
                var arrayCuentasMonedaUnificar= new Array();
                var fAddModifiedRecords = function (item) {
                    parIdCuentaOrigenDestino = new Array();
                    parIdCuentaOrigenDestino.push(item.data.idcuenta);
                    parIdCuentaOrigenDestino.push(item.data.idcuentadestino);
                    arrayCuentasMonedaUnificar.push(parIdCuentaOrigenDestino);
                };
                this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.each(fAddModifiedRecords,this.scope);

                Ext.Ajax.request({
                    scope:this,
                    url: 'guardarunificacion',
                    params: {
                        idmoneda : idmoneda,
                        idcuentapergan : idcuentapergan,
                        idtasa : idtasa,
                        arrayCuentasMonedaUnificar : Ext.encode(arrayCuentasMonedaUnificar),
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta == "1") {
                            mostrarMensaje(1, this.idioma.lbExito);
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        });

        this.stMonedaUnificar.on({
            scope: this,
            load: function (store,record,options) {

                if(store.getTotalCount() == 1) {

                    this.cbMonedaUnificar.setValue(record[0].data.idmoneda);
                    this.cbMonedaUnificar.fireEvent('select', this.cbMonedaUnificar, record[0], 0);

                }

            }
        });

        this.functionCargarConfiguracion = function (idMoneda, idTasa) {
            this.stTasaUnificar.baseParams = { 'idMoneda' : idMoneda};
            this.stTasaUnificar.load();

            if (idTasa) {
                this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.baseParams = {
                    'idMoneda' : idMoneda,
                    'idTasa' : idTasa
                };
                this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.load();
            }

            var idmoneda= this.cbMonedaUnificar.getValue();
            Ext.Ajax.request({
                url: 'cargarconfiguracionunificacion',
                scope: this,
                params: {
                    idmoneda : idmoneda,
                    idtasa : idTasa
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if(respuesta['idtasa']) {
                        // if (!idTasa) {
                        //     this.cbTasaUnificar.setValue(respuesta['idtasa']);
                        // }
                        if (idTasa) {
                            // var indexCuenta = this.stcuenta.find('idcuenta', respuesta['idcuentapergan']);
                            // var nombreCuenta = this.stcuenta.getAt(indexCuenta);
                            this.cbCuentas.setValue(respuesta['idcuentapergan'], respuesta['nomcuentapergan']);
                        }
                    } else {
                        this.cbCuentas.clearValue();
                    }
                    this.btnGuardar.setDisabled(false);
                }
            });
        };

        this.functionComprobarDatosParaGuardar = function () {
            var valid = false;

            if(this.cbMonedaUnificar.isValid())
                valid = true;
            else
                valid = false;
            if(this.cbCuentas.isValid())
                valid = true;
            else
                valid = false;
            if(this.cbTasaUnificar.isValid())
                valid = true;
            else
                valid = false;

            this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.each(function (record) {
                if(record.data.idcuentadestino == '')
                    valid = false;
            },this.scope);
            if(valid) {
                this.btnGuardar.setDisabled(false);
            }
        }
    }
});
