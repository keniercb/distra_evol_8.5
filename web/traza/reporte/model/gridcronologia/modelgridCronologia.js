/**
 * Created by angel on 28/01/16.
 */
Ext.define('Traces.model.gridcronologia.modelgridCronologia', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'idtraza'},
        {name:'idtipotraza'},
        {name:'idcategoriatraza'},
        {name:'categoria'},
        {name:'ippc'},
        {name:'tipotraza'},
        {name:'idtrazapadre'},
        {name:'fecha'},
        {name:'hora'},
        {name:'usuario'},
        {name:'ip_fecha'},
        {name:'referencia'},
        {name:'tiempoejecucion_accion'},
        {name:'tiempoejecucion_integracion'},
        {name:'memoria_accion'},
        {name:'memoria_integracion'},
        {name:'accion'},
        {name:'descripcion_accion'},
        {name:'descripcion_dato'},
        {name:'idoperacion_dato'},
        {name:'codigo_excepcion'},
        {name:'origen_integracion'},
        {name:'destino_integracion'},
        {name:'metodo_integracion'},
        {name:'idseccion'},
        {
            name:'memoria',
            convert: function(value, record) {
                var accion  = record.get('memoria_accion'),
                    integracion    = record.get('memoria_integracion');
                return accion?accion:integracion;
            }
        },
        {
            name:'tiempoejecucion',
            convert: function(value, record) {
                var accion  = record.get('tiempoejecucion_accion'),
                    integracion    = record.get('tiempoejecucion_integracion');
                return accion?accion:integracion;
            }
        },
        {
            name: 'descripcion',
            convert: function (value, record) {
                var tpl_accion = "<i>Acci&oacute;n ejecutada</i>: {0}";
                var tpl_desc_accion = ", <i>Descripci&oacute;n</i>: {0}";
                var tpl_dato = '{0} : <i>Tabla</i> ({1})';
                var tpl_excepcion =  "<i>C&oacute;digo de la excepci&oacute;n</i>: {0}";
                var tpl_integracion = "<i>Origen</i>: {0}, <i>Destino</i>: {1}, <i>M&eacute;todo ejecutado</i>: {2}";
                var tipotraza = record.get('tipotraza');
                var accion = record.get('accion');
                var descripcion_dato = record.get('descripcion_dato');
                var codigo_excepcion = record.get('codigo_excepcion');
                var metodo_integracion = record.get('metodo_integracion');
                var origen_integracion = record.get('origen_integracion');
                var destino_integracion = record.get('destino_integracion');
                var descripcion_accion =record.get('descripcion_accion');
                var idoperacion_dato = record.get('idoperacion_dato');
                var val = record.get('tipotraza');
                if (accion){
                    val = Ext.String.format(tpl_accion, accion);
                    if(descripcion_accion){
                        val += Ext.String.format(tpl_desc_accion, descripcion_accion);
                    }
                }
                if(descripcion_dato){
                    var partes = descripcion_dato.split('-');
                    var operaciones = ['Inserci&oacute;n','Modificaci&oacute;n','Eliminaci&oacute;n'];
                    val = Ext.String.format(tpl_dato, operaciones[idoperacion_dato - 1], partes.join('.'));
                }
                if(codigo_excepcion){
                    val = Ext.String.format(tpl_excepcion, codigo_excepcion);
                }
                if(metodo_integracion){
                    val = Ext.String.format(tpl_integracion, origen_integracion, destino_integracion, metodo_integracion);
                }
                /*console.log(record.get('descripcion_accion'));
                console.log(record.get('metodo_integracion'));*/
                return val?val:val;
            }
        }
    ]
});