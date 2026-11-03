<?php

/**
 * Componente para gestionar las fechas de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Fecha/Service
 * @copyright  XETID
 * @version    1.0
 */
class FechaService extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function __construct()
    {
        $this->operacfechas = new OperacionesFechas();
        parent::ZendExt_Model();
    }

    /**
     * Fecha contable subsistema
     *
     * @param int $identidad    Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object Devuelve un objeto de tipo fecha
     */
    public function fechaContableSubsistema($identidad, $idsubsistema)
    {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $result = $this->BuscarfechaSubObj($estructurasubsist->idestructurasubsist,$idsubsistema);
        if ($result->incremento == 1) {
            $fechamod = new FechaContModel();
            $resb = $fechamod->PasarfechaAutL($result);
            $result = $this->BuscarfechaSubObj($estructurasubsist->idestructurasubsist,$idsubsistema);
        }
        $r = $result->fecha;
        $m = explode('-', $r);
        if (count($m) == 3) {
            if (strlen($m[0]) == 4) {
                $m = array_reverse($m);
            }
            $r = implode('/', $m);
        }
        return $r;
    }

    /**
     * Fecha contable subsistema obj
     *
     * @param int $identidad    Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object Devuelve un objeto de tipo fecha
     */
    public function fechaContableSubsistemaObj($identidad, $idsubsistema)
    {
        try{
            $integrator = ZendExt_IoC::getInstance();
            $objEstructuraSubSistema = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $objfecha = $this->BuscarfechaSubObj($objEstructuraSubSistema->idestructurasubsist, $idsubsistema);
            if ($objfecha->incremento == 1) {
                $fechamod = new FechaContModel();
                $resb = $fechamod->PasarfechaAutL($objfecha);
                $objfecha = $this->BuscarfechaSubObj($objEstructuraSubSistema->idestructurasubsist, $idsubsistema);
            }
            return $objfecha;
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Buscar fecha subsistema obj
     *
     * @param int $idestructurasubsist Identificador de estructura subsistema
     * @param int $idsubsistema        Identificador de subsistema
     *
     * @return object Devuelve un objeto de tipo fecha
     */
    private function BuscarfechaSubObj($idestructurasubsist, $idsubsistema)
    {
        try{
            $result = DatFechaconf::BuscarFecha($idestructurasubsist);
            $standard = new ZendExt_ClassStandard();
            $objfecha = $standard->Object($result);
            $objfecha->idsubsistema = $idsubsistema;
            return $objfecha;
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Actualizar fecha subsistema
     *
     * @param int    $identidad    Identificador de entidad
     * @param int    $idsubsistema Identificador de subsistema
     * @param object $fecha        Objeto de tipo fecha
     *
     */
    public function actualizarFechaSubsistema($identidad, $idsubsistema, $fecha)
    {
        try{
            $objFecha = new FechaContModel();
            $objFecha->actualizarFechaSubsistema($identidad, $idsubsistema, $fecha);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Actualizar fecha contable subsistema
     *
     * @param int $identidad    Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object Objeto de tipo fecha
     * @throws ZendExt_Exception $e
     *
     */
    public function actFechContabSubsist($identidad, $idsubsistema)
    {
        try {
            $integrator = ZendExt_IoC::getInstance();
            $estructurasubsist = $integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $fecha = DatFechaconf::BuscarFechaIdsubsistest($estructurasubsist->idestructurasubsist);
            $todaysDate = date("d/m/Y");
            if ($fecha[0]['incremento'] == 2) {
                if ($todaysDate == $fecha[0]['fecha']) {
                    return -1; //Se esta tratando de pasar la fecha a un dia aun sin llegar realmente
                }
                $fechamodel = new FechaContModel();
                $fechaproxima = $fechamodel->proximaFecha($fecha[0]['fecha'], 1);
                $fecharesult = $fechamodel->PasarFechaL($fecha, $fechaproxima, $identidad, $idsubsistema);
                $fecha = $fechamodel->FormatearFecha($fecharesult);
                return $fecha[0] . "/" . $fecha[1] . "/" . $fecha[2];
            } else {
                throw new ZendExt_Exception('CONF100');
            }
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }

    /**
     * Fecha Carnet de Identidad
     *
     */
    public function FechaCI()
    {
        //$dirrelapp = Zend_Registry::get('config')->uri_aplication;
        $dircontroller = 'http://' . $_SERVER['HTTP_HOST'] . '/configuracion/fecha
            /index.php/gestionarfecha/gestionarfechacargainicial';
        header("Location: $dircontroller");
    }

    /**
     * Escribir fecha
     *
     */
    public function EscribirFecha($idestructura)
    {
        $integrator = ZendExt_IoC::getInstance();
        $subsistemas = $integrator->datosmaestros->obtenerSubsistemasFecha();
        $global = ZendExt_GlobalConcept::getInstance();
        $x = $global->Estructura->idestructura;
        $fecha = FechaModel::DevuelveFecha($x);
        foreach ($subsistemas as $subsistema) {
            $idsubs = $integrator->datosmaestros->encuentraIdestructurasubsist(
                $subsistema->idsubsistema, $idestructura
            );
            $fechaest = DatFechaconf::BuscarFecha($idsubs);
            if (count($fechaest) == 0) {
                $tabla = new DatFechaconf();
                $tabla->fecha = $fecha;
                $tabla->idestructurasubsist = $idsubs;
                $tabla->incremento = 1;
                $tabla->fechasist = date("d/m/Y");
                $tabla->precedencia = 1;
                $tabla->save();
                unset($tabla);
            }
        }
    }

    /**
     * Tiene fecha configuración contabilidad
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfContabilidad($entidad)
    {
        return $this->TieneFechaConf($entidad, 1);
    }

    /**
     * Tiene fecha configuración costos procesos
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfCostosProcesos($entidad)
    {
        return $this->TieneFechaConf($entidad, 2);
    }

    /**
     * Tiene fecha configuración planificación
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfPlanificacion($entidad)
    {
        return $this->TieneFechaConf($entidad, 3);
    }

    /**
     * Tiene fecha configuración capital humano
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfCapitalHumano($entidad)
    {
        return $this->TieneFechaConf($entidad, 4);
    }

    /**
     * Tiene fecha configuración inventario
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfInventario($entidad)
    {
        return $this->TieneFechaConf($entidad, 5);
    }

    /**
     * Tiene fecha configuración activos fijos
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfActivosFijos($entidad)
    {
        return $this->TieneFechaConf($entidad, 6);
    }

    /**
     * Tiene fecha configuración facturación
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfFacturacion($entidad)
    {
        return $this->TieneFechaConf($entidad, 7);
    }

    /**
     * Tiene fecha configuración cobro pago
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfCobroPago($entidad)
    {
        return $this->TieneFechaConf($entidad, 8);
    }

    /**
     * Tiene fecha configuración configuración
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfConfiguracion($entidad)
    {
        return $this->TieneFechaConf($entidad, 9);
    }

    /**
     * Tiene fecha configuración multimoneda
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfMultimoneda($entidad)
    {
        return $this->TieneFechaConf($entidad, 10);
    }

    /**
     * Tiene fecha configuración auditoria
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfAuditoria($entidad)
    {
        return $this->TieneFechaConf($entidad, 11);
    }

    /**
     * Tiene fecha configuración estructura y composición
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfEstructurayComposicion($entidad)
    {
        return $this->TieneFechaConf($entidad, 12);
    }

    /**
     * Tiene fecha configuración banco
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfBanco($entidad)
    {
        return $this->TieneFechaConf($entidad, 13);
    }

    /**
     * Tiene fecha configuración caja
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfCaja($entidad)
    {
        return $this->TieneFechaConf($entidad, 14);
    }

    /**
     * Tiene fecha configuración usuario
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfUsuario($entidad)
    {
        return $this->TieneFechaConf($entidad, 15);
    }

    /**
     * Tiene fecha configuración portal
     *
     * @param int $entidad Identificador de entidad
     *
     * @return boolean Retorna true en caso de tener configuración falso en otro caso
     */
    public function tieneFechaConfPortal($entidad)
    {
        return $this->TieneFechaConf($entidad, 16);
    }

    /**
     * Devuelve la fecha siguiente
     *
     * @param object $fecha Objeto fecha
     * @param int    $dias  Cantidad de dias
     *
     * @return object Retorna un objeto de tipo fecha dado una fecha y la cantidad de dias
     */
    public function proximaFecha($fecha, $dias)
    {
        return $this->operacfechas->nextDate($fecha, $dias);
    }

    /**
     * Devuelve la diferencia de dias entre 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return int Retorna la cantidad de dias de diferencia entre 2 fechas
     */
    public function diferenciasFechas($fechai, $fechaf)
    {
        return $this->operacfechas->diferenciasfechas($fechai, $fechaf);
    }

    /**
     * Compara 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return boolean Retorna verdadero si las fechas son diferentes falso en otro caso
     */
    public function compararFechas($fechai, $fechaf)
    {
        return $this->operacfechas->compara_fechas($fechai, $fechaf);
    }

    /**
     * Compara 2 fechas
     *
     * @param object $fecha1 Objeto fecha
     * @param object $fecha2 Objeto fecha
     *
     * @return boolean Retorna verdadero si las fechas son iguales falso en otro caso
     */
    public function compararFechasIguales($fechai, $fechaf)
    {
        return $this->operacfechas->compara_fechasIguales($fechai, $fechaf);
    }

    /**
     * Resta 2 fechas
     *
     * @param object $dFecIni Objeto fecha
     * @param object $dFecFin Objeto fecha
     *
     * @return int Retorna la cantidad de dias de diferencia entre 2 fechas
     */
    public function restaFechas($dFecIni, $dFecFin)
    {
        return $this->operacfechas->restaFechas($dFecIni, $dFecFin);
    }

}
