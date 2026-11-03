<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpdiagramaganttModel extends ZendExt_Model {

    public function CmpdiagramaganttModel() {
        parent::ZendExt_Model();
    }

    public function cargarDiagramaDeGantt($parametros) {
        $resultado = array();
        $arrayatareas = array();
        $links = array();

        $arraytareasgantt = DatProyecto::obtenerTareasGanttDadaEstructura($parametros);
        //print_r($arraytareasgantt);die;

        $links = DatActividades::DependenciasDeGantt($parametros);
        foreach ($links as $key => $elemento) {
            foreach ($final as $actividad) {
                if ($elemento['idelementopadre'] == $actividad['idelemento']) {
                    $links[$key]['target'] = $actividad['id'];
                } elseif ($elemento['idelementohijo'] == $actividad['idelemento']) {
                    $links[$key]['source'] = $actividad['id'];
                }
            }
            $links[$key]['id'] = $key;
        }

        $resultado['data'] = $final;
        $resultado['links'] = $links;
        return $resultado;
    }

    public function obtenerHitosTareasGanttDadoProyecto($parametros) {
        $resultado = array();
        $arrayTareas = array();
        $arrayTareasFormatoGantt = array();
        $links = array();

        $arrayTareas = DatProyecto::obtenerHitosTareasGanttDadoProyecto($parametros);
        $links = DatProyecto::obtenerDependenciasTareasGantt($parametros);
        //print_r($arrayTareas);die;

        foreach ($arrayTareas as $key => $tarea) {
            $arrayTareasFormatoGantt[$key] = $this->crearFormatoGantt($tarea, $parametros);
        }

        foreach ($links as $key => $elemento) {
            foreach ($arrayTareasFormatoGantt as $actividad) {
                if ($elemento['idelementopadre'] == $actividad['idelemento']) {
                    $links[$key]['target'] = $actividad['id'];
                } elseif ($elemento['idelementohijo'] == $actividad['idelemento']) {
                    $links[$key]['source'] = $actividad['id'];
                }
            }
            $links[$key]['id'] = $key;
        }

        $resultado['data'] = $arrayTareasFormatoGantt;
        $resultado['links'] = $links;
        return $resultado;
    }

    function crearFormatoGantt($elemento, $parametros) {
        //$gantt = array();
        $gantt['start_date'] = $elemento['fechainicio'];
        $gantt['end_date'] = $elemento['fechafin'];
        if ($elemento['parent'] == $parametros->idproyecto)
            $gantt['parent'] = 0;
        else
            $gantt['parent'] = $elemento['parent'];
        $gantt['id'] = $elemento['idelemento'];
        $gantt['idelemento'] = $elemento['idelemento'];
        $gantt['text'] = $elemento['denelemento'];
        $gantt['progress'] = $elemento['gradocumplimiento'];
        $gantt['open'] = 1;
        $gantt['idtipoelemento'] = $elemento['idtipoelemento'];
        $gantt['actualizarporciento'] = 0;
        $gantt['duracion'] = $elemento['duracionestimada'];
        return $gantt;
    }

    public function desglozarDuracion($equivalenciaMinutos) {

        $restoDias = $equivalenciaMinutos % (1440);
        $equivalenciaDias = $equivalenciaMinutos / (1440);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);


        if ($equivalenciaMinutos >= 60) {
            if ($equivalenciaDias != 0)
                $tiempo = intval($equivalenciaDias) . ' dias';
            else
                $tiempo = '';
            if ($equivalenciaHoras != 0)
                $tiempo .= ' ' . intval($equivalenciaHoras) . ' hor';
            else
                $tiempo .= '';
            if ($restoMinutos != 0)
                $tiempo .= ' ' . round($restoMinutos) . ' min';
            else
                $tiempo .= '';
        } else {
            $tiempo = round($equivalenciaMinutos) . ' min';
        }

        return $tiempo;
    }

}
