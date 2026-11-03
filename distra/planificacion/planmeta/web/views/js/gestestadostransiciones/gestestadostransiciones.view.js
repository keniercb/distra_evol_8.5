Ext.ns('Gestionar.estadostransiciones');
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
Ext.QuickTips.init();

Gestionar.estadostransiciones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        var teclascalientes;
        var addestado = false;
        var addflujo = false;
        var addtrans = false;
        _this.btnAdicionarEstado = new Ext.Button({
            text: idioma.btnAdd,
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            id: 'idbtnaddestado',
            tooltip: idioma.ttAddEst,
            handler: function() {
                interfaz = 'add';
                accionesAddModElimEstado(interfaz);
            }
        });

        _this.btnModificarEstado = new Ext.Button({
            text: idioma.btnMod,
            iconCls: 'btn',
            id: 'idbtnmodestado',
            tooltip: idioma.ttModEst,
            icon: perfil.dirImg + 'modificar.png',
            disabled: true,
            handler: function() {
                interfaz = 'mod';
                accionesAddModElimEstado(interfaz);
            }
        });

        _this.btnEliminarEstado = new Ext.Button({
            text: idioma.btnElim,
            iconCls: 'btn',
            id: 'idbtnelimestado',
            icon: perfil.dirImg + 'eliminar.png',
            tooltip: idioma.ttElimEst,
            disabled: true,
            handler: function() {
                accionesAddModElimEstado();
            }
        });

        _this.btnAdicionarFlujo = new Ext.Button({
            text: idioma.btnAdd,
            iconCls: 'btn',
            id: 'idbtnaddflujo',
            icon: perfil.dirImg + 'adicionar.png',
            tooltip: idioma.ttAddFluj,
            handler: function() {
                interfaz = 'add';
                accionesAddModElimFlujo(interfaz);
            }
        });

        _this.btnModificarFlujo = new Ext.Button({
            text: idioma.btnMod,
            iconCls: 'btn',
            id: 'idbtnmodflujo',
            icon: perfil.dirImg + 'modificar.png',
            tooltip: idioma.ttModFluj,
            disabled: true,
            handler: function() {
                interfaz = 'mod';
                accionesAddModElimFlujo(interfaz);
            }
        });

        _this.btnEliminarFlujo = new Ext.Button({
            text: idioma.btnElim,
            iconCls: 'btn',
            id: 'idbtnelimflujo',
            icon: perfil.dirImg + 'eliminar.png',
            tooltip: idioma.ttElimFluj,
            disabled: true,
            handler: function() {
                accionesAddModElimFlujo();
            }
        });

        _this.btnAdicionarTrans = new Ext.Button({
            text: idioma.btnAdd,
            disabled:true,
            id: 'idbtnaddtrans',
            iconCls: 'btn',
            icon: perfil.dirImg + 'adicionar.png',
            tooltip: idioma.ttAddTrans,
            handler: function() {
                interfaz = 'add';
                accionesAddModElimTransicion(interfaz);
            }
        });

        _this.btnModificarTrans = new Ext.Button({
            text: idioma.btnMod,
            iconCls: 'btn',
            id: 'idbtnmodtrans',
            icon: perfil.dirImg + 'modificar.png',
            tooltip: idioma.ttModTrans,
            disabled: true,
            handler: function() {
                interfaz = 'mod';
                accionesAddModElimTransicion(interfaz);
            }
        });

        _this.btnEliminarTrans = new Ext.Button({
            text: idioma.btnElim,
            iconCls: 'btn',
            id: 'idbtnelimtrans',
            icon: perfil.dirImg + 'eliminar.png',
            tooltip: idioma.ttElimTrans,
            disabled: true,
            handler: function() {
                accionesAddModElimTransicion();
            }
        });

        _this.btnLimpiarEst = new Ext.Button({
            text: idioma.btnLimp,
            iconCls: 'btn',
            id: 'idbtnlimpestado',
            icon: perfil.dirImg + 'limpiar.png',
            tooltip: idioma.ttLimpEst,
            handler: function() {
                accionesLimpEstado();
            }
        });

        _this.btnLimpiarFluj = new Ext.Button({
            text: idioma.btnLimp,
            iconCls: 'btn',
            id: 'idbtnlimpflujo',
            icon: perfil.dirImg + 'limpiar.png',
            tooltip: idioma.ttLimpFlujo,
            handler: function() {
                accionesLimpFlujo();
            }
        });

        _this.btnLimpiarTrans = new Ext.Button({
            text: idioma.btnLimp,
            iconCls: 'btn',
            id: 'idbtnlimptrans',
            icon: perfil.dirImg + 'limpiar.png',
            tooltip: idioma.ttLimpTrans,
            handler: function() {
                accionesLimpTrans();
            }
        });

        _this.btnAyudaFunc = new Ext.Button({
            text: idioma.btnAyuda,
            iconCls: 'btn',
            icon: perfil.dirImg + 'ayuda.png',
            tooltip: idioma.ttAyuda,
            id: "btnayudaEst"
        });


        _this.smEstados = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: CambiarEstadoBotones
            }
        });


        function EstaSelecionado() {
            return _this.smEstados.hasSelection();
        }

        function CambiarEstadoBotones() {
            if (EstaSelecionado() && _this.smEstados.getSelected().data.uso == 0) {
                _this.smFlujo.clearSelections();
                _this.smTransiciones.clearSelections();
                _this.gpTransiciones.collapse(true);
                _this.btnModificarTrans.disable();
                _this.btnEliminarTrans.disable();
                _this.btnModificarFlujo.disable();
                _this.btnEliminarFlujo.disable();
                _this.btnModificarEstado.enable();
                _this.btnEliminarEstado.enable();
            } else {
                _this.smFlujo.clearSelections();
                _this.smTransiciones.clearSelections();
                _this.gpTransiciones.collapse(true);
                _this.btnModificarTrans.disable();
                _this.btnEliminarTrans.disable();
                _this.btnModificarFlujo.disable();
                _this.btnEliminarFlujo.disable();
                _this.btnModificarEstado.disable();
                _this.btnEliminarEstado.disable();
            }
        }


        _this.filtrosestados = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'listado',
                    dataIndex: 'denominacion',
                    idcombo: 'idfiltroestados',
                    urlcb: 'listarEstados',
                    idstore: 'idcbestados',
                    valueFieldcb: 'idestadosft',
                    displayFieldcb: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion',
                }, {
                    type: 'list',
                    dataIndex: 'uso',
                    options: [idioma.lbSi,
                        idioma.lbNo]
                }
            ]
        });

        _this.clEstados = new Ext.grid.ColumnModel([
            {header: idioma.textDenom, width: 150, sortable: true, dataIndex: 'denominacion'},
            {header: idioma.textDescrip, width: 150, sortable: true, dataIndex: 'descripcion'},
            {header: idioma.textUso, sortable: true, dataIndex: 'uso', id: 'expandir', renderer: crearToolTip}
        ]);

        _this.gpEstados = new Ext.grid.GridPanel({
            title: idioma.titlepEstados,
            frame: true,
            autoWidth: true,
            border: true,
            region: 'west',
            split: true,
            width: 500,
            height: 300,
            collapsible: true,
            autoExpandColumn: 'expandir',
            plugins: _this.filtrosestados,
            store: modelo.stEstados,
            loadMask: {store: modelo.stEstados},
            sm: _this.smEstados,
            cm: _this.clEstados,
            tbar: [_this.btnAdicionarEstado, _this.btnModificarEstado, _this.btnEliminarEstado],
            bbar: new Ext.PagingToolbar({
                id: 'ptestados',
                pageSize: 20,
                store: modelo.stEstados,
                displayInfo: true,
                items: [_this.btnLimpiarEst]
            })
        });

        modelo.stEstados.reload({
            params: {
                start: 0,
                limit: 20
            }
        });

        _this.gpEstados.focus(true, 500);

        _this.smFlujo = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });


        _this.filtrosflujo = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'listado',
                    dataIndex: 'denominacion',
                    idcombo: 'idfiltroflujo',
                    urlcb: 'listarFlujoTrabajo',
                    idstore: 'idcbflujos',
                    valueFieldcb: 'idflujotrabajo',
                    displayFieldcb: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion',
                }, {
                    type: 'list',
                    dataIndex: 'uso',
                    options: [idioma.lbSi,
                        idioma.lbNo]
                }

            ]
        });


        _this.clFlujo = new Ext.grid.ColumnModel([
            {header: idioma.textDenom, width: 200, sortable: true, dataIndex: 'denominacion'},
            {header: idioma.textDescrip, width: 200, sortable: true, dataIndex: 'descripcion'},
            {header: idioma.textUso, sortable: true, dataIndex: 'uso', id: 'expandir', renderer: crearToolTip}
        ]);

        _this.gpFlujo = new Ext.grid.GridPanel({
            title: idioma.titlepFlujo,
            frame: true,
            autoWidth: true,
            autoScroll: true,
            region: 'center',
            heigth: '50%',
            plugins: _this.filtrosflujo,
            autoExpandColumn: 'expandir',
            store: modelo.stFlujo,
            loadMask: {store: modelo.stFlujo},
            sm: _this.smFlujo,
            cm: _this.clFlujo,
            tbar: [_this.btnAdicionarFlujo, _this.btnModificarFlujo, _this.btnEliminarFlujo, '->', _this.btnAyudaFunc],
            bbar: new Ext.PagingToolbar({
                id: 'ptflujo',
                pageSize: 20,
                store: modelo.stFlujo,
                displayInfo: true,
                items: [_this.btnLimpiarFluj]
            })
        });
        modelo.stFlujo.reload({
            params: {
                start: 0,
                limit: 20
            }
        });

        _this.smTransiciones = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: CambiarEstadoBotonesTransiciones
            }
        });

        function EstaSelecionadoTransiciones() {
            return _this.smTransiciones.hasSelection();
        }

        function CambiarEstadoBotonesTransiciones() {
            if (EstaSelecionadoTransiciones() && _this.smFlujo.getSelected().data.uso == 0) {
                _this.btnModificarTrans.enable();
                _this.btnEliminarTrans.enable();
                _this.btnAdicionarTrans.enable();
            }
            else {
                _this.btnModificarTrans.disable();
                _this.btnEliminarTrans.disable();
                _this.btnAdicionarTrans.disable();
            }
        }

        _this.filtrostransiciones = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'listado',
                    dataIndex: 'estadoinicial',
                    idcombo: 'idfiltrotranss',
                    urlcb: 'listarTransiciones',
                    idstore: 'idcbtrans',
                    valueFieldcb: 'estadoinicial',
                    displayFieldcb: 'estadoinicial'
                }, {
                    type: 'listado',
                    dataIndex: 'estadofinal',
                    idcombo: 'idfiltrotrans',
                    urlcb: 'listarTransiciones',
                    idstore: 'idcbtranss',
                    valueFieldcb: 'estadofinal',
                    displayFieldcb: 'estadofinal'
                }, {
                    type: 'list',
                    dataIndex: 'inicial',
                    options: [idioma.lbSi,
                        idioma.lbNo]
                }
            ]
        });

        _this.clTransiciones = new Ext.grid.ColumnModel([
            {header: idioma.textEstInic, width: 100, sortable: true, dataIndex: 'estadoinicial'},
            {header: idioma.textEstFinal, width: 100, sortable: true, dataIndex: 'estadofinal'},
            {header: idioma.textTransInic, width: 100, sortable: true, dataIndex: 'inicial', id: 'expandir', renderer: crearToolTip}
        ]);

        function crearToolTip(val, m) {
            if (val == 1) {
                m.attr = 'ext:qtip="' + "Si" + '"';
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

        }
        _this.ptTrans = new Ext.PagingToolbar({
            id: 'pttransiciones',
            pageSize: 20,
            store: modelo.stTransiciones,
            displayInfo: true,
            width: 400
        });

        _this.gpTransiciones = new Ext.grid.GridPanel({
            title: idioma.titlepTrans,
            frame: true,
            border: false,
            region: 'south',
            height: 300,
            autoWidth: true,
            collapsible: true,
            collapsed: true,
            plugins: _this.filtrostransiciones,
            autoExpandColumn: 'expandir',
            store: modelo.stTransiciones,
            loadMask: {store: modelo.stTransiciones},
            sm: _this.smTransiciones,
            cm: _this.clTransiciones,
            tbar: [_this.btnAdicionarTrans, _this.btnModificarTrans, _this.btnEliminarTrans],
            bbar: new Ext.PagingToolbar({
                id: 'pttrans',
                pageSize: 20,
                store: modelo.stTransiciones,
                displayInfo: true,
                items: [_this.btnLimpiarTrans]
            })
        });


        //------------Ventana estado ------------------

        _this.tfDenomEstado = new Ext.form.TextField({
            fieldLabel: idioma.textDenom,
            id: 'tfDen',
            width: 200,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            allowBlank: false,
            regex: /^[aA-zZ]+$/,
            regexText: 'Solo admite caracteres alfanuméricos y el(los) carácter(es) especial(es)(guion, guion bajo, comillas, comillas dobles, ()).',
            listeners: {
                change: function() {
                    _this.btnAceptarEstado.enable();
                }
            }
        });

        _this.tfDescripEstado = new Ext.form.TextField({
            fieldLabel: idioma.textDescrip,
            width: 200,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            allowBlank: false,
            listeners: {
                change: function() {
                    _this.btnAceptarEstado.enable();
                }
            }
        });
        _this.fpEstado = new Ext.FormPanel({
            frame: true,
            width: 230.5,
            heigth: 250,
            id: 'fpEstado',
            labelAlign: 'top',
            items: [_this.tfDenomEstado, _this.tfDescripEstado]
        });


        _this.btnAceptarEstado = new Ext.Button({
            text: idioma.textAceptar,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            tooltip: idioma.ttAceptar,
            handler: function() {
                addestado = true;
                if (!EstaSelecionado()) {
                    accionesAceptarEstado('add');
                }
                else {
                    accionesAceptarEstado('mod');
                }
            }
        });

        _this.btnAplicarEstado = new Ext.Button({
            text: idioma.textAplicar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aplicar.png',
            tooltip: idioma.ttAplicar,
            handler: function() {
                accionesAplicarEstado();
            }

        });

        _this.btnCancelarEstado = new Ext.Button({
            text: idioma.textCancelar,
            id: 'btnCancelarEstado',
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png',
            tooltip: idioma.ttCancelar
        });

        _this.wEstado = new Ext.Window({
            width: 245,
            heigth: 550,
            modal: true,
            closeAction: 'hide',
            items: [_this.fpEstado],
            buttons: [_this.btnCancelarEstado, _this.btnAplicarEstado, _this.btnAceptarEstado],
            listeners: {
                hide: function() {
                    if (!addestado) {
                        modelo.stEstados.reload({params: {
                                start: 0,
                                limit: 20

                            }});
                    }
                }
            }
        });


        //------------Ventana Flujo ------------------

        _this.btnAceptarFlujo = new Ext.Button({
            text: idioma.textAceptar,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            tooltip: idioma.ttAceptar,
            handler: function() {
                addflujo = true;
                if (!_this.smFlujo.hasSelection()) {
                    accionesAceptarFlujo('add');
                }
                else {
                    accionesAceptarFlujo('mod');
                }
            }
        });

        _this.tfDenomFlujo = new Ext.form.TextField({
            fieldLabel: idioma.textDenom,
            width: 200,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            allowBlank: false,
            listeners: {
                change: function() {
                    _this.btnAceptarFlujo.enable();
                }
            }
        });

        _this.tfDescripFlujo = new Ext.form.TextField({
            fieldLabel: idioma.textDescrip,
            width: 200,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            allowBlank: false,
            listeners: {
                change: function() {
                    _this.btnAceptarFlujo.enable();
                }
            }
        });

        _this.fpFlujo = new Ext.form.FormPanel({
            frame: true,
            id: 'fpFlujo',
            width: 230.5,
            heigth: 450,
            labelAlign: 'top',
            items: [_this.tfDenomFlujo, _this.tfDescripFlujo]
        });
        _this.btnAplicarFlujo = new Ext.Button({
            text: idioma.textAplicar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aplicar.png',
            tooltip: idioma.ttAplicar,
            handler: function() {
                accionesAplicarFlujo();
            }
        });

        _this.btnCancelarFlujo = new Ext.Button({
            text: idioma.textCancelar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png',
            tooltip: idioma.ttCancelar,
            handler: function() {
                _this.tfDenomFlujo.setValue('');
                _this.tfDescripFlujo.setValue('');
                accionesCancelarFlujo();
            }
        });

        _this.wFlujo = new Ext.Window({
            width: 245,
            heigth: 550,
            modal: true,
            closeAction: 'hide',
            items: [_this.fpFlujo],
            buttons: [_this.btnCancelarFlujo, _this.btnAplicarFlujo, _this.btnAceptarFlujo],
            listeners: {
                hide: function() {
                    if (!addflujo) {
                        modelo.stFlujo.reload({params: {
                                start: 0,
                                limit: 20

                            }});
                    }
                }
            }
        });

        //------------Ventana Transicion ------------------
        _this.btnAceptarTransicion = new Ext.Button({
            text: idioma.textAceptar,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
            tooltip: idioma.ttAceptar,
            handler: function() {
                addtrans = true;
                if (!EstaSelecionadoTransiciones()) {
                    accionesAceptarTransicion('add');
                }
                else {
                    accionesAceptarTransicion('mod');
                }
            }
        });

        _this.btnAplicarTransicion = new Ext.Button({
            text: idioma.textAplicar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'aplicar.png',
            tooltip: idioma.ttAplicar,
        });

        _this.btnCancelarTransicion = new Ext.Button({
            text: idioma.textCancelar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'cancelar.png',
            tooltip: idioma.ttCancelar
        });

        _this.cbEstadoInic = new Ext.form.ComboBox({
            fieldLabel: idioma.textEstInic,
            emptyText: 'Seleccione',
            width: 120,
            store: modelo.stEstadosIniciales,
            displayField: 'denominacion',
            valueField: 'idestadosft',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            allowBlank: false,
            listeners: {
                select: function(cb, rec, num) {
                    modelo.stEstadosFinales.load({params: {
                            denominacion: cb.getRawValue(),
                            idflujo: _this.smFlujo.getSelected().data.idflujotrabajo
                        }});
                },
                change: function() {
                    _this.btnAceptarTransicion.enable();
                }

            }
        });

        _this.cbEstadoFinal = new Ext.form.ComboBox({
            fieldLabel: idioma.textEstFinal,
            emptyText: 'Seleccione',
            width: 120,
            store: modelo.stEstadosFinales,
            displayField: 'denominacion',
            valueField: 'idestadosft',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            allowBlank: false,
            listeners: {
                change: function() {
                    _this.btnAceptarTransicion.enable();
                }
            }
        });

        _this.chbEstadoInicial = new Ext.form.Checkbox({
            fieldLabel: idioma.textInic,
            listeners: {
                change: function() {
                    _this.btnAceptarTransicion.enable();
                }
            }
        });

        _this.fpTransicion = new Ext.form.FormPanel({
            frame: true,
            border: false,
            labelAlign: 'top',
            width: 900,
            height: 70,
            region: 'north',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .47,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.cbEstadoInic]

                        }, {
                            columnWidth: .47,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [_this.cbEstadoFinal]
                        }, {
                            columnWidth: .06,
                            layout: 'form',
                            items: [_this.chbEstadoInicial]
                        }]
                }]
        });

        _this.smTodosUser = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmTodosUser = new Ext.grid.ColumnModel([{
                header: 'Usuario',
                width: 150,
                sortable: true,
                dataIndex: 'nombreusuario'
            }
        ]);

        _this.cmUserAutorizados = new Ext.grid.ColumnModel([{
                header: 'Usuario',
                width: 150,
                sortable: true,
                dataIndex: 'nombreusuario'
            }
        ]);

        _this.tfSearchLeftGrid = new Ext.form.TextField({
            emptyText: 'emptyTextBuscar +...',
            id: 'tfSearchLeftGrid',
            enableKeyEvents: true,
            disabled: true
        });

        _this.lbdisponibles = new Ext.Toolbar.TextItem({
            text: 'Disponibles',
            style: 'margin:0 0 0 20'
        });

        _this.btnAgregarTodos = new Ext.Toolbar.Button({
            text: 'Agregar todos',
            tooltip: 'scope.etiquetas.tooltipAddAll',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            style: 'margin:0 15 0 0'
        });

        _this.gpTodosUser = new Ext.grid.GridPanel({
            id: 'gpTodosUser',
            title: idioma.lbTodosUsers,
            enableDragDrop: true,
            ddGroup: 'leftGridDDGroup',
            autoScroll: true,
            stripeRows: true,
            region: 'west',
            loadMask: true,
            border: false,
            height: 300,
            width: 200,
            sm: _this.smTodosUser,
            cm: _this.cmTodosUser,
            store: modelo.stTodosUser
        });

        _this.smRightGrid = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.tfSearchRightGrid = new Ext.form.TextField({
            emptyText: 'buscar',
            id: 'tfSearchRightGrid',
            enableKeyEvents: true,
            disabled: true
        });

        _this.lbseleccionados = new Ext.Toolbar.TextItem({
            text: 'seleeccionados',
            style: 'margin:0 0 0 20'
        });

        _this.btnRemoveTodos = new Ext.Toolbar.Button({
            text: 'scope.etiquetas.lbRemoveAll',
            tooltip: 'scope.etiquetas.tooltipRemoveAll',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            style: 'margin:0 15 0 0',
            scope: this
        });

        _this.btnAsociarEstado = new Ext.Button({
            tooltip: 'Asociar usuario(s)',
            iconCls: 'btn',
            icon: perfil.dirImg + 'siguiente.png'
        });
        _this.btnDesAsociarEstado = new Ext.Button({
            tooltip: 'Desasociar usuario(s)',
            iconCls: 'btn',
            icon: perfil.dirImg + 'anterior.png'
        });

        _this.pasociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:150px 15px',
            bodyCfg: {
                tag: 'center',
                cls: 'x-panel-body'
            },
            items: [_this.btnAsociarEstado, _this.btnDesAsociarEstado]
        });

        _this.rightGrid = new Ext.grid.GridPanel({
            id: 'rightGrid',
            title: idioma.lbUserAut,
            enableDragDrop: true,
            ddGroup: 'rightGridDDGroup',
            autoScroll: true,
            frame: true,
            stripeRows: true,
            region: 'east',
            border: false,
            width: 200,
            height: 300,
            sm: _this.smRightGrid,
            store: modelo.stUserAutorizados,
            viewConfig: {
                forceFit: true
            },
            cm: _this.cmUserAutorizados
        });

        _this.fpUsers = new Ext.Panel({
            title: 'Gesti&oacute;n de usuarios',
            width: 500,
            height: 400,
            layout: 'border',
            region: 'center',
            border: true,
            disabled: true,
            items: [_this.gpTodosUser, _this.pasociar, _this.rightGrid]
        });

        _this.displayPanel = new Ext.Panel({
            width: 500,
            height: 520,
            layout: 'border',
            border: true,
            items: [_this.fpTransicion, _this.fpUsers]
        });

        _this.wTransicion = new Ext.Window({
            width: 500,
            heigth: 540,
            modal: true,
            layout: 'fit',
            closeAction: 'hide',
            items: _this.displayPanel,
            buttons: [_this.btnCancelarTransicion, _this.btnAplicarTransicion, _this.btnAceptarTransicion],
            listeners: {
                beforeshow: function() {
                    modelo.stEstadosIniciales.load({params: {
                            idflujo: _this.smFlujo.getSelected().data.idflujotrabajo
                        }});
                },
                hide: function() {
                    if (!addtrans &&  _this.smFlujo.getSelected().data.idflujotrabajo!=null) {
                        modelo.stTransiciones.reload({params: {
                                start: 0,
                                limit: 20,
                                idflujo: _this.smFlujo.getSelected().data.idflujotrabajo

                            }})
                    }

                }
            }
        });

        //--------------- Paneles -----------------------
        _this.pContenido = new Ext.Panel({
            frame: true,
            layout: 'border',
            region: 'center',
            width: 200,
            border: false,
            items: [_this.gpFlujo, _this.gpTransiciones]
        });



        _this.vEstadosTrnsiciones = new Ext.Viewport({
            frame: true,
            layout: 'border',
            border: false,
            width: 200,
            items: [_this.gpEstados, _this.pContenido]
        });

        //------------------------- Teclas calientes ------------------------------ 


        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'iI', //Adicionar
                alt: true,
                fn: function() {
                    accionesAddModElimEstado('add');
                }
            }, {
                key: 'mM', //Modificar
                alt: true,
                fn: function() {
                    accionesAddModElimEstado('mod');
                }
            }, {
                key: 46, //Eliminar
                fn: function() {
                    accionesAddModElimEstado();
                }
            }, {
                key: 'lL', //Limpiar
                alt: true,
                fn: function() {
                    accionesLimpEstado();
                }
            }
        ]);

        teclascalientes = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'Ii',
                ctrl: true,
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function() {
                    map.disable();
                    Ext.getCmp('idbtnaddflujo').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Ii',
                alt: true,
                shift: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnaddtrans').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Mm',
                ctrl: true,
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnmodflujo').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Mm',
                alt: true,
                shift: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnmodtrans').handler.call(this);
                    map.enable();
                }

            }, {
                key: 46,
                ctrl: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnelimflujo').handler.call(this);
                    map.enable();
                }

            }, {
                key: 46,
                shift: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnelimtrans').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Ll',
                ctrl: true,
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnlimpflujo').handler.call(this);
                    map.enable();
                }

            }, {
                key: 'Ll',
                alt: true,
                shift: true,
                scope: this,
                stopEvent: true,
                fn: function(_this) {
                    map.disable();
                    Ext.getCmp('idbtnlimptrans').handler.call(this);
                    map.enable();
                }

            }


        ]);


        teclascalientes.enable();

        function mostrarAyuda(referencia, title) {
            var title = 'Ayuda';
            var referencia = 'estadosTransiciones';
            help.show(title, referencia);
        }
    }

};