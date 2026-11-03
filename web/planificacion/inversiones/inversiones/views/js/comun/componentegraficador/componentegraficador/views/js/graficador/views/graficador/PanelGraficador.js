/*
 * Interfaz para el componente de graficador.
 * @author Yulier Camilo Garrido Garrido
 * fecha de creación 10/3/2014
 * @version 1.0
 */
Ext.ns('Std.Base.Graficador');
Std.Base.Graficador.PanelGraficador = Ext.extend(Ext.Panel, {
    id: 'panelGraficador',
    region: 'center',
    initComponent: function() {
        var me = this;
        me.controller = (this.controller) ? this.controller : new Std.Base.Graficador.GraficadorController();
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.graficos = (this.graficos) ? this.graficos : [];
        me.chrt = [];
        Ext.each(me.graficos, function(item, index) {
            var detalle = new Ext.Button({
                icon: me.directorioImagenes + 'detalles.png',
                tooltip: 'Ver gráfico.',
                iconCls: 'btn',
                handler: function() {
                    me.tabPanel.setActiveTab(index + 1);
                }
            });

            var recargar = new Ext.Button({
                icon: me.directorioImagenes + 'refresh.png',
                tooltip: 'Recargar datos.',
                iconCls: 'btn',
                handler: function() {
                    me.recargarDatos(
                            index,
                            {denominacion: (Ext.getCmp('tf-' + index)) ? Ext.getCmp('tf-' + index).getValue() : ''}
                    );
                }
            });

            me.filtro = new Ext.form.TextField({
                emptyText: 'Nombre',
                anchor: '95%',
                id: 'tf-' + index
            });

            var buscar = new Ext.Button({
                icon: me.directorioImagenes + 'buscar.png',
                tooltip: 'Buscar.',
                iconCls: 'btn',
                handler: function() {
                    me.recargarDatos(
                            index,
                            {denominacion: (Ext.getCmp('tf-' + index)) ? Ext.getCmp('tf-' + index).getValue() : ''}
                    );
                }
            });

            var limpiar = new Ext.Button({
                icon: me.directorioImagenes + 'limpiar.png',
                tooltip: 'Limpiar.',
                iconCls: 'btn',
                handler: function() {
                    if (Ext.getCmp('tf-' + index))
                        Ext.getCmp('tf-' + index).reset();
                    me.recargarDatos(index);
                }
            });

            var tbar = []
            if (item.tipo == 'barra')
                tbar = [detalle, recargar, me.filtro, buscar, limpiar];
            else
                tbar = [detalle, recargar];

            me.panelPie = new Ext.Panel({
                tbar: tbar,
                layout: 'fit',
                region: 'center',
                autoScroll: true,
                border: false,
                bodyBorder: false,
                style: 'margin: 10px 10px 10px 10px;',
                listeners: {
                    render: function(el, filtro) {
                        me.controller.recargarDatos({
                            url: item.source,
                            el: el.el,
                            idpanel: el.id,
                            tipo: item.tipo,
                            titulo: item.titulo,
                            previa: true,
                            filtro: filtro
                        });
                    }
                }
            });
            me.chrt.push({
                items: [me.panelPie]
            });
        });
        me.row = {
            layout: 'column',
            border: false,
            bodyBorder: false,
            defaults: {
                border: false,
                bodyBorder: false,
                columnWidth: (me.chrt.length) ? 1 / (me.chrt.length) : 1,
                layout: 'form'
            },
            items: me.chrt
        };
        me.tabPanel = new Ext.TabPanel({
            region: 'center',
            id: 'pnComponentes',
            autoShow: true,
            layoutOnTabChange: true,
            enableTabScroll: true,
            border: false,
            bodyBorder: false,
            items: [{
                    title: 'Vista previa',
                    items: [me.row],
                    id: '0'
                }]
        });
        if (me.separar) {
            Ext.each(me.graficos, function(item, index) {
                me.panelPie = new Ext.Panel({
                    tbar: [
                        new Ext.Button({
                            icon: me.directorioImagenes + 'refresh.png',
                            tooltip: 'Recargar datos.',
                            iconCls: 'btn',
                            handler: function() {
                                me.recargarDetalle(index + 1);
                            }
                        })
                    ],
                    layout: 'fit',
                    region: 'center',
                    autoScroll: true,
                    border: false,
                    bodyBorder: false,
                    style: 'margin: 10px 10px 10px 10px;',
                    listeners: {
                        render: function(el) {
                            me.controller.recargarDatos({
                                url: item.source,
                                el: el.el,
                                idpanel: el.id,
                                tipo: item.tipo,
                                titulo: item.titulo
                            });
                        }
                    }
                });
                me.tabPanel.add({
                    id: index + 1,
                    title: item.titulo,
                    items: [me.panelPie]
                });
            });
        }
        me.parent.on('show', function() {
            me.tabPanel.setActiveTab("0");
        });


        me.items = [me.tabPanel];
        Std.Base.Graficador.PanelGraficador.superclass.initComponent.call(me);
    },
    recargarDatos: function(index, filtro) {
        var me = this;
        var panel = me.chrt[index].items[0];
        panel.fireEvent('render', panel, filtro);
    },
    recargarDetalle: function(index) {
        var me = this;
        var panel = me.tabPanel.getComponent(index).items.items[0];
        panel.fireEvent('render', panel);
    },
    recargarInterfas: function() {
        var me = this;
        Ext.each(me.chrt, function(item, index) {
            var panel = item.items[0];
            panel.fireEvent('render', panel, {denominacion: Ext.getCmp('tf-' + index).getValue()});
        });
    }
});
Ext.reg('Std.Base.Graficador.PanelGraficador', Std.Base.Graficador.PanelGraficador);