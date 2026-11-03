/*
 * Grid para mostrar las notificaciones
 */
Ext.ns('Ext.grid.Notificaciones');
Ext.grid.Notificaciones = Ext.extend(Ext.grid.GridPanel, {
    hideHeaders: true,
    closable: true,

    constructor: function(config) {
        var me = this;
        me.clsWidth100 = 'width100-noti';
        me.fieldId = config.fieldId || 'id';
        me.fieldNoleido = config.fieldNoleido || 'noleeido';
        me.fieldDetalle = config.fieldDetalle || 'detalle';
        me.autoExpandColumn = 'detalle';
        me.tipo = config.tipo || 'info';
        me.title= me.obtenerTitulo();
        me.sm = new Ext.grid.CheckboxSelectionModel();
        me.store = new Ext.data.JsonStore({
            url: config.url || '',
            root: config.root || 'data',
            totalProperty: config.totalProperty || 'cantidad',
            idProperty: me.fieldId,
            fields: config.fields || [
                {name: me.fieldId},
                {name: me.fieldDetalle},
                {name: me.fieldNoleido},
                {name: 'tipo'}
            ],
            listeners:{
                load:function(store, record){
                    me.myMask.hide();
                    (record.length == 0) ? mostrarMensaje(1, 'No existen notificaciones para mostrar.') : '';

                }
            }
        });
        me.columns = [
            me.sm,
            {
                id: me.fieldDetalle,
                sortable: true,
                dataIndex: me.fieldDetalle
            },
            {hidden: true, dataIndex: 'tipo'},
            {hidden: true, dataIndex: me.fieldNoleido},
            {hidden: true, dataIndex: me.fieldId}
        ];
        me.columns.forEach(function(columna){
            if(columna.dataIndex  == me.fieldDetalle){
                columna.renderer = function(value, metadata, record){
                    var classes = me.obtenerCls(record);
                    return (record.get(me.fieldNoleido) == '1') ? '<span><b><p title="Clic para marcar notificaci&oacute;n como le&iacute;da" class="'+classes+'">'+record.get(me.fieldDetalle)+'</p></b></span>' : '<p class="'+classes+'">'+record.get(me.fieldDetalle)+'</p>';
                };
            }
        });
        me.viewConfig = {
            getRowClass : function(record, index){
                var cls = [me.clsWidth100, 'noborder'];
                return cls.join(' ');
            }
        };
        config.tbar = config.tbar || [];
        me.botonEliminar = config.botonEliminar || false;
        if(me.botonEliminar){
            me.btnEliminar = new Ext.Button({
                text: 'Eliminar',
                iconCls : 'eliminar',
                tooltip : 'Eliminar notificación(es) <b>(DEL)</b>',
                disabled: true,
                id:'btnDelNotific',
                handler: function(){
                    var ids = me.obtenerIdsSeleccionados();
                    me.fireEvent('onClickEliminar', ids, me.getSelectionModel().getSelections());
                }
            });
            config.tbar.push(me.btnEliminar);
        }

        me.myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});

        Ext.grid.Notificaciones.superclass.constructor.apply(this, arguments);
        me.getSelectionModel().on('selectionchange', function(sm){
            me.btnEliminar.setDisabled(sm.getSelections().length == 0);
        });
        me.on('rowclick',function(grid, rowIndex, e){
            var record = me.store.getAt(rowIndex);
            if(record.get(me.fieldNoleido)=='1'){
                me.fireEvent('onClickNoleido', grid, record, me.tipo, e);
            }
            Ext.getCmp('winNotificaciones').focus();

        });




    },
    /*----Obtener las clases css para cada fila del grid--*/
    obtenerCls: function(record){
        var cls =  ['alerta'];
        var style = '';
        var tipo = record.get('tipo');

        switch(tipo){
            case '2':
                style = 'warning';
                break;
            case '3':
                style = 'danger';
                break;
            case '1':
                style = 'info';
                break
            case '4':
                style = 'alert';
                break;
            default:
                style = 'success';
                break;
        }
        cls.push('alerta-'+style);
        cls.push(this.clsWidth100);
        return cls.join(' ');
    },
    /*----Cargar el store mandando el parametro tipo de notificacion--*/
    cargar : function(){
        var me = this;
        me.myMask.show();
        me.store.load({params:{
            tipo: me.obtenerIdTipo()

        }
        });
    },

    obtenerIdTipo: function(){
        var idTipoAviso;
        switch(this.tipo){
            case 'warning':
                idTipoAviso = 2;
                break;
            case 'error':
                idTipoAviso = 3;
                break;
            case 'info':
                idTipoAviso = 1;
                break;
            case 'alert':
                idTipoAviso = 4;
                break;
            default:
                idTipoAviso = 0;
                break;
        }
        return idTipoAviso;
    },
    /*----Obtener los id de los elementos seleccionados--*/
    obtenerIdsSeleccionados : function(){
        var me = this;
        var ids = [];
        Ext.each(me.getSelectionModel().getSelections(), function(record){
            ids.push(record.get(me.fieldId));
        }, this);
        return ids;
    },
    /*----Obtener el titulo del grid para cada tipo de notificacion--*/
    obtenerTitulo: function(){
        var t = '';
        switch(this.tipo){
            case 'warning':
                t = 'Advertencias';
                break;
            case 'error':
                t = 'Errores';
                break;
            case 'info':
                t = 'Informaci&oacute;n';
                break;
            case 'alert':
                t = 'Alertas';
                break;
            default:
                t = 'Notificaciones';
                break;
        }
        return t;
    }
});
