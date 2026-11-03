<?php

class ImportarInversionesController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar los atributos de la clase
     *
     * @return void
     */
    public function init() {
        parent::init();
        //Aumentar el Tamaño Máximo al Cargar Archivos
        ini_set("upload_max_filesize", '400M'); //M=MegaByte
        ini_set("post_max_size", '450M'); //M=MegaByte
        ini_set("max_execution_time", 7200); //120 min de conexion 2 hrs
    }
     public function importarinversionesAction() {
        $jsayuda = $this->integrator->ayuda->devolverJS();
        try {
            $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function fnImportarInversionesAction() {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['tipoexcel'] = $this->_request->getPost('tipoexcel');
        $parametros['iddominio'] = $this->global->Perfil->iddominio;
        $filename = $_FILES['file']['tmp_name'];
        $parametros['idconcepto'] = 10;
        $parametros['file'] = $filename;
        $fileextension = $_FILES['file']['type'];
        $filename = explode('.', $_FILES['file']['name']);
        if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
        ) {
            $res = DatImportarModel::importarFichero($parametros);
            echo json_encode($res);
        } else {
            echo json_encode(array('cod' => 53));
        }
    }

}
