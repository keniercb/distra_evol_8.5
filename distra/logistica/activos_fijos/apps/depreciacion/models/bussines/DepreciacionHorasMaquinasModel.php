<?php

/**
 * Modelo para servicios de operaciones de depreciacion en
 * Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *
 * @author     Jorge Luis Cuellar Mondeja
 * @package    logistica
 * @version    0.1
 * @filesource DepreciacionHorasMaquinasModel.php
 */
class DepreciacionHorasMaquinasModel extends DepreciacionComunModel
{

    //private $mRegDepreciacion;

    public function __construct()
    {
        parent::__construct();
        //$this->mRegDepreciacion = new RegistroDepreciacionModel();
    }

    /**
     * SEGÚN MALDONADO
     *
     *                                (Valor Contable - VALOR DE SALVAMENTO) (TOTAL)
     *   Factor de Depreciación  = ------------------------------------------------
     *                                  Horas-Máquinas Estimadas (Vida útil)
     *
     *
     *  AHORA PARA UN AÑO EN ESPECIFICO
     *
     *  Para obtener la depreciación anual, este factor se multiplicará por el número de horas
     *  que realmente trabajó la máquina en el año.
     *
     *  AÑO 2013  =  (Horas-Máquinas Real) * (Factor de Depreciación);
     *
     *
     *    Donde:
     *
     *  TOTAL = Valor Contable - VALOR DE SALVAMENTO;
     *
     *  VALOR DE SALVAMENTO (PARTE)    Porciento de recuperación del valor de adquisición del medio (PORCIENTO)
     *  -------------------------- =  -------------------------------------------------------------------------
     *    Valor Contable (TOTAL)                                         100
     */
    public function getTasaAnual($valorSalvamento, $valorContable, $horasMaqEstimada)
    {
        $totalDepreciar = $valorContable - $valorSalvamento;
        $factorDepAnual = $totalDepreciar / $horasMaqEstimada;

        return $factorDepAnual;
    }

    /**
     * Devuelve la tasa a depreciar el registro numérico en el período a depreciar
     *
     * @param      $porcientoRecuperacion
     * @param      $valorContable
     * @param      $horasMaqEstimada
     * @param      $depAcumulada
     * @param      $fechaDepInicial
     * @param bool $tasaRegNumerico
     *
     * @return float|int
     */
    public function getTasaPeriodo($porcientoRecuperacion, $valorContable, $horasMaqEstimada, $depAcumulada,
        $fechaDepInicial, $idRegNumerico, $tasaRegNumerico = false, $fechaexpfin = false)
    {

        $valorSalvamento = $this->getValorSalvamento($porcientoRecuperacion, $valorContable);

        if (($valorContable - $depAcumulada) >= $valorSalvamento) {
            $factorDepAnual = $this->getTasaAnual($valorSalvamento, $valorContable, $horasMaqEstimada);

            $depDiaria = $factorDepAnual / 365;
            $cantDiasDepreciar = $this->getCantDiasInicioDepreciarEntreMov(
                $idRegNumerico, $fechaDepInicial, $fechaexpfin
            );           
            return $depDiaria * $cantDiasDepreciar;
        }

        return 0;
    }

    /**
     * Devuelve el listado de los registros numéricos a depreciar en el período contable actual de la entidad
     *
     * @param       $fecha
     * @param       $parametros
     * @param array $whereIN
     *
     * @return array
     */
    public function getRegNumericosDepreciar($fecha, $parametros, $whereIN = array())
    {
        $idMetodoDep = DepreciacionModelFactory::getIdMetodoByClassName('DepreciacionHorasMaquinasModel');
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatInmuebles = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;  
        $query = $this->getQueryRegNumericosDepreciar($fecha, $parametros, $whereIN, $idMetodoDep);
        if (/*$idnatActivos && */$idnatInmuebles && $idnatObjObra) {
            $query->andWhereNotIn('i.idnaturaleza', array($idnatInmuebles,$idnatObjObra));
        }

        // $query->addSelect('d3.fechacontable as fechaaprobadoDoc'); 
        if ($query) {
            $query->addWhere('nact.iddepreciacion = 1');
            $total = $query->count();

            $query->addSelect(
                "
            (
                SELECT rnac2.lecturarecurso FROM DatRecursoRegNumericoActivo rnac2
                WHERE rnac2.idregnumericoactivo = drna.idregnumerico
                ORDER BY rnac2.fecha DESC
                LIMIT 1
            ) AS cantidadrecursoconsumidoLectura"
            );
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
            return array('datos' => $query->fetchArray(), 'total' => $total);
        } else {
            return array('datos' => array(), 'total' => 0);
        }


    }

    /**
     * Crea un nuevo movimiento de registro numérico con los últimos datos que tiene el registro numérico
     *
     * @param $movRegNumerico
     * @param $movRegNumActivo
     * @param $idRegNumerico
     */
    public function clonePropertyRegNumeToMovRegNumerico(&$movRegNumerico, &$movRegNumActivo, $idRegNumerico)
    {   
        parent::clonePropertyRegNumeToMovRegNumerico($movRegNumerico, $movRegNumActivo, $idRegNumerico);
        $mRegDepreciacion = new RegistroDepreciacionModel();
        $movRegNumActivo->cantidadrecursoconsumido = $mRegDepreciacion->getCantRecConsumidoByIdRegNumerico(
            $idRegNumerico
        );          
    }

