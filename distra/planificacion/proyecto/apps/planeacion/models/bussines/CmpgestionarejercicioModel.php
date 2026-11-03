<?php

/**
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarejercicioModel extends ZendExt_Model
{

    public function CmpgestionarejercicioModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Accion para listar los ejercicios
     */
    public function listarEjercicios($parametros)
    {
        $objDatEjercicio = new DatEjercicio();
        $datos = $objDatEjercicio->listarEjercicios($parametros);
        $data['data'] = array();
        $data['total'] = 0;
        if (isset($datos)) {
            $data['total'] = $datos[0]['total'];
            $data['data'] = $datos;
            foreach ($datos as $key => $dat) {
                $data['data'][$key]['autor'] = $this->integrator->seguridad->nombreUsuario($dat['idusuario']);
            }
        }
        return $data;
    }

    /**
     * Funcion para adicionar los ejercicios
     */
    public function adicionarEjercicio($parametros)
    {
        //obteniendo tareas a relacionar sin repetir
        $parametros->tareas = array();
        $parametros->duracionestimada = 0;
        if (isset($parametros->arrayElementos)) {
            $tareas = self::obtenerTareas($parametros->arrayElementos);
            foreach ($tareas as $tarea) {
                if (in_array($tarea, $parametros->tareas) != 1) {
                    $parametros->tareas[] = $tarea;
                }
            }
            //calculando duracion estimada
            $parametros->duracionestimada = self::calcularDuracionTareas($parametros->tareas);
        }

        //Add en dat ejercicio        
        $objDatEjercicio = new DatEjercicio();
        $objDatEjercicio->denominacion = $parametros->denejercicio;
        $objDatEjercicio->descripcion = $parametros->desejercicio;
        $objDatEjercicio->idusuario = $parametros->idusuario;
        $objDatEjercicio->duracionestimada = $parametros->duracionestimada;
        $objDatEjercicio->identidad = $parametros->identidad;
        $objDatEjercicio->save();

        if (isset($parametros->arrayElementos)) {
            //Add en dat ejerciciotarea
            $parametros->idejercicio = $objDatEjercicio->idejercicio;
            self::adicionarEjerciciotarea($parametros);
        }
        return 1;
    }

    /**
     * Funcion para modificar los ejercicios
     */
    public function modificarEjercicio($parametros)
    {
        //obteniendo tareas a relacionar sin repetir
        $parametros->tareas = array();
        $idtareas = array();
        $parametros->duracionestimada = 0;
        if (isset($parametros->arrayElementos[0])) {
            $tareas = self::obtenerTareas($parametros->arrayElementos);
            foreach ($tareas as $tarea) {
                if (in_array($tarea, $parametros->tareas) != 1) {
                    $parametros->tareas[] = $tarea;
                    $idtareas[] = $tarea['idelemento'];
                }
            }
            //calculando duracion estimada
            $parametros->duracionestimada = self::calcularDuracionTareas($parametros->tareas);
        }

        //modificando en dat ejercicio   
        $objDatEjercicio = Doctrine::getTable('DatEjercicio')->findByDql("idejercicio = {$parametros->idejercicio}");
        $objDatEjercicio[0]->denominacion = $parametros->denejercicio;
        $objDatEjercicio[0]->descripcion = $parametros->desejercicio;
        $objDatEjercicio[0]->duracionestimada = $parametros->duracionestimada;
        $objDatEjercicio[0]->save();

        if (isset($parametros->arrayElementos[0])) {
            //eliminar tareas del ejercicio
            $idtareasCadena = implode(',', $idtareas);
            $DatEjercicioTarea = new DatEjerciciotarea();
            $DatEjercicioTarea->eliminarTareasEjercicioArray($parametros->idejercicio, $idtareasCadena);

            foreach ($idtareas as $tarea) {
                $objDatEjercicioTarea = Doctrine::getTable('DatEjerciciotarea')->findByDql("idejercicio = {$parametros->idejercicio} and idtarea= $tarea");
                if ($objDatEjercicioTarea[0]->idtarea == null) {
                    //Add en dat ejerciciotarea
                    $objDatEjercicioTarea[0]->idejercicio = $parametros->idejercicio;
                    $objDatEjercicioTarea[0]->idtarea = $tarea;
                    $objDatEjercicioTarea[0]->save();
                }
            }
        }

        return 1;
    }

    /**
     * Funcion para eliminar los ejercicios
     */
    public function eliminarEjercicio($arrayidejercicios)
    {
        $idejercicios = implode(',', $arrayidejercicios);
        $objDatEjercicio = new DatEjercicio();
        return $objDatEjercicio->eliminarEjercicio($idejercicios);
    }

    /**
     * Acciones auxiliares
     */
    public function adicionarEjerciciotarea($parametros)
    {
        $arrEjercicioTarea = new Doctrine_Collection(Doctrine:: getTable('DatEjerciciotarea'));
        foreach ($parametros->tareas as $k => $tarea) {
            $arrEjercicioTarea[$k]->idejercicio = $parametros->idejercicio;
            $arrEjercicioTarea[$k]->idtarea = $tarea['idelemento'];
        }
        $arrEjercicioTarea->save();
        return 1;
    }

    function calcularDuracionTareas($tareas)
    {
        //obtrniendo la menor y la mayor de las tareas
        $fechaI = explode('/', $tareas[0]['fechainicio']);
        $datetimeInicio = new DateTime($fechaI[2] . $fechaI[1] . $fechaI[0] . ' ' . $tareas[0]['horainicio']);
        $fechaF = explode('/', $tareas[0]['fechafin']);
        $datetimeFin = new DateTime($fechaF[2] . $fechaF[1] . $fechaF[0] . ' ' . $tareas[0]['horafin']);

        foreach ($tareas as $tarea) {
            $tempInicio = explode('/', $tarea['fechainicio']);
            $tempdatetimeInicio = new DateTime($tempInicio[2] . $tempInicio[1] . $tempInicio[0] . ' ' . $tarea['horainicio']);

            $tempFin = explode('/', $tarea['fechafin']);
            $tempdatetimeFin = new DateTime($tempFin[2] . $tempFin[1] . $tempFin[0] . ' ' . $tarea['horafin']);

            if ($tempdatetimeInicio < $datetimeInicio) {
                $datetimeInicio = $tempdatetimeInicio;
            }
            if ($tempdatetimeFin > $datetimeFin) {
                $datetimeFin = $tempdatetimeFin;
            }
        }

        //convirtiendo fecha a timestamp
        $tiempoInicio = $datetimeInicio->getTimestamp();
        $tiempoFin = $datetimeFin->getTimestamp();

        //obteniendo duracion estimada
        $tiempoDuracion = $tiempoFin - $tiempoInicio;
        $duracion = $tiempoDuracion / 60;
        return $duracion;
    }

    function obtenerTareas($elementos)
    {
        $tareas = array();
        foreach ($elementos as $elemento) {
            if ($elemento->tipo == 8 || $elemento->tipo == 9) {
                //es una plantilla o un hito
                CmpgestionarplantillaModel::getTareas($elemento->idelemento, $tareas);
            } else {
                if ($elemento->tipo == 10 && $elemento->hoja == 'false') {
                    //es una tarea padre
                    CmpgestionarplantillaModel::getTareas($elemento->idelemento, $tareas);
                    $tempo = (array)$elemento;
                    $tareas[] = $tempo;
                } else {
                    if ($elemento->tipo == 10) {
                        //es una tarea
                        $tempo = (array)$elemento;
                        $tareas[] = $tempo;
                    }
                }
            }
        }
        return $tareas;
    }

    public function getTareasEjercicio($idejercicio)
    {
        $tareas = DatEjerciciotarea::getTareasEjercicio($idejercicio);
        return $tareas;
    }

}
