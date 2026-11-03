<?php

/**
 * @author    Julio
 * @version   3.0.0
 * @copyright XETID, ERP-CUBA
 */
class CmpgestionarincidenciasModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function AdicionarIncidencias($parametros, $idusuario)
    {
        $datelemento = new DatElementos();
        $comprobar = $datelemento->ObtenerDenominacionIncidencia($parametros->denominacion, 5);

        if (count($comprobar) == 0) {
           // print_r("mierda entre aki");die;
            $datelemento->idusuariocrea = $idusuario;
            $datelemento->idtipoelemento = 5;
            $datelemento->activo = 1;
            $datelemento->denelemento = $parametros->denominacion;
            $datelemento->descelemento = $parametros->descripcion;
            $datelemento->save();
            //$objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $objDatIncidencia = new DatIncidencia();
            $objDatElementosNomNomenclador = new DatElementosNomNomenclador();
            //para insertar el impacto de la incidencia en DatIncidencia
            $objDatIncidencia->idincidencia = $datelemento->idelemento;
            $objDatIncidencia->impacto = $parametros->impacto;
            $objDatIncidencia->save();
            //para insertar el tipo de  incidencia en DatElementosNomNomenclador
           // print_r(" El tipo incidencia es :" + $parametros->tipo);die;
//            if ($parametros->tipo == 0) {
//               // print_r("mierda entre aki");die;
//                $objDatElementosNomNomenclador->idelemento
//                    = $datelemento->idelemento;
////                $objDatElementosNomNomenclador->idnomenclador
////                    = $parametros->tipo;
//                $objDatElementosNomNomenclador->tiponomenclador = 6;
//                $objDatElementosNomNomenclador->save();
//            }
            //print_r("tip ed incidencia : " +$parametros->tipo);die;
            if ($parametros->tipo) {

                $objDatElementosNomNomenclador->idelemento
                    = $datelemento->idelemento;
                $objDatElementosNomNomenclador->idnomenclador
                    = $parametros->tipo; //(int)$tipo1;
                $objDatElementosNomNomenclador->tiponomenclador = 6;
                $objDatElementosNomNomenclador->save();
            }
            if ($parametros->desviacion != "") {
                //$objDatElementosDatElementos = new DatElementosDatElementos();
                $porciones = explode("m", $parametros->desviacion);
                $ultimo = explode(",", $porciones[0]);

                for ($i = 0; $i < count($ultimo); $i++) {
                    DatElementosDatElementos::InsertarelementoDadoIdpadreehijo(
                        $ultimo[$i], $datelemento->idelemento, 1, $idusuario
                    );
                }
            }
            if (isset($parametros->involucrados)) {
                foreach ($parametros->involucrados as $involucrados) {
                    if ($involucrados->nombretipo == 'Grupo') {
                        $objDatGrupoIncidencia = new DatGrupoIncidencia();
                        $objDatGrupoIncidencia->idincidencia
                            = $datelemento->idelemento;
                        $objDatGrupoIncidencia->idgrupo
                            = $involucrados->idgrupo;
                        $objDatGrupoIncidencia->save();
                    } else {
                        if ($involucrados->nombretipo == 'Usuario') {
                            $objDatUsuarioIncidencia = new DatUsuarioIncidencia(
                            );
                            $objDatUsuarioIncidencia->idincidencia
                                = $datelemento->idelemento;
                            $objDatUsuarioIncidencia->idusuario
                                = $involucrados->idusuario;
                            $objDatUsuarioIncidencia->save();
                        } else {
                            if ($involucrados->nombretipo == 'Estructura') {
                                $objDatEstructuraIncidencia
                                    = new DatEstructuraIncidencia();
                                $objDatEstructuraIncidencia->idincidencia
                                    = $datelemento->idelemento;
                                $objDatEstructuraIncidencia->idestructura
                                    = $involucrados->idusuario;
                                $objDatEstructuraIncidencia->save();
                            }
                        }
                    }
                }
            }
            //asociar una desviaci�n a una incidencia
            return $datelemento->activo;
        } else {
            return 0;
        }
    }

    public function InsertarRelacionIncidenciaDesviacion(
        $parametros, $idusuario
    ) {
        DatElementosDatElementos::EliminarAsociacion($parametros->idelemento);
        foreach ($parametros->desviacion as $value) {
            DatElementosDatElementos::InsertarelementoDadoIdpadreehijo(
                $value, $parametros->idelemento, 1, $idusuario
            );
        }
        return 1;
    }

    public function modificarincidencia($parametros, $idusuario)
    {
        $datelemento = new DatElementos();
        $comprobar = $datelemento->ObtenerDenominacionIncidencia($parametros->denominacion, 5);

        if (count($comprobar) == 0 || $comprobar[0]['idelemento'] == $parametros->idelemento) {
            $datelemento = Doctrine::getTable('DatElementos')->find($parametros->idelemento);
            //$datelemento = new DatElementos();
            $datelemento->idusuariocrea = $idusuario;
            $datelemento->idtipoelemento = 5;
            $datelemento->activo = 1;
            $datelemento->denelemento = $parametros->denominacion;
            if (isset($parametros->descripcion)) {
                $datelemento->descelemento = $parametros->descripcion;
            }
            $datelemento->save();
            if (isset($parametros->impacto)) {
                $objDatIncidencia = Doctrine::getTable('DatIncidencia')->find($parametros->idelemento );
                $objDatIncidencia->idincidencia = $datelemento->idelemento;
                $objDatIncidencia->impacto = $parametros->impacto;
                $objDatIncidencia->save();
            }
            if ($parametros->tipo) {
                DatElementosNomNomenclador::ActualizarElemNom( $datelemento->idelemento, 6, $parametros->tipo);
            }
            DatElementosDatElementos::EliminarAsociacion($datelemento->idelemento );
            if ($parametros->desviacion != "") {
                $porciones = explode("m", $parametros->desviacion);
                $ultimo = explode(",", $porciones[0]);
                for ($i = 0; $i < count($ultimo); $i++) {
                    DatElementosDatElementos::InsertarelementoDadoIdpadreehijo(
                        $ultimo[$i], $datelemento->idelemento, 1, $idusuario
                    );
                }
            }
            if (isset($parametros->involucrados)) {
                $this->DespublicarIncidencia($datelemento->idelemento);
                if (isset($parametros->involucrados)) {
                    foreach ($parametros->involucrados as $involucrados) {
                        if ($involucrados->nombretipo == 'Grupo') {
                           // print_r("entre aki");die;
                            $objDatGrupoIncidencia = new DatGrupoIncidencia();
                            $objDatGrupoIncidencia->idincidencia
                                = $datelemento->idelemento;
                            $objDatGrupoIncidencia->idgrupo
                                = $involucrados->idgrupo;
                            $objDatGrupoIncidencia->save();
                        }
                        if ($involucrados->nombretipo == 'Usuario') {

                                $objDatUsuarioIncidencia
                                    = new DatUsuarioIncidencia();
                                $objDatUsuarioIncidencia->idincidencia
                                    = $datelemento->idelemento;
                                $objDatUsuarioIncidencia->idusuario
                                    = $involucrados->idusuario;
                                $objDatUsuarioIncidencia->save();
                        }
                        if ($involucrados->nombretipo == 'Estructura') {
                                    $objDatEstructuraIncidencia
                                        = new DatEstructuraIncidencia();
                                    $objDatEstructuraIncidencia->idincidencia
                                        = $datelemento->idelemento;
                                    $objDatEstructuraIncidencia->idestructura
                                        = $involucrados->idusuario;
                                    $objDatEstructuraIncidencia->save();
                        }


                    }
                }
            }
            /*
              $objDatElementosNomNomenclador ->idelemento=$datelemento->idelemento;
              $objDatElementosNomNomenclador ->idnomenclador=$parametros->tipo;
              // $objDatElementosNomNomenclador ->tiponomenclador=6;
              $objDatElementosNomNomenclador->save();
             */
            return 1;
        } else {
            return 0;
        }
    }

    public function CargarIDIncidencias($parametros)
    {
        $cont = 0;
        $arreglodeincidencias = array();
        $usuario = new DatUsuarioIncidencia();
        $usserIncidencia = new DatIncidencia();
        $grupo = new DatGrupoIncidencia();
        $array = $usuario->getByusuario($parametros->idusuario);
        $parametros->tipo = 5;
        $arrayelemento = $usserIncidencia->getIncidencias($parametros);

        foreach ($arrayelemento as $key => $idincidencias) {
            $arreglodeincidencias[$cont] = $idincidencias['idelemento'];
            $cont++;
        }
        foreach ($array as $key => $idincidencias) {
            $arreglodeincidencias[$cont] = $idincidencias[0];
            $cont++;
        }
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $parametros->idusuario
        );
        foreach ($arraygrupos as $key => $grupos) {
            $arrayIncidencias = $grupo->getBygrupo($grupos['idgrupo']);
            foreach ($arrayIncidencias as $incidencias) {
                if (!in_array($incidencias[0], $arreglodeincidencias)) {
                    $arreglodeincidencias[$cont] = $incidencias[0];
                    $cont++;
                }
            }
        }
        $resultado = array_unique($arreglodeincidencias);
        return $resultado;
    }

    public function cargarIncid($parametros)
    {
        $objDatIncidencia = new DatIncidencia();
        $elEl = new DatElementosDatElementos();
        $incidencias = $objDatIncidencia->obtenerIncidencias($parametros);
        foreach ($incidencias['resultado'] as $key => $incid) {
            $desviaciones = $elEl->RetornarElementosDadoId(
                $incid['idincidencia']
            );
            $incidencias['resultado'][$key]['desviacion']
                = $desviaciones;
        }
        return $incidencias;
    }

    public function EliminarIncidencias($parametros)
    {
        foreach (
            $parametros->arrayidincidencias as $idincidencia
        ) {
            $datelemento = Doctrine::getTable('DatElementos')->find(
                $idincidencia
            );
            if (isset($datelemento->idelemento)) {
                $datelemento->delete();
            }
            $datincidencia = Doctrine::getTable('DatIncidencia')->find(
                $idincidencia
            );
            if (isset($datincidencia->idincidencia)) {
                $datincidencia->delete();
            }
            DatElementosNomNomenclador::EliminarElemNom($idincidencia);
            DatElementosDatElementos::EliminarRelaciones($idincidencia);
        }
        return 1;
    }

    function cargardesviacionesAction()
    {
        ini_set("max_execution_time", 3600);
        $arraydesviaciones = array();
        $idusuario = $this->global->Perfil->idusuario;
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $arraydesviaciones = $objcmpgestionardesviaciones->listardesviaciones(
            $idusuario, 6
        );
        echo json_encode(
            array('success' => true, 'total' => $arraydesviaciones['total'],
                  'campos'  => $arraydesviaciones['resultado'])
        );
    }

    function PublicarDesviaciones($parametros)
    {
        if (isset($parametros->arrayidincidencias)
            && isset($parametros->arrayinvolucrados)
        ) {
            foreach ($parametros->arrayidincidencias as $idincidencias) {
                //self::DespublicarDesviacion($iddesviacion);
                foreach ($parametros->arrayinvolucrados as $involucrado) {
                    if ($involucrado->tipo == 0) {
                        $datGrupoIncidencia = Doctrine::getTable(
                            'DatGrupoIncidencia'
                        )->findByDql(
                            "idincidencia = '$idincidencias'
                                AND idgrupo = '$involucrado->idgrupo'"
                        );
                        if (!($datGrupoIncidencia[0]->idincidencia)) {
                            $objDatGrupoIncidencia = new DatGrupoIncidencia();
                            $objDatGrupoIncidencia->idincidencia
                                = $idincidencias;
                            $objDatGrupoIncidencia->idgrupo
                                = $involucrado->idgrupo;
                            $objDatGrupoIncidencia->save();
                        }
                    } else {
                        if ($involucrado->tipo == 1) {
                            $datUserIncidencia = Doctrine::getTable(
                                'DatUsuarioIncidencia'
                            )->findByDql(
                                "idincidencia = '$idincidencias'
                                    AND idusuario = '$involucrado->idusuario'"
                            );
                            if (!($datUserIncidencia[0]->idincidencia)) {
                                $objDatUsuarioIncidencia
                                    = new DatUsuarioIncidencia();
                                $objDatUsuarioIncidencia->idincidencia
                                    = $idincidencias;
                                $objDatUsuarioIncidencia->idusuario
                                    = $involucrado->idusuario;
                                $objDatUsuarioIncidencia->save();
                            }
                        } else {
                            if ($involucrado->tipo == 2) {
                                $datEstructIncidencia = Doctrine::getTable(
                                    'DatEstructuraIncidencia'
                                )->findByDql(
                                    "idincidencia = '$idincidencias'
                                        AND idestructura = '$involucrado->id'"
                                );
                                if (!($datEstructIncidencia[0]->idincidencia)) {
                                    $objDatEstructuraIncidencia
                                        = new DatEstructuraIncidencia();
                                    $objDatEstructuraIncidencia->idincidencia
                                        = $idincidencias;
                                    $objDatEstructuraIncidencia->idestructura
                                        = $involucrado->id;
                                    $objDatEstructuraIncidencia->save();
                                }
                            }
                        }
                    }
                }
            }
        }
        return 1;
    }

    public function DespublicarTodasIncidencias($parametros)
    {
        foreach ($parametros->arrayidincidencias as $idincidencias) {
            DatGrupoIncidencia::EliminarGrupoIncidencia($idincidencias);
            DatUsuarioIncidencia::EliminarUsuarioIncidencia($idincidencias);
            DatEstructuraIncidencia::EliminarEstructuraIncidencia(
                $idincidencias
            );
        }
        return 1;
    }

    public function DespublicarIncidencia($idincidencia)
    {
        DatGrupoIncidencia::EliminarGrupoIncidencia($idincidencia);
        DatUsuarioIncidencia::EliminarUsuarioIncidencia($idincidencia);
        DatEstructuraIncidencia::EliminarEstructuraIncidencia($idincidencia);
    }

    public function ObtenerIncidenciasAsociadasADesviacion($parametros)
    {
        $incidenciasAsociados = array();
        $incidenciasNoAsociados = array();
        $cont = 0;
        $incidenciasAsociadosTemp
            = DatElementosDatElementos::IDsDeIncidenciasAsociadas(
            $parametros->iddesviacion
        );
        if ($parametros->accion == 'noasociadas') {
            if (count($incidenciasAsociadosTemp) > 0) {
                for ($i = 0; $i < count($parametros->arrayIdIncidencias); $i++)
                {
                    for ($j = 0; $j < count($incidenciasAsociadosTemp); $j++) {
                        if ($incidenciasAsociadosTemp[$j]['idincidenciaasociada']
                            == $parametros->arrayIdIncidencias[$i]
                        ) {
                            break;
                        } else {
                            if ($j + 1 == count($incidenciasAsociadosTemp)) {
                                $incidenciasNoAsociados[$cont]
                                    = $parametros->arrayIdIncidencias[$i];
                                $cont++;
                            }
                        }
                    }
                }
                return $incidenciasNoAsociados;
            } else {
                return $parametros->arrayIdIncidencias;
            }
        } else {
            for ($i = 0; $i < count($parametros->arrayIdIncidencias); $i++) {
                if (($incidenciasAsociadosTemp[$i]['idincidenciaasociada'])) {
                    $incidenciasAsociados[$i]
                        = $incidenciasAsociadosTemp[$i]['idincidenciaasociada'];
                }
            }
            return $incidenciasAsociados;
        }
    }

    public function ActivarIncidencia($parametros)
    {
        foreach ($parametros->arrayidincidencias as $idincidencia) {
            $resultado = DatElementos::ActualizarActivosPorID(
                $idincidencia, $parametros->activo
            );
        }
        return $resultado;
    }

}
