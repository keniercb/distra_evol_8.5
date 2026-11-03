<?php
/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
//$address=dirname(dirname(__FILE__));
// $address=str_ireplace('o/plan/models','o/comun/recursos/',$address);
//require_once($address.'html2pdf.class.php');

class CmpgestionarmonitoreoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function correrFecha($fechaI, $dias)
    {
        $op = ($dias < 0) ? '-' : '+';
        $fechaI = explode('/', $fechaI);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $nuevafecha = strtotime($op . abs($dias) . ' day', strtotime($fechaI));
        $nuevafecha = date('d/m/Y', $nuevafecha);
        return $nuevafecha;
    }

    public function InsertarAlarma($parametros)
    {

   /*     if ($parametros->iguala != 0 || $parametros->mayorque != 0
            || $parametros->menorque != 0
        ) {
            $objCondicion = new NomComparacion();
            $objCondicion->igual = $parametros->iguala;
            $objCondicion->mayor = $parametros->mayorque;
            $objCondicion->menor = $parametros->menorque;
            $objCondicion->save();
            $parametros->idcomparacion = $objCondicion->idcomparacion;
        } else {
            $parametros->idcomparacion = '';
        }*/
        $valora = $parametros->cantdiashoras;
        $parametros->fecha = $this->correrFecha(
            $parametros->fechainicio, $valora
        );
        $resultadofinal = DatActividades::InsertarAlarma($parametros);

        /* $result = $this->pIntegrator->planpdo->SeCumplenCondiciones(
             $parametros->idelemento, $parametros->idcomparacion, $parametros->porciento,
             $parametros->estadocump, $parametros->estadoaprov);*/
        return 1;
    }

    public function ValidarHora($hora, $valor)
    {
        $hora = explode(':', $hora);
        if (($hora[0] + $valor) < 0 || ($hora[0] + $valor) > 24) {
            return -1;
        } else {
            return ($hora[0] + $valor) . ':' . $hora[1];
        }
    }

    public function EliminarAlarma($idelemento)
    {
        $result = DatActividades::EliminarAlarma($idelemento);
        return 1;
    }
}
