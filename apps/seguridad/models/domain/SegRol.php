<?php

/**
 * @name SegRol - Componente de acceso a datos de roles.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegRol extends BaseSegRol
{

    /**
     * @method setUp - Función principal de la clase donde se generan 
     * las relaciones con otros modelos.
     * @return void.
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSistemaSegRol',
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasMany(
            'DatEntidadSegUsuarioSegRol', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->hasMany(
            'SegRolNomDominio', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
        $this->HasMany(
            'SegRolGrupo', 
            array('local' => 'idrol', 'foreign' => 'idrol')
        );
    }

    /**
     * @method cantrol - Retorna la cantidad de roles compartimentados 
     * por dominio.
     * @param integer $filtroDominio - Identificador del dominio.
     * @param bool $type - Identifica si es un grupo o un rol.
     * @return integer
     */
    public static function cantrol($filtroDominio, $type)
    {
        $cantFndes = Doctrine_Query::create()->select('count(r.idrol) as cant')
            ->from('SegRol r')
            ->innerjoin('r.SegRolNomDominio rd')
            ->where(
                "rd.iddominio = ? AND r.grupo = ?", 
                array($filtroDominio, $type)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * @method obtenerrol - Retorna un listado de roles compartimentado 
     * por dominio.
     * @param integer $filtroDominio - Identificador del dominio.
     * @param integer $limit - Limite.
     * @param integer $start - Inicio.
     * @param bool $type - Identifica si es un grupo o un rol
     * @return Doctrine_Collection.
     */
    public static function obtenerrol($filtroDominio, $limit, $start, $type)
    {
        $sql = "SELECT DISTINCT r.idrol, r.denominacion, r.abreviatura,
            r.descripcion,
            CASE WHEN sr.idrol IS NOT NULL THEN TRUE ELSE FALSE END AS regular
            FROM mod_seguridad.seg_rol r
            INNER JOIN mod_seguridad.seg_roldominio s2 ON r.idrol = s2.idrol
            LEFT JOIN mod_seguridad.dat_sistemarol sr ON (r.idrol = sr.idrol)
            WHERE (s2.iddominio = ? AND r.grupo = ?)
            ORDER BY r.idrol
            OFFSET ?
            LIMIT ?";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql, array($filtroDominio, $type, $start, $limit));
    }

    /**
     * @method obtenerCantRolesUsuario - Retorna la cantidad de roles que
     *  están asignados a un usuario.
     * @param integer $idusuario - Identificador del usuario.
     * @return integer
     */

    /**
     * @method obtenerrol - Retorna un listado de roles compartimentado
     *  por dominio.
     * @param integer $filtroDominio - Identificador del dominio.
     * @param bool $type - Identifica si es un grupo o un rol
     * @return Doctrine_Collection.
     */
    public static function obtenerrolarbol($filtroDominio,$type)
    {
        $arrayids = join(',', $filtroDominio[1]);
        if(!empty($arrayids)) {
            $arrayids .= ',' . $filtroDominio[0];
        } else {
            $arrayids = $filtroDominio[0];
        }
        $sql = "SELECT DISTINCT r.idrol, r.denominacion, r.abreviatura, 
            r.descripcion,
            CASE WHEN sr.idrol IS NOT NULL THEN TRUE ELSE FALSE END AS regular
            FROM mod_seguridad.seg_rol r
            INNER JOIN mod_seguridad.seg_roldominio s2 ON r.idrol = s2.idrol
            LEFT JOIN mod_seguridad.seg_compartimentacionrol s3 ON r.idrol = s3.idrol
            INNER JOIN mod_seguridad.dat_sistemarol sr ON (r.idrol = sr.idrol)
            WHERE ((s3.iddominio IN ({$arrayids}) OR s2.iddominio IN ({$arrayids})) " . ( $type !== null ?  "AND r.grupo = {$type}" : "" ) . ") 
            ORDER BY r.idrol";

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }
    /**
     * @method obtenerrol - Retorna un listado de roles que estan 
     * dentro de un Grupo.
     * @param $idRol id del grupo
     * @return Doctrine_Collection.
     */
    public static function obtenerRolesGrupo($idGrupo)
    {
       $sql = "SELECT r.idrol, r.denominacion, r.abreviatura, r.descripcion
            FROM mod_seguridad.seg_rol r
            INNER JOIN mod_seguridad.seg_rolgrupo rd ON r.idrol = rd.idrol
            where rd.idgrupo = {$idGrupo}";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);

    }

    public static function obtenerCantRolesUsuario($idusuario)
    {
        $datos = Doctrine_Query::create()->select('count(r.idrol) as cant')
            ->from('SegRol r')
            ->innerjoin('r.DatEntidadSegUsuarioSegRol eur')
            ->whereIn("eur.idusuario", $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos[0]['cant'];
    }

    /**
     * @method - Retorna un listado de roles compartimentados por dominios 
     * y que se encuentran o no asociados a un usuario.
     * @param integer $limit - Limite.
     * @param integer $start - Inicio.
     * @param integer $idusuario - Identificador del usuario.
     * @param array $arrayRolesDominio - Listado de identificadores de dominio.
     * @return array
     */
    public static function obtenerrolesasociados(
        $limit, $start, $idusuario, $arrayRolesDominio
    )
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (r.idrol),r.denominacion, r.abreviatura, '
            . 'r.descripcion, sr.idusuario'
        )
            ->from('SegRol r')
            ->leftJoin(
                "r.DatEntidadSegUsuarioSegRol sr ON r.idrol = sr.idrol "
                . "AND sr.idusuario = '$idusuario'"
            )
            //->where('r.grupo = ?', false)
            ->whereIn("r.idrol", $arrayRolesDominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('r.idrol')
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    /**
     * Retorna un listado de roles compartimentados por dominios.
     *
     * @param array $arrayRolesDominio - Listado de identificadores de dominios.
     * @return array Listado de roles compartimentados
     */
    public static function obtenerRolesCompartimentados($arrayRolesDominio)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (r.idrol),r.denominacion, r.abreviatura, '
            . 'r.descripcion, sr.idusuario'
        )
            ->from('SegRol r')
            //->where('r.grupo = ?', false)
            ->whereIn("r.idrol", $arrayRolesDominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('r.idrol')
            ->execute();
    }

    /**
     * @method cantrolesDominio - Retorna la cantidad de roles compartimentados
     *  por los dominios especificados.
     * @param array $arrayRolesDominio - Listado de identificadores de dominio.
     * @return integer
     */
    public static function cantrolesDominio($arrayRolesDominio)
    {
        $cantFndes = Doctrine_Query::create()->select('count(r.idrol) as cant')
            ->from('SegRol r')
            //->where('r.grupo = ?', false)
            ->whereIn("r.idrol", $arrayRolesDominio)
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * @method obtenerRolesBuscado - Retorna un listado de roles 
     * compartimentados por dominio que estén o no asociados al usuario y 
     * que coincidan con el criterio de busqueda especificado.
     * @param string $rolbuscado - Criterio de busqueda.
     * @param integer $limit - Limite.
     * @param integer $start - Inicio.
     * @param integer $idusuario - Identificador del usuario.
     * @param array $arrayRolesDominio - Listado de identificadores de dominio.
     * @return array
     */
    public static function obtenerRolesBuscado(
        $rolbuscado, $limit, $start, $idusuario, $arrayRolesDominio
    )
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (r.idrol), r.denominacion, r.abreviatura,'
            . ' r.descripcion, sr.idusuario'
        )
            ->from('SegRol r')
            ->leftJoin(
                "r.DatEntidadSegUsuarioSegRol sr ON r.idrol = sr.idrol "
                . "AND sr.idusuario = '$idusuario'"
            )
            ->where(
                "r.denominacion like '%$rolbuscado%' AND (r.grupo = ? OR 1 = 1)", FALSE
            )
            ->whereIn("r.idrol", $arrayRolesDominio)
            ->orderby('r.idrol')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method obtenerrolesusuario - Retorna un listado de los roles que 
     * estan asociados al usuario especificado.
     * @param integer $idusuario - Identificador del usuario.
     * @return Doctrine_Collection
     */
    public static function obtenerrolesusuario($idusuario)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT r.idrol id,r.denominacion text, '
            . 'r.abreviatura, eur.identidad'
        )
            ->from('SegRol r')
            ->innerjoin(
                'r.DatEntidadSegUsuarioSegRol eur ON r.idrol = eur.idrol'
            )
            ->where("eur.idusuario = ?", $idusuario)
            ->execute();
    }

    /**
     * @method obtenerrolesusuarioentidad - Retorna un listado de los roles 
     * asignados a un usuario en una entidad.
     * @param integer $idusuario - Identificador del usuario.
     * @param integer $identidad - Identificador de la entidad.
     * @return Doctrine_Collection
     */
    public static function obtenerrolesusuarioentidad($idusuario, $identidad)
    {
        return Doctrine_Query::create()->select(
            'r.idrol id,r.denominacion text, r.abreviatura'
        )
            ->from('SegRol r')
            ->innerjoin(
                'r.DatEntidadSegUsuarioSegRol eur ON r.idrol = eur.idrol'
            )
            ->where(
                "eur.idusuario = ? and eur.identidad = ?", 
                array($idusuario, $identidad)
            )
            ->execute();
    }

    /**
     * @method obtenerrolBuscado - Retorna un listado de roles o grupos 
     * compartimentados por dominio.
     * @param integer $filtroDominio - Identificador del dominio.
     * @param string $denominacion - Criterio de busqueda.
     * @param integer $limit - Limite.
     * @param integer $start - Inicio.
     * @param bool $type - Identifica si es un grupo o un rol.
     * @return Doctrine_Collection
     */
    public static function obtenerrolBuscado(
        $filtroDominio, $denominacion, $limit, $start, $type
    )
    {
        $sql = "SELECT DISTINCT r.idrol, r.denominacion, r.abreviatura, 
            r.descripcion,
            CASE WHEN sr.idrol IS NOT NULL THEN TRUE ELSE FALSE END AS regular
            FROM mod_seguridad.seg_rol r
            INNER JOIN mod_seguridad.seg_roldominio s2 ON r.idrol = s2.idrol
            LEFT JOIN mod_seguridad.dat_sistemarol sr ON (r.idrol = sr.idrol)
            WHERE (r.denominacion like '%$denominacion%' 
            AND s2.iddominio = ? AND r.grupo = ?)
            ORDER BY r.idrol
            OFFSET ?
            LIMIT ?";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql, array($filtroDominio, $type, $start, $limit));
    }

    /**
     * @method cantrolBuscados - Retorna la cantidad de roles compartimentados
     *  por dominios que cumplan con el criterio de busqueda.
     * @param string $denominacion - Criterio de busqueda.
     * @param array $arrayRolesDominio - Listado de identificadores de dominio.
     * @param bool $type - Identifica si es un grupo o un rol.
     * @return integer
     */
    public static function cantrolBuscados(
        $denominacion, $arrayRolesDominio, $type
    )
    {
        $cant = Doctrine_Query::create()->select("count(r.idrol) as cant")
            ->from('SegRol r')
            ->innerjoin('r.SegRolNomDominio rd')
            ->where(
                "r.denominacion like '%$denominacion%' AND r.grupo = ?", $type
            )
            ->whereIn("r.idrol", $arrayRolesDominio)
            ->execute();
        return $cant[0]->cant;
    }

    /**
     * @method obtenerRolesValidar - Retorna la cantidad de roles que estan
     *  asociados a un dominio determinado.
     * @param integer $iddominio - Identificador de dominio.
     * @return integer
     */
    public static function obtenerRolesValidar($iddominio)
    {
        $cant = Doctrine_Query::create()->select("count(r.idrol) as cant")
            ->from('SegRol r')
            ->innerjoin('r.SegRolNomDominio rd')
            ->where("rd.iddominio = ?", $iddominio)
            ->execute();
        return $cant[0]->cant;
    }

    /**
     * @method ObtenerArrayRolesUsados - Retorna un listado de roles que 
     * estan asociados a usuarios activos.
     * @param array $arrayDel - Listado de identificadores de roles.
     * @return array
     */
    public static function ObtenerArrayRolesUsados($arrayDel)
    {
        return Doctrine_Query::create()->select("DISTINCT r.idrol")
            ->from('SegRol r')
            ->innerjoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerjoin('eur.SegUsuario u')
            ->where('u.activo = ?', true)
            ->whereIn('eur.idrol', $arrayDel)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method eliminarArrayRoles - Función usada para eliminar un 
     * listado de roles.
     * @param array $nodesElim - Listado de identificadores de roles.
     * @return void
     */
    public static function eliminarArrayRoles($nodesElim)
    {
        Doctrine_Query::create()->delete()
            ->from('SegRol')
            ->whereIn('idrol', $nodesElim)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method validarDenominacion - Función genérica para validar que la 
     * denominación del rol o del grupo no se repita.
     * @param string $denominacion - Denominación.
     * @param bool $type - Identifica si es un grupo o un rol. TRUE | FALSE
     * @param integer $idrol - Identificador del rol. integer | NULL
     * @return bool
     */
    public static function validarDenominacion($denominacion, $type, $idrol)
    {
        if ($idrol) {
            $where = "denominacion = ? AND grupo = ? AND idrol <> ?";
            $filtro = array($denominacion, $type, $idrol);
        } else {
            $where = "denominacion = ? AND grupo = ?";
            $filtro = array($denominacion, $type);
        }
        $cantidad = Doctrine_Query::create()->from('SegRol')
            ->where($where, $filtro)
            ->count();
        return ($cantidad > 0) ? TRUE : FALSE;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarGridGrupos - Retorna un listados de grupos creados.
     * @param integer $start - Inicio.
     * @param integer $limit - Limite.
     * @param integer $filtroDominio - Identificador del dominio.
     * @return array
     */
    public static function cargarGridGrupos(
        $start, $limit, $filtroDominio, $idrol
    )
    {
        if ($idrol)
            $leftJoin = "r.SegRolGrupo rg ON (r.idrol = rg.idgrupo "
            . "AND rg.idrol = $idrol)";
        else
            $leftJoin = "r.SegRolGrupo rg";
        return Doctrine_Query::create()
            ->select(
                'DISTINCT (r.idrol),r.denominacion,'
                . ' (COALESCE(rg.idgrupo,0) = r.idrol) as checket'
            )
            ->from('SegRol r')
            ->innerjoin('r.SegRolNomDominio rd')
            ->leftJoin($leftJoin)
            ->where(
                "rd.iddominio = ? AND r.grupo = ?", array($filtroDominio, TRUE)
            )
            ->orderby('r.idrol')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method cantidadFilasGrupos - Retorna la cantidad de grupos creados.
     * @param integer $filtroDominio - Identificador del dominio.
     * @return integer
     */
    public static function cantidadFilasGrupos($filtroDominio)
    {
        $cant = Doctrine_Query::create()->select('count(idrol) cant')
            ->from('SegRol r')
            ->innerjoin('r.SegRolNomDominio rd')
            ->leftJoin('r.SegRolGrupo rg')
            ->where(
                "rd.iddominio = ? AND r.grupo = ?", array($filtroDominio, TRUE)
            )
            ->execute();
        return $cant[0]->cant;
    }

    /**
     * @method ObtenerArrayRolesUsados - Retorna un listado de roles que estan 
     * asociados a usuarios activos.
     * @param array $arrayDel - Listado de identificadores de roles.
     * @return array
     */
    public function ObtenerRolesUsados()
    {
        $query = Doctrine_Query::create();
        return $query->select(
            "DISTINCT (r.idrol), r.denominacion, r.descripcion"
        )
            ->from('SegRol r')
            ->innerjoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerjoin('eur.SegUsuario u')
            ->where('u.activo = ?', true)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method ObtenerRolesporUser - Retorna un listado de roles que estan 
     * asociados a un usuarios.
     * @param array $arrayDel - Listado de identificadores de roles.
     * @return array
     */
    public function ObtenerRolesporUser($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            "DISTINCT (r.idrol), r.denominacion, r.descripcion"
        )
            ->from('SegRol r')
            ->innerjoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerjoin('eur.SegUsuario u')
            ->where('u.activo = ? and u.idusuario = ?', array(true, $idusuario))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }
    
    public function getRoleNameById($arrayIdRol)
    {
        return Doctrine_Query::create()->select(
            "DISTINCT (r.idrol), r.denominacion, r.descripcion"
        )
            ->from('SegRol r')
            ->whereIn('r.idrol', $arrayIdRol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }   

}
