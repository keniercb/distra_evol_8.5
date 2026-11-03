<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class FechaContModel extends ZendExt_Model
{
    public $of;

    /**
     * Constuctor de la clase
     */
    public function __construct()
    {
        $this->of = new OperacionesFechas();
        parent::ZendExt_Model();
    }

    /**
     * Devuelve la fecha siguiente
     *
     * @param object $fecha      Objeto fecha
     * @param int    $incremento Cantidad de dias
     *
     * @return object Retorna un objeto de tipo fecha dado una fecha y la cantidad de dias
     */
    public function proximaFecha($fecha, $incremento)
    {
        return $this->of->nextDate($fecha, $incremento);
    }

    /**
     * Formatea una fecha
     *
     * @param object $fecha1 Objeto fecha
     *
     * @return array Retorna un arreglo con los datos de la fecha
     */
    public function FormatearFecha($fecha)
    {
        return $this->of->FormatFechas($fecha);
    }

    /**
     * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
     *
     * @param object $fecha        Objeto de tipo fecha
     * @param object $fechaproxima Objeto de tipo fecha
     * @param int    $identidad    Identificador de la entidad
     * @param int    $idsubsistema Identificador del subsistema
     *
     * @return object Objeto de tipo fecha
     * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
     */
    public function PasarFechaL($fecha, $fechaproxima, $identidad, $idsubsistema)
    {
        try {
            $fecham = Doctrine_Core::getTable('DatFechaconf')->find($fecha[0]['idfecha']);
            $fecham->fecha = $fechaproxima;
            $fecham->fechasist = date("d/m/Y");
            $fecham->save();
            return $fechaproxima;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF091', $ee);
        }
    }

    /**
     * Dado un objeto fecha pasa la fecha autom\xE1tica.
     *
     * @param object $objfecha Objeto de tipo fecha
     *
     * @return boolean Verdadero en caso de pasar la fecha falso en otro caso
     * @throws @throws ZendExt_Exception $e Excepci&oacute;n de Zend ocurrida durante consulta.
     */
    public function PasarfechaAutL($objfecha)
    {
        try {

            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
            $idperiodo = $this->integrator->datosmaestros->periodoActualSubsistema(
                $idestructura, $objfecha->idsubsistema
            );
            $periodo = $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
            $hoy = date('d/m/Y');

            list($dia1, $mes1, $anno1) = explode("/", $periodo->inicio);
            list($dia2, $mes2, $anno2) = explode("/", $periodo->fin);
            list($dia3, $mes3, $anno3) = explode("/", $hoy);

            $ini = mktime(0, 0, 0, $mes1, $dia1, $anno1);
            $fin = mktime(0, 0, 0, $mes2, $dia2, $anno2);
            $act = mktime(0, 0, 0, $mes3, $dia3, $anno3);

            $fecham = Doctrine_Core::getTable('DatFechaconf')->find($objfecha->idfecha);

            if ($act >= $ini && $act <= $fin) {
                $fecham->fecha = $hoy;
            } else {
                $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($idestructura, $objfecha->idsubsistema);
                if (!$estructurasubsist->cierra) {
                    $idEstructuraSubSistCierre = $estructurasubsist->idestructurasubsist;
                    $arrayDatCierre = $this->integrator->datosmaestros->buscarObjCierre($idEstructuraSubSistCierre);
                    $objDatCierre = Doctrine::getTable('DatCierre')->find($arrayDatCierre->idcierre);
                    $nextperiodo = $this->integrator->datosmaestros->periodoSiguiente(
                        $periodo->idperiodo, $periodo->idejercicio,
                        $periodo->fin
                    );
                    if ($objDatCierre) {
                        $objDatCierre->idperiodoactual = $nextperiodo->idperiodo;
                        $objDatCierre->save();
                    }
                    $fecham->fecha = $hoy;
                } else {
                    $fecham->fecha = $periodo->fin;
                }
            }
            $fecham->fechasist = $hoy;
            $fecham->save();
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }

    /**
     * Actualiza un objeto fecha de un subsistema.
     *
     * @param int    $identidad    Identificador de entidad
     * @param int    $idsubsistema Identificador de subsistema
     * @param object $fecha        Objeto de tipo fecha
     *
     */
    public function actualizarFechaSubsistema($identidad, $idsubsistema, $fecha)
    {
        try{
            $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $arrayDatFechaConf = DatFechaconf::BuscarFecha($estructurasubsist->idestructurasubsist);
            $objDatFechaConf = Doctrine_Core::getTable('DatFechaconf')->find($arrayDatFechaConf[0]['idfecha']);
            $objDatFechaConf->fecha = $fecha;
            $objDatFechaConf->fechasist = date("d/m/Y");
            $objDatFechaConf->save();
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Verifica la Fecha por periodo
     *
     * @param int    $identidad        Identificador de la entidad
     * @param int    $idsusbsistema    Identificador del subsistema
     * @param object $fechanueva       Tipo de incremento
     * @param int    $idsubsistestruct Identificador del subsitema estructura
     *
     * @return boolean Retorna verdadero en caso de que las fechas sean iguales falso en otro caso
     *
     */
    public function VerificarFechaPeriodo($identidad, $idsusbsistema, $fechanueva, $idsubsistestruct)
    {
        if (preg_match("([0-9]{1,2})-([0-9]{1,2})-([0-9]{4})", $fechanueva, $regs)) {
            $fechanueva = $regs[1] . "/" . $regs[2] . "/" . $regs[3];
        }
        $idsubsistestruct .= '';
        $idperiodoactual = $this->integrator->datosmaestros->periodoActualSubsistema($identidad, $idsusbsistema);
        if ($idperiodoactual) {
            $periodoactual = $this->integrator->datosmaestros->obtenerPeriodo($idperiodoactual);
        }
        if (!empty($periodoactual)) {
            list($dia, $mes, $ano) = explode("/", $periodoactual->fin);
            list($diaa, $mess, $anoo) = explode("/", $periodoactual->inicio);
            $fechaf = $dia . "/" . $mes . "/" . $ano;
            $fechai = $diaa . "/" . $mess . "/" . $anoo;

            if ($this->of->compara_fechas($fechaf, $fechanueva) && $this->of->compara_fechas($fechanueva, $fechai)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Dado un objeto fecha pasa la fecha automatica si el incremento es de tipo manual.
     *
     * @param object $objfecha   Objeto de tipo fecha
     * @param int    $incremento Tipo de incremento dado un valor
     *
     * @return boolean Verdadero en caso de pasar la fecha falso en otro caso
     * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
     */
    public function PasarfechaAutomaticaL($idfecha, $incremento = 1)
    {
        try {
            $fecham = Doctrine_Core::getTable('DatFechaconf')->find($idfecha);
            list($dia, $mes, $anno) = explode("/", $fecham->fecha);
            $fechap = $dia . "/" . $mes . "/" . $anno;
            if ($fechap != date("d/m/Y")) {
                $this->conn->beginTransaction();
                if ($fechap != date("d/m/Y")) {
                    $fechadif = $this->of->restaFechas($fechap, date("d-m-Y"));
                } else {
                    $fecpr = $this->of->nextDate($fecham->fechasist, 1);
                    $fechadif = $this->of->restaFechas($fechap, $fecpr);
                }
                $fecham->idfecha = $idfecha;
                if ($incremento != 1) {
                    $fecham->incremento = 2;
                }
                $fechasistema = $this->of->nextDate($fecham->fechasist, $fechadif);

                $fecham->fecha = date("d/m/Y");
                $fecham->fechasist = $fechasistema;
                $version = $fecham->version;
                $fecham->version = $version;
                $fecham->save();
                $this->conn->commit();
            }
        } catch (Doctrine_Exception $ee) {
            $this->conn->rollback();
            throw $ee;
        }
    }

    /**
     * Obtener la proxima fecha de un subsistema donde el tipo de incremento sea autom\xE1tica
     *
     * @param object $argFechaSubsistema Objeto de tipo fecha
     * @param object $argFechaSistema    Objeto de tipo fecha, la fecha del sistema
     *
     * @return object Retorna un objeto de tipo fecha
     *
     */
    public function ObtenerFechaProximAut($argFechaSubSistema, $argFechaSistema)
    {
        //print_r($argFechaSistema.'asda');die;
        if ($argFechaSistema != date("d/m/Y")) {
            $fechadif = $this->of->restaFechas($argFechaSistema, date("d/m/Y"));
            $argFechaSubSistema = $this->of->nextDate($argFechaSubSistema, $fechadif);
            return $argFechaSubSistema;
        }
        return $argFechaSubSistema;
    }

    /**
     * Actualiza un objeto fecha.
     *
     * @param object $fecha Objeto de tipo fecha
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     */
    public function ActualizarFecha($fecha)
    {
        try {
            $fecham = Doctrine_Core::getTable('DatFechaconf')->find($fecha->idfecha);
            $version = $fecham->version;
            $fecham->idfecha = $fecha->idfecha;
            $this->subsistemaactual = $this->integrator->datosmaestros->buscarEstSubSistPorId(
                $fecham->idestructurasubsist
            );
            $fecham->incremento = $fecha->incremento;
            $fecham->version = $version;
            $fecham->save();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Pasa la fecha de un subsistema donde el tipo de incremento sea autom\xE1tica.
     *
     * @param object $fecham     Objeto de tipo fecha
     * @param int    $incremento Valor del incremento
     *
     * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
     */
    public function PasarfechaAutomatica($fecham, $incremento = 1)
    {
        try {
            list($dia, $mes, $anno) = explode("/", $fecham->fecha);
            $fechap = $dia . "/" . $mes . "/" . $anno;
            $res = true;
            if ($fechap != date("d/m/Y")) {
                if ($fechap != date("d/m/Y")) {
                    $fechadif = $this->of->restaFechas($fechap, date("d/m/Y"));
                } else {
                    $fecpr = $this->of->nextDate($fecham->fechasist, 1);
                    $fechadif = $this->of->restaFechas($fechap, $fecpr);
                }
                $fecham->idfecha = $fecham->idfecha;
                if ($incremento != 1) {
                    $fecham->incremento = 2;
                }
                $fechasistema = $this->of->nextDate($fecham->fechasist, $fechadif);
                $res = $this->Validarfecha($fecham, $fechasistema);
                if ($res) {
                    $fecham->fecha = date("d/m/Y");
                    $fecham->fechasist = $fechasistema;
                }
            }
            if ($incremento != 1) {
                $fecham->incremento = 2;
            }
            $version = $fecham->version;
            $fecham->version = $version;

            $fecham->save();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
     *
     * @param int $idsfechas Identificador de fecha
     *
     * @throws @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacción.
     */
    public function PasarFecha($idsfechas)
    {
        try {
            $arrayIdFechas = (strpos($idsfechas, ',')) ? explode(",", $idsfechas) : array(0 => $idsfechas);
            $fechasPrecedentes = DatFechaconf::BuscarPrecedencias($arrayIdFechas);
            foreach ($fechasPrecedentes as $fechaPrecedente) {
                $this->subsistemaactual = $this->integrator->datosmaestros->buscarEstSubSistPorId(
                    $fechaPrecedente['idestructurasubsist']
                );
                self::PasarFechaInd($fechaPrecedente['idfecha']);
            }
        } catch (Exception $ee) {
            throw new ZendExt_Exception('CONF091', $ee);
        }
    }

    /**
     * Pasa la fecha de un subsistema donde el tipo de incremento sea manual.
     *
     * @param int $idfecha Identificador de fecha
     *
     * @throws @throws Exception $ee Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     */
    public function PasarFechaInd($idfecha)
    {
        try {
            $fecham = Doctrine_Core::getTable('DatFechaconf')->find($idfecha);
            if ($fecham->incremento == 2) {
                $fecha = $fecham->fecha;
                $fecha = $this->of->nextDate($fecha, 1);
                $estadp = self::VerificarFechaPeriodo(
                    $this->global->Estructura->idestructura, $this->subsistemaactual, $fecha,
                    $fecham->idestructurasubsist
                );
                if (!$estadp) {
                    throw new ZendExt_Exception('CONF142');
                }
            } else {
                throw new ZendExt_Exception('CONF090', $ee);
            }
            $fecham->idfecha = $idfecha;
            $fecham->fechasist = date("d/m/Y");
            $fecham->fecha = $fecha;
            $fecham->save();
        } catch (Exception $ee) {
            throw new ZendExt_Exception('CONF001', $ee);
        }
    }

    /**
     * Validar la Fecha por periodo
     *
     * @param object $fecham    Objeto de tipo fecha
     * @param object $fechasist Objeto de tipo fehca
     *
     * @return boolean Retorna siempre verdadero
     *
     */
    public function Validarfecha($fecham, $fechasist)
    {
        $estadp = self::VerificarFechaPeriodo(
            $this->global->Estructura->idestructura, $this->subsistemaactual, $fechasist, $fecham->idestructurasubsist
        );
        if (!$estadp) {
            throw new ZendExt_Exception('CONF142');
        }
        if ($this->subsistemaactual == 1) {
            if (!$this->integrator->contabilidad->ExisteCOSinError($fechaant)) {
                $fechaant .= '';
                throw new ZendExt_Exception('CONF093');
            }
        }
        if ($this->subsistemaactual == 4) {
            if (!$this->integrator->capitalhumano->NominasContabilizadas()) {
                throw new ZendExt_Exception('CONF094');
            }
        }
        return true;
    }
}
