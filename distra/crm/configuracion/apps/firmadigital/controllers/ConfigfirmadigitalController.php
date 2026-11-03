<?php

/**
 * Componente para gestionar la firma figital
 *
 *
 * @version 1.0
 */
class ConfigfirmadigitalController extends ZendExt_Controller_Secure
{

    private $model;

    /**
     * Constuctor de la clase
     */
    public function init()
    {
        parent::init();
        $this->model = FirmaDigitalModel::getInstance();
    }



    public function configfirmadigitalAction()
    {
        $this->render();
    }

    public function getFileConfiguracionAction(){
        $r['code'] = $this->model->getDataFile();
        echo json_encode($r);
    }
    public function saveFileConfiguracionAction(){
        $code = $this->_request->getPost('code');
        $r['success'] = $this->model->saveFile($code);
        echo json_encode($r);
    }

    /**
     * Proceso Firma Digital
     *
     */

    public function firmaDigitalAction(){
        $params = $this->_request->getParams();
        if(isset($params['variables']) && isset($params['proceso']) && isset($params['documentos'])){
            if(!is_array($params['documentos'])){
                $params['documentos'] = json_decode($params['documentos'],true);
            }
            if(!is_array($params['variables'])){
                $params['variables'] = json_decode($params['variables'],true);
            }
            try{
                $r = $this->model->firmaDigital($params['proceso'],$params['variables'],$params['documentos']);
            } catch (Exception $e){
                $r = array(
                    'success' => false,
                    'mensajes' => $e->getMessage()
                );
            }
        } else {
            $r = array(
                'success' => false,
                'mensajes' => 'Hay paramestros incorrectos o vacios'
            );
        }
        echo json_encode($r);
    }

    public function listarDocumentosPorCasoAction(){
        $params = $this->_request->getParams();
        try{
            $r = $this->model->listarDocumentosPorCaso($params['caseId']);
        } catch (Exception $e){
            $r = array(
                'success' => false,
                'mensajes' => $e->getMessage()
            );
        }
        echo json_encode($r);
    }

    public function mostrarCasoAction(){
        $params = $this->_request->getParams();
        $result = $this->model->mostrarCaso($params['caseId']);
       // print_r($result);die;
        echo json_encode(array(
            'success' => true,
            'data' => $result
        ));
    }


   public function descargarDocumentosAction(){
        $params = $this->_request->getParams();
        return $this->model->descargarDocumentos($params);
    }

}
