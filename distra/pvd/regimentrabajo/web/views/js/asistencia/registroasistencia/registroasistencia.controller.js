Ext.ns('Pvd.ControlAsistencia.Registroasistencia');
//Controlador de la vista del componente
Pvd.ControlAsistencia.Registroasistencia.Controlador = {

    init: function (idioma, vista, modelo) {
        var scope=this;
        this.fecha;
        this.sesiones;
        this.activeSesion = 0;
        this.idasistenciamodif;
        this.limite = 15;
        this.otrodia;
        this.habentsal;
        scope.sm;

        this.years = new Array();
        var x = 2014;
        while(x <= vista.fecha.getFullYear())
        {
            var year = [x,x];
            this.years.push(year);
            x++;
        }

        Ext.Ajax.request({
            url: 'getAsistencia',
            params:{fdesde: vista.desde.getRawValue(),fhasta: vista.hasta.getRawValue()},
            method: "POST",
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);

                vista.btnRegistrarEntrada.disable();
                vista.btnRegistrarSalida.disable();
                vista.listadoAsistencia.disable();

                if(responseData.cod == 3){
                    mostrarMensaje(1, idioma.MsgPeopleNoRegimen);
                }else if(responseData.cod == 4){
                    mostrarMensaje(1, idioma.MsgPeopleNoCalendario);
                }else{
                    vista.btnRegistrarEntrada.enable();
                    vista.btnRegistrarSalida.disable();
                    vista.listadoAsistencia.enable();
                }

                scope.sesiones = responseData.sesiones;
                scope.fecha = responseData.fecha;
                scope.otrodia = responseData.otrodia;
                scope.habentsal = responseData.habentsal;

                if(scope.habentsal == "no"){
                    vista.btnRegistrarEntrada.disable();
                    vista.btnRegistrarSalida.disable();
                }

                if(scope.habentsal == "entrada"){
                    vista.btnRegistrarEntrada.enable();
                    vista.btnRegistrarSalida.disable();
                }

                if(scope.habentsal == "salida"){
                    vista.btnRegistrarEntrada.disable();
                    vista.btnRegistrarSalida.enable();
                }
                createGrid(responseData);
            }
        });

        function createGrid(responseData)
        {
            var columns = new Array();
            var indexs = new Array();
            var continentGroupRow = new Array();

            //renderers
            function formatDate(value, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';

                if (record.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (value) {
                    if (record.get('presente') == 0) {
                        return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                    } else {
                        return (value instanceof Date) ? value.format('d/m/Y') : value;
                    }
                } else {
                }
            };

            function horas(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (val) {
                    var fh = val.split(' ');
                    if (record.get('presente') == 0) {
                        if (fh.length > 1) {
                            var horacompleta = fh[1].split(':');
                            return '<i><b>' + horacompleta[0] + ':' + horacompleta[1] + '</b></i>';
                        }
                        else {
                            return '<i><b>' + val + '</b></i>';
                        }
                    } else {
                        if (fh.length > 1) {
                            var horacompleta = fh[1].split(':');
                            return horacompleta[0] + ':' + horacompleta[1];
                        }
                        else {
                            return val;
                        }
                    }
                }
                else {
                }
            }

            function combo(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (val) {
                    var valor = "";
                    var color = '#ffffff';

                    return '<span  style=" color:' + record.data.color + '"><b>' + record.data.causa + '</b></span>';
                }
                else
                    return val;
            }

            function  controlador(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (record.data.actualizado == 1) {
                    val = 'Control de Acceso';
                    return val;
                }else{
                    return val;
                }

            }

            function combops(val, metaData, rec, rowIndex, colIndex, store) {
                if (rec.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (val) {
                    var valor = "";
                    var color = '#ffffff';
                    if (rec.get('presente') == 0) {
                        return '<span  style=" font-size: small; color:' + rec.data.colorps + '"><b><i>' + rec.data.denominacionps + '</i></b></span>';
                    }
                    return '<span  style=" font-size: small; color:' + rec.data.colorps + '"><b>' + rec.data.denominacionps + '</b></span>';
                }
                else
                    return val;
            }

            function comboss(val, metaData, rec, rowIndex, colIndex, store) {
                if (rec.data.finsemana == 1) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                if (val) {
                    var valor = "";
                    var color = '#ffffff';
                    if (rec.get('presente') == 0) {
                        return '<span  style=" font-size: small; color:' + rec.data.colorss + '"><b><i>' + rec.data.denominacionss + '</i></b></span>';
                    }
                    return '<span  style=" font-size: small; color:' + rec.data.colorss + '"><b>' + rec.data.denominacionss + '</b></span>';
                }
                else
                    return val;
            }

            function  finSemana(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.finsemana == true) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }else
                    return val;
            }


            function  finSemanaFecha(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(record.get('initurno'))){
                    metaData.attr = 'ext:qtip=Tuno:'+record.get('turno');
                }else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.finsemana == true) {
                    metaData.css = 'weekend';
                    metaData.attr = 'ext:qtip="Fin de semana"';
                }
                return val;
            }
            //renderers

            columns.push({header: 'idpersona', width: 200, hidden: true, hideable: false, dataIndex: 'idpersona'});
            columns.push({header: 'idasistencia', width: 200, hidden: true, hideable: false, dataIndex: 'idasistencia'});
            columns.push({header: 'Fecha', width: 70, dataIndex: 'fecharegistro', renderer: finSemanaFecha});
            columns.push({header: 'Mes', width: 100,hidden: true, dataIndex: 'mes'});
            indexs.push({name:'idpersona'});
            indexs.push({name:'idasistencia'});
            indexs.push({name:'fecharegistro'});
            indexs.push({name:'mes'});

            if(responseData.sesiones == '1')
            {
                continentGroupRow.push({header: ' ', align: 'center', colspan:4});
                continentGroupRow.push({header: 'Primera sesi&oacute;n', align: 'center', colspan: 7});
                columns.push({header: 'Entrada',width: 50,dataIndex: 'fechahoraentradaps',editor: vista.horaentradaps,renderer: horas});
                columns.push({header: 'Salida',width: 45,dataIndex: 'fechahorasalidaps',editor: vista.horasalidaps,renderer: horas});
                columns.push({header: 'Causa ausencia',width: 220,dataIndex: 'denominacionps',renderer: combops});
                columns.push({header: 'idcausaps', hidden: true, hideable: false, width: 100, dataIndex: 'idcausaps'});
                columns.push({header: 'colorps', hidden: true, hideable: false, width: 100, dataIndex: 'colorps'});               
                columns.push({header: 'Perdidas',width: 70,dataIndex: 'hrsdescontadasps', renderer: finSemana});
                columns.push({header: 'Extras', width: 70, dataIndex: 'horasextrasps', renderer: finSemana});
                indexs.push({name:'fechahoraentradaps'});
                indexs.push({name:'fechahorasalidaps'});
                indexs.push({name:'denominacionps'});
                indexs.push({name:'idcausaps'});
                indexs.push({name:'colorps'});
                indexs.push({name:'hrsdescontadasps'});
                indexs.push({name:'horasextrasps'});

                continentGroupRow.push({header: 'Segunda sesi&oacute;n', align: 'center', colspan: 7});
                columns.push({header: 'Entrada',width: 50,dataIndex: 'fechahoraentradass',editor: vista.horaentradass,renderer: horas});
                columns.push({header: 'Salida',width: 45,dataIndex: 'fechahorasalidass',editor: vista.horasalidass,renderer: horas});
                columns.push({header: 'Causa ausencia',width: 220,dataIndex: 'denominacionss',renderer: comboss});
                columns.push({header: 'idcausass', hidden: true, hideable: false, width: 100, dataIndex: 'idcausass'});
                columns.push({header: 'colorss', hidden: true, hideable: false, width: 100, dataIndex: 'colorss'});
                columns.push({header: 'Perdidas',width: 70,dataIndex: 'hrsdescontadasss', renderer: finSemana});
                columns.push({header: 'Extras', width: 70, dataIndex: 'horasextrasss', renderer: finSemana});
                indexs.push({name:'fechahoraentradass'});
                indexs.push({name:'fechahorasalidass'});
                indexs.push({name:'denominacionss'});
                indexs.push({name:'idcausass'});
                indexs.push({name:'colorss'});
                indexs.push({name:'hrsdescontadasss'});
                indexs.push({name:'horasextrasss'});

                continentGroupRow.push({header: ' ', align: 'center', colspan: 11})
            }
            else
            {
                if(scope.otrodia == 1)
                    columns.push({header: 'Fecha entrada',width: 85,dataIndex: 'fechaentrada', renderer: formatDate});
                columns.push({header: 'Hora entrada',width: 80,dataIndex: 'fechahoraentrada',/*editor: this.horaentrada,*/renderer: horas});
                if(scope.otrodia == 1)
                    columns.push({header: 'Fecha salida',width: 80,dataIndex: 'fechasalida', renderer: formatDate});
                columns.push({header: 'Hora salida',width: 80,dataIndex: 'fechahorasalida',/*editor: this.horasalida,*/renderer: horas});
                indexs.push({name:'fechaentrada'});
                indexs.push({name:'fechahoraentrada'});
                indexs.push({name:'fechasalida'});
                indexs.push({name:'fechahorasalida'});
            }
            columns.push({header: 'color', hidden: true, hideable: false, width: 100, dataIndex: 'color'});
            columns.push( {header: 'Causa ausencia', width: 220, dataIndex: 'causa', renderer: combo});
            columns.push( {header: 'Desde', width: 70, dataIndex: 'fdesde', editor: this.desde, renderer: formatDate});
            columns.push( {header: 'Hasta', width: 70, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDate});
            columns.push({header: 'Perdidas',width: 70,dataIndex: 'hrsdescontadas', renderer: finSemana});
            if(responseData.sesiones == '0')
                columns.push({header: 'Extras', width: 100, dataIndex: 'horasextras', renderer: finSemana});
            columns.push({header: 'idcontrolador', hidden: true, hideable: false, width: 80, dataIndex: 'idpersonacontrola'});
            columns.push({header: 'Controlado por', width: 180, dataIndex: 'personacontrola', renderer: controlador});
            columns.push({header: 'idmodifica', hidden: true, hideable: false, width: 80, dataIndex: 'idpersonamodifica'});
            columns.push({header: 'Modificada por', width: 180, dataIndex: 'personamodifica', renderer: finSemana});
            columns.push({header: 'Observación', width: 180, dataIndex: 'observacion', renderer: finSemana});
            columns.push({header: 'dia', hidden: true, hideable: false, width: 80, dataIndex: 'dia'});
            columns.push({header: 'actualizado', hidden: true, hideable: false, width: 80, dataIndex: 'actualizado'});
            columns.push({header: 'finsemana', hidden: true, hideable: false, width: 80, dataIndex: 'finsemana'});
            columns.push( {header: 'Nombre y apellidos', width: 200, hidden: true, hideable: false,dataIndex: 'nombreapellidos'});
            columns.push({header: 'turno', width: 70,hidden: true, dataIndex: 'turno', renderer: finSemana});
            columns.push({header: 'initurno', width: 70,hidden: true, dataIndex: 'initurno', renderer: finSemana});
            columns.push({header: 'otrodia', width: 70,hidden: true, dataIndex: 'otrodia', renderer: finSemana});

            indexs.push({name:'color'});
            indexs.push({name:'causa'});
            indexs.push({name:'fdesde'});
            indexs.push({name:'fhasta'});
            indexs.push({name:'hrsdescontadas'});
            if(responseData.sesiones == '0')
                indexs.push({name:'horasextras'});
            indexs.push({name:'idpersonacontrola'});
            indexs.push({name:'personacontrola'});
            indexs.push({name:'idpersonamodifica'});
            indexs.push({name:'personamodifica'});
            indexs.push({name:'observacion'});
            indexs.push({name:'dia'});
            indexs.push({name:'actualizado'});
            indexs.push({name:'finsemana'});
            indexs.push({name:'nombreapellidos'});
            indexs.push({name:'turno'});
            indexs.push({name:'initurno'});
            indexs.push({name:'otrodia'});

            var group = new Ext.ux.grid.ColumnHeaderGroup({
                rows: [continentGroupRow]
            });

            scope.cmListadoPersonas = new Ext.grid.ColumnModel(columns);

            var plantillaapa = new Ext.data.Record.create(indexs);
            var myReaderapa = new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            }, plantillaapa);

            scope.stListadoResumen = new Ext.data.GroupingStore({
                remoteGroup:true,
                remoteSort: true,
                url: 'getAsistencia',
                reader: myReaderapa,
                sortInfo:{field: 'fecharegistro', direction: "ASC"},
                groupField:'mes'
            });

            scope.stListadoResumen.on('load',function(store, records, successful,operation, options) {

                    var encontrado = false;
                    if(scope.habentsal == "no"){
                        vista.btnRegistrarEntrada.disable();
                        vista.btnRegistrarSalida.disable();
                    }

                    if(scope.habentsal == "entrada"){
                        vista.btnRegistrarEntrada.enable();
                        vista.btnRegistrarSalida.disable();
                    }

                    if(scope.habentsal == "salida"){
                        vista.btnRegistrarEntrada.disable();
                        vista.btnRegistrarSalida.enable();
                    }
                    store.each(function(rec){
                        var f = scope.fecha.split('/');
                        // ms = Date.parse(f[1] + "/" + f[0] + "/" + f[2]);
                        ms = Date.parse(f[2] + "-" + f[1] + "-" + f[0]);
                        var fech = new Date(ms);

                        var d = rec.data.fecharegistro.split('/');
                        ms1 = Date.parse(d[2] + "-" + d[1] + "-" + d[0]);
                        var fregistro = new Date(ms1);
                    });
               

                if(vista.desde.isValid() && vista.hasta.isValid() ){
                    vista.btnBuscar.enable();
                }else{
                    vista.btnBuscar.disable();
                }
            });



            scope.smResumen = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            scope.ListadoResumen = new Ext.grid.GridPanel({
                id: 'listadoResumen',
                store: scope.stListadoResumen,
                title:'Registro de la asistencia',
                loadMask: idioma.lbTitMsgActualizando,
                width: '60%',
                sm: scope.smResumen,
                plugins: (responseData.sesiones == '1')?[ group]:[],
                stripeRows: true,
                view: new Ext.grid.GroupingView({
                    showGroupName:false,
                    groupTextTpl: '{text}'
                }),
                cm:scope.cmListadoPersonas
            });

            vista.listadoAsistencia.add(scope.ListadoResumen);
            vista.listadoAsistencia.doLayout();

            scope.stListadoResumen.loadData({
                datos : responseData.datos
            },true);

        }

        vista.btnBuscar.on('click', function () {
            scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
            scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
            scope.stListadoResumen.load({params:{start:0, limit:15}});
        }, this);

        vista.btnLimpiar.on('click', function () {
            vista.desde.setRawValue(vista.fech);
            vista.hasta.setRawValue(vista.fecha.format('d/m/Y'));
            scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
            scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
            scope.stListadoResumen.load({params:{start:0, limit:15}});
        }, this);

        vista.btnExportar.on('click', function () {
            exportar();
        }, this);

        function exportar(){
            var params = Ext.urlEncode({
                fdesde: vista.desde.getRawValue(),
                fhasta: vista.hasta.getRawValue(),
                idpersona: perfil.idpersona
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Registro de la asistencia',
                width: 800,
                height: 500,
                id: 'winregistro',
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
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/registroasistencia/generarPdfReporte?'+params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        modelo.stListadoResumen.on('beforeload',function(th,opt){
            scope.limite = opt.params.limit;
        });

        vista.btnGrafica.on('click', function () {
                scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                scope.stListadoResumen.load({params:{start:0, limit:15}});
                scope.stListadoResumen.on('load',function(st,recs,opt){
                    if(recs.length > 0)
                    {
                        vista.Maskara.hide();
                        vista.grafica.chartType='column';
                        vista.grafica.chartDatas= scope.stListadoResumen.reader.jsonData.resumen;
                        vista.grafica.chartTitle = 'Resumen de la asistencia del ' + vista.desde.getRawValue() +' al '+vista.hasta.getRawValue()
                        vista.grafica.chartDataElement = 'Cantidad de días'
                        vista.grafica.renderChart();
                        vista.grafica.enable();
                    }
                    else
                    {
                        vista.Maskara.hide();
                        vista.grafica.chartType='column';
                        vista.grafica.chartDatas=[{name : 'Cantidad', data : [['No exiten datos.', 0]]}];
                        vista.grafica.chartTitle = 'Resumen de la asistencia del ' + vista.desde.getRawValue() +' al '+vista.hasta.getRawValue();
                        vista.grafica.chartDataElement = 'Cantidad de días';
                        vista.grafica.renderChart();
                        mostrarMensaje(1,idioma.MsgNoDataAsistencia);
                        vista.grafica.disable();
                    }
                });
            vista.wingrafica.show();
        }, this);

        vista.btnRegistrarEntrada.on('click', function () {
            var encontrado = false;
            vista.listadoAsistencia.items.items[0].store.each(function(rec){
                if(!Ext.isEmpty(rec.data.fdesde) && !Ext.isEmpty(rec.data.fhasta))
                {
                    var f = scope.fecha.split('/');
                    ms = Date.parse(f[2] + "-" + f[1] + "-" + f[0]);
                    var fech = new Date(ms);

                    var d = rec.data.fdesde.split('/');
                    ms1 = Date.parse(d[2] + "-" + d[1] + "-" + d[0]);
                    var fdesde = new Date(ms1);

                    var h = rec.data.fhasta.split('/');
                    ms2 = Date.parse(h[2] + "-" + h[1] + "-" + h[0]);
                    var fhasta = new Date(ms2);

                    cmpfdesde = (fech.getTime() >= fdesde.getTime()) ? true : false;
                    cmpfhasta = (fech.getTime() <= fhasta.getTime()) ? true : false;
                }
                else
                {
                    cmpfdesde = false;
                    cmpfhasta = false;
                }
               if((scope.fecha == rec.data.fecharegistro || (cmpfdesde && cmpfhasta)) && !Ext.isEmpty(rec.data.causa))
               {
                   Ext.MessageBox.buttonText.yes = 'Registrar asistencia';
                   Ext.MessageBox.buttonText.no = 'Eliminar causa';
                   Ext.MessageBox.buttonText.cancel = 'Cancelar';

                   if(scope.sesiones == '1')
                   {
                       if(Ext.isEmpty(rec.data.fechahoraentradaps))
                       {
                           if(!Ext.isEmpty(rec.data.idcausaps) && rec.data.idpersona == rec.data.idpersonacontrola &&
                               Ext.isEmpty(rec.data.fechahorasalidaps))
                           {
                               scope.activeSesion = 1;
                           }
                           else
                           {
                               scope.activeSesion = 0;
                           }
                       }
                       else
                       {
                           scope.activeSesion = 1;
                       }
                   }

                   Ext.MessageBox.show({
                   title:'¡Atención!',
                   msg: 'Usted tiene una causa registrada el día de hoy,<br /> por favor escoja la acción a realizar.',
                   buttons: Ext.MessageBox.YESNOCANCEL,
                   fn: showResult,
                   //animEl: 'mb4',
                   icon: Ext.MessageBox.QUESTION
                   });
                   Ext.MessageBox.buttonText.yes = 'Yes';
                   Ext.MessageBox.buttonText.no = 'No';
                   Ext.MessageBox.buttonText.cancel = 'Cancel';

                   scope.idasistenciamodif = rec.data.idasistencia;
                   encontrado = true;
               }
            });
            if(!encontrado)
            {
                guardarentrada(-1);
            }
        }, this);

        function showResult(btn)
        {
            if(btn == 'yes')
            {
                guardarentrada(0);//0 para registrar la asistencia en el dia
                vista.winCambioCausa.hide();
            }
            if(btn == 'no')
            {
                guardarentrada(1);//1 para eliminar la causa permanentemente
                vista.winCambioCausa.hide();
            }
            if(btn == 'cancel')
                vista.winCambioCausa.hide();
        }

        vista.btnCancelAction.handler = function(){
            vista.winCambioCausa.hide();
        };

        vista.btnRegCausa.handler = function(){
            guardarentrada(0);//0 para registrar la asistencia en el dia
            vista.winCambioCausa.hide();
        };

        vista.btnDelCausa.handler = function(){
            guardarentrada(1);//1 para eliminar la causa permanentemente
            vista.winCambioCausa.hide();
        };

        guardarentrada = function(accion) {
                    Ext.getBody().mask(idioma.lbTitMsgActualizando);
                    Ext.Ajax.request({
                        url: 'guardarEntrada',
                        params:{accion:accion,idasistencia:scope.idasistenciamodif,sesion:scope.activeSesion,evento:0, otrodia:scope.otrodia},
                        method: "POST",
                        callback: function (options, success, response) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(response.responseText);
                            if(responseData.cod != 4)
                                scope.habentsal = "salida";
                            if(responseData.cod == 4)
                            {
                                mostrarMensaje(1,'Usted tiene una causa asociada que no tiene permiso para quitar, por favor diríjase a su controlador de asistencia.');
                            }
                        },
                        success: function () {
                            Ext.fly(vista.clock1.getEl()).update(new Date().format('g:i:s A'));
                            scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                            scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                            scope.stListadoResumen.load();
                        }
                    });
        }

        vista.btnRegistrarSalida.on('click', function () {
            if(scope.sesiones == '1')
            {
                vista.listadoAsistencia.items.items[0].store.each(function(rec){
                    var f = scope.fecha.split('/');
                    ms = Date.parse(f[2] + "-" + f[1] + "-" + f[0]);
                    var fech = new Date(ms);

                    var d = rec.data.fecharegistro.split('/');
                    ms1 = Date.parse(d[2] + "-" + d[1] + "-" + d[0]);
                    var fregistro = new Date(ms1);

                    if(fech.getTime() == fregistro.getTime())
                    {
                        if(Ext.isEmpty(rec.data.fechahorasalidaps))
                        {
                            if(!Ext.isEmpty(rec.data.idcausaps) && rec.data.idpersona == rec.data.idpersonacontrola &&
                                Ext.isEmpty(rec.data.fechahoraentradaps))
                            {
                                scope.activeSesion = 1;
                            }
                            else
                            {
                                scope.activeSesion = 0;
                            }
                        }
                        else
                        {
                            scope.activeSesion = 1;
                        }
                    }
                });

            }
            guardarsalida();
        }, this);

        guardarsalida = function() {
            Ext.getBody().mask(idioma.lbTitMsgActualizando);
            Ext.Ajax.request({
                url: 'guardarSalida',
                params:{sesion:scope.activeSesion,evento:1,otrodia:scope.otrodia},
                method: "POST",
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                },
                success: function () {
                    Ext.fly(vista.clock.getEl()).update(new Date().format('g:i:s A'));

                    scope.habentsal = "no";
                    scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                    scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                    scope.stListadoResumen.load();
                }
            });
        }

            this.loadPerilData = function()
            {
                Ext.Ajax.request({
                    url: 'datosPersona',
                    method: 'POST',
                    scope: this,
                    params: {idpersona: perfil.idpersona},
                    success: function (response)
                    {
                        var respuesta = Ext.decode(response.responseText);
                        respuesta.nombreapellidos = respuesta.nombreapellidos || 'Sin perfil';
                        respuesta.numid = respuesta.numid || '';
                        respuesta.sexo = respuesta.denomsexo || '';
                        if(respuesta.sexo == 1)
                            respuesta.foto = (respuesta.foto)? respuesta.foto : '';
                        else
                            respuesta.foto = (respuesta.foto)? respuesta.foto : '';

                        respuesta.denomcargo = respuesta.denomcargo || '';
                        respuesta.denomarea = respuesta.denomarea || '';
                        respuesta.denomentidad = respuesta.denomentidad || '';
                        respuesta.regimentrabajo = respuesta.regimentrabajo || '';
                        respuesta.grupodescanso = respuesta.grupodescanso || '';
                        respuesta.turnotrabajo = respuesta.turnotrabajo || '';

                        var contenido = vista.pfoto.body;

                        vista.plantillaFoto.overwrite(contenido, {
                            dirfoto: 'data:image/jpg;base64,' + respuesta.foto
                        });
                        contenido.slideIn('l', {stopFx: true, duration: .5});
                        vista.plantillaDatos.overwrite(vista.pDatosPantilla.body, respuesta);
                    }
                });
        }
        this.loadPerilData();

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'ble',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 66:{ //b parba buscar
                        scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                        scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                        scope.stListadoResumen.load({params:{start:0, limit:15}});
                        break;
                    }
                    case 76:{ //l para limpiar
                        vista.desde.setRawValue(vista.fech);
                        vista.hasta.setRawValue(vista.fecha.format('d/m/Y'));
                        scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                        scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                        scope.stListadoResumen.load({params:{start:0, limit:15}});
                        break;
                    }
                    case 69:{ //e para exportar
                            exportar();
                        break;
                    }
                }
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'r',
            handler: function(k, e) {
                switch(k) {
                    case 82:{ //r para registrar
                        if(vista.btnRegistrarEntrada.disabled == false){
                            guardarentrada();
                        }
                        if(vista.btnRegistrarSalida.disabled == false){
                            guardarsalida();
                        }
                        break;
                    }
                }
            }
        },{
            key: 13,//Enter para buscar
            fn: function(){
                scope.stListadoResumen.baseParams.fdesde = vista.desde.getRawValue();
                scope.stListadoResumen.baseParams.fhasta = vista.hasta.getRawValue();
                scope.stListadoResumen.load({params:{start:0, limit:15}});
            }
        }]);
    }
}