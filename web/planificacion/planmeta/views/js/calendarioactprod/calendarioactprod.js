/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Calendar sample code originally written by Brian Moeskau (brian@ext-calendar.com)
 * See additional calendar examples at http://ext-calendar.com
 */
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
//perfil.etiquetas = {};
//UCID.portal.cargarEtiquetas('calendarioactprod', cargarInterfaz);

var identidadselected = null, idcartastecnologicas, idindicadores;
var mymask = null;
//var cartas = null;
var productos = null;
var cartas_sel = [];
var indic_sel = [];
var id_indicadore = [];
var id_cartas_tec = [];

App = function () {
    initlistar();
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    selecc_dt = null;

    return {
        init: function () {

            this.calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'identidad',
                listeners: {
                    beforeload: function () {
                    },
                    load: function () {
                    }
                },
                fields: [
                    {
                        name: 'CalendarId',
                        mapping: 'identidad',
                        type: 'int'
                    },
                    {
                        name: 'Title',
                        mapping: 'denominacion',
                        type: 'string'
                    }
                ],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                }
            });
            // A sample event store that loads static JSON from a local file. Obviously a real
            // implementation would likely be loading remote data via an HttpProxy, but the
            // underlying store functionality is the same.  Note that if you would like to
            // provide custom data mappings for events, see EventRecord.js.

            this.eventStore = new Ext.data.JsonStore({
                id: 'eventStore',
                url: 'listarEventos',
                root: 'evts',
                fields: [
                    {
                        name: 'EventId',
                        mapping: 'idgestionaractividad'
                    }, {
                        name: 'CalendarId',
                        mapping: 'cid'
                    }, {
                        name: 'Title',
                        mapping: 'denominacion'
                    }, {
                        name: 'StartDate',
                        mapping: 'fechainicio'
                    }, {
                        name: 'EndDate',
                        mapping: 'fechafin'
                    }, {
                        name: 'IsAllDay',
                        mapping: 'ad'
                    }],
                sortInfo: {
                    field: 'StartDate',
                    direction: 'ASC'
                },
                listeners: {
                    'beforeload': function () {
                        this.baseParams.identidad = identidadselected;
                        this.baseParams.is_leaf = is_leaf;
                        this.baseParams.idcartastecnologicas = null;
                        this.baseParams.idindicadores = null;
                    },
                    'load': function (st, rec, opt) {
                        mymask.hide();
                    }
                }
            });

            is_leaf = false;

            trEntidad = new Ext.tree.TreePanel({
                id: 'trEntidad',
                autoScroll: true,
                region: 'center',
                layout: 'fit',
                rootVisible: false,
                border: false,
                listeners: {
                    click: function (n) {
                        identidadselected = n.id;
                        is_leaf = n.leaf;
                        App.calendarPanel.setStartDate(Ext.getCmp('app-nav-picker').getValue());
                    }
                },
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Entidades',
                    tipo: 0,
                    id: '0'
                }),
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'cargarEntidades',
                    preloadChildren: false
                }),
                tbar: [{
                        iconCls: 'icon-expand-all',
                        tooltip: 'Expandir todas las entidades',
                        icon: perfil.dirImg + 'expand-all.gif',
                        handler: function () {
                            trEntidad.root.expand(true);
                        }
                    }, {
                        iconCls: 'icon-collapse-all',
                        tooltip: 'Colapsar todas las entidades',
                        icon: perfil.dirImg + 'collapse-all.gif',
                        handler: function () {
                            trEntidad.root.collapse(true);
                        }
                    }, {
                        iconCls: 'icon-collapse-all',
                        tooltip: 'Refrescar todas las entidades',
                        icon: perfil.dirImg + 'table_refresh.png',
                        handler: function () {
                            actualizarArbol(trEntidad);
                        }
                    }]
            });


            pEntidad = new Ext.Panel({
                title: 'Entidades',
                id: 'pEntidad',
                region: 'west',
                collapsible: true,
                titleCollapse: true,
                split: true,
                listeners: {
                    show: function (tp) {
                        trEntidad.getRootNode().expand();
                    }
                },
                width: 180,
                layout: 'border',
                items: [trEntidad,
                    {
                        id: 'app-west',
                        region: 'south',
                        width: 176,
                        border: false,
                        items: [{
                                xtype: 'datepicker',
                                id: 'app-nav-picker',
                                cls: 'ext-cal-nav-picker',
                                listeners: {
                                    select: {
                                        fn: function (dp, dt) {
                                            App.calendarPanel.setStartDate(dt);
                                        },
                                        scope: this
                                    }
                                }
                            }]
                    }
                ]
            });

            // simple array store
            var stfiltro = new Ext.data.SimpleStore({
                fields: ['concepto'],
                data: [
                    ['Actividades'],
                    ['Producciones']]
            });
            var concepto = new Ext.form.ComboBox({
                fieldLabel: 'Concepto',
                store: stfiltro,
                displayField: 'concepto',
                typeAhead: true,
                forceSelection: true,
                triggerAction: 'all',
                emptyText: 'Seleccione...',
                anchor: '97%',
                mode: 'local'
            });
            indicadores = new Ext.form.TextArea({
                fieldLabel: 'Indicadores',
                emptyText: 'Clic Aqui...',
                anchor: '97%',
                height: 200,
                readOnly: true,
                listeners: {
                    focus: function (f) {
                        winIndicadores.show();
                        stIndicadores.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                }
            });
            cartas = new Ext.form.TextArea({
                fieldLabel: 'Cartas Tecnologicas',
                emptyText: 'Clic Aqui...',
                anchor: '97%',
                height: 200,
                readOnly: true,
                listeners: {
                    focus: function (f) {
                        winCartas.show();
                        stCartas.reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idcartastecnologicas: Ext.encode(id_cartas_tec)
                            }
                        });
                    }
                }
            });

            var form = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                items: [concepto, indicadores, cartas],
                buttons: [{
                        text: 'Limpiar',
                        handler: function () {
                            limpiarCampos();
                        }
                    }, {
                        text: 'Aceptar',
                        handler: function () {
                            buscarporCartas();
                        }

                    }]
            });

            function limpiarCampos() {
                concepto.reset();
                indicadores.reset();
                cartas.reset();
                id_indicadore = [];
                indic_sel = [];
                id_cartas_tec = [];
                cartas_sel = [];
                count = 0;
            }
            function buscarporCartas() {
                App.eventStore.reload({
                    params: {
                        idcartastecnologicas: Ext.encode(id_cartas_tec),
                        idindicadores: Ext.encode(id_indicadore),
                        identidad: identidadselected,
                        start: start_view,
                        end: end_view,
                        is_leaf: is_leaf
                    }
                });
                mymask.show();
            }
            /***********************************/
            pFiltro = new Ext.Panel({
                title: 'Busqueda Avanzada',
                id: 'pFiltro',
                region: 'east',
                collapsed: true,
                collapsible: true,
                titleCollapse: true,
                split: true,
                width: 350,
                frame: true,
                layout: 'fit',
                items: [form]
            });

            new Ext.Viewport({
                layout: 'border',
                renderTo: 'calendar-ct',
                items: [
                    pEntidad, pFiltro, {
                        id: 'app-center',
                        title: '...',
                        region: 'center',
                        layout: 'border',
                        items: [
                            {
                                xtype: 'calendarpanel',
                                eventStore: this.eventStore,
                                calendarStore: this.calendarStore,
                                border: false,
                                id: 'app-calendar',
                                region: 'center',
                                activeItem: 2,
                                monthViewCfg: {
                                    showHeader: true,
                                    showWeekLinks: true,
                                    showWeekNumbers: true
                                },
                                // Some optional CalendarPanel configs to experiment with:
                                showDayView: true,
                                showWeekView: true,
                                showMonthView: true,
                                showNavBar: true,
                                showTodayText: true,
                                showTime: true,
                                // title: 'My Calendar', // the header of the calendar, could be a subtitle for the app

                                // Once this component inits it will set a reference to itself as an application
                                // member property for easy reference in other functions within App.
                                initComponent: function () {
                                    App.calendarPanel = this;
                                    this.constructor.prototype.initComponent.apply(this, arguments);
                                },
                                listeners: {
                                    'eventclick': {
                                        fn: function (vw, rec, el) {
                                            this.showEditWindow(rec, el);
                                            this.clearMsg();
                                        },
                                        scope: this
                                    },
                                    'eventover': function (vw, rec, el) {
                                    },
                                    'eventout': function (vw, rec, el) {
                                    },
                                    'eventadd': {
                                        fn: function (cp, rec) {
                                            this.showMsg('Evento ' + rec.data.Title + ' fue adicionado');
                                        },
                                        scope: this
                                    },
                                    'eventupdate': {
                                        fn: function (cp, rec) {
                                            this.showMsg('Evento ' + rec.data.Title + ' fue actualizado');
                                        },
                                        scope: this
                                    },
                                    'eventdelete': {
                                    },
                                    'eventcancel': {
                                        fn: function (cp, rec) {
                                            // edit canceled
                                        },
                                        scope: this
                                    },
                                    'viewchange': {
                                        fn: function (p, vw, dateInfo) {
                                            if (this.editWin) {
                                                this.editWin.hide();
                                            }
                                            ;
                                            if (dateInfo !== null) {
                                                // will be null when switching to the event edit form so ignore
                                                Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                                this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                            }
                                        },
                                        scope: this
                                    },
                                    'dayclick': {
                                        fn: function (vw, dt, ad, el) {
                                            this.showEditWindow({
                                                StartDate: dt,
                                                IsAllDay: ad
                                            }, el);
                                            this.clearMsg();
                                        },
                                        scope: this
                                    },
                                    'rangeselect': {
                                    },
                                    'eventmove': {
                                        fn: function (vw, rec) {
                                        },
                                        scope: this
                                    },
                                    'eventresize': {
                                        fn: function (vw, rec) {
                                        },
                                        scope: this
                                    },
                                    'eventdelete': {
                                        fn: function (win, rec) {
                                        },
                                        scope: this
                                    },
                                    'initdrag': {
                                        fn: function (vw) {
                                            if (this.editWin && this.editWin.isVisible()) {
                                                this.editWin.hide();
                                            }
                                        },
                                        scope: this
                                    }
                                }
                            }]


                    }]

            });
        },
        // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
        // This makes it very easy to swap it out with a different type of window or custom view, or omit
        // it altogether. Because of this, it's up to the application code to tie the pieces together.
        // Note that this function is called from various event handlers in the CalendarPanel above.
        showEditWindow: function (rec, animateTarget) {
            if (!this.editWin) {
                this.editWin = new Ext.calendar.EventEditWindow({
                    calendarStore: this.calendarStore,
                    listeners: {
                        'eventadd': {
                            fn: function (win, rec) {
                                win.hide();
                                rec.data.IsNew = false;
                                this.eventStore.add(rec);
                                this.showMsg('Evento ' + rec.data.Title + 'fue adicionado');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function (win, rec) {
                                win.hide();
                                rec.commit();
                                this.showMsg('Evento ' + rec.data.Title + ' fue actualizado');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function (win, rec) {
                                this.eventStore.remove(rec);
                                win.hide();
                                this.showMsg('Evento ' + rec.data.Title + ' fue eliminado');
                            },
                            scope: this
                        },
                        'editdetails': {
                            fn: function (win, rec) {
                                win.hide();
                                App.calendarPanel.showEditForm(rec);
                            }
                        }
                    }
                });
            }
            this.editWin.show(rec, animateTarget);
        },
        // The CalendarPanel itself supports the standard Panel title config, but that title
        // only spans the calendar views.  For a title that spans the entire width of the app
        // we added a title to the layout's outer center region that is app-specific. This code
        // updates that outer title based on the currently-selected view range anytime the view changes.
        updateTitle: function (startDt, endDt) {
            var p = Ext.getCmp('app-center');

            if (startDt.clearTime().getTime() == endDt.clearTime().getTime()) {
                p.setTitle(startDt.format('F j, Y'));
            } else if (startDt.getFullYear() == endDt.getFullYear()) {
                if (startDt.getMonth() == endDt.getMonth()) {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                } else {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            } else {
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }
        },
        // This is an application-specific way to communicate CalendarPanel event messages back to the user.
        // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
        // vary based on application requirements, which is why it's not baked into the CalendarPanel.
        showMsg: function (msg) {
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },
        clearMsg: function () {
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }
    }
}();
function actualizarArbol(arbol) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload();
        }
    } else
        arbol.root.reload();
}

Ext.onReady(App.init, App);
