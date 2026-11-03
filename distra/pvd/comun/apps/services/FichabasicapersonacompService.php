<?php

class FichabasicapersonacompService extends ZendExt_Model {

    public function ExportarReporteService() {
        parent::ZendExt_Model();
    }

    public function obtenerScriptsFichaBasicaPersona()
    {
        $scripts =  '<link rel="stylesheet" type="text/css" href="/pvd/comun/views/js/fichabasicapersonacomp/fichabasicapersonacomp.css" />';
        $scripts.=  '<script type="text/javascript" src="/pvd/comun/views/js/fichabasicapersonacomp/fichabasicapersonacomp.js"></script>';

        return $scripts;
    }

}