    /**
     * Depreciar un grupo de registros numéricos según su identificador y la fecha contable del período a depreciar
     *
     * @param $arrIdesRegNumericos
     * @param $fecha
     *
     * @throws ZendExt_Exception('LOG_AFT_DEP_002')
     *
     * @return void
     */
    public function depreciarRegNumByArrIdes($arrIdesRegNumericos, $fecha, $codigooperacion = false)
    {       
        new DatRecursoRegNumericoActivo();
         if ($codigooperacion != false) {
            $codigoOp = array('OPER_BAJA','OPER_BAJA_DESARME','OPER_BAJA_DEFINITIVA','OPER_BAJA_VENTA');
            $operacion = in_array($codigooperacion, $codigoOp);
         }
        if (!$this->_entidadDeprecia) {
            return $msg = 4;
        }
        $documento = $this->getDocDepreciacion($fecha);      
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $cDatRegNumerico = 'DatRegnumerico';
        $cDatRegNumActivo = 'DatRegnumericoActivo';

        $arrIdesProd = $this->getIdesProdByRegNumericos($arrIdesRegNumericos);

        $movCollection = new Doctrine_Collection('DatMovimientos');
        foreach ($arrIdesProd as $idProdLogistica) {

            $movimiento = $this->getNewInstanceMov($idProdLogistica, $documento->iddocumento);
            
            foreach ($arrIdesRegNumericos as $idRegNumerico) {
                $movRegNumerico = new DatMovRegnumerico();
                $movRegNumActivo = new DatMovRegnumericoActivo();                
                self::clonePropertyRegNumeToMovRegNumerico(
                    $movRegNumerico, $movRegNumActivo, $idRegNumerico
                );
                $regNumeActivo = &$movRegNumerico->$cDatRegNumerico->$cDatRegNumActivo;

                // Cantidad de horas de explotación del medio en el período de depreciación
                $horasExplotacionPeriodo = $regNumeActivo->recursoconsumido;
               // $horasExplotacionPeriodo = $movRegNumActivo->cantidadrecursoconsumido;

                if ($movRegNumActivo->valorcontable) {
                   
                    /*$factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        $movRegNumActivo->vidautil, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, false
                    );*/

                    $factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, false,
                        ($operacion) ? $movRegNumActivo->fechaexpfin : false
                    );

                    /* print_r($horasExplotacionPeriodo);
                      die; */
                    $depPeriodo = $factorDepPeriodo * $horasExplotacionPeriodo;

                    $valorSalvamento = $this->getValorSalvamento(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable
                    );

                    $restavcvs = $movRegNumActivo->valorcontable - $valorSalvamento;
                    $sumadepacudepperi = $regNumeActivo->depreciacionacumulada + $depPeriodo;

                    $movRegNumActivo->depreciacion = ($restavcvs < $depPeriodo) ? $restavcvs: $depPeriodo;
                    $depAcumulada = ($restavcvs < $sumadepacudepperi) ? $restavcvs :$sumadepacudepperi;

                    $movRegNumActivo->depreciacionacumulada = $depAcumulada;
                    $regNumeActivo->depreciacionacumulada = $depAcumulada;
                }
                
                if ($movRegNumActivo->valorcontablealternativo) {
                    /*$factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontablealternativo,
                        $movRegNumActivo->vidautil, $movRegNumActivo->depreciacionacumuladaalternativo,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, false
                    );*/

                    $factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontablealternativo,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumuladaalternativo,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, false
                    );

                    /* print_r($horasExplotacionPeriodo);
                      die; */
                    $depPeriodo = $factorDepPeriodo * $horasExplotacionPeriodo;
                    $vcontablealterna = $movRegNumActivo->valorcontablealternativo;
                    $depacumulalterna = $regNumeActivo->depreciacionacumuladaalternativo;
                    $valorSalvamento = $this->getValorSalvamento(
                        $movRegNumActivo->porcientorecuperacion, $vcontablealterna
                    );

                    $movRegNumActivo->depreciacioncuc = ($vcontablealterna - $valorSalvamento < $depPeriodo) ?
                        $vcontablealterna - $valorSalvamento : $depPeriodo;
                    $depAcumulada = ($vcontablealterna - $valorSalvamento < $depacumulalterna + $depPeriodo) ?
                        $vcontablealterna - $valorSalvamento : $depacumulalterna + $depPeriodo;

                    $movRegNumActivo->depreciacionacumuladaalternativo = $depAcumulada;
                    $regNumeActivo->depreciacionacumuladaalternativo = $depAcumulada;
                }
                $cantrecurconsu = $regNumeActivo->cantidadrecursoconsumido;
                $regNumeActivo->cantidadrecursoconsumido = $regNumeActivo->recursoconsumido + $cantrecurconsu;
                $regNumeActivo->recursoconsumido = 0;
               // $this->limpiarRecursoHistorico($regNumeActivo->idregnumerico);
                $regNumeActivo->save();
                
                $movRegNumerico->$cDatMovRegnumericoActivo = $movRegNumActivo;
                $movimiento->$cDatMovRegnumerico->add($movRegNumerico);
            }

            $movCollection->add($movimiento);
        }
        $movCollection->save();

        $mDocDepreciacion = new DocDepreciacionModel();
        $mDocDepreciacion->aprobarDocDepreciacion($documento->iddocumento);


        $historialRNEstadosModel = new HisRegNumericoEstatusModel();
        $historialRNEstadosModel->eliminarHistorial($arrIdesRegNumericos);
        $historialRNEstadosModel->guardarHistorialRegNumEstatus($documento->iddocumento, $fecha);
    }
    
    public function limpiarRecursoHistorico($idregnumerico)
    {   
        $regNumAFT = Doctrine::getTable('DatRecursoRegNumericoActivo')
            ->findByDql('idregnumericoactivo = ?', array($idregnumerico));
        $regNumAFT->depreciar = 0;
        $regNumAFT->save();
        //$regNumAFT->delete();

        return 1;
    }

}
