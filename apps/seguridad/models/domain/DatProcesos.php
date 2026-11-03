<?php

/**
 * Clase dominio de Acciones.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatProcesos extends BaseDatProcesos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatServicio', 
            array('local' => 'idproceso', 'foreign' => 'idproceso')
        );
    }

    static public function eliminarProcesos($idproceso)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatProcesos')
            ->where("idproceso =?", $idproceso)
            ->execute();
        return true;
    }

    static public function cantProcesos()
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatProcesos')->count();
        return $cantFndes;
    }

    static public function obtenerProcesos($idproceso)
    {
        $query = Doctrine_Query::create();
        $proceso = $query->select('p.idproceso, p.denominacion, p.descripcion')
            ->from('DatProcesos p')
            ->where("p.idproceso = ?", $idproceso)
            ->execute();
        return $proceso;
    }

    static public function obtenerTodosProcesos()
    {
        $query = Doctrine_Query::create();
        $proceso = $query->select('p.idproceso, p.denominacion, p.descripcion')
            ->from('DatProcesos p')
            ->execute();
        return $proceso;
    }

    static public function ModificarProcesos($proceso)
    {
        $proceso->save();
    }

    static function datosProcesos($limit, $start)
    {
        $query = Doctrine_Query::create();
        $gestores = $query->select('p.idproceso, p.denominacion, p.descripcion')
            ->from('DatProcesos p ')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $gestores;
    }

}