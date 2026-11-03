<?php

/**
 * Clase dominio de DatServicioDatSistema.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatServicioDatSistema extends BaseDatServicioDatSistema
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSistema', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'DatServicio', 
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
    }

    static function cargarserviciocons($idsistema, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'f.idservicio, f.denominacion, f.descripcion, '
            . 'f.wsdl, f.idsistema'
        )->from('DatServicio f, f.DatServicioDatSistema g')
            ->where("g.idsistema=?", $idsistema)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static function obtenercantsercons($idsistema)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatServicio s, s.DatServicioDatSistema m')
            ->where("m.idsistema = ?", $idsistema)
            ->count();
        return $cantFndes;
    }

    static function eliminarservicioscons($idservicio, $idsistema)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatServicioDatSistema m')
            ->where(
                "m.idservicio = ? and m.idsistema=?", 
                array($idservicio, $idsistema)
            )->execute();
        return true;
    }

    static function cargarservicionocons($idsistema)
    {
        $query = Doctrine_Query::create();
        $queryTwo = Doctrine_Query::create();
        $adentro = $query->select('s.idservicio')
            ->from('DatServicio s,s.DatServicioDatSistema a')
            ->where("a.idsistema='$idsistema'")
            ->execute();
        $queryAdentro = array();
        foreach ($adentro as $obj)
            $queryAdentro[] = $obj->idservicio;
        $afuera = $queryTwo->select('f.idservicio, f.denominacion')
            ->from('DatServicio f')
            ->whereNotIn('f.idservicio', $queryAdentro)
            ->execute();
        return $afuera;
    }

}