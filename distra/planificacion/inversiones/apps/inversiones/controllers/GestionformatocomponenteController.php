
<?php

/**
 * Created by JetBrains PhpStorm.
 * User: edilio
 * Date: 29/03/14
 * Time: 7:23
 * To change this template use File | Settings | File Templates.
 */
class GestionformatocomponenteController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function gestionformatocomponenteAction() {
//        $jsayuda = $this->integrator->ayuda->devolverJS();
//        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarFormatosComponentesAction() {
        $model = new ConfFormatoetapaModel();
        $datos = $model->cargarFormatoEtapa($this->_request->getPost());
        echo json_encode(array('data' => array_slice($datos, $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($datos)));
    }

    public function mismoFormatoComponenteAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->mismoFormatoEtapa($this->_request->getPost()));
    }

    public function addModFormatoComponenteAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->adicionarFormatoEtapa($this->_request->getPost()));
    }

    public function cargarDatosModificarFormatoComponenteAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->getFormatoCompById($this->_request->getPost()));
    }

    public function eliminarFormCompAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->eliminarFormatoComponente($this->_request->getPost()));
    }

    public function actDesFormCompAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->actDesactFormatoComponente($this->_request->getPost()));
    }

    public function aprobDesapAction() {
        $model = new ConfFormatoetapaModel();
        echo json_encode($model->aprobDesapFormatoComponente($this->_request->getPost()));
    }

    public function cargarComponentesAction() {
        $model = new DatEtapaModel();
        echo json_encode(array('data' => $model->cargarComponentes($this->_request->getPost())));
    }

    public function cargarNombreComponentesAction() {
        $model = new DatEtapaModel();
        echo json_encode(array('data' => $model->cargarComponentes($this->_request->getPost())));
    }

    public function cargarComponenteByidformatocomponenteAction() {
        $model = new NomNombreetapaModel();
        $datos = $model->cargarNomComponentesByiformatodetapa($this->_request->getPost());
        echo json_encode(array('data' => array_slice($datos, $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($datos)));
    }

    public function cargarCompAsocByidComponenteAction() {
        $model = new NomNombreetapaModel();
        echo json_encode(array('data' => $model->cargarNomComponentesByidetapa($this->_request->getPost())));
    }

    public function mismoComponenteAction() {
        $model = new NomNombreetapaModel();
        echo json_encode(array('data' => $model->mismoComponentes($this->_request->getPost())));
    }

    public function addModComponenteAction() {
        $model = new NomNombreetapaModel();
        echo json_encode(array('data' => $model->addModNomComponentes($this->_request->getPost())));
    }

    public function cargarDatosModificarComponenteAction() {
        $model = new NomNombreetapaModel();
        echo json_encode($model->getCompById($this->_request->getPost()));
    }

    public function eliminarCompAction() {
        $model = new NomNombreetapaModel();
        echo json_encode($model->eliminarComponente(json_decode(stripslashes($this->_request->getPost('idnombrecomponente')))));
    }

    public function asociarComponenteAction() {
        $model = new DatEtapaModel();
        echo json_encode(array('data' => $model->asocComponente($this->_request->getPost(), json_decode(stripslashes($this->_request->getPost('idnombrecomponente'))))));
    }

    public function desasociarComponenteAction() {
        $model = new DatEtapaModel();
        echo json_encode(array('data' => $model->desComponente(json_decode(stripslashes($this->_request->getPost('idnombrecomponente'))))));
    }

    public function cargarFlujoTrabajoAction() {
        $model = new DatFlujotrabajoModel();
        echo json_encode(array('data' => $model->cargarFlujotrabajo($this->_request->getPost())));
    }

    public function actualizarComponentesAction() {
        $model = new DatEtapaModel();
        echo json_encode(array('data' => $model->actualizarComponente(json_decode(stripslashes($this->_request->getPost('planes_prioridad'))))));
    }

    public function cargarElementoByidetapaAction() {
        $model = new DatElementoModel();
        $datos = $model->cargarElementoByidetapa($this->_request->getPost());
        echo json_encode(array('data' => array_slice($datos, $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($datos)));
    }

    public function cargarTipoModeloAction() {
        echo json_encode(array('data' => NomTipomodelo::listarTiposModelo(null, null, 0, 10000000000000, 'codigo', 'ASC'/* ,25695 */)));
    }

    public function addElementoAction() {
        $model = new DatElementoModel();
        try {
           echo json_encode(array('data' => $model->addElemento(json_decode(stripslashes($this->_request->getPost('record'))))));
        } catch (Exception $e) {
            $datos = array();
            echo json_encode(array('datos' => $datos));
        }
        
    }

    public function eliminarElementoAction() {
        $model = new DatElementoModel();
        $banUso = $model->elementoEnUso(json_decode(stripslashes($this->_request->getPost('idelemento'))));
        if ($banUso) {
            echo json_encode(array('data' => $model->eliminarElemento(json_decode(stripslashes($this->_request->getPost('idelemento'))))));
        } else {
            $dat->cod = 4;
            echo json_encode($dat);
        }
    }

    public function cargarDocumentosAction() {
//        $idsubsistema = 30;
//        $estructura = $this->global->Estructura->idestructura;
////        $estructura = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
//        $documentos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $estructura, array());
//        echo json_encode(array('data' => $documentos));
    }

    public function cargarDocSinAsociarAction() {
        
    }

    public function cargarDocAsociadosAction() {
        $model = new DatElementodocModel();
        echo json_encode(array('data' => $model->docAsociadosByidelemento($this->_request->getPost())));
    }

    //metodo para cargar los doc primarios del subsistema, en caso que este asociado al elemento se devuelve checked
    public function cargarDocPrimariosElemetoAction() {

        $idElemento = $this->_request->getPost()['idelemento'];
        $estructura = $this->global->Estructura->idestructura;
        $idsubsistema = 30;
        $datos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $estructura, array());
        foreach($datos as $key => &$dato){
            $iddoc = DatElementodocModel::buscarDocumentoByElemento($idElemento);
            //print_r($iddoc);die;
            if(!empty($iddoc)){
                if($iddoc[0]['iddocumentos'] == $dato->iddoc)
                    $dato->checked = true;
                else
                    $dato->checked = false;
            }else{
                $dato->checked = false;
            }
        }
        echo json_encode(array('data' => $datos));
    }

    public function addElimElementodocAction() {
        $model = new DatElementodocModel();
        echo json_encode(array('data' => $model->addElimdocumento(json_decode(stripslashes($this->_request->getPost('iddocumentos'))), $this->_request->getPost())));
    }


    public function addElementodocAction() {
        $model = new DatElementodocModel();
        echo json_encode($model->addElementodoc($this->_request->getPost()));
    }



}
