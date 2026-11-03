
var winAddNormaPlanes,filtrosindicadoresPlanes,stGpAddNormaPlanes,checkColumnAddNormaPlanes, apl = false, offsetInd = 0;

function crearIUAddIndicadores() {
    var _this = this;

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    stCmbUMPlanes = new Ext.data.Store({
        url: 'cargarunidadmedida',
        listeners: {
            load: function () {
                flag5 = true;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
            name: 'idunidadmedida'
        }, {
            name: 'denominacionunidadmedida'
        }])
    });

    stCmbOrSatisface = new Ext.data.Store({
        url: 'listaOrganos',
        listeners: {
            load: function () {
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
            name: 'idorganosatisface'
        }, {
            name: 'denominacion'
        }])
    });

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    _this.filtrosindicadoresPlanes = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stCmbUMPlanes,
                autoload: false,
                mode: 'local'
            },
            {
                type: 'numeric',
                dataIndex: 'precio'
            },
            {
                type: 'listado',
                dataIndex: 'organo',
                idcombo: 'idcbidorganosatisface',
                valueFieldcb: 'idorganosatisface',
                displayFieldcb: 'denominacion',
                st: stCmbOrSatisface,
                autoload: false,
                mode: 'local'
            }
        ]
    });

    _this.checkColumnAddNormaPlanes = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            'selectionchange': function () {
                if (!_this.checkColumnAddNormaPlanes.hasSelection()) {
                    _this.aceptarInd.disable();
                    _this.aplicarInd.disable();
                } else {
                    _this.aceptarInd.enable();
                    _this.aplicarInd.enable();
                }
            },
            'rowdeselect': function () {
                _this.cmGpAddNormaPlanes.setColumnHeader(0, '');
                _this.cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
            }
        }

    });

    _this.cmGpAddNormaPlanes = new Ext.grid.ColumnModel([
        _this.checkColumnAddNormaPlanes,
        {
            id: 'mscolumn',
            header: perfil.etiquetas.lbCodigo,
            width: 100,
            sortable: false,
            align: 'left',
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo del indicador',
            renderer: crearToolTip
        }, {
            id: 'expandir',
            header: perfil.etiquetas.lbDenom,
            sortable: true,
            align: 'left',
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n del indicador',
            renderer: crearToolTip
        },{
            id: 'idunidadmedida',
            header: perfil.etiquetas.lbUM,
            sortable: true,
            dataIndex: 'idumedida',
            align: 'left',
            tooltip:  perfil.etiquetas.lbUM,
            renderer: renderUMInd

        },{
            id: 'precio',
            header: perfil.etiquetas.lbPrecio,
            width: 80,
            sortable: true,
            dataIndex: 'precio',
            align: 'right',
            tooltip:  perfil.etiquetas.lbPrecio,
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbNumPieza,
            width: 120,
            hidden:true,
            sortable: true,
            dataIndex: 'numeropieza',
            align: 'left',
            tooltip:  perfil.etiquetas.lbNumPieza,
            renderer: crearToolTip

        }, {
            id: 'organo',
            header: perfil.etiquetas.lbOrgano,
            sortable: true,
            dataIndex: 'organo',
            align: 'left',
            tooltip:  perfil.etiquetas.lbToolTipOrgano,
            renderer: crearToolTip
        }

    ]);

    _this.smGpAddNormaPlanes = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    _this.stGpAddNormaPlanes = new Ext.data.Store({
        url: 'listaIndicadores',
        listeners: {
            load: function () {

            },
            beforeload: function () {
                setTituloFiltrar(_this.gpAddNormaPlanes, _this.filtrosindicadoresPlanes, " ", _this.winAddNormaPlanes);
                Ext.Ajax.timeout = 600000;
                this.baseParams.idEntidad = identidadselected;
                this.baseParams.idMes = _this.cmMeses.getValue();
                this.baseParams.idEjercicio = _this.cmbEjercicio.getValue();
                this.baseParams.start = offsetInd;
                this.baseParams.Arrayfiltros = Ext.encode(_this.filtrosindicadoresPlanes.getFilterData());
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
            name: 'idindicador'
        }, {
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'estado'
        }, {
            name: 'idformato'
        }, {
            name: 'organo'
        }, {
            name: 'precio'
        }, {
            name: 'idumedida'
        }, {
            name: 'numeropieza'//,
            //mapping:'NomIndicadormaterial.numeropieza'
        }, {
            name: 'idunidadmedida'
        }, {
            name: 'denominacionunidadmedida'
        },{
            name:'idorganosatisface'
        }])
    });

    _this.cmUidMedPlanes = new Ext.form.ComboBox({
        store: stCmbUMPlanes,
        width: 100,
        fieldLabel: perfil.etiquetas.lbUnidadMedida,
        emptyText: perfil.etiquetas.lbSeleccione,
        valueField: 'idunidadmedida',
        displayField: 'nombreum',
        id: 'cmUidMed',
        mode: 'remote',
        //editable:false,
        anchor: '95%',
        triggerAction: 'all',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                habilitaBusqueda(true);
            }
        }
    });



    _this.cbEspecialidadNormaPlanes = new Ext.form.ComboBox({
        id: 'cbEspecialidadNorma',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: new Ext.data.Store({
            url: 'listarEspecialidades',
            reader: new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'data'
            }, [{
                name: 'idespecialidad'
            }, {
                name: 'denespecialidad'
            }]),
            listeners: {
                load: function (x, y, z) {
                }
            }
        }),
        valueField: 'idespecialidad',
        displayField: 'denespecialidad',
        mode: 'remote',
        editable: false,
        triggerAction: 'all',
        width: 120,
        fieldLabel: 'Especialidad',
        enableKeyEvents: true,
        listeners: {
            select: function () {
                habilitaBusqueda(true);
            }
        }
    });

    _this.gpAddNormaPlanes = new Ext.grid.GridPanel({
        store: stGpAddNormaPlanes,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        cm: _this.cmGpAddNormaPlanes,
        sm: _this.checkColumnAddNormaPlanes,
        autoExpandColumn: 'expandir',
        region: 'center',
        plugins: _this.filtrosindicadoresPlanes,
        id: 'gpAddNorma',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptAddInd',
            store: _this.stGpAddNormaPlanes,
            displayInfo: true,
            items: [{
                xtype: 'tbseparator'
            },
                {
                    xtype: 'tbbutton',
                    text: perfil.etiquetas.lbLimpiarFiltros,
                    id: 'btntodos',
                    icon: perfil.dirImg + 'limpiar.png',
                    disabled: false,
                    iconCls: 'btn',
                    handler: function () {
                        _this.filtrosindicadoresPlanes.clearFilters();
                        _this.stGpAddNormaPlanes.reload();
                    }
                }],
            listeners: {
                beforechange: function (p, e) {
                    offsetInd = e.start;
                }
            }
        })
    });

    _this.cancelarInd =  new Ext.Button({
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        tooltip: 'Cerrar ventana sin guardar los datos (Alt+X)',
        text: perfil.etiquetas.lbBtnCancelar,
        handler: function () {
            _this.winAddNormaPlanes.close();
            _this.checkColumnAddNormaPlanes.clearSelections();
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '');
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
        }
    });

    _this.aplicarInd = new Ext.Button({
        icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'btn',
        tooltip: 'Guardar datos y limpiar los campos (Ctrl+Alt+P)',
        disabled: true,
        text: perfil.etiquetas.lbBtnAplicar,
        handler: function () {
            apl = true;
            adicionarIndPronostico();
            checkColumnAddNormaPlanes.clearSelections();
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '');
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');

            _this.stPronostico.on('load',function(){

                _this.stGpAddNormaPlanes.reload();

            });
        }
    });

    _this.aceptarInd = new Ext.Button({
        icon: perfil.dirImg + 'aceptar.png',
        iconCls: 'btn',
        disabled: true,
        tooltip: 'Guardar datos y cerrar ventana (Enter)',
        text: perfil.etiquetas.lbBtnAceptar,
        handler: function () {
            adicionarIndPronostico();
            _this.winAddNormaPlanes.close();
            _this.checkColumnAddNormaPlanes.clearSelections();
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '');
            _this.cmGpAddNormaPlanes.setColumnHeader(0, '<div class="x-grid3-hd-checker">&#160;</div>');
        }
    });

    _this.winAddNormaPlanes = new Ext.Window({
        title:' ',
        modal: true,
        closeAction: 'hide',
        constrain: true,
        width: 950,
        layout: 'fit',
        items: _this.gpAddNormaPlanes,
        height: 530,
        title: perfil.etiquetas.lbAdicionarIndicador,
        listeners: {
            show: function () {
                stCmbUMPlanes.load();
                stCmbOrSatisface.load();
                _this.stGpAddNormaPlanes.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            },
            close: function () {
                 _this.filtrosindicadoresPlanes.clearFilters();
            }
        },
        buttons: [_this.cancelarInd,_this.aplicarInd,_this.aceptarInd]
    });

    _this.winAddNormaPlanes.show();

}//Fin de Declaracion

