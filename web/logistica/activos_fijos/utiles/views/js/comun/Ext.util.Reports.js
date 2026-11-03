/**
 * Created by yoendy on 4/27/2015.
 */
Ext.ns('Ext.util');
Ext.util.ReportsAFT = Ext.extend(Ext.Window, {
    height: 120,
    name: 'myWinReports',
    width: 245,
    layout: 'fit',
    modal: true,
    title: 'Reporte',
    minimizable: false,
    maximizable: false,
    modal:true,
    closable: true,
    urlAction: '',
    report: '',
    method:'',
    formatos:'',
    filters: {},
    initComponent: function() {

        var _this = this;
        _this.urlAction = this.urlAction;
        _this.filters = this.filters;
        _this.method = this.method;
        _this.report = this.report;
        _this.aceptarBtn = {text: 'Aceptar', iconCls:'aceptar', scope: _this, handler: _this.onAceptar.createDelegate()};
        _this.cancelarBtn = {text: 'Cancelar', iconCls:'cancelar', scope: _this, handler: _this.onCancelar.createDelegate()};
        _this.storeFormato = new Ext.data.SimpleStore({
            fields: ['id', 'formato'],
            data:(_this.formatos)?_this.formatos: [['pdf', 'PDF'],/*['xls', 'Excel'],  ['odt', 'Open Offices'],*/ ['rtf', 'Word'], ['html', 'HTML']] // from states.js
        });

        _this.comboFormato = new Ext.form.ComboBox({
            store: _this.storeFormato,
            name: 'format',
            hiddenName: 'formato',
            displayField: 'formato',
            valueField: 'id',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            fieldLabel: "Formato",
            selectOnFocus: true
        });

        _this.formFormato = new Ext.form.FormPanel({
            labelWidth: 50, // label settings here cascade unless overridden
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: 150},
            items: [_this.comboFormato]
        });

       _this.items = [_this.formFormato];
       _this.buttons = [_this.cancelarBtn, _this.aceptarBtn];
        Ext.util.ReportsAFT.superclass.initComponent.call(this);
    },
    onAceptar: function(_this) {

        if (_this.scope.formFormato.getForm().isValid())
        {

            var datas = {};
            datas.format = _this.scope.formFormato.getForm().getValues().formato;
            datas.report = _this.scope.report;
            datas.method = _this.scope.method;
            datas.filters = _this.scope.filters;
            if(/*(datas.format !== "xls") ||*/ (datas.format !== "odt") /*|| (datas.format !== "html")*/){
                var settings = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width +',height=' + screen.height;
                var wtitle = 'Reporte';
                window.open(_this.scope.urlAction + '?datas=' + Ext.encode(datas), wtitle, settings);
            } else {
                window.open(_this.scope.urlAction + '?datas=' + Ext.encode(datas), '');
            }

        } else {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Escoga un formato',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },
    onCancelar: function(_this) {
        _this.scope.close();
    }
});