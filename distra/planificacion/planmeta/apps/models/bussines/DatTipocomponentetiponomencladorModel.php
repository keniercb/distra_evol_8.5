<?php

/**
 * DatTipocomponentetiponomencladorModel
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatTipocomponentetiponomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatTipocomponentetiponomenclador $DatTipocomponentetiponomenclador
    ) {
        $DatTipocomponentetiponomenclador->save();
    }

    public function Eliminar($DatTipocomponentetiponomenclador) {
        $DatTipocomponentetiponomenclador->delete();
    }

    public function getAsocPorTipoComp($idtc) {
        return DatTipocomponentetiponomenclador::getAsocPorTipoComp($idtc);
    }

}

//fin clase DatTipocomponentetiponomencladorModel
