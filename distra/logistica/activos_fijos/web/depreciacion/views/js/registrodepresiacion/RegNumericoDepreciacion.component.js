/*UCID.portal.cargarEtiquetas('gestregistrodepreciacion', cargarInterfaz);

 ////------------ Inicializo el singlenton QuickTips ------------////
 Ext.QuickTips.init();
 perfil = window.parent.parent.parent.UCID.portal.perfil;

 function cargarInterfaz(perfil, etiquetas) {
 var Viewport = new Ext.LOG.registroNumericoDepreciacion.ventana({
 idioma: perfil.etiquetas
 });
 }*/

Ext.ns('Ext.LOG.registroNumericoDepreciacion');
Ext.LOG.registroNumericoDepreciacion.ventana = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.autoLoad = true;
        this.dirController = '/logistica/activos_fijos/depreciacion/index.php/gestregistrodepreciacion';
        this.busquedaBasica = false;
        this.urlBusquedaGridPrincipal = 'cargarGridCentral';
        this.gridEditable = true;
        this.pruneModifyRecord = true;
        Ext.LOG.registroNumericoDepreciacion.ventana.superclass.constructor.call(this, config);

        if (!arrCampos) {
            this.arrCampos = new Array();
        }

    },
    initDefaultColumns: function () {
        var _this = this;
        this.recursoconsu = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            maxLength: '19',
            listeners:{
                'change': function(field, newValue, oldValue){
                    var sm = _this.gpPrincipal.getSelectionModel().getSelections();
                    sm[0].set('lecturarecurso', parseInt(sm[0].data.cantidadrecursoconsumidoaux)+parseInt(newValue));
                    if (activCamposTransp[0] == 1) {
                        var combustible = parseInt(newValue) * sm[0].data.normacombustible;
                        // sm[0].set('consumo',combustible/100);
                        sm[0].set('consumo', Math.round(combustible/100,0));
                        var redondeo = parseInt(sm[0].data.endeposito) - combustible /100;
                        redondeo = Math.round(redondeo,0);

                        if(parseInt(sm[0].data.endeposito) >= combustible /100){
                            sm[0].set('endeposito',redondeo);
                        }
                        else{
                            mostrarMensaje(2,'La cantidad consumida por el medio no puede ser mayor que la existente en dep&oacute;sito.');

                            _this.getStorePrincipal().load({
                                params: {
                                    vista: (_this.vista)?_this.vista:null
                                }
                            });
                        }
                    }
                    _this.botonGuardar.enable();
                }
            }
        });

        this.datefieldFecha = new Ext.form.DateField({
            name: 'fecha',
            editable: false,
            format: 'd/m/Y',
            /*listeners:{
                'change': function(field, newValue, oldValue){
                    if(newValue.format('d/m/Y') > fechacontable){
                        //mensaje para cuando la fecha nueva es mayor que la fecha contable
                        mostrarMensaje(2,'La fecha de la lectura debe ser menor o igual que la fecha contable.');
                    }else{
                        _this.botonGuardar.enable();
                    }
                }
            }*/
        });

        this.lecturarecurso = new LOG.util.Prototipos.inputEntero({//final
            width: 100,
            maxLength: '19',
            editable: false,
            listeners:{
                'change': function(field, newValue, oldValue, row){
                    var sm = _this.gpPrincipal.getSelectionModel().getSelections();
                    sm[0] = (row) ? row : sm[0];
                    //var depo = (sm[0].modified && sm[0].modified.endeposito) ? sm[0].modified.endeposito : sm[0].get('endeposito');

                    if(activCamposTransp[0] == 1 && newValue < sm[0].data.cantidadrecursoconsumidoaux){
                        mostrarMensaje(2, 'La lectura final debe ser mayor o igual a la anterior agregada.');
                    }else
                        var recursoconsumido = parseInt(parseInt(newValue) - sm[0].data.cantidadrecursoconsumidoaux);
                        sm[0].set('recursoconsumido', recursoconsumido);


                    if (activCamposTransp[0] == 1) {

                        var combustible = parseInt(recursoconsumido) * sm[0].data.normacombustible;
                        sm[0].set('consumo',Math.round(combustible/100,0));
                        var redondeo = parseInt(sm[0].data.endeposito) - combustible /100;
                        redondeo = Math.round(redondeo,0);

                        if(parseInt(sm[0].data.endeposito) > combustible /100){
                            sm[0].set('endeposito',redondeo);
                        }
                        else{
                            mostrarMensaje(2,'La cantidad consumida por el medio no puede ser mayor que la existente en dep&oacute;sito.');

                            _this.getStorePrincipal().load({
                                params: {
                                    vista: (_this.vista)?_this.vista:null
                                }
                            });
                        }

                    }

                    _this.botonGuardar.enable();
                }
            }
        });
        
         this.cantentregada = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            maxLength: '19',
            editable: true,
            listeners:{
                'change': function(field, newValue, oldValue, row){
                    var sm = _this.gpPrincipal.getSelectionModel().getSelections();
                    sm[0] = (row) ? row : sm[0];
                    var depo = (sm[0].modified && sm[0].modified.endeposito) ? sm[0].modified.endeposito : sm[0].get('endeposito');
                    var redondeo = parseInt(depo) + parseInt(newValue);
                    redondeo = Math.round(redondeo);
                    sm[0].set('endeposito', redondeo);
                }
            }
        });

        this.addGridColumn({
            dataIndex: 'denidentificador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'valoridentificador',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.lbCmDenominacion,
            id: 'denominacion',
            dataIndex: 'denominacion',
            width: 50,
            default: true,
            agrupador: true
        });

        /*
        this.addGridColumn({
            header: _this.idioma.lbCmIdentificador,
            width: 200,
            dataIndex: 'valoridentificador',
            default: true,
            autoExpand: true,
            filter:{
                type:'string',
                dataIndex:'valoridentificador'
            },
            renderer: function (value, metaData, record) {
                if (value != null) {
                    return '<p><b>' + record.data.denidentificador + ": </b>" + value;
                }
            }
        });*/

        ////////////////////////////////
        this.addGridColumn({
            header: 'Nro Inventario',
            width: 200,
            dataIndex: 'nroinventario',
            default: true,
            autoExpand: true,
            filter:{
                type:'string',
                dataIndex:'nroinventario'
            }
        });

        this.addGridColumn({
            header: 'Nro Serie',
            width: 200,
            dataIndex: 'nroserie',
            default: true,
            autoExpand: true,
            filter:{
                type:'string',
                dataIndex:'nroserie'
            }
        });


        this.addGridColumn({
            header: 'Matrícula',
            width: 200,
            dataIndex: 'nromatricula',
            default: true,
            autoExpand: true,
            filter:{
                type:'string',
                dataIndex:'nromatricula'
            }
        });


        this.addGridColumn({
            header: _this.idioma.lbCmFecha,
            width: 100,
            dataIndex: 'fecharecurso',
            default: true,
            editable: true,
            editor: _this.datefieldFecha,
             filter : {
                type: 'date',
                dataIndex: 'fecharecurso'
            },
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                var result = value;
                if (value != null && typeof value == "object") {
                    result = value.dateFormat('d/m/Y');
                    record.set('fecharecurso', value.dateFormat('d/m/Y'));
                }
                return result;
            }
        });

        this.addGridColumn({//inicial
            header: _this.idioma.lbCmCantidadRecursoConsumidoinicio,
            width: 150,
            dataIndex: 'cantidadrecursoconsumido',
            tooltip: _this.idioma.lbTtRecursoTotal,
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbCmCantidadRecursoConsumidofin,
            width: 150,
            dataIndex: 'lecturarecurso',
            tooltip: _this.idioma.lbTtRecursoTotal,
            default: true,
            editable: true,
            editor: _this.lecturarecurso/*,
            filter:{
                type:'numeric',
                dataIndex:'lecturarecurso'
            }*/
        });

        this.addGridColumn({
            header: _this.idioma.lbCmRecursoConsumidoo,
            width: 150,
            dataIndex: 'recursoconsumido',
            tooltip: _this.idioma.lbTtRecurso,
            default: true,
            editable: true,
            editor: _this.recursoconsu
            /*filter:{
                type:'numeric',
                dataIndex:'recursoconsumido'
            }*/
        });

        if (activCamposTransp[0] == 1){
            this.addGridColumn({
                header: _this.idioma.lbCmNorma,
                width: 150,
                dataIndex: 'normacombustible',
                // tooltip: _this.idioma.lbTtRecursoTotal,
                default: true,
                editable: false/*,
                 //editor: _this.cantentregada,
                 filter:{
                 type:'numeric',
                 dataIndex:'lecturarecurso'
                 }*/
            });

            this.addGridColumn({
                header: _this.idioma.lbCmEnDeposito,
                width: 50,
                dataIndex: 'endeposito',
                // tooltip: _this.idioma.lbTtRecursoTotal,
                default: true,
                editable: false/*,
                 //editor: _this.cantentregada,
                 filter:{
                 type:'numeric',
                 dataIndex:'lecturarecurso'
                 }*/
            });

            this.addGridColumn({
                header: _this.idioma.lbCmCantEntregada,
                width: 50,
                dataIndex: 'cantentregadacomb',
                // tooltip: _this.idioma.lbTtRecursoTotal,
                default: true,
                editable: true,
                editor: _this.cantentregada/*,
                 filter:{
                 type:'numeric',
                 dataIndex:'lecturarecurso'
                 }*/
            });

            this.addGridColumn({
                header: 'Consumo',
                width: 150,
                dataIndex: 'consumo',
                default: true,
                editable: false
                /* filter:{
                 type:'numeric',
                 dataIndex:'lecturarecurso'
                 }*/
            });
        }


        this.addGridColumn({
            id: 'idregnumericoactivo',
            dataIndex: 'idregnumericoactivo'
        });
        this.addGridColumn({
            id: 'idrecursoregnumericoactivo',
            dataIndex: 'idrecursoregnumericoactivo'
        });
        this.addGridColumn({
            dataIndex: 'cantidadrecursoconsumidoaux',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'endepositofijo',
            default: false
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        /*this.btnImportarLct = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.lbBtnImportarLectura,
            iconCls: 'numeroserie',
            isList: false,
            disabled: false,
            handler: function () {
                _this.cambiarVista(1, null);
            }
        });*/

        /*this.btnManual = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.lbBtnManual,
            iconCls: 'numeroserie',
            isList: false,
            disabled: true,
            handler: function () {
                _this.cambiarVista(2, null);
            }
        });*/

       /* this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnVista,
            iconCls: 'ver',
            tooltip: _this.idioma.btnTtCambiarVista,
            menu: [_this.btnManual, _this.btnImportarLct]
        }));*/


        /*this.botonAdicionar = new LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.lbTtBtnAdicionar,
            hidden: false,
            disabled: true,
            handler: function () {
                _this.addRecursos();
            }
        });
        this.addToolbarButton(_this.botonAdicionar);*/
        
        /*
        this.botonEliminar = new LOG.util.Prototipos.botonEliminar({
            disabled: true,
            tooltip: _this.idioma.lbTtBtnEliminar,
            handler: function () {

                var arrayeliminar = _this.smGridPrincipal.getSelections();
                var datoseliminar = Array();
                mostrarMensaje(2, _this.idioma.lbMsgDatosEliminados, function (btn) {
                    if (btn == "ok") {
                        Ext.MessageBox.wait(_this.idioma.lbTextEliminarDatos, _this.idioma.msgEspere || '...');
                        var sm = _this.gpPrincipal.getSelectionModel().getSelections();
                        var bandera = false;
                        Ext.each(sm, function (a) {
                            datoseliminar.push(a.data.idrecursoregnumericoactivo);
                        });
                        _this.getEliminarDatos(datoseliminar);
                    }
                });
            },
            controlFn: function (b, _caller) {

                if (_caller.grantedAction('btnEliminar')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        })
        this.addToolbarButton(_this.botonEliminar);*/
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'importar',
            hidden: false,
            id: 'btnImportarDatosHorasMaq',
            disabled: false,
            text: _this.idioma.lbBtnImportar,

            tooltip: _this.idioma.lbTtBtnImportar,
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'I'
            },
            handler: function () {
                _this.importarFileUploadField(_this);
            }
            /*controlFn: function (b, _caller) {

             if (_caller.grantedAction('btnImportarDatos')) {
             b.setVisible(true);

             } else {
             b.setVisible(false);
             }

             }*/
        }));
        this.botonGuardar = new LOG.util.Prototipos.botonGuardar({
            text: 'Guardar histórico',
            tooltip: 'Guardar histórico de recursos consumidos',
            hidden: true,
            disabled: true,
            handler: function () {
                _this.guardarhistorico()   
            }
        });

        this.addToolbarButton(_this.botonGuardar);
        /*this.botonGuardar = new LOG.util.Prototipos.botonGuardar({
            tooltip: _this.idioma.lbTtBtnGuardar,
            hidden: false,
            disabled: true,
            handler: function () {
                if(_this.gpPrincipal.getStore().getModifiedRecords()){
                    _this.getGuardarDatos();
                }
            }
        })
        this.addToolbarButton(_this.botonGuardar);*/
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idlecturasrecursos'
        }));
    },
    getEliminarDatos: function (datoseliminar) {
        var _this = this;
        Ext.Ajax.request({
            url: 'eliminarDatos',
            method: 'POST',
            params: {
                vista: _this.vista,
                datoseliminar: Ext.encode(datoseliminar)
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (rd.msg == 1) {
                    mostrarMensaje(2, _this.idioma.lbTextDatosEliminados);
                    _this.getStorePrincipal().load({
                        params: {
                            vista: _this.vista
                        }
                    });
                }

            }
        });
    },
    getGuardarDatos: function () {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.MaskGuardarDocumento, _this.idioma.lbEspere || '...');
        var arrayrecursoView = new Array();

        Ext.each(_this.gpPrincipal.getStore().getModifiedRecords(), function (r) {
            if(r.modified.fecharecurso && !r.modified.lecturarecurso && !r.modified.recursoconsumido){
                r.data.lecturarecurso = parseInt(r.data.cantidadrecursoconsumidoaux) + parseInt(r.data.recursoconsumido);
            }
           // r.data.endeposito = parseInt(r.data.cantentregadacomb) + parseInt(r.data.endeposito);
            r.data.manual = 1;
            arrayrecursoView.push(r.data);
        });

       _this.gpPrincipal.getStore().commitChanges();

        Ext.Ajax.request({
            url: 'guardarDatos',
            method: 'POST',
            params: {
                arrayrecurso: Ext.encode(arrayrecursoView)
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                if (rd.msg == 3) {
                    mostrarMensaje(3, _this.idioma.msgErrorGuardar, function (btn) {
                        if (btn == "ok") {
                            _this.getStorePrincipal().load({
                                params: {
                                    vista: _this.vista
                                }
                            });
                        }
                    });
                }

                if (rd.msg == 4) {
                    mostrarMensaje(3, 'La fecha de creaci&oacute;n del excel debe ser mayor que la fecha de la informaci&oacute;n en el sistema.', function (btn) {
                        if (btn == "ok") {
                            _this.getStorePrincipal().load({
                                params: {
                                    vista: _this.vista
                                }
                            });
                        }
                    });
                }

                if (rd.success && rd.msg != 3 && rd.msg!= 4) {
                    mostrarMensaje(2, _this.idioma.msgGuardarCorrecta);
                    _this.getStorePrincipal().load({
                        params: {
                            vista: _this.vista
                        }
                    });
                }
            }
        });

    },
    addRecursos: function () {
        var _this = this;
        var sm = _this.gpPrincipal.getSelectionModel().getSelections();
        var clsPanelfieltres = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var recursoconsuadd = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            fieldLabel: _this.idioma.lbCmRecursoConsumidoo,//'Recurso consumido',
            maxLength: '19',
            allowBlank: false,
            editable: false,
            listeners:{
                'change': function(field, newValue, oldValue){
                    lecturarecurso.reset();
                    lecturarecurso.allowBlank = true;
                   // lecturarecurso.reset();
                   // lecturarecurso.setValue(parseInt(sm[0].data.cantidadrecursoconsumidoaux) + parseInt(newValue));
                    //_this.botonGuardar.enable();
                }
            }
        });
        var lecturarecurso = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            fieldLabel: _this.idioma.lbCmCantidadRecursoConsumidofin,
            maxLength: '19',
            editable: false,
            allowBlank: false,
            listeners:{
                'change': function(field, newValue, oldValue){

                    recursoconsuadd.reset();
                    recursoconsuadd.allowBlank = true;
                    // var smlec = _this.gpPrincipal.getSelectionModel().getSelections();
                  /*  if(newValue < sm[0].data.cantidadrecursoconsumidoaux){
                        mostrarMensaje(2, '_this.idioma.msgGuardarCorrecta');
                    }else
                        recursoconsu.setValue(parseInt(parseInt(newValue) - sm[0].data.cantidadrecursoconsumidoaux));
                    */
                    // _this.botonGuardar.enable();
                }
            }
        });

        var datefieldFecha = new Ext.form.DateField({
            name: 'fecha',
            fieldLabel: 'Fecha',
            allowBlank: false,
            editable: false,
            format: 'd/m/Y'
        });
        var cantentregada = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            fieldLabel: _this.idioma.lbCmCantEntregada,//'Recurso consumido',
            maxLength: '19',
            allowBlank: true,
            editable: false,
            listeners:{
                'change': function(field, newValue, oldValue){

                }
            }
        });

        clsPanelfieltres.addComponent(lecturarecurso);
        clsPanelfieltres.addComponent(recursoconsuadd);
        clsPanelfieltres.addComponent(datefieldFecha);
        clsPanelfieltres.addComponent(cantentregada);
        this.formulario = new Ext.form.FormPanel({
            autoHeight: true,
            frame: true,
            layout: 'form',
            items: [clsPanelfieltres],
            listeners: {
                'clientvalidation': function (fp, valid) {
                    var checkdirty = false;

                    fp.getForm().items.each(function (field) {
                        if (field.isDirty() && valid) {
                            checkdirty = true;
                            _this.btnAdd.enable();
                        }
                    });
                    if (!checkdirty) {
                        _this.btnAdd.disable();
                    }
                }
            }

        });


        this.btnAdd = new LOG.util.Prototipos.botonAdicionar({
                iconCls: 'aceptar',
                text: 'Adicionar',
                disabled: true,
                //tooltip: 'config.etiquetas.lbTtbtnAceptar',
                width: 30,
                handler: function () {

                    var sm = _this.gpPrincipal.getSelectionModel().getSelections();
                    var bandera = false;
                    Ext.each(sm, function (a) {
                        var fecha = datefieldFecha.getValue();

                        if (a.data.fecharecurso == fecha) {
                            bandera = true;
                            mostrarMensaje(3, _this.idioma.msgErrorGuardar);
                            return;
                        }
                        else if (a.data.fecharecurso > fecha) {
                            bandera = true;
                            mostrarMensaje(3, _this.idioma.msgErrorFechar);
                            return;
                        }
                    });

                    if (!bandera) {
                        _this.getAddRecurso(recursoconsuadd, datefieldFecha, lecturarecurso, cantentregada);
                        win_gestionar.close();
                    }
                }
            }
        );
        var win_gestionar = new Ext.Window({
            layout: 'fit',
            width: 450,
            title: "Adicionar recursos consumido",
            modal: true,
            resizable: false,
            closeAction: 'hide',
            contrain: true,
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                   //tooltip: 'config.etiquetas.lbTtbtnCancelar',
                    width: 20,
                    handler: function () {
                        win_gestionar.close();
                    }
                }, _this.btnAdd

            ],
            items: [_this.formulario]
        });
        win_gestionar.show();
    },
    getAddRecurso: function (recursoconsuadd, datefieldFecha, lecturarecurso, cantentregada) {
        var _this = this;
        var sm = _this.gpPrincipal.getSelectionModel().getSelections();


        Ext.each(sm, function (r) {
        if(lecturarecurso.getValue()){
            if(lecturarecurso.getValue() > r.get('cantidadrecursoconsumidoaux')){
                r.set('recursoconsumido',
                    parseInt(lecturarecurso.getValue()) - parseInt(r.get('cantidadrecursoconsumidoaux'))
                );
                r.set('lecturarecurso', lecturarecurso.getValue());

                r.set('fecharecurso', datefieldFecha.getValue());

            }
        }
        if(recursoconsuadd.getValue()){
            r.set('lecturarecurso',
                parseInt(recursoconsuadd.getValue()) + parseInt(r.get('cantidadrecursoconsumidoaux'))
            );
            r.set('recursoconsumido', recursoconsuadd.getValue());
        }

            r.set('fecharecurso', datefieldFecha.getValue());
            var combustible = parseInt(r.get('recursoconsumido')) * r.get('normacombustible');
            //sm[0].set('consumo',combustible/100);
            sm[0].set('consumo',Math.round(combustible/100,0));
            var redondeo = r.get('endeposito') - combustible /100; //parseInt(sm[0].data.endeposito) - combustible /100;
            redondeo = Math.round(redondeo,0);
            if(parseInt(r.get('endeposito')) > combustible /100){
                r.set('endeposito',redondeo);
            }
            else{
                mostrarMensaje(2,'La cantidad consumida por el medio no puede ser mayor que la existente en dep&oacute;sito.');

                _this.getStorePrincipal().load({
                    params: {
                        vista: (_this.vista)?_this.vista:null
                    }
                });
            }
            if(cantentregada.getValue()){
                r.set('endeposito', parseInt(r.get('endepositofijo')) + parseInt(cantentregada.getValue()));
                r.set('cantentregadacomb',cantentregada.getValue());
            }
        });
        //_this.botonGuardar.enable();
        _this.gpPrincipal.getView().refresh();

    },
    cambiarVista: function (vista, filtro) {

        var _this = this;
        this.vista = vista;
        if (vista == 2) {
            _this.habilitarColum();
            _this.listaBotones.getItem(1).hide();
            //_this.btnImportarLct.enable();
            //_this.btnManual.disable();
            //_this.botonGuardar.show();
            //_this.botonAdicionar.show();
            //_this.botonAdicionar.disable();
            _this.getStorePrincipal().on({
                'load': function (st, r, options) {
                    st.initBaseParams.vista = vista;
                }
            });
            _this.getStorePrincipal().load({
                params: {
                    vista: vista
                }
            });

        }
        if (vista == 1) {
            _this.desaHabilitarColum();
            _this.listaBotones.getItem(1).show();
            //_this.btnImportarLct.disable();
            //_this.botonAdicionar.hide();
            //_this.btnManual.enable();
            //_this.botonGuardar.hide();
            _this.getStorePrincipal().on({
                'load': function (st, r, options) {
                    st.initBaseParams.vista = vista;
                }
            });
            _this.getStorePrincipal().load({
                params: {
                    vista: vista
                }
            });
        }

    },
    eliminarDatos: function (name) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgCargando || '...');
        Ext.Ajax.request({
            url: 'eliminarDatos',
            method: 'POST',
            params: {
                name: Ext.encode(name)
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
               /* if (name == 'buscarfecha') {
                    if (rd.data == '') {
                        mostrarMensaje(2, _this.idioma.lbTextConfirmarEliminar);
                    } else {
                        var mostrarDatosExel = new Ext.LOG.registroNumericoDepreciacion.mostrarDatosEliminar({
                            idioma: _this.idioma,
                            valor: rd,
                            storePrincipalView: _this.getStorePrincipal()
                        });

                        mostrarDatosExel.init();
                        mostrarDatosExel.view();
                    }
                } else {*/
                    if (rd.msg == 1) {
                        mostrarMensaje(2, _this.idioma.lbTextDatosEliminados);
                        _this.gridCEntral.load();
                    }
               // }
            }
        })
    },
    importarFileUploadField: function (scope) {
        var _this = this;

        _this.winImportar = new Ext.LOG.registroNumericoDepreciacion.importarFile({
            idioma: _this.idioma,
            scope: scope
        });
        _this.winImportar.show();
    },
    render: function () {
        var _this = this;
        var vista = Ext.LOG.registroNumericoDepreciacion.ventana.superclass.render.call(this);

        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                if (_this.vista) {
                    st.initBaseParams.vista = _this.vista;
                }else{
                    st.initBaseParams.vista = 2;
                    _this.habilitarColum();
                }
            },
            'load': function (st) {
                /*if(st.data.items.length == 0){
                    mostrarMensaje(2, "No existen activos asignados al método de depreciación de Unidades producidas");
                }*/
                if(st.data.items.length == 0){
                    mostrarMensaje(3, 'Debe configurar en los datos por naturaleza el campo "Cantidad de recursos conumidos".');
                }
                if (_this.vista) {
                    st.initBaseParams.vista = _this.vista;
                }else{
                    st.initBaseParams.vista = 2;
                    _this.habilitarColum();
                }
                if (st.data.items.length > 0) {
                    _this.botonGuardar.enable();
                }
               // _this.botonGuardar.disable();*/
            }
        });
        /*_this.smGridPrincipal.on({
            'rowselect': function (sm, rowIndex, record) {
               // _this.getGridPrincipal().startEditing(rowIndex, 4);


                if (sm.selections.items.length == 1) {
                    //_this.botonAdicionar.enable();
                    //_this.botonEliminar.enable();
                }
            },
            'rowdeselect': function (sm, rowIndex, record) {
                if (sm.selections.items.length == 0) {
                    //_this.botonAdicionar.disable();
                    //_this.botonEliminar.disable();
                }
            }
        });*/
    },
    habilitarColum: function () {
        var _this = this;
        _this.getGridPrincipal().getColumnModel().setEditable(_this.getGridPrincipal().getColumnModel().findColumnIndex('recursoconsumido'), true);
        _this.getGridPrincipal().getColumnModel().setEditable(_this.getGridPrincipal().getColumnModel().findColumnIndex('fecharecurso'), true);
    }, guardarhistorico: function (valor) {
        var _this = this;

        _this.array = Array();
         let array2 = Array();
       
        //var gridcentral = _this.getStorePrincipal().json.data.items;
        for (let i = 0; i < _this.getStorePrincipal().data.items.length; i++) {
           array2.push({
            idregnumerico: _this.getStorePrincipal().data.items[i].json.idregnumerico,
            recursoconsumido: _this.getStorePrincipal().data.items[i].json.recursoconsumido
            });   
        }
     
        // Ext.each(gridcentral, function(a){
        //     _this.array.push({
        //         insertar: a.data.idregnumerico
        //     }); 
        // });
        mostrarMensaje(2, '¿Está seguro que quiere guardar el histórico de recursos consumidos?', function (btnPress) {
        if (btnPress === 'ok') {
            Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgHistorico || '...');
            Ext.Ajax.request({
                url: 'insercionDatos',
                method: 'POST',
                params: {
                    valor: Ext.encode(array2)
                },
                callback: function (options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    if (rd.datos == 1) {
                        Ext.MessageBox.hide();
                        //_this.getVistaPrincipal().close();
                        //_this.gridCEntral.load();
                        mostrarMensaje(2, _this.idioma.msgGuardarCorrecta);
                    }
                }
            });
        }
    })
        
    },
    desaHabilitarColum: function () {
        var _this = this;
        _this.getGridPrincipal().getColumnModel().setEditable(_this.getGridPrincipal().getColumnModel().findColumnIndex('recursoconsumido'), false);
        _this.getGridPrincipal().getColumnModel().setEditable(_this.getGridPrincipal().getColumnModel().findColumnIndex('fecharecurso'), false);
    }
});


