/**
 * Componente para evaluar la planilla
 *
 * @author Ing. Juan Manuel Elias
 * @package PVD
 * @subpackage Evaluaciones
 * @copyright XETID-ERP Cuba 13
 */
Ext.PVD.Evaluaciones.ComboBoxEscala = Ext.extend(Ext.form.ComboBox, {
    valueField: 'valor',
    hiddenName: 'valor',
    disabled: true,
    editable: true,
    allowBlank: false,
    displayField: 'denom',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText: 'Seleccione...',
    fieldLabel: 'Evaluaci&oacute;n',
    selectOnFocus: true,
    tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
    initComponent: function() {
        var self = this;

        self.store = new Ext.data.Store({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarEscala',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'valor'},
                {name: 'denom'}
            ])
        });

        Ext.PVD.Evaluaciones.ComboBoxEscala.superclass.initComponent.call(this);
    }
});
 
tplDatosPersona = new Ext.XTemplate(
    '<table width="100%" ><tr>',
    '<td width="35%" class="row-detail">No. identidad:</td>',
    '<td width="35%" class="row-detail">Nombre:</td>',
    '<td width="30%" class="row-detail">Segundo nombre:</td>',
    '</tr><tr>',
    '<td width="35%" class="row-title">{numid}</td>',
    '<td width="35%" class="row-title">{nombre}</td>',
    '<td width="30%" class="row-title">{snombre}</td>',
    '</tr><tr>',
    '<td width="35%" class="row-detail">Primer apellido:</td>',
    '<td width="35%" class="row-detail">Segundo apellido:</td>',
    '<td width="30%" class="row-detail">Categor&iacute;a:</td>',
    '</tr><tr>',
    '<td width="35%" class="row-title">{papel}</td>',
    '<td width="35%" class="row-title">{sapel}</td>',
    '<td width="30%" class="row-title">{categoria}</td>',
    '</tr><tr>',
    '<td width="35%" class="row-detail">Sexo:</td>',
    '<td width="35%" class="row-detail" colspan=2>Cargo:</td>',
    '</tr><tr>',
    '<td width="35%" class="row-title">{sexo}</td>',
    '<td width="35%" class="row-title" colspan=2>{cargo}</td>',
    '</tr></table>'
);
tplDatosPersona.compile();

tplDatosEvaluado = new Ext.XTemplate(
    '<table width="100%" ><tr>',
    '<td width="40%" class="row-detail">Nombre:</td>',
    '</tr><tr>',
    '<td width="40%" class="row-title">{nombre}</td>',
    '</tr><tr>',
    '<td width="90%" class="row-detail">Nombre completo:</td>',
    '</tr><tr>',
    '<td width="90%" class="row-title">{nombrecompleto}</td>',
    '</tr>',
    '</table>'
);
tplDatosEvaluado.compile();

tplFoto = new Ext.XTemplate(
    '<div class="details">', '<tpl for=".">',
    '<center><img src="{dirfoto}" height=120 width=120 style="cursor:pointer;border:1px solid 000" /></center><div class="details-info">',
    '</tpl>', '</div>'
);
tplFoto.compile();

