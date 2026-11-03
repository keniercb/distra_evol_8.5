/**
 * @name GestionarCompetencias.view - Vista de la interfaz.
 * @package   Pvd.Competencia
 * @uses      Pvd.Competencia.GestionarCompetencias
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
Ext.ns('Pvd.Competencia.GestionarCompetencias');
Ext.QuickTips.init();
Pvd.Competencia.GestionarCompetencias.Vista = {
    init: function (idioma, modelo) {
        var self = this;

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border             : false,
            width              : '20%',
            inicial            : perfil.idestructuracomun,
            disponibilidadCargo: true,
            disponibilidad     : false,
            split              : true,
            region             : 'center',
            cargos             : true
        });

        //Boton para modificar.
        this.btnModificarC = new Ext.Button({
            id      : 'btnModificarC',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarComp,
            iconCls : 'modificar'
        });

        this.btnModificarCP = new Ext.Button({
            id      : 'btnModificarCP',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarComp,
            iconCls : 'modificar'
        });

        this.btnModificarNC = new Ext.Button({
            id      : 'btnModificarNC',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarNComp,
            iconCls : 'modificar',
            handler : function () {

            }
        });

        this.btnModificarNCP = new Ext.Button({
            id      : 'btnModificarNCP',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarNComp,
            iconCls : 'modificar',
            handler : function () {

            }
        });

        this.btnModificarCC = new Ext.Button({
            id      : 'btnModificarCC',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarComp,
            iconCls : 'modificar',
            handler : function () {

            }
        });

        this.btnModificarNCC = new Ext.Button({
            id      : 'btnModificarNCC',
            text    : idioma.BtnModificar,
            disabled: true,
            tooltip : idioma.lbBtnModificarNComp,
            iconCls : 'modificar',
            handler : function () {

            }
        });

        //Boton para eliminar.
        this.btnEliminarC = new Ext.Button({
            id      : 'btnEliminarC',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarComp,
            iconCls : 'eliminar'
        });

        this.btnEliminarCC = new Ext.Button({
            id      : 'btnEliminarCC',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarComp,
            iconCls : 'eliminar'
        });

        this.btnEliminarNCC = new Ext.Button({
            id      : 'btnEliminarNCC',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarNComp,
            iconCls : 'eliminar'
        });

        this.btnEliminarCP = new Ext.Button({
            id      : 'btnEliminarCP',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarComp,
            iconCls : 'eliminar'
        });

        this.btnEliminarNC = new Ext.Button({
            id      : 'btnEliminarNC',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarNComp,
            iconCls : 'eliminar'
        });

        this.btnEliminarNCP = new Ext.Button({
            id      : 'btnEliminarNCP',
            text    : idioma.BtnEliminar,
            disabled: true,
            tooltip : idioma.lbBtnEliminarNComp,
            iconCls : 'eliminar'
        });

        // Boton para aceptar
        this.btnAdicionarC = new Ext.Button({
            id      : 'btnAdicionarC',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarComp,
            iconCls : 'adicionar'
        });
        this.btnAdicionarCC = new Ext.Button({
            id      : 'btnAdicionarCC',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarComp,
            iconCls : 'adicionar'
        });
        this.btnAdicionarCP = new Ext.Button({
            id      : 'btnAdicionarCP',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarComp,
            iconCls : 'adicionar'
        });
        this.btnAdicionarNC = new Ext.Button({
            id      : 'btnAdicionarNC',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarNComp,
            iconCls : 'adicionar'
        });
        this.btnAdicionarNCC = new Ext.Button({
            id      : 'btnAdicionarNCC',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarNComp,
            iconCls : 'adicionar'
        });
        this.btnAdicionarNCP = new Ext.Button({
            id      : 'btnAdicionarNCP',
            text    : idioma.btnAdicionar,
            disabled: true,
            tooltip : idioma.lbBtnAdicionarNComp,
            iconCls : 'adicionar'
        });

        // Botones de la ventanita de gestion
        this.btnAceptarComp = new Ext.Button({
            id      : 'btnAceptarComp',
            text    : idioma.lbtnAceptar,
            disabled: false,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnAceptarCompProcesos = new Ext.Button({
            id      : 'btnAceptarCompProcesos',
            text    : idioma.lbtnAceptar,
            disabled: true,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnAceptarCompCargos = new Ext.Button({
            id      : 'btnAceptarCompCargos',
            text    : idioma.lbtnAceptar,
            disabled: true,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnAceptarNivComp = new Ext.Button({
            id      : 'btnAceptarNivComp',
            text    : idioma.lbtnAceptar,
            disabled: false,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnAceptarNivCompProcesos = new Ext.Button({
            id      : 'btnAceptarNivCompProcesos',
            text    : idioma.lbtnAceptar,
            disabled: false,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnAceptarNivCompCargos = new Ext.Button({
            id      : 'btnAceptarNivCompCargos',
            text    : idioma.lbtnAceptar,
            disabled: false,
            tooltip : idioma.textToolTipAceptar,
            iconCls : 'aceptar'
        });
        this.btnCancelarComp = new Ext.Button({
            id      : 'btnCancelarComp',
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.textToolTipCancelar,
            iconCls : 'cancelar',
            handler : function () {
                self.wGestionCompetencia.hide();
                self.fpAdicionarComp.getForm().reset();
            }
        });
        this.btnCancelarCompProcesos = new Ext.Button({
            id      : 'btnCancelarCompProcesos',
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.textToolTipCancelar,
            iconCls : 'cancelar',
            handler : function () {
                self.wGestionCompetenciaProcesos.hide();
                self.fpAdicionarCompProceso.getForm().reset();
            }
        });
        this.btnCancelarCompCargos = new Ext.Button({
            id      : 'btnCancelarCompCargos',
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.textToolTipCancelar,
            iconCls : 'cancelar',
            handler : function () {

                self.wGestionCompetenciasCargos.hide();
                self.fpAdicionarCompCargos.getForm().reset();
            } //
        });
        this.btnCancelarNivComp = new Ext.Button({
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.lbtnCancelar,
            iconCls : 'cancelar',
            handler : function () {
                self.wGestionNivelesCompetencia.hide();
                self.fpAdicionarNivelesComp.getForm().reset();
            }
        });
        this.btnCancelarNivCompProcesos = new Ext.Button({
            id      : 'btnCancelarNivCompProcesos',
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.lbtnCancelar,
            iconCls : 'cancelar',
            handler : function () {
                self.wGestionNivelesCompetenciaProcesos.hide();
                self.fpAdicionarNivelesCompProcesos.getForm().reset();
            }
        });
        this.btnCancelarNivCompCargos = new Ext.Button({
            id      : 'btnCancelarNivCompCargos',
            text    : idioma.lbtnCancelar,
            disabled: false,
            tooltip : idioma.lbtnCancelar,
            iconCls : 'cancelar',
            handler : function () {
                self.wGestionNivelesCompetenciasCargos.hide();
                self.fpAdicionarNivelesCompProcesos.getForm().reset();
            }
        });
        this.btnAplicarComp = new Ext.Button({
            id     : 'btnAplicarComp',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });
        this.btnAplicarCompProcesos = new Ext.Button({
            id     : 'btnAplicarCompProcesos',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });
        this.btnAplicarCompCargos = new Ext.Button({
            id     : 'btnAplicarCompCargos',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });
        this.btnAplicarNivComp = new Ext.Button({
            id     : 'btnAplicarNivComp',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });
        this.btnAplicarNivCompProcesos = new Ext.Button({
            id     : 'btnAplicarNivCompProcesos',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });
        this.btnAplicarNivCompCargos = new Ext.Button({
            id     : 'btnAplicarNivCompCargos',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text   : idioma.lbtnAplicar
        });

        // Combos
        this.comboProcesos = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboProcesos',
            autoCreate    : true,
            editable      : false,
            store         : modelo.stProcesos,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Proceso",
            displayField  : 'denominacion',
            valueField    : 'idproceso',
            hiddenName    : 'idproceso',
            triggerAction : 'all',
            emptyText     : "Seleccione..."
        });
        this.comboCompetenciasC = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboCompetenciasC',
            autoCreate    : true,
            editable      : false,
            store         : modelo.stCompetencias,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Competencia",
            displayField  : 'denominacion',
            valueField    : 'idcompetencia',
            hiddenName    : 'idcompetencia',
            triggerAction : 'all',
            emptyText     : "Seleccione...",
            handler       : function () {
                modelo.stCompetencias.load();
            }
        });
        this.comboCompetenciasP = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboCompetenciasP',
            value         : ' ',
            autoCreate    : true,
            editable      : false,
            store         : modelo.stCompetencias,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Competencia",
            displayField  : 'denominacion',
            valueField    : 'idcompetencia',
            hiddenName    : 'idcompetencia',
            triggerAction : 'all',
            emptyText     : "Seleccione...",
            handler       : function () {
                modelo.stCompetencias.load();
            }
        });
        this.comboCompetencias = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboCompetencias',
            value         : ' ',
            autoCreate    : true,
            editable      : false,
            store         : modelo.stCompetencias,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Competencia",
            displayField  : 'denominacion',
            valueField    : 'idcompetencia',
            hiddenName    : 'idcompetencia',
            triggerAction : 'all',
            emptyText     : "Seleccione...",
            handler       : function () {
                modelo.stCompetencias.load();
            }
        });

        this.comboClasificacion = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboClasificacion',
            value         : '',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stClasificacion,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Clasificación",
            displayField  : 'denominacion',
            valueField    : 'idclasifcompetencia',
            hiddenName    : 'idclasifcompetencia',
            triggerAction : 'all',
            handler       : function () {
                modelo.stClasificacion.removeAll();
                modelo.stClasificacion.load();
            }
        });
        this.comboClasificacionP = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboClasificacionP',
            value         : '',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stClasificacion,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Clasificación",
            displayField  : 'denominacion',
            valueField    : 'idclasifcompetencia',
            hiddenName    : 'idclasifcompetencia',
            triggerAction : 'all',
            handler       : function () {
                modelo.stClasificacion.removeAll();
                modelo.stClasificacion.load();
            }
        });
        this.comboClasificacionC = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboClasificacionC',
            value         : '',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stClasificacion,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Clasificación",
            displayField  : 'denominacion',
            valueField    : 'idclasifcompetencia',
            hiddenName    : 'idclasifcompetencia',
            triggerAction : 'all',
            handler       : function () {
                modelo.stClasificacion.removeAll();
                modelo.stClasificacion.load();
            }
        });

        this.cbNivelRequeridoO = new Ext.form.ComboBox({
            anchor        : '99%',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscala,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Nivel requerido",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all'
        });

        this.cbNivelRequeridoP = new Ext.form.ComboBox({
            anchor        : '99%',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscala,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Nivel requerido",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all'
        });

        this.cbNivelRequeridoC = new Ext.form.ComboBox({
            anchor        : '99%',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscala,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Nivel requerido",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all'
        });

        this.tfOrdenO = new Ext.form.NumberField({
            fieldLabel    : "Orden",
            anchor        : '99%',
            allowBlank : false,
            minValue: 1,
            enableKeyEvents: true,
            maskRe : /^([0-9]*)+$/
        });

        this.tfOrdenP = new Ext.form.NumberField({
            fieldLabel    : "Orden",
            anchor        : '99%',
            allowBlank : false,
            minValue: 1,
            enableKeyEvents: true,
            maskRe : /^([0-9]*)+$/
        });

        this.tfOrdenC = new Ext.form.NumberField({
            fieldLabel    : "Orden",
            anchor        : '99%',
            allowBlank : false,
            minValue: 1,
            enableKeyEvents: true,
            maskRe : /^([0-9]*)+$/
        });

        this.comboValorEscala = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboValorEscala',
            value         : ' ',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscala,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Valor escala",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all'
        });
        this.comboValorEscalaP = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboValorEscalaP',
            value         : ' ',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscalaP,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Valor escala",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all',
            handler       : function () {
                modelo.stValorEscalaP.removeAll();
                modelo.stValorEscalaP.load();
            }
        });
        this.comboValorEscalaC = new Ext.form.ComboBox({
            anchor        : '99%',
            id            : 'comboValorEscalaC',
            value         : ' ',//(_this.modificar) ? _this.record.data.tipoescala : '',
            autoCreate    : true,
            editable      : true,
            store         : modelo.stValorEscalaC,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Valor escala",
            displayField  : 'valor',
            valueField    : 'idvalor',
            hiddenName    : 'idvalor',
            triggerAction : 'all',
            handler       : function () {
                modelo.stValorEscalaC.removeAll();
                modelo.stValorEscalaC.load();
            }
        });

        this.descripcionNivel = new Ext.form.TextArea({
            fieldLabel: "Descripción",
            name      : 'descripNivel',
            id        : 'descripNivel',
            allowBlank: false,
            anchor    : '99%',
            maxLength : 100
        });
        this.descripcionNivelP = new Ext.form.TextArea({
            fieldLabel: "Descripción",
            name      : 'descripNivelP',
            id        : 'descripNivelP',
            allowBlank: false,
            anchor    : '99%',
            maxLength : 100
        });
        this.descripcionNivelC = new Ext.form.TextArea({
            fieldLabel: "Descripción",
            name      : 'descripNivelC',
            id        : 'descripNivelC',
            allowBlank: false,
            anchor    : '99%',
            maxLength : 100
        });

        this.fechaInicio = new Ext.form.DateField({
            fieldLabel  : 'Fecha de inicio',
            allowBlank  : false,
            format      : 'd/m/Y',
            id          : 'fechainicio',
            name        : 'fechainicio',
            vtype       : 'daterange',
            endDateField: 'fechafin',
            minText     : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText     : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            anchor      : '99%',
            value       : /*(_this.modificar) ? _this.record.data.fechainicio :*/ new Date(),
            maskRe      : /[\d\/]/,
            invalidText : 'El formato establecido: dd/mm/aaaa.'
        });

        this.fechaFin = new Ext.form.DateField({
            fieldLabel    : 'Fecha de fin',
            format        : 'd/m/Y',
            id            : 'fechafin',
            name          : 'fechafin',
            vtype         : 'daterange',
            minText       : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText       : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            startDateField: 'fechainicio',
            invalidText   : 'El formato establecido: dd/mm/aaaa.',
            anchor        : '99%',
            value         : /*(_this.modificar) ? _this.record.data.fechafin :*/ "",
            maskRe        : /[\d\/]/,
            parseDate     : function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
            }
        });

        this.fechaInicioP = new Ext.form.DateField({
            fieldLabel  : 'Fecha de inicio',
            allowBlank  : false,
            format      : 'd/m/Y',
            id          : 'fechainicioP',
            name        : 'fechainicioP',
            vtype       : 'daterange',
            endDateField: 'fechafin',
            minText     : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText     : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            anchor      : '99%',
            value       : /*(_this.modificar) ? _this.record.data.fechainicio :*/ new Date(),
            maskRe      : /[\d\/]/,
            invalidText : 'El formato establecido: dd/mm/aaaa.'
        });
        this.fechaFinP = new Ext.form.DateField({
            fieldLabel    : 'Fecha de fin',
            format        : 'd/m/Y',
            id            : 'fechafinP',
            name          : 'fechafinP',
            vtype         : 'daterange',
            minText       : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText       : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            startDateField: 'fechainicio',
            invalidText   : 'El formato establecido: dd/mm/aaaa.',
            anchor        : '99%',
            value         : /*(_this.modificar) ? _this.record.data.fechafin :*/ "",
            maskRe        : /[\d\/]/,
        });


        this.fechaInicioC = new Ext.form.DateField({
            fieldLabel  : 'Fecha de inicio',
            allowBlank  : false,
            format      : 'd/m/Y',
            id          : 'fechaInicioC',
            name        : 'fechaInicioC',
            vtype       : 'daterange',
            endDateField: 'fechafin',
            minText     : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText     : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            anchor      : '99%',
            value       : /*(_this.modificar) ? _this.record.data.fechainicio :*/ new Date(),
            maskRe      : /[\d\/]/,
            invalidText : 'El formato establecido: dd/mm/aaaa.'
        });
        this.fechaFinC = new Ext.form.DateField({
            fieldLabel    : 'Fecha de fin',
            format        : 'd/m/Y',
            id            : 'fechaFinC',
            name          : 'fechaFinC',
            vtype         : 'daterange',
            minText       : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText       : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            startDateField: 'fechainicio',
            invalidText   : 'El formato establecido: dd/mm/aaaa.',
            anchor        : '99%',
            value         : /*(_this.modificar) ? _this.record.data.fechafin :*/ "",
            maskRe        : /[\d\/]/,
            parseDate     : function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
            }
        });

        this.fpAdicionarComp = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboCompetencias, self.comboClasificacion, self.cbNivelRequeridoO,
                {
                    layout  : 'column',
                    defaults: {
                        columnWidth: .5, layout: 'form'
                    },
                    items   : [{
                        defaults: {
                            anchor: '95%'
                        }, items: [self.fechaInicio]
                    }, {
                        items: [self.fechaFin]
                    }]
                }

            ]
        });

        this.fpAdicionarCompCargos = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboCompetenciasC, self.comboClasificacionC, self.cbNivelRequeridoC,
                {
                    layout  : 'column',
                    defaults: {
                        columnWidth: .5, layout: 'form'
                    },
                    items   : [{
                        defaults: {
                            anchor: '95%'
                        }, items: [self.fechaInicioC]
                    }, {
                        items: [self.fechaFinC]
                    }]
                }

            ]
        });

        this.fpAdicionarCompProceso = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboProcesos, self.comboCompetenciasP, self.comboClasificacionP, self.cbNivelRequeridoP,
                {
                    layout  : 'column',
                    defaults: {
                        columnWidth: .5, layout: 'form'
                    },
                    items   : [{
                        defaults: {
                            anchor: '95%'
                        }, items: [self.fechaInicioP]
                    }, {
                        items: [self.fechaFinP]
                    }]
                }

            ]
        });

        this.fpAdicionarNivelesComp = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboValorEscala, self.descripcionNivel
            ]
        });

        this.fpAdicionarNivelesCompProcesos = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboValorEscalaP, self.descripcionNivelP
            ]
        });
        this.fpAdicionarNivelesCompCargos = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : [
                self.comboValorEscalaC, self.descripcionNivelC
            ]
        });

        this.wGestionCompetenciaProcesos = new Ext.Window({
            //title      : idioma.adicionarCompetencia,
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 335,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarCompProcesos, self.btnAplicarCompProcesos, self.btnAceptarCompProcesos],
            items      : [self.fpAdicionarCompProceso]
        });


        this.wGestionCompetenciasCargos = new Ext.Window({
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 290,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarCompCargos, self.btnAplicarCompCargos, self.btnAceptarCompCargos],
            items      : [self.fpAdicionarCompCargos]
        });

        this.wGestionCompetencia = new Ext.Window({
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 290,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarComp, self.btnAplicarComp, self.btnAceptarComp],
            items      : [self.fpAdicionarComp]
        });

        this.wGestionNivelesCompetencia = new Ext.Window({
            title      : idioma.adicionarNivelesCompetencia,
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 220,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarNivComp, self.btnAplicarNivComp, self.btnAceptarNivComp],
            items      : [self.fpAdicionarNivelesComp]
        });

        this.wGestionNivelesCompetenciaProcesos = new Ext.Window({
            title      : idioma.adicionarNivelesCompetencia,
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 220,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarNivCompProcesos, self.btnAplicarNivCompProcesos, self.btnAceptarNivCompProcesos],
            items      : [self.fpAdicionarNivelesCompProcesos]
        });

        this.wGestionNivelesCompetenciasCargos = new Ext.Window({
            title      : idioma.adicionarNivelesCompetencia,
            closeAction: 'hide',
            constrain  : true,
            resizable  : false,
            width      : 300,
            height     : 220,
            layout     : 'fit',
            modal      : true,
            buttons    : [self.btnCancelarNivCompCargos, self.btnAplicarNivCompCargos, self.btnAceptarNivCompCargos],
            items      : [self.fpAdicionarNivelesCompCargos]
        });

