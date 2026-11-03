/**
 * Created by alberto on 31/07/2015.
 */
Ext.define('BaseModule.view.CenterGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.centergrid',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.toolbar.Paging',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager',
        'Ext.ux.grid.FiltersFeature',
        'Ext.ux.SearchField'
    ],
    columns: [],
    validxtypes: ['datecolumn', 'booleancolumn'],
    controller: 'globalpanel',
    border: false,
    selType: 'checkboxmodel',
    stripeRows: true,
    noHelp: false,
    region: 'center',
    features: [{
        ftype: 'filters',
        menuFilterText: 'Búsqueda',
        local: false
    }],
    modelName: '',
    gen: 'M',
    multiSelect: true,
    concept: 'Elemento',
    refhelp: '',
    initComponent: function () {
        var me = this,
            globalLang = LangMgr.getLang(this);

        this.etiquetas = Ext.Object.merge(globalLang, me.etiquetas || {});
        this.emptyText = this.etiquetas.msgNoDataLoaded || 'No existen datos que mostrar.';
        this.id = Ext.id();
        this.configured = false;

        this.createBody();

        this.callParent(arguments);
    },
    createBody: function () {
        var me = this,
            modelName = this.modelName,
            concept = this.etiquetas['text' + modelName] || 'element',
            conceptpl = this.etiquetas['textPl' + modelName] || concept,
            tbar = [],
            actions = this.newactions;
        this.concept = (concept || this.concept).toLowerCase();
        console.log('::', this);
        if (!this.noactions) {

            this.btnAdd = Ext.create('Ext.Button', {
                text: this.etiquetas.lbBtnAdd || 'Adicionar',
                tooltip: this.etiquetas.qtipAdd.get(me.concept),
                iconCls: 'adicionar',
                action: 'add',
                first: true,
                allwaysEnabled: true,
                hidden:true,
                keyMap: {
                    key: 'i',
                    alt: true,
                    event: 'click'
                }
            });

            this.btnEdit = Ext.create('Ext.Button', {
                text: this.etiquetas.lbBtnMod || 'Modificar',
                tooltip: this.etiquetas.qtipMod.get(me.concept),
                hidden: true,
                disabled: true,
                action: 'edit',
                iconCls: 'modificar',
                actioncolumn: true,
                keyMap: {
                    key: 'm',
                    alt: true,
                    event: 'click'
                }

            });

            this.btnDel = Ext.create('Ext.Button', {
                text: this.etiquetas.lbBtnDel || 'Eliminar',
                tooltip: this.etiquetas.qtipDel.get(me.concept),
                action: 'del',
                hidden: true,
                disabled: true,
                iconCls: 'eliminar',
                actioncolumn: true,
                keyMap: {
                    key: Ext.EventObject.DELETE,
                    event: 'click'
                }

            });

            this.btnHeredar = Ext.create('Ext.Button', {
                text: this.etiquetas.lbHeredar || 'Heredar',
                // tooltip: this.etiquetas.lbHeredar.get(me.concept),
                action: 'her',
                hidden: true,
//                     disabled: true,
                iconCls: 'duplicar',
                actioncolumn: true,
//                     keyMap: {
//                         key: Ext.EventObject.DELETE,
//                         event: 'click'
//                     }
            });

            if(this.concept=='área')
                this.btnEdit=null;

            var botones=[this.btnAdd, this.btnEdit, this.btnDel, this.btnHeredar];
            // console.log('this.concept->', this.concept);
//             if(this.concept=='transición'){
//
//                 this.btnHeredar = Ext.create('Ext.Button', {
//                     text: this.etiquetas.lbHeredar || 'Heredar',
//                     // tooltip: this.etiquetas.lbHeredar.get(me.concept),
//                     action: 'her',
//                     // hidden: true,
// //                     disabled: true,
//                     iconCls: 'duplicar',
//                     actioncolumn: true,
// //                     keyMap: {
// //                         key: Ext.EventObject.DELETE,
// //                         event: 'click'
// //                     }
//                 });
//                 botones.push(this.btnHeredar);
//             }

            tbar = botones;

            if (actions && Ext.isArray(actions) && actions.length > 0) {
                for (k in actions) {
                    tbar.push(actions[k]);
                }
            }
        }

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            width: 250,
            disabled: true,
            allwaysEnabled: true,
            searchTooltip: this.etiquetas.qtipSearch.get(conceptpl.toLowerCase()),
            clearTooltip: this.etiquetas.qtipCleanFilter,
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'onclick1'
                },
                {
                    key: 'b',
                    alt: true,
                    event: 'onclick2'
                }
            ]
        });

        tbar.push('->');
        tbar.push(this.searchfield);

        if (!this.noHelp) {

            this.btnHelp = Ext.create('Ext.Button', {
                text: this.etiquetas.lbBtnhelp || 'Ayuda',
                tooltip: this.etiquetas.qtipSystemHelp,
                iconCls: 'ayuda',
                allwaysEnabled: true,
                action: 'help',
                keyMap: {
                    key: 'h',
                    alt: true,
                    event: 'click'
                }
            });

            tbar.push(this.btnHelp);
        }

        this.createStore();

        this.topBar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            disabled: true,
            enableOverflow: true,
            items: tbar
        });

        this.bottomBar = Ext.create('Ext.toolbar.Paging', {
            dock: 'bottom',
            enableOverflow: true,
            store: this.store,
            displayInfo: true,
            pageNumb: true,
            items: [
                {
                    action: 'clearfilters',
                    iconCls: 'limpiar',
                    tooltip: me.etiquetas.qtipCleanFilters,
                    allwaysEnabled: true,
                    keyMap: {
                        key: 'l',
                        alt: true,
                        ctrl: true,
                        event: 'click'
                    }
                }
            ]
        });

        var refresh = this.bottomBar.down('[itemId=refresh]');
        if (refresh) {
            refresh.allwaysEnabled = true;
        }

        this.dockedItems = [this.topBar, this.bottomBar];

        this.plugins = [Ext.create('CRM.plugins.grid.DragSelector')]
    },
    createStore: function () {

        this.store = Ext.create('Ext.data.Store', {
            fields: [],
            remoteSort: true,
            proxy: {
                type: 'ajax',
                url: '',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });
    }
});