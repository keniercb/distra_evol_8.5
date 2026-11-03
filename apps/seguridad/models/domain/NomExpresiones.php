<?php

/**
 * Clase dominio de NomExpresiones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class NomExpresiones extends BaseNomExpresiones
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomCampo', 
            array('local' => 'idexpresion', 'foreign' => 'idexpresion')
        );
    }

    static public function cargarexpresion($limit, $start)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'a.idexpresion as idexpresiones, a.denominacion, a.expresion'
        )
            ->from('NomExpresiones a')
            ->orderby('a.idexpresion')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static function obtenerexpresion()
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('NomExpresiones')->count();
        return $cantFndes;
    }

    static function obtenerexpresionRegular()
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idexpresion')
            ->from('NomExpresiones')
            ->execute();
        return $datos;
    }

    static function eliminarExpresiones($arrayElim)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('NomExpresiones')
            ->whereIn('idexpresion', $arrayElim)
            ->execute();
    }

    static public function cargarexpresionBuscar($buscar, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->from('NomExpresiones e')
            ->where("e.denominacion like '%$buscar%'")
            ->orderby('e.idexpresion')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static function obtenerexpresionBuscar($buscar)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('NomExpresiones')
            ->where("denominacion like '%$buscar%'")
            ->count();
        return $cantFndes;
    }

    static public function verificarExpresion($campo, $valor, $idexpresion)
    {
        if ($idexpresion) {
            $where = "$campo = ? AND idexpresion <> ?";
            $filtro = array($valor, $idexpresion);
        } else {
            $where = "$campo = ?";
            $filtro = array($valor);
        }
        $query = Doctrine_Query::create();
        $cantidad = $query->from('NomExpresiones')
            ->where($where, $filtro)
            ->execute();
        return count($cantidad);
    }

}