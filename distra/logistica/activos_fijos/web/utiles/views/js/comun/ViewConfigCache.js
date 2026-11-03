/**
 * Created by Ruso on 27-Sep-16.
 */


Ext.ns('AFT.util');
AFT.util.ViewConfigCache = {
    btnGuardarConfiguracionInterfaz: Ext.extend(Ext.Button, {
        constructor:function(config){
            var _this = this;
            this.guardar = config.guardar;
            this.resetear = config.resetear;
            this.tooltip = "Configuración visual.";
            this.iconCls = 'configuracion';
            this.menu = [{
                    iconCls: 'guardar',
                    tooltip: 'Guardar configuraci\xf3n.',
                    text: 'Guardar configuraci\xf3n.',
                    handler: function(){
                        _this.guardar();
                    }
                }, {
                    iconCls: 'actualizar',
                    tooltip: 'Restaurar valores predeterminados.',
                    text: 'Restaurar valores',
                    handler: function(){
                        _this.resetear();
                    }
                }
            ];

            Ext.apply(this, config);
            AFT.util.ViewConfigCache.btnGuardarConfiguracionInterfaz.superclass.constructor.call(this, config);

        },
        guardarConfiguracion: function(vista, gridPanel) {
            var config = {};
            var cm = gridPanel.getColumnModel();
            var columns = cm.config;
            var arrColumnas = [];
            var arrColumnasHidden = [];

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].dataIndex != "") {
                    arrColumnas.push(columns[i].dataIndex);
                    if (cm.isHidden(i)) {
                        arrColumnasHidden.push(columns[i].dataIndex);
                    }
                }
            }

            config[vista] = {
                'OrdenColumnas': arrColumnas,
                'ColumnasOcultas': arrColumnasHidden
            };

            configEncode = JSON.stringify(config);
            AFT.util.ViewConfigCacheModel.salvarConfiguracion(perfil.idusuario, configEncode)
                    .then(function (){
                        mostrarMensaje(1, "La configuración ha sido guardada satisfactoriamente.");      
                    })
                    .catch(function(){
                        mostrarMensaje(3, "Ocurrió un error al guardar la configuración.");            
                    })
            return config;
			
        },
        reestablecerValoresPredeterminados: function(vista, config){

            if(config){
                config[vista] = {
                    'OrdenColumnas': [],
                    'ColumnasOcultas': []
                };
                configEncode = JSON.stringify(config);
                AFT.util.ViewConfigCacheModel.salvarConfiguracion(perfil.idusuario, configEncode)
                    .then(function (){
                        mostrarMensaje(1, "La interfaz ha sido restaurada.");
                    })
                    .catch(function(){
                        mostrarMensaje(3, "Ocurrió un error al reestablecer la configuración.");            
                    })
                return config;
            }
        }
    }),
    cargarConfiguracionInterfaz: function(vista, cm, config){
        if(config){
            if(config[vista]){
                var arrOrdenCol = config[vista].OrdenColumnas;
                var arrColOcultas = config[vista].ColumnasOcultas;
                var columns = cm.config;

                // Buscando las columnas que estan en el column model solamente
                var arrMixedCol = [];
                var i = 0;
                while(i < arrOrdenCol.length){
                    if(cm.findColumnIndex(arrOrdenCol[i]) > -1){
                        arrMixedCol.push(arrOrdenCol[i]);
                    }
                    i+=1;
                }

                /*
                    * Dandole una ponderacion o un peso a las columnas del column model segun el orden que tienen
                    * en la configuracion local donde estan guardadas por un orden especifico.
                    * (Las ponderaciones va a influir en la posicion de menor a mayor)
                */
                var i = 0;
                while(i < columns.length){
                    var j = 0;
                    while(j < arrMixedCol.length){
                        if(columns[i].dataIndex == arrMixedCol[j]){
                            columns[i].peso = j;
                        }
                        j+=1;
                    }
                    i+=1;
                }

                /*
                    *  Ordenando en el column model solo las columnas que tienen ponderacion.
                */
                var i = 0;
                while (i < columns.length){
                    if(typeof columns[i].peso !== 'undefined'){
                        var j = 0;
                        while (j < columns.length){
                            if(columns[j].peso){
                                if(columns[j].peso > columns[i].peso){
                                    var aux = cm.config[j];
                                    cm.config[j] = cm.config[i];
                                    cm.config[i] = aux;
                                }
                            }
                            j+=1;
                        }
                    }
                    i+=1;
                }

                /*
                * Ocultando y mostrando todas las columnas segun la configuracion guardada.
                */
                var i = 0;
                while(i < arrColOcultas.length){
                    var colIndex = cm.findColumnIndex(arrColOcultas[i]);
                    if(colIndex > -1){
                        cm.setHidden(colIndex, true);
                    }
                    i+=1;
                }
            }
        }

        var i = 0;
        while (i < cm.config.length){
            if(cm.config[i].dataIndex != "")
            {
                cm.config[i].default = false;
                cm.config[i].hideable = true;
            }
            i+=1;
        }

        return cm;
        

        /*if (localStorage.getItem(perfil.idusuario)) {
            var configEncode = localStorage.getItem(perfil.idusuario);
            config = JSON.parse(configEncode);
            if(config[vista]){
                var arrOrdenCol = config[vista].OrdenColumnas;
                var arrColOcultas = config[vista].ColumnasOcultas;
                var columns = cm.config;

                // Buscando las columnas que estan en el column model solamente
                var arrMixedCol = [];
                var i = 0;
                while(i < arrOrdenCol.length){
                    if(cm.findColumnIndex(arrOrdenCol[i]) > -1){
                        arrMixedCol.push(arrOrdenCol[i]);
                    }
                    i+=1;
                }

                //
                // Dandole una ponderacion o un peso a las columnas del column model segun el orden que tienen
                // en la configuracion local donde estan guardadas por un orden especifico.
                // (Las ponderaciones va a influir en la posicion de menor a mayor)
                //
                var i = 0;
                while(i < columns.length){
                    var j = 0;
                    while(j < arrMixedCol.length){
                        if(columns[i].dataIndex == arrMixedCol[j]){
                            columns[i].peso = j;
                        }
                        j+=1;
                    }
                    i+=1;
                }

                //
                //  Ordenando en el column model solo las columnas que tienen ponderacion.
                //
                var i = 0;
                while (i < columns.length){
                    if(typeof columns[i].peso !== 'undefined'){
                        var j = 0;
                        while (j < columns.length){
                            if(columns[j].peso){
                                if(columns[j].peso > columns[i].peso){
                                    var aux = cm.config[j];
                                    cm.config[j] = cm.config[i];
                                    cm.config[i] = aux;
                                }
                            }
                            j+=1;
                        }
                    }
                    i+=1;
                }

                //
                // Ocultando y mostrando todas las columnas segun la configuracion guardada.
                //
                var i = 0;
                while(i < arrColOcultas.length){
                    var colIndex = cm.findColumnIndex(arrColOcultas[i]);
                    if(colIndex > -1){
                        cm.setHidden(colIndex, true);
                    }
                    i+=1;
                }
            }
        }*/

        /*var i = 0;
        while (i < cm.config.length){
            if(cm.config[i].dataIndex != "")
            {
                cm.config[i].default = false;
                cm.config[i].hideable = true;
            }
            i+=1;
        }

        return cm;*/
    }
};

AFT.util.ViewConfigCacheModel = {
    cargarConfiguracion: function(idusuario){
        var promise = new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/utiles/index.php/viewconfig/cargarconfiguracion',
                method: 'POST',
                params: { idusuario: idusuario },
                callback: function(options, success, response) {
                    var resp = Ext.decode(response.responseText);
                    if(resp.data){
                        var data = JSON.parse(resp.data);
                        resolve(data);
                    } else{
                        resolve(null)
                    }
                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                    reject(response);
                }
            })
        });
        return promise;
    },
    salvarConfiguracion: function(idusuario, datos){
        var promise = new Promise((resolve, reject) => {
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/utiles/index.php/viewconfig/salvarconfiguracion',
                method: 'POST',
                params: { 
                    idusuario: idusuario, 
                    datos: datos
                },
                callback: function(options, success, response) {
                    var resp = Ext.decode(response.responseText);
                    resolve(resp);
                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                    reject(response);
                }
            })
        });
        return promise;
    }
}