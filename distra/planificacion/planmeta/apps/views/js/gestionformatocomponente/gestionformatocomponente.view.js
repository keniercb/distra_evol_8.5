Ext.ns('Gestionar.formato');
Ext.QuickTips.init();

var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));

Gestionar.formato.Vista = {
    init: function(idioma, modelo) {
        _this = this;

// -----------------  Formato -----------------------------------------------------------------------------------

        _this.btn_limpiar_formato = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipLimpiarformato,
            iconCls: 'limpiar',
            handler: function() {
                filtrosFormatoComponente.clearFilters();
            }
        });

        _this.btn_actualizar_formato = new Ext.Button({
            text: idioma.btnActualizar,
            tooltip: idioma.toolTipActualizar,
            iconCls: 'actualizar'
        });



        _this.sm_formato = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_formato = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {
                header: idioma.tldenom,
                width: 200,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip,
                tooltip: 'Denominación'
            }, {
                header: idioma.tlDescrip,
                width: 200,
                sortable: true,
                dataIndex: 'descripcion',
                renderer: crearToolTip,
                tooltip: 'Descripción'
            }, {
                header: idioma.tlaprobado,
                width: 200,
                sortable: true,
                dataIndex: 'aprobado',
                tooltip: 'Aprobado',
                renderer: modificarEstado
            }, {
                header: idioma.tlactivado,
                width: 200,
                sortable: true,
                dataIndex: 'activado',
                tooltip: 'Activado',
                renderer: modificarEstado

            }, {
                header: idioma.tlenuso,
                width: 200,
                sortable: true,
                dataIndex: 'uso',
                tooltip: 'En uso',
                renderer: modificarEstado
            }
        ]);

        filtrosFormatoComponente = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'list',
                    dataIndex: 'activado',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'aprobado',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'uso',
                    options: ['Si', 'No']
                }]
        });

        _this.grid_gestionar_formato = new Ext.grid.GridPanel({
            frame: true,
            border: false,
            title: idioma.gridtituloGestionarformato,
            height: 165,
            autoWidth: true,
            store: modelo.store_gestionar_formato,
            plugins: filtrosFormatoComponente,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            loadMask: {store: modelo.store_gestionar_formato},
            sm: _this.sm_formato,
            cm: _this.colModel_formato,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptformato',
                store: modelo.store_gestionar_formato,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_formato]
            })
        });

        _this.btn_adicionar_formato = new Ext.Button({
            id: 'idbtnAdicionarFormato',
            text: idioma.btnAdicionar,
            tooltip: idioma.toolTipAdicionarformato,
            iconCls: 'adicionar'
        });


        _this.btn_modificar_formato = new Ext.Button({
            text: idioma.btnModificar,
            tooltip: idioma.toolTipModificarformato,
            iconCls: 'modificar',
            disabled: true
        });
        _this.btn_eliminar_formato = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminarformato,
            iconCls: 'eliminar',
            disabled: true
        });


        _this.btn_desactivar_formato = new Ext.Button({
            text: idioma.btnDesactivarformato,
            tooltip: idioma.btntooDesactivarformato,
            iconCls: 'btn',
            icon: perfil.dirImg + 'deshabilitar.png',
            disabled: true


        });

        _this.btnMenuAprobacion = new Ext.Toolbar.MenuButton({
            text: idioma.btnAprobacionformato,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [{
                        id: 'btnAprobar',
                        text: idioma.toolTipAprobarformato,
                        tooltip: idioma.toolTipAprobarformato,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'aprobar.png',
                        disabled: true
                    }, {
                        id: 'btnDesAprobar',
                        text: idioma.toolTipDesaprobarformato,
                        tooltip: idioma.toolTipDesaprobarformato,
                        iconCls: 'btn',
                        icon: perfil.dirImg + 'desaprobar.png',
                        disabled: true
                    }

                ]
            }
        });

        _this.btn_activar_formato = new Ext.Button({
            text: idioma.btnActivarformato,
            tooltip: idioma.btnToolActivarformato,
            iconCls: 'btn',
            icon: perfil.dirImg + 'habilitar.png',
            disabled: true
        });

        _this.btn_ayuda_formato = new Ext.Button({
            id: 'btn_ayuda_formato_componente',
            text: idioma.btnAyuda,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            tooltip: idioma.toolTipAyudaformato
        });
        
        
        _this.panel_gestionar_formato = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            height: 200,
            border: true,
            frame: true,
            tbar: [_this.btn_adicionar_formato, _this.btn_modificar_formato, _this.btn_eliminar_formato,
                _this.btnMenuAprobacion, _this.btn_activar_formato, _this.btn_desactivar_formato, '->', _this.btn_ayuda_formato],
            items: [_this.grid_gestionar_formato]

        });

