/**
 * Created by hero on 23/06/16.
 */
Ext.define("Dashboard.validator", {
    timerange: function (val, field) {
        /// <summary>
        /// This will validate two datefields
        /// </summary>

        var me = this; //will be the form, containing datefields

        var time = field.parseDate(val);
        if (!time) {
            return;
        }
        if (field.startTimeField && (!this.timeRangeMax || (time.getTime() != this.timeRangeMax.getTime()))) {
            var start = me.down('datefield[name=' + field.startTimeField + ']');
            start.maxValue = time;
            start.validate();
            this.timeRangeMax = time;
        }
        else if (field.endTimeField && (!this.timeRangeMin || (time.getTime() != this.timeRangeMin.getTime()))) {
            var end = me.down('datefield[name=' + field.endTimeField + ']');
            end.minValue = time;
            end.validate();
            this.timeRangeMin = time;
        }
        return true;
    }
});

/*
* {
 xtype: 'datefield',
 fieldLabel: 'From',
 name: 'from_date',
 format: 'Y-m-d',
 editable: false,

 endTimePeriod:'to_date', //below component
 validationEvent: 'change',
 validator: function (value) {
 return me.timerange(value, this);
 }
 },
 {
 xtype: 'datefield',
 fieldLabel: 'To',
 format: 'Y-m-d',
 name: 'to_date',
 editable: false,

 startTimeField:'from_date', //above component
 validationEvent: 'change',
 validator: function (value) {
 return me.timerange(value, this);
 }
 }
 */



Ext.apply(Ext.form.VTypes, {
    daterange : function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDate && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDate); //field.up('form').down('#'+field.startDate);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;

        } else if (field.endDate && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDate); //field.up('form').down('#' + field.endDate);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    }
    //daterangeText : Ext.BUNDLE.getMsg('Label.daterangetext')
});
