<?php

/**
 * Clase dominio para acceso a datos del nomenclador de Campos.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class NomCampo extends BaseNomCampo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomValor', 
            array('local' => 'idcampo', 'foreign' => 'idcampo')
        );
        $this->hasOne(
            'NomExpresiones', 
            array('local' => 'idexpresion', 'foreign' => 'idexpresion')
        );
    }

    static function obtenercantcampos()
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(a.idcampo) as cant')
            ->from('NomCampo a')
            ->execute();
        return $cantFndes[0]->cant;
    }

    static public function cargarcampo($limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'campo.idcampo,campo.nombre,campo.nombreamostrar,campo.tipo,
            campo.longitud,campo.visible,campo.tipocampo,campo.descripcion,
            campo.idexpresion,expre.expresion ,
            expre.denominacion,v.idcampo'
        )
            ->from('NomCampo campo,campo.NomExpresiones expre,campo.NomValor v')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static public function cargarcampoArbol()
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'campo.idcampo,campo.nombre,campo.nombreamostrar,campo.tipo,
                campo.longitud,campo.visible,campo.tipocampo,campo.descripcion,
                campo.idexpresion,expre.expresion ,
                expre.denominacion,v.idcampo'
        )
            ->from('NomCampo campo,campo.NomExpresiones expre,campo.NomValor v')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $fndes;
    }

    static public function cargarstoregrid($limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'u.idusuario, u.nombreusuario, f.idfila,v.idvalor,v.valor'
        )
            ->from('SegUsuario u')
            ->leftJoin('u.NomFila f')
            ->leftJoin('f.NomValor v')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static public function cantGridUsuarioDominio(
        $idusuario, $iddominio = "", $nombreusuario = "",
        $idrol = "", $dominiobuscar = "", $activar = "", $idGrupo = ""
    )
    {
        $whereRol = $idrol ? "and eur.idrol = {$idrol} " : "";
        $joinRol = $idrol 
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eur"
                . " ON usuario.idusuario = eur.idusuario " 
            : "";
        $where = " and usuario.nombreusuario like '%$nombreusuario%'";
        $joinGrupo = $idGrupo 
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON usuario.idusuario = eurg.idusuario 
                AND eurg.idrol 
                IN (SELECT rg.idrol FROM mod_seguridad.seg_rolgrupo rg 
                WHERE rg.idgrupo = {$idGrupo}) " 
            : "";
        if ($dominiobuscar)
            $where .= " and usuario.iddominio = '$dominiobuscar' ";
        if ($activar == 'Desactivar')
            $where .= " and usuario.activo = true ";
        if ($activar == 'Activar')
            $where .= " and usuario.activo = false ";
        return count(
            Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT usuario.idusuario
                FROM mod_seguridad.seg_usuario usuario
                 {$joinRol}
                 {$joinGrupo}
                left join mod_seguridad.seg_usuariodominio sud 
                on sud.idusuario = usuario.idusuario
                WHERE (usuario.iddominio IN (
                    SELECT dc.iddominio 
                    FROM mod_seguridad.seg_compartimentacionusuario dc 
                    WHERE dc.idusuario = ?
                ) or usuario.iddominio = 0 or sud.iddominio = ?)
                 {$whereRol}
                 {$where}
                ", 
                array($idusuario, $iddominio)
            )
        );
    }

    static public function gridUsuarioDominio(
        $nombreusuario, $idusuario, $iddominio, $limit, $offset, 
        $idrol = "", $dominiobuscar = "", $activar = "", $idGrupo = ""
    )
    {
        $whereRol = $idrol ? "and eur.idrol = {$idrol} " : "";
        $joinRol = $idrol 
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eur "
            . "ON usuario.idusuario = eur.idusuario " 
            : "";
        $where = " and u.nombreusuario like '%$nombreusuario%'";
        $joinGrupo = $idGrupo 
            ? " INNER JOIN mod_seguridad.dat_entidadusuariorol eurg 
                ON usuario.idusuario = eurg.idusuario 
                AND eurg.idrol 
                IN (SELECT rg.idrol FROM mod_seguridad.seg_rolgrupo rg
                WHERE rg.idgrupo = {$idGrupo}) " 
            : "";
        if ($dominiobuscar)
            $where .= " and u.iddominio = '$dominiobuscar' ";
        if ($activar == 'Desactivar')
            $where .= " and u.activo = true ";
        if ($activar == 'Activar')
            $where .= " and u.activo = false ";
        //$sqlFiltroUsuario = ($nombreusuario) 
        //    ? "AND u.nombreusuario like '%$nombreusuario%'" : '';
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT u.idusuario, u.nombreusuario, f.idfila, 
                v.idvalor, v.valor
            FROM mod_seguridad.seg_usuario u
            LEFT JOIN mod_seguridad.nom_fila f ON (u.idusuario = f.idusuario)
            LEFT JOIN mod_seguridad.nom_valor v ON (f.idfila = v.idfila)
            WHERE u.idusuario IN (
               SELECT usuario.idusuario
                FROM mod_seguridad.seg_usuario usuario
                {$joinRol}
                {$joinGrupo}
                left join mod_seguridad.seg_usuariodominio sud 
                on sud.idusuario = usuario.idusuario
                WHERE (usuario.iddominio IN (
                    SELECT dc.iddominio 
                    FROM mod_seguridad.seg_compartimentacionusuario dc 
                    WHERE dc.idusuario = ?
                ) or usuario.iddominio = 0 or sud.iddominio = ?)
                {$whereRol}
                {$where}
                LIMIT ? OFFSET ?
            )
            ", 
                array($idusuario, $iddominio, $limit, $offset)
            );
    }

    static public function usuarioDominioBuscado($nombreusuario, $arrayresult)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'u.idusuario, u.nombreusuario, f.idfila,v.idvalor,v.valor'
        )
            ->from('SegUsuario u')
            ->leftJoin('u.NomFila f')
            ->leftJoin('f.NomValor v')
            ->where("u.nombreusuario like '$nombreusuario%'")
            ->whereIn('u.idusuario', $arrayresult)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $fndes;
    }

    static public function usuarioBuscado($nombreusuario, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'u.idusuario, u.nombreusuario, f.idfila,v.idvalor,v.valor'
        )
            ->from('SegUsuario u')
            ->leftJoin('u.NomFila f')
            ->leftJoin('f.NomValor v')
            ->where("u.nombreusuario like '$nombreusuario%'")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static public function comprobarCampo($campo, $valor, $idcampo)
    {
        if ($idcampo) {
            $where = "$campo = ? AND idcampo <> ?";
            $filtro = array($valor, $idcampo);
        } else {
            $where = "$campo = ?";
            $filtro = array($valor);
        }
        $query = Doctrine_Query::create();
        $cantidad = $query->from('NomCampo')
            ->where($where, $filtro)
            ->execute();
        return count($cantidad);
    }

    static public function verificarCampoEliminar($idcampo)
    {
        $query = Doctrine_Query::create();
        $cantidad = $query->from('NomCampo c')
            ->innerJoin('c.NomValor v')
            ->where('v.idcampo = ?', $idcampo)
            ->execute();
        return count($cantidad);
    }

}
