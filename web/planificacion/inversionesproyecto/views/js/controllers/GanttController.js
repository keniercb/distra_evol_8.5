Planificacion.Integracion.GanttController = Ext.extend(Std.Base.Controller, {
    constructor: function() {
        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes,
                perfil: perfil
            }
        };
        this.init(config);
    },    
    mostrarAyuda: function(referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    buscarTarea: function(params) {
        var _this = this;
        Secodena.mostrarMascara('buscarTarea', '', 'Buscando tarea...');
        var view = this._getItem('ganttComponent');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'gantt/buscarTarea',
            params: {
                objeto: params
            },
            callback: function(options, success, response) {
                if (success) {
                    Secodena.ocultarMascara('buscarTarea');
                    var data = Ext.decode(response.responseText);
                    view.gridPanel.getStore().loadData(data);
                    if (!data.cantidad_filas > 0) {
                        mostrarMensaje(1, _this._getLabel('Gantt').msgTareaNoEncontrada, function() { });
                    }
                }
            }
        });
    },
    obtenerTareas: function(idestudiogantt) {
        var _this = this;        
        var view = this._getItem('ganttDiagram');
        var mask = new Ext.LoadMask(view.body, {msg : "Cargando..."});
        mask.show();
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'gantt/obtenerTarea',
            params: {
                idestudiogantt: idestudiogantt
            },
            callback: function(options, success, response) {
                mask.hide();
                if (success) {                    
                    var resp = Ext.decode(response.responseText);
                    view.showGantt(resp.root);
                    view.Label1.setText('Porcentaje cumplimiento : ' + resp.porciento + '%');
                }
            }
        });
    },

    obtenerReporte: function(params){

        obj = {
            view: this,
            path: '/planificacion/herramientasintegracion/index.php/gantt/obtenerReporte',
            baseParams: {
                idestudiogantt: params.idestudiogantt,
                denominacion: params.denominacion
            },
            fnSuccess : 'crearGantt',
            beforeExportTo : 'setGraficaToImagen',
            fnFailure : function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportesge.create(obj);

    },

    crearGantt: function (result, params) {

       var ganttDiagram = this._getItem('ganttDiagram');
        if (!ganttDiagram) {

            var ganttDiagram = new Planificacion.Integracion.GanttDiagram({
                etiquetas: _this.etiquetas,
                extendCmp: _this.extendCmp,
                controller: _this.controller,
                objproyecto: _this.objproyecto,
                ganttComponent: _this
            });
        }
        tasks = result.data.root;
        tasks.idcontainer = 'report_gantt';
        ganttDiagram.showGantt(tasks);

    },


    setGraficaToImagen: function(result, params) {

        var html = $(result).clone();
        var element = document.getElementById('report_gantt');
        var image = undefined;

        html2canvas(element, {
            onrendered: function(canvas) {
                var base64 = canvas.toDataURL('data:image/png;base64;');
                $.when( $('#report_gantt').empty(),
                $('#report_gantt').prepend('<img src=' + base64 + ' />')
                ).done(
                    function() {
                        result.trigger('onrender');
                    }
                );


            }
        });

    }
});
