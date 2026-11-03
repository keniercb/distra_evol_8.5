Ext.ns('Pvd.Evaluaciones.Resumenprocesoevaluativo');
Ext.QuickTips.init();

//Modelo de la vista del modulo Resumen del proceso evaluativo..
Pvd.Evaluaciones.Resumenprocesoevaluativo.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        /**
         *
         * @type {Ext.data.Store}
         */
        this.stResumenProcEval = new Ext.data.Store({
            url: 'obtenerResumenProcEvaluativo',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{name: 'total'}, {name: 'porevaluar'}, {name: 'porcientototal'}, {name: 'promedio'}, {name: 'evaluado'}, {name: 'noevaluado'}, {name: 'desacuerdo'}, {name: 'reclamacion'}, {name: 'idestadodesarrollo'}, {name: 'estadodesarrollo'}, {name: 'licmaternidad'}, {name: 'hospitalizado'}, {name: 'presos'}
            ])
        });

        this.rootEstrucEval = new Ext.tree.AsyncTreeNode({
            //nodeType: 'async',
            text: '<i>Estructura evaluativa</i>',
            animate: false,
            draggable: false,
            expanded: false
        });

        this.loaderEstrucEval = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuraEvaluativa'
        });

        this.tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarperiodosprocesos'

        });

        this.tlIndicadoresP = new Ext.tree.TreeLoader({
            dataUrl: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarpersonasgraficar'

        });
		
    }
}
