/*
 * Grid para mostrar las notificaciones
 */
Ext.ns('Ext.window.Notificaciones');
Ext.window.Notificaciones = Ext.extend(Ext.Window, {
    title:'Bandeja de notificaciones',
    modal: true,
    width: 700,
    height: 400,
    layout: 'fit',
    id:'winNotificaciones',
    constructor: function(config) {
        var me = this;
        me.tipo = config.tipo || 'info';
        me.idTabPanel = config.idTabPanel || 'tabpanelNoti';
        me.url = config.url || '';
        me.tbarGrid = config.tbarGrid || [];
        me.botonEliminar = config.botonEliminar || false;
        me.tabs = {};
        me.tabs[me.tipo] = me.crearGrid();
        me.items = [{
                xtype:'tabpanel',
                id: me.idTabPanel,
                border: false,
                activeTab: 0,
                items:[me.tabs[me.tipo]]
            }];
        Ext.window.Notificaciones.superclass.constructor.apply(this, arguments);
        me.tabs[me.tipo].cargar();
        me.show();

    },
    agregarTab : function(tipo){
        var me = this;
        if(!me.tabs[tipo]){
            me.tabs[tipo] = me.crearGrid(tipo);
            Ext.getCmp(me.idTabPanel).add(me.tabs[tipo]);
        }
        me.tabs[tipo].cargar();
        Ext.getCmp(me.idTabPanel).activate(me.tabs[tipo]);
    },
    crearGrid : function(tipo){
        var me = this;
        return new Ext.grid.Notificaciones({
                    url: me.url,
                    tipo: tipo || me.tipo,
                    tbar : me.tbarGrid,
                    fieldNoleido:'estado',
                    botonEliminar : me.botonEliminar,
                    listeners:{
                        beforedestroy: function(grid){
                               delete  me.tabs[grid.tipo] 
                        },
                        onClickNoleido : function(grid, record){
                            me.fireEvent('onClickNoleido', grid, record);
                        },
                        onClickEliminar : function(idseleccionados, recordsSeleccionados){
                            var mensaje = '¿Est&aacute; seguro que desea eliminar la notificaci&oacute;n seleccionada?';
                            if(recordsSeleccionados.length > 1){
                                mensaje = '¿Est&aacute; seguro que desea eliminar las notificaciones seleccionadas?'
                            }
                            Ext.MessageBox.confirm('Confirmaci&oacute;n', mensaje, function(btn){
                             (btn=='yes') ? me.fireEvent('onClickEliminarNotificaciones', idseleccionados, recordsSeleccionados) : me.focus();
                            });

                        }
                    }
                });
    }


});
