    /**
        * super simple carousel
        * animation between panes happens with css transitions
        */
        function Carousel(element)
        {
            var self = this;
            element = $(element);
            var container = $(">ul", element);
            var panes = $(">ul>li", element);
            var pane_width = 0; 
            var pane_count = panes.length;
            var current_pane = 0;

            /**
             * initial
             */
            this.init = function() {
                setPaneDimensions();
                $(window).on("load resize orientationchange orientation init" , function() {
                    setPaneDimensions();
                });
                
            };


            /**
             * set the pane dimensions and scale the container
             */
   function setPaneDimensions() {
              //  pane_width = screen.width;
                pane_width = window.innerWidth;
                panes.each(function() {
                $(this).width(pane_width);
                });
                container.width(pane_width*pane_count);
                self.showPane(1, true);
            };


            /**
             * show pane by index
             */
            this.showPane = function(index, animate) {
                // between the bounds
                index = Math.max(0, Math.min(index, pane_count-1));
                current_pane = index;
                var offset = -((100/pane_count)*current_pane);
                setContainerOffset(offset, animate);
            };


            function setContainerOffset(percent, animate) {
                container.removeClass("animate");

                if(animate) {
                    container.addClass("animate");
                }

                if(Modernizr.csstransforms3d) {
                    container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
                }
                else if(Modernizr.csstransforms) {
                    container.css("transform", "translate("+ percent +"%,0)");
                }
                else {
                    var px = ((pane_width*pane_count) / 100) * percent;
                    container.css("left", px+"px");
                }
            }

            this.next = function() { return this.showPane(current_pane+1, true); };
            this.prev = function() { return this.showPane(current_pane-1, true); };


            function handleHammer(ev) {
                console.log(ev);
                // disable browser scrolling
                ev.gesture.preventDefault();

                switch(ev.type) {
                    case 'dragright':
                    case 'dragleft':
                        // stick to the finger
                        var pane_offset = -(100/pane_count)*current_pane;
                        var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                        // slow down at the first and last pane
                        if((current_pane == 0 && ev.gesture.direction == "right") ||
                            (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                            drag_offset *= .4;
                        }

                        setContainerOffset(drag_offset + pane_offset);
                        break;

                    case 'swipeleft':
                        self.next(); 
                        getAnotherValue(element);
                        ev.gesture.stopDetect();
                        break;

                    case 'swiperight':
                        self.prev();
                        getCLU((result.results[parseFromString(this.id)].value));
                        $(".loader").fadeIn("slow"); 
                        ev.gesture.stopDetect();
                        break;

                    case 'release':
                        // more then 50% moved, navigate
                        if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                            if(ev.gesture.direction == 'right') {
                                self.prev();
                                getCLU((result.results[parseFromString(this.id)].value));
                            } else {
                                self.next();
                                getAnotherValue(element);
                            }
                        }
                        else {
                            self.showPane(current_pane, true);
                        }
                        break;
                    case 'tap':
                        //getContext($(this).index(),firstTap);
                         getContext(parseFromString(this.id),firstTap);
                        break;
                }
            }

            new Hammer(element[0], {
                drag_lock_to_axis: true }
                    ).on("release dragleft dragright swipeleft swiperight tap", handleHammer);
        }

