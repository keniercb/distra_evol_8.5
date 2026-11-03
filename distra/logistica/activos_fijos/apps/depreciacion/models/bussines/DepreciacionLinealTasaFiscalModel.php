<?php

/**
 * Modelo para servicios de operaciones de depreciación en
 * Activos Fijos Tangibles (AFT).
 * 02/11/2015
 *
 * @author  Jorge Luis Cuellar Mondeja
 * @package logistica
 * @version 0.1
 */
class DepreciacionLinealTasaFiscalModel extends DepreciacionLinealModel
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Calcula la tasa de depreciación del período a depreciar para el caso que trabaja
     *  el sistema con tasas porcentuales
     * fijas
     *
     * @param $porcientoRecuperacion
     * @param $valorContable
     * @param $tasaRegNumerico
     * @param $depAcumulada
     *
     * @return float|int
     */
    public function getTasaPeriodo($porcientoRecuperacion, $valorContable, $vidaUtilProvable, $depAcumulada,
        $fechaDepInicial, $idRegNumerico, $tasaRegNumerico)
    {

        $valorSalvamento = $this->getValorSalvamento($porcientoRecuperacion, $valorContable);

        if (($valorContable - $depAcumulada) >= $valorSalvamento) {
            $tasaAnual = $tasaRegNumerico / 100 * $valorContable;

            /**
             * Para este método nu usamos años de 365 días sino de meses de 30 días, para que la gráfica
             *  de depreciación
             * siempre de lineal
             */
            $depDiaria = $tasaAnual / $this->_cantMesesAnno / $this->_cantDiasMeses;

            $cantDiasDepreciar = $this->getCantDiasInicioDepreciarEntreMov($idRegNumerico, $fechaDepInicial);

            return $depDiaria * $cantDiasDepreciar;
        }

        return 0;
    }

}
