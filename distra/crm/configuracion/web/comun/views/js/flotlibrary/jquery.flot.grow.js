/*
 * The MIT License

Copyright (c) 2010 by Juergen Marsch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function ($)
{
    var options =

    {
        series: {
            grow: {
                active: true,
                valueIndex: 1,
                stepDelay: 20,
                steps:100,
                stepMode: "linear",
                stepDirection: "up"
            }
        }
    };
    function init(plot) {
        var done = false;
        var growfunc;
        var plt = plot;
        var data = null;
        var opt = null;
        var valueIndex;
        plot.hooks.bindEvents.push(processbindEvents);
        plot.hooks.drawSeries.push(processSeries);
        function processSeries(plot, canvascontext, series)
        {
            opt = plot.getOptions();
            valueIndex = opt.series.grow.valueIndex;
            if(opt.series.grow.active == true)
            {
                if (done == false){
                    data = plot.getData();
                    data.actualStep = 0;
                    for (var j = 0; j < data.length; j++)
                    {
                        data[j].dataOrg = clone(data[j].data);
                        for (var i = 0; i < data[j].data.length; i++)
                            data[j].data[i][valueIndex] = 0;
                                                
                    }
                    plot.setData(data);
                    done = true;
                }
            }
        }
        function processbindEvents(plot,eventHolder)
        {
            opt = plot.getOptions();
            if (opt.series.grow.active == true)
            {
                var d = plot.getData();
                for (var j = 0; j < data.length; j++) {
                    opt.series.grow.steps = Math.max(opt.series.grow.steps, d[j].grow.steps);
                }
                if(opt.series.grow.stepDelay == 0) opt.series.grow.stepDelay++;
                growfunc = window.setInterval(growing, opt.series.grow.stepDelay);
            }
        }
        function growing()
        {
            if (data.actualStep < opt.series.grow.steps)

            {
                data.actualStep++;
                for(var j = 0; j < data.length; j++)
                {
                    if (typeof data[j].grow.stepMode == "function")

                    {
                        data[j].grow.stepMode(data[j],data.actualStep,valueIndex);
                    }
                    else
                    {
                        if (data[j].grow.stepMode == "linear") growLinear(data[j]);
                        else if (data[j].grow.stepMode == "maximum") growMaximum(data[j]);
                        else if (data[j].grow.stepMode == "delay") growDelay(data[j]);
                        else growNone(data[j]);
                    }
                }
                plt.setData(data);
                plt.draw();
            }
            else
            {
                window.clearInterval(growfunc);
            }
            function growNone(serie)
            {
                if (data.actualStep == 1)

                {
                    for (var i = 0; i < serie.data.length; i++)

                    {
                            serie.data[i][valueIndex] = serie.dataOrg[i][valueIndex];
                        }
                }
            }
            function growLinear(serie)
            {
                if (data.actualStep <= serie.grow.steps)

                {
                    for (var i = 0; i < serie.data.length; i++)

                    {
                            if (serie.grow.stepDirection == "up")

                            {
                                serie.data[i][valueIndex] = serie.dataOrg[i][valueIndex] / serie.grow.steps * data.actualStep;
                            }
                            else if(serie.grow.stepDirection == "down")
                            {
                                serie.data[i][valueIndex] = serie.dataOrg[i][valueIndex] + (serie.yaxis.max - serie.dataOrg[i][valueIndex]) / serie.grow.steps * (serie.grow.steps - data.actualStep);
                            }
                        }
                }
            }
            function growMaximum(serie)
            {
                if (data.actualStep <= serie.grow.steps)

                {
                    for (var i = 0; i < serie.data.length; i++)

                    {
                            if (serie.grow.stepDirection == "up")

                            {
                                serie.data[i][valueIndex] = Math.min(serie.dataOrg[i][valueIndex], serie.yaxis.max / serie.grow.steps * data.actualStep);
                            }
                            else if (serie.grow.stepDirection == "down")
                            {
                                serie.data[i][valueIndex] = Math.max(serie.dataOrg[i][valueIndex], serie.yaxis.max / serie.grow.steps * (serie.grow.steps - data.actualStep) );
                            }
                        }
                }
            }
            function growDelay(serie)
            {
                if (data.actualStep == serie.grow.steps)

                {
                    for (var i = 0; i < serie.data.length; i++)

                    {
                            serie.data[i][valueIndex] = serie.dataOrg[i][valueIndex];
                        }
                }
            }
        }
        function clone(obj)
        {
            if(obj == null || typeof(obj) != 'object') return obj;
            var temp = new obj.constructor();
            for(var key in obj)	temp[key] = clone(obj[key]);
            return temp;
        }
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'grow',
        version: '0.2'
    });
})(jQuery);