<?php

class MultimonedaService extends ZendExt_Model
{
    public function __construct()
    {
    }

    public static function ImporteMonedCont($idmonedaent, $ImpMonOrig)
    {
        try {
            //$tasaconv = new DatTasaconversion();
            $tasa = new DatTasa();
            $moneda = DatNommonedaEntidad::getMonedaEntidadBySql(
                array('idnommonedaentidad' => $idmonedaent)
            );
            $tasac = $tasa->TasaActualMonEnt(
                $moneda[0]['idnommoneda'], $moneda[0]['idestructuracomun']
            );
            //$facttas = $tasa->buscarDatTasa(array('idtasaconversion'=>$moncont['datos'][0]['idtasaconversion']));
            if (empty($tasac)) {
                throw new ZendExt_Exception('CONF140');
            }
            $calc = ($ImpMonOrig / $tasac[0]['factordeconversion'])
                * $tasac[0]['compra'];       //die(doubleval($calc));
            //devuelvo el calculo
            //return ($ImpMonOrig/$tasac[0]['factordeconversion'])*$facttas[0]['compra'];
            if (gettype($calc) == "integer") {
                return "$calc.00";
            }
            return doubleval($calc);
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF140');
        }
    }

    public static function Moneda()
    {
        return new DatMoneda();
    }

