<?php

/**
 * @name DatSistemaSegRol - Clase dominio de roles y sistemas.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistemaSegRol extends BaseDatSistemaSegRol
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegRol',
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasOne(
            'DatSistema', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
    }

    /**
     * @method sistemasdadorol - Función usada para retornar todos los 
     * sistemas que pertenecen al rol especificado.
     * @param integer $idrol - Identificador del rol
     * @return array
     */
    static public function sistemasdadorol($idrol)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('DISTINCT (idsistema) idsistema')
            ->from('DatSistemaSegRol')
            ->where("idrol = ?", $idrol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('idsistema')
            ->execute();
        return $result;
    }

    /**
     * @method eliminarrol - Función usada para eliminar la relacion que 
     * existe entre un rol y un sistemas
     * @param integer $valorsistema - Identificador de sistema.
     * @param integer $rol - Identificador del rol.
     * @return bool.
     */
    static public function eliminarrol($valorsistema, $rol)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRol')
            ->where("idsistema =? and idrol=?", array($valorsistema, $rol))
            ->execute();
        return true;
    }

    /**
     * @method cargarentidadesrol - Función usada para cargar todas las
     *  entidades que se encuentran relacionadas con el rol.
     * @param integer $idrol - Identificador del rol.
     * @return Doctrine_Collection
     */
    static function cargarentidadesrol($idrol)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('identidad')
            ->from('DatSistemaDatEntidadSegRol')
            ->where("idrol = ?", $idrol)
            ->execute();
        return $result;
    }

    /**
     * @method eliminarrolsistema - Función usada para eliminar la relacion 
     * que existe entre un rol y un sistemas
     * @param integer $idrol - Identificador del rol.
     * @param integer $idsistema - Identificador de sistema.
     * @return bool
     */
    static public function eliminarrolsistema($idrol, $idsistema)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRol')
            ->where("idrol = ? and idsistema = ?", array($idrol, $idsistema))
            ->execute();
        return true;
    }

    /**
     * @method cantidadentidadsistemarol - Retorna un listado de roles
     * @param integer $idsistema - Identificador de sistema.
     * @param integer $identidad - Identificador de entidad.
     * @return Doctrine_Collection
     */
    static public function cantidadentidadsistemarol($idsistema, $identidad)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatSistemaDatEntidadSegRol')
            ->where(
                "idsistema = ? and identidad = ?", 
                array($idsistema, $identidad)
            )
            ->count();
        return $result;
    }

    /**
     * @method eliminarRelacionRolSistema - Elimina un listado de relaciones.
     * @param integer $rol - Identificador del rol.
     * @param array $array - Arreglo de identificadores de sistemas.
     * @return void
     */
    static function eliminarRelacionRolSistema($rol, $array)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaSegRol')
            ->where('idrol = ?', $rol)
            ->whereIn('idsistema', $array)
            ->execute();
    }

}