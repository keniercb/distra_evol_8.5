/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.GestSubsistemas
 * @extends Ext.Viewport
 */
Ext.namespace('Ext.Conf.GestSubsistemas');
Ext.Conf.GestSubsistemas = Ext.extend(Ext.Viewport, {
    //Functions
    constructor: function (params) {

        var idioma = Ext.Configuracion_General_Parametros.etiquetas;
        var perfil = window.parent.perfil;
        params.url = '/configuracion/subsistemas/index.php/gestsubsistemas/';

        params.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            iconCls: 'adicionar',
            tooltip: idioma.lbTtAdicionarSunsist,
            text: idioma.lbAdicionar,
            hidden:true,
            handler: function () {

            }
        });

        params.btnModificar = new Ext.Button({
            id: 'btnModificar',
            iconCls: 'modificar',
            disabled: true,
            hidden:true,
            tooltip: idioma.lbTtModificarSubsistema,
            text: idioma.lbModificar,
            handler: function () {

            }
        });

        params.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            iconCls: 'eliminar',
            disabled: true,
            hidden:true,
            tooltip: idioma.lbTtEliminarSubsistema,
            text: idioma.lbEliminar,
            handler: function () {

            }
        });

        params.btnAyuda = new Ext.Button({
            id: 'btnAyudaSubsistemas',
            iconCls: 'ayuda',
            tooltip: idioma.lbTtAyuda,
            text: idioma.lbAyuda/*,
             handler: function() {
             }*/
        });

        params.menuItemActivo = new Ext.menu.Item({
            text: idioma.lbActivo,
            id:'mnActivo',
            hidden: true,
            iconCls: 'bandera verde'
        });

        params.menuItemInactivo = new Ext.menu.Item({
            text: idioma.lbInactivo,
            id:'mnInactivo',
            hidden: true,
            iconCls: 'bandera gris'
        });

        params.menuItemCierra = new Ext.menu.Item({
            text: idioma.lbCierra,
            id:'mnCierra',
            hidden: true,
            iconCls: 'true verde'
        });

        params.menuItemNoCierra = new Ext.menu.Item({
            text: idioma.lbNoCierra,
            id:'mnNocierra',
            hidden: true,
            iconCls: 'false rojo'
        });

        params.menuItemContabiliza = new Ext.menu.Item({
            text: idioma.lbtooltipContabiliza,
            id:'mnContab',
            hidden: true,
            iconCls: 'registrogasto verde'
        });

        params.menuItemNoContabiliza = new Ext.menu.Item({
            text: idioma.lbtooltipNoContabiliza,
            id:'mnNocontab',
            hidden: true,
            iconCls: 'registrogasto gris'
        });

        actionValidate.validate();

        params.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: "drop",
            hideBorders: true,
            items: [
                params.menuItemCierra, params.menuItemNoCierra,
                params.menuItemActivo, params.menuItemInactivo,
                params.menuItemNoContabiliza, params.menuItemContabiliza
            ]
        });

        params.storeSubsistema = new Ext.data.Store({
            url: params.url + 'getSubsistemas',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idsubsistema"
            }, [{
                name: 'idsubsistema'
            }, {
                name: 'denominacion'
            }, {
                name: 'uri'
            }, {
                name: 'cierra'
            }, {
                name: 'precedencia'
            }, {
                name: 'idestado'
            }, {
                name: 'idestructurasubsist'
            }, {
                name: 'contabiliza'
            }
            ])
        });

        params.cmbOrganos = new Ext.CmbOrganos({
            idioma:idioma,
            gridStore:params.storeSubsistema
        });

        params.tbar = [params.btnAdicionar, params.btnModificar, params.btnEliminar, '->',params.cmbOrganos, params.btnAyuda];

        params.template = new Ext.CmpTemplate({
            tabparent: params.tbar,
            position: 3,
            createurl: 'crearPlantilla',
            useurl: 'usarPlantilla',
            idioma:idioma
        });

        params.gpSubsistema = new Ext.grid.GridPanel({
            id: 'gpSubsistema',
            region: 'center',
            height: 250,
            autoExpandColumn: 'expandir',
            frame: false,
            border:false,
            viewConfig: {forceFit: true},
            tbar: params.tbar,
            loadMask: {
                store: params.storeSubsistema,
                msg: idioma.lbMsgCargando
            },
            store: params.storeSubsistema,
            sm: new Ext.grid.RowSelectionModel({singleSelect: false}),
            stripeRows: true,
            floating: false,
            columns: [{
                header: idioma.lbCodigo,
                width: 100,
                dataIndex: 'idsubsistema',
                sortable: true
            }, {
                header: idioma.lbDenominacion,
                width: 300,
                dataIndex: 'denominacion',
                sortable: true
            }, {
                id: 'expandir',
                header: idioma.lbUri,
                width: 250,
                dataIndex: 'uri',
                sortable: true
            }, {
                header: idioma.lbCierre,
                width: 50,
                dataIndex: 'cierra',
                align: 'center',
                menuDisabled: true,
                resizable: false,
                hideable: false,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (record.data.cierra == 0) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipNoCierra + '</b>"';
                        metaData.css = 'icondistra-false rojo';
                    } else if (record.data.cierra == 1) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipCierra + '</b>"';
                        metaData.css = 'icondistra-true verde';
                    }
                }
            }, {
                header: idioma.lbEstado,
                width: 50,
                dataIndex: 'estado',
                align: 'center',
                menuDisabled: true,
                resizable: false,
                hideable: false,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (record.data.idestado == 0) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipInactivo + '</b>"';
                        metaData.css = 'icondistra-bandera gris';
                    } else if (record.data.idestado == 1) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipActivo + '</b>"';
                        metaData.css = 'icondistra-bandera verde';
                    }
                }
            }, {
                header: idioma.lbHeaderContabiliza,
                width: 70,
                dataIndex: 'contabiliza',
                align: 'center',
                menuDisabled: true,
                resizable: false,
                hideable: false,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (record.data.contabiliza == 0) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipNoContabiliza + '</b>"';
                        metaData.css = 'icondistra-registrogasto gris';
                    } else if (record.data.contabiliza == 1) {
                        metaData.attr = 'ext:qtip="<b>' + idioma.lbtooltipContabiliza + '</b>"';
                        metaData.css = 'icondistra-registrogasto verde';

                    }
                }
            }
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: idioma.lbDisplayMsg,
                emptyMsg: idioma.lbEmptyMsg,
                store: params.storeSubsistema
            })
        });

        //Panel que contiene todo el componente
        params.panel = new Ext.Panel({
            id: 'panelsubsistemas',
            layout: 'border',
            border: false,
            frame: false,
            items: [params.gpSubsistema]
        });

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            items: [params.panel]
        });

        Ext.Conf.GestSubsistemas.superclass.constructor.call(this);

        this.mapaTeclas = new Ext.KeyMap(this.getEl(), [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btnAdicionar;
                    if (!btn.disabled && !btn.hidden) {
                        this.mostrarWindow('adicionar', idioma, perfil, this.url, btn.getId());
                    }
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function () {
                    var btn = this.btnModificar;
                    if (!btn.disabled && !btn.hidden) {
                        this.mostrarWindow('modificar', idioma, perfil, this.url, btn.getId(),
                            this.gpSubsistema.getSelectionModel().getSelected().data);
                    }
                }
            }, {
                key: Ext.EventObject.DELETE,
                scope: this,
                fn: function () {
                    var btn = this.btnEliminar;
                    if (!btn.disabled && !btn.hidden) {
                        this.delSubsistema(idioma);
                    }
                }
            }
        ]);

        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        myMask.show();
        this.storeSubsistema.load({
            scope: this,
            callback: function (record, options, success) {
                myMask.hide();
                this.doLayout();
            }
        });
        //Inicializa todos los eventos del componente
        this.inicializarEventos(perfil, idioma);
    },
    inicializarEventos: function (perfil, idioma) {

        this.btnAdicionar.on({
            scope: this,
            click: function (button, event) {
                this.mostrarWindow('adicionar', idioma, perfil, this.url, this.btnAdicionar.getId());
            }
        });
        this.btnModificar.on({
            scope: this,
            click: function (button, event) {
                this.mostrarWindow('modificar', idioma, perfil, this.url, this.btnModificar.getId(),
                    this.gpSubsistema.getSelectionModel().getSelected().data);
            }
        });
        this.btnEliminar.on({
            scope: this,
            click: function (button, event) {
                this.delSubsistema(idioma);
            }
        });
        this.gpSubsistema.getSelectionModel().on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                var cantsel = smodel.getSelections().length;
                this.btnEliminar.enable();
                if (cantsel === 1) {
                    this.btnModificar.enable();
                }
                if (cantsel > 1) {
                    this.btnModificar.disable();
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                var cantsel = smodel.getSelections().length;
                if (cantsel === 0) {
                    this.btnModificar.disable();
                    this.btnEliminar.disable();
                }
                if (cantsel === 1) {
                    this.btnModificar.enable();
                    this.btnEliminar.enable();
                }
                if (cantsel > 1) {
                    this.btnEliminar.enable();
                }
            }
        });
        this.gpSubsistema.on({
            scope: this,
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                this.gpSubsistema.getSelectionModel().selectRow(rowIndex);
                var record = this.storeSubsistema.getAt(rowIndex),
                    showmenuitem = false;
                if (record.data.idestado === '1') {
                    this.menuItemActivo.hide();
                    if(actionValidate.actions[this.menuItemInactivo.id]){
                        this.menuItemInactivo.show();
                        showmenuitem = true;
                    }
                }
                else if (record.data.idestado === '0') {
                    this.menuItemInactivo.hide();
                    if(actionValidate.actions[this.menuItemActivo.id]){
                        this.menuItemActivo.show();
                        showmenuitem = true;
                    }
                }
                else {
                    this.menuItemInactivo.hide();
                    if(actionValidate.actions[this.menuItemActivo.id]){
                        this.menuItemActivo.show();
                        showmenuitem = true;
                    }
                }

                if (record.data.cierra === '1') {
                    this.menuItemCierra.hide();
                    if(actionValidate.actions[this.menuItemNoCierra.id]){
                        this.menuItemNoCierra.show();
                        showmenuitem = true;
                    }
                }
                else if (record.data.cierra === '0') {
                    this.menuItemNoCierra.hide();
                    if(actionValidate.actions[this.menuItemCierra.id]){
                        this.menuItemCierra.show();
                        showmenuitem = true;
                    }
                }
                else {
                    this.menuItemNoCierra.hide();
                    if(actionValidate.actions[this.menuItemCierra.id]){
                        this.menuItemCierra.show();
                        showmenuitem = true;
                    }
                }

                if (record.data.contabiliza === '1') {
                    this.menuItemContabiliza.hide();
                    if(actionValidate.actions[this.menuItemNoContabiliza.id]){
                        this.menuItemNoContabiliza.show();
                        showmenuitem = true;
                    }
                }
                else if (record.data.contabiliza === '0') {
                    if(actionValidate.actions[this.menuItemContabiliza.id]){
                        this.menuItemContabiliza.show();
                        showmenuitem = true;
                    }
                    this.menuItemNoContabiliza.hide();
                }
                else {
                    if(actionValidate.actions[this.menuItemContabiliza.id]){
                        this.menuItemContabiliza.show();
                        showmenuitem = true;
                    }
                    this.menuItemNoContabiliza.hide();
                }

                var sel = this.gpSubsistema.getSelectionModel().getSelections();
                if (sel.length === 1 && showmenuitem) {
                    this.menuContextual.showAt(eventObject.getXY());
                }
                else {
                    this.menuContextual.hide();
                }
            }
        });
        this.storeSubsistema.on({
            scope: this,
            load: function (store, records, options) {
                var selmodel = this.gpSubsistema.getSelectionModel();
                var sel = selmodel.getSelections();
                if (sel.length === 0) {
                    this.btnModificar.disable();
                    this.btnEliminar.disable();
                }
            }
        });

        /******************************Eventos para manejar los menus******************************************/

        /**
         * Cambia el cierre del subsistema para la entidad (Cierra o No cierra)
         */
        this.menuItemNoCierra.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modCierre(0, idioma);
            }
        });

        this.menuItemCierra.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modCierre(1, idioma);
            }
        });

        /**
         * Cambia el estado del subsistema para la entidad (Activo o Inactivo)
         */
        this.menuItemActivo.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modEstado(1, idioma);
            }
        });

        this.menuItemInactivo.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modEstado(0, idioma);
            }
        });

        /**
         * Cambia la contabilización del subsistema (Contabiliza o No contabiliza)
         */
        this.menuItemContabiliza.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modContabilizacion(1, idioma);
            }
        });

        this.menuItemNoContabiliza.on({
            scope: this,
            click: function (menu, eventObj) {
                this.modContabilizacion(0, idioma);
            }
        });

        /*******************************Aquí terminan los eventos de los menus*******************************/

        this.template.on({
            scope: this,
            confirm: function (action) {
                if (action == 'use') {
                    this.gpSubsistema.getStore().load();
                }
            }
        });

        window.document.oncontextmenu = function(){
            return false;
        }

    },
    //Función necesaria para modificar el cierre
    modCierre: function (cierra, idioma) {
        Ext.MessageBox.wait(idioma.msgModificando, idioma.msgEspere);

        var seleccionado = this.gpSubsistema.getSelectionModel().getSelected().data;
        var store = this.gpSubsistema.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});

        Ext.Ajax.request({
            scope: this,
            method: 'post',
            params: {
                cierra: cierra,
                idsubsistema: seleccionado.idsubsistema,
                denominacion: seleccionado.denominacion,
                idestructurasubsist: (Ext.isEmpty(seleccionado.idestructurasubsist)) ? ''
                    : seleccionado.idestructurasubsist
            },
            url: this.url + 'cambiarCierre',
            callback: function (options, success, response) {

                var response = Ext.decode(response.responseText);
                var arrErrores = response.errors;
//                var arrSuccess = response.success;
                Ext.MessageBox.hide();

                if (arrErrores.length === 0) {
                    //Se modificó el cierre del subsistema satisfactoriamente
                    mostrarMensaje(1, idioma.msgModCierreSuccess);
                    myMask.show();

                    store.reload({
                        callback: function () {
                            myMask.hide();
                        }
                    });
                }
                else {
                    //Ocurrió un error al modificar el cierre del subsistema X
                    // var textoMensajeError = idioma.msgErrorOne + '</br></br>';
                    textoMensajeError = idioma.msgModCierreError.replace(/<#denom>/g, arrErrores[0].denominacion);
                }
            }
        });
    },
    //Función necesaria para modificar el estado del subsistema
    modEstado: function (idestado, idioma) {
        Ext.MessageBox.wait(idioma.msgModificando, idioma.msgEspere);

        var seleccionado = this.gpSubsistema.getSelectionModel().getSelected().data;
        var store = this.gpSubsistema.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});

        Ext.Ajax.request({
            scope: this,
            method: 'post',
            params: {
                idestado: idestado,
                idsubsistema: seleccionado.idsubsistema,
                denominacion: seleccionado.denominacion,
                idestructurasubsist: (Ext.isEmpty(seleccionado.idestructurasubsist)) ? ''
                    : seleccionado.idestructurasubsist
            },
            url: this.url + 'cambiarEstado',
            callback: function (options, success, response) {

                var response = Ext.decode(response.responseText);
                var arrErrores = response.errors;
//                var arrSuccess = response.success;
                Ext.MessageBox.hide();

                if (arrErrores.length === 0) {
                    //Se modificó el estado del subsistema satisfactoriamente
                    mostrarMensaje(1, idioma.msgModEstadoSuccess);
                    myMask.show();

                    store.reload({
                        callback: function () {
                            myMask.hide();
                        }
                    });
                }
                else {
                    //Ocurrió un error al modificar el estado del subsistema X
                    // var textoMensajeError = idioma.msgErrorOne + '</br></br>';
                    textoMensajeError = idioma.msgModEstadoError.replace(/<#denom>/g, arrErrores[0].denominacion);
                }
            }
        });
    },
    //Función necesaria para modificar si el subsistema contabiliza o no
    modContabilizacion: function (contabiliza, idioma) {
        Ext.MessageBox.wait(idioma.msgModificando, idioma.msgEspere);

        var seleccionado = this.gpSubsistema.getSelectionModel().getSelected().data;
        var store = this.gpSubsistema.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});

        Ext.Ajax.request({
            scope: this,
            method: 'post',
            params: {
                contabiliza: contabiliza,
                idsubsistema: seleccionado.idsubsistema,
                denominacion: seleccionado.denominacion,
                idestructurasubsist: (Ext.isEmpty(seleccionado.idestructurasubsist)) ? ''
                    : seleccionado.idestructurasubsist
            },
            url: this.url + 'cambiarContabilizacion',
            callback: function (options, success, response) {

                var response = Ext.decode(response.responseText);
                var arrErrores = response.errors;
//                var arrSuccess = response.success;
                Ext.MessageBox.hide();

                if (arrErrores.length === 0) {
                    //Se modificó la contabilización del subsistema satisfactoriamente
                    mostrarMensaje(1, idioma.msgModContabilizaSuccess);
                    myMask.show();

                    store.reload({
                        callback: function () {
                            myMask.hide();
                        }
                    });
                }
                else {
                    //Ocurrió un error al modificar la contabilización del subsistema X
                    // var textoMensajeError = idioma.msgErrorOne + '</br></br>';
                    textoMensajeError = idioma.msgModContabilizaError.replace(/<#denom>/g, arrErrores[0].denominacion);
                }
            }
        });
    },
    //Función necesaria para mostrar el mensaje de acción realizada satisfactoriamente
    //o para mostrar los errores
    mostrarMensajesAction: function (arrErrors, arrSuccess, idioma) {
        var store = this.gpSubsistema.getStore();
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: idioma.msgCargando});
        //No hubo errores
        if (arrErrors.length === 0) {
            var msgSuccess = (arrSuccess.length > 1) ? idioma.msgEliSubsSuccessMany
                : idioma.msgEliSubsSuccessOne;
            mostrarMensaje(1, msgSuccess);
            myMask.show();

            store.reload({
                callback: function () {
                    myMask.hide();
                }
            });
        }
        else {
            var textoMensajeError='';
            // var textoMensajeError = (arrErrors.length === 1) ? idioma.msgErrorOne
            //     : idioma.msgErrorMany;
            // textoMensajeError += '</br></br>';
            console.log('Erroerrrr')
            for (var i = 0, long = arrErrors.length; i < long; i++) {

                if (arrErrors[i].code === 7) {
                    //No hay datos para eliminar el o los subsistemas
                    textoMensajeError += idioma.msgErrorCode7;
                }
                else if (arrErrors[i].code === 8) {
                    /*
                     * Ocurrió un error al eliminar el subsistema X
                     */
                    textoMensajeError += idioma.msgErrorCode8910.replace(/<#denom>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 9) {
                    //Ocurrió un error al eliminar la asociación del subsistema con la entidad
                    //Ocurrió un error al eliminar el subsistema X
                    textoMensajeError += idioma.msgErrorCode8910.replace(/<#denom>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 10) {
                    //Ocurrió un error al eliminar el subsistema X
                    textoMensajeError += idioma.msgErrorCode8910.replace(/<#denom>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 11) {
                    //El subsistema X está siendo usado por otra entidad
                    textoMensajeError += idioma.msgErrorCode11.replace(/<#denom>/g, arrErrors[i].denominacion);
                }
                else if (arrErrors[i].code === 23503) {
                    //El subsistema X está siendo usado por otra entidad
                    textoMensajeError += idioma.msgErrorCode23503;
                }
            }
            /*
             * Acción necesaria para mostrar el mensaje de error.
             * Además recarga el store del grid en caso de que haya 
             * más de una acción satisfactoria.
             */
            mostrarMensaje(1, textoMensajeError, function () {
                if (arrSuccess.length > 0) {
                    myMask.show();
                    store.reload({
                        callback: function () {
                            myMask.hide();
                        }
                    });
                }
            });
        }
    },
    //Función necesaria para mostrar la ventana de adicionar o modificar
    mostrarWindow: function (accion, idioma, perfil, url, idanimate, subSelected) {
        new Ext.Conf.Subsistemas.WindowAdicionar({
            idioma: idioma,
            perfil: perfil,
            url: url,
            accion: accion,
            id: 'window' + accion,
            animateTarget: idanimate,
            grid: this.gpSubsistema,
            subSelected: subSelected,
            listeners: {
                scope: this,
                show: function (window) {
                    this.mapaTeclas.disable();
                },
                close: function (panel) {
                    this.mapaTeclas.enable();
                }
            }
        });
    },
    //Función necesaria para eliminar los subsistemas seleccionados
    delSubsistema: function (idioma) {
        var seleccionados = this.gpSubsistema.getSelectionModel().getSelections();
        var arrElim = new Array();
        for (var i = 0, long = seleccionados.length; i < long; i++) {
            arrElim.push({
                idsubsistema: seleccionados[i].data.idsubsistema,
                denominacion: seleccionados[i].data.denominacion,
                idestructurasubsist: (Ext.isEmpty(seleccionados[i].data.idestructurasubsist)) ? ''
                    : seleccionados[i].data.idestructurasubsist
            });
        }

        //Desactivando el mapa de teclas
        this.mapaTeclas.disable();
        var msgPreguntaElim = (arrElim.length > 1) ? idioma.msgPreguntaElimMany
            : idioma.msgPreguntaElimOne;
        mostrarMensaje(2, msgPreguntaElim, function (btn) {

            if (btn === 'ok') {
                var msgEliminando = (arrElim.length > 1) ? idioma.msgEliminandoMany
                    : idioma.msgEliminandoOne;

                Ext.MessageBox.wait(msgEliminando, idioma.msgEspere);

                Ext.Ajax.request({
                    scope: this,
                    method: 'post',
                    params: {
                        ids: Ext.encode(arrElim)
                    },
                    url: this.url + 'del',
                    callback: function (options, success, response) {

                        var response = Ext.decode(response.responseText);
                        var arrErrores = response.errors;
                        var arrSuccess = response.success;
                        Ext.MessageBox.hide();
                        //Activando el mapa de teclas
                        this.mapaTeclas.enable();

                        this.mostrarMensajesAction(arrErrores, arrSuccess, idioma);
                    }
                });
            }
            else {
                //Activando el mapa de teclas
                this.mapaTeclas.enable();
            }
        }.bind(this));
    }
});

//Inicializar la vista
Ext.QuickTips.init();
setTimeout(function () {
    //Inicializando la vista.
    new Ext.Conf.GestSubsistemas({});
}, 5);
