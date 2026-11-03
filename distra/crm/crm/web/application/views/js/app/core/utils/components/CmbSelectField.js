Ext.define('Ext.ux.CmbSelectField', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.cmbselectfield',
    validateOnBlur: true,
    enableKeyEvents: true,
    pickerrender: false,
    multiSelect: false,
    queryMode: 'remote',
    queryDelay: 400,
    minChars: 1,
    pageSize: 10,
    autoExpand: false,
    listLoadingText: 'Cargando...',
    listEmptyText: 'No existen datos que mostrar.',
    listQtipBtnAdd: 'Adicionar',
    listQtipBtnSearch: 'Buscar',
    navigateKeys: [9, 27, 35, 36, 36, 37, 38, 39, 40],
    initComponent: function () {
        this.listConfig = {
            loadingText: this.listLoadingText,
            emptyText: '<div class="x-grid-empty">' + this.listEmptyText + '</div>'
        };
        if(this.multiSelect){
            this.pageSize=1000;
            this.editable=false;
        }
        this.displayField = this.valueField = this.realColumn ? this.realColumn.split('.')[1] : this.mapping.split('.')[1];

        this.modelName = this.realColumn ? this.realColumn.split('.')[0] : this.mapping.split('.')[0];

        this.queryParam = 'filter[0][data][value]';

        this.createStore();

        this.createButtons();

        this.callParent();

        this.on({
            expand: function () {
                if (!this.pickerrender) {
                    var ptbar = this.picker.pagingToolbar;
                    if(ptbar) {
                        ptbar.add('-');
                        if (!this.noactions) {
                            ptbar.add(this.btnNew);
                        }
                        ptbar.add(this.btnMore);
                        this.pickerrender = true;
                    }
                }
            },
            keyup: function (f, e) {
                if (this.navigateKeys.indexOf(e.getKey()) == -1 && Ext.isEmpty(this.getValue())) {
                    this.lastQuery = '';
                    this.store.load();
                }
            }
        });

        this.store.on({
            scope: this,
            beforeload: function () {
                this.applyFilters();
            }
        })
    },
    setValue: function (value) {
        this.callParent(arguments);
        this.trueValue = value;
        if (typeof value == 'object') {
            var temp = new Array(),
                data;
            for (k in value) {
                if (value[k].data) {
                    data = value[k].data[this.valueField];
                } else {
                    data = value[k];
                }
                temp.push(data);
            }
            this.trueValue = temp.join(',');
        }
    },
    createButtons: function () {
        this.btnNew = Ext.create('Ext.Button', {
            tooltip: this.listQtipBtnAdd,
            iconCls: 'adicionar',
            action: 'add',
            hidden: true
        });

        this.btnMore = Ext.create('Ext.Button', {
            tooltip: this.listQtipBtnSearch,
            iconCls: 'buscar',
            action: 'more'
        });
    },
    createStore: function () {
        var _this = this;
        this.store = Ext.create('Ext.data.Store', {
            pageSize: _this.pageSize,
            fields: [
                {
                    name: _this.localId || 'id'
                },
                {
                    name: _this.displayField || 'name'
                }
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get(this.module || 'Nomencladores')),
                extraParams: {
                    modelName: _this.modelName,
                    'filter[0][field]': _this.displayField || 'name',
                    'filter[0][data][type]': 'string'
                },
                responseCfg: {
                    action: 'load',
                    gen: '',
                    concept: '',
                    count: 0
                },
                reader: {
                    idProperty: _this.localId || 'id',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });
    },
    applyFilters: function () {
        if (this.filters) {
            var cont = 1,  //cont inicia en uno porque ya existe un filtro por defecto
                params = this.store.proxy.extraParams;

            if (!Ext.isArray(this.filters)) {
                this.filters = [this.filters];
            }

            for (k in this.filters) {
                for (j in this.filters[k]) {
                    var type = typeof this.filters[k][j];
                    type = type == "number" ? "numeric" : type;
                    params['filter[' + cont + '][field]'] = j;
                    params['filter[' + cont + '][data][type]'] = type;
                    params['filter[' + cont + '][data][value]'] = this.filters[k][j];
                    params['filter[' + cont + '][data][null]'] = 0;
                    cont++;
                }
            }
        }

    }
});
