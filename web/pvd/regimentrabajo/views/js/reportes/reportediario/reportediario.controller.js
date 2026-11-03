Ext.ns('Pvd.ControlAsistencia.ReporteDiario');
//Controlador de la vista del componente
Pvd.ControlAsistencia.ReporteDiario.Controlador = {

    init: function (idioma, vista, modelo) {
        this.limite = 15;
        var scope=this;
        this.fecha = new Date();

        vista.EstructuraTree.tree.root.on('expand',function(nodo){
            vista.EstructuraTree.tree.getSelectionModel().select(nodo.childNodes[0]);
        });
       modelo.stListado.on('beforeload',function(st,opt){
       });

        modelo.stListado.removeAll();
        modelo.stListado.baseParams.idestructura =  perfil.idestructuracomun;
        modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
        modelo.stListado.load({params:{start:0, limit:15},callback:function(rec,opt,suc){
                vista.Maskara.hide();
             }
         });

        vista.EstructuraTree.on('dameseleccion', function (obj, data) {
            if(data == false)
                this.idestructura = vista.EstructuraTree.inicial;
            else{
                this.denomestructura = data.attributes.denominacion;
                this.idestructura = data.id;
            }

            modelo.stListado.removeAll();
            modelo.stListado.baseParams.idestructura= this.idestructura;
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.load({params:{start:0, limit:15},callback:function(rec,opt,suc){
                    vista.Maskara.hide();
            }
            });
        },this);

        vista.btnBuscar.on('click', function(){
            Buscar();
        },this);


        vista.btnExportar.on('click', function(){
            Exportar();
        },this);

        function Exportar(){
            var array = new Array();
            var fecha = vista.fechaBuscar.getRawValue();
            var cant = modelo.stListado.getCount();
            var denomestructura = vista.EstructuraTree.tree.getSelectionModel().getSelectedNode().text;
            var idestructura = vista.EstructuraTree.tree.getSelectionModel().getSelectedNode().id;
            var listpersonas = modelo.stListado.getRange(0,cant);
            var idestructura = vista.EstructuraTree.tree.getSelectionModel().getSelectedNode().id;

            Ext.each(listpersonas, function(rec){
                array.push({
                    idpersona: rec.data.idpersona,
                    idarea: rec.data.idarea,
                    denomarea: rec.data.denomarea,
                    nombreapellidos: rec.data.nombreapellidos,
                    idcausa: rec.data.idcausa,
                    causa: rec.data.causa
                });
            })

            var params = Ext.urlEncode({
                fecha: fecha,
                estructura: denomestructura,
                idestructura: idestructura,
                horareporte: scope.fecha,
                idestructura:idestructura,
            });

            var idIframeNominal = Ext.id();
            new Ext.Window({
                title: 'Reporte diario',
                width: 800,
                height: 500,
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframeNominal,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/reportediario/exportar?' + params
                    }
                }
            }).show();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte en formato PDF.');
            document.getElementById(idIframeNominal).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        modelo.stListado.on('load',function(th,recs,opt){
            if(recs.length > 0)
            {
                vista.grafica.chartType='column';
                vista.grafica.chartDatas=modelo.stListado.reader.jsonData.resumen;
                vista.grafica.chartTitle = 'Resumen de la asistencia'
                vista.grafica.chartDataElement = 'Cantidad de personas'
                vista.grafica.renderChart();
            }
            else
            {
                vista.grafica.chartType='column';
                vista.grafica.chartDatas=[{name : 'Cantidad', data : [['No exiten datos.', 0]]}];
                vista.grafica.chartTitle = 'Resumen de la asistencia'
                vista.grafica.chartDataElement = 'Cantidad de personas'
                vista.grafica.renderChart();
                mostrarMensaje(1,idioma.MsgNoDataAsistencia);
            }
        });

        modelo.stListado.on('beforeload',function(th,opt){
            scope.limite = opt.params.limit;
        });

        function Buscar(){
            modelo.stListado.removeAll();
            modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListado.baseParams.idestructura =  vista.EstructuraTree.tree.getSelectionModel().getSelectedNode().id;
            modelo.stListado.load({params:{start:0, limit:scope.limite},callback:function(rec,opt,suc){
                    vista.Maskara.hide();
            }
            });
        }

        vista.btnLimpiar.on('click', function(){
            Limpiar();
        },this);

        function Limpiar(){
                    vista.fechaBuscar.setRawValue(vista.fecha.format('d/m/Y'));
                    modelo.stListado.removeAll();
                    modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
                    modelo.stListado.baseParams.idestructura =  vista.EstructuraTree.tree.getSelectionModel().getSelectedNode().id;
                    modelo.stListado.load({params:{fecha: vista.fechaBuscar.getRawValue(),start:0, limit:15},callback:function(rec,opt,suc){
                            vista.Maskara.hide();
                    }
                    });
        }


        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'lbe',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 76:{ //l para limpiar
                        Limpiar();
                        break;
                    }
                    case 66:{ //b para buscar
                           Buscar();
                        break;
                    }
                    case 69:{ //e para exportar
                        Exportar();
                        break;
                    }
                }
            }
        },{
            key: 13,//Enter para buscar
            fn: function(){
                Buscar();           
            }
        }]);

    }
}