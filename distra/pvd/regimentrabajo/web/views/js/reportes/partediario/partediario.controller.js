Ext.ns('Pvd.ControlAsistencia.ParteDiario');
//Controlador de la vista del componente
Pvd.ControlAsistencia.ParteDiario.Controlador = {

    init: function (idioma, vista, modelo) {
        vista.Maskara.show();
        this.idestructura = perfil.idestructuracomun;
        this.denomestructura = perfil.denomestructuracomun;
        this.EstSelNodes = 0;
        var self = this;

        this.cant = new Array();
        this.arraynew = new Array();
        this.arreglo = new Array();
        this.causas=0;
        this.tienecategorias = false;
        this.CategSelected = new Array();
        this.denomEstructuraExportNominal = '';

        this.fecha = new Date();
        var hora;
        var minutos;
        var segundos;
        hora = this.fecha.getHours();
        minutos = this.fecha.getMinutes();
        segundos = this.fecha.getSeconds();
        this.horareporte = hora + ':' + minutos + ':' + segundos
        this.causasCargadaas = false;

        function GetDataUPD(arrNodes)
        {
            var arrEstructuras = new Array();
            var arrTipoEstructuras = new Array();
            var arrDenomEstructuras = new Array();
            Ext.each(vista.EstructuraTree.tree.getChecked(), function (nodo) {
                arrEstructuras.push(nodo.id);
                arrTipoEstructuras.push(nodo.attributes.idconcepto);
                arrDenomEstructuras.push(nodo.text);
            });
            ActualizarGrid(arrNodes, arrEstructuras, arrTipoEstructuras, arrDenomEstructuras);
        }


        vista.treeCausales.on('expandnode',function(){

        });


        vista.EstructuraTree.tree.root.on('expand', function (nodo) {
            nodo.childNodes[0].getUI().toggleCheck(true);

            Ext.Ajax.request({
                url: 'cargacausasausencia',
                method: 'POST',
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    self.causasCargadaas = true;
                    vista.Maskara.hide();
                    if (responseData.causasAgrupadas.length > 0) {
                        vista.treeCausales.getRootNode().appendChild(responseData.causasAgrupadas);
                        vista.treeCausales.getRootNode().expandChildNodes(true);
                        var arrNodes = new Array();
                        Ext.each(responseData.hojas, function (hoja) {
                            arrNodes.push({
                                attributes: {
                                    id: hoja.idcausa,
                                    idcategoria: hoja.idcategoria,
                                    abreviatura: hoja.abreviatura
                                }
                            });
                        });
                            GetDataUPD(arrNodes);
                    }
                    else {
                        //poner validacion aqui para cuando no hay causas configuradas en el sistema
                    }
                }
            });
        });

        vista.treeCausales.getRootNode().on('expand', function (p, bool) {
            vista.btnAceptar.enable();
        });



        vista.EstructuraTree.on('dameseleccion', function (obj, data) {
            this.EstSelNodes = data.length;
            if (data == false)
                this.idestructura = vista.EstructuraTree.inicial;
            else {
                this.denomestructura = data[0].attributes.denominacion;
                this.idestructura = data[0].id;
                this.idconcepto = data[0].attributes.idconcepto;
            }
        }, this);

        vista.btnBuscarCausa.on('click', function () {
            var entidades = vista.EstructuraTree.tree.getChecked();
            var identidades = new Array();
            Ext.each(entidades, function (rec) {
                identidades.push(rec.attributes.id);
            })
            self.stNewCol.removeAll();
            self.stNewCol.baseParams.fecha = vista.fechaBuscar.getRawValue();
            self.stNewCol.load({params: {array: Ext.encode(self.arreglo), idestructura: Ext.encode(identidades),start: 0, limit: 15}, callback: function (rec, opt, suc) {

                if(rec.length > 0)
                {
                    vista.Maskara.hide();
                    vista.graficaestadistico.chartType='pie';
                    vista.graficaestadistico.chartDatas=modelo.stListado.reader.jsonData.resumen;
                    vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                    vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                    vista.graficaestadistico.renderChart();
                }
                else
                {
                    vista.Maskara.hide();
                    vista.graficaestadistico.chartType='column';
                    vista.graficaestadistico.chartDatas=[{name : 'Cantidad', data : [['No exiten datos.', 0]]}];
                    vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                    vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                    vista.graficaestadistico.renderChart();
                    mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                }
            }
            });

        }, this);

        vista.btnCancelar.on('click', function () {
            vista.winSelecCausas.hide();
        }, this);

        vista.btnCerrar.on('click', function () {
            vista.winReporteNominal.hide();
        }, this);

        vista.btnExportarNominal.on('click', function () {
            ExportarNominal();
        }, this);

        function ExportarNominal() {
            var fecha = vista.fechaBuscar.getRawValue();
            var cant = modelo.stListado.getCount();
            var params = Ext.urlEncode({
                fecha: fecha,
                estructura: self.denomEstructuraExportNominal,
                horareporte: self.horareporte
            });

            var idIframeNominal = Ext.id();
            new Ext.Window({
                title: 'Reporte nominal',
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
                            '/pvd/regimentrabajo/index.php/partediario/exportar?' + params
                    }
                }
            }).show();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte nominal en formato PDF.');
            document.getElementById(idIframeNominal).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        vista.btnExportarEstadistico.on('click', function () {
            ExportarEstadistico();
        }, this);

        function ExportarEstadistico() {
            var fecha = vista.fechaBuscar.getRawValue();
            var params = Ext.urlEncode({
                fecha: fecha,
                horareporte: self.horareporte,
                cantidad: Ext.encode(self.cant),
                tienecategorias:Ext.encode(self.tienecategorias),
                categorias:Ext.encode(self.CategSelected)
            });

            var idIframeEstadistico = Ext.id();
            new Ext.Window({
                title: 'Reporte estadístico',
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
                        id: idIframeEstadistico,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/partediario/exportarestadistico?' + params
                    }
                }
            }).show();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte estadístico en formato PDF.');
            document.getElementById(idIframeEstadistico).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        vista.fechaBuscar.on('setValue', function (th, gv, v) {
            if (formatDate(gv.dateFormat('d/m/Y')) != formatDate(v.dateFormat('d/m/Y'))) {
                var entidades = vista.EstructuraTree.tree.getChecked();
                var identidades = new Array();
                Ext.each(entidades, function (rec) {
                    identidades.push(rec.attributes.id);
                })
            }
        },this);

        vista.btnBuscar.on('click', function () {
            Buscar();
        }, this);

        function Buscar() {
            var arrEstructuras = new Array();
            var arrTipoEstructuras = new Array();
            var arrDenomEstructuras = new Array();
            Ext.each(vista.EstructuraTree.tree.getChecked(), function (nodo) {
                arrEstructuras.push(nodo.id);
                arrTipoEstructuras.push(nodo.attributes.idconcepto);
                arrDenomEstructuras.push(nodo.text);
            });
            ActualizarGrid(new Array(),arrEstructuras, arrTipoEstructuras, arrDenomEstructuras);
        }

        vista.btnBuscarNominal.on('click', function(){
            buscarpersona();
        },this);

        buscarpersona = function() {
            var tVal = vista.filtro.getRawValue().toLowerCase();
            var cant = modelo.stListado.getCount();
            var listpersonas = modelo.stListado.getRange(0,cant);
            var cont = 0;
            if(tVal != ' '){
                Ext.each(listpersonas, function(rec){
                    var tStr =  rec.data.nombreapellidos.toString().toLowerCase();
                    if(tStr.indexOf(tVal)!=-1){
                        var p = new modelo.recQrElement({
                            idasistencia: rec.data.idasistencia,
                            idpersona: rec.data.idpersona,
                            nombreapellidos: rec.data.nombreapellidos,
                            idcausa: rec.data.idcausa,
                            denomentidad: rec.data.denomentidad,
                            denomcargo: rec.data.denomcargo,
                            fecharegistro: rec.data.fecharegistro,
                            causa: rec.data.causa,
                            idcausa: rec.data.idcausa,
                            gradocategoriallamado: rec.data.gradocategoriallamado,
                            observacion: rec.data.observacion
                        });
                        modelo.stListado.removeAll();
                        vista.Listado.getStore().add(p);
                    }

                })
            }

        }


        vista.btnLimpiar.on('click', function () {
            Limpiar();
        }, this);

        function Limpiar() {
            modelo.stListado.removeAll();
            vista.filtro.reset();
            modelo.stListado.load({params: {start: 0, limit: 15}, callback: function (rec, opt, suc) {
                if (rec.length > 0) {
                    vista.Maskara.hide();
                    vista.graficanominal.chartType='pie';
                    vista.graficanominal.chartDatas=modelo.stListado.reader.jsonData.resumen;
                    vista.graficanominal.chartTitle = 'Resumen de la asistencia'
                    vista.graficanominal.chartDataElement = 'Cantidad de personas'
                    vista.graficanominal.renderChart();
                }
                else {
                    vista.Maskara.hide();
                    vista.graficanominal.chartType='column';
                    vista.graficanominal.chartDatas=[{name : 'Cantidad', data : [['No exiten datos.', 0]]}];
                    vista.graficanominal.chartTitle = 'Resumen de la asistencia'
                    vista.graficanominal.chartDataElement = 'Cantidad de personas'
                    vista.graficanominal.renderChart();
                    mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                }

            }
            });
        }

        function ActualizarGrid(arrNodes,arrEstructuras,arrTipoEstructuras,arrDenomEstructuras)
        {
            vista.Maskara.show();
            if(arrNodes.length > 0)
                causas = arrNodes;
            else
                causas = vista.treeCausales.getChecked();

            var columns = new Array();
            var indexs = new Array();
            var continentGroupRow = new Array();
            var causasAgrupadas = new Array();

            Ext.each(vista.treeCausales.getRootNode().childNodes,function(nod){
                if(!Ext.isEmpty(nod.attributes.idcategoria))
                {
                    var obj = {
                        dataindex:nod.attributes.id+'/'+nod.attributes.idcategoria,
                            denom:nod.attributes.text,
                         childrens: new Array()
                    };
                    causasAgrupadas.push(obj);
                }
            });

            self.tienecategorias = false;
            Ext.each(causas,function(causa){
                if(causa.attributes.idcategoria > 0)
                {
                    self.tienecategorias = true;
                }
            });

            Ext.each(causas,function(causa){
                if(!self.tienecategorias)
                {
                    var obj = {
                        dataindex:causa.attributes.id,
                        denom:causa.attributes.abreviatura
                    }
                    causasAgrupadas.push(obj);
                }
                else
                {
                    if(!Ext.isEmpty(causa.attributes.idcategoria))
                    {

                        var obj = {
                            dataindex:causa.attributes.id+'/'+causa.attributes.idcategoria,
                            denom:causa.attributes.abreviatura
                        };
                        for(i = 0; i < causasAgrupadas.length; i++)
                        {
                            if(causasAgrupadas[i].dataindex.split('/')[1] == causa.attributes.idcategoria)
                                causasAgrupadas[i].childrens.push(obj);
                        }
                    }
                    else
                    {

                        for(i = 0; i < causasAgrupadas.length; i++)
                        {
                            var obj = {
                                dataindex:causa.attributes.id+'/'+causasAgrupadas[i].dataindex.split('/')[1],
                                denom:causa.attributes.abreviatura
                            };
                            causasAgrupadas[i].childrens.push(obj);
                        }
                    }
                }

            });

            self.CategSelected = causasAgrupadas;

            columns.push(new Ext.grid.RowNumberer());
            columns.push({
                header: 'idestructura', width: 300, hidden:true, dataIndex: 'idestructura'
            });
            columns.push({
                header: 'Entidad-UM', width: 300, dataIndex: 'denomentidad'
            });
            columns.push({
                header: 'Por plantilla', width: 100, dataIndex: 'porplantilla'
            });
            columns.push({
                header: 'Cubierto', width: 100, dataIndex: 'cubierto'
            });
             columns.push({
                header: 'Fuera de plantilla', width: 100, dataIndex: 'fueraplantilla'
            });
             columns.push({
                header: 'Total', width: 100, dataIndex: 'totalpersonas'
            });
            columns.push({
                header: 'Presente', width: 100, dataIndex: 'presente'
            });
            columns.push({
                header: 'Total fuera', width: 100, dataIndex: 'totalfuera'
            });

            indexs.push({name: 'idestructura'});
            indexs.push({name: 'denomentidad'});
            indexs.push({name: 'porplantilla'});
            indexs.push({name: 'cubierto'});
            indexs.push({name: 'fueraplantilla'});
            indexs.push({name: 'totalpersonas'});
            indexs.push({name: 'presente'});
            indexs.push({name: 'totalfuera'});

            if(self.tienecategorias)
            {
                continentGroupRow.push({header: ' ', align: 'center', colspan: 9});
                Ext.each(causasAgrupadas,function(causaAgrupada){
                    if(causaAgrupada['childrens'].length > 0)
                    {
                        var x = causaAgrupada['childrens'].length + 1;
                        continentGroupRow.push({header: causaAgrupada['denom'], align: 'center', colspan:x})
                        Ext.each(causaAgrupada['childrens'],function(causa){
                            columns.push({
                                dataIndex: causa['dataindex'],
                                sortable: false,
                                header: causa['denom'],
                                width: 60
                            });
                            indexs.push({name:causa['dataindex']});
                        });
                        columns.push({
                            dataIndex: 'subtotal/'+causaAgrupada['dataindex'].split('/')[1],
                            sortable: false,
                            header: 'Subtotal '+causaAgrupada['denom'],
                            width: 90,
                            hidden:false,
                            hiddeable:false
                        });
                        indexs.push({name:'subtotal/'+causaAgrupada['dataindex'].split('/')[1]});
                    }
                });
            }
            else
            {console.info(causasAgrupadas);
                Ext.each(causasAgrupadas,function(causa){
                    columns.push({
                        dataIndex: causa['dataindex'],
                        sortable: false,
                        header: causa['denom'],
                        width: 60
                    });
                    indexs.push({name:causa['dataindex']});
                });
            }



            var group = new Ext.ux.grid.ColumnHeaderGroup({
                rows: [continentGroupRow]
            });

            indexs.push({name:'resumen'});

            self.cmNewapa = new Ext.grid.ColumnModel(columns);
            var plantillaapa = new Ext.data.Record.create(indexs);
            var myReaderapa = new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            }, plantillaapa);
            self.stNewapa = new Ext.data.Store({
                url: 'getReporteEstadistico',
                reader: myReaderapa,
                sortInfo:{field: 'denomentidad', direction: "ASC"},
            });


            var smListadoApa = new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners:{
                    rowselect:function(th,indx,rec){
                        vista.panelgraficaestadistico.expand();
                        if(rec.data.resumen.data.length > 0)
                        {
                            vista.Maskara.hide();
                            vista.graficaestadistico.chartType='column';
                            vista.graficaestadistico.chartDatas= self.stNewapa.reader.jsonData.resumen;
                            vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                            vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                            vista.graficaestadistico.renderChart();
                        }
                        else
                        {
                            vista.Maskara.hide();
                            vista.graficaestadistico.chartType='column';
                            vista.graficaestadistico.chartDatas={name : 'Cantidad', data : [['No exiten datos.', 0]]};
                            vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                            vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                            vista.graficaestadistico.renderChart();
                            mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                        }

                    }
                }
            });

            var ListadoNewApa1 = new Ext.grid.GridPanel({
                id: 'listadonewapa1',
                store: self.stNewapa,
                loadMask: {msg: 'cargando...'},
                width: '100%',
                height:500,
                sm: smListadoApa,
                plugins: (self.tienecategorias)?[group]:[],
                cm: self.cmNewapa,
                listeners:{
                    rowdblclick : function (grd,rowIndex,e) {
                        self.denomEstructuraExportNominal = grd.getSelectionModel().getSelected().data.denomentidad
                        vista.winReporteNominal.setTitle(' ');
                        vista.Listado.setTitle('Relación nominal sobre la situación del personal' + ' - ' + grd.getSelectionModel().getSelected().data.denomentidad);
                        vista.winReporteNominal.show();
                        vista.winReporteNominal.maximize();

                        modelo.stListado.removeAll();
                        modelo.stListado.baseParams.idestructura = grd.getSelectionModel().getSelected().data.idestructura;
                        modelo.stListado.baseParams.fecha = vista.fechaBuscar.getRawValue();
                        modelo.stListado.load({params: {start: 0, limit: 15}, callback: function (rec, opt, suc) {
                            if (rec.length > 0) {
                                vista.Maskara.hide();
                                vista.graficanominal.chartType='pie';
                                vista.graficanominal.chartDatas= modelo.stListado.reader.jsonData.resumen;
                                vista.graficanominal.chartTitle = 'Resumen de la asistencia'
                                vista.graficanominal.chartDataElement = 'Cantidad de personas'
                                vista.graficanominal.renderChart();
                            }
                            else {
                                vista.Maskara.hide();
                                vista.graficanominal.chartType='column';
                                vista.graficanominal.chartDatas={name : 'Cantidad', data : [['No exiten datos.', 0]]};
                                vista.graficanominal.chartTitle = 'Resumen de la asistencia'
                                vista.graficanominal.chartDataElement = 'Cantidad de personas'
                                vista.graficanominal.renderChart();
                                mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                            }

                        }
                        });
                    }
                }

            });

            self.stNewapa.load({
                params:{
                    idestructuras:Ext.encode(arrEstructuras),
                    idtipoestructuras:Ext.encode(arrTipoEstructuras),
                    denomestructuras:Ext.encode(arrDenomEstructuras),
                    fecha:vista.fechaBuscar.getRawValue(),
                    tienecategoria:self.tienecategorias
                },
                callback:function(){
                    vista.Maskara.hide();
                    if(rec.length > 0)
                    {
                        vista.Maskara.hide();
                        vista.graficaestadistico.chartType='column';
                        vista.graficaestadistico.chartDatas=self.stNewapa.reader.jsonData.resumen;
                        vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                        vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                        vista.graficaestadistico.renderChart();
                    }
                    else
                    {
                        vista.Maskara.hide();
                        vista.graficaestadistico.chartType='column';
                        vista.graficaestadistico.chartDatas=[{name : 'Cantidad', data : [['No exiten datos.', 0]]}];
                        vista.graficaestadistico.chartTitle = 'Resumen de la asistencia'
                        vista.graficaestadistico.chartDataElement = 'Cantidad de personas'
                        vista.graficaestadistico.renderChart();
                        mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                    }
                }
            });

            if(vista.panelgrid.items.length != 0)
            {
                vista.panelgrid.getComponent(0).destroy();
            }
            vista.panelgrid.add(ListadoNewApa1);
            vista.panelgrid.doLayout();


        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'be',
                alt: true,
                stopEvent: true,
                handler: function (k, e) {
                    switch (k) {
                        case 66:
                        { //b para buscar
                            Buscar();
                            break;
                        }
                        case 69:
                        { //e para exportar
                            ExportarEstadistico();
                            break;
                        }
                    }
                }
            },{
            key: 13,//Enter para buscar
            fn: function(){
                Buscar();      
            }
        }
        ]);

    }
}