Utilidades.Cmp.Cmpejercicio = function (opcionesConfig) {
   var _this = this;

    this.BarraProgreso = new BarraEstado();
    this.next = false
    this.btDguardar = true  //lo uso para opcion de siguiente no guarde dos veces cuando se llama a detener por fin de tareas
    this.elcrono = ""  //var para detener la ejecucion del ciclo
    //funcion del flaco copie y pegue para no tener que hacer links y cargar cosas inecesarias
    function MostrarDuracionEstimada(equivalenciaMinutos, m, p) {
        var tiempo = '';        
        /*var restoAnos = equivalenciaMinutos % (525600);
         var equivalenciaAnos = equivalenciaMinutos / (525600);
         var restoMeses = restoAnos % (44640);
         var equivalenciaMeses = restoAnos / (44640);*/
        var restoDias = equivalenciaMinutos % (1440);
        var equivalenciaDias = equivalenciaMinutos / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        //var duracionPlanTotal = parseInt(equivalenciaAnos) + ' a�os - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        _this.equivalenciaDuracion = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };

        if (equivalenciaMinutos >= 60) {
            if (_this.equivalenciaDuracion.equivalenciaDias != 0)
                tiempo = parseInt(_this.equivalenciaDuracion.equivalenciaDias) + ' dias';
            else
                tiempo = '';
            if (_this.equivalenciaDuracion.equivalenciaHoras != 0)
                tiempo += ' ' + parseInt(_this.equivalenciaDuracion.equivalenciaHoras) + ' horas';
            else
                tiempo += '';
            if (_this.equivalenciaDuracion.restoMinutos != 0)
                tiempo += ' ' + Math.round(_this.equivalenciaDuracion.restoMinutos) + ' min';
            else
                tiempo += '';
        } else {
            tiempo = Math.round(equivalenciaMinutos) + ' min';
        }

        return tiempo;
    }


    this.smCalculo = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function(sm){
                _this.eliminarregistro.setDisabled(!sm.getSelections().length)
                _this.modificarTES.setDisabled(sm.getSelections().length != 1)
            }
        }
    });

    this.user = "",

    this.formula = '<div style="float: left; margin-left: 20px;"><h3 style="font-size:15px;">Dt = (To+4Tm+Tp)/6   <br>Dt = X</h3></div>'
    this.leyenda = '<div style="float: left; margin-left: 10px;"><h3 style="font-size:10px;">To: Tiempo Optimista<br>Tp: Tiempo Pesimista<br>Tm: Tiempo Medio</h3></div>'
    this.formula = ""
    this.leyenda = " "

    document.cronoI = function(en){
        en.hidden = true
        document.getElementById("btSaltarCrn").hidden = true
        document.getElementById("btDetenerCrn").hidden = false
        document.getElementById("btSiguienteCrn").hidden = false
        document.getElementById("btCapturarCrn").disabled = false
        document.getElementById("btCapturarCrn").className  = "buttonCapturarCalc"
        _this.seguir = true
        empezar()
    }

    document.cronoD = function(en){

        en.hidden = true
        document.getElementById("btIniciarCrn").hidden = false
        document.getElementById("btSiguienteCrn").hidden = true
        document.getElementById("btSaltarCrn").hidden = false
        document.getElementById("btCapturarCrn").disabled = true
        document.getElementById("btCapturarCrn").className  = "buttonCapturarCalc opaciti"
        _this.seguir = false

        if(_this.btDguardar){
        //   _this.guardar()
        }

        _this.btDguardar = true
        clearInterval(_this.elcrono);
        _this.cronometro.setTime('0:00:00.00')

    }

    document.cronoC = function(en){
        _this.cronometro.capturar()
    }

    document.cronoSaltar = function(en){
        _this.smlistadoT.selectNext()
    }

    document.cronoS = function(en){
        _this.next = true
        _this.cronometro.capturar()

        //_this.guardar()

        if(!_this.smlistadoT.selectNext()){
            _this.next = false
            _this.btDguardar = false
            document.cronoD(document.getElementById("btDetenerCrn"))
            _this.smlistadoT.selectFirstRow();
            mostrarMensaje(1, "No quedan tareas por correr.");
        }
    }



    this.butC  = '<div style="float:right;">'
    this.butC += '<button id="btIniciarCrn" onclick="cronoI(this)" disabled class="buttonIniciarCalc opaciti">Iniciar</button>'
    this.butC += '<button id="btDetenerCrn" onclick="cronoD(this)"  hidden class="buttonDetenerCalc" >Detener</button>'
    this.butC += '<button id="btCapturarCrn" onclick="cronoC(this)" disabled class="buttonCapturarCalc opaciti">Capturar</button>'
    this.butC += '<button id="btSiguienteCrn" onclick="cronoS(this)" hidden class="buttonSiguienteCalc">Siguiente</button>'
    this.butC += '<button id="btSaltarCrn" onclick="cronoSaltar(this)" disabled class="buttonSaltarCalc opaciti">Saltar</button>'
    this.butC += '</div>'

    this.cronometro = new Ext.Panel({
        width: "100%",
        region:'south',
        html:_this.butC+_this.leyenda+_this.formula+'<h3 style="float: left; margin-left: 30px; margin-right: 10px;"><b style="font-size:30px;"><div  id="htmlcrono">0:00:00.00</div></b></h3>',
        valor:"0:00:00.00",
        capturar:function(){
            var date = new Date().format('d/m/Y')
            var str = new Ext.data.Record({'idcalc':false,'tiempo':this.valor,'fecha':date,'usuario':_this.user});
            _this.stCalculo.add(str)
            var row = _this.stCalculo.getAt(_this.stCalculo.getCount()-1)
            row.set("tiempo",this.valor+0)

            //guardar resultado
            var dataT = _this.smlistadoT.getSelected().data
            var rec = new Ext.data.Record({
                'idcalc':false,
                'tiempo':this.valor,
                'fecha': new Date().format('d/m/Y'),
                'denominacion':dataT.denelemento,
                'idelemento':dataT.idelemento
            });

            var exits = true
            _this.stResultado.findBy(function(r){
                if(r.get('idtarea') == dataT.idelemento)
                     exits = false
            })
            if(exits) {
                _this.stResultado.add(rec)
                _this.crudResultado(rec, false)
            }
        },
        setTime:function(time){
            this.valor = time
            document.getElementById("htmlcrono").textContent = time
        },
        resetHtml:function(){
            _this.seguir = false
            clearInterval(_this.elcrono);
            this.valor = "0:00:00.00"
            this.body.update(_this.butC+_this.leyenda+_this.formula+'<h3 style="float: left; margin-left: 30px; margin-right: 10px;"><b style="font-size:30px;"><div  id="htmlcrono">0:00:00.00</div></b></h3>')
        },
        updateHtml:function(optimista,pesimista,medio,xn){

            var formulaU = '<div style="float: left; margin-left: 30px;"><h3 style="font-size:15px;">Dt = (To+4Tm+Tp)/6   <br>Dt = '+xn+'</h3></div>'
            var evalu = '<div style="float: left; margin-left: 10px;"><h3 style="font-size:10px;">To: '+optimista+'<br>Tp: '+pesimista+'<br>Tm: '+medio+'</h3></div>'
            formulaU = ""
            evalu = ""
            this.body.update(_this.butC+evalu+formulaU+'<h3 style="float: left; margin-left: 30px;"><b style="font-size:30px;"><div  id="htmlcrono">'+this.valor+'</div></b></h3>')
        }
    });

    this.seguir = false

    function tiempo(){
        if(_this.seguir){
            actual = new Date(); //fecha a cada instante
            //tiempo del crono (cro) = fecha instante (actual) - fecha inicial (emp)
            cro = actual - emp; //milisegundos transcurridos.
            cr = new Date(); //pasamos el num. de milisegundos a objeto fecha.
            cr.setTime(cro);
            //obtener los distintos formatos de la fecha:
            cs = cr.getMilliseconds(); //milisegundos
            cs = cs / 10; //paso a cent�simas de segundo.
            cs = Math.round(cs); //redondear las cent�simas
            sg = cr.getSeconds(); //segundos
            mn = cr.getMinutes(); //minutos
            ho = cr.getHours() - 1; //horas
            d = cr.getDay(); // Dias
            //poner siempre 2 cifras en los n�meros
            if (cs < 10) {
                cs = "0" + cs;
            }
            if (sg < 10) {
                sg = "0" + sg;
            }
            if (mn < 10) {
                mn = "0" + mn;
            }
            if (d < 10) {
                d = "0" + d;
            }
            //llevar resultado al visor.
            str = ho + ":" + mn + ":" + sg + "." + cs;

            _this.cronometro.setTime(str)
        }

    }

    function empezar() {
        emp=new Date(); //fecha inicial (en el momento de pulsar)
        _this.elcrono = setInterval(tiempo,10); //poner en marcha el temporizador.
    }


    //if para saber si reinicio o no el html y usar setTime
    this.smlistadoT = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm, indiceFila, record){

                if (_this.smlistadoT.hasSelection()){
                    _this.guardarregistros.enable()
                    Ext.Ajax.request({
                        url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/registrobytarea',
                        params: {
                            idtarea:_this.smlistadoT.getSelected().data.idelemento
                        },
                        callback: function(options, success, response) {
                            dt = Ext.decode(response.responseText);
                            _this.cronometro.updateHtml(dt.promedios[0].optimista,dt.promedios[0].pesimista,dt.promedios[0].medio,dt.xn)
                            _this.stCalculo.loadData(dt.registros)
                            // _this.gdCalculo.setTitle("Dts: "+_this.smlistadoT.getSelected().data.denelemento)
                            document.getElementById("btIniciarCrn").disabled = false
                            document.getElementById("btSaltarCrn").disabled = false
                            document.getElementById("btSaltarCrn").className  = "buttonSaltarCalc"
                            document.getElementById("btIniciarCrn").className  = "buttonIniciarCalc"

                            if(_this.next){
                                _this.next = false
                                document.cronoI(document.getElementById("btIniciarCrn"))
                            }

                        }
                    });


                }

            },
            rowdeselect: function(sm, indiceFila, record) {
                _this.cronometro.resetHtml();
                _this.guardarregistros.enable()
                _this.stCalculo.removeAll()
            }
        }
    });


    this.stTareas = new Ext.data.SimpleStore({
        fields: [
            {name: 'denelemento'},
            {name: 'duracionestimada'},
            {name: 'idelemento'}

        ]
    });

    this.listadoT = new Ext.grid.GridPanel({
       // title:'Tareas: ',
        sm: _this.smlistadoT,
        frame: true,
        iconCls: 'icon-grid',
        store:_this.stTareas,
        autoExpandColumn:'tareaspan',
        columns:[_this.smlistadoT,{
            header: "idelemento",
            dataIndex: 'idelemento',
            hidden:true
        },{
            header: "Tarea",
            id:"tareaspan",
            sortable: true,
            dataIndex: 'denelemento',
            tooltip: 'Tarea'
        },{
            header: "T.Estimado",
            sortable: true,
            dataIndex: 'duracionestimada',
            tooltip: 'Tiempo Estimado',
            renderer: function(value){
                return MostrarDuracionEstimada(value,true,true);
            }
        }],
        region: 'west',
        width: "70%",
        height:"100%"
    })

    this.stCalculo = new Ext.data.SimpleStore({
        fields: ['idcalc','tiempo','fecha','usuario']
    });


    this.cmCalculo = [_this.smCalculo,
        {
            header: "Tiempo",
            flex: 1,
            sortable: true,
            dataIndex: 'tiempo',
            tooltip: 'Tiempo'
        },{
            header: "Fecha",
            flex: 0.5,
            sortable: true,
            dataIndex: 'fecha',
            tooltip: 'Fecha'
        },{
            header: "Usuario",
            sortable: true,
            flex: 0.5,
            dataIndex: 'usuario',
            tooltip: 'Usuario'
        }];

    this.guardar = function(){
        var arrayregistro = []
        _this.stCalculo.each(function(t){
            if(!t.data.idcalc)
            arrayregistro.push(t.data.tiempo)
        })


        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/guardarregistro',
            params: {
                arrayregistro: Ext.encode(arrayregistro),
                idtarea:_this.smlistadoT.getSelected().data.idelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(1, "Los registro han sido guardados satisfactoriamente.");
            }
        });
    }

    this.guardarregistros = new Ext.Button({
        iconCls:'guardar',
        disabled:true,
        tooltip: 'Guardar Registros',
        handler:function(){
            _this.guardar()
        }
    })

    this.modificarTES = new Ext.Button({
        iconCls:'modificar',
        disabled:true,
        tooltip: 'Modificar tiempo de estimacion',
        handler:function(){

            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/modificarest',
                params: {
                    tiempo: _this.smCalculo.getSelected().data.tiempo,
                    idtarea:_this.smlistadoT.getSelected().data.idelemento
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    _this.smlistadoT.getSelected().set("duracionestimada",responseData.newtiempo.duracionestimada)
                    mostrarMensaje(1, "El tiempo estimado ha sido modificado satisfactoriamente.");
                }
            });
        }
    })

    this.eliminarregistro = new Ext.Button({
        iconCls:'eliminar',
        disabled:true,
        tooltip: 'Eliminar Registros',
        handler:function() {

            _this.smCalculo.getSelections().forEach(function(v){
                _this.stCalculo.remove(v)
            })
        }
    })

    this.gdCalculo = new Ext.grid.GridPanel({
        title:'Registro de Tiempos',
        id: 'gdCalculo',
        width: "30%",
        height:"100%",
        region: 'center',

        frame: true,
        iconCls: 'icon-grid',
        tbar:[/*_this.guardarregistros,*/_this.modificarTES/*_this.eliminarregistro*/],
        //master_column_id: 'expandir',
        // plugins: _this.filtrosCalculo,
        //autoExpandColumn: 'expandir',
        store: _this.stCalculo,
        sm: _this.smCalculo,
        columns: _this.cmCalculo,
        // bbar: _this.paginadoCalculo,
        loadMask: {
            msg: 'Cargando Registros...'
        },
        listeners: {
        }
    });



    this.adicionarejercicio = new Ext.Button({
        iconCls:'adicionar',
        tooltip: 'Adicionar Ejercicio',
        handler:function(){
            var fecha = new Date();
            var str = new Ext.data.Record({
                "idejercicio":false,
                'denominacion':"",
                'fecha':fecha.format('d/m/Y'),
                'hora':fecha.format('h:s')
            });

            _this.stEjercicio.add(str)
            _this.gdEjercicio.startEditing(_this.stEjercicio.getCount()-1,1);

            }
    })

    this.eliminarjercicio = new Ext.Button({
        iconCls:'eliminar',
        disabled:true,
        tooltip: 'Eliminar Ejercicio',
        handler:function(){

            _this.smEjercicio.getSelections().forEach(function(v){
                _this.stEjercicio.remove(v)
            })
            _this.PanelCT.setDisabled(true)


        }
    })

    this.smEjercicio = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        listeners: {
            selectionchange: function(sm) {
                _this.eliminarjercicio.setDisabled(!sm.getSelections().length)

            },
            rowselect: function(sm, indiceFila, record){
                if(record.get('denominacion'))
                _this.PanelCT.setDisabled(false)
               if(record.get('idejercicio'))
                _this.stResultado.load({
                    params: {
                    idejercicio:sm.getSelected().data.idejercicio,
                    action:"leer"
                }
                  })
            },
            rowdeselect: function(sm, indiceFila, record) {
                _this.cronometro.setTime('0:00:00.00')
                _this.PanelCT.setDisabled(true)
                _this.stResultado.removeAll()
                _this.cronometro.resetHtml()
                _this.smlistadoT.clearSelections()

            }
        }
    });

    this.crudEjercicio = function(rec,eliminar){

        var action = "adicionar"
        var msg = "El ejercicio ha sido adicionado satisfactoriamente."
        if(rec.get('idejercicio')){
            msg = "El ejercicio ha sido modificado satisfactoriamente."
            action = "modificar"
        }
        if(eliminar){
            msg = "El ejercicio ha sido eliminado satisfactoriamente."
            action = "eliminar"
            _this.stResultado.removeAll()
        }


        if(rec.get('denominacion'))
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/guardarejercicio',
                params: {
                    proyectopadre:opcionesConfig.proyectoSelect.idelemento,
                    data:Ext.util.JSON.encode(rec.data),
                    action:action
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(1, msg);
                    _this.stEjercicio.reload()
                }
            });


    }

    this.stEjercicio = new Ext.data.Store({
        fields: ['idejercicio','denominacion','fecha','hora','idproyecto'],
        url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/ejerciciosbyproy',
        reader: new Ext.data.JsonReader({
            id: 'idejercicio',
            totalProperty: "total",
            root: "ejercicios"
        }, [{
            name: 'idejercicio'
        }, {
            name: 'denominacion'
        },{
            name: 'fecha'
        },{
            name: 'hora'
        },{
            name: 'idproyecto'
        }]),
        baseParams:{
           // proyectopadre:opcionesConfig.proyectoSelect.idelemento
        },
        listeners:{
            'remove':function(st,rec,num){
                _this.crudEjercicio(rec,true)
            },
            'update':function(est,rec,oper){
                _this.crudEjercicio(rec,false)
            }
        }
    });



    this.gdEjercicio = new Ext.grid.EditorGridPanel({
        title:"Ejercicios",
        width: "100%",
        height:200,
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        tbar:[_this.adicionarejercicio ,_this.eliminarjercicio],
        autoExpandColumn:'ejeospan',
        store: _this.stEjercicio,
        sm: _this.smEjercicio,
        columns: [ _this.smEjercicio,{
            header: "Denominacion",
            sortable: true,
            dataIndex: 'denominacion',
            editor: new Ext.form.TextField({
                allowBlank: false,
                listeners:{
                    'change' : function( field,newValue,oldValue ){


                    }
        }

            }),
            id:'ejeospan',
            tooltip: 'Denominacion'
        },{
            header: "Fecha Inicio",
            sortable: true,
            dataIndex: 'fecha',
            tooltip: 'Fecha Inicio'
        },{
            header: "Hora",
            sortable: true,
            dataIndex: 'hora',
            tooltip: 'Hora'
        }],
        // bbar: _this.paginadoCalculo,
        loadMask: {
            msg: 'Cargando Registros...'
        },
        listeners:{

        }

    });


    this.crudResultado = function(rec,eliminar){
        var action = "adicionar"
        var msg = "El resultado ha sido adicionado satisfactoriamente."
     /*   if(rec.get('idcalc')){
            msg = "El resultado ha sido modificado satisfactoriamente."
            action = "modificar"
        }*/
        if(eliminar){
            msg = "El resultado ha sido eliminado satisfactoriamente."
            action = "eliminar"
        }

            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/guardarresultados',
                params: {
                    idejercicio:_this.smEjercicio.getSelected().data.idejercicio,
                    action:action,
                    data:Ext.util.JSON.encode(rec.data)
                },
                callback: function(options, success, response) {
                    var res = Ext.decode(response.responseText);
                    mostrarMensaje(1, msg);
                    _this.stResultado.reload()

                }
            });
    }
    this.stResultado = new Ext.data.Store({
        autoLoad:false,
        url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/guardarresultados',
        reader: new Ext.data.JsonReader({
            id: 'idcalc',
            totalProperty: "total",
            root: "resultados"
        }, [{
            name: 'idcalc'
        },{
            name: 'idtarea'
        },{
            name: 'tiempo'
        },{
            name: 'fecha'
        },{
            name: 'denominacion'
        }]),
        listeners:{
            'remove':function(st,rec,num){
                _this.crudResultado(rec,true)
            },
            'update':function(est,rec,oper){
                _this.crudResultado(rec,false)
            }
        }

    });




    this.eliminarresultado = new Ext.Button({
        iconCls:'eliminar',
        disabled:true,
        tooltip: 'Eliminar Resultado',
        handler:function(){
                 _this.smResultado.getSelections().forEach(function(v){
                _this.stResultado.remove(v)
            })

        }
    })

    this.smResultado = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        listeners: {
            selectionchange: function(sm) {
                _this.eliminarresultado.setDisabled(!sm.getSelections().length)

            }
        }
    });

    this.gdResultado = new Ext.grid.GridPanel({
        title:"Resultado",
        width: "100%",
        height:200,
        region: 'south',
        frame: true,
        iconCls: 'icon-grid',
        tbar:[_this.eliminarresultado],
        autoExpandColumn:'tareapan',
        store: _this.stResultado,
         sm: _this.smResultado,
        columns: [_this.smResultado,{
            header: "Tarea",
            sortable: true,
            dataIndex: 'denominacion',
            id:'tareapan',
            tooltip: 'Tarea'
        },{
            header: "Tiempo",
            sortable: true,
            dataIndex: 'tiempo',
            tooltip: 'Tiempo'
        }],
        // bbar: _this.paginadoCalculo,
        loadMask: {
            msg: 'Cargando Registros...'
        }

    });

    this.PanelET = new Ext.Panel({
        layout: 'border',
        region:'center',
        border:false,
        height:210,
        items: [_this.gdEjercicio,_this.gdResultado]

    });

    this.PanelCT = new Ext.Panel({
        layout: 'border',
        disabled:true,
        title:"Tareas :",//+opcionesConfig.proyectoSelect.denominacion,
        titleCollapse:true,
        collapsed: true,
        collapsible: true,
       // border:false,
        height:290,
        width:680,
        region:'east',
        items: [_this.listadoT,_this.gdCalculo,_this.cronometro]

    });


    this.WinPrincipalEjer = new Ext.Window({
        title:"Gestionar Ejercicios",
        layout: 'border',
        frame:true,
        constrain:true,
        graggable: false,
        modal: true,
        width: 998,
        height: 450,
        listeners:{
            close:function(){
                clearInterval(_this.elcrono);
            }
        },
        items:[_this.PanelET,_this.PanelCT]

    });

    this.cargarProyecto = function(datos){
        _this.stEjercicio.load()
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/getAllTareasByProyecto',
            params: {
                idproyecto: Ext.encode(datos.idelemento)
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.stTareas.removeAll()
                responseData.tareas.forEach(function(v){
                    var str = new Ext.data.Record(v);
                    _this.stTareas.add(str)
                })
                _this.user = responseData.user



            }
        });
    }

    this.InicializarEjercicio = function(){
        _this.WinPrincipalEjer.show();
        //_this.cargarProyecto(opcionesConfig.proyectoSelect)
        _this.BarraProgreso.show('Cargando registros');
        _this.BarraProgreso.hide();
    };








}
