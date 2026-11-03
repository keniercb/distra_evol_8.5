<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class DatServicio extends BaseDatServicio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSistema', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatServicioDatSistema', 
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
        $this->hasMany(
            'DatFunciones', 
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
    }

    static function obtenerServicio($idsistema, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select('idservicio,denominacion,descripcion,wsdl')
            ->from('DatServicio')
            ->where("idsistema =?", $idsistema)
            ->orderby('idservicio')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static function cantserviciop($idsistema)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatServicio')
            ->where("idsistema=?", $idsistema)
            ->count();
        return $cantFndes;
    }

    static function cargarser($limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select('idservicio,denominacion')
            ->from('DatServicio')
            ->orderby('idservicio')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

}