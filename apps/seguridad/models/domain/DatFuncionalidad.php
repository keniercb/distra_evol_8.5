<?php

/**
 * Clase dominio de funcionalidades.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatFuncionalidad extends BaseDatFuncionalidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatAccion', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidad', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->hasOne(
            'DatSistema', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatFuncionalidadCompartimentacion', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->HasMany(
            'DatFuncionalidadDatAccion', 
            array(
                'local' => 'idfuncionalidad', 
                'foreign' => 'idfuncionalidadasociada'
            )
        );
        $this->HasMany(
            'DatRecurso',
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->HasMany(
            'DatRecursoFuncionalidad',
            array(
                'local' => 'idfuncionalidad',
                'foreign' => 'idfuncionalidad'
            )
        );
    }

    public static function cargarFuncionalidadesCompartimentacion(
        $idsistema, $iddominioComp
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad idfuncionalidad, f.idfuncionalidad id,'
            . ' f.denominacion text, true leaf, '
            . 'fc.idfuncionalidad idfuncionalidad'
        )
            ->from('DatFuncionalidad f')
            ->leftJoin(
                "f.DatFuncionalidadCompartimentacion fc "
                . "ON (f.idfuncionalidad = fc.idfuncionalidad "
                . "and fc.iddominio = '$iddominioComp')"
            )
            ->where(
                "f.idsistema = ? and f.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->execute();
    }

    public static function loadFuncionalitys(
        $idnodo, $idsistema, $iddominioComp, $idrecurso
    )
    {
        //$query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $sql = "SELECT DISTINCT f.idfuncionalidad AS idfuncionalidad, "
            . "f.idfuncionalidad || '_' || '$idnodo' AS id,
                CASE WHEN r.idrecurso IS NOT NULL 
                THEN '<font style=\"color:green; font-weight:bold;\">' 
                || f.denominacion || '</font>'
                ELSE f.denominacion END AS text,
                'funcionalidad' as type
                FROM dat_funcionalidad f
                LEFT JOIN mod_seguridad.dat_funcionalidadcompartimentacion fc 
                ON ((f.idfuncionalidad = fc.idfuncionalidad 
                AND fc.iddominio = ?))
                LEFT JOIN mod_seguridad.dat_funcionalidadaccion r 
                ON (f.idfuncionalidad = r.idfuncionalidadasociada 
                and r.idrecurso = ?)
                WHERE (f.idsistema = ? AND f.iddominio = ?)";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll(
                $sql, 
                array($iddominioComp, $idrecurso, $idsistema, $iddominio)
            );
    }

    public static function cargarFuncionalidadesRecursosCompart(
        $idsistema, $iddominioComp
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad, f.idfuncionalidad id, f.denominacion text, '
            . 'true leaf, fc.idfuncionalidad, r.idrecurso'
        )
            ->from('DatFuncionalidad f')
            ->leftJoin(
                "f.DatFuncionalidadCompartimentacion fc"
                . " ON (f.idfuncionalidad = fc.idfuncionalidad "
                . "and fc.iddominio = '$iddominioComp')"
            )
            ->innerJoin("f.DatRecurso r")
            ->where(
                "f.idsistema = ? and f.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->execute();
    }

    public static function cargarfuncionalidades($idsistema, $limit, $start)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            "f.idfuncionalidad id, f.referencia, f.denominacion text, "
            . "f.descripcion, f.abreviatura, f.icono,true leaf, f.idsistema, "
            . "f.index, s.idsistema, s.externa"
        )
            ->from('DatFuncionalidad f')
            ->leftJoin('f.DatSistema s')
            ->leftJoin('f.DatFuncionalidadCompartimentacion fc')
            ->where(
                "idsistema = ? and fc.iddominio = ?",
                array($idsistema, $global->Perfil->iddominio)
            )
            ->orderby('index')
            ->execute();
    }

    public static function cargarFuncionalidadesCompart($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad, f.idfuncionalidad id, '
            . 'f.denominacion text, true leaf, fc.idfuncionalidad'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->where(
                "f.idsistema = ? and fc.iddominio = ?",
                array($idsistema, $global->Perfil->iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function idsFuncionalidadesCompart($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select('f.idfuncionalidad')
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->where(
                "f.idsistema = ? and fc.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public function cargarfuncsistemarol($idsistema, $idrol)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (f.idfuncionalidad) id, f.denominacion text, '
            . 'f.referencia, f.icono, true leaf, f.idsistema'
        )
            ->from('DatFuncionalidad f, f.DatSistemaSegRolDatFuncionalidad srf')
            ->where(
                "srf.idsistema = ? and srf.idrol = ?", 
                array($idsistema, $idrol)
            )
            ->execute();
    }

    public static function obtenercantfunc($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $cantFndes = Doctrine_Query::create()->select(
            'count(f.idsistema) as cant'
        )
            ->from('DatFuncionalidad f')
            ->where(
                "f.idsistema = ? and f.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function obtenercantfuncCompart($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $cantFndes = Doctrine_Query::create()->select(
            'count(f.idsistema) as cant'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->where(
                "f.idsistema = ? and fc.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function obtenerCantFuncRecursosCompart($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $cantFndes = Doctrine_Query::create()->select(
            'count(f.idsistema) as cant'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->innerJoin("f.DatRecurso r")
            ->where(
                "f.idsistema = ? and fc.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function buscarfuncionalidades(
        $idsistema, $denominacion, $limit, $start
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            'idfuncionalidad id, referencia, denominacion text, '
            . 'descripcion, icono,idsistema,index, visible'
        )
            ->from('DatFuncionalidad')
            ->where(
                "idsistema = ? and denominacion like '%$denominacion%' "
                . "and iddominio = ?",
                array($idsistema, $global->Perfil->iddominio)
            )
            ->limit($limit)
            ->offset($start)
            ->orderBy('idfuncionalidad')
            ->execute();
    }

    public static function buscarfuncionalidadesgrid($idsistema, $limit, $start)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        return Doctrine_Query::create()->select(
            'idfuncionalidad id, referencia, denominacion text, '
            . 'descripcion, icono,idsistema,index, visible'
        )
            ->from('DatFuncionalidad')
            ->where(
                "idsistema = ? and iddominio = ?", 
                array($idsistema, $iddominio)
            )
            ->limit($limit)
            ->offset($start)
            ->orderBy('idfuncionalidad')
            ->execute();
    }

    public static function obtenercantfuncdenominacion(
        $idsistema, $denominacion
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $cantFndes = Doctrine_Query::create()->select(
            'count(f.idsistema) as cant'
        )
            ->from('DatFuncionalidad f')
            ->where(
                "f.idsistema = ? and f.iddominio = ? and denominacion "
                . "LIKE '%$denominacion%'", array($idsistema, $iddominio)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    public static function cargartodasacciones($idfuncionalidad)
    {
        return Doctrine_Query::create()->select(
            'a.idfuncionalidad, a.idaccion,a.denominacion'
        )
            ->from('DatAccion a')
            ->where("a.idfuncionalidad=?", $idfuncionalidad)
            ->execute();
    }

    public static function obtenerFuncionalidad($idsistema)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, '
            . 'f.referencia, f.descripcion, f.icono, f.visible'
        )
            ->from('DatFuncionalidad f')
            ->where("f.idsistema =?", $idsistema)
            ->execute();
    }

    public static function obtenerFuncionalidades($idsistema, $arrayIds)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, '
            . 'f.referencia,f.descripcion,f.icono, f.index'
        )
            ->from('DatFuncionalidad f')
            ->innerjoin(
                'f.DatSistemaSegRolDatFuncionalidad srf '
                . 'ON (f.idfuncionalidad = srf.idfuncionalidad)'
            )
            ->where(
                "srf.idsistema = ? AND f.visible = ?", array($idsistema, true)
            )
            ->whereIn('srf.idrol', $arrayIds)
            ->orderBy('f.index')
            ->execute();
    }

    public static function obtenerFuncionalidadess($idsistema)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, f.referencia,'
            . 'f.descripcion,f.visible, f.icono'
        )
            ->from('DatFuncionalidad f')
            ->innerjoin('f.DatSistemaSegRolDatFuncionalidad srf')
            ->where("srf.idsistema ={$idsistema}")
            ->execute();

    }

    public static function accesoFuncionalidad($rol, $url)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, f.referencia,'
            . 'f.descripcion,f.icono'
        )
            ->from('DatFuncionalidad f')
            ->innerjoin(
                'f.DatSistemaSegRolDatFuncionalidad rf '
                . 'ON f.idfuncionalidad = rf.idfuncionalidad'
            )
            ->where("rf.idrol =? and f.referencia=?", array($rol, $url))
            ->execute();
    }

    public static function getFuncionalidades($idrol)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, '
            . 'f.referencia,f.descripcion,f.icono'
        )
            ->from('DatFuncionalidad f')
            ->innerjoin(
                'f.DatSistemaSegRolDatFuncionalidad rf '
                . 'ON f.idfuncionalidad = rf.idfuncionalidad'
            )
            ->where("rf.idrol =?", $idrol)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function cargarfuncionalidadesacciones($idsistema, $idrol)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, f.descripcion, '
            . ' f.index, a.idaccion  , a.denominacion, a.descripcion'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatAccion a")
            ->innerJoin("a.DatSistemaSegRolDatFuncionalidadDatAccion sra")
            ->where(
                "f.idsistema = ? AND sra.idrol = ?   ",
                array($idsistema, $idrol)
            )
            ->orderBy('f.index,a.descripcion ')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function cargarFuncionalidadesRecursos($idsistema)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad, f.idfuncionalidad id, f.denominacion text, '
            . 'true leaf, fc.idfuncionalidad, r.idrecurso'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->innerJoin("f.DatRecurso r")
            ->where(
                "f.idsistema = ? and fc.iddominio = ?", 
                array($idsistema, $global->Perfil->iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function verificarFuncionalidad(
        $campo, $valor, $idsistema, $idfuncionalidad
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($idfuncionalidad) {
            $where = "f.$campo = ? AND f.idsistema = ? and fc.iddominio = ? "
                . "AND f.idfuncionalidad <> ?";
            $filtro = array($valor, $idsistema, $iddominio, $idfuncionalidad);
        } else {
            $where = "f.$campo = ? AND f.idsistema = ? and fc.iddominio = ?";
            $filtro = array($valor, $idsistema, $iddominio);
        }
        $datos = Doctrine_Query::create()->select(
            'count(f.idfuncionalidad) cant'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin("f.DatFuncionalidadCompartimentacion fc")
            ->where($where, $filtro)
            ->execute();
        return $datos[0]->cant;
    }

    public static function verificarFuncionalidadUsoUsuario($idfuncionalidad)
    {
        $datos = Doctrine_Query::create()->select(
            'count(distinct idfuncionalidad) cant'
        )
            ->from('DatFuncionalidad f')
            ->innerJoin('f.DatSistemaSegRolDatFuncionalidad srf')
            ->innerJoin('srf.DatSistemaSegRol sr')
            ->innerJoin('sr.SegRol r')
            ->innerJoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerJoin('eur.SegUsuario u')
            ->where(
                'f.idfuncionalidad = ? and u.activo = ?',
                array($idfuncionalidad, true)
            )
            ->execute();
        return $datos[0]->cant;
    }

    public static function getFuncionalidadesCohencidentes($texto, $idsistema)
    {
        $sql = "
        --Funcionalidades
        SELECT * FROM mod_seguridad.dat_funcionalidad f
        WHERE f.idsistema = $idsistema AND (f.denominacion LIKE '%$texto%' OR (
	    SELECT COUNT(a.idaccion)
	    FROM mod_seguridad.dat_accion a
	    WHERE a.idfuncionalidad = f.idfuncionalidad 
            AND a.denominacion LIKE '%$texto%'
        ) > 0);

        ";
        return Doctrine_Manager::getInstance()
            ->getCurrentConnection()
            ->fetchAll($sql);
    }
    public static function getMenuFuncionalidad($referencia)
    {
        $datos = Doctrine_Query::create()->select(
            'idsistema as idsistema, denominacion as denominacion, '
            . 'idfuncionalidad as idfuncionalidad'
        )
            ->from('DatFuncionalidad f')
            ->where('f.referencia = ? ', array($referencia))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }
    static public function obtenerDatosFuncionalidades($arrayidfuncionalidades)
    {
        $cadenaQUERY = "select * from mod_seguridad.dat_funcionalidad f "
            . "where f.idfuncionalidad in ({$arrayidfuncionalidades})";
        $conex = Doctrine_Manager :: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function actualizarIndiceFuncionalidad(
        $idpadreNuevo, $indiceNuevo, $idpadreViejo, $idindiceViejo, $idfuncionalidad)
    {
//update dat_sistema set index = index + 1 where idpadre = $nuevoIdpadre and index >= $nuevoIndex
//update dat_sistema set index = index - 1 where idpadre = $viejoIdpadre and index > $viejoIndex
        if ($idfuncionalidad) {
            $where1 = 'f.idsistema = ? and f.index >= ? and f.idfuncionalidad <> ?';
            $filtro1 = array($idpadreNuevo, $indiceNuevo, $idfuncionalidad);

            $where2 = 'f.idsistema = ? and f.index >= ? and f.index <> 0 and f.idfuncionalidad <> ?';
            $filtro2 = array($idpadreViejo, $idindiceViejo, $idfuncionalidad);
        } else {
            $where1 = 'f.idsistema = ? and f.index >= ?';
            $filtro1 = array($idpadreNuevo, $indiceNuevo);

            $where2 = 'f.idsistema = ? and f.index >= ? and f.index <> 0';
            $filtro2 = array($idpadreViejo, $idindiceViejo);
        }
        if ($idpadreViejo == $idpadreNuevo) {
            $q = Doctrine_Query::create();
            $q->update('DatFuncionalidad f')
                ->set('f.index', 'f.index + 1')
                ->where($where1, $filtro1)
                ->execute();
        } else {

            self::adicionarIndiceFuncionalidad($where1, $filtro1);

            //en los del viejo padre resto
            self::restarIndiceFuncionalidad($where2, $filtro2);

        }
        return;
    }

    public function adicionarIndiceFuncionalidad($where1, $filtro1)
    {
        $q = Doctrine_Query::create();
        return $q->update('DatFuncionalidad f')
            ->set('f.index', 'f.index + 1')
            ->where($where1, $filtro1)
            ->execute();
    }

    public function restarIndiceFuncionalidad($where2, $filtro2)
    {
        $query = Doctrine_Query::create();
        return $query->update('DatFuncionalidad f')
            ->set('f.index', 'f.index - 1')
            ->where($where2, $filtro2)
            ->execute();
    }
    
    /**
     * Funcion usada para retornar las funcionalidades no visibles a partir de 
     * una uri
     * @param string $uri cadena de busqueda usada en la referencia
     * @param array $arrayIds Listado de identificadores de roles.
     * @return array Listado de funcionalidades no visibles.
     */
    public static function obtenerFuncionalidadesNoVisibles($uri, $arrayIds)
    {
        return Doctrine_Query::create()->select(
            'f.idfuncionalidad id, f.denominacion text, '
            . 'f.referencia,f.descripcion,f.icono, f.index'
        )
            ->from('DatFuncionalidad f')
            ->innerjoin(
                'f.DatSistemaSegRolDatFuncionalidad srf '
                . 'ON (f.idfuncionalidad = srf.idfuncionalidad)'
            )
            ->where(
                "f.referencia LIKE '%$uri%' AND f.visible = ?", false
            )
            ->whereIn('srf.idrol', $arrayIds)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function obtenerReferenciaByIdFuncionalidad($idfuncionalidad){
        $query = Doctrine_Query::create();
        $datos = $query->select('f.referencia')
            ->from('DatFuncionalidad f')
            ->where('f.idfuncionalidad = ?', $idfuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    public static function obtenerIconoFuncionalidadById ($idfuncionalidad) {
        $query = Doctrine_Query::create();
        $datos = $query->select('f.icono')
            ->from('DatFuncionalidad f')
            ->where('f.idfuncionalidad = ?', $idfuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }
}