    public static function Tasa($idmoneda, $idtasa = 0)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $tasas = DatTasa::getTasa(
            $idmoneda, $idtasa, $global->Estructura->idestructura
        );
        $standard = new ZendExt_ClassStandard();
        $array = $standard->ArrayObject($tasas);
        return $array;
    }

    public function BuscarTasaPorId($idtasa)
    {
        $tasas = DatTasa::BuscarTasaPorId($idtasa);
        $standard = new ZendExt_ClassStandard();
        $tasa = $standard->Object($tasas);
        return $tasa;

    }

    public static function TasaActual($idmonedaentidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatNommonedaEntidad::BuscarMonedaPorId(
            $idmonedaentidad, $entidad
        );
        if ($moneda[0]['idnommoneda']) {
            $tasasact = DatTasa::TasaActualActualizada(
                $moneda[0]['idnommoneda'], $entidad
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

    public static function MonedaContable()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $monedac = DatMoneda::ObtenerMonedaContableDadoEntidad(
            $global->Estructura->idestructura
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monedac);
    }

    public static function MonedaAlternativa($impoprte)
    {
        $monedalter = DatMoneda::buscarDatMoneda(
            array('idestructuracomun' => $this->global->Estructura->idestructura,
                  'monaltern'         => '1')
        );
        $monconv = array(0 => array('importe' => (100 * $impoprte)));
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monconv);
    }

    public static function BuscarIdMonedaEntidad($idmoneda, $identidad)
    {
        $monedaentidad = DatNommonedaEntidad::BuscarIdMonedaEntidad(
            $idmoneda, $identidad
        );
        return $monedaentidad[0]['idnommonedaentidad'];
    }

    public static function BuscarMonedaPorId($idmonedaentidad)
    {
        $monedaentidad = DatNommonedaEntidad::BuscarMonedaPorId(
            $idmonedaentidad
        );
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monedaentidad);
    }

    //devuelve todas las monedas
    public static function Monedas($idmoneda = 0, $identidad)
    {
        if ($identidad) {
            //busco las moneedas asociadas a la entidad
            $elementos = DatNommonedaEntidad::getMonedaEntidadBySql(
                array('idestructuracomun' => $identidad,
                      'idnommonedaentidad' => $idmoneda)
            );
            if (count($elementos) == 1) {
                $idnommoneda = $elementos[0]['idnommoneda'];
            }
        }
        //busco las monedas

        $monedas = NomMoneda::buscarMonedas($idnommoneda);

        if (count($elementos) && count($monedas)) {
            foreach ($elementos as $i => $mon) {
                foreach ($monedas as $mn) {
                    if ($mn['idmoneda'] == $mon['idnommoneda']) {
                        $elementos[$i]['idnommonedaentidad']
                            = $mon['idnommonedaentidad'];
                        $elementos[$i]['codigoiso'] = $mn['codigoiso'];
                        $elementos[$i]['nombremoneda'] = $mn['nombremoneda'];
                    }
                }
            }
            $standard = new ZendExt_ClassStandard();
            /*$field = array_keys($elementos[0]);
            $array = NULL;
            $i= 0;
            foreach ($elementos as $vlp){
              $array[] = new stdClass();
              foreach ($field as $j=>$d)$array[$i]->$d=$vlp[$d];
              $i++;
            }*/
            $array = $standard->ArrayObject($elementos);
        } else {
            $array = array();
        }


        return $array;
    }

    public function MonedaC()
    {
        $dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dir_controller = $dir_rel_app
            . '/configuracion/multimoneda/index.php/gestmultimoneda/gestmonedacontablecargainicial';
        header("Location: $dir_controller");
    }

    public function MonedaE()
    {
        $dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dir_controller = $dir_rel_app
            . '/configuracion/multimoneda/index.php/gestmultimoneda/gestmonedasentidadcargainicial';
        header("Location: $dir_controller");
    }

    static function ExisteMonedaAlertnativa($identidad)
    {
        $monedalt = DatMoneda::obtenerMonedaAlternativa($identidad);
        if (!empty($monedalt)) {
            return true;
        } else {
            return false;
        }
    }

    static function BuscarMonedaAlertnativa($identidad)
    {
        $monedalt = DatMoneda::obtenerMonedaAlternativa($identidad);
        if (!empty($monedalt)) {
            $standard = new ZendExt_ClassStandard();
            return $standard->Object($monedalt);
        } else {
            return new stdClass();
        }
    }

    static function MonContAlter($identidad)
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

    static function SoloMonedaCont($identidad)
    {
        $monContAlter = DatMoneda::buscarDatMoneda(
            array('idestructuracomun' => $identidad)
        );
        if ($monContAlter['cant'] == 1
            && $monContAlter['datos'][0]['monaltern'] == -1
        ) {
            return true;
        } else {
            return false;
        }
    }

    static function EsMonedaCont($identidad, $idnommonent)
    {
        $moncont = self::MonedaContableEntidad($identidad);
        $moncont1 = DatNommonedaEntidad::BuscarMonedaPorId(
            $idnommonent, $identidad
        );

        if (!empty($moncont1) && !empty($moncont)
            && $moncont->idmoneda == $moncont1[0]['idnommoneda']
        ) {
            return true;
        } else {
            return false;
        }
    }

    public static function MonedaContableEntidad($identidad)
    {
        $monedac = DatMoneda::ObtenerMonedaContableDadoEntidad($identidad);
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($monedac);
    }

    public function TieneMonedaContable($entidad)
    {
        $hay = self::MonedaContableEntidad($entidad);
        if ($hay->idmoneda) {
            return true;
        } else {
            return false;
        }
    }

    public function TieneMonedas($entidad)
    {
        $elementos = DatNommonedaEntidad::getMonedaEntidadBySql(
            array('idestructuracomun' => $entidad)
        );
        if (count($elementos)) {
            return true;
        } else {
            return false;
        }
    }

    public function TieneTasas($entidad)
    {
        $obj = new DatTasa();
        $tasas = $obj->buscarDatTasa(array('idestructuracomun' => $entidad));
        if (count($tasas)) {
            return true;
        } else {
            return false;
        }
    }

    public function ReevaluaciondeCuentas(
        $denominacion, $cuentas = array(), $ctasdestinos = array()
    ) {
        $identidad = $this->global->Estructura->idestructura;
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $idperiodo = $this->global->Periodo->periodoactual;

        if ($this->integrator->parametros->SubsistemasCierreEntidad(
            $identidad
        )
        ) {
            $reevaluacion_model = new DatReevaluacionModel();
            $cuenta_model = new DatCuentasreevaluadasModel();
            $cant_cuentas = count($cuentas);
            if ($cant_cuentas) {
                $reevaluacion = new DatReevaluacion();
                $reevaluacion->denominacion = $denominacion;
                $reevaluacion->fecha = date("Y/m/d");
                $reevaluacion_model->Insertar($reevaluacion);
                $id_reevaluacion = $reevaluacion->idreevaluacion;
                for ($j = 0; $j < $cant_cuentas; $j++) {
                    $monedas
                        = $this->integrator->contabilidad->ObtenerSaldoCuentaMoneda(
                        $cuentas[$j], $identidad, $idperiodo
                    );
                    if (count($monedas)) {
                        $cant_Monedas = count($monedas);
                        for ($i = 0; $i < $cant_Monedas; $i++) {
                            $idmoneda = $monedas[$i]->moneda;
                            $result = DatTasa::GetFactoresByMoneda($idmoneda);
                            if ($result) {
                                foreach ($result as $index => $factores) {
                                    $cuentas_revaluadas
                                        = new DatCuentasreevaluadas();
                                    $cuentas_revaluadas->idreevaluacion
                                        = $id_reevaluacion;
                                    $cuentas_revaluadas->idcuenta
                                        = $cuentas[$j];
                                    $cuentas_revaluadas->idtasa
                                        = $factores->idtasa;
                                    $saldo_origen
                                        = $monedas[$i]->saldo_original;
                                    $cuentas_revaluadas->saldomonedaorigen
                                        = $saldo_origen;
                                    $saldo_contable
                                        = $monedas[$i]->saldo_contable;
                                    $cuentas_revaluadas->saldomonedacontable
                                        = $saldo_contable;
                                    $factordeconversion
                                        = $factores->factordeconversion;
                                    $tasacambio = $factores->compra;
                                    $cuentas_revaluadas->reevaluacion
                                        = ($saldo_origen / $factordeconversion)
                                        * $tasacambio;
                                    $cuentas_revaluadas->diferencia
                                        = $saldo_contable
                                        - $cuentas_revaluadas->reevaluacion;
                                    $cuenta_model->Insertar(
                                        $cuentas_revaluadas
                                    );
                                }
                            }
                        }
                    }
                }
                $cont = new ContabilizarReevaluaciondeMoneda();
                $cont->Contabilizar(
                    $id_reevaluacion, $identidad, $idsubsistema, $idperiodo
                );
            }
            return true;
        } else {
            throw new ZendExt_Exception('CONFM001');
        }
    }

    static public function ObtenerDesgloseMoneda($idmoneda)
    {
        $monedaent = DatNommonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $idmoneda
        );

        $idmonen = $monedaent[0]['idnommoneda'];
        $result = DatDezglozemoneda::ObtenerDesgloseMoneda($idmonen, 1);

        if (!$result) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($result);
    }

    static public function ObtenerDesgloseBilletes($idmoneda)
    {
        $monedaent = DatNommonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $idmoneda
        );

        $idmonen = $monedaent[0]['idnommoneda'];
        $result = DatDezglozemoneda::ObtenerDesgloseMoneda($idmonen, 2);

        if (!$result) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($result);
    }

    static public function ObtenerCuentasSinReeval($identidad)
    {
        $cuentas_revaluadas = new DatCuentasreevaluadas();
        //obtengo las cuentas reevaluadas
        $res = $cuentas_revaluadas->ObtenerCuentasReevalEnt($identidad);

        //Busco las que no se han reevaluado
        $integrator = ZendExt_IoC::getInstance();
        $resc = $integrator->contabilidad->ObtenerArrayDeCuentas($identidad);
        $resultado = array();
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

    public function InsertarTasa(
        $venta, $compra, $desde, $hasta, $referencia, $factor, $monedacont,
        $moneda, $nombre, $entidad
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

    static public function TasasContratadas($idmonedaentidad, $idcliente)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatNommonedaEntidad::BuscarMonedaPorId(
            $idmonedaentidad, $entidad
        );

        if ($moneda[0]['idnommoneda']) {
            //$tasasact = DatTasa::TasasContratadasActuales($moneda[0]['idnommoneda'],$idcliente,$entidad);
            $tasas = DatTasa::TasasContratadas(
                $moneda[0]['idnommoneda'], $idcliente, $entidad
            );
            //print_r($tasasact);die;
            //if(!empty($tasasact) && !empty($tasas))
            //   throw new ZendExt_Exception('CONF302');

            return ZendExt_ClassStandard::ArrayObject($tasas);
        } else {
            return new stdClass();
        }
    }

    static public function TasasActualyControladas($idmonedaentidad, $idcliente)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $entidad = $global->Estructura->idestructura;
        $moneda = DatNommonedaEntidad::BuscarMonedaPorId(
            $idmonedaentidad, $entidad
        );
        if ($moneda[0]['idnommoneda']) {
            $tasa = DatTasa::TasaActual($moneda[0]['idnommoneda'], $entidad);
            $controladas = DatTasa::TasasContratadas(
                $moneda[0]['idnommoneda'], $idcliente, $entidad
            );
        }
        if (count($tasa)) {
            $controladas[] = $tasa[0];
        }
        return ZendExt_ClassStandard::ArrayObject($controladas);
    }

    static public function TasaInicial()
    {
        return ZendExt_ClassStandard::Object(DatTasa::TasaInicial());
    }

    static public function obtenerObjetoMonedaEntidad($idmonedaentidad)
    {
        $monedaentidad = DatNommonedaEntidad::getMonedaEntidadByIdMonedaEntidad(
            $idmonedaentidad
        );
        return ZendExt_ClassStandard::Object($monedaentidad);
    }

    static public function BuscarNomMonedas()
    {
        $monedas = NomMoneda::buscar();
        return ZendExt_ClassStandard::ArrayObject($monedas);
    }

    public static function ImporteMonedContByEntidad(
        $idmonedaent, $ImpMonOrig, $idestructura
    ) {
        try {
            //$tasaconv = new DatTasaconversion();
            $tasa = new DatTasa();
            $moneda = DatNommonedaEntidad::getMonedaEntidadBySql(
                array('idnommonedaentidad' => $idmonedaent)
            );
            $tasac = $tasa->TasaActualMonEnt(
                $moneda[0]['idnommoneda'], $idestructura
            );

            //$facttas = $tasa->buscarDatTasa(array('idtasaconversion'=>$moncont['datos'][0]['idtasaconversion']));
            if (empty($tasac)) {
                throw new ZendExt_Exception('CONF140');
            }
            $calc = ($ImpMonOrig / $tasac[0]['factordeconversion'])
                * $tasac[0]['compra'];       //die(doubleval($calc));
            //devuelvo el calculo
            //return ($ImpMonOrig/$tasac[0]['factordeconversion'])*$facttas[0]['compra'];
            if (gettype($calc) == "integer") {
                return "$calc.00";
            }
            return doubleval($calc);
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF140');
        }
    }

    //Servicio para saber si una cuenta esta reevaluada.
    public function CuentaReevaluada($idcuenta, $fecha)
    {
        $DatCuentasreevaluadas = new DatCuentasreevaluadas();
        $cuenta_reev = $DatCuentasreevaluadas->CuentaReevaluada(
            $idcuenta, $fecha
        );
        return $cuenta_reev;
    }

    public function IdMonedaContableDadoEntidad($idEntidad)
    {
        return DatMoneda::ObtenerMonedaContableDadoEntidad($idEntidad);
    }

}

?>