Ext.define('Traces.controller.Grafica', {
    extend: 'Ext.app.Controller',

    requires: ['Ext.picker.Date'],

    views: [
        'graficasTrazas.ReporteTrazas',
        'graficasTrazas.pie.Subsistemas',
        'VentanaTiempoReal'
    ],

    refs: [{
        ref: 'panelGrafica',
        selector: 'panelGrafica'
    }],

    init: function () {
        var _this = this;

        _this.tiempoReal = null;

        _this.control({
            'panelGrafica': {
                render: _this.onRenderPanel
            },

            'panelGrafica combobox[name=combo_TipoGrafica]': {
                select: _this.charTypeSelect
            },

            'panelGrafica button[action = buscarTrazas]': {
                click: _this.buscarTrazas
            },

            'panelGrafica button[action = LimpiarFiltro]': {
                click: _this.limpiarFiltro
            },

            'panelGrafica datefield[name=fecha_hasta]': {
                change: _this.cambiarMaxValue
            },

            'panelGrafica datefield[name=fecha_desde]': {
                change: _this.cambiarMinValue
            },

            'panelGrafica checkbox[name=tiempoReal]': {
                change: _this.activarDesactivarTimereal
            },

            'ventanaTiempoReal': {
                render: _this.renderVentanaTiempoReal
            },

            'ventanaTiempoReal button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaTiempoReal button[action=agregarTiempoRecarga]': {
                click: _this.agregarTiempoRecarga
            }


        });
    },

    onRenderPanel: function (panelGrafica) {

        Ext.override(Ext.picker.Date, {
            ariaTitle: '',
            dayNames : perfil.etiquetas.date.dayNames,
            monthNames : perfil.etiquetas.date.monthNames,
            todayText : perfil.etiquetas.date.todayText,
            todayTip: "{0} " ,
            //dayTip: 'Probando a ver que poner',
            minText : perfil.etiquetas.date.minText,
            maxText : perfil.etiquetas.date.maxText,
            nextText : perfil.etiquetas.date.nextText,
            prevText : perfil.etiquetas.date.prevText,
            monthYearText : perfil.etiquetas.date.monthYearText

        });

        Ext.override(Ext.picker.Month, {
            okText : perfil.etiquetas.date.okText,
            cancelText : perfil.etiquetas.date.cancelText

        });

        var _this = this;

        Ext.getCmp('fecha_desde').focus(true,200);
        this.actualizarTabGraficas();
        this.agregarEventoClick('pie');

        panelGrafica.keyMap = Ext.widget('keyMapGrafica');

        panelGrafica.keyMap.buscarTraza(this, panelGrafica);
        panelGrafica.keyMap.limpiarTraza(this, panelGrafica);
    },

    obtenerfiltro: function(){
        var params = [
            Ext.getCmp('fecha_desde'), Ext.getCmp('fecha_hasta')
        ];
        return params;
    },

    actualizarTabGraficas: function(){
        var filtro = this.obtenerfiltro();
        this.actualizarPanelGraficas(filtro);
    },

    actualizarPanelGraficas: function(filtro){
        this.actualizarChart(Ext.getCmp('trazasSubsistemas')/*, filtro*/);
        this.actualizarChart(Ext.getCmp('trazasFechas')/*, filtro*/);
        this.actualizarChart(Ext.getCmp('trazasUsuario')/*, filtro*/);
        this.actualizarChart(Ext.getCmp('trazasTipo')/*, filtro*/);
    },

    actualizarChart: function(componente/*, datos*/){
        //console.log(componente.items);
        this.actualizarGrafica(componente.items.items[0], /*datos,*/componente);
    },

    actualizarGrafica: function(el, /*data,*/ parentEl){
        var _this = this;
        var fechaDesde  = Ext.getCmp('fecha_desde').getValue();
        var fechaHasta = Ext.getCmp('fecha_hasta').getValue();

        if(this.isValidRangeDate(fechaDesde, fechaHasta)){
            if(el){
                //console.log(el);
                //console.log(parentEl);
                el.getChartStore().removeAll();
                el.getChartStore().load({
                    params: {
                        //filters: JSON.stringify(data),
                        grafica: el.id,
                        fecha_desde: Ext.getCmp('fecha_desde').getRawValue(),
                        fecha_hasta: Ext.getCmp('fecha_hasta').getRawValue()
                    },

                    callback: function(records, operation, success) {

                        if(!records.length || records.length < 1){
                            el.hide();
                            //parentEl.items.items[1].show();
                            Msg.util.msg(1, perfil.etiquetas.controllerGrafica.msgInfo, perfil.etiquetas.controllerGrafica.msgText1);

                        }
                    }
                });
            }
        }
        else{
            Msg.util.msg(1, 'Información', 'La fecha Hasta: tiene que ser mayor o igual que '+ fechaDesde);
        }
    },

    isValidRangeDate: function(datein, dateout){
        return (new Date(dateout)) >= (new Date(datein));
    },

    charTypeSelect: function (combo, records, eOpts) {

        var fechaDesde  = Ext.getCmp('fecha_desde').getValue();
        var fechaHasta = Ext.getCmp('fecha_hasta').getValue();

        if(this.isValidRangeDate(fechaDesde, fechaHasta)){
            var type = 'graficasTrazas.' + combo.getValue() + '.';
            var graf = ['Subsistemas', 'Usuario', 'Fechas', 'Tipo'];
            for (var i in graf) {
                var component = Ext.getCmp('trazas' + graf[i]);
                if (component) {
                    //component.remove(0, true);
                    //component.remove(1, true);
                    component.removeAll(true);
                    component.add({xtype: type + graf[i]});
                    //component.add({xtype: 'panelMsg'});
                    this.actualizarChart(component);
                }
            }
            this.agregarEventoClick(combo.getValue());
        }
        else{
            Msg.util.msg(1, perfil.etiquetas.controllerGrafica.msgInfo, perfil.etiquetas.controllerGrafica.msgText2 + fechaDesde);
        }

    },

    agregarEventoClick: function(tipoGrafica){
        var _this = this;
        //console.log( Ext.getCmp('subsistema'));
        if(tipoGrafica == 'pie'){
            Ext.getCmp('subsistema').on('itemmouseup', function(){
                _this.onclickPieChart(Ext.getCmp('subsistema'));
            });
            Ext.getCmp('subsistema').series.each(function(){

                this.listeners = {
                    'itemmouseup': function (item) {
                        Ext.getCmp('subsistema').fireEvent('itemmouseup', item, Ext.getCmp('subsistema').id);
                    }
                };
            });

            Ext.getCmp('fecha').on('itemmouseup', function(){
                _this.onclickPieChart(Ext.getCmp('fecha'));
            });
            Ext.getCmp('fecha').series.each(function(){

                this.listeners = {
                    'itemmouseup': function (item) {
                        Ext.getCmp('fecha').fireEvent('itemmouseup', item, Ext.getCmp('fecha').id);
                    }
                };
            });

            Ext.getCmp('tipo').on('itemmouseup', function(){
                _this.onclickPieChart(Ext.getCmp('tipo'));
            });
            Ext.getCmp('tipo').series.each(function(){

                this.listeners = {
                    'itemmouseup': function (item) {
                        Ext.getCmp('tipo').fireEvent('itemmouseup', item, Ext.getCmp('tipo').id);
                    }
                };
            });

            Ext.getCmp('usuario').on('itemmouseup', function(){
                _this.onclickPieChart(Ext.getCmp('usuario'));
            });
            Ext.getCmp('usuario').series.each(function(){

                this.listeners = {
                    'itemmouseup': function (item) {
                        Ext.getCmp('usuario').fireEvent('itemmouseup', item, Ext.getCmp('usuario').id);
                    }
                };
            });
        }
        else{

            Ext.getCmp('subsistema').addEvents({click: true});
            Ext.getCmp('subsistema').addListener('click', function(){
                _this.onclickPieChart(Ext.getCmp('subsistema'));
            });

            Ext.getCmp('fecha').addEvents({click: true});
            Ext.getCmp('fecha').addListener('click', function(){
                _this.onclickPieChart(Ext.getCmp('fecha'));
            });

            Ext.getCmp('tipo').addEvents({click: true});
            Ext.getCmp('tipo').addListener('click', function(){
                _this.onclickPieChart(Ext.getCmp('tipo'));
            });

            Ext.getCmp('usuario').addEvents({click: true});
            Ext.getCmp('usuario').addListener('click', function(){
                _this.onclickPieChart(Ext.getCmp('usuario'));
            });
        }

        //Ext.getCmp('subsistema').addEvents({itemdoubleclick: true});
        //Ext.getCmp('subsistema').addListener('itemmouseup', function(){
        //    _this.onclickPieChart(Ext.getCmp('subsistema'));
        //});
        //Ext.getCmp('subsistema').on('itemdoubleclick', function(){
        //    _this.onclickPieChart(Ext.getCmp('subsistema'));
        //});
        //
        //Ext.getCmp('fecha').addEvents({click: true});
        //Ext.getCmp('fecha').addListener('click', function(){
        //    _this.onclickPieChart(Ext.getCmp('fecha'));
        //});
        //
        //Ext.getCmp('tipo').addEvents({click: true});
        //Ext.getCmp('tipo').addListener('click', function(){
        //    _this.onclickPieChart(Ext.getCmp('tipo'));
        //});
        //
        //Ext.getCmp('usuario').addEvents({click: true});
        //Ext.getCmp('usuario').addListener('click', function(){
        //    _this.onclickPieChart(Ext.getCmp('usuario'));
        //});
    },

    buscarTrazas: function(){
        this.charTypeSelect(Ext.getCmp('combo_TipoGrafica'));
    },

    limpiarFiltro: function(){
        Ext.getCmp('fecha_desde').reset();
        Ext.getCmp('fecha_hasta').reset();
        Ext.getCmp('combo_TipoGrafica').select('pie');
        this.charTypeSelect(Ext.getCmp('combo_TipoGrafica'));
    },

    cambiarMaxValue: function(){
        Ext.getCmp('fecha_desde').setMaxValue(Ext.getCmp('fecha_hasta').getValue());
    },

    cambiarMinValue: function(){
        Ext.getCmp('fecha_hasta').setMinValue(Ext.getCmp('fecha_desde').getValue());
    },

    renderVentanaTiempoReal: function(ventanaTiempoReal){
        Ext.getCmp('tiempoRecarga').focus(false, 200);
        
        this.keyMap = Ext.widget('keyMapGrafica');
        this.keyMap.pressAltX(this, ventanaTiempoReal);
        this.keyMap.pressEnter(this, ventanaTiempoReal);

        Ext.getCmp('panelGrafica').keyMap.BuscarTrazas.setDisabled(true);
        Ext.getCmp('panelGrafica').keyMap.LimpiarTrazas.setDisabled(true);

    },

    closeWin:function (button) {
        Ext.getCmp('panelGrafica').keyMap.BuscarTrazas.setDisabled(false);
        Ext.getCmp('panelGrafica').keyMap.LimpiarTrazas.setDisabled(false);
        Ext.getCmp('tiempoRecarga').reset();//field
        button.up('window').close();
        Ext.getCmp('tiempoReal').reset();//checkbox


    },

    agregarTiempoRecarga: function(button){
        var _this = this;

        _this.tiempoReal = setInterval(function () {

                _this.actualizarTabGraficas();
            },

            parseInt(Ext.getCmp('tiempoRecarga').getValue()) * 1000
        );

        Ext.getCmp('panelGrafica').keyMap.BuscarTrazas.setDisabled(false);
        Ext.getCmp('panelGrafica').keyMap.LimpiarTrazas.setDisabled(false);
        button.up('window').close();
    },

    activarDesactivarTimereal: function(componentCheckboxField, newValue, oldValue, eOpts ){

        var _this = this;
        if (componentCheckboxField.checked == true) {
            var ventanaTiempoReal = Ext.widget('ventanaTiempoReal');
            ventanaTiempoReal.formularioTiempoReal.getForm().reset();
            ventanaTiempoReal.show();
            ventanaTiempoReal.center();
        }
        if (componentCheckboxField.checked == false) {
            if (_this.tiempoReal != null) {
                clearInterval(_this.tiempoReal);
                _this.tiempoReal = null;
            }
        }

    },

    onclickPieChart: function(grafica){

        var Detalles = Ext.getCmp('tabPanel').items.items[1];
        var text = ultimoTips;
        var fechaDesde  = Ext.getCmp('fecha_desde').getValue();
        var fechaHasta = Ext.getCmp('fecha_hasta').getValue();

        if(ultimoTips && (ultimaGraficaClickeada == grafica.id)) {
            switch (grafica.id) {
                case 'subsistema' :
                    //console.log('entro a subsistemas');
                    Detalles.combotipo.clearValue();
                    Detalles.combousuario.clearValue();

                    Detalles.combosubsistema.setValue(text);
                    break;
                case 'usuario' :

                    //console.log('entro a usuario');
                    Detalles.combosubsistema.setValue('');
                    Detalles.combotipo.clearValue();
                    //
                    var recordpieUser = Detalles.combousuario.findRecord('usuario', text);
                    if (recordpieUser) {
                        var iduser = recordpieUser.get('idusuario');
                        Detalles.combousuario.setValue([iduser]);

                    }

                    break;
                case 'tipo' :

                    //console.log('entro a tipo');
                    Detalles.combosubsistema.setValue('');
                    Detalles.combousuario.clearValue();
                    if (text == 'Dato')
                        text = 'Datos';
                    if(text == 'Fallo de autenticación')
                        text = 'Fallo de Autenticación';
                    if(text == 'Fallo de autorización')
                        text = 'Fallo Autorización';
                    var recordpieTraza = Detalles.combotipo.findRecord('tipotraza', text);
                    if(recordpieTraza){
                        var idtipotraza = recordpieTraza.get('idtipotraza');
                        var texttraza = recordpieTraza.get('tipotraza');
                        Detalles.combotipo.setValue([idtipotraza]);
                    }


                    break;
                case 'fecha' :
                    //console.log('entro a fecha');
                    Detalles.combosubsistema.setValue('');
                    Detalles.combotipo.clearValue();
                    Detalles.combousuario.clearValue();
                    //
                    Detalles.fechaInicio.setValue(text);
                    Detalles.fechaFin.setValue(text);
                    break;
            }

            if (grafica.id === 'subsistema' || grafica.id === 'usuario' || grafica.id === 'tipo') {
                Detalles.fechaInicio.setValue(fechaDesde);
                Detalles.fechaFin.setValue(fechaHasta);
            }

            Ext.getCmp('tabPanel').setActiveTab(1);
            Detalles.btnBuscar.fireEvent('click', Detalles.btnBuscar);
        }
    }

});
