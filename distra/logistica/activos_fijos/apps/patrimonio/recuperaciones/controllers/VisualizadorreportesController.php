<?php
class VisualizadorreportesController extends ZendExt_Controller_Secure {  
    function init(){
        parent :: init();    
    }
    public function visualizadorreportesAction(){     
        $this->render();
    }
}