Ext.LOG.registroNumericoDepreciacion.importarFile = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.layout = 'fit';
        this.scope = config.scope;
        Ext.LOG.registroNumericoDepreciacion.importarFile.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.lbProdalt);
        this.panelDatos();
        this.width = 445;
        this.height = 130;
    },
    initComponent: function (config) {
        var _this = this;
        Ext.LOG.registroNumericoDepreciacion.importarFile.superclass.initComponent.call(this);

        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function () {
                if (_this.fileuploadfield.getValue() == null || _this.fileuploadfield.getValue() == '') {

                } else {
                    var dat = _this.fileuploadfield.getValue().split(".");
                    
                    if (dat[dat.length - 1] == "") {
                    }
                    else if (dat[dat.length - 1] != "xls") {
                        mostrarMensaje(2, _this.idioma.lbMsgArchivoIncorrecto)
                    }
                    else if (_this.panel.getForm().isValid()) {

                        Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.lbMsgCargarDatos || '...');
                        _this.panel.getForm().submit({
                            url: 'importarDatos',
                            success: function (fp, response) {
                                var resp = Ext.decode(response.responseText);
                                
                                _this.scope.getStorePrincipal().load({
                                    callback : function (records) {
                                        Ext.Ajax.request({
                                                    url: 'insercionDatos',
                                                    method: 'POST',
                                                    params: {
                                                        valor: Ext.encode(records.map(function (items) {
                                                            return items.json.idregnumerico;
                                                        })),
                                                        recursoconsumido : Ext.encode(records.map(function (items) {
                                                            return items.json.recursoconsumido;
                                                        }))
                                                    },
                                                    callback: function (options, success, response) {
                                                        // var rd = Ext.decode(response.responseText);
                                                    }
                                                })
                                    }
                                });
                                Ext.MessageBox.hide();
                                var msg = "Los datos fueron importados correctamente.";
                                mostrarMensaje(1, msg);
                            },
                            failure: function(form, action) {
                                var resp = Ext.decode(action.response.responseText);
                                var msg = "Excel inválido. Pruebe creando un excel completamente nuevo y copie y pegue los datos. El excel debe contener solamente 2 columnas."
                                mostrarMensaje(3, msg);     
                            }
                        });
                    }
                    _this.close();
                }
            }
        });
    },
    panelDatos: function () {
        var _this = this;
        this.fileuploadfield = new Log.Util.FileUploadField({
            name: 'fileUpload',
            buttonCfg: {
                iconCls: 'icondistra-importar'
            },
            fieldLabel: _this.idioma.lbCmArchivo,
            buttonText: "",
            emptyText: _this.idioma.lbMsgSeleccioneArchivo
        });
        this.panel = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            fileUpload: true,
            anchor: '100%',
            autoHeight: true,
            bodyStyle: 'padding: 20px 10px 0 10px; margin-bottom:10px',
            labelWidth: 50,
            defaults: {
                anchor: '90%',
                msgTarget: 'side'
            },
            items: [_this.fileuploadfield]
        });


        this.add(this.panel);
    },
    importarDatosKm: function (valor) {
        var _this = this;
        var gridcentral =  _this.scope.getStorePrincipal().data.items;
        Ext.each(valor.arrayfila, function(e){
            for(var i = 0;i < gridcentral.length; i++){
                if (e[1] == gridcentral[i].data.valoridentificador) {
                    gridcentral[i].set('fecharecurso', valor.fechaexcel);
                  //  if (e[1] != null || e[1] != "") {
                        if (e[2] != null || e[2] != "") {
                            var oldValue = gridcentral[i].get('cantentregadacomb');
                            gridcentral[i].set('cantentregadacomb', e[2]);
                            var colindex = _this.scope.getGridPrincipal().getColumnModel().findColumnIndex('cantentregadacomb');
                            var camporEdit = _this.scope.getGridPrincipal().getColumnModel().getCellEditor(colindex, i).field;
                            camporEdit.fireEvent('change',camporEdit, e[2], oldValue, gridcentral[i]);
                        }
                        if (e[0] != null || e[0] != "") {
                            var oldValue = gridcentral[i].get('lecturarecurso');
                            gridcentral[i].set('lecturarecurso', e[0]);
                            var colindex = _this.scope.getGridPrincipal().getColumnModel().findColumnIndex('lecturarecurso');
                            var camporEdit = _this.scope.getGridPrincipal().getColumnModel().getCellEditor(colindex, i).field;
                            camporEdit.fireEvent('change',camporEdit, e[0], oldValue, gridcentral[i]);
                        }
                    continue;
                   // }
                } /*else {
                    if (gridcentral[i].data.fecharecurso > valor.fechaexcel) {
                        mostrarMensaje(2, "La fecha de creación del Excel tiene que ser mayor que la del medio.");
                    }

                }*/
            }
        });
       // return;
       _this.winImportarDatosKm = new Ext.LOG.registroNumericoDepreciacion.importarDatosKm({
            idioma: _this.idioma,
            valor: valor,
            gridCEntral: _this.gridCEntral
        });
        _this.winImportarDatosKm.show();
    }
});
Ext.LOG.registroNumericoDepreciacion.importarDatosKm = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.valor = config.valor;
        this.layout = 'fit';
        this.gridCEntral = config.gridCEntral;
        Ext.LOG.registroNumericoDepreciacion.importarDatosKm.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.lbTextConfInsercionDatos);
        this.panelDatosImportarKM(this.valor);
        this.width = 480;
        this.height = 270;
        this.modal = true;
        this.bodyStyle = 'padding:5px 5px 0';
    },
    initComponent: function () {
        var _this = this;
        Ext.LOG.registroNumericoDepreciacion.importarDatosKm.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var primerficheroch = Array();
                var segundofichero = Array();
                var valor = _this.valor;
                if (_this.cmbSistema.isValid() == true && _this.cmbPrimerFichero.isValid() == true && _this.cmbSegundoFichero.isValid() == true) {

                    for (var i = 0; i < valor.total; i++) {
                            
                        if (valor.datos[i].descripcion == _this.cmbPrimerFichero.getValue()) {
                            primerficheroch.push(valor.datos[i].valores);
                        }
                        if (valor.datos[i].descripcion == _this.cmbSegundoFichero.getValue()) {
                            segundofichero.push(valor.datos[i].valores);
                        }
                    }
                    Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.lbMsgConcatenandoDatos || '...');
                    var bandera  = false;
                    Ext.each(camposColumnTable[0], function(e){
                        if (e == _this.cmbSistema.getValue()){
                            bandera = true
                        }
                    });


                    Ext.Ajax.request({
                        url: 'concatenarDatosExcel',
                        method: 'POST',
                        params: {
                            cmbSistema: _this.cmbSistema.getValue(),
                            cmbDenomSistema: _this.cmbSistema.getRawValue(),
                            cmbPrimerFichero: _this.cmbPrimerFichero.getValue(),
                            cmbSegundoFichero: _this.cmbSegundoFichero.getValue(),
                            segundofichero: Ext.encode(segundofichero),
                            primerfichero: Ext.encode(primerficheroch),
                            fecha: valor.datos[1].fecha,
                            plugins:(bandera)? "Transportacion" : "DatosGenerales"
                        },
                        callback: function (options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            if (rd.importa && rd.importa == 'no') {
                                _this.close();
                                mostrarMensaje(2, _this.idioma.lbMsgDatNull);
                            }

                            else if (rd.data != null) {
                                _this.winMostrarDatosExcel = new Ext.LOG.registroNumericoDepreciacion.gridImportar({
                                    idioma: _this.idioma,
                                    valor: rd,
                                    gridCEntral: _this.gridCEntral
                                });
                                _this.winMostrarDatosExcel.init();
                                _this.winMostrarDatosExcel.view();
                            }
                            else if (rd.insertar != null) {
                                rd.manual = 0;
                                _this.insertar(rd);
                            }
                            else {
                                _this.close();
                                mostrarMensaje(2, _this.idioma.lbMsgDatNull);
                            }
                        }
                    });
                }
                _this.close();
            }
        });
    },
    insertar: function (valor) {
        var _this = this;

        console.info(valor);


        return;
        Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgCargando || '...');
        Ext.Ajax.request({
            url: 'insercionDatos',
            method: 'POST',
            params: {
                valor: Ext.encode(valor)
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (rd.datos == 1) {
                    _this.close();
                    _this.gridCEntral.load();
                    Ext.MessageBox.hide();
                    mostrarMensaje(2, _this.idioma.lbMsgCargar);
                }
            }
        });
    },
    panelDatosImportarKM: function (valor) {
        var _this = this;
        var stor = Array();

        for (var i = 0; i < valor.total; i++) {
            if (valor.datos[i].descripcion == null) {
            }
            else {
                stor.push({descripcion: valor.datos[i].descripcion});
            }
        }
        this.cmbSistema = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbTextCampSistema,
            valueField: 'identificador',
            //hiddenName: 'state',
            displayField: 'denominacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            editable: false,
            anchor: '80%',
            url: '/logistica/activos_fijos/depreciacion/index.php/gestregistrodepreciacion/cargarCamposIdentificadores',
            /*store: new Ext.data.SimpleStore({
             fields: ['name', 'id'],
             data: [
             // ['N.\xb0 Matrícula', 'nromatricula'],
             ['N.\xb0  Serie', 'nroserie']
             ]
             })*/
            listeners: {
                select: function (cmb) {
                    if (cmb.isDirty() && cmb.isValid()
                        && _this.cmbPrimerFichero.isDirty()
                        && _this.cmbPrimerFichero.isValid()
                        && _this.cmbSegundoFichero.isDirty()
                        && _this.cmbSegundoFichero.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        this.cmbSegundoFichero = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbTextCampficheroExterno,
            hiddenName: 'fichero',
            autoLoad: false,
            displayField: 'descripcion',
            editable: false,
            typeAhead: true,
            allowBlank: false,
            selectOnFocus: true,
            emptyText: 'Seleccione...',
            anchor: '80%',
            listeners: {
                select: function (cmb) {
                    if (cmb.isDirty() && cmb.isValid()
                        && _this.cmbPrimerFichero.isDirty()
                        && _this.cmbPrimerFichero.isValid()
                        && _this.cmbSistema.isDirty()
                        && _this.cmbSistema.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            }
        });
        _this.cmbSegundoFichero.getStore().loadData({
            datos: stor
        });
        this.cmbPrimerFichero = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbTextCampficheroExterno,
            hiddenName: 'primfichero',
            autoLoad: false,
            displayField: 'descripcion',
            editable: false,
            typeAhead: true,
            allowBlank: false,
            selectOnFocus: true,
            emptyText: 'Seleccione...',
            anchor: '80%',
            listeners: {
                select: function (cmb) {
                    if (cmb.isDirty() && cmb.isValid()
                        && _this.cmbSistema.isDirty()
                        && _this.cmbSistema.isValid()
                        && _this.cmbSegundoFichero.isDirty()
                        && _this.cmbSegundoFichero.isValid()) {
                        _this.listaBotones.getItem(2).enable();
                    } else {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            }
        })
        _this.cmbPrimerFichero.getStore().loadData({
            datos: stor
        });
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsPanel.addComponent(_this.cmbSistema);
        this.clsPanel.addComponent(_this.cmbSegundoFichero);
        this.clsPanelPrFichero = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsPanelPrFichero.addComponent(_this.cmbPrimerFichero);
        this.panelImportarKM = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            anchor: '100%',
            autoHeight: true,
            bodyStyle: 'padding: 10px 10px 0 10px; margin-bottom:10px',
            labelWidth: 50,
            defaults: {
                anchor: '90%',
                msgTarget: 'side'
            },
            items: [new Ext.form.FieldSet({
                title: _this.idioma.lbTextIdentMaestro,
                autoHeight: true,
                items: [_this.clsPanel]
            }), new Ext.form.FieldSet({
                title: _this.idioma.lbTextIdentKm,
                autoHeight: true,
                items: [_this.clsPanelPrFichero]
            })]
        });


        this.add(this.panelImportarKM);
    }
});
Ext.LOG.registroNumericoDepreciacion.gridImportar = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        this.autoLoad = false;
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.modoSeleccion = 1;
        this.idGridPrincipal = 'idregnumerico';
        this.bbarVisible = false;
        this.gridCEntral = config.gridCEntral;
        this.valor = config.valor;
        Ext.LOG.registroNumericoDepreciacion.gridImportar.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.lbTextConfInsercionDatos;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(700, 400);

    },
    init: function () {
        Ext.LOG.registroNumericoDepreciacion.gridImportar.superclass.init.call(this);
        var _this = this;
        this.getVistaPrincipal().onRender = this.getVistaPrincipal().onRender.createSequence(function () {
            _this.getVistaPrincipal().add({
                xtype: 'panel',
                frame: true,
                region: 'north',
                height: 30,
                html: _this.idioma.lbTextinformacion
            });
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.lbCmDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            width: 160,
            autoExpand: true,
            default: true
        });

        this.addGridColumn({
            header: _this.valor.name,
            width: 160,
            sortable: true,
            dataIndex: _this.valor.dataIndex
        });

        this.addGridColumn({
            header: _this.idioma.lbTextMarcaModelo,
            width: 160,
            dataIndex: 'marcamodelo',
            default: true
        });

        this.addGridColumn({
            header: _this.valor.lbCmRecursoConsumido,
            width: 100,
            dataIndex: 'odometro',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCmFecha,
            width: 100,
            dataIndex: 'fecha',
            default: true
        });
    },
    initDefaultButtons: function () {

        var _this = this;
       // this.getVistaPrincipal().listaBotones.getItem(0).hide();
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            text: _this.idioma.lbTextConfirmar,
            iconCls: 'confirmar',
            handler: function () {
                Ext.MessageBox.wait(_this.idioma.msgEspere, _this.idioma.msgCargando || '...');
                Ext.Ajax.request({
                    url: 'insercionDatos',
                    method: 'POST',
                    params: {
                        valor: Ext.encode(_this.valor)
                    },
                    callback: function (options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.datos == 1) {
                            _this.getVistaPrincipal().close();
                            _this.gridCEntral.load();
                            Ext.MessageBox.hide();
                            mostrarMensaje(2, _this.idioma.lbMsgCargar);
                        }
                    }
                })
            }
        });
    },
    render: function () {
        var vista = Ext.LOG.registroNumericoDepreciacion.gridImportar.superclass.render.call(this);
        this.getStorePrincipal().loadData({
            datos: this.valor.data
        });
        return vista;
    }
});