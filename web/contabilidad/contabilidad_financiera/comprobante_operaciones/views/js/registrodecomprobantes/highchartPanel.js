/*
 * Ext.ux.HighchartPanel
 * @author Daniel Kloosterman
 * @contact buz.i286@gmail.com
 *
 * http://www.i286.org/?p=5
 */

Ext.ux.HighchartPanel = Ext.extend(Ext.Panel, {

    /**
     * Chart object
     */
    chart: null,

    initComponent: function(){
        this.on('afterlayout', this.renderChart, this);
        
        Ext.ux.HighchartPanel.superclass.initComponent.call(this);
    },

    /**
     * Renders the chart
     */
    renderChart: function(){
        /**
         * This will recreate the chart when the layout has changed.
         * The highchart lib should have functions like resize(w,h).
         * since it doesnt have these functions yet, we have to do it this
         * dirty way.
         */
        Ext.apply(this.chartConfig.chart, {
            renderTo: this.body.dom
        });
        this.chart = new Highcharts.Chart(this.chartConfig);
    }
});