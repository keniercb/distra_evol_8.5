Ext.ns('Ext.components');
Ext.components.winReporte = new Ext.extend(Ext.Window, {
    title: 'Configuración del reporte',
    modal: true,
    width: '35%',
    constrain: true,
    resizable: false,
    height: 220,
    layout: 'border',
    initComponent: function () {
        var self = this;

        this.lbDenominacionReporte = new Ext.form.TextField({
            id: 'lbDenominacionReporte' + self.id,
            anchor: '100%',
            fieldLabel: 'Denominaci&oacute;n del reporte',
            maskRe: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ\-_/.\s]$/,
            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
            regexText: 'Solo admite letras y los caracteres especiales ( _-)',
            maxLength: 50,
            mode: 'local',
            enableKeyEvents: true,
            allowBlank: false,
            nextTab: 'comBoxFormato' + self.id,
            prevTab: 'btnAceptarRep' + self.id,
        });
        this.chekBoxFecha = new Ext.form.Checkbox({
            id: 'chekBoxFecha',
            hideLabel: true,
            boxLabel: 'Mostrar fecha de generado'

        });
        this.chekBoxUser = new Ext.form.Checkbox({
            id: 'chekBoxUser',
            hideLabel: true,
            boxLabel: 'Mostrar usuario'
        });
        this.storeFormato = new Ext.data.SimpleStore({
            fields: ['idformato', 'nombreimg', 'denominacion'],
            data: [
                ['DOC', 'page_word', 'Documento word (*.doc)'],
                /*['XLS', 'page_excel','Hoja de c&aacute;lculo'],*/
                ['HTML', 'html', 'Página web (*.html)']
                //['PDF', 'page_acrobat', 'Documento Adobe acrobat (*.pdf)']
            ]
        });
        this.comBoxFormato = new Ext.form.ComboBox({
            id: 'comBoxFormato' + self.id,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item"><img width="13" height="13" src="/pvd/comun/views/images/{nombreimg}.png">  {denominacion}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idformato',
            hiddenName: 'idformato',
            emptyText: 'Seleccione...',
            forceSelection: true,
            anchor: '100%',
            displayField: 'denominacion',
            store: self.storeFormato,
            allowBlank: false,
            fieldLabel: 'Formato de reporte',
            mode: 'local',
            nextTab: 'btnCancelarRep' + self.id,
            prevTab: 'lbDenominacionReporte' + self.id,
        });
        this.btnAceptarRep = new Ext.Button({
            //icon: perfil.dirImg + 'aceptar.png',
            id: 'btnAceptarRep' + self.id,
            iconCls: 'aceptar',
            tooltip: 'Mostrar reporte <b>(Enter)</b>',
            text: 'Aceptar',
            nextTab: 'lbDenominacionReporte' + self.id,
            prevTab: 'btnCancelarRep' + self.id,
            handler: function () {
                var datos = Ext.urlEncode({
                    titulo: self.lbDenominacionReporte.getValue(),
                    header: Ext.encode(self.params.columns),
                    params: Ext.encode(self.params.params),
                    formato: self.comBoxFormato.getValue(),
                    /* fecha: self.chekBoxFecha.getValue(),
                     usuario: self.chekBoxUser.getValue(),*/
                    fecha: self.fecha,
                    usuario: self.user,
                    tiporeporte: self.params.tiporeporte
                });
                if (self.formDatoReporte.getForm().isValid()) {
                    if (self.comBoxFormato.getValue() == 'XLS') {
                        window.open(self.params.url + '?' + datos);
                    } else if (self.comBoxFormato.getValue() == 'PDF') {
                        window.open(self.params.url + '?' + datos);
                    } else if (self.comBoxFormato.getValue() == 'DOC') {
                        window.open(self.params.url + '?' + datos);
                    } else if (self.comBoxFormato.getValue() == 'HTML') {
                        window.open(self.params.url + '?' + datos);
                    }
                }
                self.close();
            },
            listeners: {                    
                disable: function() {
                    self.btnCancelarRep.nextTab = 'lbDenominacionReporte' + self.id;
                    self.lbDenominacionReporte.prevTab = 'btnCancelarRep' + self.id;                      
                },
                enable: function() {
                    self.btnCancelarRep.nextTab = 'btnAceptarRep' + self.id;
                    self.lbDenominacionReporte.prevTab = 'btnAceptarRep' + self.id;                   
                }
            }
        });    
        
        this.btnCancelarRep = new Ext.Button({
            //icon: perfil.dirImg + 'cancelar.png',
            id: 'btnCancelarRep' + self.id,
            tooltip: 'Cancelar reporte <b>(Alt+X)</b>',
            iconCls: 'cancelar',
            text: 'Cancelar',
            nextTab: 'btnAceptarRep' + self.id,
            prevTab: 'comBoxFormato' + self.id,
            handler: function () {
                self.close();
            }

        });
        this.formDatoReporte = new Ext.form.FormPanel({
            labelWidth: 75,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: '25%'},
            region: 'center',
            labelAlign: 'top',
            margins: '5 5 5 5',
            items: [self.lbDenominacionReporte, self.comBoxFormato,
                {
                    layout: 'column',
                    anchor: '100%',

                }]
        });
        this.items = [self.formDatoReporte];
        this.tbar = [
            {
                // text: 'Toggle Me',
                enableToggle: true,
                pressed: false,
                iconCls: 'btn',
                tooltip: 'Mostrar usuario en el reporte',
                icon: "\/pvd\/comun\/views\/images\/user.png",
                toggleHandler: function () {
                    if (this.pressed) {
                        self.user = true;
                        mostrarMensaje('1', '<b>Activado:</b> Mostrar usuario en el reporte.');
                    } else {
                        self.user = false;
                        mostrarMensaje('1', '<b>Desactivado:</b> Mostrar usuario en el reporte.');
                    }
                }

            }, '-',
            {
                //text: 'Toggle Me',
                enableToggle: true,
                pressed: false,
                iconCls: 'btn',
                tooltip: 'Mostrar fecha en el reporte',
                icon: "\/pvd\/comun\/views\/images\/date.png",
                toggleHandler: function () {
                    if (this.pressed) {
                        self.fecha = true;
                        mostrarMensaje('1', '<b>Activado:</b> Mostrar fecha de generado en el reporte.');
                    } else {
                        self.fecha = false;
                        mostrarMensaje('1', '<b>Desactivado:</b> Mostrar fecha de generado en el reporte.');
                    }
                }
            }
        ]
        
        this.keys = [
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    self.btnCancelarRep.handler();
                }
            },
            {
                key: 13,
                //alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAceptarRep.disabled) {
                        self.btnAceptarRep.handler();
                    }

                }
            }
        ];
        
        this.buttons = [self.btnCancelarRep, self.btnAceptarRep];
        Ext.components.winReporte.superclass.initComponent.call(this);
        this.on('show', function (cmp) {
            this.lbDenominacionReporte.focus(true, 300);
        }, this);
    }
});
