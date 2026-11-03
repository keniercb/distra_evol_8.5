Ext.define('ConfPlantilla.controller.Estructura', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'DvEstructura', selector: 'dvestructura'},
        {ref: 'WinEditEstructura', selector: 'wineditestructura'}
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "dvestructura dataview": {
                    selectionchange: this.onSelectionChangeEstructura
                },
                "dvestructura button[action=addestructura] menu": {
                    click: Ext.Function.pass(this.showWinEditEstructura, [true], this),
                },
                "dvestructura button[action=modestructura]": {
                    click: Ext.Function.pass(this.showWinEditEstructura, [false], this),
                },
                "dvestructura button[action=elimestructura]": {
                    click: this.eliminarEstructura,
                },
                "wineditestructura button[action=aceptar]":{
                    click: this.saveEstructura
                },
                "wineditestructura button[action=aplicar]":{
                    click: this.saveEstructura
                },
                "wineditestructura button[action=cerrar]":{
                    click: this.closeWinEditEstructura
                },
                'wineditestructura form filefield': {
                    change: this.onSelectImgenFile
                }
            }
        });
    },
    onSelectionChangeEstructura: function(sm, select){
        this.getDvEstructura().down('button[action=modestructura]').setDisabled( select.length == 0 );
        this.getDvEstructura().down('button[action=elimestructura]').setDisabled( select.length == 0);
    },
    showWinEditEstructura: function(btnAdd, menu, item){
        var win = this.getWinEditEstuctura(),
            recordSelected = this.getDvEstructura().down('dataview').getSelectionModel().getSelection()[0];

        win.setActionInsert(btnAdd);
        win.show((btnAdd)? item.estructType : recordSelected.get('tipo'));

        if(!btnAdd)
            win.loadValues(recordSelected);
    },
    getWinEditEstuctura: function(){
        if(!this.wineditestructura){
            this.wineditestructura = new Ext.create('ConfPlantilla.view.WinEditEstructura');
        }
        return this.wineditestructura;
    },
    closeWinEditEstructura: function(){
        this.getWinEditEstuctura().hide();
    },
    saveEstructura: function(btn){
        var me = this,
            win = this.getWinEditEstuctura(),
            store = me.getDvEstructura().down('dataview').getStore(),
            saveData = win.formEstructura.getForm().getValues(),
            model;

        saveData.tipo = win.estructype;
        saveData.idestructura = (win.getActionInsert())?'new_'+Ext.id():saveData.idestructura;

        if(me.isValidLocationUpdate(saveData, win.getActionInsert())){
            if(win.getActionInsert())
                store.add(saveData);
            else{
                model = store.findRecord('idestructura', saveData['idestructura']);
                for(var i in saveData)
                    model.set(i, saveData[i]);
            }

            if(btn.action == 'aplicar')
                win.resetComponents();
            else
                win.hide();

            mostrarMensaje(1, me.etiquetas[(win.getActionInsert())?'msgSuccessInsertEstructura':'msgSuccessUpdateEstructura']);
        }else
            mostrarMensaje(6, me.etiquetas.msgInvalidPosicionEstruct);



    },
    isValidLocationUpdate: function(val, actionInsert){
        var me = this,
            store = me.getDvEstructura().down('dataview').getStore(),
            valid = true,
            smallPosicion = ['l', 'c', 'r'];

        store.each(function(record){
            var iqualRegion = record.get('region') == val['region'],
                equalLocalizacion = iqualRegion && record.get('posicion') == val['posicion'],
                distintEstruc = record.get('idestructura') != val['idestructura'],
                existSmallEstruct = val['posicion'] == 'h' && iqualRegion && smallPosicion.indexOf( record.get('posicion')) != -1,
                existHorizontalEstruct = smallPosicion.indexOf(val['posicion']) != -1 && iqualRegion && record.get('posicion') == 'h';

            if(actionInsert){
                if(equalLocalizacion || existSmallEstruct || existHorizontalEstruct)
                    valid = false;
            }else{
                if((equalLocalizacion || existSmallEstruct || existHorizontalEstruct) && distintEstruc)
                    valid = false;
            }
        }, me);

        return valid;
    },
    onSelectImgenFile: function(field, val){
        var me = this,
            fieldHidden = this.getWinEditEstuctura().down('form field[name=img]');

        if( field.isValid() ){
            var file = field.getEl().down('input[type=file]').dom.files[0],
                reader = new FileReader();

            reader.onload = function (evt) {
                var bytes = new Uint8Array(evt.target.result);
                fieldHidden.setValue(Base64.encodeByteArray(bytes));
            };

            reader.readAsArrayBuffer(file);
        }else
            fieldHidden.reset();
    },
    eliminarEstructura: function(){
        var me = this;

        mostrarMensaje(2, this.etiquetas.msgElimEstructura, function (response) {
            if (response === 'ok') {

                var dvEstruc = me.getDvEstructura().down('dataview'),
                    selection = dvEstruc.getSelectionModel().getSelection()[0],
                    store = dvEstruc.getStore();

                store.remove(selection);

                mostrarMensaje(1, me.etiquetas.msgSuccessDeleteEstructura);
            }
        });
    }
});