//------------------------ Adicionar formato de componente ------------------------------
        _this.denominacion = new Ext.form.TextField({
            id: 'idtfdenominacionAdicionarFC',
            fieldLabel: idioma.tldenom,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            anchor: '95%',
            maxLength: 255,
            enableKeyEvents: true,
            allowBlank: false
        });

        _this.codigo = new Ext.form.TextArea({
            fieldLabel: idioma.tlDescrip,
            id: 'idC',
            anchor: '95%',
            height: '95',
            allowBlank: false
        });

        _this.formulario_general_formato = new Ext.form.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            width: 300,
            height: 200,
            frame: true,
            items: [_this.denominacion, _this.codigo]
        });

        _this.btn_aceptar_formato = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.tooltipAceptar,
            disabled: false
        });

        _this.btn_aplicar_formato = new Ext.Button({
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            tooltip: idioma.tooltipAplicar,
            disabled: false
        });

        _this.btn_cancelar_formato = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.tooltipCancela
        });


        _this.window_general_formato = new Ext.Window({
            title: idioma.vtadicionarComponente,
            width: 300,
            height: 250,
            modal: true,
            resizable: false,
            closeAction: 'hide',
            frame: true,
            items: [_this.formulario_general_formato],
            buttons: [_this.btn_cancelar_formato, _this.btn_aplicar_formato, _this.btn_aceptar_formato]
        });

        // -----------------  Componentes -----------------------------------------------------------------------

        _this.btn_limpiar_asociar_componente = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipLimpiarformato,
            iconCls: 'limpiar',
            handler: function() {
                filtrosAsociarComponentes.clearFilters();
            }
        })

        _this.btn_asociar_componente = new Ext.Button({
            text: idioma.btnAsociarCom,
            tooltip: idioma.toolTipAsociar,
            iconCls: 'asociar',
            disabled: true
        });

        _this.btn_desasociar_componente = new Ext.Button({
            text: idioma.btnDesasociarCom,
            tooltip: idioma.toolTipdeaasociarDoc,
            iconCls: 'deshacer',
            disabled: true

        });


        _this.btn_abajo = new Ext.Button({
            tooltip: 'Bajar',
            iconCls: 'abajo',
            disabled: true
        });

        _this.btn_arriba = new Ext.Button({
            tooltip: 'Subir',
            iconCls: 'arriba',
            icon: perfil.dirImg + 'arriba.png',
            disabled: true
        });

        _this.btnguardar = new Ext.Button({
            text: idioma.btnGuardar,
            tooltip: idioma.ttbtnGuardar,
            iconCls: 'guardar',
            icon: perfil.dirImg + 'guardar.png',
            disabled: true
        });


        _this.btn_limpiar = new Ext.Button({
            text: idioma.btnLimpiar,
            id: 'btnLimpiarT',
            tooltip: idioma.toolTipLimpiarformatoC,
            iconCls: 'limpiar',
            handler: function() {
                filtrosGestionarComponentes.clearFilters();
            }
        });


        _this.sm_componentes = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });




        _this.colModel_componentes = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {
                header: idioma.tldenom,
                tooltip: 'Denominación',
                renderer: crearToolTip,
                width: 500, sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: idioma.tlorden,
                tooltip: 'Orden',
                renderer: crearToolTip,
                width: 500,
                sortable: true,
                dataIndex: 'orden'
            },
            {
                header: idioma.cbflujoTrab,
                tooltip: 'Flujo de Trabajo',
                renderer: crearToolTip,
                width: 500,
                sortable: true,
                dataIndex: 'etapa'
            }
        ]);

        filtrosGestionarComponentes = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'numeric',
                    dataIndex: 'orden'
                }, {
                    type: 'listado',
                    dataIndex: 'etapa',
                    idcombo: 'idflujotrabajo',
                    urlcb: 'cargarFlujoTrabajo',
                    idstore: 'idflujotrabajo',
                    valueFieldcb: 'idflujotrabajo',
                    displayFieldcb: 'denominacion'
                }]
        });


        _this.grid_gestionar_componentes = new Ext.grid.GridPanel({
            frame: true,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            layout: 'fit',
            height: 130,
            plugins: filtrosGestionarComponentes,
            autoWidth: true,
            border: false,
            store: modelo.store_gestionar_componentes,
            loadMask: {store: modelo.store_gestionar_componentes},
            sm: _this.sm_componentes,
            cm: _this.colModel_componentes,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptcmps',
                store: modelo.store_gestionar_componentes,
                displayInfo: true,
                items: ['-', _this.btn_limpiar]
            })
        });

        _this.panel_gestionar_componentes = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            height: 200,
            border: false,
            frame: true,
            tbar: [_this.btn_asociar_componente, _this.btn_desasociar_componente, _this.btnguardar, _this.btn_abajo, _this.btn_arriba],
            items: [_this.grid_gestionar_componentes]
        });

        _this.btnAddComponente = new Ext.Button({
            text: idioma.tladdComponente,
            tooltip: idioma.tladdComponenteT,
            iconCls: 'adicionar'
        });

        _this.btnModComponente = new Ext.Button({
            text: idioma.tlModComponente,
            tooltip: idioma.tlModComponenteT,
            iconCls: 'modificar',
            disabled: true
        });

        _this.btnElimComponente = new Ext.Button({
            text: idioma.tlDelComponente,
            tooltip: idioma.tlDelComponenteT,
            iconCls: 'eliminar',
            disabled: true

        });

        _this.cbFlujoTrab = new Ext.form.ComboBox({
            emptyText: 'Flujo de trabajo',
            fieldLabel: idioma.cbflujoTrab,
            width: 165,
            id: 'idcbflujo',
            store: modelo.stFlujoTrabajo,
            displayField: 'denominacion',
            valueField: 'idflujotrabajo',
            typeAhead: true,
            mode: 'local',
            disabled: true,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false,
            labelAlign: 'left'
        });

        _this.smAsocComponentes = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmAsocComponentes = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {
                dataIndex: 'idnombreetapa',
                hidden: true
            }, {
                header: idioma.tldenom,
                tooltip: idioma.tldenom,
                width: 500, sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: idioma.tlDescrip,
                tooltip: idioma.tlDescrip,
                width: 500,
                sortable: true,
                dataIndex: 'descripcion'
            }
        ]);
        filtrosAsociarComponentes = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }]
        });

        _this.gpAsociarComponentes = new Ext.grid.GridPanel({
            frame: true,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            layout: 'form', region: 'center',
            autoWidth: true,
            border: false,
            store: modelo.stAsocComponentes,
            plugins: filtrosAsociarComponentes,
            loadMask: {store: modelo.stAsocComponentes},
            sm: _this.smAsocComponentes,
            cm: _this.cmAsocComponentes,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptasoccomponente',
                store: modelo.stAsocComponentes,
                displayInfo: true,
                emptyMsg: idioma.msgNoResults,
                items: ['-', _this.btn_limpiar_asociar_componente]
            })
        });

        _this.pAsociarComponente = new Ext.Panel({
            region: 'center',
            layout: 'border',
            height: 230,
            border: false,
            frame: true,
            tbar: [_this.btnAddComponente, _this.btnModComponente, _this.btnElimComponente, _this.cbFlujoTrab],
            items: [_this.gpAsociarComponentes]
        });

        _this.btnAceptarComp = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.tooltipAceptar,
            disabled: true
        });

        _this.btnAplicarComp = new Ext.Button({
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            tooltip: idioma.tooltipAplicar,
            disabled: true
        });

        _this.btnCancelarComp = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.tooltipCancela
        });

        _this.winAsociarComponente = new Ext.Window({
            title: idioma.btnAsociarCom,
            width: 603,
            height: 285,
            closeAction: 'hide',
            frame: true,
            modal: true,
            items: [_this.pAsociarComponente],
            buttons: [_this.btnCancelarComp, _this.btnAplicarComp, _this.btnAceptarComp]
        });

        _this.tfDenom = new Ext.form.TextField({
            id: 'idtfdenominacionAsociarComponente',
            fieldLabel: idioma.tldenom,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: idioma.caractAlfnum,
            anchor: '95%',
            maxLength: 255,
            enableKeyEvents: true,
            allowBlank: false
        });

        _this.taDescripc = new Ext.form.TextArea({
            fieldLabel: idioma.tlDescrip,
            anchor: '95%',
            height: '95',
            allowBlank: false
        });

        _this.fpGestComponente = new Ext.form.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            width: 300,
            height: 400,
            frame: true,
            items: [_this.tfDenom, _this.taDescripc]
        });

        _this.btnAceptarAddComp = new Ext.Button({
            id: 'btnAceptarAddComp',
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            modal: true,
            tooltip: idioma.tooltipAceptar,
        });

        _this.btnAplicarAddComp = new Ext.Button({
            id: 'btnAplicarAddComp',
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            tooltip: idioma.tooltipAplicar,
        });

        _this.btnCancelarAddComp = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.tooltipCancela
        });

        _this.winAddComponente = new Ext.Window({
            title: idioma.winAddComponente,
            width: 300,
            height: 250,
            modal: true,
            resizable: false,
            closeAction: 'hide',
            frame: true,
            items: [_this.fpGestComponente],
            buttons: [_this.btnCancelarAddComp, _this.btnAplicarAddComp, _this.btnAceptarAddComp]
        });

        // -----------------  Elementos -----------------------------------------------------------------------
        _this.btn_adicionar_elemento = new Ext.Button({
            id: 'btnAdicionar',
            text: idioma.btnAdicionarelemento,
            tooltip: idioma.toolTipAdicionarelemento,
            iconCls: 'adicionar',
            disabled: true
        });

        _this.btn_guardar_elemento = new Ext.Button({
            text: idioma.btnGuardar,
            tooltip: idioma.toolTipGuardarelemento,
            iconCls: 'guardar',
            disabled: true

        });

        _this.btn_eliminar_elemento = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.btnEliminar,
            tooltip: idioma.toolTipEliminarelemento,
            iconCls: 'eliminar',
            disabled: true

        });

        //-------------------------Asociar documento --------------------------

        _this.btnDesasociardoc = new Ext.Button({
            text: idioma.btnasociarDoc,
            tooltip: idioma.toolTipAsociardocumento,
            iconCls: 'asociar',
            disabled: true
        });

        _this.btnMenuAsociacion = new Ext.Toolbar.MenuButton({
            text: idioma.btnAsociacion,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [{
                        id: 'btnAsociardoc',
                        text: idioma.btnasociarDoc,
                        tooltip: idioma.toolTipAsociardocumento,
                        iconCls: 'asociar',
                        disabled: true
                    }, {
                        id: 'btnDesasociardoc',
                        text: idioma.btndeaasociarDoc,
                        tooltip: idioma.toolTipAsociardocumento,
                        iconCls: 'deshacer',
                        disabled: true
                    }]
            }
        });

        _this.smdocumento = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        _this.cmdocumentos = new Ext.grid.ColumnModel([
            _this.smdocumento, {
                header: idioma.tlIdent,
                dataIndex: 'iddocumentos',
                hidden: true
            }, {
                header: idioma.tldenom,
                width: 200,
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: 'Denominación'
            }
        ]);

        _this.gpdocumento = new Ext.grid.GridPanel({
            height: 365,
            width: 260,
            store: modelo.stDocumento,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            loadMask: {store: modelo.store_gestionar_formato},
            sm: _this.smdocumento,
            cm: _this.cmdocumentos
        });


        _this.formulario_asocdoc = new Ext.form.FormPanel({
            title: idioma.tlDoc,
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            width: 260,
            height: 365,
            frame: false,
            items: [_this.gpdocumento]
        });

        _this.btn_aceptar_asocdoc = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.tooltipAceptar
        });

        _this.btn_aplicar_asocdoc = new Ext.Button({
            text: idioma.btnAplicar,
            iconCls: 'aplicar',
            tooltip: idioma.tooltipAplicar
        });

        _this.btn_cancelar_asocdoc = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.tooltipCancela
        });


        _this.window_asocdoc = new Ext.Window({
            title: idioma.vtAsociardoc,
            width: 260,
            height: 370,
            modal: true,
            closeAction: 'hide',
            frame: true,
            items: [_this.formulario_asocdoc],
            buttons: [_this.btn_cancelar_asocdoc, _this.btn_aplicar_asocdoc, _this.btn_aceptar_asocdoc]
        });

        _this.btn_limpiar_elemento = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipLimpiarformato,
            iconCls: 'limpiar',
            handler: function() {
                filtrosGestionarElementos.clearFilters();
            }
        });




        _this.sm_elementos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_elementos = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(), {
                header: idioma.tldenom,
                tooltip: 'Denominación',
                width: 300,
                sortable: true,
                renderer: crearToolTip,
                dataIndex: 'denelemento',
                editor: new Ext.form.TextField({
                    disabledClass: 'disabled-component',
                    selectOnFocus: true,
                    allowBlank: false
                })
            }, {
                header: idioma.tlasociados,
                width: 300,
                sortable: true,
                renderer: modificarEstado,
                dataIndex: 'documento',
                value: "No"
            }, {
                header: idioma.tltipomodelo,
                width: 300,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: rendeTipo,
                editor: new Ext.form.ComboBox({
                    id: 'idcbtipomodelo',
                    mode: 'remote',
                    triggerAction: 'all',
                    emptyText: idioma.etCombFormato,
                    typeAhead: true,
                    hiddenName: 'idtipomodelo',
                    valueField: 'idtipomodelo',
                    displayField: 'denominacion',
                    store: modelo.stTipomodelo
                })
            }

        ]);

        filtrosGestionarElementos = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denelemento'
                }, {
                    type: 'list',
                    dataIndex: 'documento',
                    options: ['Si', 'No']
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });

        _this.grid_gestionar_elementos = new Ext.grid.EditorGridPanel({
            frame: true,
            id: 'grid_gestionar_elementos',
            height: 130,
            autoWidth: true,
            border: false,
            plugins: filtrosGestionarElementos,
            store: modelo.store_gestionar_elementos,
            loadMask: {store: modelo.store_gestionar_elementos},
            sm: _this.sm_elementos,
            cm: _this.colModel_elementos,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptelementos',
                store: modelo.store_gestionar_elementos,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_elemento]
            })
        });
        _this.panel_gestionar_elementos = new Ext.Panel({
            region: 'south',
            collapsible: true,
            collapsed: true,
            layout: 'fit',
            title: idioma.tpElementos,
            height: 200,
            border: false,
            frame: true,
            tbar: [_this.btn_adicionar_elemento, _this.btn_guardar_elemento, _this.btn_eliminar_elemento, _this.btnMenuAsociacion],
            items: [_this.grid_gestionar_elementos]

        });


        _this.panel_contenedor = new Ext.Panel({
            id: 'idPanelContendor',
            title: 'Componentes',
            titleCollapse: true,
            collapsed: true,
            region: 'south',
            layout: 'border',
            collapsible: true,
            split: true,
            border: false,
            height: 400,
            frame: true,
            items: [_this.panel_gestionar_componentes, _this.panel_gestionar_elementos]
        });

        // -----------------  General -----------------------------------------------------------------------

        _this.gestionar_formato_view = new Ext.Viewport({
            frame: true,
            height: 1500,
            layout: 'border',
            items: [_this.panel_gestionar_formato, _this.panel_contenedor]
        });

        function rendeTipo(idtipomodelo) {
            var index = modelo.stTipomodelo.find('idtipomodelo', idtipomodelo);
            if (index > -1) {
                var record = modelo.stTipomodelo.getAt(index);
                return record.get('denominacion');
            }
            return idtipomodelo;
        }

        //crear los tooltips de los grid
        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }


        function modificarEstado(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }

        function GetPalabraColumna(val, col)
        {
            if (col == 3)
                return (val == 1) ? 'Activado' : 'Desactivado';
            if (col == 4)
                return (val == 1) ? 'Aprobado' : 'Desaprobado';
            if (col == 5)
                return (val == 1) ? 'Est&aacute; en uso' : 'No est&aacute; en uso';
        }

       
    }
};