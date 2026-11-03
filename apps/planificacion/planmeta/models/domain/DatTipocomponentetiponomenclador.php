<?php

/**
 * DatTipocomponentetiponomenclador
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatTipocomponentetiponomenclador extends BaseDatTipocomponentetiponomenclador {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomTipocomponenteplanif', array('local' => 'idtipocomponente',
            'foreign' => 'idtipocomponente')
        );
        $this->hasOne(
                'NomTiponomenclador', array('local' => 'idtiponomenclador',
            'foreign' => 'idtiponomenclador')
        );
    }

    static public function getAsoc($idtipocomponente, $idtiponomenclador) {
        $query = new Doctrine_Query();
        $result = $query->from("DatTipocomponentetiponomenclador n")
                        ->where(
                                "n.idtiponomenclador=" . $idtiponomenclador
                                . " AND n.idtipocomponente=" . $idtipocomponente
                        )
                        ->execute()->getFirst();
        return $result;
    }

    public function getAsocPorTipoComp($idtipocomponente) {
        $query = new Doctrine_Query();
        return $query->select('n.idtipocomponente, n.idtiponomenclador')
                        ->from("DatTipocomponentetiponomenclador n")
                        ->where("n.idtipocomponente =?", $idtipocomponente)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

}
