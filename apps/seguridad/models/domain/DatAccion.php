<?php

/**
 * @name DatAccion - Clase dominio de Acciones.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class  DatAccion extends BaseDatAccion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFuncionalidad',
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
        $this->hasMany(
            'DatSistemaSegRolDatFuncionalidadDatAccion', 
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasMany(
            'DatAccionCompartimentacion', 
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->HasMany(
            'DatFuncionalidadDatAccion', 
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    /**
     * @author Darien García Tejo.
     * @method cargarAccionesCompartimentacion - Función usada para obtener
     *  todas las acciones de una funcionalidad determinada que pueden ser
     *  gestionadas en el dominio solicitado.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $iddominioComp - Identificador del dominio
     * @return Doctrine_Collection
     */
    static function cargarAccionesCompartimentacion(
        $idfuncionalidad, $iddominioComp
    )
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'a.idaccion, a.idaccion id, a.denominacion text, true leaf,'
            . ' ac.idaccion'
        )
            ->from('DatAccion a')
            ->leftJoin(
                "a.DatAccionCompartimentacion ac ON (a.idaccion = ac.idaccion "
                . "and ac.iddominio = '$iddominioComp')"
            )
            ->where(
                "a.idfuncionalidad = ? and a.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->execute();
        return $datos;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarAcciFuncCompartimentacion - Carga todas las acciones 
     * compartimentadas por el identificador del dominio que esta en sesion.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return Doctrine_Collection
     */
    static function cargarAcciFuncCompartimentacion($idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'a.idaccion, a.idaccion id, a.denominacion text, true leaf, '
            . 'ac.idaccion'
        )
            ->from('DatAccion a')
            ->innerJoin("a.DatAccionCompartimentacion ac")
            ->where(
                "a.idfuncionalidad = ? and a.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->execute();
        return $datos;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarAcciCompartimentacion - Función que retorna todas las 
     * acciones asociadas a un rol y compartimentadas por dominio.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $idrol - Identificador del rol.
     * @return Doctrine_Collection
     */
    static function cargarAcciCompartimentacion($idfuncionalidad, $idrol)
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'a.idaccion, a.idaccion id, a.denominacion text, true leaf, '
            . 'ac.idaccion, ra.idaccion'
        )
            ->from('DatAccion a')
            ->innerJoin(
                "a.DatAccionCompartimentacion ac ON a.idaccion = ac.idaccion"
            )
            ->innerJoin(
                "a.DatSistemaSegRolDatFuncionalidadDatAccion ra"
                . " ON a.idaccion = ra.idaccion"
            )
            ->where(
                "a.idfuncionalidad = ? and ac.iddominio = ? and ra.idrol= ?", 
                array($idfuncionalidad, $iddominio, $idrol)
            )
            ->execute();
        return $datos;
    }

    /**
     * @method cargarAccionesNoTiene - Retorn todas las acciones de la 
     * funcionalidad que no se encuentren entre las que se 
     * ingresan por parámetro, compartimentadas por dominio.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param array $arrayAcc - Arreglo de acciones.
     * @param integer $limit - Limite de la búsqueda.
     * @param integer $start - Comienzo de la búsqueda.
     * @return Doctrine_Collection
     */
    static function cargarAccionesNoTiene(
        $idfuncionalidad, $arrayAcc, $limit, $start
    )
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'a.idaccion, a.idaccion id, a.denominacion,'
            . 'a.idfuncionalidad, ac.idaccion'
        )
            ->from('DatAccion a')
            ->innerJoin(
                "a.DatAccionCompartimentacion ac ON a.idaccion = ac.idaccion"
            )
            ->where(
                "a.idfuncionalidad = ? and ac.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->whereNotIn('ac.idaccion', $arrayAcc)
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    /**
     * @method cargaraccion - Retorna todas las acciones que pertenecen a 
     * una funcionalidad determinada. Esta carga es realizada por lotes.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $limit - Limite de la búsqueda.
     * @param integer $start - Comienzo de la búsqueda.
     * @return Doctrine_Collection
     */
    static public function cargaraccion($idfuncionalidad, $limit, $start)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos =$query->select('a.idaccion id,a.denominacion,a.idfuncionalidad')
            ->from('DatAccion a')
            ->where(
                "a.idfuncionalidad = ? and a.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $datos;
    }

    static public function cargaraccionnew($idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos =$query->select('a.idaccion id,a.denominacion,a.idfuncionalidad')
        ->from('DatAccion a')
        ->where(
            "a.idfuncionalidad = ? and a.iddominio = ?", 
            array($idfuncionalidad, $iddominio)
        )
        ->execute();

        return $datos;
    }

    /**
     * @method cargarAccionByIdFunc - Retorna todas las acciones que pertenecen
     *  a una funcionalidad determinada, compartimentadas por dominio.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return Doctrine_Collection
     */
    static public function cargarAccionByIdFunc($idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select(
            "a.idaccion, CONCAT(a.denominacion,'Action') denominacion"
        )
            ->from('DatAccion a')
            ->where(
                "a.idfuncionalidad = ? and a.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function cargarAccionByIdFuncII($idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $query = Doctrine_Query::create();
        $datos = $query->select(
            "a.idaccion, CONCAT(a.denominacion,'Action') denominacion, "
            . "a.descripcion as descripcion"
        )
            ->from('DatAccion a')
            ->where(
                "a.idfuncionalidad = ?",
                array($idfuncionalidad)
            )
            ->orderby('a.idaccion')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }
    /**
     * @method obtenerAcciones - Retorna todas las acciones que pertenecen 
     * a una funcionalidad.
     * @param type $idfuncionalidad - Identificador de la funcionalidad.
     * @return Doctrine_Collection
     */
    static public function obtenerAcciones($idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('a.idaccion, a.denominacion, a.descripcion')
            ->from('DatAccion a')
            ->where("a.idfuncionalidad = ?", $idfuncionalidad)
            ->execute();
        return $datos;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarAccionByArrayIdFunc - Retorna un arreglo de acciones dado
     *  un arreglo de identificadores de funcionalidades, compartimentadas 
     * por el dominio.
     * @param type $arrIdFuncionalidad - Arreglo de identificadores de 
     * funcionalidades.
     * @return array
     */
    static public function cargarAccionByArrayIdFunc($arrIdFuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $datos = $query->select('a.idaccion id')
            ->from('DatAccion a')
            ->where("a.iddominio = ?", $iddominio)
            ->whereIn("a.idfuncionalidad", $arrIdFuncionalidad)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    /**
     * @method obtenercantaccion - Retorna la cantidad de acciones que 
     * pertenecen a una funcionalidad determinada, compartimentadas por dominio
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return integer - Cantidad de ocurrencias.
     */
    static function obtenercantaccion($idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(a.idaccion) as cant')
            ->from('DatAccion a')
            ->where(
                "a.idfuncionalidad = ? and a.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * @method buscaraccion - Retorna un listado de acciones compartimentadas
     *  por el dominio y filtradas por la funcionalidad y la denominación.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param string $denominacion - Denominación de la acción a buscar 
     * ó parte de ella.
     * @param integer $limit - Limite de la búsqueda.
     * @param integer $start - Comienzo de la búsqueda.
     * @return Doctrine_Collection
     */
    static public function buscaraccion(
        $idfuncionalidad, $denominacion, $limit, $start
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($denominacion!='') {
            $where = "a.idfuncionalidad = ? and a.denominacion "
                . "like '%$denominacion%' and a.iddominio = ?";

        } else {

            $where = "a.idfuncionalidad = ? and a.iddominio = ? ";
        }
        $query = Doctrine_Query::create();        
        $query->select(
            "a.idaccion id,a.denominacion,a.descripcion,a.idfuncionalidad, "
            . "'true' as checked"
        )
            ->from('DatAccion a')
            ->where($where, array($idfuncionalidad,$iddominio))
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $query->fetchArray();
    }

    /**
     * @method obtenercantaccionbuscadas - Retorna la cantidad de acciones 
     * que pertenecen a una funcionalidad determinada y su denominación 
     * contiene la cadena buscada.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param string $denominacion - Denominación de la acción a buscar ó 
     * parte de ella.
     * @return integer
     */
    static public function obtenercantaccionbuscadas(
        $idfuncionalidad, $denominacion
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if($denominacion!='')
            $where = "a.idfuncionalidad = ? and a.iddominio = ? and "
            . "denominacion like '%$denominacion%'";
        else
            $where = "a.idfuncionalidad = ? and a.iddominio = ? ";
        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(a.idaccion) as cant')
            ->from('DatAccion a')
            ->where($where, array($idfuncionalidad, $iddominio))
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * @method cargaracciones - Retorna todas las acciones de una 
     * funcionalidad, dentro de un sistema que pertenecen al un rol determinado
     * @param integer $idsistema - Identificador del sistema.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $idrol - Identificador del rol.
     * @return Doctrine_Collection
     */
    static public function cargaracciones($idsistema, $idfuncionalidad, $idrol)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('a.denominacion, a.idaccion')
            ->from(
                'DatAccion a, a.DatSistemaSegRolDatFuncionalidadDatAccion esfa'
            )
            ->where(
                "esfa.idsistema = ? and esfa.idfuncionalidad = ? "
                . "and esfa.idrol = ?", 
                array($idsistema, $idfuncionalidad, $idrol)
            )
            ->execute();
        return $datos;
    }

    static public function cargarAccionesByidsistemaByRol($idsistema,$idrol){
        $query = Doctrine_Query::create();
        $datos = $query->select('a.idaccion, a.denominacion, a.descripcion, a.idfuncionalidad')
            ->from('DatAccion a')
            ->innerjoin(
                'a.DatSistemaSegRolDatFuncionalidadDatAccion ra'
            )
            ->where(
                "ra.idrol = ? and ra.idsistema = ?",
                array($idrol, $idsistema)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    /**
     * @method accesoAccion - Retorna un listado de acciones que pertenecen 
     * a un rol y tengan la misma denominación.
     * @param integer $rol - Identificador del rol.
     * @param string $denominacion - Denominación de la acción.
     * @return Doctrine_Collection
     */
    static public function accesoAccion($rol, $denominacion)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('a.denominacion, a.idaccion')
            ->from('DatAccion a')
            ->innerjoin(
                'a.DatSistemaSegRolDatFuncionalidadDatAccion ra '
                . 'ON a.idaccion = ra.idaccion'
            )
            ->where(
                "ra.idrol = ? and a.denominacion = ?", 
                array($rol, $denominacion)
            )
            ->execute();
        return $datos;
    }

    /**
     * @method cargarAccionesRecursos - Retorna un listado de acciones que
     *  pertenecen a una funcionalidad y que pueden estar contenidas 
     * dentro de un recurso.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $recurso - Identificador del recurso.
     * @return Doctrine_Collection
     */
    static public function cargarAccionesRecursos($idfuncionalidad, $recurso)
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($recurso)
            $leftJoin = "a.DatFuncionalidadDatAccion fra "
            . "ON (a.idaccion = fra.idaccion and fra.idrecurso = $recurso)";
        else
            $leftJoin = "a.DatFuncionalidadDatAccion fra";
        $datos = $query->select(
            'a.idaccion, a.idaccion id, a.denominacion text, true leaf, '
            . 'ac.idaccion, fra.idaccion, fra.idrecurso'
        )
            ->from('DatAccion a')
            ->innerJoin("a.DatAccionCompartimentacion ac")
            ->leftJoin($leftJoin)
            ->where(
                "a.idfuncionalidad = ? and ac.iddominio = ?", 
                array($idfuncionalidad, $iddominio)
            )
            ->execute();
        return $datos;
    }

    /**
     * @method loadActionsResourses - Retorna un listado de acciones 
     * que pertenecen a una funcionalidad y que pueden estar 
     * contenidas dentro de un recurso.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $recurso - Identificador del recurso.
     * @return Doctrine_Collection
     */
    static public function loadActionsResourses(
        $idnodo, $idfuncionalidad, $idrecurso, $opcion
    )
    {
        //$query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $chequed = "";
        if ($opcion == 'mod') {
            $chequed = "CASE WHEN fa.idrecurso IS NOT NULL 
                THEN TRUE ELSE FALSE END AS checked,
                        CASE WHEN fa.idrecurso IS NOT NULL 
                        THEN TRUE ELSE FALSE END AS defaultchecked,";
        } else {
            $chequed = "FALSE AS checked,";
        }
        $sql = "SELECT a.idaccion || '_' || '$idnodo' AS id, a.idaccion"
            . " AS idaccion, $idfuncionalidad AS idfuncionalidad,
                $chequed
                a.idaccion AS idaccion, a.denominacion AS text, 
                true AS leaf, 'accion' as type
                FROM mod_seguridad.dat_accion a 
                INNER JOIN mod_seguridad.dat_accioncompartimentacion ac 
                ON (a.idaccion = ac.idaccion )
                LEFT JOIN mod_seguridad.dat_funcionalidadaccion fa 
                ON ((a.idaccion = fa.idaccion AND fa.idrecurso = ?))
                WHERE (a.idfuncionalidad = ? AND ac.iddominio = ?)";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql, array($idrecurso, $idfuncionalidad, $iddominio));
    }

    /**
     * @author Darien García Tejo.
     * @method cargarRecursosAdd - Función usada para cargar totas las 
     * acciones que estan asociadas a un recurso dado 
     * el identificador de la funcionalidad.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return array
     */
    static public function cargarRecursosI($idfuncionalidad)
    {
        $datos1 = self::cargarRecursosAdd($idfuncionalidad);
        $datos2 = self::cargarRecursosHeredadosAdd($idfuncionalidad);
        $datos = array_merge($datos1,$datos2);
        return $datos;

        // var_dump("\n...........Viendo los resultados datos1......................");
//        var_dump($datos1);
//        var_dump("\n........................................");
//        var_dump("\n...........datos2......................");
//        var_dump($datos2);
//        var_dump("\n........................................");
//        var_dump("\n...........datos......................");
//        var_dump($datos);
//        var_dump("\n........................................");
//        die();
    }

    static public function cargarRecursosAdd($idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $datos = $query->select(
            'a.idaccion, ac.idaccion, fa.idrecurso, r.denominacion, '
            . 'r.abreviatura, r.idrecurso'
        )
            ->from('DatAccion a')
            ->innerJoin("a.DatAccionCompartimentacion ac")
            ->innerJoin("a.DatFuncionalidadDatAccion fa")
            ->innerJoin("fa.DatRecurso r")
            ->where(
                "r.idfuncionalidad = ? and ac.iddominio = ?",
                array($idfuncionalidad, $iddominio)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $datos;
    }

    static public function cargarRecursosHeredadosAdd($idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;

            $datos = $query->select(
                'a.idaccion, ac.idaccion, fa.idrecurso, r.denominacion, '
                . 'r.abreviatura, r.idrecurso'
            )
                ->from('DatAccion a')
                ->innerJoin("a.DatAccionCompartimentacion ac")
                ->innerJoin("a.DatFuncionalidadDatAccion fa")
                ->innerJoin("fa.DatRecurso r")
                ->innerJoin("r.DatRecursoFuncionalidad rf")
                ->innerJoin("rf.DatFuncionalidad f")
                ->where(
                    "rf.idfuncionalidad = ? and ac.iddominio = ?",
                    array($idfuncionalidad, $iddominio)
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    static public function cargarRecursosAddII(
        $idfuncionalidad, $idrecurso,$denominacion,$limit=null, $start=null
    )
    {

        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if($denominacion!='')
            $where = "r.idfuncionalidad = ?"
            . "and r.idrecurso = ? and a.denominacion like '%$denominacion%'";
        else
            $where = "r.idfuncionalidad = ? "
            . "and r.idrecurso = ?";
        if ($limit) {
//            var_dump('entro aqui'.'limite '.$limit.' Start '.$start);
            $datos = $query->select(
                'a.idaccion, ac.idaccion, fa.idrecurso, '
                . 'r.denominacion, r.abreviatura, r.idrecurso'
            )
                ->from('DatAccion a')
                //->innerJoin("a.DatAccionCompartimentacion ac")
                ->innerJoin("a.DatFuncionalidadDatAccion fa")
                ->innerJoin("fa.DatRecurso r")
                ->where(
                    $where, 
                    array($idfuncionalidad, $idrecurso)
                )
                ->limit($limit)
                ->offset($start)
                ->execute();
        } else {
            $datos = $query->select(
                'a.idaccion, ac.idaccion, fa.idrecurso, '
                . 'r.denominacion, r.abreviatura, r.idrecurso'
            )
                ->from('DatAccion a')
                //->innerJoin("a.DatAccionCompartimentacion ac")
                ->innerJoin("a.DatFuncionalidadDatAccion fa")
                ->innerJoin("fa.DatRecurso r")
                ->where(
                    $where, 
                    array($idfuncionalidad, $idrecurso)
                )
                ->execute();
        }


        return $datos;
    }
    static public function cantRecursosAddII(
        $idfuncionalidad, $idrecurso,$denominacion
    )
    {
        $query = Doctrine_Query::create();
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if($denominacion!='')
            $where = "r.idfuncionalidad = ? and ac.iddominio = ? "
            . "and r.idrecurso = ? and a.denominacion like '$denominacion%'";
        else
            $where = "r.idfuncionalidad = ? "
            . "and ac.iddominio = ? and r.idrecurso = ?";

        $cantFndes = $query->select('count(a.idaccion) as cant')
            ->from('DatAccion a')
            ->innerJoin("a.DatAccionCompartimentacion ac")
            ->innerJoin("a.DatFuncionalidadDatAccion fa")
            ->innerJoin("fa.DatRecurso r")
            ->where($where, array($idfuncionalidad, $iddominio, $idrecurso))
            ->execute();
        return $cantFndes[0]->cant;
    }
    /**
     * @author Darien García Tejo.
     * @method eliminarAcciones - Función usada para eliminar un 
     * conjunto de acciones.
     * @param array $arrayNodesElim - Arreglo de denominaciones de acciones.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return void
     */
    static function eliminarAcciones($arrayNodesElim, $idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatAccion a')
            ->where('a.idfuncionalidad = ?', $idfuncionalidad)
            ->whereIn('a.denominacion', $arrayNodesElim)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method obtenerAccionesUsuario - Función usada para obtener todas 
     * las acciones a las que tiene acceso el usuario activo.
     * @param array $arrayNodesElim - Arreglo de identificadores de acciones.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @return array
     */
    static function obtenerAccionesUsuario($arrayNodesElim, $idfuncionalidad)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('DISTINCT a.denominacion')
            ->from('DatAccion a')
            ->innerJoin('a.DatFuncionalidadDatAccion ra')
            ->innerJoin('a.DatSistemaSegRolDatFuncionalidadDatAccion srfa')
            ->innerJoin('srfa.DatSistemaSegRolDatFuncionalidad srf')
            ->innerJoin('srf.DatSistemaSegRol sr')
            ->innerJoin('sr.SegRol r')
            ->innerJoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerJoin('eur.SegUsuario u')
            ->whereIn('a.denominacion', $arrayNodesElim)
            ->andWhere(
                'a.idfuncionalidad = ? and u.activo = ?', 
                array($idfuncionalidad, true)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
//        print_r($query->getSqlQuery());die;
        return $datos;
    }

    /**
     * @author Darien García Tejo.
     * @method verificarAccion - Función que retorna la cantidad de
     *  record que coinciden con el valor a buscar.
     * @param string $campo - Campo por donde se desea filtrar.
     * @param string $valor - Valor del filtro.
     * @param integer $idfuncionalidad - Identificador de la funcionalidad.
     * @param integer $idaccion - identificador de acción.
     * @return integer - Cantidad de ocurrencias.
     */
    static function verificarAccion($campo, $valor, $idfuncionalidad, $idaccion)
    {
        if ($idaccion) {
            $where = "r.$campo = ? AND r.idfuncionalidad = ? "
                . "AND r.idaccion <> ?";
            $filtro = array($valor, $idfuncionalidad, $idaccion);
        } else {
            $where = "r.$campo = ? AND r.idfuncionalidad = ?";
            $filtro = array($valor, $idfuncionalidad);
        }
        $query = Doctrine_Query::create();
        $datos = $query->select('count(r.idaccion) cant')
            ->from('DatAccion r')
            ->where($where, $filtro)
            ->execute();
        return $datos[0]->cant;
    }

    public static function getAccionesCohencidentes($texto,$idfuncionalidad)
    {
        $sql = "
        --Acciones
        SELECT * FROM mod_seguridad.dat_accion a
        WHERE a.idfuncionalidad = $idfuncionalidad "
            . "AND a.denominacion LIKE '%$texto%';

        ";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }
}