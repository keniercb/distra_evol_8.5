<?php

/**
 * Clase dominio <b>Ejercicio Contable</b>.
 *
 * @package    Configuración
 * @subpackage EjercicioPeríodo/Models/Domain
 * @author    Ing. Miguel Diaz Riveaux
 * @copyright XETID
 * @version   2.0-0
 * @internal  Aun debe super-mejorarse. Revisar aquellos sin comentarios
 */
class DatEjerciciocontable extends BaseDatEjerciciocontable
{

    public function setUp()
    {
        $this->hasMany('DatPeriodocontable', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        parent::setUp();
    }

    /**
     * Obtiene los ejercicios que coincidan con el criterio de búsqueda
     *
     * @param array $cond Filtro de búsqueda
     * @param int   $limit Límite superior
     * @param int   $start Comienzo inferior
     *
     * @return array|bool
     */
    public function buscarEjercicio($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = self::aplicarFiltro($cond);
            $q = new Doctrine_Query();
            $estudiant = ($filter)
                ? $q->select(
                    "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural as anonatural ,e.version,e.idestructuracomun"
                )->from('DatEjerciciocontable e')->where($filter)->limit($limit)->offset($start)->execute()
                : $q->select(
                    "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural,e.version,e.idestructuracomun"
                )->from('DatEjerciciocontable e')->limit($limit)->offset($start)->execute();
            $estudiantes = $estudiant->toArray();
            $cantidad = self::Cantidad($filter);
            $resultado = array('cant' => $cantidad, 'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Transforma el arreglo de condiciones en sentencias sql
     *
     * @param $cond
     *
     * @return string
     */
    private function aplicarFiltro($cond)
    {
        $filter = " 0 = 0 ";
        if ($cond['idejercicio']) {
            $filter .= " and e.idejercicio = '" . $cond['idejercicio'] . "'";
        }
        if ($cond['nombre']) {
            $filter .= " and lower(e.nombre) like '%" . strtolower($cond['nombre']) . "%'";
        }
        if ($cond['inicio']) {
            $filter .= " and e.inicio = '" . $cond['inicio'] . "'";
        }
        if ($cond['fin']) {
            $filter .= " and e.fin = '" . $cond['fin'] . "'";
        }
        if ($cond['annonatural']) {
            $filter .= " and e.annonatural = '" . $cond['annonatural'] . "'";
        }
        if ($cond['antecesor']) {
            $filter .= " and e.antecesor = '" . $cond['antecesor'] . "'";
        }
        return $filter;
    }

    /**
     * Obtiene la cantidad de ejercicios que contiene la base de datos
     *
     * @param string $filter Filtro de búsqueda
     *
     * @return int
     */
    static public function Cantidad($filter)
    {
        $q = new Doctrine_Query();
        if ($filter) {
            $count = $q->select("COUNT(e.idejercicio) cant")->from("DatEjerciciocontable e")->where($filter)
                ->execute();
        } else {
            $count = $q->select("COUNT(e.idejercicio) cant")->from("DatEjerciciocontable e")->execute();
        }

        $cant = $count->toArray();
        return $cant[0]['cant'];
    }

    /**
     * function para el enlace con contabilidad
     *
     * @param string $select
     * @param array  $cond
     *
     * @return array
     * @throws ZendExt_Exception
     */
    public function Ejercicios($select = '', $cond = array())
    {
        try {
            $filter = self::aplicarFiltro($cond);
            $q = Doctrine_Query::create();

            if (!$select) {
                $estudiant = ($cond['limit'] && $cond['start'])
                    ? $q->select(
                        "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural as anonatural,
                         e.version,e.idestructuracomun"
                    )->from('DatEjerciciocontable e')->where($filter)->orderby("e.inicio")->limit($cond['limit'])
                        ->offset($cond['start'])->execute()
                    : $q->select(
                        "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural as anonatural,
                         e.version,e.idestructuracomun"
                    )->from('DatEjerciciocontable e')->where($filter)->orderby("e.inicio")->execute();

            } else {
                $estudiant = ($cond['limit'] && $cond['start'])
                    ? $q->select($select)->from(
                        'DatEjerciciocontable e'
                    )->where($filter)->limit($cond['limit'])->offset($cond['start'])->execute()
                    : $q->select($select)->from('DatEjerciciocontable e')->where($filter)->orderby(
                        "e.inicio"
                    )
                        ->execute();

            }

            $estudiantes = $estudiant->toArray();
            return $estudiantes;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('EGU004', $ee);
        }
    }

    /**
     * function para el enlace con contabilidad
     *
     * @param array $cond
     *
     * @return boolean
     */
    public function EjerciciosC($cond = array())
    {
        try {
            $filter = self::aplicarFiltro($cond);
            $query = Doctrine_Query::create();
                $data = ($cond['limit'] && isset($cond['start']))
                    ? $query->select(
                        "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural as anonatural,
                         e.version,e.idestructuracomun,e.antecesor"
                    )->from('DatEjerciciocontable e')->where($filter)->orderby("e.nombre")->limit($cond['limit'])
                        ->offset(
                        $cond['start']
                    )->execute()
                    : $query->select(
                        "e.idejercicio,e.nombre,e.inicio,e.fin,e.annonatural as anonatural,
                         e.version,e.idestructuracomun,e.antecesor"
                    )->from('DatEjerciciocontable e')->where($filter)->orderby("e.nombre")->execute();
            return $data->toArray();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Busca Ejercicios Contables
     *
     * @param array $cond Criterios de b&uacute;squeda.
     * @param int $start Comienzo inferior
     * @param int $limit Límite superior
     *
     * @throws Doctrine_Exception
     * @return Array Juego de datos de acuerdo al criterio de b&uacute;squeda.
     */
    static public function buscarEjerciciosContables($cond, $start, $limit)
    {
        try {
            $filter = $cond;
            $where = " 0 = 0 ";
            $qs = "";
            if (is_array($filter)) {
                $rowValue = array();
                $condFilter = array();
                for ($i = 0; $i < count($filter); $i++) {
                    $qs = self::aplicateFilter($filter, $i, $qs);
                    if ($filter[$i]['field'] == 'dfDesde') {
                        $rowValue[] = 'inicio';
                    } elseif ($filter[$i]['field'] == 'dfHasta') {
                        $rowValue[] = 'fin';
                    } else {
                        $rowValue[] = $filter[$i]['field'];
                    }
                    $condFilter[] = $filter[$i]['data']['value'];
                }
                $where .= $qs;
            }
            //print_r($where);
            /*$inicio = $cond['inicio'];
            $fin = $cond['fin'];
            if ($cond['idejercicio']) {
                $filter.="e.idejercicio = '" . $cond['idejercicio'] . "'";
            }if ($cond['nombre'] && $filter != '') {
                $filter.=" and e.nombre ilike '%" . $cond['nombre'] . "%'";
            } elseif ($cond['nombre'] && $buscarxnombre == false) {
                $filter.="e.nombre ilike '%" . $cond['nombre'] . "%'";
            }if ($cond['inicio'] && $filter != '') {
                $filter.=" AND ('$inicio'::date BETWEEN e.inicio AND e.fin)";
            } elseif ($cond['inicio']) {
                $filter.="('$inicio'::date BETWEEN e.inicio AND e.fin)";
            }if ($cond['fin'] && $filter != '') {
                $filter.=" AND ('$fin'::date BETWEEN e.inicio AND e.fin)";
            } elseif ($cond['fin']) {
                $filter.="('$fin'::date BETWEEN e.inicio AND e.fin)";
            }*/
            $query = new Doctrine_Query();
            $result = $query->select(
                "e.idejercicio, e.nombre, e.inicio, e.fin, e.annonatural as anonatural,
                 e.version, e.idestructuracomun, e.antecesor"
            )
                ->from('DatEjerciciocontable e')->where($where)->limit($limit)->offset($start)->orderby("e.nombre")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
            if (is_array($filter)) {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $result = UtilesDatosMaestros::colorSearch($result, $rowValue, $condFilter);
            }
            return array('cant' => self::Cantidad($where), 'datos' => $result);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Transforma los criterios de búsqueda en sentencias sql
     *
     * @param array $filter
     * @param int $i Índice del arreglo $filter
     * @param string $qs filtro sql
     *
     * @return string $qs
     */
    private static function aplicateFilter($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['type']) {
            case 'string' :
                $qs .= " AND " . $filter[$i]['field'] . " ILIKE '%" . $filter[$i]['data']['value'] . "%'";
                Break;
            /*case 'list' :
                if (strstr($filter[$i]['data']['value'], ',')) {
                    $fi = explode(',', $filter[$i]['data']['value']);
                    for ($q = 0; $q < count($fi); $q++) {
                        $fi[$q] = "'" . $fi[$q] . "'";
                    }
                    $filter[$i]['data']['value'] = implode(',', $fi);
                    $qs .= " AND " . $filter[$i]['field'] . " IN (" . $filter[$i]['data']['value'] . ")";
                } else {
                    $qs .= " AND " . $filter[$i]['field'] . " = '" . $filter[$i]['data']['value'] . "'";
                }
                Break;*/
            case 'boolean' :
                $qs .= " AND annonatural ";
                $qs .= " = ";
                $qs .= ($filter[$i]['data']['value'] == 'true') ? '1' : '0';
                Break;
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
     * Transforma los criterios de búsqueda fecha en sentencias sql
     *
     * @param array $filter
     * @param int $i Índice del arreglo $filter
     * @param string $qs filtro sql
     *
     * @return string
     */
    private static function aplicateFilterDate($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['comparison']) {
            case 'eq' :
                $qs .= " AND ";
                $qs .= ($filter[$i]['field'] == 'dfDesde') ? 'inicio' : 'fin';
                $qs .= " = '" . $filter[$i]['data']['value'] . "'";
                Break;
            case 'lt' :
                $qs .= " AND ";
                $qs .= ($filter[$i]['field'] == 'dfDesde') ? 'inicio' : 'fin';
                $qs .= " < '" . $filter[$i]['data']['value'] . "'";
                Break;
            case 'gt' :
                $qs .= " AND ";
                $qs .= ($filter[$i]['field'] == 'dfDesde') ? 'inicio' : 'fin';
                $qs .= " > '" . $filter[$i]['data']['value'] . "'";
                Break;
        }
        return $qs;
    }

    /**
     * Transforma los criterios de búsqueda numérico en sentencias sql
     *
     * @param array $filter
     * @param int $i Índice del arreglo $filter
     * @param string $qs filtro sql
     *
     * @return string
     */
    private static function aplicateFilterNumeric($filter, $i, $qs)
    {
        switch ($filter[$i]['data']['comparison']) {
            case 'eq' :
                $qs .= " AND " . $filter[$i]['field'] . " = " . $filter[$i]['data']['value'];
                Break;
            case 'lt' :
                $qs .= " AND " . $filter[$i]['field'] . " < " . $filter[$i]['data']['value'];
                Break;
            case 'gt' :
                $qs .= " AND " . $filter[$i]['field'] . " > " . $filter[$i]['data']['value'];
                Break;
        }
        return $qs;
    }

    /**
     * Buscar Ejercicios Contables por nombre
     *
     * @param string $cond Nombre a buscar.
     *
     * @throws Doctrine_Exception
     * @return ArrayList Juego de datos de acuerdo al criterio de b&uacute;squeda.
     * @athor Ing. Lisvany Alonso Martinez
     */
    static public function buscarEjerciciosContablesPorNombre($cond, $start, $limit)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select(
                "e.idejercicio, e.nombre, e.inicio, e.fin, e.annonatural as anonatural,
                 e.version, e.idestructuracomun, e.antecesor"
            )
                ->from('DatEjerciciocontable e')->where("lower(e.nombre) like '%" . strtolower($cond) . "%'")->limit(
                    $limit
                )->offset($start)->orderby("e.nombre")->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
            $result = UtilesDatosMaestros::colorSearch($result, 'nombre', $cond);
            return array('cant' => self::Cantidad("lower(e.nombre) like '%" . strtolower($cond) . "%'"),
                         'datos' => $result);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtener todos los Ejercicios Contables para una entidad comun determinada.
     *
     * @param int $identidad Identificador de la entidad comun.
     *
     * @return ArrayList Todos los ejercicios contables.
     */
    static public function obtenerEjerciciosContables(/*$identidad,*/ $start, $limit)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            "e.idejercicio, e.nombre, e.inicio, e.fin, e.annonatural as anonatural,
             e.version, e.idestructuracomun, e.antecesor"
        )->from('DatEjerciciocontable e')
            ->limit($limit)->offset($start)->orderby("e.inicio, e.fin ASC")->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return array('cant' => self::Cantidad(null), 'datos' => $result);
    }

    /**
     * Obtiene el primer ejercicio
     *
     * @return int
     */
    public function primerEjercicio()
    {
        $query = Doctrine_Query::create();
        $result = $query->select("e.idejercicio")->from('DatEjerciciocontable e')->limit(1)->offset(0)->orderby(
            "e.inicio, e.fin"
        )->execute();
        return $result[0]['idejercicio'];
    }

    /**
     * Obtiene el último ejercicio
     *
     * @param int $identidad Identificador de ejercicio
     *
     * @return array
     */
    static public function UltimoEjercicio($identidad)
    {
        $cantidad = DatEjerciciocontable::Cantidad('e.idestructuracomun=' . $identidad);
        if ($cantidad == 0) {
            $cantidad = 1;
        }
        $query = Doctrine_Query::create();
        $result = $query->select("e.idejercicio, e.nombre, e.annonatural, e.inicio, e.fin")->from(
            'DatEjerciciocontable e'
        )->where("e.idestructuracomun = ?", $identidad)->limit(1)->offset($cantidad - 1)->orderby("e.inicio, e.fin")
            ->execute()->toArray();
        return $result[0];
    }

    /**
     * Obtener el ultimo ejercicio contable sea o no natural para una entidad comun determinada.
     *
     * @param int $identidad Identificador de la entidad comun.
     *
     * @return Record El ultimo ejercicio contable para la entidad comun dada.
     */
    static public function ultimoEjercicioContable()
    {
        $query = Doctrine_Query::create();
        $result = $query->select("e.idejercicio, e.nombre, e.annonatural, e.inicio, e.fin")->from(
            'DatEjerciciocontable e'
        )->limit(1)->offset(0)->orderby("e.fin DESC")->setHydrationMode(Doctrine::HYDRATE_RECORD)->execute();
        if ($result->count() === 0) {
            return array();
        } else {
            return $result[0];
        }
    }

    /**
     * Verifica la existencia de ejercicios
     *
     * @return int|bool
     */
    static public function HayEjercicio()
    {
        $q = Doctrine_Query::create();
        $result = $q->select("e.idejercicio")->from('DatEjerciciocontable e')->setHydrationMode(
            Doctrine :: HYDRATE_ARRAY
        )->execute();
        if (count($result)) {
            return $result[0]['idejercicio'];
        } else {
            return false;
        }
    }

    /**
     * Verifica la existencia de un ejercicio siguiente
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int
     */
    static function ejercicioSiguiente($idejercicio)
    {
        try{
            $query = Doctrine_Query::create();
            $result = $query->select("e.idejercicio")->from('DatEjerciciocontable e')->where(
                "e.antecesor = ?", $idejercicio
            )->limit(1)->offset(0)->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
            return $result[0]['idejercicio'];
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Verifica la existencia de un ejercicio anterior
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int
     */
    static function ejercicioAnterior($idejercicio)
    {
        $query = Doctrine_Query::create();
        $result = $query->select("e.antecesor")->from('DatEjerciciocontable e')->where(
            "e.idejercicio = ?", $idejercicio
        )->limit(1)->offset(0)->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
        return $result[0]['antecesor'];
    }

    /**
     * Obtiene los ejercicios anteriores a una fehca
     *
     * @param date $fecha Fecha
     *
     * @return Doctrine_Collection
     */
    static function EjerciciosAnteriores(/*$identidad, */$fecha)
    {
        $query = Doctrine_Query::create();
        return $query->from('DatEjerciciocontable e')->where("e.inicio <= ? ", $fecha)->setHydrationMode(
            Doctrine :: HYDRATE_ARRAY
        )->execute();
    }

    /**
     * Obtiene los ejercicios siguientes a una fehca
     *
     * @param int $idejercicio identificador del ejercicio
     * @param date $fecha Fecha
     *
     * @return Doctrine_Collection
     */
    static function EjerciciosSiguientes($fecha)
    {
        if($fecha){
            $query = Doctrine_Query::create();
            return $query->from('DatEjerciciocontable e')->where("e.inicio > ? ", $fecha)->setHydrationMode(
                Doctrine :: HYDRATE_ARRAY
            )->execute();
        }
        return array();
    }

    /**
     * Obtiene los ejercicios por fecha
     *
     * @param date $fecha
     *
     * @return Doctrine_Collection
     */
    static function ejercicioPorFecha(/*$entidad, */$fecha)
    {
        $query = Doctrine_Query::create();
        return $query->from('DatEjerciciocontable e')->where(
            "e.fin >= ? AND e.inicio <= ?", array($fecha, $fecha)
        )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
    }

    /**
     * Obtiene los ejercicios dado el año
     *
     * @param date $agInicio
     * @param date $agFin
     *
     * @return array
     */
    static function obtenerEjercicioDadoAnno(/*$agEntidad,*/ $agInicio, $agFin)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatEjerciciocontable e')->where(
            "e.fin <= ? AND e.inicio >= ?", array($agFin, $agInicio)
        )->execute();
        if ($result->count() > 0) {
            return $result->toArray();
        } else {
            return array();
        }
    }

    /**
     * Obtiene la cantidad de ejercicio
     *
     * @param array $cond
     *
     * @return int
     * @throws Doctrine_Exception|Exception
     */
    public function CantidadEjercicios($cond = array())
    {
        try {
            $filter = self::aplicarFiltro($cond);
            $query = new Doctrine_Query();
            $count = $query->select("COUNT(e.idejercicio) cant")->from("DatEjerciciocontable e")->where($filter)
                    ->execute();
            $cantidad = $count->toArray();
            return $cantidad[0]['cant'];
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Verifica la existencia de algún ejercicio o período con el nombre que se sugiere
     *
     * @param string $nombreejercicio Nombre ejercicio
     * @param string $nombreperiodo Nombre período
     *
     * @return array
     */
    public function existeEjercicioPeriodo($nombreejercicio, $nombreperiodo)
    {
        $query = Doctrine_Query::create();
        $resultEjercicio = $query->from('DatEjerciciocontable e')->where("e.nombre = ?", $nombreejercicio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        if ($resultEjercicio) {
            $idejercicio = $resultEjercicio[0]['idejercicio'];
            $resultPeriodo = $query->from('DatPeriodocontable p')->where(
                "p.idejercicio = ? AND p.nombre = ?", array($idejercicio, $nombreperiodo)
            )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            if ($resultPeriodo) {
                $data = array('ejercicio' => $resultEjercicio, 'periodo' => $resultPeriodo);
                return $data;
            } else {
                return array();
            }
        } else {
            return array();
        }
    }

    /**
     * Conocer si ya existe o no el ejercicio contable determinado.
     *
     * @param DatEjerciciocontable $objEjercicioContable Objeto del ejercicio contable.
     *
     * @return Boolean Verdadero si existe, falso de lo contrario.
     */
    static public function YaExisteEjercicio(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $inicio = $objEjercicioContable->inicio;
            $fin = $objEjercicioContable->fin;
            $idejercicio = $objEjercicioContable->idejercicio;
            $nombre = $objEjercicioContable->nombre;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')
                ->where(
                    "(e.nombre ilike '" . $nombre . "' AND e.idejercicio!='$idejercicio')
                     AND (('$inicio'::date BETWEEN e.inicio AND e.fin ) AND ('$fin'::date BETWEEN e.inicio AND e.fin ))"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Este aparecia en el branch y no en el trunk
     *
     * @param DatEjerciciocontable $objEjercicioContable
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    static public function YaExisteEjercicioModif(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $inicio = $objEjercicioContable->inicio;
            $fin = $objEjercicioContable->fin;
            $nombre = $objEjercicioContable->nombre;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')
                ->where(
                    "e.nombre= ? AND ('$inicio'::date BETWEEN e.inicio AND e.fin )
                     AND ('$fin'::date BETWEEN e.inicio AND e.fin )",
                    $nombre
                )//
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Conocer si el per&iacute;odo contable determinado est&aacute; dentro del rango de fecha del Ejercicio Contable
     * al cual pertenece.
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto del per&iacute;odo contable.
     *
     * @return bool Verdadero si esta dentro del rango, falso de lo contrario.
     */
    static public function esValidoPeriodoContable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $inicio = $objDatPeriodocontable->inicio;
            $fin = $objDatPeriodocontable->fin;
            $idejercicio = $objDatPeriodocontable->idejercicio;
            $query = new Doctrine_Query();
            $result = $query->select("count(e.idejercicio)")
                ->where("e.idejercicio = $idejercicio AND '$inicio'::date >= e.inicio AND '$fin'::date <= e.fin")
                ->from('DatEjerciciocontable e')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene los IDs de los ejercicios contables
     *
     * @return Doctrine_Collection
     * @throws Doctrine_Exception|Exception
     */
    static public function getEjerciciosByIdEntidad(/*$idestructuracomun*/)
    {
        try {
            $query = new Doctrine_Query();
            return $query->select("e.idejercicio")->from('DatEjerciciocontable e')->setHydrationMode(
                Doctrine_Core::HYDRATE_ARRAY
            )->execute();
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * validaciones insertar
     *
     * @param DatEjerciciocontable $objEjercicioContable
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    static public function YaExisteNomEjercicioInsrt(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $nombre = $objEjercicioContable->nombre;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')->where(
                "(e.nombre ilike '" . $nombre . "')"
            )->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * validaciones insertar
     *
     * @param DatEjerciciocontable $objEjercicioContable
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    static public function YaExisteEjercicioFechasInsert(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $inicio = $objEjercicioContable->inicio;
            $fin = $objEjercicioContable->fin;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')
                ->where(
                    "(('$inicio'::date BETWEEN e.inicio AND e.fin ) AND ('$fin'::date BETWEEN e.inicio AND e.fin ))"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * validaciones modificar
     *
     * @param DatEjerciciocontable $objEjercicioContable
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    static public function YaExisteNomEjercicio(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $nombre = $objEjercicioContable->nombre;
            $idejercicio = $objEjercicioContable->idejercicio;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')
                ->where("e.idejercicio != $idejercicio AND (e.nombre ilike '" . $nombre . "')")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * validaciones modificar
     *
     * @param DatEjerciciocontable $objEjercicioContable
     *
     * @return bool
     * @throws Doctrine_Exception
     */
    static public function YaExisteEjercicioFechas(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $inicio = $objEjercicioContable->inicio;
            $fin = $objEjercicioContable->fin;
            $idejercicio = $objEjercicioContable->idejercicio;
            $query = Doctrine_Query::create();
            $result = $query->from('DatEjerciciocontable e')->select('count(e.idejercicio)')
                ->where(
                    "e.idejercicio != $idejercicio AND(('$inicio'::date BETWEEN e.inicio AND e.fin )
                     AND ('$fin'::date BETWEEN e.inicio AND e.fin ))"
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            return ($result[0]['count'] > 0) ? true : false;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Utilizado para la validacion de la fecha fin de un ejercicio dado
     *
     * @param int  $idejercicio Identificador de Ejercicio
     * @param date $fechafin Fecha fin del Ejercicio
     *
     * @return array Ejercicio ordenado por fecha inicio, mayores de la fecha fin del Ejercicio dado
     * @author Ing. Lisvany Alonso Martinez
     */
    static function FechaEjercicioSiguiente($idejercicio, $fechafin)
    {
        try {
            $query = Doctrine_Query::create();
            return $query->select("e.idejercicio,e.nombre,e.inicio,e.fin")->from('DatEjerciciocontable e')
                ->where("e.inicio >= ? and e.idejercicio <> ?", array($fechafin, $idejercicio))->limit(1)->offset(0)
                ->orderby("e.inicio ASC")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Utilizado para la validacion de la fecha inicio de un ejercicio dado
     *
     * @param int  $idejercicio Identificador de Ejercicio
     * @param date $fechaini Fecha inicio del Ejercicio
     *
     * @return array Ejercicio ordenado por fecha fin, menores o iguales de la fecha fin del Ejercicio dado
     * @author Ing. Lisvany Alonso Martinez
     */
    static function FechaEjercicioAnterior($idejercicio, $fechaini)
    {
        try {
            $query = Doctrine_Query::create();
            return $query->select("e.idejercicio,e.nombre,e.inicio,e.fin")->from('DatEjerciciocontable e')
                ->where("e.fin <= ? and e.idejercicio <> ?", array($fechaini, $idejercicio))->limit(1)->offset(0)
                ->orderby("e.fin DESC")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene la fecha inicio y fin de todos los Ejercicios
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array Ejercicio, fecha inicio y fin
     * @author Ing. Lisvany Alonso Martinez
     */
    static function getFechaEjercicios($idejercicio = null)
    {
        try {
            $query = Doctrine_Query::create();
            if ($idejercicio == null) {
                return $query->select("e.idejercicio,e.nombre,e.inicio,e.fin")->from('DatEjerciciocontable e')
                    ->orderby("e.inicio ASC")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            }
            return $query->select("e.idejercicio,e.nombre,e.inicio,e.fin")->from('DatEjerciciocontable e')
                ->where("e.idejercicio <> ?", array($idejercicio))
                ->orderby("e.inicio ASC")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }


}