function adicionarIndPronostico() {
    var _this = this;
    _this.indicadoresPlanes = [];
    var checkCol = [];
        checkCol = _this.checkColumnAddNormaPlanes.getSelections();
    if (checkCol.length >0){
        for (var p=0; p<checkCol.length; p++)
        {
            var listId = checkCol[p].data.idorganosatisface.split(',');
            var listOrgano = checkCol[p].data.organo.split(',');
            addIdorganosByOrganos(listId,listOrgano);
            var or = listOrgano[0];
             _this.indicadoresPlanes.push(checkCol[p].data);
             _this.indicadoresPlanes[p][or] = 0;
        }
    }
    var modified = [];
    var modified = _this.indicadoresPlanes;
    var options = _this.idByOrgano;
    gestionarActionPronosticos(modified, 'mod', options);

}

function addIdorganosByOrganos(listId, listOrganos){
    var _this = this;
    for(var i=0; i<listId.length; i++){
        for(var j=0; j<listOrganos; j++){
            _this.idByOrgano[listOrganos[j].toLocaleLowerCase()] = listId[i];
        }
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderUMInd(value, m) {
    var _this = this;
    m.attr = 'ext:qtip="' + value + '"';
    for (var i=0; i<stCmbUMPlanes.data.items.length; i++){
        if (stCmbUMPlanes.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stCmbUMPlanes.data.items[i].data.denominacionunidadmedida + '"';
            return stCmbUMPlanes.data.items[i].data.denominacionunidadmedida;
        }
    }


}

function setTituloFiltrar(gridPanel, filtro, etiqueta, panel) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        panel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        panel.setTitle(etiqueta + ' <i>' + 'Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}