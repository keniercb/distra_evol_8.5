<?php

/**
 * Clase de servicios <b>Multimoneda</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Servicios
 * @subpackage Configuración/Multimoneda
 * @copyright  XETID
 * @version    1.0-0
 */
class MultimonedaService extends ZendExt_Model
{

    var $moneda;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->moneda = new NomMonedaModel();
        $this->monedaentidad = new DatMonedaEntidadModel();
    }

    /**
     * Obtiene un objeto de moneda
     *
     * @return DatMoneda Moneda
     */
    public static function Moneda()
    {
        return new DatMoneda();
    }

    /**
     * Obtiene importe de moneda contable.
     *
     * @param mixed $idmonedaent Identificador de moneda-entidad
     * @param mixed $impMonOrig  Importe de moneda original
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public static function ImporteMonedCont($idmonedaent, $impMonOrig)
    {
        try {
            $tasa = new DatTasa();

            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;

            $tasac = $tasa->TasaActualMonEnt(
                $idmonedaent,
                $idestructura
            );
            if (empty($tasac)) {
                throw new ZendExt_Exception('CONF140');
            }
            $calc = ($impMonOrig / $tasac[0]['factordeconversion']) * $tasac[0]['compra'];
            if (gettype($calc) == "integer") {
                return "$calc.00";
            }
            return doubleval($calc);
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF140');
        }
    }

    /**
     * Convierte el importe dado a ambas monedas segun el factor de conversion.
     *
     * @param mixed $idorigen   Identificador de la moneda origen
     * @param mixed $iddestino  Identificador de la moneda destino
     * @param mixed $idtipotasa  Identificador del tipo de tasa
     * @param mixed $importe  Importe a convertir
     * @param mixed $compraventa Determina si se utiliza la compra
     *                           o la venta o ninguna en la formula
     *                           (0 no se utilizan, 1 se utiliza la
     *                           venta y 2 la compra)
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public function convertirImporte($idorigen, $iddestino, $idtipotasa, $importe, $compraventa = 0)
    {
        try {
            $tasa = new DatTasa();
            $monedaentidad = new DatMonedaEntidad();
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;

            //Si toma valor true significa que se convierte de una moneda a la contable de la entidad
            $inversa = false;

            $monedaOrigen = $monedaentidad->buscarIdMonedaEntidad($idorigen, $idestructura)[0];
            $idMonedaOrigen = $monedaOrigen['idmonedaentidad'];

            $monedaDestino = $monedaentidad->buscarIdMonedaEntidad($iddestino, $idestructura)[0];
            $idMonedaDestino = $monedaDestino['idmonedaentidad'];

            if ($monedaOrigen['tipomoneda'] == 0
                || ($monedaOrigen['tipomoneda'] == 1 && $monedaOrigen['dualidad'] == 1
                    && $monedaDestino['tipomoneda'] != 0)
            ) {
                $idMonedaEntidadContable = $idMonedaOrigen;
                $idMonedaAlternativa = $iddestino;
            } else {
                $idMonedaEntidadContable = $idMonedaDestino;
                $idMonedaAlternativa = $idorigen;
                $inversa = true;
            }

            $tasac = $tasa->TasaMonEnt(
                $idMonedaEntidadContable,
                $idestructura,
                $idMonedaAlternativa,
                $idtipotasa
            );

            if (empty($tasac)) {
                return array('error' => true, 'code' => -1,
                             'msg'   => "No existen tasas de cambio configurada para las monedas.");
            }

            if ($tasac[0]['hasta']) {
                list($d, $m, $a) = explode('/', $tasac[0]['hasta']);
                $menor = (mktime(0, 0, 0, $m, $d, $a) < mktime(
                        0, 0, 0, date("m"), date("d"), date("Y")
                    )) ? 1 : 0;
                if ($menor == 1) {
                    return array('error' => true, 'code' => -2, 'msg' => "La tasa ha excedido su período de vigencia.");
                }
            }

            if ($compraventa == 1) {
                $calc = ($importe / $tasac[0]['factordeconversion']) * $tasac[0]['venta'];
                $calcInversa = ($importe / $tasac[0]['venta']) * $tasac[0]['factordeconversion'];
            } else {
                if ($compraventa == 2) {
                    $calc = ($importe / $tasac[0]['factordeconversion']) * $tasac[0]['compra'];
                    $calcInversa = ($importe / $tasac[0]['compra']) * $tasac[0]['factordeconversion'];
                } else {
                    $calc = $importe * $tasac[0]['factordeconversion'];
                    $calcInversa = $importe / $tasac[0]['factordeconversion'];
                }
            }

            $calc = gettype($calc) == "integer" ? "$calc.00" : doubleval($calc);
            $calcInversa = gettype($calcInversa) == "integer" ? "$calc.00" : doubleval($calcInversa);

            if (!$inversa) {
                return $calc;
            } else {
                return $calcInversa;
            }
        } catch (ZendExt_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene importe a partir de la moneda contable.
     *
     * @param mixed $idmonedaContable Identificador de moneda contable
     * @param mixed $impMonOrig       Importe de moneda original
     * @param mixed $idestP           Identificador de estructura
     * @param bool  $e                Para lanzar excepción o retorno en caso no encontrar tasa asociada a moneda
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public static function calcularImporteDadoMonedas(
        $idmonedaContable, $impMonOrig, $idestructura, $e = true
    )
    {
        try {
            $tasa = new DatTasa();
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = ($idestructura) ? $idestructura
                : $global->Estructura->idestructura;
            /*$datmoneda = DatMoneda::buscarDatMoneda(
                array('idmonedacontable' => $idmonedaContable)
            );*/
            $tasac = $tasa->TasaActualMonEnt($idmonedaContable, $idestructura);
            if (empty($tasac)) {
                if ($e) {
                    throw new ZendExt_Exception('CONF140');
                }
                return -1;
            }
            if ($tasac[0]['hasta']) {
                list($d, $m, $a) = explode('/', $tasac[0]['hasta']);
                $menor = (mktime(0, 0, 0, $m, $d, $a) < mktime(
                        0, 0, 0, date("m"), date("d"), date("Y")
                    )) ? 1 : 0;
                if ($menor == 1) {
                    throw new ZendExt_Exception('CONF301');
                } else {
                    $calc = ($impMonOrig / $tasac[0]['venta']) * $tasac[0]['factordeconversion'];
                }
            } else {
                $calc = ($impMonOrig / $tasac[0]['venta']) * $tasac[0]['factordeconversion'];
            }
            return self::comprobarTipo($calc);
            /*
              return doubleval($calc);
             */
        } catch (ZendExt_Exception $ee) {
            throw $ee;
        }
    }


    /**
     * Obtiene importe a partir de una moneda.
     *
     * @param mixed $idmonedaContable Identificador de la moneda
     * @param mixed $impMonOrig       Importe de moneda original
     * @param mixed $idestP           Identificador de estructura
     * @param bool  $e                Para lanzar excepción o retorno en caso no encontrar tasa asociada a moneda
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public static function calcularImporteMoneda(
        $idmoneda, $importe, $idestructura, $e = 0
    ) {
        try {
            $tasa = new DatTasa();
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = ($idestructura) ? $idestructura
                : $global->Estructura->idestructura;
            $tasac = $tasa->TasaActualMonEnt($idmoneda, $idestructura);
            //print_r($tasac);die;
            if (empty($tasac)) {
                if ($e==1) {
                    throw new ZendExt_Exception('CONF140');
                }
                return array('code'=>-1,'msg'=>'No existen tasas de cambio configuradas para la moneda.');
            }
            if ($tasac[0]['hasta']) {
                list($d, $m, $a) = explode('/', $tasac[0]['hasta']);
                $menor = (mktime(0, 0, 0, $m, $d, $a) < mktime(
                        0, 0, 0, date("m"), date("d"), date("Y")
                    )) ? 1 : 0;
                if ($menor == 1) {
                    if($e==1){
                        throw new ZendExt_Exception('CONF301');
                    }
                    return array('code'=>-2,'msg'=>'La tasa actual de la moneda ha excedido su período de vigencia.');
                } else {
                    $calc = ($importe / $tasac[0]['factordeconversion']) * $tasac[0]['venta'];
                }
            } else {
                $calc = ($importe / $tasac[0]['factordeconversion']) * $tasac[0]['venta'];
            }
            return self::comprobarTipo($calc);

        } catch (ZendExt_Exception $ee) {
            throw $ee;
        }
    }

    private static function comprobarTipo($calc)
    {
        if (gettype($calc) == "integer") {
            return "$calc.00";
        }
        return doubleval($calc);
    }

    /**
     * Obtiene importe de moneda contable de la XETID.
     *
     * @param mixed $idmonedaent Identificador de moneda-entidad
     * @param mixed $impMonOrig  Importe de moneda original
     * @param bool  $e           Para lanzar excepción o retorno en caso no encontrar tasa asociada a moneda
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public static function ImporteMonedContXetid($idmonedaent, $impMonOrig, $e = true, $idttasa = 0)
    {
        try {
            $tasa = new DatTasa();
            /*$moneda = DatMonedaEntidad::obtenerMonedasByEntidad(
                array('idmonedaentidad' => $idmonedaent)
            );*/
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructura = $global->Estructura->idestructura;
            $tasac = $tasa->TasaActualMonEntXetid(
            /*$moneda['datos'][0]['idmoneda']*/
                $idmonedaent, /*$moneda['datos'][0]['idestructuracomun']*/
                $idestructura
            );
            if ($idttasa) {
                foreach ($tasac as $t) {
                    if ($idttasa == $t['idtasa']) {
                        $tasac[0] = $t;
                        break;
                    }
                }
            }
            if (empty($tasac)) {
                if ($e) {
                    throw new ZendExt_Exception('CONF140');
                }
                return -1;
            }
            $calc = ($impMonOrig / $tasac[0]['factordeconversion']) * $tasac[0]['compra'];
            if (gettype($calc) == "integer") {
                return "$calc.00";
            }
            return round(doubleval($calc),2);
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF140');
        }
    }

    /**
     * Obtiene una tasa.
     *
     * @param mixed $argIdMoneda Identificador de moneda
     * @param mixed $argIdTasa   Identificador de tasa
     *
     * @return array Tasa
     */
    public static function Tasa($argIdMoneda, $argIdTasa = 0)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $tasas = DatTasa::getTasa($argIdMoneda, $argIdTasa, $global->Estructura->idestructura);
        $standard = new ZendExt_ClassStandard();
        $array = $standard->ArrayObject($tasas);
        return $array;
    }

    /**
     * Obtiene la Tasa que corresponda con el identificador de moneda y estructura
     *
     * @param $idmoneda
     * @param $idestructuracomun
     *
     * @return mixed
     */
    public function buscarTasasPorMonedas($idmoneda, $idestructuracomun = 0)
    {
        if ($idestructuracomun == 0) {
            $idestructuracomun = $this->global->Estructura->idestructura;
        }
        $tasas = DatTasa::getTasasPorMonedas($idmoneda, $idestructuracomun);
        return $tasas;
    }

    /**
     * Obtiene tasas vigentes.
     *
     * @param mixed $idmoneda Identificador de moneda
     *
     * @return array Tasas
     */
    public static function buscarTasasVigentes($idmoneda)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructuracomun = $global->Estructura->idestructura;
        $instanceIntegrator = ZendExt_IoC::getInstance();
        $fecha = $global->FechaContable->fecha;
        if (!$fecha) {
            $fecha = $instanceIntegrator->parametros->fechaContableSubsistema(
                $idestructuracomun, 4
            );
        }
        $tasas = DatTasa::BuscarTasasVigentesFecha(
            $idmoneda, $idestructuracomun, $fecha
        );
        if (!$tasas) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        $tasao = $standard->ArrayObject($tasas);
        return $tasao;
    }

    /**
     * Obtiene una tasa a partir de su identificador.
     *
     * @param mixed $idtasa Identificador de tasa
     *
     * @return Object Tasa
     */
    public function buscarTasaPorId($idtasa)
    {
        $tasas = DatTasa::buscarTasaPorId($idtasa);
        $standard = new ZendExt_ClassStandard();
        $tasa = $standard->Object($tasas);
        return $tasa;
    }

    /**
     * Obtiene la tasa actual.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return mixed stdClass() si no existe, Object si existe
     * @throws ZendExt_Exception
     */
    public static function TasaActual($idmonedaentidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $obj = new DatMonedaEntidad();
        $moneda = $obj->getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idmoneda']) {
            $tasas = DatTasa::TasaActual($moneda[0]['idmoneda'], $entidad);
            if (empty($tasas)) {
                throw new ZendExt_Exception('CONF301');
            }
        }
        if (!$tasas) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        //Al convertir un arreglo de mas de un elemento
        //se devuelve el primer elemento del arreglo como objeto
        $tasa = $standard->Object($tasas);
        return $tasa;
    }

    /**
     * Obtiene la tasa actual de XETID.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return mixed stdClass() si no existe, Object si existe
     * @throws ZendExt_Exception
     */
    public static function TasaActualXetid($idmonedaentidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idnommoneda']) {
            $tasasact = DatTasa::TasaActualActualizadaXetid(
                $moneda[0]['idnommoneda'], $entidad
            );
            $tasas = DatTasa::TasaActualXetid(
                $moneda[0]['idnommoneda'], $entidad
            );
            if (empty($tasasact) && !empty($tasas)) {
                throw new ZendExt_Exception('CONF301');
            }
        }
        if (!$tasas) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        $tasao = $standard->Object($tasas);
        return $tasao;
    }

    /**
     * Obtiene las tasas por moneda.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return mixed stdClass() si no existe, Object si existe
     */
    public function AllTasasByMoneda($idmonedaentidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idmoneda']) {
            $tasas = DatTasa::AllTasasByMoneda(
                $moneda[0]['idmoneda'], $entidad
            );
        }
        if (!$tasas) {
            return array(new stdClass());
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($tasas);
    }

    /**
     * Obtiene la tasa por moneda y tipo de tasa.
     *
     * @param int $idmonedaentidad Identificador de moneda-entidad
     * @param int $idtipotasa tipo de tasa
     *
     * @return mixed stdClass() si no existe, Object si existe
     */
    public function TasaByMonedaIdTipoTasa($idmonedaentidad, $idtipotasa)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idmoneda']) {
            $tasas = DatTasa::TasasByMonedaIdTipoTasa(
                $moneda[0]['idmoneda'], $entidad, $idtipotasa
            );
        }
        if (!$tasas) {
            return null;
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($tasas)[0];
    }

    /**
     * Obtiene la tasa actual de XETID.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return mixed stdClass() si no existe, Object si existe
     * @throws ZendExt_Exception
     */
    public static function ObtenerTasaVigentePorFecha(
        $idmonedaentidad, $fecha = null
    ) {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idnommoneda']) {
            $tasasact = DatTasa::TasaPorFecha(
                $moneda[0]['idnommoneda'], $entidad, $fecha
            );
            $tasas = DatTasa::TasaActual($moneda[0]['idnommoneda'], $entidad);
            if (empty($tasasact) && !empty($tasas)) {
                throw new ZendExt_Exception('CONF301');
            }
        }
        if (!$tasas) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        $tasao = $standard->Object($tasas);
        return $tasao;
    }

    /**
     * Obtiene la tasa vigente por fecha de XETID.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     * @param mixed $fecha           Fecha
     *
     * @return mixed stdClass() si no existe, Object si existe
     * @throws ZendExt_Exception
     */
    public static function ObtenerTasaVigentePorFechaXetid(
        $idmonedaentidad, $fecha = null
    ) {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById($idmonedaentidad);
        if ($moneda[0]['idnommoneda']) {
            $tasasact = DatTasa::TasaPorFechaXetid(
                $moneda[0]['idnommoneda'], $entidad, $fecha
            );
            $tasas = DatTasa::TasaActualXetid(
                $moneda[0]['idnommoneda'], $entidad
            );
            if (empty($tasasact) && !empty($tasas)) {
                throw new ZendExt_Exception('CONF301');
            }
        }
        if (!$tasas) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        $tasao = $standard->Object($tasas);
        return $tasao;
    }

    /**
     * Obtiene moneda contable a partir de un identificador de entidad.
     *
     * @return Object Monedas
     */
    public static function MonedaContable()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $monedac = DatMonedaEntidad::ObtenerMonedaContableDadoEntidad($global->Estructura->idestructura);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monedac['datos']);
    }

    /**
     * Obtiene moneda alternativa.
     *
     * @param mixed $impoprte Importe
     *
     * @return Object Moneda
     */
    public static function MonedaAlternativa($impoprte)
    {
        /* $monedalter = DatMoneda::buscarDatMoneda(
          array('idestructuracomun' => $this->global->Estructura->idestructura,
          'monaltern'         => '1')
          ); */
        $monconv = array(0 => array('importe' => (100 * $impoprte)));
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monconv);
    }

    /**
     * Obtiene identificador de moneda-entidad a partir de los identificadores de moneda y entidad.
     *
     * @param mixed $idmoneda  Identificador de moneda
     * @param mixed $identidad Identificador de entidad
     *
     * @return mixed Identificador moneda-entidad
     */
    public static function buscarIdMonedaEntidad($idmoneda, $identidad)
    {
        $monedaentidad = DatMonedaEntidad::buscarIdMonedaEntidad($idmoneda, $identidad);
        return $monedaentidad[0]['idmonedaentidad'];
    }

    public static function buscarNomMoneda($idmoneda)
    {
        $result = NomMoneda::buscarMonedas($idmoneda);
        return $result;
    }

    /**
     * Obtiene moneda a partir del identificador de moneda-entidad.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return Object Moneda
     */
    public static function buscarMonedaPorIdMonedaentidad($idmonedaentidad)
    {
        $monedaentidad = DatMonedaEntidad::getMonedaEntidadById(
            $idmonedaentidad
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monedaentidad);
    }

    /**
     * Obtiene moneda a partir del identificador de moneda-entidad.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return Object Moneda
     */
    public static function buscarMonedaPorId($idmoneda)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $monedaentidad = DatMonedaEntidad::buscarIdMonedaEntidad($idmoneda, $identidad);
        $idmonedaentidad = $monedaentidad[0]['idmonedaentidad'];
        $moneda = DatMonedaEntidad::getMonedaEntidadById(
            $idmonedaentidad
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($moneda);
    }

    /**
     * Obtener una(las) moneda(s) dado un id entidad com&uacute;n.
     *
     * @param int $argIdMonedaEnt Identificador de moneda. En caso de ser 0 se obtienen todas.
     * @param int $argIdEntidad   Identificador de entidad
     *
     * @return array Monedas de la entidad
     */
    public static function obtenerMonedasPorIdEntidad($argIdMonedaEnt = 0, $argIdEntidad = 0)
    {
        $standard = new ZendExt_ClassStandard();
        $objDatMonedaEnt = new DatMonedaEntidad();
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        $objEstructura = $globalConcept->Estructura;
        if ($argIdEntidad) {
            $params = array('idestructuracomun' => $argIdEntidad, 'idmonedaentidad' => $argIdMonedaEnt);
            $elementos = $objDatMonedaEnt->obtenerMonedasByEntidad($params);
        } else {
            $params = array('idestructuracomun' => $objEstructura->idestructura,
                            'idmonedaentidad'   => $argIdMonedaEnt);
            $elementos = $objDatMonedaEnt->obtenerMonedasByEntidad($params);
        }
        if (count($elementos['datos'])) {
            $array = $standard->ArrayObject($elementos['datos']);
        } else {
            $array = $standard->ArrayObject(array());
        }
        return $array;
    }

    /**
     * Obtiene todas las monedas de una entidad que tienen tasas configuradas.
     *
     * @param int $idestructura Identificador de la estructura.
     *
     * @return array Monedas de la entidad
     */
    public function ObtenerMonedasTasasConfiguradas($idestructura = null)
    {
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        $objEstructura = $globalConcept->Estructura;
        if (!$idestructura) {
            $idestructura = $objEstructura->idestructura;
        }
        return $this->monedaentidad->ObtenerMonedasTasasConfiguradas($idestructura);
    }

    /**
     * Obtiene la dirección del controlador de carga inicial de moneda
     *
     * @return void
     */
    public function monedaC()
    {
        //$dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dirController = 'http://' . $_SERVER['HTTP_HOST']
            . '/configuracion/multimoneda/index.php/gestmultimoneda/gestmonedacontablecargainicial';
        header("Location: $dirController");
    }

    /**
     * Obtiene la dirección del controlador de carga inicial de moneda-entidad
     *
     * @return void
     */
    public function monedaE()
    {
        //$dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dirController = 'http://' . $_SERVER['HTTP_HOST']
            . '/configuracion/multimoneda/index.php/gestmultimoneda/gestmonedasentidadcargainicial';
        header("Location: $dirController");
    }

    /**
     * Verifica si existe una moneda alternativa.
     *
     * @param mixed $identidad Identificador de entidad
     *
     * @return boolean
     */
    static function existeMonedaAlertnativa($identidad)
    {
        $arrayMonedaAlternativa = DatMoneda::obtenerMonedaAlternativa(
            $identidad
        );
        if (!empty($arrayMonedaAlternativa)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene una moneda alternativa.
     *
     * @param mixed $agIdEntidad Identificador de entidad
     *
     * @return array
     */
    static function buscarMonedaAlertnativa($agIdEntidad)
    {
        $arrayMonedaAlternativa = DatMonedaEntidad::ObtenerMonedasAlternativasDadoEntidad($agIdEntidad);
        return $arrayMonedaAlternativa;
    }

    /**
     * Verifica si existen monedas contables alternativas.
     *
     * @param mixed $identidad Identificador de entidad
     *
     * @return boolean
     */
    static function monContAlter($identidad)
    {
        $monContAlter = DatMoneda::buscarDatMoneda(
            array('idestructuracomun' => $identidad)
        );
        if ($monContAlter['cant'] == 2) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Verifica si solo existen monedas contables
     *
     * @param mixed $identidad Identificador de entidad
     *
     * @return boolean
     */
    static function soloMonedaCont($identidad)
    {
        $monContAlter = DatMoneda::buscarDatMoneda(
            array('idestructuracomun' => $identidad)
        );
        if ($monContAlter['cant'] == 1 && $monContAlter['datos'][0]['monaltern'] == -1
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene monedas por entidad
     *
     * @param mixed $agIdEntidad Identificador de entidad
     *
     * @return mixed Moneda
     */
    static function obtenerMonedasPorEntidad($agIdEntidad)
    {
        return DatMonedaEntidad::obtenerMonedasByEntidad(array('idestructuracomun' => $agIdEntidad));
    }

    /**
     * Verifica si una moneda es contable o no.
     *
     * @param mixed $identidad   Identificador de entidad
     * @param mixed $idnommonent Identificador de nomenclador moneda-entidad
     *
     * @return boolean
     */
    static function esMonedaCont($identidad, $idnommonent)
    {
        $moncont = self::monedaContableEntidad($identidad);
        $moncontab = DatMonedaEntidad::getMonedaEntidadById(
            $idnommonent, $identidad
        );
        if (!empty($moncontab) && !empty($moncont) && $moncont->idmoneda == $moncontab[0]['idnommoneda']
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Obtiene una moneda contable a partir de un identificador de entidad.
     *
     * @param mixed $identidad Identificador de entidad
     *
     * @return Object Moneda
     */
    public static function monedaContableEntidad($agIdEstructura,$dualidad = 1)
    {
        $monedac = DatMonedaEntidad::ObtenerMonedaContableDadoEntidad($agIdEstructura,$dualidad);
        return $monedac;
    }

    /**
     * Verifica si una entidad tiene alguna moneda contable.
     *
     * @param mixed $entidad Identificador de entidad
     *
     * @return boolean
     */
    public function tieneMonedaContable($entidad)
    {
        $hay = self::monedaContableEntidad($entidad);
        if ($hay->idmoneda) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Verifica si una entidad tiene alguna moneda.
     *
     * @param mixed $entidad Identificador de entidad
     *
     * @return boolean
     */
    public function tieneMonedas($entidad)
    {
        $elementos = DatMonedaEntidad::obtenerMonedasByEntidad(
            array('idestructuracomun' => $entidad)
        );
        if (count($elementos)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Verifica si una entidad tiene alguna tasa.
     *
     * @param mixed $entidad Identificador de entidad
     *
     * @return boolean
     */
    public function tieneTasas($entidad)
    {
        $obj = new DatTasa();
        $tasas = $obj->buscarDatTasa(array('idestructuracomun' => $entidad));
        if (count($tasas)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Aplica una reevaluación de las cuentas.
     *
     * @param mixed $denominación Denominación de cuenta
     * @param array $cuentas      Cuentas
     * @param array $ctasdestinos Cuentas de destino
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function reevaluaciondeCuentas(
        $denominacion, $cuentas = array()/* , $ctasdestinos = array() */
    )
    {
        $identidad = $this->global->Estructura->idestructura;
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $idperiodo = $this->global->Periodo->periodoactual;
        if ($this->integrator->parametros->subsistemasCierreEntidad($identidad)) {
            $reevaluacionModel = new DatReevaluacionModel();
            $cuentaModel = new DatCuentasreevaluadasModel();
            $cantCuentas = count($cuentas);
            if ($cantCuentas) {
                $reevaluacion = new DatReevaluacion();
                $reevaluacion->denominacion = $denominacion;
                $reevaluacion->fecha = date("Y/m/d");
                $reevaluacionModel->Insertar($reevaluacion);
                $idReevaluacion = $reevaluacion->idreevaluacion;
                $this->calcularReevaluacion(
                    $cantCuentas, $cuentas, $identidad, $idperiodo, $idReevaluacion, $cuentaModel
                );
                $cont = new ContabilizarReevaluaciondeMoneda();
                $cont->Contabilizar(
                    $idReevaluacion, $identidad, $idsubsistema, $idperiodo
                );
            }
            return true;
        } else {
            throw new ZendExt_Exception('CONFM001');
        }
    }

    private function calcularReevaluacion($cantCuentas, $cuentas, $identidad, $idperiodo, $idReevaluacion, $cuentaModel)
    {
        for ($j = 0; $j < $cantCuentas; $j++) {
            $monedas = $this->integrator->contabilidad->ObtenerSaldoCuentaMoneda(
                $cuentas[$j], $identidad, $idperiodo
            );
            if (count($monedas)) {
                $cantMonedas = count($monedas);
                for ($i = 0; $i < $cantMonedas; $i++) {
                    $idmoneda = $monedas[$i]->moneda;
                    $result = DatTasa::GetFactoresByMoneda($idmoneda);
                    if ($result) {
                        foreach ($result as $factores) {
                            $cuentasRevaluadas = new DatCuentasreevaluadas();
                            $cuentasRevaluadas->idreevaluacion = $idReevaluacion;
                            $cuentasRevaluadas->idcuenta = $cuentas[$j];
                            $cuentasRevaluadas->idtasa = $factores->idtasa;
                            $saldoOrigen = $monedas[$i]->saldo_original;
                            $cuentasRevaluadas->saldomonedaorigen = $saldoOrigen;
                            $saldoContable = $monedas[$i]->saldo_contable;
                            $cuentasRevaluadas->saldomonedacontable = $saldoContable;
                            $factordeconversion = $factores->factordeconversion;
                            $tasacambio = $factores->compra;
                            $cuentasRevaluadas->reevaluacion = ($saldoOrigen / $factordeconversion) * $tasacambio;
                            $cuentasRevaluadas->diferencia = $saldoContable - $cuentasRevaluadas->reevaluacion;
                            $cuentaModel->Insertar(
                                $cuentasRevaluadas
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * Obtiene desglose en monedas.
     *
     * @param mixed $agIdMonedaEntidad Identificador moneda-entidad
     *
     * @return array Desgloses
     */
    static public function getDesgloseEnMonedas($agIdMonedaEntidad)
    {
        $monedaEntidad = DatMonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $agIdMonedaEntidad
        );
        $idNomMoneda = $monedaEntidad[0]['idnommoneda'];
        $desglosesEnMonedas = DatDezglozemoneda::getDesglosesMonedaByCategoria(
            $idNomMoneda, 1
        );
        if (!$desglosesEnMonedas) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($desglosesEnMonedas);
    }

    /**
     * Obtiene desglose en billetes.
     *
     * @param mixed $agIdMonedaEntidad Identificador moneda-entidad
     *
     * @return array Desgloses
     */
    static public function getDesgloseEnBilletes($agIdMonedaEntidad, $catDesglose = 2)
    {
        $monedaEntidad = DatMonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $agIdMonedaEntidad
        );
        $idNomMoneda = $monedaEntidad[0]['idmoneda'];
        $desglosesEnBilletes = DatDezglozemoneda::getDesglosesMonedaByCategoria(
            $idNomMoneda, $catDesglose
        );
        if (!$desglosesEnBilletes) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($desglosesEnBilletes);
    }

    /**
     * Obtiene cuentas sin reevaluar.
     *
     * @param mixed $identidad Identificador de entidad
     *
     * @return array Cuentas
     */
    static public function ObtenerCuentasSinReeval($identidad)
    {
        $cuentasRevaluadas = new DatCuentasreevaluadas();
        $res = $cuentasRevaluadas->ObtenerCuentasReevalEnt($identidad);
        $integrator = ZendExt_IoC::getInstance();
        $resc = $integrator->contabilidad->ObtenerArrayDeCuentas($identidad);
        if ($res) {
            foreach ($res as $rc) {
                foreach ($resc as $i => $rcc) {
                    if ($rcc->idcuenta == $rc['idcuenta']) {
                        unset($resc[$i]);
                    }
                }
            }
        }
        if (empty($res) && empty($resc)) {
            return array();
        }
        return $resc;
    }

    /**
     * Adiciona una tasa.
     *
     * @param mixed $venta      Venta
     * @param mixed $compra     Compra
     * @param mixed $desde      Desde
     * @param mixed $hasta      Hasta
     * @param mixed $referencia Referencia
     * @param mixed $factor     Factor
     * @param mixed $monedacont Moneda contable
     * @param mixed $moneda     Moneda
     * @param mixed $nombre     Nombre
     * @param mixed $entidad    Entidad
     *
     * @return void
     */
    public function insertarTasa(
        $venta, $compra, $desde, $hasta, $referencia, $factor, $monedacont, $moneda, $nombre, $entidad
    ) {
        $tasa = new DatTasa();
        $tasa->venta = $venta;
        $tasa->compra = $compra;
        $tasa->desde = $desde;
        $tasa->hasta = $hasta;
        $tasa->referencia = $referencia;
        $tasa->factordeconversion = $factor;
        $tasa->idmonedacontable = $monedacont;
        $tasa->idmoneda = $moneda;
        $tasa->nombretasa = $nombre;
        $tasa->idestructuracomun = $entidad;
        $tasa->idtipotasa = 2;
        $tasa->version = 0;
        $model = new TasaModel();
        $model->insertarDatTasa($tasa);
    }

    /**
     * Obtiene las tasas contratadas.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     * @param mixed $idcliente       Identificador de cliente
     *
     * @return mixed stdClass() si no existe la moneda o array de tasas si existe la moneda
     */
    static public function TasasContratadas($idmonedaentidad, $idcliente)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById(
            $idmonedaentidad, $entidad
        );
        if ($moneda[0]['idnommoneda']) {
            $tasas = DatTasa::TasasContratadas(
                $moneda[0]['idnommoneda'], $idcliente, $entidad
            );
            return ZendExt_ClassStandard::ArrayObject($tasas);
        } else {
            return new stdClass();
        }
    }

    /**
     * Obtiene las tasas actuales y contratadas.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     * @param mixed $idcliente       Identificador de cliente
     *
     * @return array Tasas
     */
    static public function TasasActualyControladas($idmonedaentidad, $idcliente)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatMonedaEntidad::getMonedaEntidadById(
            $idmonedaentidad, $entidad
        );
        $integrator = ZendExt_IoC::getInstance();
        $idcliente = $integrator->parametros->ObtenerCliente(
            $idcliente
        )->idclientesproveedores;
        if ($moneda[0]['idnommoneda']) {
            $tasas = DatTasa::TasaActualActualizada(
                $moneda[0]['idnommoneda'], $entidad
            );
            $controladas = DatTasa::TasasContratadas(
                $moneda[0]['idnommoneda'], $idcliente, $entidad
            );
        }
        if (count($tasas)) {
            $controladas[] = $tasas[0];
        }
        return ZendExt_ClassStandard::ArrayObject($controladas);
    }

    /**
     * Obtiene la tasa inicial.
     *
     * @return Object Tasa
     */
    static public function tasaInicial()
    {
        return ZendExt_ClassStandard::Object(DatTasa::tasaInicial());
    }

    /**
     * Obtiene una moneda-entidad.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return Object Moneda-Entidad
     */
    static public function obtenerObjetoMonedaEntidad($idmonedaentidad)
    {
        $monedaentidad = DatMonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $idmonedaentidad
        );
        return ZendExt_ClassStandard::Object($monedaentidad);
    }

    /**
     * Obtiene el importe de moneda contable por entidad.
     *
     * @param mixed $idmonedaent  Identificador de moneda-entidad
     * @param mixed $impMonOrig   Importe de moneda original
     * @param mixed $idestructura Identificador de estructura
     *
     * @return double Importe
     * @throws ZendExt_Exception
     */
    public static function ImporteMonedContByEntidad(
        $idmonedaent, $impMonOrig, $idestructura
    ) {
        try {
            $tasa = new DatTasa();
            $moneda = DatMonedaEntidad::obtenerMonedasByEntidad(
                array('idmonedaentidad' => $idmonedaent)
            );
            $tasac = $tasa->TasaActualMonEnt(
                $moneda['datos'][0]['idmoneda'], $idestructura
            );
            if (empty($tasac)) {
                throw new ZendExt_Exception('CONF140');
            }
            $calc = ($impMonOrig / $tasac[0]['factordeconversion']) * $tasac[0]['compra'];
            if (gettype($calc) == "integer") {
                return "$calc.00";
            }
            return doubleval($calc);
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF140');
        }
    }

    /**
     * Obtiene la cantidad de monedas.
     *
     * @return mixed Cantidad de monedas
     */
    public function cantidadMonedaIn()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        return $this->moneda->cantidadMonedaIn($idEstructura);
    }

    /**
     * Obtiene todas las monedas del nomenclador
     *
     * @param array $argFilter Utilizado para la busqueda, utilizar el formato array('sfFiltro' => 'prueba') o
     *                         array('nombremoneda' => 'miMoneda')
     * @param int   $start     Inicio inferior
     * @param int   $limit     L&iacute;mite superior
     *
     * @author Ing. Lisvany Alonso Martinez
     * @return array Devuelve un arreglo con la estructura array('cant' => $cantMonedas, 'datos' => $resultMonedas)
     */
    public function getNomencladorMoneda($argFilter = array(), $start = 0, $limit = 20)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        return $this->moneda->obtenerNomMonedas($argFilter, $start, $limit, $idEstructura);
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_moneda
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_moneda
     * @param string $asLoc alias de la tabla nom_operaiones
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoinMoneda($dql, $asExt, $asLoc = 'no', $join = 1){
        if(!class_exists('NomMoneda')){
            $this->includeMonedaModels();
        }
        return $this->moneda->addQueryJoinMoneda($dql, $asExt, $asLoc, $join);
    }

    private function includeMonedaModels(){
        $base_path = Zend_Registry::getInstance()->get('config')->dir_aplication . '/configuracion/';
        require_once $base_path . 'bancos/models/domain/generated/BaseNomMoneda.php';
        require_once $base_path . 'bancos/models/domain/NomMoneda.php';
    }

    /**
     * Obtiene todos los tipos de tasas
     *
     * @param array $cond Utilizado para la busqueda, utilizar el formato array('nombre' => 'prueba')
     * @param int   $start     Inicio inferior
     * @param int   $limit     L&iacute;mite superior
     *
     * @author Ing. Alberto Mesa martïnez
     * @return array
     */
    public function getTipoTasas($cond,$start,$limit){
        $tipotasa = new NomTipotasas();
        return $tipotasa->buscar($cond,$limit,$start);
    }

    /**
     * Obtiene todos los tipos de tasas
     *
     * @param int   $idMonedaContable     identificador de la moenda contable o alternativa.
     * @param int   $idMoneda     Identidficador de la moneda alternativa o moneda de la entidad.
     * @param int   $idTipoTasa   Identidficador del tipo de tasa.
     *
     * @author Ing. Alberto Mesa martïnez
     * @return array
     */
    public function getTasaByMonedas($idMonedaContable,$idMoneda,$idTipoTasa = 2,$idestructura){
        $tasa = new DatTasa();
        $monedaentidad = new DatMonedaEntidad();
        $global = ZendExt_GlobalConcept::getInstance();
        $idestructura = $idestructura ? $idestructura : $global->Estructura->idestructura;

        $monedaContable = $monedaentidad->buscarIdMonedaEntidad($idMonedaContable,$idestructura)[0];
        $idMonedaEntidadContable = $monedaContable['idmonedaentidad'];

        $tasac = $tasa->TasaMonEnt(
            $idMonedaEntidadContable,
            $idestructura,
            $idMoneda,
            $idTipoTasa
        );

        return $tasac;
    }
}
