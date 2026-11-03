<?php

/**
 * Clase dominio <b>Período Contable</b>.
 *
 * @package    Configuración
 * @subpackage EjercicioPeríodo/Models/Domain
 * @copyright XETID
 * @version   2.0-0
 */
class DatPeriodocontable extends BaseDatPeriodocontable
{

    public function setUp()
    {
        $this->hasOne(
            'DatEjerciciocontable', array('local' => 'idejercicio', 'foreign' => 'idejercicio', 'onDelete' => 'CASCADE')
        );
        parent::setUp();
    }

    /**
     * Obtiene los períodos que correspondan con el criterio de búsqueda
     *
     * @param array $cond
     * @param int   $limit Límite superior
     * @param int   $start Comienzo inferior
     *
     * @return array|bool
     */
    public function buscarPeriodo($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = self::aplicarFiltro($cond);
            $q = new Doctrine_Query();
            $estudiant = $q->select("e.idperiodo,e.nombre,e.inicio,e.fin,e.idejercicio,e.version")->from(
                    'DatPeriodocontable e'
                )->where($filter)->limit($limit)->offset($start)->execute();

            $estudiantes = $estudiant->toArray();

            $cantidad = self::Cantidad($filter);
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene las sentencias de la cl\xE1usula where de sql
     *
     * @param array $cond Arreglo con los datos a chequear
     *
     * @return string $filter Sentencia where sql
     */
    private function aplicarFiltro($cond)
    {
        $filter = " 0 = 0 ";
        if ($cond['idperiodo']) {
            $filter .= " and e.idperiodo = '" . $cond['idperiodo'] . "'";
        }
        if ($cond['nombre']) {
            $filter .= " and e.nombre = '" . $cond['nombre'] . "'";
        }
        if ($cond['inicio']) {
            $filter .= " and e.inicio = '" . $cond['inicio'] . "'";
        }
        if ($cond['fin']) {
            $filter .= " and e.fin = '" . $cond['fin'] . "'";
        }
        if ($cond['idejercicio']) {
            $filter .= " and e.idejercicio = '" . $cond['idejercicio'] . "'";
        }
        return $filter;
    }

    /**
     * Buscar Periodos Contables
     *
     * @param int   $idejercicio Identiticador de Ejercicio
     * @param array $cond        Criterios de b&uacute;squeda.
     * @param int   $start       Comienzo inferior
     * @param int   $limit       Límite superior
     *
     * @throws Doctrine_Exception
     * @return array Juego de datos de acuerdo al criterio de b&uacute;squeda.
     * @author Ing. Lisvany Alonso Martinez
     */
    static public function buscarPeriodosContables($idejercicio, $cond, $start, $limit)
    {
        try {
            $filter = $cond;
            $where = " e.idejercicio =  " . $idejercicio;
            $qs = "";
            if (is_array($filter)) {
                $cant = count($filter);
                $rowValue = array();
                $condFilter = array();
                for ($i = 0; $i < $cant; $i++) {
                    $qs = self::aplicateFilter($filter, $i, $qs);
                    $rowValue[] = $filter[$i]['field'];
                    $condFilter[] = $filter[$i]['data']['value'];
                }
                $where .= $qs;
            }
            $query = new Doctrine_Query();
            $result = $query->select("e.idperiodo,e.nombre,e.inicio,e.fin,e.idejercicio,e.version")
                ->from('DatPeriodocontable e')->where($where)->limit($limit)->offset($start)->orderby('e.inicio,e.fin')
                ->execute();
            $periodosdat = $result->toArray();
            if (is_array($filter)) {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $periodosdat = UtilesDatosMaestros::colorSearch($periodosdat, $rowValue, $condFilter);
            }
            $resultado = array('cant' => self::Cantidad($filter), 'datos' => $periodosdat);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene los filtros de búsqueda para la cl\xE1usula where de sql
     *
     * @param array  $filter Arreglo con los datos a chequear
     * @param int    $i      Índice de iteración
     * @param string $qs     sql
     *
     * @return string $qs sql
     */
    private static function aplicateFilter($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['type']) {
            case 'string' :
                $qs .= " AND e." . $filter[$i]['field'] . " ILIKE '%" . $filter[$i]['data']['value'] . "%'";
                Break;
            /*case 'list' :
                if (strstr($filter[$i]['data']['value'], ',')) {
                    $fi = explode(',', $filter[$i]['data']['value']);
                    for ($q = 0; $q < count($fi); $q++) {
                        $fi[$q] = "'" . $fi[$q] . "'";
                    }
                    $filter[$i]['data']['value'] = implode(',', $fi);
                    $qs .= " AND e." . $filter[$i]['field'] . " IN (" . $filter[$i]['data']['value'] . ")";
                } else {
                    $qs .= " AND e." . $filter[$i]['field'] . " = '" . $filter[$i]['data']['value'] . "'";
                }
                Break;*/
            case 'numeric' :
                $qs = self::aplicateFilterNumeric($filter, $i, $qs);
                Break;
            case 'date' :
                $qs = self::aplicateFilterDate($filter, $i, $qs);
                Break;
        }
        return $qs;
    }

    /**
     * Obtiene los filtros de búsqueda fecha para la cl\xE1usula where de sql
     *
     * @param array  $filter Arreglo con los datos a chequear
     * @param int    $i      Índice de iteración
     * @param string $qs     sql
     *
     * @return string $qs sql
     */
    private static function aplicateFilterDate($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['comparison']) {
            case 'eq' :
                $qs .= " AND e.";
                $qs .= $filter[$i]['field'];
                $qs .= " = '" . $filter[$i]['data']['value'] . "'";
                Break;
            case 'lt' :
                $qs .= " AND e.";
                $qs .= $filter[$i]['field'];
                $qs .= " < '" . $filter[$i]['data']['value'] . "'";
                Break;
            case 'gt' :
                $qs .= " AND e.";
                $qs .= $filter[$i]['field'];
                $qs .= " > '" . $filter[$i]['data']['value'] . "'";
                Break;
        }
        return $qs;
    }

    /**
     * Obtiene los filtros de búsqueda numérico para la cl\xE1usula where de sql
     *
     * @param array  $filter Arreglo con los datos a chequear
     * @param int    $i      Índice de iteración
     * @param string $qs     sql
     *
     * @return string $qs sql
     */
    private static function aplicateFilterNumeric($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['comparison']) {
            case 'eq' :
                $qs .= " AND e." . $filter[$i]['field'] . " = " . $filter[$i]['data']['value'];
                Break;
            case 'lt' :
                $qs .= " AND e." . $filter[$i]['field'] . " < " . $filter[$i]['data']['value'];
                Break;
            case 'gt' :
                $qs .= " AND e." . $filter[$i]['field'] . " > " . $filter[$i]['data']['value'];
                Break;
        }
        return $qs;
    }

