
<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 2/04/19
 * Time: 7:23
 */
class TrazasinversionesController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function trazasinversionesAction() {
       /* $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;*/
        $this->render();
    }

    public function getTrazasInversionesAction() {
        ini_set("max_execution_time", 7200); //2hora
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 1000;
        $params['filtros'] = $this->_request->getPost('filtros');
        
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
               if ($datos ['field'] == 'estructura'){
                    $params ['filtros']['estructura'] = $datos ['data'] ['value'];                   
               }
                  if ($datos ['field'] == 'inversion') {
                    $params ['filtros']['inversion'] = $datos ['data'] ['value'];
                }  
            }
        }
        
        
        $objtrazainversiones = new HisTrazasinversionesModel();
        $data = $objtrazainversiones->getTrazasInversiones($params);
        echo json_encode(array("data" =>$data, "total"=>$data[0]['total']
        ));
    }

    
     public function listarComboAccionesTrazaAction() {
        $model = new HisTrazasinversionesModel();
        $result = $model->cargarAccionesTraza();
        echo json_encode($result);
    }
    
    
}
