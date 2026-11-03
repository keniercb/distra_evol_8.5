<?php

/**
 * Servicio asociados a ejericios y períodos
 *
 * @package    Servicios
 * @subpackage Configuración/EjercicioPeríodo
 * @copyright  XETID
 * @version    1.0
 */
class EjercicioService extends ZendExt_Model
{

    /**
     * @var EjerciciocontableModel
     */
    var $ejercicio;
    /**
     * @var PeriodocontableModel
     */
    var $periodo;

    public function __construct()
    {
        $this->ejercicio = new EjerciciocontableModel();
        $this->periodo = new PeriodocontableModel();
        parent::ZendExt_Model();
    }

    public static function ejercicio()
    {
        return new DatEjerciciocontable();
    }

    /**
     * Obtiene la instancia de un período dado su identificador
     *
     * @param int $idperiodo Identificador de período
     *
     * @return object
     */
    public function Periodo($idperiodo, $idsubsistema, $idestructura)
    {
        try{
            $periodo = DatPeriodocontable::Periodos('', array('idperiodo' => $idperiodo));
            $standard = new ZendExt_ClassStandard();
            $periodo = $standard->Object($periodo);
            //Se verfica si el periodo pedido es el ultimo del ejercicio
            $ultimoperiodo = $this->integrator->datosmaestros->ultimoPeriodo($periodo->idejercicio);
            if ($ultimoperiodo == $idperiodo) {
                $periodo->ultimo = 1;
            } else {
                $periodo->ultimo = 0;
            }
            if ($idsubsistema) {
                $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
                //Se obtiene la estructurasubsist
                $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($idestructura, $idsubsistema);
                //Se verfica si el periodo se cerró en este subsistema
                $cierre = $this->integrator->datosmaestros->obtenerCierrePeriodoSubsistema(
                    $estructurasubsist->idestructurasubsist, $idperiodo
                );
                if ($cierre) {
                    $periodo->cerrado = 1;
                } else {
                    $periodo->cerrado = 0;
                }
            }
            return $periodo;
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene un ejercicio dado su identificador
     *
     * @param int $idejercicio Identificador de ejercicio
     * @param int $identidad   Identificador de estructura común
     *
     * @return array|null
     */
    public static function EjercicioContables($idejercicio, $identidad)
    {
        if (!$identidad) {
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $global->Estructura->idestructura;
        }
        $ejericio = DatEjerciciocontable::Ejercicios(
            '', array('idejercicio' => $idejercicio, 'idestructuracomun' => $identidad)
        );
        $array = null;
        $field = array_keys($ejericio[0]);
        $i = 0;
        foreach ($ejericio as $vlp) {
            $array[] = new stdClass();
            foreach (
                $field as $d
            ) {
                $array[$i]->$d = $vlp[$d];
            }
            $i++;
        }
        return $array;
    }

    /**
     * Obtiene los períodos pertenecientes a un ejercicio dado su ID
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public static function Periodos($idejercicio)
    {
        try{
            if ($idejercicio) {
                $periodos = DatPeriodocontable::Periodos('', array('idejercicio' => $idejercicio));
                $standard = new ZendExt_ClassStandard();
                $periodos = $standard->ArrayObject($periodos);
                $periodos[count($periodos) - 1]->ultimo = 1;
                return $periodos;
            }
            return array();
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene todos los ejericios
     *
     * @return Doctrine_Collection
     */
    public function obtenerEjerciciosConfiguradosCargaInicial(/*$identidad*/)
    {
        return DatEjerciciocontable::getEjerciciosByIdEntidad(/*$identidad*/);
    }

    /**
     * Obtiene el ejercicio siguiente uno dado su ID
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int ID de ejercicio siguiente
     */
    public static function ejercicioSiguiente($idejercicio)
    {
        try{
            return DatEjerciciocontable::ejercicioSiguiente($idejercicio);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene el ejericio anterior a uno dado su ID
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int ID de ejercicio anterior
     */
    public static function ejercicioAnterior($idejercicio)
    {
        return DatEjerciciocontable::ejercicioAnterior($idejercicio);
    }

    /**
     * Obtiene el período siguiente a uno dado su ID
     *
     * @param int $idperiodo Identificador de período
     *
     * @return object
     */
    public function periodoSiguiente($idperiodo)
    {
        try{
            $periodo = $this->Periodo($idperiodo);
            $datPeriodocontable = new DatPeriodocontable();
            $resultado = $datPeriodocontable->periodoSiguiente($idperiodo, $periodo->idejercicio, $periodo->fin);
            $standard = new ZendExt_ClassStandard();
            return $standard->Object($resultado);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene el período anterior a uno dado su ID
     *
     * @param int $idperiodo Identificador de período
     *
     * @return object
     */
    public function periodoAnterior($idperiodo)
    {
        $periodo = $this->Periodo($idperiodo);
        $datPeriodocontable = new DatPeriodocontable();
        $resultado = $datPeriodocontable->periodoAnterior($idperiodo, $periodo->idejercicio, $periodo->inicio);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($resultado);
    }

    /**
     * Obtiene el primer período de un ejercicio dado
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int ID período
     */
    public static function primerPeriodo($idejercicio)
    {
        return DatPeriodocontable::primerPeriodo($idejercicio);
    }

    /**
     * Obtiene el último período de un ejercicio dado
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int ID período
     */
    public static function ultimoPeriodo($idejercicio)
    {
        try{
            return DatPeriodocontable::ultimoPeriodo($idejercicio);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene los ejercicios contables por entidad
     *
     * @param int $identidad Identificador de entidad
     *
     * @return array
     */
    public function EjerciciosContablesPorEntidad($identidad = null)
    {
        if ($identidad === null) {
            $identidad = $this->global->Estructura->idestructura;
        }

        $ejericios = DatEjerciciocontable::Ejercicios("", array('idestructuracomun' => $identidad));
        if (!$ejericios) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($ejericios);
    }

    /**
     * Obtiene los ejercicios anteriores a uno dado su ID
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public function obtenerEjerciciosAnteriores($idejercicio)
    {
        $identidad = $this->global->Estructura->idestructura;
        $ejericio = DatEjerciciocontable::Ejercicios(
            '', array('idejercicio' => $idejercicio, 'idestructuracomun' => $identidad)
        );
        $ejerciciosAnteriores = DatEjerciciocontable::EjerciciosAnteriores(/*$identidad,*/
            $ejericio[0]['inicio']
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($ejerciciosAnteriores);
    }

    /**
     * Obtiene los ejercicios siguientes a uno dado su ID
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public function obtenerEjerciciosSiguientes($idejercicio = null)
    {
        $identidad = $this->global->Estructura->idestructura;
        if (!$idejercicio) {
            $idejercicio = $this->global->Ejercicio->ejercicioactual;
        }
        $ejericio = DatEjerciciocontable::Ejercicios(
            '', array('idejercicio' => $idejercicio, 'idestructuracomun' => $identidad)
        );
        $result = DatEjerciciocontable::EjerciciosSiguientes($ejericio[0]['inicio']);
        return $result;
    }

    /**
     *
     */
    public function EjercicioCI()
    {
        /*$dir_rel_app = */
        Zend_Registry::get('config')->uri_aplication;
        $dircontroller = 'http://' . $_SERVER['HTTP_HOST']
            . '/configuracion/ejercicios/index.php/ejercicios/gestionarejercicioscargainicial';
        header("Location: $dircontroller");
    }

    /**
     * Obtiene el primer período contable dado el ID de ejercicio
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return int ID período
     */
    public function primerPeriodoC($idejercicio)
    {
        $idperiodo = DatPeriodocontable::primerPeriodo($idejercicio);
        return $idperiodo;
    }

    /**
     * Obtiene el primer período contable dado el ID de ejercicio
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public function primerPeriodoObjeto($idejercicio)
    {
        try{
            $apps = Zend_Registry::get('config')->dir_aplication;
//            $dirwww = explode('apps', __FILE__);
            $dirfile = $apps . 'configuracion/comun/util/Convert.php';
            require_once($dirfile);
            $periodo = DatPeriodocontable::primerPeriodoObjeto($idejercicio);
            return Convert::ArrayToObject($periodo);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Obtiene el último período contable dado el ID de ejercicio
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public function ultimoPeriodoObjeto($idejercicio)
    {
        $apps = Zend_Registry::get('config')->dir_aplication;
//        $dirwww = explode('apps', __FILE__);
        $dirfile = $apps . 'configuracion/comun/util/Convert.php';
        require_once($dirfile);
        $periodo = DatPeriodocontable::ultimoPeriodoObjeto($idejercicio);
        return Convert::ArrayToObject($periodo);
    }

    /**
     * Obtiene el primer ejercicio contable
     *
     * @return int ID ejercicio
     */
    public function PrimerEjercicioC(/*$identidad*/)
    {
        $idejercicio = DatEjerciciocontable::primerEjercicio();
        return $idejercicio;
    }

    /**
     * Verifica la existencia de ejercicios y períodos en la base de datos
     *
     * @return bool
     */
    public function hayEjercicioyPeriodo(/*$entidad*/)
    {
        return (
            ($hay = DatEjerciciocontable::HayEjercicio()) && (DatPeriodocontable::HayPeriodo($hay)));
    }

    /**
     * Obtiene los períodos anteriores a uno dado
     *
     * @param int $idperiodo Identificador de período
     *
     * @return array
     */
    public function periodosAnteriores($idperiodo)
    {
        $periodos = DatPeriodocontable::periodosAnteriores($idperiodo);
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($periodos);
    }

    /**
     * Obtiene el período perteneciente a una fecha dada
     *
     * @param date $fecha Fecha
     *
     * @return mixed
     */
    public function periodoPorFecha($fecha)
    {
        $subsist = $this->global->Subsistema->idsubsistema;
        $entidad = $this->global->Estructura->idestructura;
        $ejercicio = $this->ejercicioPorFecha($fecha);
        $result = DatPeriodocontable::periodoPorFecha($ejercicio->idejercicio, $fecha);
        if (count($result) > 1) {
            $periodoactual = $this->integrator->parametros->periodoActualSubsistema($entidad, $subsist);
            return $this->integrator->parametros->obtenerPeriodo($periodoactual);
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($result);
    }

    /**
     * Obtiene el ejercicio perteneciente a una fecha dada
     *
     * @param date $fecha Fecha
     *
     * @return mixed
     */
    public function ejercicioPorFecha($fecha)
    {
        //$entidad = $this->global->Estructura->idestructura;
        $result = DatEjerciciocontable::ejercicioPorFecha(/*$entidad,*/
            $fecha
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($result);
    }

    /**
     * Obtiene el ejercicio dado las fechas inicio y fin
     *
     * @param date $agInicio Fecha inicio
     * @param date $agFin    Fecha fin
     *
     * @return array
     */
    public function obtenerEjercicioDadoAnno(/*$agEntidad, */
        $agInicio, $agFin
    ) {
        return DatEjerciciocontable::obtenerEjercicioDadoAnno(/*$agEntidad,*/
            $agInicio, $agFin
        );
    }

    /**
     * Verifica la existencia de algún ejercicio o período con el nombre que se sugiere
     *
     * @param string $nombreejercicio Nombre ejercicio
     * @param string $nombreperiodo   Nombre período
     * @param int    $idestructura    Identificador de estructura común
     *
     * @return array
     */
    public function existeEjercicioPeriodo($nombreejercicio, $nombreperiodo, $idestructura)
    {
        $resultado = DatEjerciciocontable::existeEjercicioPeriodo($nombreejercicio, $nombreperiodo, $idestructura);
        return $resultado;
    }

    /**
     * Obtiene la cantidad de ejercicios asociados a una estructura
     *
     * @return int
     */
    public function cantidadEjercicioIn()
    {
        $idEstructura = $this->global->Estructura->idestructura;
        return $this->ejercicio->cantidadEjercicioIn($idEstructura);
    }

    /**
     * Obtiene la cantidad de períodos pertenecientes a una estructura
     *
     * @return int
     */
    public function cantidadPeriodoIn()
    {
        $idEstructura = $this->global->Estructura->idestructura;
        return $this->periodo->cantidadPeriodoIn($idEstructura);
    }

}