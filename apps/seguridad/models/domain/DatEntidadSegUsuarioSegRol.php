<?php

/**
 * @name DatEntidadSegUsuarioSegRol - Clase de acceso a datos.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatEntidadSegUsuarioSegRol extends BaseDatEntidadSegUsuarioSegRol
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario', 
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasOne(
            'SegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
    }

    /**
     * @method eliminarusuariorolentidad - Elimina todos los 
     * roles que tenga un usuario.
     * @param integer $idusuario - Identificador del usuario.
     * @return boolean.
     */
    static function eliminarusuariorolentidad($idusuario)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatEntidadSegUsuarioSegRol m')
            ->where("m.idusuario = ?", array($idusuario))
            ->execute();
        return true;
    }

    /**
     * @method obtenerrol - Retorna una colección de objetos con 
     * el identificador del rol.
     * @param integer $idusuario - Identificador del usuario.
     * @param integer $identidad - Identificador de acceso.
     * @return Doctrine_Collection.
     */
    public static function obtenerrol($idusuario, $identidad)
    {
        $query = Doctrine_Query::create();
        return $query->select('DISTINCT m.idrol, m.idusuario, m.identidad')
            ->from('DatEntidadSegUsuarioSegRol m')
            ->where(
                "m.idusuario = ? and m.identidad =?", 
                array($idusuario, $identidad)
            )
            ->execute();
    }

    public static function rolesperfil($idusuario, $identidad)
    {
        $query = Doctrine_Query::create();
        return $query->select('DISTINCT (r.idrol) idrol, r.denominacion')
            ->from('SegRol r, r.DatEntidadSegUsuarioSegRol m')
            ->where(
                "m.idusuario = ? and m.identidad =?", 
                array($idusuario, $identidad)
            )
            ->execute();
    }

    /**
     * Retorna un listado de identificadores de acceso, rol y usuario
     *
     * @param integer $idusuario Identificador del usuario.
     * @return array Listado de identificadores de acceso, rol y usuario.
     */
    public static function cargarentidadesusuario($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            'e.identidad, e.identidad as idestructura, e.idrol,e.idusuario'
        )
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->where("e.idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)->execute();
    }

    public static function eliminarusuariorol($idusuario, $idrol)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatEntidadSegUsuarioSegRol')
            ->where('idusuario = ? and idrol = ? ', array($idusuario, $idrol))
            ->execute();
    }

    public static function cargarentidadesusuariorol($idusuario, $idrol)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            ' e.identidad, e.identidad as idestructura, e.idrol'
        )
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->where(
                "e.idusuario = ? and e.idrol = ?", array($idusuario, $idrol)
            )
            ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
            ->execute();
    }

    public static function cargarentidadesusuarionorol($idusuario, $idrol)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            ' e.identidad, e.identidad as idestructura, e.idrol'
        )
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->where(
                "e.idusuario = ? and e.idrol <> ?", 
                array($idusuario, $idrol)
            )
            ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
            ->execute();
    }

    public static function cantidadEntidadesNoAsignadasDadoUsuario(
        $idusuario, $arrayIdEntidades
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(e.identidad) as cant')
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->where("e.idusuario = ?", $idusuario)
            ->whereNotIn("e.identidad", $arrayIdEntidades)
            ->execute();
        return $datos[0]->cant;
    }

    public static function obtenerEntidadesNoAsignadasDadoUsuario(
        $idusuario, $arrayIdEntidades
    )
    {
        $query = Doctrine_Query::create();
        return $query->select('e.identidad, e.identidad as idestructura')
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->where("e.idusuario = ?", $idusuario)
            ->whereNotIn("e.identidad", $arrayIdEntidades)
            ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
            ->execute();
    }

    public static function cantidadEntidadesNoAsignadasDadoArrayUsuarios(
        $arrayIdUsuarios, $arrayIdEntidades
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(e.identidad) as cant')
            ->from('DatEntidadSegUsuarioSegRol e ')
            ->whereIn("e.idusuario", $arrayIdUsuarios)
            ->whereIn("e.identidad", $arrayIdEntidades)
            ->execute();
        return $datos[0]->cant;
    }

    public static function eliminarentidadusuariorol(
        $idusuario, $idrol, $identidad
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatEntidadSegUsuarioSegRol')
            ->where(
                'idusuario =? and idrol =? and identidad = ?', 
                array($idusuario, $idrol, $identidad)
            )
            ->execute();
    }

    public static function eliminarUsuarioDadoIdEntidades(
        $idusuario, $arrayIdEntidades
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatEntidadSegUsuarioSegRol')
            ->where('idusuario =?', $idusuario)
            ->whereIn('identidad', $arrayIdEntidades)
            ->execute();
    }

    public static function existeusuariorol($identity)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('COUNT(eur.identidad) identidad')
            ->from('DatEntidadSegUsuarioSegRol eur')
            ->where("eur.identidad = ?", $identity)
            ->execute();
        return $result[0]->identidad != 0;
    }

    static function tieneRelacionUsuario($usuarioelim, $entidadelim)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('COUNT(r.identidad) identidad')
            ->from('DatEntidadSegUsuarioSegRol r')
            ->where(
                'r.idusuario = ? and r.identidad = ?', 
                array($usuarioelim, $entidadelim)
            )
            ->execute();
        return $result[0]->identidad != 0;
    }

    static function cantUsuarioAsociadoRol()
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatEntidadSegUsuarioSegRol d')->count();
        return $cant;
    }

    static function comprobarExisteRol($idusuario, $idrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('d.identidad')
            ->from('DatEntidadSegUsuarioSegRol d')
            ->where("d.idusuario =? and d.idrol =?", array($idusuario, $idrol))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    public static function obtenerEntidadesDadoArrayEnt($iddominio, $arrayEnt)
    {
        $query = Doctrine_Query::create();
        return $query->select('u.idusuario, d.identidad')
            ->from('SegUsuario u')
            ->innerJoin('u.DatEntidadSegUsuarioSegRol d')
            ->where('u.iddominio = ?', $iddominio)
            ->whereIn("d.identidad", $arrayEnt)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function getAllRolesByUserId($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->select('d.idrol')
            ->from('DatEntidadSegUsuarioSegRol d')
            ->where('d.idusuario = ?', $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    static public function getAccess($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->select('identidad,idrol')
            ->from('DatEntidadSegUsuarioSegRol')
            ->where('idusuario = ?', $idusuario)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public static function nextId()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('max(identidad) as maximo')
            ->from('DatEntidadSegUsuarioSegRol')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return isset($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;
    }

    public static function getAllUserByRolesId($arrayidroles)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('d.idusuario')
            ->from('DatEntidadSegUsuarioSegRol d')
            ->whereIn('d.idrol', $arrayidroles)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos;
    }

}