<?php

/**
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarhitoModel extends ZendExt_Model {

    public function CmpgestionarhitoModel() {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para adicionar los hitos
     */
    public function adicionarHito($parametros) {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        if ($parametros->verificartiempoinvol) {
            $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
                    $parametros
            );
            if ($arrayInvolFondoTiempo) {
                $arrayInvolFondoTiempo['mensaje'] = 5;
                $arrayInvolFondoTiempo['fechafinact']
                        = $parametros->fechafin;
                return $arrayInvolFondoTiempo;
            }
        }

        //Hay que hacer lo de flujo de trabajo
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 9;
        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        $elemen = $objDatProyecto->adicionarElemento($parametros);
        $parametros->idElemen = $elemen[0]['idelemento'];
        //Add en dat hito
        $objDatHito = new DatHito();
        $objDatHito->idhito = $parametros->idElemen;

        //$objDatHito->duracionestimada = ($parametros->duracionE * 24) * 60;
        $objDatHito->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objDatHito->duracionestimada = round($parametros->duracionestimada);

        $objDatHito->plantilla = $parametros->plantilla;
        if ($parametros->fechainicio != '') {
            $objDatHito->fechainicio = $parametros->fechainicio;
            $objDatHito->fechafin = $parametros->fechafin;
            $objDatHito->duracionreal = $parametros->duracionR;
        }
        $objDatHito->save();
        //Add categoria del hito
        if ($parametros->idcategoria != '') {
            $parametros->tiponomenclador = 15;
            $objDatProyecto->adicionarNomenclador($parametros);
        }
        //Add relacion dat-elemen-dat-elemen
        $objDatProyecto->adicionarElemenElemen($parametros);
        //procedo a insertar los involucrados en el hito
        if (isset($parametros->arrayinvolucrados[0])) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                    $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
        }
        //procedo a insertar la estructura que crea
        if ($parametros->idEstructura) {
            $elemenEstrucCrea = new DatElementoEstructuraCrea();
            $elemenEstrucCrea->addElementoEstructuraCrea(
                    $parametros->idElemen, $parametros->idEstructura
            );
        }
        $procede = $parametros->idElemen;
        return $procede;
    }

    public function duplicarHito($params) {
        $plantilla = $params->plantilla;
        $params->porcientocump = '0';
        $insertadas = array();
        $idhito = self::adicionarHito($params);
        CmpgestionarplantillaModel::adicionarestructuraaproyecto(
                $params->idelemento, $idhito, $insertadas, $plantilla, null, $params
        );
        $tareasind = implode(',', $insertadas);
        foreach ($insertadas as $pos => $tarea) {
            $objTarea = Doctrine::getTable('DatTarea')->find($tarea);
            if ($objTarea->dependencias != 0) {
                $dependencias = explode(',', $objTarea->dependencias);
                foreach ($dependencias as $depend) {
                    $dm = Doctrine_Manager::getInstance();
                    $con = $dm->getCurrentConnection();
                    $elemDep = Doctrine::getTable('DatTarea')->findByDql(
                            "idtareadepende = {$depend} AND idtarea IN({$tareasind})"
                    );
                    $objGuardar = new DatElementosDatElementos();
                    $objGuardar->idelementopadre = $elemDep[0]->idtarea;
                    $objGuardar->idelementohijo = $tarea;
                    $objGuardar->idautor = $params->idautor;
                    $objGuardar->origen = 6;
                    $objGuardar->save();
                    $con->commit();
                    $con->beginTransaction();
                }
            }
        }
        $result['tareas'] = $insertadas;
        $result['idhito'] = $idhito;
        return $result;
    }

    /**
     * Funcion para modificar los hitos
     */
    public function modificarHito($parametros) {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        if ($parametros->verificartiempoinvol) {
            $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
                    $parametros
            );
            if ($arrayInvolFondoTiempo) {
                $arrayInvolFondoTiempo['mensaje'] = 5;
                $arrayInvolFondoTiempo['fechafinact']
                        = $parametros->fechafin;
                return $arrayInvolFondoTiempo;
            }
        }
        $respuesta = 0;
        $datproy = new DatProyecto();
        $objelemento = Doctrine::getTable('DatHito')
                ->find(
                $parametros->idelemento
        );
        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        $respuesta = $datproy->modificarElemento($parametros);
        if ($parametros->plantilla == 0) {
            $objelemento->fechainicio = $parametros->fechainicio;
            $objelemento->fechafin = $parametros->fechafin;
            $objelemento->duracionreal = $parametros->duracionR;
        }
        $parametros->tiponomenclador = 15;
        $parametros->idElemen = $parametros->idelemento;
        if ($parametros->idcategoria) {
            $datproy->modificarNomenclador($parametros);
        }
        //categoria hito
        //$objelemento->duracionestimada = ($parametros->duracionE * 24) * 60;
        $objelemento->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objelemento->duracionestimada = round($parametros->duracionestimada);

        $objelemento->save();
        //se relacionan los involucrados al elemento
        if (isset($parametros->arrayinvolucrados)) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                    $parametros->arrayinvolucrados, $parametros->idelemento, 9
            );
        }
        //se eliminan los involucrados al elemento
        if (isset($parametros->arrayinvolucradoseliminar)) {
            $this->pIntegrator->planpdo->eliminarUsuariosAElemento(
                    $parametros->arrayinvolucradoseliminar, $parametros->idelemento, 9
            );
        }
        return $respuesta;
    }

    public function verificarFondoTiempo($parametros) {
        $fechainicio = $parametros->fechainicio;
        $anno = explode('/', $fechainicio);
        $involucrados = array();
        $arrayInvol = $parametros->arrayinvolucrados;
        foreach ($arrayInvol as $involucrado) {
            if ($involucrado->tipo == 1) {
                $involucrados[] = $involucrado->idusuario;
            }
        }
        $arrayInvol = $this->pIntegrator->configuracionpdo->getFechaFin(
                $involucrados, $fechainicio, $parametros->duracionR, $anno[2]
        );
        if (isset($arrayInvol[0])) {
            foreach ($arrayInvol as $value => $key) {
                $fechaUser = strtotime(
                        str_replace('/', '-', $key['fechafin'])
                );
                $fechaAct = strtotime(
                        str_replace('/', '-', $parametros->fechafin)
                );
                if ($fechaUser <= $fechaAct) {
                    unset($arrayInvol[$value]);
                }
            }
            if (isset($arrayInvol[0])) {
                $result['involucrados'] = $arrayInvol;
                return $result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}