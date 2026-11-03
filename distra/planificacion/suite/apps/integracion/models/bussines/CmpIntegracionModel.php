<?php

/**
 * @author
 * @version
 * @copyright XETID
 */
class CmpIntegracionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function VerificarIntegracionModulos($parametros)
    {

        $arrayDatos = array();
        $procede = 1;
        $objsModuloFuente = Doctrine::getTable('NomModulo')->findBySql(
            "uri like '" . $parametros->uriModuloFuente . "'"
        );
        $objsModuloDestino = Doctrine::getTable('NomModulo')->findBySql(
            "uri like '" . $parametros->uriModuloDestino . "'"
        );
        if (isset($objsModuloFuente[0]) && isset($objsModuloDestino[0])) {

            $parametros->idModuloFuente = $objsModuloFuente[0]->idmodulo;
            $parametros->idModuloDestino = $objsModuloDestino[0]->idmodulo;
            $objIntegracion = new DatIntegracion();
            $existeIntegracion = $objIntegracion->VerificarIntegracionModulos(
                $parametros
            );
            if (isset($existeIntegracion[0])) {

                switch ($parametros->uriModuloFuente) {
                    case 'proyecto':
                        if ($parametros->escenario == 'listar') {
                            $sintaxisAsoc
                                = $this->ObtenerSintaxisListarProyectos();
                            $arrayDatos['sintaxis'] = $sintaxisAsoc;
                        }
                        break;
                    case 'workflowl':

                        break;
                    case 'sipac':

                        break;
                }
            }
        } else {
            $procede = 0;
        }

        $arrayDatos['procede'] = $procede;
        return $arrayDatos;
    }


    /*
     * Elementos de integracion para Proyectos
     *
     * */
    public function ObtenerSintaxisListarProyectos()
    {

        $arraySintaxis = array();


        return $arraySintaxis;
    }

    function llenarGantt($id, $elemento, $padre)
    {
        $gantt = array();
        $gantt['start_date'] = $elemento['fechainicio'];
        $gantt['end_date'] = $elemento['fechafin'];
        $gantt['parent'] = $padre;
        $gantt['id'] = $elemento['idelemento'];
        $gantt['idelemento'] = $elemento['idelemento'];
        $gantt['text'] = $elemento['denelemento'];
        $gantt['progress'] = $elemento['gradocumplimiento'];
        $gantt['open'] = $elemento['open'];
        $gantt['idtipoelemento'] = $elemento['idtipoelemento'];
        $gantt['actualizarporciento'] = $elemento['actualizarporciento'];
        return $gantt;
    }

    /*
     * Funcion para obtener los elementos de gantt
     *
     * */
    public function tareasParaGantt($parametros)
    {
        //todos los ementos que se listaran en Gantt
        $proyectosGantt = DatIntegracion::proyectoGantt($parametros);
        $hitosGantt = DatIntegracion::hitoGantt($parametros);
        $tareasGantt = DatIntegracion::tareaGantt($parametros);
        $elemenGantt = array_merge($proyectosGantt, $hitosGantt);
        $elemenGantt = array_merge($elemenGantt, $tareasGantt);
        $cont = 0;
        $id = 1;
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

        $links = DatIntegracion::DependenciasDeGantt($parametros);
        foreach ($links as $key => $elemento) {
            foreach ($final as $tarea) {
                if ($tarea['idtipoelemento'] == 10) {
                    if ($elemento['idelementopadre'] == $tarea['idelemento']) {
                        $links[$key]['target'] = $tarea['id'];
                    } elseif ($elemento['idelementohijo']
                        == $tarea['idelemento']
                    ) {
                        $links[$key]['source'] = $tarea['id'];
                    }
                }
            }
            $links[$key]['id'] = $key;
        }
        $resultado['data'] = $final;
        $resultado['links'] = array();//$links;
        return $resultado;
    }

}
