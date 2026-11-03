<?php

class MainController extends ZendExt_Controller_Secure
{

    function init()
    {
        ob_start();
        $this->model = new MainModel();
        parent::init();
    }

    /**
     * Funcionalidad que renderiza la vista principal del subsistema CRM
     *
     */
    public function mainAction()
    {
        $this->render();
    }

    /**
     * Funcionalidad que sincroniza los modulos de la app con funcionalidades de seguridad
     * de acuerdo a los permisos que tenga el usuario sobre estas.
     */
    public function securitySyncAction()
    {
        $post = $this->_request->getPost();
        echo json_encode($this->model->securitySync($post));
    }

    /**
     * Funcionalidad que crea los accesos directos de los modulos
     */
    public function saveShortcutsAction()
    {
        $post = $this->_request->getPost();
        echo json_encode($this->model->saveShortcuts($post));
    }

    public function getChartDataAction()
    {
        $post = $this->_request->getParams();
        $data = $this->model->getChartData($post);
        echo json_encode(array('data' => $data));
    }
    /**
     * Funcionalidad que habilita y desabilita los modulos del subsistema CRM
     *
     */
    public function loadActiveModulesAction()
    {
        $modulesmodel = new ModulesModel();
        echo json_encode($modulesmodel->load());
    }

    public function guardarHerenciaAction(){
        return json_encode(array('success'=>true));
    }

    public function enviarCorreoAction(){
        try {
            $post = $this->_request->getPost();
//            print_r($this->_request->getPost());
//            print('------');
//            print_r($this->_request->getParams());die;
            $mailModel=new MailModel();
            $modelName = $this->_request->getPost('modelName', 'MainModel');
            $contenido=array('cuerpo'=> 'Gestion Comercial');
            if($modelName){
                try{
                    $model=new $modelName();
                }catch(Exception $e){
                    $model=new MainModel();
                }
                $contenido=$model->obtenerContenidoCorreo($post);
            }
            if(isset($post['sinComprobar']))
                $contenido['sinComprobar']=$post['sinComprobar'];
            $resultado = $mailModel->enviarCorreo($contenido);

            if(is_array($resultado)){
                if($resultado['success']==true)
                    $this->eliminarAttachment($contenido['attachment']);
                echo json_encode($resultado);
            }else{
                if($contenido['attachment'])
                    $this->eliminarAttachment($contenido['attachment']);
                echo json_encode(array('success'=>false, 'mensaje'=>$resultado));
            }
        }catch(Exception $e){
            echo json_encode(array('success'=>false, 'mensaje'=>$e->getMessage(), 'code'=>$e->getCode()));
        }
    }

    public function eliminarArchivoAction(){
        $result=$this->model->eliminarArchivo($this->_request->getParams()['ruta']);
        echo json_encode(array('success'=>$result));
    }

    public function eliminarAttachment($attachment){
        try{
            foreach($attachment as $att){
                $att=(array)$att;
                $this->model->eliminarArchivo($att['ruta']);
            }
        }catch(Exception $e){
            throw $e;
        }
    }

    public function mostrarDocumentoAction(){
        try {
            $params = $this->_request->getParams();
            $aux=explode('index.php/',$_SERVER['HTTP_REFERER']);
            $path=$aux[0];
            $aux2=explode('/web/crm/application/', $params['ruta']);
            $path2=$aux2[1];
//            print_r($path.''.$aux2[1]);die;
//            print_r($_SERVER);print('    ---    ');
////            die;
////            print_r($params['ruta'].' '. file_exists($params['ruta']));die;
            if($params['ruta'] && file_exists($params['ruta'])){
//application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//                header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                header('Content-Type: application/vnd.ms-excel');
                header('Content-Disposition: attachment; filename="' . $params['nombre'] . '.' . $params['formato'] .'"');

//                header('Content-Type: application/octet-stream');
                header('Content-Description: File Transfer');
                header("Content-length: ".filesize($params['ruta']));
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header("Content-Type: application/force-download");
//                header('Cache-Control: max-age=0');

                header ('Location: '.$path.''.$path2);
//                print(ob_get_contents());die;
                ob_end_clean();
                $resultado=readfile($params['ruta']);
                exit;
                if($resultado==false)
                    echo json_encode(array('success'=>false, 'mensaje'=>'No ha podido leerse el archivo.'));
            }else{
                echo json_encode(array('success'=>false, 'mensaje'=>'No existe el archivo en la ruta especificada.'));
            }
        }catch(Exception $e){
            echo json_encode(array('success'=>false, 'mensaje'=>$e->getMessage()));
        }
    }

    public function getTamannoArchivosTemporalesAction(){
        $size=0;
        $displaysize='0 bytes';
        $carpetatemp=$this->model->getRutaTemporal();
        if(is_dir($carpetatemp)) {
            $dir = opendir($carpetatemp);
            while ($element = readdir($dir)){
                if ($element != '' && $element != '.' && $element != '..'){
                    $element = $carpetatemp.$element;
                    $size += filesize($element);
                }
            }
            $aux=pow(1024, 2);
            if($size<1024)
                $displaysize=$size.' bytes';
            else if(1024<$size && $size<$aux)
                $displaysize=round($size/1024, 2).' KB';
            else
                $displaysize=round($size/$aux, 2).' MB';
        }else {
            echo json_encode(array('success' => false, 'msg' => 'No existe la carpeta temporal.'));
        }
        echo json_encode(array('success'=>true, 'size'=>$size, 'displaysize'=>$displaysize));
    }

    public function limpiarTemporalesAction(){
        $carpetatemp=$this->model->getRutaTemporal();
        if(is_dir($carpetatemp)) {
            $dir = opendir($carpetatemp);
            while ($element = readdir($dir)){
                if ($element != '' && $element != '.' && $element != '..'){
                    if(is_file($carpetatemp.$element))
                        $this->model->eliminarArchivo($carpetatemp.$element);
                }
            }
        }else {
            echo json_encode(array('success' => false, 'msg' => 'No existe la carpeta temporal.'));
        }
//        $result=$this->model->eliminarArchivo($this->_request->getParams()['ruta']);
        echo json_encode(array('success'=>true));
    }
}
