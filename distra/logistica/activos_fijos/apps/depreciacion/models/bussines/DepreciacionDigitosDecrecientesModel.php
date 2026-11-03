<?php

/**
 * Modelo para servicios de operaciones de depreciación en
 * Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *
 * @author     Jorge Luis Cuellar Mondeja
 * @package    logística
 * @version    0.1
 * @filesource DepreciacionDigitosDecrecientesModel.php
 */
class DepreciacionDigitosDecrecientesModel extends DepreciacionComunModel
{

    /**
     *
     * SEGÚN MALDONADO
     *
     *                                (Valor Contable - VALOR DE SALVAMENTO) (TOTAL)
     *   Factor de Depreciación  = ------------------------------------------------
     *                             Sumatoria de No. de Años de Vida U. Prob (Vida útil)
     *
     *
     *                                         32.000 – 2.000
     *   Factor de Depreciación  = ---------------------------------------------------
     *                               5 + 4 + 3 + 2 + 1 (Primer año de depreciación)
     *   La depreciación será:
     *
     *          1er. Año: $2.000 x 5 = $10.000
     *          2do. Año: $2.000 x 4 = $8.000
     *          3er. Año: $2.000 x 3 = $6.000
     *          4to. Año: $2.000 x 2 = $4.000
     *          5to. Año: $2.000 x 1 = $2.000
     *
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    private function getSumAnnos($vidaUtilProvable)
    {
        $contador = 0;
        for ($i = $vidaUtilProvable; $i >= 1; $i--) {
            $contador += $i;
        }
    }

    private function getAnnoInverso($annoCurso, $vidaUtilProvable)
    {
        return $vidaUtilProvable - ($annoCurso - 1);
    }

    public function getTasaAnual($valorSalvamento, $valorContable, $vidaUtilProvable)
    {
        $totalDepreciar = $valorContable - $valorSalvamento;
        $factorDepreciacionAnual = $totalDepreciar / $this->getSumAnnos($vidaUtilProvable);

        return $factorDepreciacionAnual;
    }

    public function getTasaPeriodo($porcientoRecuperacion, $valorContable, $vidaUtilProvable, $depAcumulada,
        $fechaDepInicial, $idRegNumerico, $tasaRegNumerico = false)
    {
        $valorSalvamento = $this->getValorSalvamento($porcientoRecuperacion, $valorContable);

        if (($valorContable - $depAcumulada) >= $valorSalvamento) {

            $factorAnualGeneral = $this->getTasaAnual($valorSalvamento, $valorContable, $vidaUtilProvable);

            /**
             *  Este $factorAnualGeneral hay que multiplicarlo por el total de años en curso de explotación de
             *  forma decreciente por Ej: Si el medio se explotará 5 años para un factor de depreciación de $2000,
             *
             *  La depreciación será:
             *
             *          1er. Año: $2.000 x 5 = $10.000
             *          2do. Año: $2.000 x 4 = $8.000
             *          3er. Año: $2.000 x 3 = $6.000
             *          4to. Año: $2.000 x 2 = $4.000
             *          5to. Año: $2.000 x 1 = $2.000
             */
            $periodo = $this->getPeriodo();

            $fechaDepInicial = explode('/', $fechaDepInicial);

            $mesInicio = $fechaDepInicial[1];
            $annoInicio = $fechaDepInicial[2];

            $annoDepreciacion = ($periodo['annoFin'] - $annoInicio) + 1;

            $cantMesesEnAnno = $periodo['mesFin'] - $mesInicio;
            $cantMesesEnAnno = ($cantMesesEnAnno > 0) ? $cantMesesEnAnno : abs(abs($cantMesesEnAnno) - 12);

            $factorAnual = $factorAnualGeneral * $this->getAnnoInverso($annoDepreciacion, $vidaUtilProvable);
            return $factorAnual;
        }
    }

    /**
     *
     */
    public function getRegNumericosDepreciar($fecha, $parametros, $whereIN = array())
    {
        return array();
    }

    public function depreciarRegNumByArrIdes($arrIdesRegNumericos, $fecha)
    {
        
    }

}
