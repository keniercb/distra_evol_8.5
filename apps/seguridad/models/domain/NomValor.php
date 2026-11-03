<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */

class NomValor extends BaseNomValor
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomFila', 
            array('local' => 'idfila', 'foreign' => 'idfila')
        );
        $this->hasOne(
            'NomCampo', 
            array('local' => 'idcampo', 'foreign' => 'idcampo')
        );
    }

    static public function genId()
    {
        $query = new Doctrine_Query();
        $result = $query->select('max(f.idvalor) as maximo')
            ->from('NomValor f')
            ->execute()
            ->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    static public function cantvaloresdadofila($idfila)
    {
        $query = Doctrine_Query::create();
        $cantvalores = $query->from('NomValor')
            ->where("idfila = ?", $idfila)
            ->count();
        return $cantvalores;
    }

    static public function cargarvalores($idfila)
    {
        $query = Doctrine_Query::create();
        $valores = $query->select('idfila,idcampo,valor')->from('NomValor')
            ->where("idfila = ?", $idfila)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return $valores;
    }

    static public function cargaridvalor($idfila, $idcampo)
    {
        $query = Doctrine_Query::create();
        $idvalores = $query->select('idvalor')->from('NomValor')
            ->where("idfila = ? and idcampo = ?", array($idfila, $idcampo))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $idvalores;
    }

    static function cargarcamposdadovalores($idvalor)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('v.idvalor,c.nombre, c.nombreamostrar')
            ->from('NomValor v,v.NomCampo c')
            ->where('idvalor=?', $idvalor)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->orderby('v.idvalor')
            ->execute();
        return $result;
    }

    static function verificarExpresion($idexpresion)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('count(v.idvalor) cant')
            ->from('NomValor v')
            ->innerjoin('v.NomCampo c')
            ->where('c.idexpresion = ?', $idexpresion)
            ->execute();
        return $result[0]->cant;
    }

}