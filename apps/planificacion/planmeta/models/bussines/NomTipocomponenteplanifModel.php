<?php

/**
 * NomTipocomponenteModel
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class NomTipocomponenteplanifModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function getIdTipoCompDadoDenomTipoComp($tc) {
        return NomTipocomponenteplanif::getIdTipoCompDadoDenomTipoComp($tc);
    }

}
