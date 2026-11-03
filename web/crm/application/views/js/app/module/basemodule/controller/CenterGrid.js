Ext.define('BaseModule.controller.CenterGrid', {
    extend: 'CRM.core.controller.Base',
    alias: 'controller.centergrid',
    refs: [
        {ref: 'HeredarWindow', selector: 'heredarwindow'},
    ],
    init: function () {

        this.listen({
            component: {
                'centergrid': {
                    onadded: this.onAddCenterGrid,
                    containercontextmenu: this.showContextMenu,
                    itemcontextmenu: function (view, record, item, index, e, eOpts) {
                        var sm = view.up('centergrid').getSelectionModel();
                        if (sm.getCount() <= 1) {
                            sm.select(record);
                        }
                        this.showContextMenu(view, e);
                    },
                    celldblclick: this.onCellDblClick
                },
                'centergrid searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'centergrid button[action]': {
                    click: this.onClickAction,
                    disable: this.setMenuDisabled,
                    enable: this.setMenuDisabled
                },
                'grid button': {
                    beforerender: this.onBeforeRender,
                    render: this.setTooltip
                },
                'menuitem[action]': {
                    click: this.onClickAction
                },
                'messagebox': {
                    beforeshow: this.onBeforeShow,
                    hide: this.onHide
                },
                'heredarwindow[itemId=heredartransiciones] button[action=acept]': {
                    click: this.guardarHerencia
                }
            }
        });
    },
    onAddCenterGrid: function (grid) {
        var me = this;
        grid.store.proxy.url = UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get(grid.module));

        this.setResource(grid);

        var original = this.application,
            temp = grid.module ? ModuleMgr.get(grid.module) : original;

        // Se intercambia la propiedad application de este controlador por el application del modulo que se creo usando
        // las vistas y controladores del application BaseModule, con el objetivo de validar las acciones de dicho modulo.
        // Ejemplo el modulo Nomenclador y Proforma.
        this.application = temp;
        this.validateGrantedActions({container: grid});
        //Se vuelve asignar el valor original de la propiedad application
        this.application = original;

        grid.getSelectionModel().on({
            scope: this,
            selectionchange: this.onItemSelect
        });

        grid.store.on({
            scope: this,
            metachange: function (store, meta) {
                if (!grid.configured) {
                    this.setConfigurations(grid, meta.columns);
                    grid.configured = true;
                }
            },
            beforeload: function () {
                //En caso que la propiedad filter tenga valor false se asigna vacio al extraParams
                var params = grid.filter == false ? grid.store.proxy.extraParams = {} : grid.store.proxy.extraParams;

                params.modelName = grid.modelName;
                params.responseCfg = {
                    action: 'load',
                    gen: '',
                    concept: '',
                    count: 0
                };

                if (grid.filter) {
                    var filter = this.applyFilters(grid, grid.filter);
                    params = Ext.Object.merge(params, filter);
                }
            },
            load: function (store, records) {
                if (grid.configured) {
                    var sm = grid.getSelectionModel(),
                        store = grid.getStore(),
                        selection = sm.getSelection();
                    sm.deselectAll();
//                     if (sm.getCount() == 1) {
//                         var id = selection[0].internalId,
//                             index = selection[0].index,
//                             record = store.getAt(index);
//                         if (record && record.internalId == id) {
//                             sm.select(record);
//                         }
//                     }
                }
            }
        });

        grid.store.load();
    },
    onClear: function (field) {
        var grid = field.up('centergrid'),
            name = grid.denomColumn;

        if (field.getValue()) {
            field.reset();
        }

        if (field.disabled || !field.hasSearch) {
            return;
        }

        grid.filters.getFilter(name).setValue('');
        grid.filters.getFilter(name).setActive(false);
    },
    onSearch: function (field) {
        var grid = field.up('centergrid'),
            name = grid.denomColumn;

        if (field.disabled) {
            return;
        }

        grid.filters.getFilter(name).setActive(true);
        grid.filters.getFilter(name).setValue(field.getValue());
    },
    onClickAction: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid');

        if (grid) {

            cmp.modelName = grid.modelName;

            switch (cmp.action) {
                case 'add':
                    this.onAdd(cmp);
                    break;
                case 'edit':
                    this.onEdit(cmp);
                    break;
                case 'del':
                    this.onDel(cmp);
                    break;
                case 'her':
                    this.onHer(cmp);
                    break;
                case 'clearfilters':
                    this.onClearFilters(cmp);
                    break;
                case 'update':
                    this.onUpdate(cmp);
                    break;
            }
        }
    },
    onItemSelect: function (sm) {
        var grid = sm.view.up('centergrid');
        if (!grid.noactions) {
            var count = sm.getCount(),
                edit = grid.btnEdit,
                del = grid.btnDel;

            if (count == 1) {
                if (edit) edit.enable();
                if (del) del.enable();
                //del.hide();
            } else if (count > 1) {
                if (edit) edit.disable();
                if (del) del.enable();
                if (del) del.show();
            } else {
                if (edit) edit.disable();
                if (del) del.disable();
                //del.hide();
            }
        }
    },
    onCellDblClick: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var grid = view.up('centergrid');
        if (!grid.noactions) {
            var colIndex = grid.columnManager.columns.length - 2,
                action = grid.columnManager.columns[colIndex].initialConfig;

            grid.getSelectionModel().select(record);

            action.rowIndex = rowIndex;
            action.colIndex = cellIndex;
            this.onClickAction(action);
        }
    },
    onAdd: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid');

        if (grid.noactions || cmp.disabled) {
            return;
        }

        this.application.getMainWindowController().showWindow(cmp);
    },
    onEdit: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid'),
            records = grid.getSelectionModel().getSelection();

        if (grid.noactions || cmp.disabled || records.length == 0) {
            return;
        }
        this.application.getMainWindowController().showWindow(cmp);
    },
    onDel: function (cmp) {
        var grid = cmp.mainlist || cmp.up('centergrid'),
            records = grid.getSelectionModel().getSelection(),
            concept = this.etiquetas['text' + grid.modelName].toLowerCase(),
            msg = this.etiquetas.msgDelConfirm,
            gen = grid.gen,
            focused = Ext.ComponentQuery.query('searchfield[hasFocus=true]');

        if (grid.noactions || cmp.disabled || records.length == 0 || focused.length != 0) {
            return;
        }

        if (records.length == 1) {
            msg = msg.getSingular(gen).get(concept);
        } else {
            cpt = (this.etiquetas['textPl' + grid.modelName] || this.etiquetas['text' + grid.modelName]).toLowerCase();
            msg = msg.getPlural(gen).get(cpt);
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    this.deleteElement(cmp, concept);
                }
            }
        });
    },
    onHer: function (cmp) {
        Ext.create('BaseModule.view.HeredarWindow', {
            title: 'Heredar transiciones',
            itemId:'heredartransiciones',
            grid: cmp.mainlist || cmp.up('centergrid'),
            idproceso: true
        }).show();
    },
    onUpdate: function (cmp) {
        var grid = cmp.up('centergrid');
        if (cmp.fired && grid && grid.store && !grid.store.isLoading()) {
            grid.store.reload();
        }
    },
    onHide: function (win) {
        var grid = win.grid;

        if (!grid) {
            return;
        }
        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            if (Ext.isBoolean(cmps[k].currentstate)) {
                cmps[k].setDisabled(cmps[k].currentstate);
                cmps[k].currentstate = false;
            }
        }
    },
    onBeforeShow: function (win) {
        var grid = win.grid;

        if (!grid) {
            return;
        }
        var cmps = Ext.ComponentQuery.query('grid[id=' + grid.id + '] button[keyMap],grid[id=' + grid.id + '] searchfield[keyMap]');

        for (k in cmps) {
            cmps[k].currentstate = !cmps[k].disabled ? false : true;
            cmps[k].disable();
        }

    },
    onBeforeRender: function (btn) {
        if (btn.iconCls == 'icondistra-actualizar') {
            btn.action = 'update';
            btn.keyMap = {
                key: 'z',
                alt: true,
                ctrl: true,
                event: 'click'
            }
        }
    },
    setMenuDisabled: function (btn) {
        if (btn.action == 'help' && btn.menu) {
            for (k in btn.menu.items.items) {
                btn.menu.items.items[k].setDisabled(btn.disabled);
            }
        }
    },
    deleteElement: function (cmp, concept) {
        var grid = cmp.mainlist || cmp.up('centergrid'),
            gen = grid.gen,
            id = grid.getStore().getProxy().reader.idProperty,
            values = new Array(),
            records = grid.getSelectionModel().getSelection(),
            count = records.length,
            params = {},
            module = grid.module,
            msg = this.etiquetas.msgDelWait;

        Ext.each(records, function (record) {
            values.push(record.data[id]);
        });

        params[id] = Ext.encode(values);
        params['modelName'] = cmp.modelName;
        params['responseCfg'] = {
            action: 'del',
            gen: gen,
            concept: concept,
            count: count
        };

        if (count == 1) {
            msg = msg.getSingular(gen).get(concept);
        } else {
            msg = msg.getPlural(gen).get(concept);
        }

        Ext.MessageBox.show({
            msg: msg,
            title: this.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            scope: this,
            params: params,
            url: UtilsFn.buildUrl({action: 'deleteValues'}, ModuleMgr.get(module)),
            success: function (response, options) {
                grid.store.load();
            }
        });

    },
    onClearFilters: function (cmp) {
        var grid = cmp.up('centergrid');
        grid.filters.clearFilters();
        grid.down('searchfield').reset();
    },
    applyFilters: function (grid, filter) {
        var filterdata = grid.filters.getFilterData();

        if (!Ext.isArray(filter)) {
            filter = [filter];
        }

        for (k in filter) {
            for (j in filter[k]) {
                var type = typeof filter[k][j];
                type = type == "number" ? "numeric" : type;
                filterdata.push({
                    field: j,
                    data: {
                        type: type,
                        comparison: 'eq',
                        value: filter[k][j]
                    }
                })
            }
        }

        return grid.filters.buildQuery(filterdata);
    },
    setConfigurations: function (grid, columns) {
        var actioncolumns = [],
            tbar = grid.topBar,
            me = this,
            etiquetas = this.etiquetas = grid.etiquetas = LangMgr.getLang(grid.module || this),
            conf = grid.getStore().getProxy().reader.metaData.entity_conf;

        grid.formConfiguration = [];
        grid.contHidden = 0;
        grid.gen = conf.gen;
        this.setHelp(grid, conf.refhelp);
        //actioncolumns = this.createActions(tbar, grid);
        this.addToKeyMap(grid);

        Ext.each(columns, function (column) {
            column.text = column.header || column.text;
            column.header = column.text = etiquetas[column.text] || column.text;
            column.tooltip = etiquetas[column.tooltip] || column.tooltip;


            if (column.renderer) {
                var temp = column.renderer.split('.'),
                    clase = temp[0],
                    fn = temp[1];

                if (clase && fn) {
                    try {
                        clase = Ext.create(grid.module + '.util.' + clase);
                        column.renderer = typeof clase[fn] == 'function' ? clase[fn] : Ext.EmptyFn;
                    } catch (e) {

                    }
                }
            }else if (column.dataType == "boolean") {
                column.renderer = function (value, metaData) {
                    var img = "true verde";
                    if (!value) {
                        img = "false rojo";
                    }
                    metaData.innerCls = "icondistra-" + img;
                    metaData.align = "center";
                };

                if (typeof column.filter == "object") {
                    column.filter.yesText = "Si";
                }
            } else if (column.dataType == "date") {
                if (typeof column.filter == "object") {
                    column.filter.beforeText = "Antes";
                    column.filter.afterText = "Después";
                    column.filter.onText = "Igual";
                }
            }else{
                column.renderer=function(value, metaData, records){
                    if (value)
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }

            if (column.dataIndex == "nombreestadoinicial") {
                column.renderer = function (value, meta) {
//                     console.log(meta);
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadoinicial;
                    if (value) meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                };
            }
            if (column.dataIndex == "nombreestadofinal") {
                column.renderer = function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestadofinal;
                    if (value) meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                };
            }


            var clon = me.cloneObject(column);
            if (clon.hidden) {
                grid.contHidden++;
            }
            grid.formConfiguration.push(clon);
            if (column['denom']) {
                grid.denomColumn = column['name'];
            }

            if (grid.validxtypes.indexOf(column['xtype']) == -1) {
                /*Se elimina de la columna la propiedad
                 * xtype que no se valida para las columnas.
                 * */
                delete column['xtype'];
            } else {
                /*Se elimina de la columna clonada la propiedad
                 * xtype que no se valida para campos del
                 * formulario.
                 * */
                delete clon['xtype'];
            }

        });

        /*if (actioncolumns.length != 0) {
         //adicionando la columna con las acciones
         columns = Ext.Array.merge(columns, actioncolumns);
         }*/
        //creando el cuerpo del grid
        grid.reconfigure(null, columns);
        /*En caso que no se haya especificado la columna denom no se
         habilita el buscar*/
        if (grid.denomColumn) {
            grid.searchfield.enable();
        } else {
            grid.searchfield.disable();
        }
        //habilitando toolbar con las acciones principales
        grid.topBar.enable();
        //creando los filtros
        if (grid.filters) {
            grid.filters.createFilters();
        }

    },
    showContextMenu: function (view, e) {
        e.stopEvent();
        var grid = view.up('centergrid');
        if (!grid.noactions) {
            this.createContextMenu(grid, grid.columns);
            if (grid.contextMenu) {
                grid.contextMenu.showAt(e.getXY());
            }
        }
    },
    createContextMenu: function (grid, columns) {
        var items = [],
            actions = new Array(),
            tbar = grid.topBar,
            me = this;

        if (tbar) {
            //adicionar botones al contextmenu
            for (var i = 0; i < tbar.items.length; i++) {
                var cmp = tbar.getComponent(i);
                if (cmp.xtype == 'button' && cmp.action != 'help' && !cmp.hidden) {
                    var config = me.cloneObject(tbar.getComponent(i).initialConfig);
                    config.id = 'menu' + (config.id || Ext.id());
                    config.actioncolumn = false;
                    config.hidden = false;
                    config.disabled = tbar.getComponent(i).isDisabled();
                    config.mainlist = tbar.getComponent(i).up('centergrid');

                    items.push(config);
                    actions.push(config.action);
                }
            }
        }
        if (actions.length != 0) {
            grid.contextMenu = Ext.create('Ext.menu.Menu', {
                items: items
            });
        }
    },
    createActions: function (tbar, grid) {
        var actions = [],
            me = this;

        for (var i = 0; i < tbar.items.length; i++) {
            if (tbar.getComponent(i).xtype == 'button'
                && tbar.getComponent(i).action != 'help'
                && tbar.getComponent(i).actioncolumn == true) {

                var config = this.cloneObject(tbar.getComponent(i).initialConfig);

                config.id = 'actioncolumn' + Ext.id();
                config.xtype = 'actioncolumn';
                config.hidden = config.hidden || false;
                config.disabled = config.disabled || false;
                config.hideable = false;
                config.width = 20;
                config.text = '';
                config.mainlist = tbar.getComponent(i).up('centergrid');
                config.iconCls = 'icondistra-' + config.iconCls;
                config.handler = function (grid, rowIndex, colIndex) {
                    grid.getSelectionModel().select(rowIndex);
                    this.rowIndex = rowIndex;
                    this.colIndex = colIndex;
                    me.onClickAction(this);
                }.bind(config);

                actions.push(config);

            }
        }
        return actions;
    },
    cloneObject: function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var me = this,
            temp = obj.constructor();

        for (var key in obj) {
            temp[key] = me.cloneObject(obj[key]);
        }

        return temp;
    },
    addToKeyMap: function (cmpparent, findcolumns) {
        var columns = findcolumns ? ',actioncolumn[keyMap]' : '',
            cmps = Ext.ComponentQuery.query('component[id=' + cmpparent.id + '] button[keyMap],component[id=' + cmpparent.id + '] searchfield[keyMap],menuitem[keyMap]' + columns);

        for (k in cmps) {
            var cmpaction = cmps[k];
            if (cmpaction.xtype != 'tbseparator' && cmpaction.keyMap && !cmpaction.mapped) {

                var module = cmpparent.module ? ModuleMgr.get(cmpparent.module) : this.application;

                if (cmpparent.up('window')) {
                    var win = cmpparent.up('window');

                    win.keyMap = new Ext.util.KeyMap({
                        target: Ext.getBody()
                    });
                }

                if (module && module.keyMap || win && win.keyMap) {
                    var keymap = cmpaction.keyMap;
                    if (!Ext.isArray(keymap)) {
                        keymap = [keymap];
                    }
                    for (k in keymap) {
                        var binding = keymap[k];

                        binding.fn = function (cmpaction) {
                            if (!cmpaction.disabled && !cmpaction.hidden) {
                                //parametro para saber cuando un evento se disparo por el keymap
                                cmpaction.fired = true;
                                cmpaction.fireEvent(this.event, cmpaction);
                                //parametro para saber cuando un evento se disparo por el keymap
                                cmpaction.fired = false;
                            }
                        }.bind(binding, cmpaction);

                        if (win) {
                            win.keyMap.addBinding(binding);
                        } else {
                            module.keyMap.addBinding(binding);
                        }
                    }
                    cmpaction.mapped = true;
                }
            }
        }
    },
    setTooltip: function (cmp) {
        var keyMap = cmp.keyMap,
            key,
            text = [],
            tooltip = cmp.tooltip || '',
            regex = /\([\w+\+]+\)/g;
        if (!keyMap || Ext.isArray(keyMap) || cmp.menu) {
            return;
        }
        switch (keyMap.key) {
            case 46:
                key = 'DEL';
                break;
            case 13:
                key = 'ENTER';
                break;
            case 27:
                key = 'ESC';
                break;
            case 40:
                key = 'DOWN';
                break;
            case 38:
                key = 'UP';
                break;
            default :
                key = keyMap.key.toUpperCase();
                break;
        }

        if (keyMap.ctrl) {
            text.push('Ctrl');
        }

        if (keyMap.alt) {
            text.push('Alt');
        }

        if (keyMap.shift) {
            text.push('Shift');
        }

        if (key) {
            text.push(key);
        }

        text = '(' + text.join('+') + ')';

        if (tooltip) {
            if (tooltip.match(regex)) {
                var index = tooltip.lastIndexOf('<b>'),
                    tooltip = tooltip.substring(0, index) + '<b>' + text + '</b>';

                cmp.initialConfig.tooltip = tooltip;
                cmp.setTooltip(tooltip);
            } else {
                tooltip = tooltip + ' <b>' + text + '</b>';
                cmp.initialConfig.tooltip = tooltip;
                cmp.setTooltip(tooltip);
            }
        }
    },
    setHelp: function (grid, refhelp) {
        if (grid.btnHelp) {
            grid.btnHelp.refhelp = refhelp;
            grid.btnHelp.fireEvent('sethelp', grid.btnHelp);
            grid.refhelp = refhelp;
        } else if (grid.up('selectwindow')) {
            var tool = grid.up('selectwindow').down('tool[action=help]');
            if (tool) {
                tool.refhelp = 'select_' + refhelp;
                grid.refhelp = refhelp;
            }
        }
    },
    setResource: function (grid) {
        var tbar = grid.topBar;

        if (tbar) {
            for (var i = 0; i < tbar.items.length; i++) {
                var cmp = tbar.getComponent(i);
                if (cmp.action) {
                    cmp.selector = cmp.action + grid.modelName;
                }
            }
        }
    },
    guardarHerencia: function(button){
        var me=this, winheredar=me.getHeredarWindow();
        console.log('HEREdar', winheredar)
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var idprocesos=winheredar.down('#idproceso').getValue().trim().replace(' ', ',');
//             me.down('#form_heredar').submit({
        winheredar.down('#form_heredar').submit({
            url: UtilsFn.buildUrl({action: 'guardarHerencia'}, ModuleMgr.get('Nomencladores')),
            params:{
                idestructura: winheredar.down('#tree_estructura').getSelectionModel().getSelection()[0].get('id'),
                idprocesos: idprocesos
            },
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                // console.log(response)
                if(response['success']==true){
                    if(response['code']==1){
                        mostrarMensaje(1, me.etiquetas.msgTransicionesHeredadas);
                        if(winheredar.grid)winheredar.grid.getStore().load();
                        winheredar.close();
                    }else if(response['code']==2){
                        mostrarMensaje(8, me.etiquetas.msgSinTransiciones);
                    }else if(response['code']==3){
                        mostrarMensaje(8, me.etiquetas.msgEntidadActual);
                    }
                }else{
                    mostrarMensaje(6, response['msg'])
                }
            },
            failure:function(form, action){
                Ext.MessageBox.hide();
//                     mostrarMensaje(7, 'Ha ocurrido un error.')
            }
        });
    }
});
