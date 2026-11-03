if(Ax.Highcharts.exist()){
    if(!window.Highcharts.fireEvent){
        window.Highcharts.fireEvent = function (el, type, eventArguments, defaultFunction) {
            var e,
                hcEvents = el.hcEvents,
                doc = window.document,
                events,
                len,
                i,
                preventDefault,
                fn;

            eventArguments = eventArguments || {};

            if (doc.createEvent && (el.dispatchEvent || el.fireEvent)) {
                e = doc.createEvent('Events');
                e.initEvent(type, true, true);
                e.target = el;

                extend(e, eventArguments);

                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                } else {
                    el.fireEvent(type, e);
                }

            } else if (hcEvents) {

                events = hcEvents[type] || [];
                len = events.length;

                // Attach a simple preventDefault function to skip default handler if called
                preventDefault = function () {
                    eventArguments.defaultPrevented = true;
                };

                for (i = 0; i < len; i++) {
                    fn = events[i];

                    // eventArguments is never null here
                    if (eventArguments.stopped) {
                        return;
                    }

                    eventArguments.preventDefault = preventDefault;
                    eventArguments.target = el;

                    // If the type is not set, we're running a custom event (#2297). If it is set,
                    // we're running a browser event, and setting it will cause en error in
                    // IE8 (#2465).
                    if (!eventArguments.type) {
                        eventArguments.type = type;
                    }

                    // If the event handler return false, prevent the default handler from executing
                    if (fn.call(el, eventArguments) === false) {
                        eventArguments.preventDefault();
                    }
                }
            }

            // Run the default if not prevented
            if (defaultFunction && !eventArguments.defaultPrevented) {
                defaultFunction(eventArguments);
            }
        };
    }
    if(!window.Highcharts.win) {
        window.Highcharts.win = window;
    }
}