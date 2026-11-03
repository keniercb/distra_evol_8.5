<?php


class ImportarServices extends ZendExt_Model
{   
    public function initComponent() {
        return true;
    }

    public function getJSImportar() {

        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
                . 'configuracion/importar/importar/views/scripts/cmpimportar/obtenerJSImportar.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

}