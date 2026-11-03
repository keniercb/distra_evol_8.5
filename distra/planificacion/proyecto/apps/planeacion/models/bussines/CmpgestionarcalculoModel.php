<?php

/**
 * @author    
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */

class CmpgestionarcalculoModel extends ZendExt_Model
{

    public function CmpgestionarcalculoModel()
    {
        parent::ZendExt_Model();
    }

    

    /**
     * Funcion para adicionar los hitos
     */
    public function tareasByProyectoMod($parametros)
    {
        $objDatcalculo = new DatCalculoduracion();
        return $objDatcalculo->tareasByProyectoDat($parametros);


    }
    public function guardarRegistroMod($parametros)
    {

        $objDatcalculo = new DatCalculoduracion();
        //$objDatcalculo->eliminarRegistroDat($parametros->idtarea);
        $con = false;

        foreach ($parametros->arrayregistro as $key => $elemen){
            $con = $objDatcalculo->guardarRegistroDat($parametros->idtarea,$elemen,$parametros->idusuariocrea);
        }
        return $con;
     }

    public function eliminarRegistroMod($parametros)
    {
        $objDatcalculo = new DatCalculoduracion();

        foreach ($parametros->arrayregistro as $key => $elemen){
            //$objDatcalculo->eliminarRegistroDat($parametros->idtarea, $elemen);
            $objDatcalculo->eliminarRegistroDat($elemen);
        }
    }

    public function registrobytareaMod($parametros){
        $objDatcalculo = new DatCalculoduracion();

        $registros = $objDatcalculo->registrobytareaDat($parametros->idtarea);
        $promedios = $objDatcalculo->maxminprombytareaDat($parametros->idtarea);

        return [$registros,$promedios];

    }
    public function modificarEstimacionMod($parametros){
        $objDatcalculo = new DatCalculoduracion();
        /*para guardar el tiempo en la Tabla de tareas convierto el tiempo a minutos
          no importa que no tenga dias las horas se convierten a segundos y final obtengo los minutos
          48 horas son dos dias por lo que no importa el termino dias ya que se pueden traducir las horas
        */
        $cantminutos = 1;
        $sec = self::timeToSec(explode(":",$parametros->tiempo));
        if($sec > 60){
            $cantminutos = $sec/60;
        }
        $objDatcalculo->modificarEstimacionDat($parametros->idtarea,$cantminutos);
        return $objDatcalculo->obtenerTEstimacionDat($parametros->idtarea);

    }

    public function timeToSec($arrayF){
        return (($arrayF[0]*3600)+($arrayF[1]*60)+(int)$arrayF[2]);
    }

    public function secToTime($sec){
        $result = array();
        $result[0] = (int)($sec/3600);

        $resto = (int)($sec%3600);
            $result[1] = (int)($resto/60);
        if($result[1] > 60)
            $result[1] = (int)($result[1] - 60);
            $result[2] = (int)($resto%60);

        return implode(":", $result);
    }

    public function adicionarejercicioMod($parametros){
        $objDatcalculo = new DatCalculoduracion();
       return $objDatcalculo->adicionarejercicioDat($parametros->data,$parametros->proyectopadre);
    }
    public function modificarejercicioMod($parametros){
        $objDatcalculo = new DatCalculoduracion();
        return $objDatcalculo->modificarejercicioDat($parametros->data);
    }
    public function eliminarjercicioMod($parametros){
        $objDatcalculo = new DatCalculoduracion();
        return $objDatcalculo->eliminarjercicioDat($parametros->data);
    }
    public function getejerciciosMod($parametros){
        $objDatcalculo = new DatCalculoduracion();
        return $objDatcalculo->getejerciciosDat($parametros);
    }

    public function crudResultadoMod($parametros,$action){
        $objDatcalculo = new DatCalculoduracion();
        switch ($action) {
            case "leer":
                $resultado = $objDatcalculo->resultadoLeerDat($parametros);
                $data = array();
                foreach ($resultado as $val) {
                    unset($val[0]);
                    unset($val[1]);
                    unset($val[2]);
                    unset($val[3]);
                    unset($val[4]);
                    unset($val[5]);
                    $data[] = $val;
                }

                return $data;
            case "eliminar":
                $resultado = $objDatcalculo->resultadoQuitRelDat($parametros);;
                break;
            case "adicionar":
                $resultado = $objDatcalculo->resultadoAddDat($parametros);
                break;
        }
        return $resultado;

    }


}
