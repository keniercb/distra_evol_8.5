<?php

/**
 * @name DatSistemaSegRolDatFuncionalidad - Clase de dominio pra el acceso 
 * al modelo de datos DatSistemaSegRolDatFuncionalidad
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistemaSegRolDatFuncionalidad 
extends BaseDatSistemaSegRolDatFuncionalidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFuncionalidad',
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->hasOne(
            'DatSistemaSegRol', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'DatSistemaSegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidadDatAccion', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidadDatAccion', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidadDatAccion', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
    }

    /**
     * @method obtenerfunrol - Función que retorna un listado de 
     * funcionalidades
     * @param integer $idrol - Identificador del rol.
     * @param integer $idsistema - Identificador del sistema.
     * @return array
     */
    static public function obtenerfunrol($idrol, $idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idfuncionalidad, idsistema')
            ->from('DatSistemaSegRolDatFuncionalidad')
            ->where("idrol = ? AND idsistema = ? ", array($idrol, $idsistema))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function eliminarfuncionalidad(
        $idrol, $idfuncionalidad, $idsistema
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRolDatFuncionalidad')
            ->where(
                "idrol=? and idfuncionalidad=? and idsistema=?", 
                array($idrol, $idfuncionalidad, $idsistema)
            )
            ->execute();
        return true;
    }

    static public function cargarsist_funcionalidades($idsistema, $rol)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'f.idfuncionalidad id, f.referencia, f.denominacion text, '
            . 'f.descripcion, f.icono,true leaf, f.idsistema'
        )
            ->from(
                'DatFuncionalidad f, f.DatSistemaSegRolDatFuncionalidad serf'
            )
            ->where(
                "serf.idsistema = ? and  serf.idrol =?", array($idsistema, $rol)
            )
            ->orderby('f.idfuncionalidad')
            ->execute();
        return $fndes;
    }

    static public function tieneFuncionalidad($idrol, $idsistema)
    {
        $query = Doctrine_Query::create();
        return $query->from('DatSistemaSegRolDatFuncionalidad')
            ->where("idrol = ? and idsistema = ? ", array($idrol, $idsistema))
            ->count();
    }

    static function cantidadsisrol($idrol)
    {
        $query = Doctrine_Query::create();
        return $query->select("DISTINCT idsistema")
            ->from('DatSistemaSegRolDatFuncionalidad')
            ->where("idrol = ?", $idrol)
            ->count();
    }

    static function cantidadFuncEliminar($idrol, $arrayeliminar)
    {
        $query = Doctrine_Query::create();
        return $query->select("DISTINCT idsistema")
            ->from('DatSistemaSegRolDatFuncionalidad')
            ->where("idrol = ?", $idrol)
            ->whereIn('idsistema', $arrayeliminar)
            ->count();
    }

}