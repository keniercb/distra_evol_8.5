/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.GestDesagregacionPresup
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Cont.GestDesagregacionPresup');
Ext.Cont.GestDesagregacionPresup = Ext.extend(Ext.Panel, {
    //Properties and Variables
    //Functions
    constructor: function(params) {
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';
        this.onloadMessageBox(title, text);


        var idioma = params.idioma
        var perfil = params.perfil

        params.lbDescripcion = new Ext.form.Label({
            id: 'lbDescripcion',
            //style: 'font-size:13px;font-weight:bold;',
            text: idioma.textLabel
        });

        params.btnAyudaDesagregacionPresup = new Ext.Button({
            id: 'btnAyudaDesagregacionPresup',
            text: idioma.lbbtnayuda,
            tooltip: idioma.tooltipayuda,
            iconCls: 'ayuda'
        });

        params.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.lbAceptar,
            tooltip: idioma.tooltipAceptar,
            iconCls: 'adicionar',
            hidden: true
        });

        params.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.lbModificar,
            tooltip: idioma.tooltipModificar,
            iconCls: 'modificar',
            disabled: true,
            hidden: true
        });



        params.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.lbEliminar,
            tooltip: idioma.tooltipEliminar,
            iconCls: 'modificar',
            disabled: true,
            hidden: true
        });
        params.btnImportar = new Ext.Button({
            id: 'btnImportar',
            text: idioma.lbImportar,
            tooltip: idioma.tooltipImportar,
            iconCls: 'importar',
            disabled: false,
            hidden: true
        });

        params.btnExportar= new Ext.Button({
            id: 'btnExportar',
            text: idioma.lbExportar,
            tooltip: idioma.tooltipExportar,
            iconCls: 'exportar',
            disabled: false,
            hidden: true
        });

        params.cbEjercicio = new Ext.form.ComboBox({
            id: 'cbEjercicio',
            anchor: '100%',
            fieldLabel: idioma.lbEjercicio,
            allowBlank: false,
            forceSelection: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: false,
            store: params.stEjercicio = new Ext.data.JsonStore({
                url: 'cargarEjercicios',
                root: 'datos',
                fields: [
                    {
                        name: 'idejercicio'
                    }, {
                        name: 'nombre'
                    }
                ],
                sortInfo: {
                    field: 'idejercicio',
                    direction: 'ASC'
                }
            }),
            valueField: 'idejercicio',
            displayField: 'nombre'
        });
        params.stDesagregacion = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                    id: 'readerDesagregacion'
                },
                []
            ),
            baseParams: {start:0 , limit: 20}
        })

        params.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            displayMsg: params.idioma.lbDisplayMsg,
            emptyMsg: params.idioma.lbEmptyMsg,
            firstText: params.idioma.lbPrimeraPagina,
            lastText: params.idioma.lbUltimaPagina,
            store: params.stDesagregacion
        });
        params.btnBusqueda = new Ext.Button({
            iconCls: 'buscar',
            disabled:false,
            text: 'Búsqueda avanzada',
            tooltip: 'Búsqueda avanzada',
            hidden: true
        });


        params.buscarArbol = function (filter) {
            this.reconfigurarGrid(this.dataGrid[0],this.dataGrid[1],this.dataGrid[2],this.dataGrid[3],this.dataGrid[4],filter)

        };
        params.gpDesagregacion = new Ext.grid.GridPanel({
            id: 'gpDesagregacion',
            stripeRows: true,
            layout: 'fit',
            store: params.stDesagregacion,
            columns: [],

            sm: new Ext.grid.RowSelectionModel({singleSelect: false}),
            frame: false,
            header: true,
            region: 'center',
            tbar: [
                new Ext.Cont.SearchField({
                    width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
                    maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
                    scope: this,
                    fnOnSearch: function () {
                        this.scope.buscarArbol(this.getRawValue());
                    },
                    fnOnClear: function () {
                        this.scope.buscarArbol('');
                    }
                }),params.btnBusqueda
            ],
            viewConfig: {
                forceFit: true
            },
            border: false,
            width:'100%',
            bbar: params.paginToolbar,
            hidden: true
        });
        params.PanelGrid = new Ext.Panel({
            region      : 'center',
            layout: 'fit',
            tbar: [params.btnAdicionar, params.btnModificar, params.btnEliminar, params.btnImportar, params.btnExportar ],
            items:[params.gpDesagregacion],
        })
        params.keyMap = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    params.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!params.btnModificar.disabled)
                        params.btnModificar.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE, //Eliminar
                fn: function () {
                    if (!params.btnEliminar.disabled && cargainicial)
                        params.btnEliminar.fireEvent('click');
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    if (!params.btnBuscar.disabled)
                        params.btnBuscar.fireEvent('click');
                }
            }
        ]);

        Ext.apply(this, params);
        Ext.apply(this, {
                region: 'center',
                layout: 'border',
                border: false,
            title:idioma.titleGrdiDesagregacion,
                tbar: [params.lbDescripcion, ' ', '-', params.cbEjercicio, '->', params.btnAyudaDesagregacionPresup],
                items: [params.PanelGrid]

        });

        Ext.Cont.GestDesagregacionPresup.superclass.constructor.call(this);

        //Keymap necesario para el trabajo con las teclas rápidas
       /* this.mapaTeclas = new Ext.KeyMap(this.getEl(), [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function() {
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function() {
                }
            }, {
                key: Ext.EventObject.DELETE,
                scope: this,
                fn: function() {
                }
            }
        ]);*/

        this.keyMap = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    view.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!view.btnModificar.disabled)
                        view.btnModificar.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE, //Eliminar
                fn: function () {
                    if (!view.btnEliminar.disabled && cargainicial)
                        view.btnEliminar.fireEvent('click');
                }
            }, {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    if (!view.btnBuscar.disabled)
                        view.btnBuscar.fireEvent('click');
                }
            }
        ]);

        //Inicializa todos los eventos del componente
        this.inicializarEventos(perfil, idioma);

        params.stEjercicio.load({
            callback: function(store, records) {
                //Se termina la carga del componente y se cierra la máscara
                Ext.MessageBox.hide();

            }
        });

    },
    onloadMessageBox: function(agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    inicializarEventos: function(perfil, idioma) {

        this.stEjercicio.on({
            scope: this,
            load: function (store, records) {
                this.cbEjercicio.setValue(store.reader.jsonData.ejercicioactual);
            }
        });

        this.cbEjercicio.on({
            scope: this,
            select: function(combo, record, index) {
              //  this.reconfigurarGrid(record.data.idejercicio, record.data.nombre, idioma);
            }
        });

        this.gpDesagregacion.on({
            scope: this,
            rowclick: function(grid, rowIndex, event) {
                var seleccionados = grid.getSelectionModel().getSelections();
                var cant = seleccionados.length;

                this.scope.PanelGridDesagregacion.idelementoSeleccionado=seleccionados[0].data.idelementoobjeto;
                this.scope.PanelGridDesagregacion.idelementoPadreSeleccionado=seleccionados[0].data.idelementopadre;
                this.scope.PanelGridDesagregacion.idelementoPadreSeleccionado=seleccionados[0].data.idelementopadre;
                this.scope.PanelGridDesagregacion.textelementoobjeto=seleccionados[0].data.textelementoobjeto;
                if(this.scope.tipoSelecionado==1){
                    if (cant === 0) {
                        this.btnAdicionar.disable();
                        this.btnModificar.disable();
                        this.btnEliminar.disable();

                    }
                    else if (cant === 1) {
                        if(!seleccionados[0].data.esPadre || (seleccionados[0].data.esPadre && !seleccionados[0].data.tieneHijos )){
                            if(seleccionados[0].data.saldototal==""){
                                this.btnAdicionar.enable();
                                this.btnModificar.disable();
                            }
                            else
                            {
                                this.btnModificar.enable();
                                this.btnAdicionar.disable();
                            }
                        }
                        else{
                            this.btnModificar.disable();
                            this.btnAdicionar.disable();
                        }

                    }
                    else {
                        this.btnAdicionar.disable();
                        this.btnModificar.disable();
                    }
                }
            }
        });



        this.gpDesagregacion.getSelectionModel().on({
            scope: this,
            rowselect: function(selmodel, rowIndex, record) {

            },
            rowdeselect: function(selmodel, rowIndex, record) {

            }
        });

        this.btnAdicionar.on({
            scope: this,
            click: function(button, event) {
                this.showWindow('adicionar', perfil, idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

        this.btnModificar.on({
            scope: this,
            click: function(button, event) {
                this.showWindow('modificar', perfil, idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

        this.btnEliminar.on({
            scope: this,
            click: function(button, event) {
                this.eliminarDesagregacion(idioma, this.cbEjercicio.getValue(), this.cbEjercicio.getRawValue());
            }
        });

    },
    reconfigurarGrid: function(idejercicio, nombreejercicio, idioma,idcentro,buscaringresos,filter) {
        this.dataGrid= new Array();
        this.dataGrid.push(idejercicio);
        this.dataGrid.push(nombreejercicio);
        this.dataGrid.push(idioma);
        this.dataGrid.push(idcentro);
        this.dataGrid.push(buscaringresos);
        var myMask = new Ext.LoadMask(this.gpDesagregacion.getEl(), {msg: idioma.msgCargando});
        myMask.show();
        Ext.Ajax.request({
            method: "POST",
            url: "loadGeneralData",
            params: {
                idejercicio: idejercicio,
                nombreejercicio: nombreejercicio,
                idcentro : idcentro,
                buscaringresos : buscaringresos,
                filter : filter,
                start:0,
                limit:20
            },
            scope: this,
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                var periodos = responseData.periodos;
                var datosStore = responseData.datosStore;
                try{
                    var dataLength = datosStore.datos.length;
                }
                catch (err){
                    var dataLength = 0;
                }
                if((dataLength>0 && responseData.esBusqueda) || (responseData.esBusqueda == 'false')){
                    var tipo = responseData.tipo;

                    // Creando el colum model
                    // 1 CentroCosto , 2 Ingreso , 3 Otros
                    if(this.scope.tipoSelecionado == 1){
                        var arrcolumnas = new Array();

                        arrcolumnas.push({header: idioma.headerElementosGastos, width: 250, dataIndex: 'descripcionelementoobjeto',});
                        arrcolumnas.push({header: idioma.headerPlanTotal, width: 70, dataIndex: 'saldototal', align: 'right'});

                        var columnmodel = new Ext.grid.ColumnModel(arrcolumnas);
                        columnmodel.setRenderer( 0,  function (value ,metadata ,record ) {
                            if(record.data.esPadre){
                                return '<span style=" font-weight:bold;">' + record.data.codigoelementoobjeto + ' ' + record.data.descripcionelementoobjeto + '</span>';
                            }else {
                                return '<span style="margin-left: 1em; font-style:italic;">' + '    ' + record.data.codigoelementoobjeto + ' ' + record.data.descripcionelementoobjeto + '</span>';
                            }
                            return value;

                        } ) ;
                    }else if(this.scope.tipoSelecionado==2){
                        var arrcolumnas = new Array();

                        arrcolumnas.push({header: idioma.headerIngresos, width: 250, dataIndex: 'descripcion',});
                        arrcolumnas.push({header: idioma.headerPlanTotal, width: 70, dataIndex: 'saldototal', align: 'right'});

                    }
                    else {
                        var arrcolumnas = new Array();
                        arrcolumnas.push({
                            header: idioma.headerNivel,
                            width: 150,
                            dataIndex: 'nombreformato',
                            align: 'left'
                        });
                        arrcolumnas.push({header: idioma.headerCuenta, width: 300, dataIndex: 'cuenta', align: 'left'});
                        arrcolumnas.push({
                            header: idioma.headerPlanTotal,
                            width: 120,
                            dataIndex: 'saldototal',
                            align: 'right'
                        });

                    }

                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'esPadre',});
                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'idelementoobjeto',});
                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'idelementopadre',});
                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'tieneHijos',});
                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'textelementoobjeto',});
                    arrcolumnas.push({hidden: true, width: 250, dataIndex: 'iddesagregacionpresupejercicio',});

                    var arrfieldsstore = new Array();
                    arrfieldsstore.push({name: 'idparteformato'});
                    arrfieldsstore.push({name: 'nombreformato'});
                    arrfieldsstore.push({name: 'idcuenta'});
                    arrfieldsstore.push({name: 'cuenta'});
                    arrfieldsstore.push({name: 'saldototal'});
                    arrfieldsstore.push({name: 'iddesagregacionpresupejercicio'});
                    arrfieldsstore.push({name: 'idejercicio'});
                    arrfieldsstore.push({name: 'idestructuracomun'});
                    arrfieldsstore.push({name: 'codigoelementoobjeto'});
                    arrfieldsstore.push({name: 'descripcionelementoobjeto'});
                    arrfieldsstore.push({name: 'hoja'});
                    arrfieldsstore.push({name: 'ordenizq'});
                    arrfieldsstore.push({name: 'esPadre'});
                    arrfieldsstore.push({name: 'idelementoobjeto'});
                    arrfieldsstore.push({name: 'idelementopadre'});
                    arrfieldsstore.push({name: 'descripcionelementopadre'});
                    arrfieldsstore.push({name: 'tieneHijos'});
                    arrfieldsstore.push({name: 'textelementoobjeto'});
                    arrfieldsstore.push({name: 'codigo'});
                    arrfieldsstore.push({name: 'descripcion'});
                    arrfieldsstore.push({name: 'idcuenta'});
                    arrfieldsstore.push({name: 'idpadre'});
                    arrfieldsstore.push({name: 'idparrafofiscal'});

                    for (var i = 0, long = periodos.length; i < long; i++) {
                        if(periodos[i].nombre.length>=7)
                            var widthAux = 80;
                        else if (periodos[i].nombre.length>=15)
                            var widthAux = 105;
                        else
                            var widthAux = 65;

                        //Column Model
                        arrcolumnas.push({header: periodos[i].nombre, width: widthAux, dataIndex: 'saldo' + periodos[i].nombre + nombreejercicio, align: 'right'});

                        //Store
                        arrfieldsstore.push({name: 'saldo' + periodos[i].nombre + nombreejercicio});
                    }
                    var columnmodel = new Ext.grid.ColumnModel(arrcolumnas);

                    //Creando el Colunm Model

                    //Creando el Store
                    var store = new Ext.data.Store({
    //                    sortInfo: {field: 'orden', direction: "ASC"},
                        reader: new Ext.data.JsonReader({
                            id: 'iddesagregacionpresupejercicio',
                            root: 'datos',
                            totalProperty: 'cant'
                        },
                        arrfieldsstore),
                        baseParams: {start:0 , limit: 20}

                    });

                    store.loadData(datosStore);
                    this.gpDesagregacion.show();
                    this.gpDesagregacion.reconfigure(store, columnmodel);
                    this.paginToolbar.store=store;
                    this.paginToolbar.updateInfo();

                    this.btnAdicionar.show();
                    this.btnModificar.show();
                    this.btnEliminar.show();
                    this.btnExportar.show();
                    this.btnImportar.show();
                    this.btnBusqueda.show();
                 //   this.btnAdicionar.setDisabled(this.scope.tipoSelecionado==1);
                    this.btnModificar.setDisabled(true);
                    this.btnEliminar.setDisabled(true);
                    this.gpDesagregacion.getSelectionModel().clearSelections();
                }
                if (dataLength>0){}
                else if(filter){
                    this.gpDesagregacion.store.removeAll();
                    mostrarMensaje(1, this.idioma.msgNoBusqueda);

                }
                else{
                    this.gpDesagregacion.store.removeAll();
                    mostrarMensaje(1, 'No hay datos.');

                }

                myMask.hide();
            }
        });
    },
    showWindow: function(accion, perfil, idioma, idejercicio, nombreejercicio) {
        var paramsMod = {};
        if (accion == 'modificar') {
            var paramsMod = this.gpDesagregacion.getSelectionModel().getSelected().data;
        }
        if(this.scope.tipoSelecionado==1){
            new Ext.Cont.WindowAddModDesagregacionPresupElementoGasto({
                id: 'winAddModDesagregacionElementoGasto',
                accion: accion,
                perfil: perfil,
                idioma: idioma,
                idejercicio: idejercicio,
                nombreejercicio: nombreejercicio,
                paramsMod: paramsMod,
                idCentroCosto: this.scope.PanelGridDesagregacion.idCentroCostoSeleccionado,
                textCentroCosto: this.scope.PanelGridDesagregacion.textCentroCostoSeleccionado,
                idelementoSeleccionado: this.scope.PanelGridDesagregacion.idelementoSeleccionado,
                idelementoPadreSeleccionado: this.scope.PanelGridDesagregacion.idelementoPadreSeleccionado,
                textelementoobjeto: this.scope.PanelGridDesagregacion.textelementoobjeto,
                storeDesagregacion: this.gpDesagregacion.getStore()
            }).on({
                scope: this,
                close: function() {
                    this.reconfigurarGrid(idejercicio, nombreejercicio, idioma,this.scope.PanelGridDesagregacion.idCentroCostoSeleccionado,false);
                }
            });
        }else if(this.scope.tipoSelecionado==2){
            new Ext.Cont.WindowAddModDesagregacionPresupIngreso({
                id: 'winAddModDesagregacion',
                accion: accion,
                perfil: perfil,
                idioma: idioma,
                idejercicio: idejercicio,
                nombreejercicio: nombreejercicio,
                paramsMod: paramsMod,
                storeDesagregacion: this.gpDesagregacion.getStore(),
            }).on({
                scope: this,
                close: function() {
                    this.reconfigurarGrid(idejercicio, nombreejercicio, idioma,null,true);
                }
            });


        }
        else{
            new Ext.Cont.WindowAddModDesagregacionPresup({
                id: 'winAddModDesagregacion',
                accion: accion,
                perfil: perfil,
                idioma: idioma,
                idejercicio: idejercicio,
                nombreejercicio: nombreejercicio,
                paramsMod: paramsMod,
                storeDesagregacion: this.gpDesagregacion.getStore(),
            }).on({
                scope: this,
                close: function() {
                    this.reconfigurarGrid(idejercicio, nombreejercicio, idioma,null,false);
                }
            });
        }
    },
    eliminarDesagregacion: function(idioma, idejercicio, nombreejercicio) {
        var seleccionados = this.gpDesagregacion.getSelectionModel().getSelections();
        var msgPregunta = (seleccionados.length > 1) ? idioma.msgPreguntaEliminarMany : idioma.msgPreguntaEliminarOne;
        mostrarMensaje(2, msgPregunta, function(btn) {
            if (btn == 'ok') {
                var idsseleccionados = new Array();
                for (var i = 0, long = seleccionados.length; i < long; i++) {
                    idsseleccionados.push(seleccionados[i].data.iddesagregacionpresupejercicio);
                }

                this.onloadMessageBox(idioma.msgEliminando, idioma.msgEspere);

                Ext.Ajax.request({
                    method: "POST",
                    url: "delDesagregacion",
                    params: {
                        idsseleccionados: Ext.encode(idsseleccionados)
                    },
                    scope: this,
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        
                        if(responseData.success) {
                            var msgEliminadoSuccess = (seleccionados.length > 1) ? idioma.msgEliminadoSuccessMany : idioma.msgEliminadoSuccessOne;
                            
                            mostrarMensaje(1, msgEliminadoSuccess);
                            this.reconfigurarGrid(idejercicio, nombreejercicio, idioma,null,false);
                        }

                        Ext.MessageBox.hide();
                    }
                });
            }
        }.bind(this));
    }
});

Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.app.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    tooltip : 'asas',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            var o = {start: 0};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = '';
            this.store.reload({params:o});
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        var o = {start: 0};
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams[this.paramName] = v;
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});

//Inicializando la vista.
Ext.QuickTips.init();