Ext.ns('Ext.Evaluaciones');
Ext.Evaluaciones.EvalTemplate = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var self = this;
        var winEvShow = 0;
        var selectEv = 0;
        var arrayvaloresTemp = new Array();
        var arrayindicadoresTemp = new Array();
        var padreindicadoresTemp = new Array();
        var bol = 0;

        var valor = new Array();

        this.btnGuardar = new Ext.Button({
            disabled: true,
            hidden: !self.editable,
            iconCls: 'guardar',
            text: '<u>G</u>uardar',
            tooltip: 'Guardar datos <b>(Alt+G)</b>',
            handler: function () {
                guardarValorIndicador(false);
            }
        });

        this.btnGuardarCalcular = new Ext.Button({
            disabled: true,
            hidden: !self.editable,
            iconCls: 'calcular',
            text: 'Guardar y calcular',
            tooltip: 'Guarda el valor del indicador y calcula el resultado de la evaluaci&oacute;n',
            handler: function () {
                guardarValorIndicador(true);
            }
        });

        this.btnLimpiar = new Ext.Button({
            disabled: true,
            hidden: !self.editable,
            iconCls: 'limpiar',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar campos <b>(Alt+L)</b>',
            handler: function () {
                self.fpEval.getForm().reset();
            }
        });        

        var taAyuda = new Ext.form.TextArea({
            fieldLabel: 'Ayuda',
            readOnly: true,
            anchor: '100%',
            height: 80
        });

        var taComplementoTextual = new Ext.form.TextArea({
            fieldLabel: 'Complemento textual',
            disabled: true,
            anchor: '100%',
           /* maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,*/
            height: 80
        });

        /***********************************PANEL DE LA PLANILLA CON LOS INDICADORES***************************************************************/
        var btnExpandAllNodes = new Ext.Button({
            tooltip: 'Expandir todos los nodos',
            iconCls: 'expandir',
            handler: function () {
                self.tpTemplate.expandAll();
            }
        });

        var btnColapseAllNodes = new Ext.Button({
            tooltip: 'Contraer todos los nodos',
            iconCls: 'contraer',
            handler: function () {
                self.tpTemplate.collapseAll();
            }
        });

        var btnCargarEvalAnt = new Ext.Button({
            text: 'Cargar evaluaci&oacute;n',
            hidden: (self.editable == false || self.nocargar == true)?true:false,
            tooltip: 'Cargar evaluaci&oacute;n anterior',
            iconCls: 'cargardocumento',
            handler: function () {
                self.winCargarEvalPer.show();
                self.gpPeriodos.getSelectionModel().clearSelections();
            }
        });

        var btnImportarEvalExcel = new Ext.Button({
            text: 'Importar',
            hidden: !self.editable,
            tooltip: 'Importar evaluaci&oacute;n <b>(Ctrl+Alt+I)<b/>',
            iconCls: 'importar',
            handler: function () {
                importarFileUploadField(self.persona.get('idpersonaevaluacion'), self.persona.get('numid'));
            }
        });

        this.btnGuardarIndEval = new Ext.Button({
            disabled: true,
            hidden: !self.editable,
            iconCls: 'guardar',
            text: '<u>G</u>uardar',
            tooltip: 'Guardar evaluaci&oacute;n <b>(Alt+G)</b>',
            handler: function () {
                guardarValorIndEvaluacion(self.persona.get('idpersonaevaluacion'), self.persona.get('idmodelo'), '', arrayvaloresTemp,
                    arrayindicadoresTemp, padreindicadoresTemp,1);
                arrayindicadoresTemp.length = 0;
                padreindicadoresTemp.length = 0;
                arrayvaloresTemp.length = 0;
                self.btnGuardarIndEval.focus();
                self.btnGuardarIndEval.disable();
            }
        });

        var tlIndicadores = new Ext.tree.TreeLoader({
            dataUrl: self.urlTemplate,
            baseParams: {
                idnodo: -1,
                idplanilla:self.baseParams.idplanilla,
                idpersonaevaluacion:self.baseParams.idpersonaevaluacion,
                idrecurso:self.baseParams.idrecurso
            },
            listeners: {
                beforeload: function (cargadorIndicadores, node, response) {
                    if(cargadorIndicadores.baseParams.idplanilla!=null){
                        Ext.getBody().mask('Cargando indicadores...');
                        if (node.id == 'raizPlanilla') {
                            cargadorIndicadores.baseParams.idnodo = node.id;
                            cargadorIndicadores.baseParams.idpersona = self.idpersona;
                        } else {
                            cargadorIndicadores.baseParams.idpersona = self.idpersona;
                            cargadorIndicadores.baseParams.idnodo = node.id;
                        }
                    }


                },
                load: function (cargadorIndicadores, node, response) {
                  if(cargadorIndicadores.baseParams.idplanilla!=null){
                      Ext.getBody().unmask();
                      self.tpTemplate.focus();
                  }else
                  {
                      mostrarMensaje(3, 'La persona seleccionada no tiene asignada una planilla evaluativa.');
                  }
                }
            }
        });

        this.tpTemplate = new Ext.tree.TreePanel({
            region: 'west',
            useArrows:true,
            animate: true,
            containerScroll: true,
            autoScroll: true,
            rootVisible: false,
            collapsible: true,
            split: true,
            minWidth: 100,
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            width: '35%',
            layout: 'fit',
            loader: tlIndicadores,
            tbar: [btnExpandAllNodes, btnColapseAllNodes, '-', btnImportarEvalExcel, btnCargarEvalAnt, '->', this.btnGuardarIndEval],
            root: {
                expanded: true,
                text: 'Raiz',
                id: 'raizPlanilla'
            }
        });

        self.stPeriodos = new Ext.data.GroupingStore({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getPeriodosConcluidos',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{name: 'idperiodoproceso'}, {name: 'periodo'}, {name: 'fdesde'}, {name: 'fhasta'},
                {name: 'proceso'}, {name: 'idpersonaevaluacion'}
            ]),
            sortInfo: {field: 'proceso', direction: "DESC"},
            groupField : 'proceso',
            listeners: {
                beforeload: function (st, options) {
                    //st.baseParams.idescala = self.idescala;
                }

            }
        });
        if (self.nocargar == false) {
            self.stPeriodos.load({params: {
                idplanilla: self.baseParams.idplanilla,
                idmodelo: self.baseParams.idmodelo,
                idpersona: self.persona.get('idpersona')
            }
            });
        }

        this.smPer = new Ext.grid.CheckboxSelectionModel({
            singleSelect : true
        });

        this.gpPeriodos = new Ext.grid.GridPanel({
            id: 'gpPeriodosev',
            title: 'Listado de periodos por procesos evaluativos',
            store: this.stPeriodos,
            loadMask: true,
            sm: this.smPer,
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Periodos" : "Periodo"]})'
            }),
            columns: [
                {header: '', width:300, hidden: true, dataIndex: 'proceso'},
                {header: 'Periodo evaluativo', width:200, dataIndex: 'periodo'},
                {header: 'Fecha inicio', width:100, dataIndex: 'fdesde'},
                {header: 'Fecha fin', width:100, dataIndex: 'fhasta'}
            ]
        });

        this.gpPeriodos.getSelectionModel().on('rowselect', function (s){
            self.btnAceptarPer.enable();
        });

        this.btnCancelarPer = new Ext.Button({
            nextTab: 'gpPeriodosev',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
            text: 'Cancelar',
            handler: function ()
            {
                self.winCargarEvalPer.hide();
            }.createDelegate(this)
        });

        this.btnAceptarPer = new Ext.Button({
            id: 'btnAceptarPer',
            nextTab: 'tcbEntidadPadre',
            disabled: true,
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            text: 'Aceptar',
            listeners: {
                'enable': function() {
                    self.btnCancelarPer.nextTab = 'btnAceptarPer';
                },
                'disable': function() {
                    self.btnCancelarPer.nextTab = 'gpPeriodosev';
                }
            },
            handler: function () {
                cargarEvaluacion();
            }.createDelegate(this)
        });

        this.winCargarEvalPer = new Ext.Window({
            title: 'Cargar evaluaci&oacute;n',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            width: 500,
            height: 300,
            items: [this.gpPeriodos],
            buttons: [this.btnCancelarPer, this.btnAceptarPer],
            keys: [{
                key: 'x',
                alt: true,
                fn: function () {
                    if (!self.btnCancelarPer.disabled) {
                        self.btnCancelarPer.handler();
                    }
                }
            },
                {
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptarPer.disabled) {
                            self.btnAceptarPer.handler();
                        }
                    }
                }]
        });
        /*****************************************************************************************************************************************************/

        var stEscala1 = new Ext.data.Store({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/cargarEscala',
            reader: new Ext.data.JsonReader({root: 'datos'},
                [{name: 'valor'},{name: 'denom'}])
        });

        this.tpTemplate.on('contextmenu', function (node, e){
            if(node.isLeaf() && node.attributes.idescala){

                var cbescala1 = new Ext.form.ComboBox({
                    valueField: 'valor',
                    hiddenName: 'valor',
                    store: stEscala1,
                    editable: true,
                    displayField: 'denom',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    emptyText: 'Seleccione...',
                    fieldLabel: 'Evaluaci&oacute;n',
                    selectOnFocus:true,
                    listeners: {
                        select: function (v) {
                            valor = new Array();
                            self.btnGuardarIndEval.enable();
                            //arrayvaloresTemp.push(v.getValue());
                            valor.push(v.getValue());

                           /* var ind = {
                                idindicadorevaluacion: node.attributes.idindicadorevaluacion,
                                idpadre: node.attributes.idpadre
                            };

                            arrayindicadoresTemp.push(ind);
                            var indpadre = {
                                idindicadorevaluacion: node.parentNode.attributes.idindicadorevaluacion,
                                idexpresionmatematica: node.attributes.idexpresionmatematica,
                                idpadre: node.attributes.idpadre
                            };
                            padreindicadoresTemp.push(indpadre);*/
                            node.setText(node.attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>'+v.getRawValue()+'</div>');
                            self.baseParams.bol = 1;
                            winEv.close();
                        }
                    }
                });

                var winEv = new Ext.Window({
                    title: 'Evaluar indicador',
                    closeAction: 'hide',
                    constrain: true,
                    resizable: false,
                    width: 200,
                    height: 54,
                    x: e.getXY()[0],
                    y: e.getXY()[1],
                    closable: true,
                    layout: 'fit',
                    modal: true,
                    items: [cbescala1],
                    listeners: {
                        show: function () {
                            winEvShow = 1;
                            cbescala1.focus();
                        },
                        close: function () {
                            self.tpTemplate.focus();

                        }
                    }
                });
                winEv.show();

                if (winEvShow == 0 || stEscala1.baseParams.idescala != node.attributes.idescala) {
                    stEscala1.baseParams.idescala = node.attributes.idescala;
                    stEscala1.load({ callback: function(r, options, success) {
                        cbescala1.expand();
                        cbescala1.setValue(node.attributes.valorMostrar);
                    }});
                } else {
                    cbescala1.expand();
                    cbescala1.setValue(node.attributes.valorMostrar);
                }

            }
        });

        this.tpTemplate.on('checkchange',function (node,check) {
            taComplementoTextual.reset();
            var nodoschecked = self.tpTemplate.getChecked();
            if (node.attributes.leaf == true && check == true) {
                if (nodoschecked.length == 1){
                    cbescala.store.load({params:{idescala:nodoschecked[0].attributes.idescala}});
                } else {
                    if (node.attributes.idescala!=nodoschecked[0].attributes.idescala) {
                        mostrarMensaje(6, 'El indicador que desea seleccionar posee una escala diferente.');
                        this.tpTemplate.getNodeById(node.id).getUI().toggleCheck(false);
                    }
                }
                if(node.attributes.ayuda){
                    taAyuda.setValue(node.attributes.ayuda);
                }
                if (node.attributes.complementotextual) {
                    taComplementoTextual.enable();
                    taComplementoTextual.setValue(node.attributes.valorComplementotextual);
                } else {
                    taComplementoTextual.disable();
                }
                if (node.attributes.idescala) {
                    cbescala.enable();
                    cbescala.setValue(node.attributes.valorMostrar);
                } else {
                    cbescala.disable();
                }
                if (this.editable) {
                    cbescala.enable();
                    this.btnGuardar.enable();
                    this.btnGuardarCalcular.enable();
                    this.btnLimpiar.enable();
                }
            } else if (nodoschecked.length == 0) {
                taComplementoTextual.disable();
                this.btnGuardar.disable();
                this.btnGuardarCalcular.disable();
                this.btnLimpiar.disable();
                cbescala.reset();
                cbescala.disable();
            }
        }, this);

        this.tpTemplate.on('click', function(n){
            if (n.isLeaf()) {
                if (!Ext.isEmpty(n)) {
                    var nodeUI = n.ui;
                    nodeUI.checked = true;
                    nodeUI.checkbox.checked = true;
                    nodeUI.checkbox.defaultChecked = true;
                    n.attributes.checked = true;
                    self.tpTemplate.fireEvent('checkchange', n, true);
                }
            }
        });

        cbescala = new Ext.PVD.Evaluaciones.ComboBoxEscala({
            idescala: self.idescala

        });

        if (!this.editable) {
            cbescala.hide();
            cbescala.hideLabel = true;
        }

        this.pFoto = new Ext.Panel({
            width: 120,
            height: 120,
            border: true,
            autoShow: true,
            region: 'center'
        });

        this.pDetails = new Ext.Panel({
            autoShow: true,
            columnWidth: 1.0,
            layout: 'fit',
            border: false
        });

        this.pPersonData = new Ext.Panel({
            layout: 'form',
            frame: true,
            region: 'north',
            margins: '0 0 5 0',
            labelAlign: 'top',
            height: 155,
            bodyStyle: 'padding: 2px 0px 0px 2px',
            width: '100%',
            items: [
                {
                    layout: 'column',
                    anchor: '100%',
                    border: false,
                    items: [
                        {
                            columnWidth: 0.24,
                            id: 'padrefoto',
                            layout: 'border',
                            height: 135,
                            frame: true,
                            style: '-moz-border-radius:5px',
                            items: [this.pFoto]
                        },
                        {
                            columnWidth: 0.01,
                            layout: 'form',
                            items: [
                                {
                                    xtype: 'panel',
                                    height: 140,
                                    width: 0.05
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            id: 'fieldsetAsociar',
                            columnWidth: .75,
                            bodyStyle: 'padding: 5px 5px 5px 5px',
                            height: 155,
                            layout: 'column',
                            items: [this.pDetails]
                        }
                    ]
                }
            ]
        });

        this.pPersonData.on('render', function (cmp) {
            cmp.setHeight(155);
        });

        this.fpEval = new Ext.FormPanel({
            layout: 'form',
            region: 'center',
            buttons: [this.btnGuardar, this.btnLimpiar],
            border: false,
            bodyStyle: 'padding:10 10 10 10',
            margins: '5 5 5 5',
            labelAlign: 'top',
            frame: true,
            autoScroll: true,
            items: [cbescala,taComplementoTextual, taAyuda]
        });

        var pAux = new Ext.Panel({
            title: 'Evaluar',
            items: [this.fpEval],
            layout: 'border',
            region: 'center',
            height: 300
        });

        this.items = [this.tpTemplate, {
            region: 'center',
            width: '50%',
            layout: 'border',
            border: false,
            margins: '5 5 5 5',
            items: [this.pPersonData, pAux]
        }];
		
        this.keys = [
            {
                key: 'g',
                alt: true,
                fn: function () {
                    if (!self.btnGuardar.disabled) {
                        self.btnGuardar.handler();
                    } else  if (!self.btnGuardarIndEval.disabled) {
                        self.btnGuardarIndEval.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            },
            {
                key: 'i',
                ctrl: true,
                alt: true,
                fn: function () {
                    if (!btnImportarEvalExcel.disabled) {
                        btnImportarEvalExcel.handler();
                    }
                }
            }
        ];
        Ext.Evaluaciones.EvalTemplate.superclass.initComponent.call(this);

        this.pFoto.on('render', function (cmp) {
            cmp.setHeight(120);
            var srcImg = self.persona.get('foto');
            tplFoto.overwrite(this.pFoto.body, {
                dirfoto: srcImg
            });
            this.pFoto.body.slideIn('l', {
                easing: 'easeOut',
                duration: .5
            });
        }, this);

        this.pDetails.on('render', function (cmp) {
            if (this.persona.get('nopersona') == 0) {
                tplDatosPersona.overwrite(this.pDetails.body, {
                    numid: this.persona.get('numid') || '-',
                    nombre: this.persona.get('nombre') || '-',
                    snombre: this.persona.get('snombre') || '-',
                    papel: this.persona.get('papel') || '-',
                    sapel: this.persona.get('sapel') || '-',
                    cargo: this.persona.get('cargo') || '-',
                    sexo: this.persona.get('denomsexo') || '-',
                    categoria: this.persona.get('categoria') || '-'
                });
            } else {
                tplDatosEvaluado.overwrite(this.pDetails.body, {
                    nombre: this.persona.get('nombre') || '-',
                    nombrecompleto: this.persona.get('nombrecompleto') || '-'
                });
            }
        }, this);

        this.tpTemplate.on('evalIndChanged', function (record) {
            guardarValorIndicador(true, record);
        });

        function guardarValorIndicador(calcular) {
            if (self.fpEval.getForm().isValid()) {

                var complementotextual = taComplementoTextual.getValue();
                var nodoschecked = self.tpTemplate.getChecked();

                var arrayindicadores = new Array();
                var padreindicadores = new Array();
                var arrayvalores = new Array();

                for ( i = 0; i<nodoschecked.length; i++) {

                    var ind = {idindicadorevaluacion: nodoschecked[i].attributes.idindicadorevaluacion,
                        idpadre: nodoschecked[i].attributes.idpadre
                    };

                    arrayindicadores.push(ind);
                    var indpadre = {idindicadorevaluacion: nodoschecked[i].parentNode.attributes.idindicadorevaluacion,
                        idexpresionmatematica: nodoschecked[i].attributes.idexpresionmatematica,
                        idpadre:nodoschecked[i].attributes.idpadre
                    };

                    padreindicadores.push(indpadre);
                }

                if(cbescala.getValue() == 'No')
                    valor = "2";
                else if(cbescala.getValue() == 'Sí')
                    valor = "1"
                else valor = cbescala.getValue();
                arrayvalores.push(valor);

                var indicadoreval = arrayindicadores[0].idindicadorevaluacion;
                    Ext.Ajax.request({
                        url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/obtenerObligatorio',
                        method: 'POST',
                        params: {
                            indicadores: indicadoreval
                        },
                        callback: function (o, s, r) {
                            var rpta = Ext.util.JSON.decode(r.responseText);
                            if(rpta.codMsg==true && (complementotextual==null || complementotextual=='') ){
                                mostrarMensaje(3,'Hay indicadores con el complemento textual obligatorio.');
                            }
                            else{
                                guardarEvaluacion(self.persona.get('idpersonaevaluacion'), self.persona.get('idmodelo'), complementotextual, arrayvalores,
                                    arrayindicadores, padreindicadores,1);
                                for (i = 0; i<nodoschecked.length; i++) {
                                    nodoschecked[i].setText(nodoschecked[i].attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>'+cbescala.getRawValue()+'</div>');
                                    nodoschecked[i].attributes.valorComplementotextual = complementotextual;
                                }
                                self.btnGuardar.focus();
                            }
                        }
                    });



            }
        }

        function guardarValorIndEvaluacion(idpersonaevaluacion, idmodelo, complementotextual, valores, arrayind, padreind, param){
            var nodoschecked = self.tpTemplate.getChecked();

            if(nodoschecked.length>=1){
                var arrayindicadores = new Array();
                var padreindicadores = new Array();
                var arrayvalores = new Array();

                for ( i = 0; i<nodoschecked.length; i++) {

                    var ind = {idindicadorevaluacion: nodoschecked[i].attributes.idindicadorevaluacion,
                        idpadre: nodoschecked[i].attributes.idpadre
                    };

                    arrayindicadores.push(ind);
                    var indpadre = {idindicadorevaluacion: nodoschecked[i].parentNode.attributes.idindicadorevaluacion,
                        idexpresionmatematica: nodoschecked[i].attributes.idexpresionmatematica,
                        idpadre:nodoschecked[i].attributes.idpadre
                    };

                    padreindicadores.push(indpadre);
                }

                var indicadoreval = arrayindicadores[0].idindicadorevaluacion;

                Ext.Ajax.request({
                    url: 'obtenerObligatorio',
                    method: 'POST',
                    params: {
                        indicadores: indicadoreval
                    },
                    callback: function (o, s, r) {
                        var rpta = Ext.util.JSON.decode(r.responseText);

                        if(rpta.codMsg==true && (complementotextual==null || complementotextual=='') ){
                            mostrarMensaje(3,'Hay indicadores con el complemento textual obligatorio.');
                        }
                        else{
                            self.baseParams.parametro = param;

                            self.baseParams.guardar = 1;
                            PVD.mostrarMascara('saveEval', 'Por favor espere...', 'Guardando evaluaci&oacute;n');
                            Ext.Ajax.request({
                                url: self.urlSave,
                                method: 'POST',
                                params: {
                                    calcular: true,
                                    idpersonaevaluacion: idpersonaevaluacion,
                                    idmodelo: idmodelo,
                                    complementotextual: complementotextual,
                                    idrecurso: self.baseParams.idrecurso,
                                    valores: Ext.encode(valor),
                                    indicadores: Ext.encode(arrayindicadores),
                                    padreindicadores: Ext.encode(padreindicadores)
                                },
                                callback: function (o, s, r) {
                                    PVD.ocultarMascara('saveEval');
                                    var rpta = Ext.util.JSON.decode(r.responseText);

                                    if(rpta.padre){
                                        var pad = rpta.padre.mostrar;

                                        for(var i = 0;i<pad.length;i++){
                                            if(pad[i].valor!=0 ){
                                                var id = pad[i].idpadre;
                                                var valor = pad[i].valor;
                                                var nodo = self.tpTemplate.getNodeById(id);

                                                nodo.setText(nodo.attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'+valor+'</b></div>');
                                            }
                                        }
                                    }

                                    if (rpta.resultadoEvaluacion) {
                                        var noderaiz = self.tpTemplate.getNodeById('-1');
                                        noderaiz.setText(noderaiz.attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'+rpta.resultadoEvaluacion+'</b></div>');
                                    }
                                    var nodoschecked = self.tpTemplate.getChecked();
                                    for (i = 0; i<nodoschecked.length;i++) {
                                        nodoschecked[i].getUI().toggleCheck(false);
                                    }
                                    mostrarMensaje(1, 'La evaluaci&oacute;n ha sido guardada satisfactoriamente.');
                                    self.tpTemplate.getRootNode().reload();
                                }
                            });
                        }
                    }
                });
            }else{
                mostrarMensaje(3, 'Debe escoger un indicador para ser evaluado.');
            }

        }
		function guardarEvaluacion(idpersonaevaluacion, idmodelo, complementotextual, valores, arrayindicadores, padreindicadores, param)
        {
            self.baseParams.parametro = param;

            self.baseParams.guardar = 1;
            PVD.mostrarMascara('saveEval', 'Por favor espere...', 'Guardando evaluaci&oacute;n');
            Ext.Ajax.request({
                url: self.urlSave,
                method: 'POST',
                params: {
                    calcular: true,
                    idpersonaevaluacion: idpersonaevaluacion,
                    idmodelo: idmodelo,
                    complementotextual: complementotextual,
                    idrecurso: self.baseParams.idrecurso,
                    valores: Ext.encode(valores),
                    indicadores: Ext.encode(arrayindicadores),
                    padreindicadores: Ext.encode(padreindicadores)
                },
                callback: function (o, s, r) {
                    PVD.ocultarMascara('saveEval');
                    var rpta = Ext.util.JSON.decode(r.responseText);

                        if(rpta.padre){
                            var pad = rpta.padre.mostrar;

                            for(var i = 0;i<pad.length;i++){
                                if(pad[i].valor!=0 ){
                                    var id = pad[i].idpadre;
                                    var valor = pad[i].valor;
                                    var nodo = self.tpTemplate.getNodeById(id);

                                    nodo.setText(nodo.attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'+valor+'</b></div>');
                                }
                            }
                        }

                    if (rpta.resultadoEvaluacion) {
                        var noderaiz = self.tpTemplate.getNodeById('-1');
                        noderaiz.setText(noderaiz.attributes.denom+'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'+rpta.resultadoEvaluacion+'</b></div>');
                    }
                    var nodoschecked = self.tpTemplate.getChecked();
                    for (i = 0; i<nodoschecked.length;i++) {
                        nodoschecked[i].getUI().toggleCheck(false);
                    }
                    mostrarMensaje(1, 'La evaluaci&oacute;n ha sido guardada satisfactoriamente.');
                    self.tpTemplate.getRootNode().reload();
                }
            });
        }
		
		
        function cargarEvaluacion()
        {
            PVD.mostrarMascara('cargarEval', 'Por favor espere...', 'Cargando evaluaci&oacute;n');
            Ext.Ajax.request({
                url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/actualizarEvaluacion',
                method: 'POST',
                params: {
                    idpersonaevaluacionanterior: self.gpPeriodos.getSelectionModel().getSelected().get('idpersonaevaluacion'),
                    idpersonaevaluacion: self.persona.get('idpersonaevaluacion')
                },
                callback: function (o, s, r) {
                    PVD.ocultarMascara('cargarEval');
                    var rpta = Ext.util.JSON.decode(r.responseText);
                    if (rpta == true) {
                        mostrarMensaje(1, 'La evaluaci&oacute;n ha sido cargada satisfactoriamente.');
                        self.tpTemplate.getLoader().load(self.tpTemplate.getRootNode());
                    } else {
                        mostrarMensaje(1, 'La persona seleccionada no tiene evaluación en este período.');
                    }
                    self.winCargarEvalPer.hide();
                }
            });
        }

        function importarFileUploadField(idpersonaevaluacion, numid) {
            var panel = new Ext.FormPanel({
                fileUpload: true,
                width: 400,
                frame: true,
                autoHeight: true,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                labelWidth: 50,
                defaults: {
                    anchor: '95%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                items: [{
                    xtype: 'fileuploadfield',
                    id: 'subir',
                    name: 'fileUpload',
                    anchor: '100%',
                    fieldLabel: 'Archivo',
                    emptyText: 'Seleccione...',
                    allowBlank: false,
                    buttonText: 'Buscar'
                }]
            });

            var importar = new Ext.Window({
                title: 'Importar evaluaci&oacute;n',
                width: 400,
                layout: 'fit',
                modal: true,
                items: [panel],
                buttons: [{
                    iconCls: 'cancelar',
                    id: 'cancelarImportar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
                    handler: function () {
                        importar.close();
                    }
                }, {
                    iconCls: 'aceptar',
                    id: 'aceptarImportar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
                    handler: function () {
                        if (panel.getForm().isValid()) {
                            panel.getForm().submit({
                                url: (self.urlImportar)?self.urlImportar:'/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/importarDatosExcel',
                                waitMsg: 'Importando datos del archivo...',
                                params: {idpersonaevaluacion: idpersonaevaluacion,
                                    numid: numid,
                                    idmodelo: self.persona.get('idmodelo'),
                                    idplanilla:self.baseParams.idplanilla,
                                    idrecurso: self.baseParams.idrecurso,
                                },
                                success: function (fp, response) {
                                    var responseText = Ext.decode(response.response.responseText);
                                    importar.close();
                                    self.tpTemplate.getLoader().load(self.tpTemplate.getRootNode());
                                    mostrarMensaje(1, 'La evaluaci&oacute;n ha sido importada satisfactoriamente.');
                                }.createDelegate(this),
                                failure: function (fp, response) {
                                    var responseText = Ext.decode(response.response.responseText);
                                    if (responseText.codMsg == 1) {
                                        mostrarMensaje(6, 'El archivo seleccionado no tiene la configuraci&oacute;n correcta.');
                                    } else if (responseText.codMsg == 2) {
                                        mostrarMensaje(6, 'La entidad por la que entr&oacute; no tiene configuraci&oacute;n para importar el excel.');
                                    } else if (responseText.codMsg == 3) {
                                        mostrarMensaje(6, 'La dirección del archivo no existe.');
                                    } else if (responseText.codMsg == 4) {
                                        mostrarMensaje(6, 'El archivo seleccionado no corresponde a la persona a evaluar.');
                                    } else if (responseText.codMsg == 5) {
                                        mostrarMensaje(6, 'El archivo seleccionado no es válido.');
                                    }
                                }.createDelegate(this)
                            });
                        } else {
                            mostrarMensaje(6, 'No existen datos.');
                        }
                    }.createDelegate(this)
                }],
                keys: [{
                    key: 'x',
                    alt: true,
                    fn: function () {
                        if (!Ext.getCmp('cancelarImportar').disabled) {
                            Ext.getCmp('cancelarImportar').handler();
                        }
                    }
                },
                    {
                        key: 13,
                        fn: function () {
                            if (!Ext.getCmp('aceptarImportar').disabled) {
                                Ext.getCmp('aceptarImportar').handler();
                            }
                        }
                    }]
            });
            importar.show();
        }
    }
});
