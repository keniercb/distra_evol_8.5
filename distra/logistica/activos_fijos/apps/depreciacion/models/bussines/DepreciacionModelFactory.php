<?php

/**
 * Modelo para servicios de operaciones de depreciacion en Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *
 * @author  Jorge Luis Cuellar Mondeja
 * @package logistica
 * @version 0.1
 */
class DepreciacionModelFactory
{

    private static $_mDepLineal, $_mDepHorasMaq, $_mDepUnidProducidas, $_mDepKmRecorridos, $_mDepDigDecrecientes,
        $_mDepLinealTasa, $_mDepMixta, $_mPorCuentas, $_mPorCC;

    /* private static $mDepHorasMaq;
      private static $mDepUnidProducidas;
      private static $mDepKmRecorridos;
      private static $mDepDigDecrecientes;
      private static $mDepLinealTasaFija; */

    private function __clone()
    {
        
    }

    private function __construct()
    {
        
    }

    /**
     * Devuelve la intancia de la clase modelo correspondiente a un método de depreciación
     *
     * @param $idMetodo
     *
     * @return DepreciacionModel|null
     */
    public static function getInstance($idMetodo)
    {
        switch (self::getClassNameByIdMetodo($idMetodo)) {

            case 'DepreciacionLinealModel':

                if (!self::$_mDepLineal instanceof self) {
                    self::$_mDepLineal = new DepreciacionLinealModel();
                }
                return self::$_mDepLineal;

            case 'DepreciacionHorasMaquinasModel':

                if (!self::$_mDepHorasMaq instanceof self) {
                    self::$_mDepHorasMaq = new DepreciacionHorasMaquinasModel();
                }
                return self::$_mDepHorasMaq;

            case 'DepreciacionUnidadesProducidasModel':

                if (!self::$_mDepUnidProducidas instanceof self) {
                    self::$_mDepUnidProducidas = new DepreciacionKmRecorridosModel();
                }
                return self::$_mDepUnidProducidas;

            case 'DepreciacionKmRecorridosModel':

                if (!self::$_mDepKmRecorridos instanceof self) {
                    self::$_mDepKmRecorridos = new DepreciacionUnidadesProducidasModel();
                }
                return self::$_mDepKmRecorridos;

            case 'DepreciacionDigitosDecrecientesModel':
                if (!self::$_mDepDigDecrecientes instanceof self) {
                    self::$_mDepDigDecrecientes = new DepreciacionDigitosDecrecientesModel();
                }
                return self::$_mDepDigDecrecientes;

            case 'DepreciacionMixtoModel':
                if (!self::$_mDepMixta instanceof self) {
                    self::$_mDepMixta = new DepreciacionMixtoModel();
                }
                return self::$_mDepMixta;

            case 'DepreciacionPorCuentas':
                if (!self::$_mPorCuentas instanceof self) {
                    self::$_mPorCuentas = new DepreciacionPorCuentas();
                  
                }
                return self::$_mPorCuentas;

             case 'DepreciacionCentroCosto':
                if (!self::$_mPorCC instanceof self) {
         
                    self::$_mPorCC = new DepreciacionCentroCosto();
                }
                return self::$_mPorCC;
            default :
                if (!self::$_mDepLinealTasa instanceof self) {
                    self::$_mDepLinealTasa = new DepreciacionLinealTasaFiscalModel();
                }
                return self::$_mDepLinealTasa;
        }
    }

    /**
     * Devolver dado el nombre de la clase modelo de depreciación su identificador numérico
     *
     * @param string $className
     *
     * @return integer
     */
    public function getIdMetodoByClassName($pClassName)
    {
        foreach (self::getArrMetodosModelos() as $idMetodo => $className) {
            if ($className == $pClassName) {
                return $idMetodo;
            }
        }
    }

    /**
     * Devuelve la modelo correspondiente a un método de depreciación
     *
     * @param $idMetodo
     *
     * @return mixed
     */
    public function getClassNameByIdMetodo($idMetodo)
    {
        $relacion = self::getArrMetodosModelos();
        return $relacion[$idMetodo];
    }

    /**
     * Devuelve un arreglo de las modelos correspondientes a cada método de depreciación (idmetodo => modelo)
     *
     * @return array
     */
    public function getArrMetodosModelos()
    {
        return array(
            1 => 'DepreciacionUnidadesProducidasModel',
            2 => 'DepreciacionLinealModel',
            3 => 'DepreciacionMixtoModel',
            4 => 'DepreciacionLinealTasaFiscalModel',
            5 => 'DepreciacionKmRecorridosModel',
            6 => 'DepreciacionDigitosDecrecientesModel',
            7 => 'DepreciacionHorasMaquinasModel',
            8 => 'DepreciacionPorCuentas',
            9 => 'DepreciacionCentroCosto'

        );
    }

}
