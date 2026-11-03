<?php

/**
 * Clase dominio de Recursos.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class DatRecurso extends BaseDatRecurso
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFuncionalidad', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->HasMany(
            'DatFuncionalidadDatAccion',
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidadDatAccion', 
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
        $this->hasMany(
            'DatRecursoCompartimentacion', 
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
        $this->hasMany(
            'DatRecursoFuncionalidad',
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
    }

    static public function buscarRecursos(
        $idfuncionalidad, $denominacion, $limit, $start
    )
    {
        if ($denominacion != '')
            $where = "r.idfuncionalidad = ? "
            . "and r.denominacion like '%$denominacion%'";
        else
            $where = "r.idfuncionalidad = ?";
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.abreviatura, '
            . 'r.descripcion, r.idfuncionalidad, r.icono'
        )
            ->from('DatRecurso r')
            ->where($where, $idfuncionalidad)
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function buscarRecursosI($idfuncionalidad, $denominacion)
    {
        if ($denominacion != '')
            $where = "r.idfuncionalidad = ? "
                . "and r.denominacion like '%$denominacion%'";
        else
            $where = "r.idfuncionalidad = ?";
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.abreviatura, '
            . 'r.descripcion, r.idfuncionalidad, r.icono'
        )
            ->from('DatRecurso r')
            ->where($where, $idfuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function obtenercantRecursosBuscados(
        $idfuncionalidad, $denominacion
    )
    {
        if ($denominacion != '')
            $where = "r.idfuncionalidad = ? "
            . "and r.denominacion like '%$denominacion%'";
        else
            $where = "r.idfuncionalidad = ?";
        $query = Doctrine_Query::create();
        $datos = $query->select('count(r.idrecurso) cantidad')
            ->from('DatRecurso r')
            ->where($where, $idfuncionalidad)
            ->execute();
        return $datos[0]->cantidad;
    }

    static function eliminarRecursos($arrayRecursosElim)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatRecurso')
            ->whereIn('idrecurso', $arrayRecursosElim)
            ->execute();
    }

    static public function cargarRecursosPermitidos(
        $idsistema, $idrol, $idfuncionalidad, $limit, $start
    )
    {
        $query = Doctrine_Query::create();
        $datos =$query->select('r.idrecurso, r.denominacion, r.idfuncionalidad')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ? and s.idrol = ? and s.idfuncionalidad = ?", 
                array($idsistema, $idrol, $idfuncionalidad)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function cantRecursosPermitidos(
        $idsistema, $idrol, $idfuncionalidad
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(DISTINCT(r.idrecurso)) cantidad')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ? and s.idrol = ? and s.idfuncionalidad = ?", 
                array($idsistema, $idrol, $idfuncionalidad)
            )
            ->execute();
        return $datos[0]->cantidad;
    }

    static public function obtenerRecursosPermitidosI($idsist, $idrol, $idfunc)
    {
        $datos1 = self::obtenerRecursosPermitidos($idsist, $idrol, $idfunc);
        $datos2 = self::obtenerRecursosHeredadosPermitidos($idsist, $idrol, $idfunc);
        $datos = array_merge($datos1,$datos2);
        return $datos;
    }

    static public function obtenerRecursosPermitidos($idsist, $idrol, $idfunc)
    {
        $query = Doctrine_Query::create();
        $datos =$query->select('r.idrecurso, r.denominacion, r.idfuncionalidad')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion s')
            ->where(
                "s.idsistema = ? and s.idrol = ? and s.idfuncionalidad = ?", 
                array($idsist, $idrol, $idfunc)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function obtenerRecursosHeredadosPermitidos($idsist, $idrol, $idfunc)
    {
        $query = Doctrine_Query::create();

            $datos =$query->select('r.idrecurso, r.denominacion, r.idfuncionalidad')
                ->from('DatRecurso r')
                ->innerjoin('r.DatRecursoFuncionalidad rf')
                ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion s')
                ->where(
                    "s.idsistema = ? and s.idrol = ? and rf.idfuncionalidad = ?",
                    array($idsist, $idrol, $idfunc)
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

        return $datos;
    }

    static public function obtenerRecursosNoPermitidosI(
        $idfuncionalidad, $arrayRecursos, $limit, $start
    )
    {
        $datos1 = self::obtenerRecursosNoPermitidos($idfuncionalidad, $arrayRecursos, $limit, $start);
        $datos2 = self::obtenerRecursosHeredadosNoPermitidos($idfuncionalidad, $arrayRecursos, $limit, $start);
        $datos = array_merge($datos1,$datos2);
        return $datos;
    }

    static public function obtenerRecursosNoPermitidos(
        $idfuncionalidad, $arrayRecursos, $limit, $start
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.idfuncionalidad'
        )
            ->from('DatRecurso r')
            ->where("r.idfuncionalidad = ?", $idfuncionalidad)
            ->whereNotIn('r.idrecurso', $arrayRecursos)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function obtenerRecursosHeredadosNoPermitidos(
        $idfuncionalidad, $arrayRecursos, $limit, $start
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.idfuncionalidad'
        )
            ->from('DatRecurso r')
            ->innerjoin('r.DatRecursoFuncionalidad rf')
            ->where("rf.idfuncionalidad = ?", $idfuncionalidad)
            ->whereNotIn('r.idrecurso', $arrayRecursos)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function cantidadRecursosNoPermitidos(
        $idfuncionalidad, $arrayRecursos
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(r.idrecurso) cant')
            ->from('DatRecurso r')
            ->where("r.idfuncionalidad = ?", $idfuncionalidad)
            ->whereNotIn('r.idrecurso', $arrayRecursos)
            ->execute();
        return $datos[0]->cant;
    }

    static function cargarRecursosCompartimentacion(
        $idfuncionalidad, $iddominioComp
    )
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'r.denominacion text, true as leaf, r.idrecurso id, '
            . 'r.idrecurso, rc.idrecurso'
        )
            ->from('DatRecurso r')
            ->leftJoin(
                "r.DatRecursoCompartimentacion rc "
                . "ON (r.idrecurso = rc.idrecurso "
                . "and rc.iddominio = '$iddominioComp')"
            )
            ->where(
                "r.idfuncionalidad = ? and r.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->execute();
        return $datos;
    }

    static public function cargarRecursosDominioByArrayIdFunc(
        $arrIdFuncionalidad
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso id')
            ->from('DatRecurso r')
            ->where("r.iddominio = ?", $iddominio)
            ->whereIn("r.idfuncionalidad", $arrIdFuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargarRecursosByArrayIdFunc($arrIdFuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso id')
            ->from('DatRecurso r')
            ->where("r.iddominio = ?", $iddominio)
            ->whereIn("r.idfuncionalidad", $arrIdFuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function ObtenerRecursosXml($idaccion, $idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso,r.denominacion, r.descripcion, r.abreviatura'
        )
            ->from('DatRecurso r')
            ->innerjoin('r.DatFuncionalidadDatAccion fa')
            ->where(
                "r.idfuncionalidad = fa.idfuncionalidadasociada "
                . "and r.iddominio = ? and r.idfuncionalidad =? "
                . "and fa.idaccion = ?", 
                array($iddominio, $idfuncionalidad, $idaccion)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }
    static public function buscarRecursosAccion(
        $idaccion,$idfuncionalidad, $denominacion, $limit, $start
    )
    {
       if ($denominacion != '')
            $where = "fa.idfuncionalidadasociada = ? "
           . "and fa.idaccion = ? and fa.idrecurso = r.idrecurso "
           . "and r.denominacion like '%$denominacion%'";
        else
            $where = "fa.idfuncionalidadasociada = ? "
            . "and fa.idaccion = ? "
            . "and fa.idrecurso = r.idrecurso";
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.abreviatura, '
            . 'r.descripcion, r.idfuncionalidad'
        )
            ->from('DatRecurso r,DatFuncionalidadDatAccion fa')
            ->where($where, array($idfuncionalidad,$idaccion))
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;

    }


    static public function findIdRecurso($denominacion, $idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso')
            ->from('DatRecurso r')
            ->where(
                "r.denominacion = ? and r.idfuncionalidad = ? "
                . "and r.iddominio = ?",
                array($denominacion, $idfuncionalidad, $iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargarRecursosService($idfuncionalidad, $arrayIdrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,r.denominacion, r.abreviatura')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion sfa')
            ->where("r.idfuncionalidad = ?", $idfuncionalidad)
            ->whereIn("sfa.idrol", $arrayIdrol)
            ->execute();
        return $datos;
    }

    static public function obtenerRecursosPorArrayIdRoles($arrayIds)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'DISTINCT r.idrecurso,r.denominacion, r.abreviatura'
        )
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion sfa')
            ->whereIn("sfa.idrol", $arrayIds)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargarRecursosServiceByIdFunc($idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,r.denominacion, r.abreviatura')
            ->from('DatRecurso r')
            ->where("r.idfuncionalidad = ? ", $idfuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargarRecursosServiceByUri($uri, $idrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,r.denominacion, r.abreviatura')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion sfa')
            ->where(
                "r.idfuncionalidad = (SELECT f.idfuncionalidad "
                . "FROM DatFuncionalidad f WHERE f.referencia = ?) "
                . "AND sfa.idrol = ?", 
                array($uri, $idrol)
            )
            ->execute();
        return $datos;
    }

    static public function verifyAccessToResourse(
        $idusuario, $resourse, $arrayRoles
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('r.idrecurso,r.denominacion, r.abreviatura')
            ->from('DatRecurso r')
            ->innerjoin('r.DatSistemaSegRolDatFuncionalidadDatAccion rrfa')
            ->innerjoin('r.DatFuncionalidadDatAccion fa')
            ->innerjoin('fa.DatFuncionalidad f')
            ->innerjoin('fa.DatAccion a')
            ->where(
                "f.referencia = ? and a.denominacion = ?", 
                array($resourse[0], $resourse[1])
            )
            ->whereIn('rrfa.idrol', $arrayRoles)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function verificarRecurso(
        $campo, $valor, $idfuncionalidad, $idrecurso
    )
    {
        if ($idrecurso) {
            $where = "r.$campo = ? AND r.idfuncionalidad = ? "
                . "AND r.idrecurso <> ?";
            $filtro = array($valor, $idfuncionalidad, $idrecurso);
        } else {
            $where = "r.$campo = ? AND r.idfuncionalidad = ?";
            $filtro = array($valor, $idfuncionalidad);
        }
        $query = Doctrine_Query::create();
        $datos = $query->select('count(r.idrecurso) cant')
            ->from('DatRecurso r')
            ->where($where, $filtro)
            ->execute();
        return $datos[0]->cant;
    }

    static public function obtenerSistemasConRecursos($idrecurso)
    {
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                "SELECT DISTINCT s.idsistema, s.lft, s.rgt
            FROM mod_seguridad.dat_recurso r
            INNER JOIN mod_seguridad.dat_funcionalidadaccion fa 
            ON (r.idrecurso = fa.idrecurso)
            INNER JOIN mod_seguridad.dat_funcionalidad f 
            ON (f.idfuncionalidad = fa.idfuncionalidadasociada)
            INNER JOIN mod_seguridad.dat_sistema s 
            ON (f.idsistema = s.idsistema)
            WHERE r.idrecurso = ?", array($idrecurso)
            );
    }

    static public function obtenerRecursoById($idrecurso)
    {

        $query = Doctrine_Query::create();
        $datos = $query->select(
            'r.idrecurso, r.denominacion, r.abreviatura, '
            . 'r.descripcion, r.idfuncionalidad, r.icono'
        )
            ->from('DatRecurso r')
            ->where('r.idrecurso = ?', $idrecurso)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;

    }

}