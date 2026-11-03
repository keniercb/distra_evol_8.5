<?php

class NomTurnotrabajoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /*
     * Obtener un listado de los datos
    */
    public function obtenerListadoTurnoTrabajo($inicio = 0, $limite = 15, $denominacion, $fdesde, $fhasta,$identidades)
    {
        $array = NomTurnotrabajo::obtenerListadoTurnoTrabajo($inicio, $limite, $denominacion, $fdesde, $fhasta,$identidades);
        foreach ($array as $key => $value) {
            $horainicio = explode(':', $value['horainicio']);
            $horainicio1 = $horainicio[0] . ':' . $horainicio[1];
            $horafin = explode(':', $value['horafin']);
            $horafin1 = $horafin[0] . ':' . $horafin[1];
            $horarioalmuerzo = explode(':', $value['horarioalmuerzo']);
            $horarioalmuerzo1 = (count($horarioalmuerzo) > 1)? $horarioalmuerzo[0] . ':' . $horarioalmuerzo[1]:'';
            $tdescanso = explode(':',$value['tiempodescanso']);
            $heps = explode(':',$value['horaentradaps']);
            $hsps = explode(':',$value['horasalidaps']);
            $hess = explode(':',$value['horaentradass']);
            $hsss = explode(':',$value['horasalidass']);
            $tent = explode(':',$value['toleranciaentrada']);
            $tsal = explode(':',$value['toleranciasalida']);

            $result[$key]['idturnotrabajo'] = $value['idturnotrabajo'];
            $result[$key]['denominacion'] = $value['denominacion'];
            $result[$key]['descripcion'] = $value['descripcion'];
            $result[$key]['fdesde'] = $value['fdesde'];
            $result[$key]['fhasta'] = $value['fhasta'];
            $result[$key]['horainicio'] = $horainicio1;
            $result[$key]['horafin'] = $horafin1;
            $result[$key]['toleranciaentrada'] = (count($tent) > 1)?$tent[0] . ':' . $tent[1]:'';
            $result[$key]['toleranciasalida'] = (count($tsal) > 1)?$tsal[0] . ':' . $tsal[1]:'';
            $result[$key]['horarioalmuerzo'] = $horarioalmuerzo1;
            $result[$key]['tiempodescanso'] = (count($tdescanso) > 1)?$tdescanso[0] . ':' . $tdescanso[1]:'';
            $result[$key]['otrodia'] = ($value['otrodia'] == 1)? $value['otrodia'] = true:$value['otrodia'] = false;
            $result[$key]['horaentradaps'] = (count($heps) > 1)?$heps[0] . ':' . $heps[1]:'';
            $result[$key]['horasalidaps'] = (count($hsps) > 1)?$hsps[0] . ':' . $hsps[1]:'';
            $result[$key]['horaentradass'] = (count($hess) > 1)?$hess[0] . ':' . $hess[1]:'';
            $result[$key]['horasalidass'] = (count($hsss) > 1)?$hsss[0] . ':' . $hsss[1]:'';
            $horas = explode(':',$value['horas']);
            $result[$key]['horas'] = (count($horas) > 1)?$horas[0] . ':' . $horas[1]:'';
            $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idestructura']);
            $result[$key]['estructura'] = $estructura[0]->denominacion;
        }//print_r($result);die;
        //Retornando el listado
        return $result;
    }

    /*
    * Obtener la cantidad total
    */
    public function obtenerCantidadTotalTurnoTrabajo($identidades)
    {
        return NomTurnotrabajo::obtenerCantidadTotalTurnoTrabajo($identidades);
    }

    /**
     * Insertar
     */
    public function InsertarTurnoTrabajo($denominacion, $descripcion, $fdesde, $fhasta, $horainicio, $horafin, $toleranciaentrada, $toleranciasalida,
                                         $horarioalmuerzo, $tiempodescanso,$otrodia,$configSesiones,$idestructura)
    {
        $objTurnoTrabajo = new NomTurnotrabajo();
        $objTurnoTrabajo->denominacion = $denominacion;
        $objTurnoTrabajo->descripcion = $descripcion;
        $objTurnoTrabajo->fdesde = $fdesde;
        $objTurnoTrabajo->fhasta = $fhasta;
        $objTurnoTrabajo->horainicio = $horainicio;
        $objTurnoTrabajo->horafin = $horafin;
        if($otrodia == 'true'){
            $objTurnoTrabajo->otrodia = 1;}
        else{
            $objTurnoTrabajo->otrodia = 0;}
        if ($toleranciaentrada)
            $objTurnoTrabajo->toleranciaentrada = $toleranciaentrada;
        else
            $objTurnoTrabajo->toleranciaentrada = null;
        if ($toleranciasalida)
            $objTurnoTrabajo->toleranciasalida = $toleranciasalida;
        else
            $objTurnoTrabajo->toleranciasalida = null;
        if ($horarioalmuerzo)
            $objTurnoTrabajo->horarioalmuerzo = $horarioalmuerzo;
        else
            $objTurnoTrabajo->horarioalmuerzo = null;
        if ($tiempodescanso)
            $objTurnoTrabajo->tiempodescanso = $tiempodescanso;
        else
            $objTurnoTrabajo->tiempodescanso = null;
        if ($idestructura)
            $objTurnoTrabajo->idestructura = $idestructura;
        else
            $objTurnoTrabajo->idestructura = null;

        if($configSesiones)
        {
            $fecha = explode('/',$fdesde);
            $fechahora = new DateTime($fecha[2].'-'.$fecha[1].'-'.$fecha[0].' '.$horarioalmuerzo.':00');
            $interv = explode(':',$tiempodescanso);
            $interval = new DateInterval("PT".$interv[0]."H".$interv[1]."M");
            $horainicioSS = $fechahora->add($interval);
            $objTurnoTrabajo->horaentradaps = $horainicio;
            $objTurnoTrabajo->horasalidaps = $horarioalmuerzo;
            $objTurnoTrabajo->horaentradass = $horainicioSS->format('H:i:s');
            $objTurnoTrabajo->horasalidass = $horafin;
        }
        //Guardando los datos.
        $objTurnoTrabajo->save();
    }

    /**
     * Modificar
     */
    public function ModificarTurnoTrabajo($idturnotrabajo, $denominacion, $descripcion, $fdesde, $fhasta, $horainicio, $horafin, $toleranciaentrada, $toleranciasalida,
                                          $horarioalmuerzo, $tiempodescanso,$otrodia,$configSesiones,$idestructura)
    {
        $objTurnoTrabajo = Doctrine:: getTable('NomTurnotrabajo')->find($idturnotrabajo);
        $objTurnoTrabajo->denominacion = $denominacion;
        $objTurnoTrabajo->descripcion = $descripcion;
        $objTurnoTrabajo->fdesde = $fdesde;
        $objTurnoTrabajo->fhasta = $fhasta;
        $objTurnoTrabajo->horainicio = $horainicio;
        $objTurnoTrabajo->horafin = $horafin;
        if($otrodia == true)
            $objTurnoTrabajo->otrodia = 1;
        else
            $objTurnoTrabajo->otrodia = 0;
        if ($toleranciaentrada)
            $objTurnoTrabajo->toleranciaentrada = $toleranciaentrada;
        else
            $objTurnoTrabajo->toleranciaentrada = null;
        if ($toleranciasalida)
            $objTurnoTrabajo->toleranciasalida = $toleranciasalida;
        else
            $objTurnoTrabajo->toleranciasalida = null;
        if ($horarioalmuerzo)
            $objTurnoTrabajo->horarioalmuerzo = $horarioalmuerzo;
        else
            $objTurnoTrabajo->horarioalmuerzo = null;
        if ($tiempodescanso)
            $objTurnoTrabajo->tiempodescanso = $tiempodescanso;
        else
            $objTurnoTrabajo->tiempodescanso = null;
        if ($idestructura)
            $objTurnoTrabajo->idestructura = $idestructura;
        else
            $objTurnoTrabajo->idestructura = null;

        if($configSesiones)
        {
            $fecha = explode('/',$fdesde);
            $fechahora = new DateTime($fecha[2].'-'.$fecha[1].'-'.$fecha[0].' '.$horarioalmuerzo.':00');
            $interv = explode(':',$tiempodescanso);
            $interval = new DateInterval("PT".$interv[0]."H".$interv[1]."M");
            $horainicioSS = $fechahora->add($interval);
            $objTurnoTrabajo->horaentradaps = $horainicio;
            $objTurnoTrabajo->horasalidaps = $horarioalmuerzo;
            $objTurnoTrabajo->horaentradass = $horainicioSS->format('H:i:s');
            $objTurnoTrabajo->horasalidass = $horafin;
        }
        //Guardando los datos.

        $objTurnoTrabajo->save();
    }

    /**
     * Eliminar
     */
    public function EliminarTurnoTrabajo($idturnotrabajo)
    {
        $obj = Doctrine:: getTable('NomTurnotrabajo')->find($idturnotrabajo);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function GetAll()
    {
        $turnos = new NomTurnotrabajo();
        $result = $turnos->GetTodos();
        return $result;
    }

    public function existeTurnoTrabajo($denominacion,$idturnotrabajo,$accion)
    {
        return NomTurnotrabajo::existe($denominacion,$idturnotrabajo,$accion);
    }

    public function getTurnoTrabajo()
    {
        return NomTurnotrabajo::getturnotrabajo();
    }

    public function getTurnoTrabajoById($idturnotrabajo)
    {
        $turnos = new NomTurnotrabajo();
        $turno = $turnos->getTurnoTrabajoById($idturnotrabajo);
        return $turno[0]['denominacion'];
    }


}

