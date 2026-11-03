Ext.ns('Ext.Persona');
Ext.Persona.busquedaAvanzadaPersonaLang = {
    /**
     * Títulos de los componentes del formulario de busqueda
     */
    fpAdvancedSearch: 'B&uacute;squeda avanzada',
    lbBuscarPersona: 'Buscar persona:',
    tfMore: 'M&aacute;s',
    cbxFonetica: 'Suena como',
    cbxMaysMinus: 'Coincidir may&uacute;sculas y min&uacute;sculas',
    cbxPcompletas: 'S&oacute;lo palabras completas',
    cbCondiciones: 'Condiciones',
    /**
     * Títulos de las botones
     */
    lbBA: 'M&aacute;s',
    lbSearch: 'Buscar',
    lbCleanSearch: 'Limpiar',
    /**
     * Tooltip de los botones.
     */
    ttBtnBA: 'B&uacute;squeda avanzada <b>(Alt+B)</b>',
    ttBtnCBA: 'Cerrar b&uacute;squeda avanzada',
    ttBtnSearch: 'Efectuar b&uacute;squeda',
    ttBtnCleanSearch: 'Limpiar b&uacute;squeda',

    lbNoIdentidad: 'No Identidad',
    lbNombreApellidos: 'Nombre  y apellidos',
    lbNombre: 'Nombre',
    lbSnombre: 'Segundo nombre',
    lbPapellido: 'Primer apellido',
    lbSapellido: 'Segundo apellido',
    lbSexo: 'Sexo',
    lbCategoria: 'Categor&iacute;a',
};

