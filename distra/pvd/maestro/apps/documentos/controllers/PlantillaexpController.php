<?php

class PlantillaexpController extends ZendExt_Controller_Secure {

    private $persona;

    function init() {
        parent::init();
    }

    function plantillaexpAction() {
        $this->render();
    }

    function generarPdfAction() {
        $contenido = Exportarplantilla::getContenido($this->_getParam('idpersona'), $this->_getParam('idplantilla'));
        $margenes = explode(',', $this->_getParam('margenes'));
        $formato = explode(',', $this->_getParam('formato'));
        $pform = (count($formato)==2)?$formato:$this->_getParam('formato');
        $pdf = new GenerarPlantillaPDF();//print_r($contenido);die;
        $pdf->ConstruirPlantilla($contenido, $this->_getParam('orientacion'), $pform, $margenes);
        return true;
    }
}

?>
