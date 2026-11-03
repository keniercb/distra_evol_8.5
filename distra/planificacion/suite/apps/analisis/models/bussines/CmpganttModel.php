<?php

/**
 * @author    Osleidy Quiala Fernández
 * @version   1.0.0
 * @copyright ERP-CUBA
 */
class CmpganttModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    //Función que carga los elemtos de planificación de Proyecto
    function tareasGantt($parametros)
    {
        $id = 0;
        $cont = 0;
        //todos los ementos que se listaran en Gantt
        $parametros->arrayTipos = implode(
            ',', $parametros->arrayTiposElementos
        );
        $proyectosGantt = DatProyecto::proyectoGantt($parametros);
        $hitosGantt = DatHito::hitoGantt($parametros);
        $tareasGantt = DatTarea::tareaGantt($parametros);
        $elemenGantt = array_merge($proyectosGantt, $hitosGantt);
        $elemenGantt = array_merge($elemenGantt, $tareasGantt);
        foreach ($elemenGantt as $key => $elemento) {
            switch ($elemento['idtipoelemento']) {
                case 8://El elemento es un PROYECTO
                    $final[$cont] = self::llenarGantt(
                        $id, $elemento, ''
                    );
                    $cont++;
                    $id++;
                    break;
                case 9://El elemento es un HITO
                    $final[$cont] = self::llenarGantt(
                        $id, $elemento, $elemento['idelementopadre']
                    );
                    $cont++;
                    $id++;
                    break;
                case 10://El elemento es una TAREA
                    $final[$cont] = self::llenarGantt(
                        $id, $elemento, $elemento['idelementopadre']
                    );
                    $cont++;
                    $id++;
                    break;
            }
        }

        foreach ($final as $key => $elemento) {
            //****progreso***
            $progreso = $elemento['progress'] / 100;
            $final[$key]['progress'] = $progreso;
            $final[$key]['actualizarporciento']
                = $elemento['actualizarporciento'];

            $final[$key]['modificar'] = 1;
            $final[$key]['eliminar'] = 1;

            $fechainicio = explode('/', $elemento['start_date']);
            $fechafin = explode('/', $elemento['end_date']);
            $final[$key]['start_date']
                = $fechainicio[0] . '-' . $fechainicio[1] . '-'
                . $fechainicio[2]
                . ' ' . $elemento['horainicio'];
            $final[$key]['end_date']
                = $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2] . ' '
                . $elemento['horafin'];
        }


        $dependencias = DatTarea::DependenciasDeGantt($parametros);
        $links = array();
        $pos = 0;
        foreach ($dependencias as $key => $elemento) {
            $cont = 0;
            foreach ($final as $tarea) {
                if ($tarea['idtipoelemento'] == 10) {
                    if ($elemento['idelementopadre'] == $tarea['idelemento']) {
                        $links[$pos]['target'] = $tarea['id'];
                        $cont++;
                    } elseif ($elemento['idelementohijo']
                        == $tarea['idelemento']
                    ) {
                        $links[$pos]['source'] = $tarea['id'];
                        $cont++;
                    }
                }
            }
            if ($cont > 0) {
                $links[$pos]['id'] = $pos;
            }

        }

        $resultado['data'] = $final;
        $resultado['links'] = $links;
        return $resultado;
    }

    function llenarGantt($id, $elemento, $padre)
    {
        $gantt = array();
        $gantt['start_date'] = $elemento['fechainicio'];
        $gantt['end_date'] = $elemento['fechafin'];
        $gantt['parent'] = $id;
        $gantt['id'] = $id;
        $gantt['idelemento'] = $elemento['idelemento'];
        $gantt['text'] = $elemento['denelemento'];
        $gantt['progress'] = $elemento['gradocumplimiento'];
        $gantt['open'] = $elemento['open'];
        $gantt['idtipoelemento'] = $elemento['idtipoelemento'];
        $gantt['actualizarporciento'] = $elemento['actualizarporciento'];
        return $gantt;
    }


}


