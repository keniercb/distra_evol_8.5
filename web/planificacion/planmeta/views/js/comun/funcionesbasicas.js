/*funcionesbasicas.js
 * Funciones basicas que se utilizan en Planificación
 * @author: Damian Oscar Falcon Borras
 * @package: Plataforma Integral de Planificacion
 * @subpackage: Planificacion Materias y Financiera
 * @copyright: Planificacion
 * @version: 1.0-0
 */

/*@descripcion: Funcion que permite recargar un grid
 *@parametros: store,start,limit
 **/
function recarga(store,limit){
    store.reload({
        params : {
            start : 0,
            limit : limit!=undefined?limit:20
        }
    })
}
/*@descripcion: Funcion que permite recargar un grid
 *@parametros: store,start,limit
 **/
function recargaLimitStart(store,start,limit){
    store.reload({
        params : {
            start : start,
            limit : limit
        }
    })
}
/*@descripcion: Funcion que permite recargar el padre de un nodo en un grid
 *@parametros: store,selectionmodel
 **/
function recargaPadre(store,selectionmodel){
    store.reload({
        params:{
            anode:selectionmodel.getSelected().data._parent
        }
    });
}
//muestra la barra de progreso
function MostrarBarraProgreso(msg){
   progressbar = Ext.MessageBox.show({
        title: 'Por favor espere...',
        width:300,
        wait:true,
        progress:true,
        closable:false,
        animEl: 'mb6',
        msg:msg
    });
}//fn de la funcion progressBar

/*@descripcion: Funcion que devuelve los datos para renderizar una columna con los valores de un combo
 *@parametros: valor,combo
 **/
function getRawValue(v, cmb) {
    var arrid = (v != null) ? v.split(",") : '';
    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
            ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
            : '');
        for (var j = 1; j < arrid.length; j++) {
            str += ((cmb.store.find(cmb.valueField, arrid[j]) != -1) ? ','
                + cmb.store.getAt(cmb.store.find(cmb.valueField,
                    arrid[j])).data[cmb.displayField] : '');
        }
    }
    return str;
}
   
/*@descripcion: Funcion que pone un qtip en la celda con el valor de la misma
 *@parametros: valor,metadata
 **/
function getQtip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function getWindowEjercicio(st){
	
    b = new Ext.Button({
        icon: perfil.dirImg + 'entidad.png',
        iconCls: 'btn',
        text:'Ejercicio',
        tooltip: 'Filtrar por ejercicio',
        handler: function() {
            if (Ext.getCmp('wind-ejercicio') == undefined) {

                a = getW();
            }
        }
    })
    return b;
    function getW() {
        var s = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'estado'
                }])
        });
        s.on('beforeload', function(t, n, e) {
            MostrarBarraProgreso('Cargando ejercicios...')
        })
        s.on('load', function(t, n, e) {
            progressbar.hide();
            //console.log(t.reader.jsonData.idejercicioactual);
            c.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
             w = new Ext.Window({
                closeAction: 'destroy',
                collapsible: true,
                id: 'wind-ejercicio',
                 constrain: true,
                resizable: false,
                width: 165,
                frame: true,
                layout: 'fit',
                height: 70, //105,
                items: [{
                        layout: 'column',
                        frame: true,
                        items: [{
                                columnWidth: 0.18,
                                items: l
                            }, {
                                columnWidth: 0.62,
                                items: c,
                                style: 'margin-left:3px;'
                            }, {
                                columnWidth: 0.2,
                                style: 'margin-left:3px;',
                                items: r
                            }]
                    }],
                title: 'Ejercicio: '+t.reader.jsonData.idejercicioactual.ejercicio/*,
                 buttons: [{
                 icon: perfil.dirImg + 'cerrar.png',
                 iconCls: 'btn',
                 text: 'Cerrar',
                 handler: function() {
                 w.destroy();
                 }
                 }]*/
            })
            w.show();
        })
        var c = new Ext.form.ComboBox({
            store: s,
            valueField: 'idejercicio',
            displayField: 'ejercicio',
            id:'cmbidejercicio',
            mode: 'local',
            width: 80,
            editable: false,
            triggerAction: 'all',
            listeners: {
                select: function(c, r, i) {
                    //estas variables se usan en los cmponentes Balance material y Calculo de cobertura respectivamente
                    idejercicioCBBM=1;
                    idejercicioBMCC=1;
                    recargaEjercicio(st);
                    w.setTitle('Ejercicio: ' + c.getRawValue())
                }
            }
        });
        var l = new Ext.Button({
            icon: perfil.dirImg + 'anterior.png',
            iconCls: 'btn',
            handler: function() {
                if (s.indexOfId(c.getValue()) - 1 >= 0) {
                    c.setValue(s.getAt(s.indexOfId(c.getValue()) - 1).data.idejercicio);
                    recargaEjercicio(st);
                    w.setTitle('Ejercicio: ' + c.getRawValue())
                }
            }
        });
        var r = new Ext.Button({
            icon: perfil.dirImg + 'siguiente.png',
            iconCls: 'btn',
            handler: function() {
                if (s.indexOfId(c.getValue()) + 1 < s.getCount()) {
                    c.setValue(s.getAt(s.indexOfId(c.getValue()) + 1).data.idejercicio);
                    recargaEjercicio(st);
                    w.setTitle('Ejercicio: ' + c.getRawValue())
                }
            }
        });
        function recargaEjercicio(st) {
			if (typeof(cargarconfgrid) == 'function')
				cargarconfgrid(c.getValue());
			else{	
				st.reload({
					params: {
						start: 0,
						limit: 20,
						idejercicio: c.getValue()
					}
				})
            }
        }
    }
}

   