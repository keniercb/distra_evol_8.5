Ext.ns('Gestionar.clasifinversiones');
var window_general_inversiones;
var esta = false;
Gestionar.clasifinversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        _this.btn_adicionar_inversiones = new Ext.Button({
            text: idioma.btnAdicionarinversiones,
            tooltip: idioma.toolTipAdicionarinversiones,
            iconCls: 'adicionar',
            id: 'btnAdd',
            handler: function() {
                interfaz = 'add';
                modificar = 'add';
                AccionesAddModElim(interfaz);
            }
        });
        _this.btn_modificar_inversiones = new Ext.Button({
            text: idioma.btnModificarinversiones,
            tooltip: idioma.toolTipModificarinversiones,
            iconCls: 'modificar',
            disabled: true,
            id: 'btnMod',
            handler: function() {
                interfaz = 'mod';
                AccionesAddModElim(interfaz);
            }

        });
        _this.btn_eliminar_inversiones = new Ext.Button({
            text: idioma.btnEliminarinversiones,
            tooltip: idioma.toolTipEliminarinversiones,
            iconCls: 'eliminar',
            disabled: true,
            handler: function() {
                btn = 'yes';
                Eliminar();
            }

        });

        _this.btnMenuAsociacion = new Ext.Button({
            id: 'btnAsociardoc',
            text: idioma.btnAsociacion,
            tooltip: idioma.toolTipAsociardocumento,
            iconCls: 'asociar',
            id: 'btnMenuAsociacion',
        });

        /*_this.btnMenuAsociacion = new Ext.Toolbar.MenuButton({
            text: idioma.btnAsociacion,
            tooltip: idioma.toolTipAsociacion,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [{
                    id: 'btnAsociardoc',
                    text: idioma.btnasociarDoc,
                    tooltip: idioma.toolTipAsociardocumento,
                    iconCls: 'asociar',
                    //disabled: true
                }]
            }
        });*/

        _this.btn_ayuda_inversiones = new Ext.Button({
            id: 'btnAyudaClasificacionInversiones',
            text: idioma.btnAyudainversiones,
            icon: perfil.dirImg + 'ayuda.png',
            tooltip: perfil.toolTipAyudainversiones,
            iconCls: 'ayuda'
        });
        
        _this.btn_limpiar_inversiones = new Ext.Button({
            text: idioma.btnLimpiarinversiones,
            tooltip: idioma.toolTipLimpiarinversiones,
            iconCls: 'limpiar',
            handler: function() {
                limpiarfiltros();
            }
        });

        //ventana para asociar tipos de documentos

        _this.btn_aceptar_asocdoc = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.tooltipAceptar
        });

        _this.btn_cancelar_asocdoc = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.tooltipCancela
        });

        _this.smdocumento = new Ext.grid.CheckboxSelectionModel({
            id: 'sm1',
            width: 30,
            singleSelect: true
        });

        _this.cmdocumentos = new Ext.grid.ColumnModel([
            {
                width: 24,
                fixed: true,
                sortable: true,
                dataIndex: 'checked',
                renderer: function(value, metaData, record, rowIndex, colIndex, store){
                    if (value == true) {
                        value = "checked";
                    }
                    else
                        value = "";
                    return '<div align = "center"><input ' + value + ' type="checkbox" id="checkbox-' + record.id + '" value="checkbox" onchange="cambiarResponsable(this.id)"/></div>';
                }
            }, {
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
            //loadMask: {store: modelo.store_gestionar_formato},
            sm: _this.smdocumento,
            cm: _this.cmdocumentos,

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

        _this.window_asocdoc = new Ext.Window({
            title: idioma.vtAsociardoc,
            width: 260,
            height: 370,
            modal: true,
            closeAction: 'hide',
            frame: true,
            items: [_this.formulario_asocdoc],
            buttons: [_this.btn_cancelar_asocdoc, _this.btn_aceptar_asocdoc]
        });

        mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...',
            removeMask: false
        });
        _this.pagingBar_gestionar_inversiones = new Ext.PagingToolbar({
            pageSize: 20,
            width: screen.width - 35,
            store: modelo.store_gestionar_inversiones,
            displayInfo: true,
            items: ['-', _this.btn_limpiar_inversiones]

        });
        _this.filtrosinversiones = new Ext.grid.GridFilters({
            filters: [{
                    type: 'string',
                    dataIndex: 'denominacion'

                }, {
                    type: 'listado',
                    dataIndex: 'donemformato',
                    idcombo: 'idformato',
                    urlcb: 'listarformato',
                    idstore: 'idformatoetapa',
                    valueFieldcb: 'idformatoetapa',
                    displayFieldcb: 'denominacion'
                }, {
                    type: 'list',
                    dataIndex: 'uso',
                    options: ['Si', 'No']
                }

            ]

        });
        _this.sm_inversiones = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(s, n, r) {

                    if (_this.sm_inversiones.getSelections().length > 1) {
                        variable = 0;
                        variable1 = 0;
                        for (var i = 0; i < _this.sm_inversiones.getSelections().length; i++) {
                            if (_this.sm_inversiones.getSelections()[i].get('uso') == 1) {
                                variable++;
                            } else {
                                variable1++;
                            }
                        }
                        if (variable != 0 && variable1 == 0) {
                            _this.btn_eliminar_inversiones.disable();
                        } else {
                            _this.btn_eliminar_inversiones.enable();
                        }
                    } else {
                        if (_this.sm_inversiones.getSelections()[0].get('uso') == 1) {
                            _this.btn_eliminar_inversiones.disable();
                        } else {
                            _this.btn_eliminar_inversiones.enable();
                        }
                    }
                    if (_this.sm_inversiones.getSelections().length > 1) {

                        _this.btn_modificar_inversiones.disable();
                    } else {

                        _this.btn_modificar_inversiones.enable();
                    }

                }, rowdeselect: function(s, n, r) {
                    if (_this.sm_inversiones.getSelections().length > 1) {
                        variable = 0;
                        for (var i = 0; i < _this.sm_inversiones.getSelections().length; i++) {
                            if (_this.sm_inversiones.getSelections()[i].get('uso') == 1)
                                variable++;
                        }
                        if (variable != 0) {
                            _this.btn_eliminar_inversiones.disable();
                        } else {
                            _this.btn_eliminar_inversiones.enable();
                        }

                    }
                    if (_this.sm_inversiones.getSelections().length == 1) {
                        variable = 0;
                        for (var i = 0; i < _this.sm_inversiones.getSelections().length; i++) {
                            if (_this.sm_inversiones.getSelections()[i].get('uso') == 1)
                                variable++;
                        }
                        if (variable != 0) {
                            _this.btn_eliminar_inversiones.disable();
                        } else {
                            _this.btn_eliminar_inversiones.enable();
                        }

                    }
                    if (_this.sm_inversiones.getSelections().length > 1) {
                        _this.btn_modificar_inversiones.disable();
                    } else {
                        _this.btn_modificar_inversiones.enable();
                    }
                }
            }
        });
        _this.colModel_inversiones = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: idioma.tlClasif, tooltip: 'Clasificación', width: 323, sortable: true, dataIndex: 'denominacion', renderer: crearToolTip},
            {header: idioma.tlFormato, tooltip: 'Formato de etapa', width: 319, sortable: true, dataIndex: 'donemformato', renderer: crearToolTip},
            {header: 'En uso', tooltip: 'En uso', width: 300, sortable: true, dataIndex: 'uso', renderer: modificarEstado},
            {header: 'Documento asociado', tooltip: 'Documento asociado', width: 316, sortable: true, dataIndex: 'denomdoc', renderer: crearToolTip}
        ]);
        _this.grid_gestionar_inversiones = new Ext.grid.GridPanel({
            frame: true,
            border: false,
            title: idioma.gridtituloGestionarinversiones,
            height: 550,
            region: 'center',
            store: modelo.store_gestionar_inversiones,
            loadMask: {store: modelo.store_gestionar_inversiones},
            sm: _this.sm_inversiones,
            cm: _this.colModel_inversiones,
            plugins: _this.filtrosinversiones,
            tbar: [this.btn_adicionar_inversiones, this.btn_modificar_inversiones, this.btn_eliminar_inversiones, _this.btnMenuAsociacion, '->', this.btn_ayuda_inversiones],
            bbar: [_this.pagingBar_gestionar_inversiones]

        });
        _this.grid_gestionar_inversiones.getStore().reload({
            params: {
                limit: 20,
                start: 0
            }
        });
        /*******************TECLAS CALIENTES********************/

        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'iI',
                alt: true,
                fn: function() {
                    if (!_this.btn_adicionar_inversiones.disabled && !_this.btn_adicionar_inversiones.hidden
                            && validarBtn(Ext.getCmp('btnAdd'))) {
                        if (esta == false) {
                            interfaz = 'add';
                            AccionesAddModElim(interfaz);
                        }
                    }
                }

            },
            {
                key: 'mM',
                alt: true,
                fn: function() {
                    if (!_this.btn_modificar_inversiones.disabled && !_this.btn_modificar_inversiones.hidden
                            && validarBtn(Ext.getCmp('btnAdd'))) {
                        if (esta == false) {
                            interfaz = 'mod';
                            AccionesAddModElim(interfaz);
                        }
                    }
                }
            }, {
                key: 46,
                fn: function() {
                    if (!_this.btn_eliminar_inversiones.disabled && !_this.btn_eliminar_inversiones.hidden
                            && validarBtn(Ext.getCmp('btnAdd'))) {

                        interfaz = 'elim';
                        Eliminar();
                    }
                }
            },
            {
                key: 'Ll',
                alt: true,
                fn: function() {
                    limpiarfiltros();
                }
            }
        ]);
        modelo.store_gestionar_inversiones.load({
            params: {
                start: 0,
                limit: 20
            }
        });
        /*******************FIN DE TECLAS CALIENTES********************/

        function EstaSelecionado() {
            return _this.sm_inversiones.hasSelection();
        }

        function CambiarEstadoBotones() {
            if (EstaSelecionado()) {
                _this.btn_modificar_inversiones.enable();
                _this.btn_eliminar_inversiones.enable();
            }
        }

        function AccionesAddModElim(interfaz) {
            //acciones =
            if (interfaz == 'add') {
               Ext.getCmp('btnApl').show();
                _this.btn_aplicar_inversiones.show();
                modelo.stFormato.reload();
                _this.btn_modificar_inversiones.disable();
                _this.btn_eliminar_inversiones.disable();
                _this.window_general_inversiones.setTitle(idioma.vtadicionar);
                _this.window_general_inversiones.show();
            }
            else if (interfaz == 'mod') {

                recordSelInver = _this.sm_inversiones.getSelected();
                _this.denominacion.setValue(_this.grid_gestionar_inversiones.getSelectionModel().getSelected().data.denominacion);
                _this.formato.setValue(_this.grid_gestionar_inversiones.getSelectionModel().getSelected().data.donemformato);               
                Ext.getCmp('btnApl').hide();
                _this.window_general_inversiones.setTitle(idioma.vtmodificar);
                _this.window_general_inversiones.show();
            }

        }

        _this.denominacion = new Ext.form.TextField({
            id: 'iddenominversiones',
            fieldLabel: idioma.tlDenominacon,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-]*['"]*(\/)*[()]*)*$/,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*['"]*(\/)*)*$/,
            regexText: 'Sólo admite caracteres alfanuméricos y los caracteres especiales (-, _, ", ' + "'" + " y ()).",
            anchor: '95%',
            maxLength: 255,
            enableKeyEvents: true,
            allowBlank: false
        });
        _this.formato = new Ext.form.ComboBox({
            id: 'idformato',
            fieldLabel: idioma.tlFormato,
            displayField: 'denominacion',
            valueField: 'idformatoetapa',
            typeAhead: true,
            mode: 'remote',
            anchor: '95%',
            store: modelo.stFormato,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: false,
            emptyText: idioma.etCombFormato
        });
        _this.formulario_general_inversiones = new Ext.form.FormPanel({
            labelAlign: 'top',
            bodyStyle: 'padding:5px 5px 0',
            width: 330,
            height: 80,
            frame: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.denominacion]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.formato]
                        }]
                }]
        });
        _this.btn_aceptar_inversiones = new Ext.Button({
            text: idioma.btnAceptarinversiones,
            iconCls: 'aceptar',
            disabled: true,
            tooltip: idioma.toolTipAceptarinversiones,
            handler: function() {
                aceptar(interfaz);
            }
        });
        _this.btn_aplicar_inversiones = new Ext.Button({
            text: idioma.btnAplicarinversiones,
            iconCls: 'aplicar',
            id: 'idbtnaplicarinversiones',
            disabled: true,
             hidden: true,
            tooltip: idioma.toolTipAplicarinversiones,
            handler: function() {
                aplicar();
            }
        });
        _this.btn_cancelar_inversiones = new Ext.Button({
            text: idioma.btnCancelarinversiones,
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelarinversiones,
            handler: function() {
                _this.window_general_inversiones.hide();
                _this.sm_inversiones.clearSelections();
                _this.formulario_general_inversiones.destroy();
            }
        });
        _this.window_general_inversiones = new Ext.Window({
            width: 335,
            height: 150,
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.formulario_general_inversiones],
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: perfil.etiquetas.toolTipCancelarinversiones,
                    tabIndex: 14,
                    id: 'idcancel',
                    text: perfil.etiquetas.btnCancelarinversiones,
                    handler: function() {
                        _this.denominacion.setValue('');
                        _this.formato.setValue('');
                        _this.window_general_inversiones.hide();
                    }
                }, {
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    tabIndex: 13,
                    tooltip: perfil.etiquetas.toolTipAplicarinversiones,
                    text: perfil.etiquetas.btnAplicarinversiones,
                    id: 'btnApl',
                    handler: function() {
                        aplicar();
                    }
                }
                , {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    tabIndex: 12,
                    tooltip: perfil.etiquetas.toolTipAceptarinversiones,
                    id: 'idaceptar',
                    text: perfil.etiquetas.btnAceptarinversiones,
                    handler: function() {
                        aceptar(interfaz);
                    }
                }]
        });
        //hacer focus en denominacion
        _this.window_general_inversiones.on('beforeshow', function()
        {
            Ext.getCmp('iddenominversiones').focus(true, 750);
        });
        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }

        _this.panel_gestionar_inversiones = new Ext.Panel({
            height: 606,
            layout: 'fit',
            border: true,
            frame: true,
            tbar: [_this.btn_adicionar_inversiones, _this.btn_modificar_inversiones, _this.btn_eliminar_inversiones, '->', _this.btn_ayuda_inversiones],
            bbar: [_this.grid_gestionar_inversiones]
        });
        _this.gestionar_inversiones_view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.grid_gestionar_inversiones]


        });
        function adicionarInversion() {
            Ext.Ajax.request({
                url: 'adicionar',
                waitMsg: "Cargando...",
                params: {
                    formato: Ext.getCmp('idformato').getValue(),
                    denominacion: Ext.getCmp('iddenominversiones').getValue()
                },
                callback: function(options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgg == 1) {
                        mostrarMensaje(1, 'La clasificación ha sido adicionada satisfactoriamente.');
                        _this.window_general_inversiones.hide();
                        _this.formulario_general_inversiones.getForm().reset();
                    } else if (responseData.codMsgA == 0) {
                        mostrarMensaje(1, 'La clasificación que quiere adicionar ya existe.');
                    }
                }
            });
        }

        function Eliminar() {
            esta = true;
            mostrarMensaje(2, idioma.msgEliminar + idioma.msgla + 'clasificación(es)' + idioma.msgSeleccionada, elimina);
            function elimina(btn) {
                if (btn == 'ok') {
                    mymask.show();
                    var aux = _this.sm_inversiones.getSelections();
                    var arreglo = [];
                    for (i = 0; i < aux.length; i++) {
                        if (aux[i].get('uso') == 0) {
                            arreglo[i] = aux[i].data.idtipoinversion;

                        }
                    }
                    Ext.Ajax.request({
                        url: 'eliminar',
                        waitMsg: "Cargando...",
                        params: {
                            idtipoinversiones: Ext.encode(arreglo)
                        },
                        callback: function(options, success, response) {
                            mymask.hide();
                            esta = false;
                            if (response.codMsgE == 1) {

                                mostrarMensaje(1, ' La(s) clasificación(es) ha(n) sido eliminada(s) satisfactoriamente.');
                            } else {
                                mostrarMensaje(22, ' La(s) clasificación(es) ha(n) sido eliminada(s) satisfactoriamente.');
                            }
                            modelo.store_gestionar_inversiones.reload();
                        }
                    });
                } else {
                    esta = false;
                }
            }
            ;
        }

        function limpiarfiltros() {
            _this.sm_inversiones.clearSelections(true);
            if (!_this.sm_inversiones.getSelected())
                _this.filtrosinversiones.clearFilters();
        }
        function EnUso(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }

        function modificarEstado(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }

        function validarBtn(btn) {
            return btn.hidden == false && !btn.disabled && ventanasNoActivas();
        }

        function ventanasNoActivas() {
            return !_this.window_general_inversiones.isVisible();
        }

        /*function mostrarAyuda(referencia, title) {
            var title = 'Ayuda';
            var referencia = 'clasificacion';
            help.show(title, referencia);
        }*/

        function GetPalabraColumna(val, col)
        {

            if (col == 3)
                return (val == 1) ? 'Si' : 'No';
        }

    }



}

function cambiarResponsable(id_nuevo_responsable){
    var store = _this.gpdocumento.getStore();
    var posicion;
    for (var i = 0; i < store.getCount(); i++) {
        document.getElementById('checkbox-' + store.getAt(i).id).checked = false;
        //store.getAt(i).data.responsable = 'false';
        if ('checkbox-' + store.getAt(i).id == id_nuevo_responsable)
            posicion = i;
    }
    document.getElementById(id_nuevo_responsable).checked = true;
    //store.getAt(posicion).data.responsable = 'true';
    checkResponsable = true;
}