// *******  Buscar ****** \\
        this.sfBuscarCompetencia = new Ext.form.TextField({
            id             : 'tfbuscarCE',
            allowBlank     : true,
            emptyText      : idioma.lbMsgcriterioBuscar,
            minLength      : 3,
            enableKeyEvents: true,
            width          : 150,
            name           : 'tfbuscadorCompE',
            listeners      : {
                keypress: function () {
                    self.btnBuscarCE.enable();
                    self.btnLimpiarCE.enable();
                }
            }
        });
        this.sfBuscarCompetenciaProc = new Ext.form.TextField({
            id             : 'tfbuscarCP',
            allowBlank     : true,
            emptyText      : idioma.lbMsgcriterioBuscar,
            minLength      : 3,
            enableKeyEvents: true,
            width          : 150,
            name           : 'tfbuscadorCompProc',
            listeners      : {
                keypress: function () {
                    self.btnBuscarCP.enable();
                    self.btnLimpiarCP.enable();
                }
            }
        });
        this.sfBuscarCompetenciaCargo = new Ext.form.TextField({
            id             : 'tfbuscarCC',
            allowBlank     : true,
            emptyText      : idioma.lbMsgcriterioBuscar,
            minLength      : 3,
            enableKeyEvents: true,
            width          : 150,
            name           : 'tfbuscadorCompCargo',
            listeners      : {
                keypress: function () {
                    self.btnBuscarCC.enable();
                    self.btnLimpiarCC.enable();
                }
            }
        });

        this.btnBuscarCC = new Ext.Button({
            id      : 'btnBuscarCC',
            text    : idioma.BtnBuscar,
            disabled: true,
            tooltip : idioma.lbBtnBuscarComp,
            iconCls : 'buscar'
        });
        this.btnBuscarCP = new Ext.Button({
            id      : 'btnBuscarCP',
            text    : idioma.BtnBuscar,
            disabled: true,
            tooltip : idioma.lbBtnBuscarComp,
            iconCls : 'buscar'
        });
        this.btnBuscarCE = new Ext.Button({
            id      : 'btnBuscarCE',
            text    : idioma.BtnBuscar,
            disabled: true,
            tooltip : idioma.lbBtnBuscarComp,
            iconCls : 'buscar'
        });
        this.btnLimpiarCE = new Ext.Button({
            id      : 'btnLimpiarCE',
            text    : idioma.BtnLimpiar,
            disabled: true,
            tooltip : idioma.lbBtnLimpiar,
            iconCls : 'limpiar',
            handler : function () {
                self.sfBuscarCompetencia.setValue('');
                modelo.stCompetenciasEstructura.load({params: {start: 0, limit: 15}});
            }

        });
        this.btnLimpiarCC = new Ext.Button({
            id      : 'btnLimpiarCC',
            text    : idioma.BtnLimpiar,
            disabled: true,
            tooltip : idioma.BtnLimpiar,
            iconCls : 'limpiar',
            handler : function () {
                self.sfBuscarCompetenciaCargo.setValue('');
                modelo.stCompetenciasCargos.load({params: {start: 0, limit: 15}});
            }

        });
        this.btnLimpiarCP = new Ext.Button({
            id      : 'btnLimpiarCP',
            text    : idioma.BtnLimpiar,
            disabled: true,
            tooltip : idioma.BtnLimpiar,
            iconCls : 'limpiar',
            handler : function () {
                self.sfBuscarCompetenciaProc.setValue('');
                modelo.stCompetenciasProcesos.load({params: {start: 0, limit: 15}});
            }
        });

        //*******************************\\

        this.gpCompetenciasOrg = new Ext.grid.GridPanel({
            id      : 'IDgpCompetenciasOrg',
            region  : 'center',
          //  title   : 'Gestionar competencias de la organización',
            store   : modelo.stCompetenciasEstructura,
            view    : new Ext.grid.GroupingView({
                forceFit      : true,
                startCollapsed: false,
                groupTextTpl  : '{group}'
            }),
            layout  : 'fit',
            loadMask: {msg: 'Cargando...'},
            tbar    : new Ext.Toolbar({
                items: [this.btnAdicionarC, this.btnModificarC, this.btnEliminarC, ' ', 'Buscar competencias:', this.sfBuscarCompetencia, ' ', this.btnBuscarCE, ' ', this.btnLimpiarCE]
            }),
            columns : [
                {
                    header   : 'Denominación',
                    width    : 250,
                    dataIndex: 'denominacion'
                },
                {
                    header   : 'Fecha inicio',
                    width    : 100,
                    dataIndex: 'fdesde',
                    sortable : false
                },
                {
                    header   : 'Fecha fin',
                    width    : 100,
                    dataIndex: 'fhasta',
                    sortable : false
                },
                {
                    header   : 'Escala',
                    width    : 200,
                    dataIndex: 'escala'
                },
                {
                    header   : 'Clasificación',
                    width    : 150,
                    dataIndex: 'clasificacion',
                    sortable : false
                },     {
                    header   : '',
                    width    : 100,
                    hidden   : true,
                    dataIndex: 'denomarea',
                    sortable : false
                },
                {
                    header   : 'Nivel requerido',
                    width    : 100,
                    dataIndex: 'nivelrequerido'
                },
                {
                    header   : 'Orden',
                    hidden   : true,
                    width    : 50,
                    dataIndex: 'orden'
                }
            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stCompetenciasEstructura,
                displayInfo: true
            }),
            //listeners : {
            //    modelo.stCompetencias.load(),
            //}
        });

        this.gpCompetenciasProcesos = new Ext.grid.GridPanel({
            id      : 'IDgpCompetenciasProceso',
            region  : 'center',
            store   : modelo.stCompetenciasProcesos,
            view    : new Ext.grid.GroupingView({
                forceFit      : true,
                startCollapsed: false,
                groupTextTpl  : '{group}'
            }),
            layout  : 'fit',
            loadMask: {msg: 'Cargando...'},
            tbar    : new Ext.Toolbar({
                items: [this.btnAdicionarCP, this.btnModificarCP, this.btnEliminarCP, ' ', 'Buscar competencias:', this.sfBuscarCompetenciaProc, ' ', this.btnBuscarCP, ' ', this.btnLimpiarCP]
            }),
            columns : [
                {
                    header   : 'Denominación',
                    width    : 250,
                    dataIndex: 'denominacion'
                },
                {
                    header   : 'Fecha inicio',
                    width    : 100,
                    dataIndex: 'fdesde',
                    sortable : false
                },
                {
                    header   : 'Fecha fin',
                    width    : 100,
                    dataIndex: 'fhasta',
                    sortable : false
                },
                {
                    header   : 'Clasificación',
                    width    : 250,
                    dataIndex: 'clasificacion',
                    sortable : false
                },
                {
                    header   : 'Escala',
                    width    : 200,
                    dataIndex: 'escala',
                    sortable : false
                },

                {
                    header   : 'Proceso',
                    width    : 200,
                    dataIndex: 'denominacionproceso',
                    sortable : false
                },
                {
                    header   : 'Nivel requerido',
                    width    : 100,
                    dataIndex: 'nivelrequerido'
                },
                {
                    header   : 'Orden',
                    width    : 50,
                    hidden   : true,
                    dataIndex: 'orden'
                },
                {
                    header   : '',
                    width    : 100,
                    hidden   : true,
                    dataIndex: 'denomarea',
                    sortable : false
                }

            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stCompetenciasProcesos,
                displayInfo: true
            })
        });
        this.gpCompetenciasCargos = new Ext.grid.GridPanel({
            id      : 'IDgpCompetenciasCargos',
            region  : 'center',
            store   : modelo.stCompetenciasCargos,
            view    : new Ext.grid.GroupingView({
                forceFit      : true,
                startCollapsed: false,
                groupTextTpl  : '{group}'
            }),
            layout  : 'fit',
            loadMask: {msg: 'Cargando...'},
            tbar    : new Ext.Toolbar({
                items: [this.btnAdicionarCC, this.btnModificarCC, this.btnEliminarCC, ' ', 'Buscar competencias:', this.sfBuscarCompetenciaCargo, ' ', this.btnBuscarCC, ' ', this.btnLimpiarCC]
            }),
            columns : [
                {
                    header   : 'Denominación',
                    width    : 250,
                    dataIndex: 'denominacion'
                },
                {
                    header   : 'Fecha inicio',
                    width    : 100,
                    dataIndex: 'fdesde',
                    sortable : false
                },
                {
                    header   : 'Fecha fin',
                    width    : 100,
                    dataIndex: 'fhasta',
                    sortable : false
                },
                {
                    header   : 'Clasificación',
                    width    : 250,
                    dataIndex: 'clasificacion',
                    sortable : false
                },
                {
                    header   : 'Escala',
                    width    : 200,
                    dataIndex: 'escala',
                    sortable : false
                },
                {
                    header   : 'Nivel requerido',
                    width    : 100,
                    dataIndex: 'nivelrequerido'
                },
                {
                    header   : 'Orden',
                    width    : 50,
                    hidden   : true,
                    dataIndex: 'orden'
                }
                ,
                 {
                    header   : '',
                    width    : 100,
                    hidden   : true,
                    dataIndex: 'denomarea',
                    sortable : false
                }

            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stCompetenciasCargos,
                displayInfo: true
            })
        });
        this.gpNivelesCompetencias = new Ext.grid.GridPanel({
            id         : 'IDgpNivelesCompetencias',
            title      : 'Niveles de competencias por estructura',
            region     : 'south',
            store      : modelo.stNivelesCompetencias,
            layout     : 'fit',
            disabled   : false,
            collapsible: true,
            split      : true,
            height     : 200,
            loadMask   : {msg: 'Cargando...'},
            tbar       : new Ext.Toolbar({
                items: [this.btnAdicionarNC, this.btnModificarNC, this.btnEliminarNC]
            }),

            columns: [
                {
                    header   : 'Valor de la escala',
                    width    : 150,
                    dataIndex: 'valorescala'
                },
                {
                    header   : 'Descripción',
                    width    : 500,
                    dataIndex: 'descripcion',
                    sortable : false,
                    align    : 'center'
                }
            ],
            bbar   : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stNivelesCompetencias,
                displayInfo: true
            })
        });

        this.gpNivelesCompetenciasProcesos = new Ext.grid.GridPanel({
            id         : 'IDgpNivelesCompetenciasProcesos',
            title      : 'Niveles de competencias por procesos',
            region     : 'south',
            store      : modelo.stNivelesCompetencias,
            layout     : 'fit',
            disabled   : false,
            collapsible: true,
            split      : true,
            height     : 200,
            loadMask   : {msg: 'Cargando...'},
            tbar       : new Ext.Toolbar({
                items: [this.btnAdicionarNCP, this.btnModificarNCP, this.btnEliminarNCP]
            }),
            columns    : [
                {
                    header   : 'Valor de la escala',
                    width    : 150,
                    dataIndex: 'valorescala'
                },
                {
                    header   : 'Descripción',
                    width    : 500,
                    dataIndex: 'descripcion',
                    sortable : false,
                    align    : 'center'
                }
            ],
            bbar       : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stNivelesCompetencias,
                displayInfo: true
            })
        });

        this.gpNivelesCompetenciasCargos = new Ext.grid.GridPanel({
            id         : 'IDgpNivelesCompetenciasCargos',
            title      : 'Niveles de competencias por cargos',
            region     : 'south',
            store      : modelo.stNivelesCompetencias,
            layout     : 'fit',
            disabled   : false,
            collapsible: true,
            split      : true,
            height     : 200,
            loadMask   : {msg: 'Cargando...'},
            tbar       : new Ext.Toolbar({
                items: [this.btnAdicionarNCC, this.btnModificarNCC, this.btnEliminarNCC]
            }),
            columns    : [
                {
                    header   : 'Valor de la escala',
                    width    : 150,
                    dataIndex: 'valorescala'
                },
                {
                    header   : 'Descripción',
                    width    : 500,
                    dataIndex: 'descripcion',
                    sortable : false,
                    align    : 'center'
                }
            ],
            bbar       : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : modelo.stNivelesCompetencias,
                displayInfo: true
            })
        });

        this.tabPanel = new Ext.TabPanel({
            id       : 'idTabPanel',
            region   : 'center',
            margins  : '0 5 5 0',
            height   : '100%',
            width    : '70%',
            border   : false,
            activeTab: 0,
            items    : [
                {
                    title : idioma.lbGestionarCompetOrganiz,
                    id    : 'competenciasorganizacion',
                    layout: 'border',
                    tabTip: idioma.lbGestionarCompetOrganiz,
                    items : [this.gpCompetenciasOrg/*, this.gpNivelesCompetencias*/]
                }/*, {
                    title : idioma.lbGestionarCompetProcesos,
                    id    : 'competenciasprocesos',
                    layout: 'border',
                    tabTip: idioma.lbGestionarCompetProcesos,
                    items : [this.gpCompetenciasProcesos, this.gpNivelesCompetenciasProcesos]
                }*/, {
                    title : idioma.lbGestionarCompetCargos,
                    id    : 'competenciascargos',
                    layout: 'border',
                    tabTip: idioma.lbGestionarCompetCargos,
                    items : [this.gpCompetenciasCargos/*, this.gpNivelesCompetenciasCargos*/]
                }
            ]
        });

        new Ext.Viewport({
            layout: 'border',
            items : [
                {
                    region     : 'west',
                    xtype      : 'panel',
                    id         : 'east-panel',
                    autoHeight : false,
                    split      : true,
                    width      : '25%',
                    border     : false,
                    collapsible: true,
                    title      : idioma.titleEstructura,
                    layout     : 'border',
                    items      : [this.tpEstructura]
                },
                {
                    region    : 'center',
                    xtype     : 'panel',
                    id        : 'center-panel',
                    autoHeight: false,
                    split     : true,
                    width     : '75%',
                    border    : false,
                    layout    : 'border',
                    items     : [this.tabPanel]
                }

            ]
        });

    }
};

UCID.portal.cargarEtiquetas('gestionarcompetencias', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Competencia.GestionarCompetencias.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Competencia.GestionarCompetencias.Vista;
    vista.init(idioma, modelo);

    //Cargando acciones de la vista
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

    //Inicializar controlador.
    Pvd.Competencia.GestionarCompetencias.Controlador.init(idioma, vista, modelo);
});
