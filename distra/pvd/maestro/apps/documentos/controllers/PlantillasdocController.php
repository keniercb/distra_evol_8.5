<?php
class PlantillasdocController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function plantillasdocAction()
    {
        $this->view->plantilla = ZendExt_IoC_Inter::getInstance()->maestro->mostrarIUPlantilla();
        $this->render();
    }

    public function getTemplatesAction()
    {
        $arr = array(array('title' => 'Template 1', 'description' => '', 'url' => 'resources/plantillas/ha.htm'),
            array('title' => 'Template 2', 'description' => '', 'url' => 'resources/plantillas/test.htm'));
        echo json_encode($arr);
    }

    function getPlantillasAction()
    {
        $modeloNegocio = new DatPlantilladocModel();
        $arr = $modeloNegocio->getDocumentos(
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    function getEstructuraAction()
    {
        try {
            $idest = $this->_getParam('idestructura');
            if ($this->_getParam('node') == 0 && $idest != 0) {
                $id = $idest;
            } else {
                $id = $this->_getParam('node');
            }
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
            $datos = Array();
            $pos = 0;
            foreach ($r as $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    if ($est->idorgano == -2 || $est->idconcepto == 3 ||
                        $est->idconcepto == 4 || $est->idconcepto == 1) {
                        $datos[$pos]->checked = false;
                    }
                    $pos++;
                }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    function addPlantillaAction()
    {
        $obj = new DatPlantilladocModel();
        $idconfig = json_decode(stripslashes($this->_getParam('arrayIdConfig')));
        $tipoplantconfig = json_decode(stripslashes($this->_getParam('tipoplantconfig')));
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $res = $obj->addDocumento(
                $this->_getParam('denominacion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion'),
                $idconfig,
                $tipoplantconfig
            );
            echo Zend_Json::encode($res);
        } else
            echo Zend_Json::encode(2);
    }

    function updatePlantillaAction()
    {
        $obj = new DatPlantilladocModel();
        $idconfig = json_decode(stripslashes($this->_getParam('arrayIdConfig')));
        $tipoplantconfig = json_decode(stripslashes($this->_getParam('tipoplantconfig')));
        $r = $obj->updateDoc(
            $this->_getParam('idplantilla'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion'),
            $idconfig,
            $tipoplantconfig
        );
        echo Zend_Json::encode($r);
    }

    function updateContenidoAction()
    {
        $obj = new DatPlantilladocModel();
        $r = $obj->updateContenido(
            $this->_getParam('idplantilla'),
            $this->_getParam('contens')
        );
        echo Zend_Json::encode($r);
    }

    function deletePlantillaAction()
    {
        $obj = new DatPlantilladocModel();
        $resp = $obj->deleteDoc($this->_getParam('idplantilla'));
        echo json_encode($resp);
    }

    function getConceptosAction()
    {
        $obj = new DatPlantilladocModel();
        $resp = $obj->getConceptos($this->_getParam('idconfiguracion'), $this->_getParam('idcampo'));
        echo json_encode($resp);
    }

    function getContenidoByIdDocumentoAction()
    {
        $obj = new DatPlantilladocModel();
        $html = $obj->getContenidoByIdPlantilla($this->_getParam('idplantilla'));
        $resp->data = "<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD HTML 4.0 Transitional\/\/EN\""
            . " \"http:\/\/www.w3.org\/TR\/REC-html40\/loose.dtd\">\n<html><body>" . $html['contenido'] . "</body></html>";
        $resp->contenido = ($html['contenido']) ? 1 : 0;
        echo json_encode($resp);
    }

    function getConfiguracionesAction()
    {
        $modeloNegocio = new DatPlantilladocModel();
        $arr = $modeloNegocio->getConfiguraciones();
        echo Zend_Json::encode($arr);
    }

    function getConfiguracionesByIdPlantillaAction()
    {
        $modeloNegocio = new ConfPlantilladocrecModel();
        $arr = $modeloNegocio->getConfiguracionesByIdPlantilla($this->_getParam('idplantilla'));
        echo Zend_Json::encode($arr);
    }

    function getConfAsigByIdPlantillaAction()
    {
        $modeloNegocio = new DatPlantilladocModel();
        $arr = $modeloNegocio->getConfigAsigByIdplantilla($this->_getParam('idplantilla'));
        echo Zend_Json::encode($arr);
    }

    function getConceptosAdicionalesAction()
    {
        $modeloNegocio = new ConceptosModel();
        $arr = $modeloNegocio->getConceptos();
        echo Zend_Json::encode($arr);
    }

    function replicarEstructuraAction()
    {
        $estructuras = json_decode($this->_getParam('estructuras'));
        $obj = new DatPlantilladocModel();
        $resp = $obj->replicarEstructura($this->_getParam('idplantilla'), $estructuras, $this->_getParam('entidad'));
        echo json_encode($resp);
    }

    function guardarConfigAsignacionAction() {
        $id =  json_decode(stripslashes($this->_getParam('id')));
        $idplantilla =  json_decode(stripslashes($this->_getParam('idplantilla')));
        $obj = new DatPlantilladocModel();
        $obj->guardarConfAsig($id, $idplantilla);
        echo json_encode('ok');
    }
}
