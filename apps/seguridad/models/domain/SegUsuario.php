<?php

/**
 * Clase modelo del componente usuario.
 *
 * @name SegUsuario
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegUsuario extends BaseSegUsuario
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEntidadSegUsuarioSegRol',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'SegClaveacceso',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'SegCertificado',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasOne(
            'NomFila',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasOne(
            'NomTema',
            array('local' => 'idtema', 'foreign' => 'idtema')
        );
        $this->hasOne(
            'NomIdioma',
            array('local' => 'ididioma', 'foreign' => 'ididioma')
        );
        $this->hasOne(
            'NomDesktop',
            array('local' => 'iddesktop', 'foreign' => 'iddesktop')
        );
        $this->hasMany(
            'SegUsuarioNomDominio',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'SegCompartimentacionusuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'SegUsuarioDatSerautenticacion',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
        $this->hasMany(
            'SegPermisoproducto',
            array('local' => 'idusuario', 'foreign' => 'idusuario'));
        $this->hasMany(
            'DatIncidencia',
            array('local' => 'idusuario', 'foreign' => 'idusuariosoporte'));
        $this->hasMany('HisCerrada',
            array('local' => 'idusuario', 'foreign' => 'idusuariosoporte'));
    }

    public static function cargarusuario(
        $filtroDominio, $nombreusuario, $limit, $start
    )
    {

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT
                        u.idusuario, u.nombreusuario
                FROM
                        mod_seguridad.seg_usuario u
                LEFT JOIN
                        mod_seguridad.seg_compartimentacionusuario cu ON u.iddominio=cu.iddominio
                LEFT JOIN
                        mod_seguridad.seg_usuariodominio ud ON u.idusuario=ud.idusuario
                LEFT JOIN
                        mod_seguridad.seg_usuarioserautenticacion usa ON u.idusuario = usa.idusuario
                WHERE
                        cu.idusuario = ? OR (ud.iddominio = ? OR ud.iddominio = 0)
                ORDER BY u.idusuario
                LIMIT ?
                OFFSET ?;", array($nombreusuario, $filtroDominio, $limit, $start));
    }

    /**
     * Funcion usada para listar los usuario compartimetados.
     *
     * @param integer $idusuario Identificador.
     * @param integer $iddominio Identificador del dominio.
     * @param integer $limit Limite.
     * @param integer $start Comienzo.
     * @return array Listado de usuarios compartimentados.
     */
    public static function cargarGridUsuario(
        $idusuario, $iddominio, $limit, $start
    )
    {
        if (!empty($iddominio[0])) {
            $arrayids = join(',', $iddominio[1]);
            if (!empty($arrayids)) {
                $arrayids .= ',' . $iddominio[0];
            } else {
                $arrayids = $iddominio[0];
            }
        } else {
            $arrayids = $iddominio;
        }
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT s.idusuario, s.activo, s.nombreusuario,
                s.ip, s.iddominio, s.iddesktop, s.idtema, s.idpersona, 
                s.ididioma, n.denominacion AS desktop, n2.denominacion AS tema,
                n3.denominacion AS idioma, d2.idservidor, d2.denominacion, 
                (NOT s.accesoconcurrente) AS simpleacceso, 
                (NOT s.accesoconcurrente AND s.reescribirsesion) 
                AS reescribirsesion
                FROM mod_seguridad.seg_usuario s
                LEFT JOIN mod_seguridad.nom_desktop n 
                ON s.iddesktop = n.iddesktop
                LEFT JOIN mod_seguridad.nom_tema n2 
                ON s.idtema = n2.idtema
                LEFT JOIN mod_seguridad.nom_idioma n3 
                ON s.ididioma = n3.ididioma
                LEFT JOIN mod_seguridad.seg_usuarioserautenticacion s2 
                ON s.idusuario = s2.idusuario
                LEFT JOIN mod_seguridad.dat_serautenticacion d 
                ON s2.idservidor = d.idservidor
                LEFT JOIN mod_seguridad.dat_servidor d2 
                ON d.idservidor = d2.idservidor
                WHERE (
                s.idusuario IN (SELECT usuario.idusuario
                            FROM mod_seguridad.seg_usuario usuario
                            LEFT JOIN mod_seguridad.seg_compartimentacionusuario dc ON (usuario.idusuario = dc.idusuario)
                            WHERE dc.iddominio IN ({$arrayids})
                            UNION
                            SELECT sn.idusuario
                            FROM mod_seguridad.seg_usuariodominio sn
                            WHERE sn.iddominio IN ({$arrayids})
                            UNION
                            SELECT us.idusuario
                            FROM mod_seguridad.seg_usuario us
                            WHERE us.iddominio = 0
                            ))
                LIMIT ?
                OFFSET ?", array($limit, $start)
            );
    }

    /**
     * Funcion usada para listar los usuario compartimetados sin paginado.
     *
     * @param integer $idusuario Identificador del usuario.
     * @param integer $iddominio Identificador del dominio.
     * @return array Listado de usuarios compartimentados.
     */
    public static function listadoUsuariosCompartimentados(
        $idusuario, $iddominio
    )
    {
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT s.idusuario, s.activo, s.nombreusuario,
                s.ip, s.iddominio, s.iddesktop, s.idtema, s.idpersona, 
                s.ididioma, n.denominacion AS desktop, n2.denominacion AS tema,
                n3.denominacion AS idioma, d2.idservidor, d2.denominacion, 
                (NOT u.accesoconcurrente) AS simpleacceso, 
                (NOT u.accesoconcurrente AND u.reescribirsesion) 
                AS reescribirsesion
                FROM mod_seguridad.seg_usuario s
                LEFT JOIN mod_seguridad.nom_desktop n 
                ON s.iddesktop = n.iddesktop
                LEFT JOIN mod_seguridad.nom_tema n2 
                ON s.idtema = n2.idtema
                LEFT JOIN mod_seguridad.nom_idioma n3 
                ON s.ididioma = n3.ididioma
                LEFT JOIN mod_seguridad.seg_usuarioserautenticacion s2 
                ON s.idusuario = s2.idusuario
                LEFT JOIN mod_seguridad.dat_serautenticacion d 
                ON s2.idservidor = d.idservidor
                LEFT JOIN mod_seguridad.dat_servidor d2 
                ON d.idservidor = d2.idservidor
                WHERE (
                s.idusuario IN (SELECT usuario.idusuario
                            FROM mod_seguridad.seg_usuario usuario
                            WHERE usuario.iddominio In (
                            SELECT dc.iddominio 
                            FROM mod_seguridad.seg_compartimentacionusuario dc 
                            WHERE dc.idusuario = ?)
                            UNION
                            SELECT sn.idusuario
                            FROM mod_seguridad.seg_usuariodominio sn
                            WHERE sn.iddominio = ?
                            UNION
                            SELECT us.idusuario
                            FROM mod_seguridad.seg_usuario us
                            WHERE us.iddominio = 0
                            ))", array($idusuario, $iddominio)
            );
    }

    /**
     * Funcion usada para obtener la cantidad de usuarios compartimentados.
     *
     * @param integer $idusuario Identificador del usuario que esta en sesion.
     * @param integer $iddominio Identificador del dominio del usuario que
     * esta en sesion.
     * @return integer Cantidad.
     */
    public static function cantidadFilas($idusuario, $iddominio)
    {
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchOne(
                "SELECT COUNT(s.idusuario)
                FROM mod_seguridad.seg_usuario s
                WHERE (
                s.idusuario IN (SELECT usuario.idusuario
                            FROM mod_seguridad.seg_usuario usuario
                            WHERE usuario.iddominio In (
                            SELECT dc.iddominio 
                            FROM mod_seguridad.seg_compartimentacionusuario dc
                            WHERE dc.idusuario = ?)
                            UNION
                            SELECT sn.idusuario
                            FROM mod_seguridad.seg_usuariodominio sn
                            WHERE sn.iddominio = ?
                            UNION
                            SELECT us.idusuario
                            FROM mod_seguridad.seg_usuario us
                            WHERE us.iddominio = 0
                            ))
                ", array($idusuario, $iddominio)
            );
    }

    public static function obtenercantusuarios($filtroDominio, $nombreusuario)
    {
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT COUNT(u.idusuario)
                FROM
                        mod_seguridad.seg_usuario u
                LEFT JOIN
                        mod_seguridad.seg_compartimentacionusuario cu ON u.iddominio=cu.iddominio
                LEFT JOIN
                        mod_seguridad.seg_usuariodominio ud ON u.idusuario=ud.idusuario
                LEFT JOIN
                        mod_seguridad.seg_usuarioserautenticacion usa ON u.idusuario = usa.idusuario
                WHERE
                        cu.idusuario = ? OR (ud.iddominio = ? OR ud.iddominio = 0);",
                array($nombreusuario, $filtroDominio));
    }

    public static function obtenercantGridUsuario($filtroDominio)
    {
        $cantFndes = Doctrine_Query::create()
            ->select('count(u.idusuario) as cant')
            ->from('SegUsuario u')
            ->whereIn("u.iddominio", $filtroDominio)
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function obtenerCantidadUsuarios()
    {
        $cantFndes = Doctrine_Query::create()
            ->select('count(u.idusuario) as cant')
            ->from('SegUsuario u')
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function obtenerTodosLosUsuarios($limit, $start)
    {
        $cantFndes = Doctrine_Query::create()
            ->select('u.idusuario as idUsuario, u.nombreusuario as nombreusuario')
            ->from('SegUsuario u')
            ->limit($limit)
            ->offset($start)
            ->execute()
            ->toArray();

        return $cantFndes;
    }

    /**
     * Funcion usada para obtener la cantidad de usuarios compartimentados
     * que cumplan con las condiciones especificadas.
     *
     * @param string $nombreusuario Nombre de usuario
     * @param integer $idusuario Identificador del usuario que esta en sesion.
     * @param integer $iddominio Identificador del dominio del
     *  usuario que esta en sesion.
     * @param integer $dominiobuscar Identificador del dominio a filtrar.
     * @param boolean $activar Estado.
     * @param integer $limit Limite.
     * @param integer $start Comienzo.
     * @return array Listado de usuarios compartimentados que cumplan con
     * las condiciones especificadas.
     */
    public static function cargarGridUsuarioBuscados(
        $nombreusuario, $idusuario, $iddominio, $dominiobuscar,
        $activar, $limit, $start, $idrol = "", $idGrupo = ""
    )
    {
        $whereRol = $idrol ? " eur.idrol = {$idrol} AND " : "";
        $joinRol = $idrol
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eur "
            . "ON s.idusuario = eur.idusuario "
            : "";
        // Eliminado porque ya se asignan los roles a los usuarios
        /*$joinGrupo = $idGrupo
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON s.idusuario = eurg.idusuario AND eurg.idrol IN 
                (SELECT rg.idrol FROM mod_seguridad.seg_rolgrupo rg 
                WHERE rg.idgrupo = {$idGrupo}) " 
            : "";*/
        $joinGrupo = $idGrupo
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON s.idusuario = eurg.idusuario AND eurg.idrol = {$idGrupo} "
            : "";

        $where = "s.nombreusuario like '%$nombreusuario%'";
        if ($dominiobuscar)
            $where .= " and s.iddominio = '$dominiobuscar'";
        if ($activar == 'Desactivar')
            $where .= " and s.activo = false";
        if ($activar == 'Activar')
            $where .= " and s.activo = true";

        $sqlUsuario = "select distinct s.idusuario, s.activo, s.nombreusuario,
                s.ip, s.iddominio, s.iddesktop, s.idtema, s.idpersona,s.email,
                s.ididioma, n.denominacion AS desktop, n2.denominacion AS tema,
                n3.denominacion AS idioma, d2.idservidor, d2.denominacion,
                (NOT s.accesoconcurrente) AS simpleacceso,
                (NOT s.accesoconcurrente AND s.reescribirsesion)
                AS reescribirsesion,
                upper(coalesce((dper.nombre
                     || (case when dper.snombre is not null then  ' ' || dper.snombre else '' end )
                     || (case when dper.papel is not null then  ' ' || dper.papel else '' end )
                     || (case when dper.sapel is not null then  ' ' || dper.sapel else '' end )),'' ))as perfil,
                count(s.idusuario) over () as total
                FROM mod_seguridad.seg_usuario s
                                LEFT JOIN mod_seguridad.nom_desktop n
                                ON s.iddesktop = n.iddesktop
                                LEFT JOIN mod_seguridad.nom_tema n2
                                ON s.idtema = n2.idtema
                                LEFT JOIN mod_seguridad.nom_idioma n3
                                ON s.ididioma = n3.ididioma
                                LEFT JOIN mod_seguridad.seg_usuarioserautenticacion s2
                                ON s.idusuario = s2.idusuario
                                LEFT JOIN mod_seguridad.dat_serautenticacion d
                                ON s2.idservidor = d.idservidor
                                LEFT JOIN mod_seguridad.dat_servidor d2
                                ON d.idservidor = d2.idservidor
                                left JOIN mod_seguridad.dat_entidadusuariorol eur on s.idusuario = eur.idusuario
                                left join mod_persona.dat_persona dper on dper.idpersona = s.idpersona
                                {$joinGrupo}";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT s.idusuario, s.activo, s.nombreusuario,
                s.ip, s.iddominio, s.iddesktop, s.idtema, s.idpersona,
                s.ididioma, n.denominacion AS desktop, n2.denominacion AS tema,
                n3.denominacion AS idioma, d2.idservidor, d2.denominacion, 
                (NOT s.accesoconcurrente) AS simpleacceso, 
                (NOT s.accesoconcurrente AND s.reescribirsesion) 
                AS reescribirsesion
                FROM mod_seguridad.seg_usuario s
                LEFT JOIN mod_seguridad.nom_desktop n 
                ON s.iddesktop = n.iddesktop
                LEFT JOIN mod_seguridad.nom_tema n2 
                ON s.idtema = n2.idtema
                LEFT JOIN mod_seguridad.nom_idioma n3 
                ON s.ididioma = n3.ididioma
                LEFT JOIN mod_seguridad.seg_usuarioserautenticacion s2 
                ON s.idusuario = s2.idusuario
                LEFT JOIN mod_seguridad.dat_serautenticacion d 
                ON s2.idservidor = d.idservidor
                LEFT JOIN mod_seguridad.dat_servidor d2 
                ON d.idservidor = d2.idservidor
                {$joinRol}
                {$joinGrupo}
                WHERE (
                {$whereRol}
                {$where} AND
                s.idusuario IN (SELECT usuario.idusuario
                        FROM mod_seguridad.seg_usuario usuario
                        WHERE usuario.iddominio In (
                        SELECT dc.iddominio 
                        FROM mod_seguridad.seg_compartimentacionusuario dc 
                        WHERE dc.idusuario = ?)
                        UNION
                        SELECT sn.idusuario
                        FROM mod_seguridad.seg_usuariodominio sn
                        WHERE sn.iddominio = ?
                        UNION
                        SELECT us.idusuario
                        FROM mod_seguridad.seg_usuario us
                        WHERE us.iddominio = 0
                        ))
                LIMIT ?
                OFFSET ?", array($idusuario, $iddominio, $limit, $start)
            );
    }

    public static function buscarUsuariosByParams($idusuarioLogueado, $iddominioLogueado, $dominioBuscar = false, $uname = false,
                                                  $activar = false, $limit = 30, $start = 0, $idRol = false, $idGrupo = false)
    {
        $arrayWhere = array();
        if ($dominioBuscar) {
            $dominioBuscar = implode(',', is_array($dominioBuscar) ? $dominioBuscar : array($dominioBuscar));
            $arrayWhere[] = "s.iddominio in({$dominioBuscar})";
        }
        if ($uname) {
            $arrayWhere[] = "(s.email ilike '%{$uname}%' OR s.nombreusuario ilike '%{$uname}%' OR upper(coalesce((dper.nombre
                     || (case when dper.snombre is not null then  ' ' || dper.snombre else '' end )
                     || (case when dper.papel is not null then  ' ' || dper.papel else '' end )
                     || (case when dper.sapel is not null then  ' ' || dper.sapel else '' end )),'' )) ilike '%{$uname}%')";
        }
        if ($activar == 2) {
            $arrayWhere[] = "s.activo = false";
        } else {
            $arrayWhere[] = "s.activo = true";
        }
        if ($idRol) {
            $arrayWhere[] = "s.idusuario in (select distinct eur.idusuario  from mod_seguridad.dat_entidadusuariorol eur where eur.idrol = {$idRol})";
        }
        if ($idGrupo) {
            $arrayWhere[] = "s.idusuario in (select distinct eur.idusuario  from mod_seguridad.dat_entidadusuariorol eur where eur.idrol = {$idGrupo})";
        }
        $strWhere = implode(' and ', $arrayWhere);
        $sqlBusqueda = "select distinct s.idusuario, s.activo, s.nombreusuario,
                s.ip, s.iddominio, s.iddesktop, s.idtema, s.idpersona,s.email,
                s.ididioma, n.denominacion AS desktop, n2.denominacion AS tema,
                n3.denominacion AS idioma, d2.idservidor, d2.denominacion,
                (NOT s.accesoconcurrente) AS simpleacceso,
                (NOT s.accesoconcurrente AND s.reescribirsesion)
                AS reescribirsesion,ndom.denominacion as dominio,
                upper(coalesce((dper.nombre
                     || (case when dper.snombre is not null then  ' ' || dper.snombre else '' end )
                     || (case when dper.papel is not null then  ' ' || dper.papel else '' end )
                     || (case when dper.sapel is not null then  ' ' || dper.sapel else '' end )),'' ))as perfil,
                count(s.idusuario) over () as total
                FROM mod_seguridad.seg_usuario s
                                LEFT JOIN mod_seguridad.nom_desktop n
                                ON s.iddesktop = n.iddesktop
                                LEFT JOIN mod_seguridad.nom_tema n2
                                ON s.idtema = n2.idtema
                                LEFT JOIN mod_seguridad.nom_idioma n3
                                ON s.ididioma = n3.ididioma
                                LEFT JOIN mod_seguridad.seg_usuarioserautenticacion s2
                                ON s.idusuario = s2.idusuario
                                LEFT JOIN mod_seguridad.dat_serautenticacion d
                                ON s2.idservidor = d.idservidor
                                LEFT JOIN mod_seguridad.dat_servidor d2
                                ON d.idservidor = d2.idservidor
                                left join mod_persona.dat_persona dper on dper.idpersona = s.idpersona
                                left join mod_estructuracomp.nom_dominio ndom on s.iddominio = ndom.iddominio
                WHERE {$strWhere} LIMIT {$limit} OFFSET {$start}";
        $datosBusqueda = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlBusqueda);
        return array('cantidad' => $datosBusqueda[0]['total'], 'datos' => $datosBusqueda);
    }

    /**
     * Funcion usada para obtener la cantidad de usuarios compartimentados y
     * que cumplan con las condiciones especificadas.
     *
     * @param string $nombreusuario Nombre de usuario
     * @param integer $idusuario Identificador del usuario que esta en sesion.
     * @param integer $iddominio Identificador del dominio del usuario que
     *  esta en sesion.
     * @param integer $dominiobuscar Identificador del dominio a filtrar.
     * @param boolean $activar Estado.
     * @return integer Cantidad.
     */
    public static function cantidadFilasUsuariosBuscados(
        $nombreusuario, $idusuario, $iddominio,
        $dominiobuscar, $activar, $idrol = "", $idGrupo = ""
    )
    {
        $whereRol = $idrol ? " eur.idrol = {$idrol} AND " : "";
        $joinRol = $idrol
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eur "
            . "ON s.idusuario = eur.idusuario "
            : "";
        // Eliminado porque ya se asignan los roles a los usuarios
        /*
        $joinGrupo = $idGrupo 
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON s.idusuario = eurg.idusuario AND eurg.idrol IN 
                (SELECT rg.idrol FROM mod_seguridad.seg_rolgrupo rg 
                WHERE rg.idgrupo = {$idGrupo}) " */
        $joinGrupo = $idGrupo
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON s.idusuario = eurg.idusuario AND eurg.idrol = {$idGrupo} "
            : "";
        $where = "s.nombreusuario like '%$nombreusuario%'";
        if ($dominiobuscar)
            $where .= " and s.iddominio = $dominiobuscar";
        if ($activar == 'Desactivar')
            $where .= " and s.activo = true";
        if ($activar == 'Activar')
            $where .= " and s.activo = false";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchOne(
                "SELECT COUNT(s.idusuario)
                FROM mod_seguridad.seg_usuario s
                {$joinRol}
                {$joinGrupo}
                WHERE (
                {$where} AND {$whereRol}
                s.idusuario IN (SELECT usuario.idusuario
                            FROM mod_seguridad.seg_usuario usuario
                            WHERE usuario.iddominio In (
                            SELECT dc.iddominio 
                            FROM mod_seguridad.seg_compartimentacionusuario dc 
                            WHERE dc.idusuario = ?)
                            UNION
                            SELECT sn.idusuario
                            FROM mod_seguridad.seg_usuariodominio sn
                            WHERE sn.iddominio = ?
                            UNION
                            SELECT us.idusuario
                            FROM mod_seguridad.seg_usuario us
                            WHERE us.iddominio = 0
                            ))
            ", array($idusuario, $iddominio)
            );
    }

    public static function cargarusuariosBuscados(
        $nombreusuario, $filtroDominio, $dominiobuscar,
        $activar, $limit, $start
    )
    {
        $where = "u.nombreusuario like '%$nombreusuario%'";
        if ($dominiobuscar)
            $where .= " and u.iddominio = $dominiobuscar";
        if ($activar == 'Desactivar')
            $where .= " and u.activo = true";
        if ($activar == 'Activar')
            $where .= " and u.activo = false";
        return Doctrine_Query::create()->select(
            'u.idusuario, u.activo, u.nombreusuario,u.ip,u.iddominio, '
            . 'u.iddesktop, e.denominacion, u.idtema, t.denominacion, '
            . 'u.ididioma, i.denominacion'
        )
            ->from(
                'SegUsuario u, u.SegDominio d, u.NomDesktop e, u.NomTema t,'
                . ' u.NomIdioma i'
            )
            ->whereIn("u.iddominio", $filtroDominio)
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    public static function obtenercantusuariosBuscados(
        $nombreusuario, $filtroDominio, $dominiobuscar, $activar
    )
    {
        $where = "u.nombreusuario like '%$nombreusuario%'";
        if ($dominiobuscar)
            $where .= " and u.iddominio = $dominiobuscar";
        if ($activar == 'Desactivar')
            $where .= " and u.activo = true";
        if ($activar == 'Activar')
            $where .= " and u.activo = false";
        $cantFndes = Doctrine_Query::create()->select(
            'count(u.idusuario) as cant'
        )
            ->from('SegUsuario u')
            ->whereIn("u.iddominio", $filtroDominio)
            ->where("$where")
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function cantusuariodadodominio($iddominio)
    {
        $cantFndes = Doctrine_Query::create()->select(
            'COUNT(u.iddominio) iddominio'
        )
            ->from('SegUsuario u')
            ->where("u.iddominio = ?", $iddominio)
            ->execute();
        return $cantFndes[0]->iddominio != 0;
    }

    public function usuariodadodominio($iddominio)
    {
        return Doctrine_Query::create()->select('u.idusuario')
            ->from('SegUsuario u')
            ->where("u.iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public static function eliminarusuario($idusuario)
    {
        Doctrine_Query::create()->delete()
            ->from('SegUsuario m')
            ->where("m.idusuario = ?", array($idusuario))
            ->execute();
        return true;
    }

    public function comprobarusuario($user, $pass)
    {
        return Doctrine_Query::create()->select('u.idusuario, u.nombreusuario')
            ->from('SegUsuario u')
            ->where(
                "u.nombreusuario = ? AND u.contrasenna = ?",
                array($user, $pass)
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public static function cargarperfilusuario($idusuario)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.iddominio, u.idpersona, '
            . 'd.abreviatura desktop, d.iddesktop, d.denominacion, '
            . 't.abreviatura tema, t.denominacion dentema, t.idtema, '
            . 't.denominacion, i.ididioma, i.abreviatura idioma, '
            . 'i.denominacion,f.idfila,v.valor,v.idvalor, u.activo,c.idcampo, '
            . 'c.nombre, c.nombreamostrar, usa.idservidor'
        )
            ->from('SegUsuario u')
            ->leftJoin("u.NomTema t")
            ->leftJoin("u.NomIdioma i")
            ->leftJoin("u.NomDesktop d")
            ->leftJoin("u.NomFila f")
            ->leftJoin("f.NomValor v")
            ->leftJoin("v.NomCampo c")
            ->leftjoin(
                'u.SegUsuarioDatSerautenticacion usa '
                . 'ON (u.idusuario = usa.idusuario)'
            )
            ->where("u.idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public static function contarusuario($user)
    {
        $usuario = Doctrine_Query::create()->select('count(idusuario) as cant')
            ->from('SegUsuario')
            ->where("nombreusuario = ?", $user)
            ->execute();
        return $usuario[0]->cant;
    }

    public function nombusuario($id)
    {
        return Doctrine_Query::create()->select('nombreusuario')
            ->from('SegUsuario')
            ->where("idusuario = ?", $id)
            ->execute();
    }

    public function nombusuariocont($user)
    {
        $cantFndes = Doctrine_Query::create()->from('SegUsuario')
            ->where("nombreusuario = ?", $user)
            ->count();
        return $cantFndes;
    }

    public static function cargardominiodeusuario($idusuario)
    {
        return Doctrine_Query::create()->select('u.iddominio')
            ->from('SegUsuario u')
            ->where("u.idusuario = ?", $idusuario)
            ->execute();
    }

    public static function cargarservidoraut($idusuario)
    {
        return Doctrine_Query::create()->select(
            's.idservidor , s.denominacion '
        )
            ->from('DatServidor s, s.DatSerautenticacion a, a.SegUsuario u')
            ->where("u.idusuario = ? ", $idusuario)
            ->execute();
    }

    /**
     * @param Array $array - Arreglo de identificadores de usuario.
     * @return DoctrineCollection - Colección de objetos de usuario.
     * @author Darien García Tejo.
     * @method comprovarestado($array) - Comprueba que el usuario no se
     *  encuentre bloqueado (integracion con Logística).
     */
    public static function comprovarestado($array)
    {
        return Doctrine_Query::create()->select('idusuario')
            ->from('SegUsuario')
            ->where('estado = ?', 0)
            ->whereIn("idusuario", $array)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para obtener lo metadatos idusuario, contrasenna, ip,
     * activo, caduca y idservidor del usuario que se esta
     * intentando autenticar.
     *
     * @param string $usuario Nombre de usuario.
     * @return Doctrine_Collection.
     */
    public static function obtenerUsuario($usuario)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario as idusuario, u.iddominio as iddominio, 
                u.nombreusuario as nombreusuario, u.contrasenna as contrasenna, 
                u.ip as ip, u.activo as activo, u.caduca as caduca, 
                s.idservidor as idservidor, s.denominacion as denServidor,
                s.ip as ipservidor, sa.usuario as usuario, 
                sa.password as password, sa.tservidor as tservidor, 
                sa.basedn as basedn, sa.tsl as tsl, sa.ssl as ssl, 
                sa.puerto as puerto, u.accesoconcurrente, u.reescribirsesion'
        )
            ->from('SegUsuario u')
            ->leftjoin(
                'u.SegUsuarioDatSerautenticacion usa '
                . 'ON (u.idusuario = usa.idusuario)'
            )
            ->leftjoin(
                'usa.DatSerautenticacion sa '
                . 'ON (usa.idservidor = sa.idservidor)'
            )
            ->leftjoin(
                'sa.DatServidor s ON (sa.idservidor = s.idservidor)'
            )
            ->where("u.nombreusuario = ? ", $usuario)
            ->execute();
    }

    public function cargarusuarios($identidad, $idrol)
    {
        return Doctrine_Query::create()->select('u.idusuario')
            ->from('SegUsuario u, u.DatEntidadSegUsuarioSegRol ur')
            ->where(
                "ur.identidad = ? and ur.idrol = ? ",
                array($identidad, $idrol)
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public function cargarListadoUsuarioPorRol(
        $idrol, $limit = null, $start = null
    )
    {
        $query = Doctrine_Query::create();
        $queryC = Doctrine_Query::create();
        if ($limit)
            $query->limit($limit);
        if ($start)
            $query->offset($start);
        $data = $query->select(
            'DISTINCT (u.idusuario) as idusuario, u.nombreusuario'
        )
            ->from('SegUsuario u, u.DatEntidadSegUsuarioSegRol ur')
            ->where("ur.idrol = ? ", $idrol)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        $cant = $queryC->select('DISTINCT (u.idusuario)')
            ->from('SegUsuario u, u.DatEntidadSegUsuarioSegRol ur')
            ->where("ur.idrol = ? ", $idrol)
            ->count();
        return array('cantidad' => $cant, 'datos' => $data);
    }

    public static function existealgunusuario()
    {
        return Doctrine_Query::create()->from('SegUsuario')->count();
    }

    public static function validarasignacionroles($arrayUsuario)
    {
        return Doctrine_Query::create()->select(
            'd.idrol, d.identidad,u.idusuario,d.idusuario'
        )
            ->from('SegUsuario u')
            ->leftjoin('u.DatEntidadSegUsuarioSegRol d')
            ->whereIn("u.idusuario", $arrayUsuario)
            ->orderby('u.idusuario,d.idrol,d.identidad')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function obtenerIdDominioDadoIdUsuario($idusuario)
    {
        $datos = Doctrine_Query::create()->select('iddominio')
            ->from('SegUsuario')
            ->where("idusuario = ?", $idusuario)
            ->execute();
        return $datos[0]->iddominio;
    }

    public static function obtenerIdUsuariosDadoIdDominio($iddominio)
    {
        return Doctrine_Query::create()->select('idusuario')
            ->from('SegUsuario')
            ->where("iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function activarUsuarios($arrayUserActivar)
    {
        Doctrine_Query::create()->update('SegUsuario')
            ->set('activo', '?', true)
            ->whereIn('idusuario', $arrayUserActivar)
            ->execute();
    }

    public static function DesactivarUsuarios($arrayUserActivar)
    {
        Doctrine_Query::create()->update('SegUsuario')
            ->set('activo', '?', false)
            ->whereIn('idusuario', $arrayUserActivar)
            ->execute();
    }

    public static function obtenerIdDominios($iddominio)
    {
        return Doctrine_Query::create()->select('u.iddominio,ud.idusuario')
            ->from('SegUsuario u')
            ->innerJoin('u.SegUsuarioNomDominio ud')
            ->where("ud.iddominio =?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public function obtenerIdUsuarioDadoNombre($name)
    {
        $datos = Doctrine_Query::create()->select('u.idusuario')
            ->from('SegUsuario u')
            ->where("u.nombreusuario = ?", $name)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos[0]['idusuario'];
    }

    public static function getUsersNameById($arrayId)
    {
        return Doctrine_Query::create()->select('nombreusuario')
            ->from('SegUsuario')
            ->whereIn("idusuario", $arrayId)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function guardarPerfil($idusuario, $idpersona)
    {
        Doctrine_Query::create()->Update('SegUsuario u')
            ->set("u.idpersona", "?", $idpersona)
            ->where("u.idusuario = ?", $idusuario)
            ->execute();
    }

    public static function tieneperfil($idusuario)
    {
        return Doctrine_Query::create()->select('u.idpersona')
            ->from('SegUsuario u')
            ->where("u.idusuario =?", $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function getIdPersonaByIdUsuario($idusuario)
    {
        return Doctrine_Query::create()->select('idpersona')
            ->from('SegUsuario')
            ->where("idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function todosLosUsuarios($limit, $start)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.idpersona'
        )
            ->from('SegUsuario u')
            ->where("u.idpersona is not null")
            ->orderBy('u.nombreusuario')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    public function canttodosLosUsuarios()
    {
        $cantFndes = Doctrine_Query::create()->select(
            'count(u.idusuario) as cant'
        )
            ->from('SegUsuario u')
            ->where('u.idpersona <> 0')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $cantFndes[0]->cant;
    }

    public function getallUsers($limit, $start)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.idpersona'
        )
            ->from('SegUsuario u')
            ->orderBy('u.nombreusuario')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
    }

    public static function cargarGridUsuarioPersona($arrayIdUsuarios)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.iddominio, u.idpersona'
        )
            ->from('SegUsuario u')
            ->where("u.idpersona is not null")
            ->whereIn('u.idusuario', $arrayIdUsuarios)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function getUsersPersonInformation()
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.iddominio, u.idpersona'
        )
            ->from('SegUsuario u')
            ->where("u.idpersona is not null")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function obtenerUsuarioPorArrayIdPersona($arrayIdPersonas)
    {
        return Doctrine_Query::create()->select(
            'u.idusuario, u.nombreusuario, u.iddominio, u.idpersona'
        )
            ->from('SegUsuario u')
            ->whereIn('u.idpersona', $arrayIdPersonas)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function verificarIdioma($idioma)
    {
        $datos = Doctrine_Query::create()->select('count(u.idusuario) cant')
            ->from('SegUsuario u')
            ->where('u.ididioma = ?', $idioma)
            ->execute();
        return ($datos[0]->cant > 0) ? true : false;
    }

    public static function verificarTema($idtema)
    {
        $datos = Doctrine_Query::create()->select('count(u.idusuario) cant')
            ->from('SegUsuario u')
            ->where('u.idtema = ?', $idtema)
            ->execute();
        return ($datos[0]->cant > 0) ? true : false;
    }

    public static function verificarDesktop($iddesktop)
    {
        $datos = Doctrine_Query::create()->select('count(u.idusuario) cant')
            ->from('SegUsuario u')
            ->where('u.iddesktop = ?', $iddesktop)
            ->execute();
        return ($datos[0]->cant > 0) ? true : false;
    }

    public static function getIdPersona($userName)
    {
        return Doctrine_Query::create()->select('u.idusuario, u.idpersona')
            ->from('SegUsuario u')
            ->where('u.nombreusuario = ?', $userName)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function verificarPerfil($idpersona, $idusuario = 0)
    {
        return Doctrine_Query::create()->select('count(u.idusuario) cant')
            ->from('SegUsuario u')
            ->where(
                'u.idpersona = ? AND u.idusuario <> ?',
                array($idpersona, $idusuario)
            )
            ->fetchOne()
            ->cant;
    }

    public static function getArrayIdPersonaByArrayUsers($arrayUsers)
    {
        return Doctrine_Query::create()->select('u.idusuario, u.idpersona')
            ->from('SegUsuario u')
            ->where('u.idpersona is not null')
            ->whereIn('u.idusuario', $arrayUsers)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function getArrayIdPersonaByUsersName($arrayUsers)
    {
        return Doctrine_Query::create()->select('u.idpersona')
            ->from('SegUsuario u')
            ->where('u.idpersona is not null')
            ->whereIn('u.nombreusuario', $arrayUsers)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @param Array $arrayElim - Arreglo de identificadores de usuarios.
     * @return void.
     * @author Darien García Tejo.
     * @method eliminarUsuarios($arrayElim) - Función usada para eliminar
     *  una colección de usuarios.
     */
    public static function eliminarUsuarios($arrayElim, $idusuario)
    {
        Doctrine_Query::create()->update('SegUsuario')
            ->set('caduca', date('d-m-Y'))
            ->set('estado', 2)
            ->set('modificadopor', $idusuario)
            ->set('fmodificado', date('d-M-Y H:i:s'))
            ->set('activo', false)->whereIn('idusuario', $arrayElim);
    }

    /**
     * @param string $sql - SQL.
     * @param array $arrayResources - Arreglo de recursos para filtrar.
     * @param array $arrayRef - Arreglo de referencias.
     * @return array
     * @author Darien García Tejo.
     * @method getUsersFullAccess - Retorna un arreglo con los usuarios que
     * tiene los permisos mínimos de administración.
     */
    public static function getUsersFullAccess($sql, $arrayResources, $arrayRef)
    {
        return Doctrine_Query::create()->select(
            'count(DISTINCT a.idaccion), u.nombreusuario'
        )
            ->from('SegUsuario u')
            ->innerJoin(
                'u.DatEntidadSegUsuarioSegRol eur '
                . 'ON (u.idusuario = eur.idusuario)'
            )
            ->innerJoin('eur.SegRol r ON (eur.idrol = r.idrol)')
            ->innerJoin('r.DatSistemaSegRol sr ON (r.idrol = sr.idrol)')
            ->innerJoin(
                'sr.DatSistemaSegRolDatFuncionalidad srf '
                . 'ON (sr.idrol = srf.idrol)'
            )
            ->innerJoin(
                'srf.DatFuncionalidad f '
                . 'ON (srf.idfuncionalidad = f.idfuncionalidad)'
            )
            ->innerJoin(
                'srf.DatSistemaSegRolDatFuncionalidadDatAccion srfa srfa '
                . 'ON (srf.idrol = srfa.idrol)'
            )
            ->innerJoin(
                'srfa.DatAccion a ON (srfa.idaccion = a.idaccion '
                . 'AND a.idfuncionalidad = f.idfuncionalidad)'
            )
            ->where($sql, $arrayResources)
            ->whereIn('f.referencia', $arrayRef)
            ->groupBy('u.idusuario, u.nombreusuario')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     *
     * @method usersByFuncionality($iddominios, $referencia, $recurso, $excluir, $limit, $offset)
     * Retorna los usuarios que poseen dentro de un dominio especificado
     * permisos dentro de una funcionalidad a una recurso especificado.
     *
     * @param ARRAY $iddominios , Arreglo de dominios especificos
     * @param STRING $referencia , Dirección referencial de la función
     * especifica
     * @param STRING $recurso , Abreviatura del recurso especificado
     * @param ARRAY $excluir , Excluir los usuarios especificados
     * @param INTEGER $limit , Limite de la lista
     * @param INTEGER $offset , Inicio de la lista
     *
     * @return ARRAY - Lista de usuarios.
     */
    public static function usersByFuncionality(
        $iddominios,
        $referencia,
        $recurso,
        $excluir = array(),
        $limit = 0,
        $offset = 0
    )
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $dominios = implode(',', $iddominios);

        $whereExclude = '';
        if (count($excluir) > 0) {
            $idUsuarios = implode(',', $excluir);
            $whereExclude = "AND u.idusuario NOT IN ($idUsuarios)";
        }
        $sql = "Select distinct(u.idusuario), u.nombreusuario as usuario, 
            u.iddominio,r.abreviatura
    from mod_seguridad.seg_usuario u
    INNER JOIN mod_seguridad.dat_entidadusuariorol eur 
    ON (u.idusuario = eur.idusuario)
    INNER JOIN mod_seguridad.seg_rol rol 
    ON (rol.idrol = eur.idrol)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidadaccion da 
    ON (rol.idrol = da.idrol)
    INNER JOIN mod_seguridad.dat_recurso r 
    ON (da.idfuncionalidad = r.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidad rf 
    ON (rf.idfuncionalidad = da.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_funcionalidad f 
    ON (rf.idfuncionalidad = f.idfuncionalidad)
    Where 
    u.iddominio IN($dominios)  
    $whereExclude
    AND f.referencia ILIKE ('$referencia') AND
    r.abreviatura ILIKE ('$recurso')
    LIMIT $limit  OFFSET $offset";

        return $conn->fetchAll($sql);
    }

    /**
     *
     * @method totalUsersByFuncionality($iddominios, $referencia, $recurso, $excluir)
     * Retorna los usuarios que poseen dentro de un dominio especificado
     * permisos dentro de una funcionalidad a una recurso especificado.
     *
     * @param ARRAY $iddominios , Arreglo de dominios especificos
     * @param STRING $referencia , Dirección referencial de la función
     * especifica
     * @param STRING $recurso , Abreviatura del recurso especificado
     * @param ARRAY $excluir , Excluir los usuarios especificados
     *
     * @return INTEGER - Cantidad total de usuarios.
     */
    public static function totalUsersByFuncionality(
        $iddominios, $referencia, $recurso, $excluir = array()
    )
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $dominios = implode(',', $iddominios);

        $whereExclude = '';
        if (count($excluir) > 0) {
            $idUsuarios = implode(',', $excluir);
            $whereExclude = "AND u.idusuario NOT IN ($idUsuarios)";
        }
        $sql = "Select count(distinct(u.idusuario)) as cant
    from mod_seguridad.seg_usuario u
    INNER JOIN mod_seguridad.dat_entidadusuariorol eur 
    ON (u.idusuario = eur.idusuario)
    INNER JOIN mod_seguridad.seg_rol rol 
    ON (rol.idrol = eur.idrol)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidadaccion da 
    ON (rol.idrol = da.idrol)
    INNER JOIN mod_seguridad.dat_recurso r 
    ON (da.idfuncionalidad = r.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_sistemarolfuncionalidad rf 
    ON (rf.idfuncionalidad = da.idfuncionalidad)
    INNER JOIN mod_seguridad.dat_funcionalidad f 
    ON (rf.idfuncionalidad = f.idfuncionalidad)
    Where 
    u.iddominio IN($dominios)  
    $whereExclude
    AND f.referencia ILIKE ('$referencia') AND
    r.abreviatura ILIKE ('$recurso') ";
        $datos = $conn->fetchAll($sql);
        return $datos[0]['cant'];
    }

    public static function UpdateUsuarioSki($idsuario, $ski)
    {
        $q = Doctrine_Query::create();

        return $q->update('SegUsuario')
            ->set('ski', "'{$ski}'")
            ->where('idusuario = ?', $idsuario)
            ->execute();
    }

    public static function getEntidad($idusuario)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

        $sql = "SELECT mostrarentidad
                FROM mod_seguridad.seg_usuario
                WHERE idusuario = '{$idusuario}'";

        return $conn->fetchAll($sql);

    }

    public static function cambiarestadoEntidad($idusuario, $estado)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

        $sql = "UPDATE mod_seguridad.seg_usuario SET mostrarentidad = $estado
                WHERE idusuario = '{$idusuario}'";
        return $conn->fetchAll($sql);
    }

    public static function deleteProfileOrRole($idusuario, $entity, $idUserActua)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

        if ($entity == 'profile') {
            $query = "update mod_seguridad.seg_usuario set idpersona = null where idusuario = {$idusuario}";
        }
        if ($entity == 'role') {
            $query = "delete from mod_seguridad.dat_entidadusuariorol where idusuario = {$idusuario}";
        }
        $conn->fetchAll($query);
        $fechaM = date('d-M-Y H:i:s');
        $query = "update mod_seguridad.seg_usuario set modificadopor = $idUserActua,fmodificado = {$fechaM} where idusuario = {$idusuario}";
        $conn->fetchAll($query);
        return true;
    }

    public function getUserByUsername($username)
    {
        return Doctrine_Query::create()
            ->from('SegUsuario u')
            ->where("u.nombreusuario = ?", array($username))
            ->execute();
    }

}
