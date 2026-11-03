<?php

/**
 * NomTipocomponente
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class NomTipocomponenteplanif extends BaseNomTipocomponenteplanif {

    public function setUp() {
        parent::setUp();
        $this->hasMany(
                'DatTipocomponentetiponomenclador', array('local' => 'idtipocomponente',
            'foreign' => 'idtipocomponente')
        );
    }

    public function listarGrupos() {
        $query = new Doctrine_Query();
        if (isset($start)) {
            $query->offset($start);
        }
        if (isset($limit)) {
            $query->limit($limit);
        }
        $result = $query->select(
                        "n.denominacion, n.descripcion, n.color, n.idtipocomponente"
                )
                ->from("NomTipocomponenteplanif n")
                ->orderby("n.denominacion")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getIdTipoCompDadoDenomTipoComp($tc) {
        $query = new Doctrine_Query();
        return $query->select('n.idtipocomponente,n.denominacion')
                        ->from('Nomtipocomponenteplanif n')
                        ->where('n.denominacion = ?', $tc)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

}
