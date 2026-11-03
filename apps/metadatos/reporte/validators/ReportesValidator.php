<?php

/**
 * Class ReportesValidator

 */
class ReportesValidator extends ZendExt_Model
{
    /**
     *  Comprueba que no exista una configuracióin con la denominación propuesta.
     *
     * @return bool, arreglo que contiene las dos condiciones a aplicar.
     * @autor     : Ing. Pedro Alberto Jiménez
     * @copyright Copyright (c) 2013 xetid
     */
    function validarInsertarReporteGrafico()
    {
        $denominacion = $_POST ['denominacion'];
        $datGrafica = new DatGrafica();
        if ($datGrafica->existeDenominacion($denominacion)) {
            return false;
        }

        return true;
    }

    /**
     * Comprueba que no exista una configuracióin con la denominación propuesta.
     *
     * @return bool
     */
    function validarModificarReporteGrafico()
    {
        $denominacion = $_POST ['denominacion'];
        $igrafica = $_POST['idgrafica'];
        $datGrafica = new DatGrafica();
        if ($datGrafica->existeDenominacion($denominacion, $igrafica)) {
            return false;
        }

        return true;
    }
}