    /**
     * Obtiene la cantidad de períodos contables coincidentes con el criterio de búsqueda
     *
     * @param string $filter Filtro de búsqueda
     *
     * @return array|bool
     */
    static public function Cantidad($filter)
    {
        try {
            $q = new Doctrine_Query();
            if ($filter) {
                $count = $q->select("COUNT(e.idperiodo) cant")->from("DatPeriodocontable e")->where($filter)
                    ->execute();
            } else {
                $count = $q->select("COUNT(e.idperiodo) cant")->from("DatPeriodocontable e")->execute();
            }

            $cant = $count->toArray();
            return $cant[0]['cant'];
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene la cantidad de períodos contables coincidentes con el criterio de búsqueda
     *
     * @param array $cond Arreglo de valores a chequear
     *
     * @return array|bool
     */
    public function getCantidad($cond = array())
    {
        $filter = $filter = self::aplicarFiltro($cond);
        $cantidad = self::Cantidad($filter);
        return $cantidad;
    }

    /**
     * Obtiene los períodos que coincidan con el criterio de búsqueda
     *
     * @param array $cond Arreglo de valores a chequear
     * @param int   $limit Límite superior
     * @param int   $start Comienzo inferior
     *
     * @return array|bool
     */
    public function getPeriodos($cond = array(), $limit = null, $start = 0)
    {
        try {
            $filter = $filter = self::aplicarFiltro($cond);
            $q = Doctrine_Query::create();
            $cantidad = self::Cantidad($filter);
            if ($limit == null) {
                $limit = $cantidad;
            }
            $periodos = $q->select('e.idperiodo,e.nombre,e.inicio,e.fin,e.idejercicio,e.version')->from(
                    'DatPeriodocontable e'
                )->where($filter)->limit($limit)->offset($start)->orderby('e.inicio,e.fin')->execute();
            $periodosdat = $periodos->toArray();
            $resultado = array('cant' => $cantidad, 'datos' => $periodosdat);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene los períodos bajo las condiciones y restricciones deseadas
     *
     * @param string $select Cl\xE1usula select de sql
     * @param array  $cond Arreglo de valores a chequear
     *
     * @return array|bool
     */
    public function Periodos($select = '', $cond = array())
    {
        try {
            $filter = $filter = self::aplicarFiltro($cond);
            $q = Doctrine_Query::create();
            if (!$select) {
                $estudiant = $q->select(
                        "e.idperiodo,e.nombre,to_char(e.inicio,'dd/mm/yyyy') as inicio,
                         to_char(e.fin,'dd/mm/yyyy') as fin,e.idejercicio, e.fin as fin1"
                    )->from('DatPeriodocontable e')->where($filter)->orderby("e.inicio")->execute();
            } else {
                $estudiant = $q->select($select)->from('DatPeriodocontable e')->where($filter)
                    ->orderby("e.inicio")->execute();
            }
            $estudiantes = $estudiant->toArray();
            return $estudiantes;
        } catch (Doctrine_Exception $ee) {
            return $ee;
        }
    }

    /**
     * Obtiene el período siguiente perteneciente a un ejercicio dado
     *
     * @param int $idperiodo Identificador de período
     * @param int $idejercicio Identificador de ejercicio
     * @param date $fechafin Fecha fin
     *
     * @return Doctrine_Collection
     * @throws Doctrine_Exception|Exception
     */
    public function periodoSiguiente($idperiodo, $idejercicio, $fechafin)
    {
        try {
            $query = Doctrine_Query::create();
            return $query->select("e.idperiodo,e.nombre,e.inicio,e.fin,e.idejercicio")->from(
                'DatPeriodocontable e'
            )
                ->where(
                    "e.inicio >= ? and e.idejercicio=? and e.idperiodo <> ?", array($fechafin, $idejercicio, $idperiodo)
                )->limit(1)->offset(0)->orderby("e.inicio ASC")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene el período anterior perteneciente a un ejercicio dado
     *
     * @param int $idperiodo Identificador de período
     * @param int $idejercicio Identificador de ejercicio
     * @param date $fechafin Fecha inicio
     *
     * @return bool|Doctrine_Collection
     */
    public function periodoAnterior($idperiodo, $idejercicio, $fechaini)
    {
        try {
            $query = Doctrine_Query::create();
            return $query->select("e.idperiodo,e.nombre,e.inicio,e.fin,e.idejercicio")->from(
                'DatPeriodocontable e'
            )
                ->where(
                    "e.fin <= ? and e.idejercicio=? and e.idperiodo <> ?", array($fechaini, $idejercicio, $idperiodo)
                )->limit(1)->offset(0)->orderby("e.fin DESC")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene el primer período perteneciente a un ejercicio dado
     *
     * @param int $ejercicio Identificador de ejercicio
     *
     * @return int $result[0]['idperiodo'] Identificador de período
     */
    public function primerPeriodo($ejercicio)
    {
        try{
            $query = Doctrine_Query::create();
            $result = $query->select("MIN(e.inicio) as InicioMin,e.idperiodo")->from('DatPeriodocontable e')->where(
                "e.idejercicio = '$ejercicio'"
            )->groupBy("e.idperiodo, e.inicio, e.fin")->orderby("e.fin ASC")->execute()->toArray();
            return $result[0]['idperiodo'];
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene el primer período perteneciente a un ejercicio dado
     *
     * @param int $ejercicio Identificador de ejercicio
     *
     * @return array $result[0] Objeto primer período
     */
    public function primerPeriodoObjeto($ejercicio)
    {
        try{
            $q = new Doctrine_Query();
            $res = $q->select("MIN(e.inicio) as InicioMin,e.idperiodo ")->from('DatPeriodocontable e')->where(
                "e.idejercicio= '$ejercicio'"
            )->groupBy("e.idperiodo, e.inicio, e.fin")->orderBy('e.fin ASC')->execute()->toArray();
            return $res[0];
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene el último período perteneciente a un ejercicio dado
     *
     * @param int $ejercicio Identificador de ejercicio
     *
     * @return array $result[0] Objeto último período
     */
    public function ultimoPeriodoObjeto($ejercicio)
    {
        $query = new Doctrine_Query();
        $result = $query->select("MAX(e.fin) as finMax,e.idperiodo ")->from('DatPeriodocontable e')->where(
            "e.idejercicio= '$ejercicio'"
        )->groupBy("e.idperiodo, e.fin, e.inicio")->orderBy('e.inicio DESC')->execute()->toArray();
        return $result[0];
    }

    /**
     * Obtiene el Id del último período perteneciente a un ejercicio dado
     *
     * @param int $ejercicio Identificador de ejercicio
     *
     * @return int $res[0]['idperiodo'] Identificador de período
     */
    public function ultimoPeriodo($ejercicio)
    {
        $q = Doctrine_Query::create();
        $res = $q->select("MAX(e.fin) as finMax,e.idperiodo ")->from('DatPeriodocontable e')->where(
            "e.idejercicio = '$ejercicio'"
        )->groupBy("e.idperiodo, e.fin, e.inicio")->orderby("e.inicio DESC")->execute()->toArray();
        return $res[0]['idperiodo'];
    }

    /**
     * Verifica la existencia de períodos en un ejercicio dado
     *
     * @param int $ejercicio Identificador de ejercicio
     *
     * @return bool
     */
    static public function HayPeriodo($ejercicio)
    {
        $q = Doctrine_Query::create();
        $result = $q->select("e.idperiodo")
            ->from('DatPeriodocontable e')
            ->where("e.idejercicio = ?", $ejercicio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        if (count($result)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene los períodos anteriores a uno dado
     *
     * @param int $idperiodo Identificador de período
     *
     * @return array|Doctrine_Collection
     */
    static public function periodosAnteriores($idperiodo)
    {
        $query = Doctrine_Query::create();
        $periodo = Doctrine::getTable("DatPeriodocontable")->find($idperiodo);
        $result = $query->from("DatPeriodocontable pc")
            ->where(
                "pc.idejercicio = ? AND pc.fin <= ? AND pc.idperiodo <> ?",
                array($periodo->idejercicio, $periodo->inicio, $idperiodo)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        if (count($result)) {
            return $result;
        } else {
            return array();
        }
    }

    /**
     * Obtiene el período perteneciente a una fecha dada
     *
     * @param int $idejercicio Identificador de ejercicio
     * @param date $fecha Fecha
     *
     * @return Doctrine_Collection
     */
    static public function periodoPorFecha($idejercicio, $fecha)
    {
        $query = Doctrine_Query::create();
        $result = $query->from("DatPeriodocontable pc")
            ->where("pc.idejercicio = ? AND pc.fin >= ? AND pc.inicio <= ?", array($idejercicio, $fecha, $fecha))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Conocer si ya existe o no el rango del per&iacute;odo contable determinado.
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto del per&iacute;odo contable.
     *
     * @return bool Verdadero si existe, falso de lo contrario.
     */
    static public function yaExisteRangoPeriodoContable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $inicio = $objDatPeriodocontable->inicio;
            $fin = $objDatPeriodocontable->fin;
            $idejercicio = $objDatPeriodocontable->idejercicio;
            $query = new Doctrine_Query();
            $result = $query->select("count(p.idperiodo)")
                ->where(
                    "p.idejercicio = $idejercicio AND ('$inicio'::date BETWEEN p.inicio AND p.fin
                     OR '$fin'::date BETWEEN p.inicio AND p.fin )"
                )
                ->from('DatPeriodocontable p')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Verifica que las fechas de un período dado no esten contenidas en uno ya definido
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto DatPeriodocontable
     *
     * @return bool
     * @throws Doctrine_Exception|Exception
     */
    static public function yaExistePeriodoContable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $inicio = $objDatPeriodocontable->inicio;
            $fin = $objDatPeriodocontable->fin;
            $idejercicio = $objDatPeriodocontable->idejercicio;
            $idperiodo = $objDatPeriodocontable->idperiodo;
            $query = new Doctrine_Query();
            $result = $query->select("count(p.idperiodo)")
                ->where(
                    "(p.idperiodo <> $idperiodo AND p.idejercicio = $idejercicio)
                     AND ('$inicio'::date BETWEEN p.inicio AND p.fin  OR '$fin'::date BETWEEN p.inicio AND p.fin )"
                )
                ->from('DatPeriodocontable p')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Verifica que el nombre de un período dado no coincida con los pertenecientes al ejercicio
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto DatPeriodocontable
     *
     * @return bool
     * @throws Doctrine_Exception|Exception
     */
    static public function verificar(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $nombre = $objDatPeriodocontable->nombre;
            $idperiodo = $objDatPeriodocontable->idperiodo;
            $idejercicio = $objDatPeriodocontable->idejercicio;
            $query = new Doctrine_Query();
            $result = $query->select("count(p.idperiodo)")
                ->where("p.nombre ILIKE '$nombre' AND p.idperiodo <>'$idperiodo' AND p.idejercicio='$idejercicio'")
                ->from('DatPeriodocontable p')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Verifica el campo nombre de período pertenecientes a un ejercicio
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto DatPeriodocontable
     *
     * @return bool
     * @throws Doctrine_Exception|Exception
     */
    static public function ExistNomPeriodo(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $nombre = $objDatPeriodocontable->nombre;
            $idejercicio = $objDatPeriodocontable->idejercicio;
            $query = new Doctrine_Query();
            $result = $query->select("count(p.idperiodo)")
                ->where("p.nombre ILIKE '$nombre' AND p.idejercicio='$idejercicio'")
                ->from('DatPeriodocontable p')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene la fecha inicio y fin de todos los Periodos
     *
     * @param int $idperiodo   Identificador de ejercicio
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array Ejercicio, fecha inicio y fin
     * @author Ing. Lisvany Alonso Martinez
     */
    static function getFechaPeriodos($idperiodo = null, $idejercicio = null)
    {
        try {
            $query = Doctrine_Query::create();
            if ($idperiodo == null) {
                return $query->select("e.idperiodo,e.nombre,e.inicio,e.fin")->from('DatPeriodocontable e')
                    ->where("e.idejercicio = ?", array($idejercicio))
                    ->orderby("e.inicio ASC")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            }
            return $query->select("e.idperiodo,e.nombre,e.inicio,e.fin")->from('DatPeriodocontable e')
                ->where("e.idperiodo <> ? AND e.idejercicio = ?", array($idperiodo, $idejercicio))
                ->orderby("e.inicio ASC")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            return false;
        }


    }


}
