<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatConfAtributoIndicador
 *
 * @author gerardo
 */
class DatConfAtributoIndicador extends BaseConfAtributoIndicador {

    public function setUp() {
        parent::setUp();
        //$this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('DatAtributoestatico', array('local' => 'idatributo', 'foreign' => 'idatributo'));
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('NomAgrupacion', array('local' => 'idagrupacion', 'foreign' => 'idagrupacion'));
    }

    public function getDatosIndicadorRegNumerico($idindicador) {
        $query = new Doctrine_Query();
        $resutl = $query->select('cnf.idatributoindicador,
                                  cnf.idcampo,
                               a.idatributo as idatributo,
                               a.denominacion as denominacion')
                ->from('DatConfAtributoIndicador cnf')
                ->innerJoin('cnf.DatAtributoestatico a')
                ->where('cnf.idindicador =? and a.nivelnomenclador = -1', array($idindicador))
                ->fetchArray();
        return $resutl;
    }

    public function getAgrupacionesRegNumerico($parametros) {
        $idindicador = $parametros['idprod'];
        $query = new Doctrine_Query();
        $resutl = $query->select('cnf.idatributoindicador,
                                  a.idatributo as idatributo,
                                  agru.denominacion as denominacionagrup')
                ->from('DatConfAtributoIndicador cnf')
                ->innerJoin('cnf.DatAtributoestatico a')
                ->innerJoin('a.NomAgrupacion agru')
                ->where('cnf.idindicador =? and a.nivelnomenclador = -1', array($idindicador))
                ->fetchArray();
        return $resutl;
    }

}
