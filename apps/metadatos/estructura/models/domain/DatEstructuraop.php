<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatEstructuraop extends BaseDatEstructuraop
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomOrgano', array('local' => 'idorgano', 'foreign' => 'idorgano'));
        $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasOne('NomFilaestruc', array('local' => 'idestructuraop', 'foreign' => 'idfila'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
    }

    /**
     * Busca todos los elementos de la tabla que se correspondan con el id pasado por parametro
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     *
     * @param int $idEstructuraOp
     *
     * @return mixed : Retorna un arreglo con las instancias de la tabla encontradas
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscar($idEstructuraOp)
    {
        $object = Doctrine::getTable('DatEstructuraop')->find($idEstructuraOp);

        return $object->toArray();
    }

    /**
     *  Obtiene todas las estructuras internas que contienen una denominacion especificada
     *
     * @author    : Ing. Osvaldo Gonzalez
     *
     * @param        $idconcepto
     * @param string $denominacion
     * @param int    $nodo
     *
     * @return bool : TRUE o FALSE en caso de existir elementos iguales a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeDenominacion($idconcepto, $denominacion, $nodo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomFilaestruc f')->innerjoin('f.DatEstructuraop e')->where(
                           "LOWER(e.denominacion) = LOWER('$denominacion')"
        )->andwhere("e.idconcepto = $idconcepto")->andwhere("f.idpadre = $nodo")->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }
}