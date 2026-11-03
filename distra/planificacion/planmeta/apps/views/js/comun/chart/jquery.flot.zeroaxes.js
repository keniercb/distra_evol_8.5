(function ($)
    {
        var options =
        {
            reference: {
                x:0,
                y:0,
                color:"rgba(0,0,0,0.5)"
            }
        };
        
        function init(plot) {
            function process(plot,ctx)
            {
                var options = plot.getOptions();
                var plotOffset = plot.getPlotOffset();
                var xaxes = plot.getXAxes()[0];
                var yaxes = plot.getYAxes()[0];
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = options.reference.color;
                ctx.beginPath();
                if(xaxes.p2c(options.reference.x)>=xaxes.p2c(xaxes.min)&& xaxes.p2c(options.reference.x)<=xaxes.p2c(xaxes.max)){
                    ctx.moveTo(plotOffset.left+xaxes.p2c(options.reference.x),yaxes.p2c(yaxes.min)+plotOffset.top);
                    ctx.lineTo(plotOffset.left+xaxes.p2c(options.reference.x),plotOffset.top);
                }
                if(yaxes.p2c(options.reference.y)<=yaxes.p2c(yaxes.min)&&yaxes.p2c(options.reference.y)>=yaxes.p2c(yaxes.max)){
                    ctx.moveTo(plotOffset.left,plotOffset.top + yaxes.p2c(options.reference.y));
                    ctx.lineTo(plotOffset.left+xaxes.p2c(xaxes.max),plotOffset.top + yaxes.p2c(options.reference.y));
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
            plot.hooks.draw.push(process);
        }

        $.plot.plugins.push({
            init: init,
            options: options,
            name: 'zeroaxes',
            version: '0.1'
        });
    })(jQuery);