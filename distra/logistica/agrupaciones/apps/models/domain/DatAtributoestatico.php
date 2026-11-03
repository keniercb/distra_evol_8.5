<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatAtributoestatico
 *
 * @author gerardo
 */
class DatAtributoestatico extends BaseDatAtributoestatico {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomAgrupacion', array('local' => 'idagrupacion', 'foreign' => 'idagrupacion'));
        $this->hasOne('NomTipoDato', array('local' => 'idtipodato', 'foreign' => 'idtipodato'));
        $this->hasOne('NomExpresionRegular', array('local' => 'idexpresionregular', 'foreign' => 'idexpresionregular'));
    }

    public function getAtributosDadoAgrupacion($parametros) {
        $query = new Doctrine_Query();
        $consult = $query->select('daest.*,
                                  td.denominacion as NomTipoDatodenominacion,
                                   er.denominacion as NomExpresionRegulardenominacion')
                ->from('DatAtributoestatico daest')
                ->leftJoin('daest.NomTipoDato td')
                ->leftJoin('daest.NomExpresionRegular er')
                ->where("daest.idagrupacion =?", array($parametros['idagrupacion']));
        $count = $consult->count();
        if ($parametros['limit'] && $parametros['start']) {
            $consult->limit($parametros['limit']);
            $consult->offset($parametros['start']);
        }
        $result = $consult->fetchArray();
        return array('total' => $count, 'datos' => $result);
    }

    public function comprobarRelacionIndicador($datos, $idindicador) {
        foreach ($datos as $key => $value) {
            $relacion = Doctrine::getTable('DatConfAtributoIndicador')->findByDql('idatributo = ? and idindicador = ?', array($value['idatributo'], $idindicador));
            if (count($relacion->toArray())!= 0) {
                $datos[$key]['marcado'] = (count($relacion != 0)) ? 1 : 0;
                $datos[$key]['chequeado'] = (count($relacion != 0)) ? 1 : 0;
            }
        }
        return $datos;
    }

}