<?php


class ProyectoServices extends ZendExt_Model
{
    public function getJSCompresion() {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/proyecto/planeacion/views/scripts/cmpgestionarplantilla/obtenerJSCompresion.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function initComponent() {
        return true;
    }

    public function generarProyecto($arrayProduccion, $arrayEtapasActividades, $idusuario) {

        $proyectoModel = new CmpgestionarplantillaModel();
        $result = $proyectoModel->generarProyectoDadaProduccion($arrayProduccion, $arrayEtapasActividades, $idusuario);
        return $result;
    }

    public function eliminarProyectoProduccion($idproduccion) {
        $arrayidproyecto = [];
        $proyectoModel = new CmpgestionarplantillaModel();
        $arrayidproyecto = $proyectoModel->obtenerProyectoDadaProduccion($idproduccion);
        $proyectoModel->eliminarProyecto($arrayidproyecto);
    }

}