Ext.Persona.busquedaAvanzadaPersona = Ext.extend(Ext.FormPanel, {
    idioma: Ext.apply(Ext.Persona.busquedaAvanzadaPersonaLang, this.idioma || {}),
    hidden: true,
    bodyStyle: 'padding: 10px',
    labelAlign: 'top',
    frame: true,
    buttonAlign: 'right',
    autoScroll: true,
    hasSearch: false,
    searchValues: [],
    paramName: 'query',
    initComponent: function () {
        this.title = this.idioma.fpAdvancedSearch;
        this.initButtons();
        this.initFormFields();
        this.iniEvents();

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                scope: this,
                fn: this.generateFormat
            }, {
                key: Ext.EventObject.ESC,
                stopEvent: true,
                scope: this,
                fn: this.clearSearch
            }
        ];

        this.items = [this.tfNumero, this.tfNombre, this.tfSnombre, this.tfPapel, this.tfSapel, this.cbSexo, this.fsChecks];
        Ext.Persona.busquedaAvanzadaPersona.superclass.initComponent.call(this);

        this.tools = [{
            id: 'close',
            qtip: this.idioma.ttBtnCBA,
            scope: this,
            handler: this.toggleAdvanceSearch
        }];
    },

    initButtons: function (newButtons) {

        this.btnSearch = new Ext.Button({
            text: this.idioma.lbSearch,
            tooltip: this.idioma.ttBtnSearch,
            iconCls: 'btn',
            scope: this,
            handler: this.generateFormat,
            icon: perfil.dirImg + 'buscar.png'
        });

        this.btnCleanSearch = new Ext.Button({
            text: this.idioma.lbCleanSearch,
            tooltip: this.idioma.ttBtnCleanSearch,
            iconCls: 'btn',
            scope: this,
            handler: this.clearSearch,
            icon: perfil.dirImg + 'limpiar.png'
        });

        this.buttons = [this.btnSearch, this.btnCleanSearch];
    },

    initFormFields: function () {

        this.tfNumero = new Ext.form.TextField({
            fieldLabel: this.idioma.lbNoIdentidad,
            minLength: 3,
            regex: /(^[a-zA-Z\d*]+)(\,[a-zA-Z\d*]+)*$/,
            anchor: '90%',
            name: 'numid'
        });

        this.tfNombre = new Ext.form.TextField({
            fieldLabel: this.idioma.lbNombre,
            minLength: 3,
            regex: /(^[a-zA-Z]+)(\,[a-zA-Z]+)*$/,
            anchor: '90%',
            name: 'nombre'
        });

        this.tfSnombre = new Ext.form.TextField({
            fieldLabel: this.idioma.lbSnombre,
            minLength: 3,
            regex: /(^[a-zA-Z]+)(\,[a-zA-Z]+)*$/,
            anchor: '90%',
            name: 'snombre'
        });

        this.tfPapel = new Ext.form.TextField({
            minLength: 3,
            fieldLabel: this.idioma.lbPapellido,
            regex: /(^[a-zA-Z ]+)(\,[a-zA-Z ]+)*$/,
            anchor: '90%',
            name: 'papel'
        });

        this.tfSapel = new Ext.form.TextField({
            minLength: 3,
            fieldLabel: this.idioma.lbSapellido,
            regex: /(^[a-zA-Z ]+)(\,[a-zA-Z ]+)*$/,
            anchor: '90%',
            name: 'sapel'
        });

        var stSexo = new Ext.data.SimpleStore({
            fields: [
                {name: "id"},
                {name: "sexo"},
                {name: "css"}
            ],
            data: [
                ["1", "Masculino", "data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVDjLpVNNaxNRFH0fgzNxRlNIm6QVsSRQ1IUiVCSCS8FF4kokO/9BF7oUstBll4IuunBpl61RNy4suhgF21WhJVU0WiHUksmQr2bex/TeMJEoxog+uMzjzT3nnXPmDg3DkPzPMsY1PHrpdaWUZFBCDJ6C3L91NjaWAAH5SwkLhaJaTfBJyOOnmwf4no0lkIJUqg2hAKUAqKMKQMFfEdy5PhN7X/Ge1L22QqACCUFPhCIIvv6UwdJaiyopi1KqAnjMRZ5dUDBzbta5fDxuc99vafuYw9SQgj7B0qsmBeDdTJKXUhMWi5mcaRKSVrt30uCcHrFMtrv7Xb5wq8+uzp/Ip1MJLoYJ4KZiZsoozU5bBqWM9r8slO0c5bjvdrr6uVt9B6CF1dcfrgm5JVHhDwJIuoA3QyS0tteUGzueEtBwIRvnyXTC6HR76PnLw9tX0HdsOCMWJZ0zLZANt63v1NV+ozO377Xn3M2a0hCabdsMPOdGDhL60dFASthjQHgmOOufK/Az8PzrYhGB22wdaGw+n5ngjkkrjsUqF88kOZ75dV9jz2gFgSh/+ubfOJ012VR60sinJg0UhGApgnDrYw0IZHkkAUheXt/ey/aCoHRqOs4cx+7n4TcaehvAbzY+34PUl39HQAd/48KDtxT8FyH9ghQyhyOMgwRVRvDK4s3wjwT/ug4BPyZOkZTlSM0AAAAASUVORK5CYII="],
                ["0", "Femenino", "data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVDjLjZLNbtNAFIXrJ8mL+QVQoVUWICFEFZCAbrJCAdpFWCC1i1QgVLEoZYFAgrY0rhPHTmwnThP/BKetU9vxT7I5zHWEhEBuWBxpFnO+c+6dWQGw8qfUisQNdnR+tD+ojQ9txz2wHPvdea1f7fDtssj9ff8fs7VnlCbCJRIzwsxNMfuZIuoGuPriwtjqlOSndS4XQMlkJuPcm2F+yXSxUGrHcD9YUDcbfC6AalMyGaNuiIvDEdx9C0FjwqAJfMGD/qRZywXQvFk6SxwfOOhvdwpGRSnYb/pslASxMYX6UHRuaDB0aGYCuO9N9J4rhW65VTC39AWgN0XnnpAPMHeN2lT1F3XrHqzXBsxXOq4+u0idGN7XMeTiaf4IvRcKP/5oIxlEWSKJjCTayeClhubaUf4SlWcCp5el0ujtEGHrOtt8asUIxQmGzCzdOS6JxW/5z5hBHguc9qjJdzekfqQGSM4jdFaFsHX7hG+sf7/5I5HaG2dV7UFD0+6K2lTxs8W1b536yuoPTVo72lwKUO+Lc6pP5nQYZ/uIeyGCMw+shbYUoBTrGYBE9UmhdI1A9CD/D0BaP6nKrC6rrZGRRGc5G+H401LAb5HBZ7WpOp3z7uUC2HtXqDKJJe/k3fsF8TkmWq5zP6gAAAAASUVORK5CYII="]
            ]
        });

        this.cbSexo = new Ext.form.ComboBoxBtn({
            fieldLabel: this.idioma.lbSexo,
            store: stSexo,
            tpl: '<tpl for="."><div ext:qtip="{sexo}" class="x-combo-list-item"><img width="16" height="16" src="{css}">  {sexo}</div></tpl>',
            displayField: 'sexo',
            valueField: 'id',
            hiddenName: 'id',
            typeAhead: true,
            trigger1Class: 'x-form-clear-trigger',
            mode: 'local',
            scope: this,
            handler: function () {
                this.cbSexo.reset();
            },
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '90%'
        });

        var stCondiciones = new Ext.data.SimpleStore({
            fields: [
                {name: "condicion"},
                {name: "denominacion"}
            ],
            data: [
                ['<>', 'Distinto'],
                ['x%', 'Comienza con'],
                ['%x', 'Termina con']]
        });

        this.cbCondiciones = new Ext.form.ComboBoxBtn({
            fieldLabel: this.idioma.cbCondiciones,
            store: stCondiciones,
            trigger1Class: 'x-form-clear-trigger',
            displayField: 'denominacion',
            valueField: 'condicion',
            hiddenName: 'condicion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '90%',
            scope: this,
            handler: function () {
                this.cbCondiciones.reset();
            },
            listeners: {
                beforeselect: function () {
                    this.cbxWords.reset();
                }.createDelegate(this)
            }
        });

        this.cbxWords = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: this.idioma.cbxPcompletas,
            name: 'pcomp',
            scope: this,
            handler: function () {
                this.cbCondiciones.reset();
            }
        });

        this.cbxMayusMinus = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: this.idioma.cbxMaysMinus,
            name: 'minMayus',
            checked: true
        });

        this.cbxFonetica = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: this.idioma.cbxFonetica,
            name: 'fonetica'
        });

        this.fsChecks = new Ext.form.FieldSet({
            title: this.idioma.tfMore,
            anchor: '90%',
            collapsible: true,
            collapsed: true,
            autoHeight: true,
            items: [this.cbCondiciones, this.cbxFonetica, this.cbxMayusMinus, this.cbxWords]
        });

        this.searchField = new Ext.app.SearchField({
            pageSize: 15,
            disabled: true,
            store: this.store,
            enableKeyEvents: true,
            //maskRe: /(^[a-zA-Z\d*]+)(\s[a-zA-Z\d*]+)*$/,
            regex: /(^[a-zA-Z\d*]+)(\s[a-zA-Z\d*]+)*$/,
            minLength: 3,
            emptyText: this.idioma.lbSearchEmtpyText
        });

        this.btnAdvancedSearch = new Ext.Button({
            text: this.idioma.lbBA,
            tooltip: this.idioma.ttBtnBA,
            iconCls: 'btn',
            scope: this,
            icon: perfil.dirImg + 'buscaravanzada.png',
            handler: this.toggleAdvanceSearch
        });
    },

    iniEvents: function () {

        this.on('beforeshow', function (fp) {
            fp.getForm().reset();
        }, this);

        this.on('show', function () {
            if (!Ext.isEmpty(this.searchField.getValue())) {

                var values = this.searchField.getValue().split(' ');

                Ext.each(values, function (rec, i) {
                    if (Ext.isEmpty(rec)) {
                        values.splice(i, 1);
                    }
                }, this);

                switch (values.length) {
                    case 1:
                        this.tfNombre.setValue(values[0]);
                        break;
                    case 3:
                        this.tfNombre.setValue(values[0]);
                        this.tfPapel.setValue(values[1]);
                        this.tfSapel.setValue(values[2]);
                        break;
                    case 4:
                        this.tfNombre.setValue(values[0]);
                        this.tfSnombre.setValue(values[1]);
                        this.tfPapel.setValue(values[2]);
                        this.tfSapel.setValue(values[3]);
                        break;
                    default :

                        break;
                }
            }
        }, this);
    },

    toggleAdvanceSearch: function () {
        this.setVisible(this.isVisible() ? false : true);
        this.ownerCt.doLayout();

        this.btnAdvancedSearch.setDisabled(this.isVisible());
        this.searchField.setDisabled(this.isVisible());
    },

    getFastSearch: function (tbar) {
        if (tbar instanceof Ext.Toolbar) {
            tbar.add({xtype: 'tbfill'}, this.idioma.lbBuscarPersona, searchField, btnAdvancedSearch);
        } else if (Ext.isArray(tbar)) {
            tbar.push({xtype: 'tbfill'});
            tbar.push(this.idioma.lbBuscarPersona);
            tbar.push(this.searchField);
            tbar.push(this.btnAdvancedSearch);
        }
        return tbar;
    },

    bindStore: function (st) {
        if (Ext.isEmpty(st)) {
            return;
        }

        if (!Ext.isEmpty(this.store)) {
            this.store.baseParams[this.paramName] = null;
        }

        this.store = st;

        this.store.on('beforeload', function () {
            this.searchField.setDisabled(true);
            this.btnAdvancedSearch.setDisabled(true);

        }, this);

        this.store.on('load', function () {
            this.searchField.setDisabled(false);
            this.btnAdvancedSearch.setDisabled(false);

        }, this);

        return this.searchField.store = this.store;
    },

    generateFormat: function () {
        var params = this.getForm().getValues();
        Ext.apply(params, {
            condicion: this.cbCondiciones.getValue(),
            fonetica: this.cbxFonetica.getValue(),
            minMayus: this.cbxMayusMinus.getValue(),
            allWord: this.cbxWords.getValue()
        });
        this.doSearch(params);
    },

    doSearch: function (params) {
        this.store.baseParams[this.paramName] = Ext.encode(params);
        this.store.reload();

        //this.searchField.triggers[0].show();
        this.hasSearch = true;
    },

    clearSearch: function () {
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams[this.paramName] = null;
        this.store.reload();

        this.searchField.triggers[0].hide();
        this.hasSearch = false;
        this.getForm().reset();
    }
});
