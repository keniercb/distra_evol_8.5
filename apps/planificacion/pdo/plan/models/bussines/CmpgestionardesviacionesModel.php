<?php

/**
 * @author    Julio
 * @version   3.0.0
 * @copyright XETID, ERP-CUBA
 */
class CmpgestionardesviacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function AdicionarDesviaciones($parametros, $idusuario)
    {

        $datelementocomprobado = new DatElementos();
        $comprobarDenom = $datelementocomprobado->ObtenerDenominacionIncidencia($parametros->denominacion, 6);

        if ($parametros->accion == 'modificar') {
            if (count($comprobarDenom) != 0 && $comprobarDenom[0]['idelemento'] != $parametros->idelemento) {
                return 0;
            }
            $datelemento = Doctrine::getTable('DatElementos')->find($parametros->idelemento);
        } else {
            if (count($comprobarDenom) != 0) {
                return 0;
            }
            $datelemento = new DatElementos();
        }

        $datelemento->idusuariocrea = $idusuario;
        $datelemento->idtipoelemento = 6;
        $datelemento->activo = 1;
        $datelemento->denelemento = $parametros->denominacion;
        $datelemento->descelemento = $parametros->descripcion;
        $datelemento->save();


        if ($parametros->accion == 'modificar') {
                $objDatDesviacion = Doctrine::getTable('DatDesviacion')->find( $parametros->idelemento);

                if (isset($parametros->impacto)) {
                    $objDatDesviacion->iddesviacion = $datelemento->idelemento;
                    $objDatDesviacion->impacto = $parametros->impacto;
                    $objDatDesviacion->save();
                  //  print_r("entre aki modificando impacto");die;
            }
        }
        if ($parametros->accion == 'adicionar') {
            //para insertar el impacto de la desviacion en DatDesviacion
            $objDatDesviacion = new DatDesviacion();
            $objDatDesviacion->iddesviacion =  $datelemento->idelemento;
            $objDatDesviacion->impacto = $parametros->impacto;
            $objDatDesviacion->save();
        }

        //if ($parametros->tipodesviacion) {

        if ($parametros->accion == 'modificar') {
            if( $parametros->tipodesviacion) {
                $objDatElementosNomNomenclador = Doctrine::getTable
                        ('DatElementosNomNomenclador' )->findByDql
                         ("idelemento = '$parametros->idelemento'");
                //para insertar el tipo de desviacion en DatElementosNomNomenclador
                $objDatElementosNomNomenclador[0]->idelemento
                    = $datelemento->idelemento;
                $objDatElementosNomNomenclador[0]->idnomenclador
                    = $parametros->tipodesviacion;
                $objDatElementosNomNomenclador[0]->tiponomenclador = 10;
                $objDatElementosNomNomenclador[0]->save();
            }
        }
        if ($parametros->accion == 'adicionar') {

           if( $parametros->tipodesviacion) {
              // print_r("entre aki mierdaa");die;
               $objDatElementosNomNomenclador = new DatElementosNomNomenclador( );
               $objDatElementosNomNomenclador->idelemento
                   = $datelemento->idelemento;
               $objDatElementosNomNomenclador->idnomenclador
                   = $parametros->tipodesviacion;
               $objDatElementosNomNomenclador->tiponomenclador = 10;
               $objDatElementosNomNomenclador->save();
           }

            }
       // }

        if ($parametros->accion == 'modificar') {
            $this->DesasociarIncidenciaDesviacion($parametros->idelemento);
        }
        if ($parametros->incidenciasasociadas) {
            foreach ($parametros->incidenciasasociadas as $incidenciaasociada) {
                if ($parametros->accion == 'modificar') {
                    $objDatElementosDatElementos = new DatElementosDatElementos(
                    );
                    $objDatElementosDatElementos->idelementopadre
                        = $datelemento->idelemento;
                    $objDatElementosDatElementos->idelementohijo
                        = $incidenciaasociada;
                    $objDatElementosDatElementos->idautor = $idusuario;
                    $datelementoincid = Doctrine::getTable('DatElementos')
                        ->findByDql("idelemento = '$incidenciaasociada' AND idusuariocrea = '$idusuario'" );
                    if (($datelementoincid[0]->idelemento)) {
                        $objDatElementosDatElementos->origen = 1;
                    } else {
                        $objDatElementosDatElementos->origen = 3;
                    }
                    $objDatElementosDatElementos->save();
                }
                else {
                    $objDatElementosDatElementos = new DatElementosDatElementos(
                    );
                    $objDatElementosDatElementos->idelementopadre
                        = $datelemento->idelemento;
                    $objDatElementosDatElementos->idelementohijo
                        = $incidenciaasociada;
                    $objDatElementosDatElementos->idautor = $idusuario;
                    $datelementoincid = Doctrine::getTable('DatElementos')
                        ->findByDql(
                            "idelemento = '$incidenciaasociada' AND idusuariocrea = '$idusuario'"
                        );
                    if (($datelementoincid[0]->idelemento)) {
                        $objDatElementosDatElementos->origen = 1;
                    } else {
                        $objDatElementosDatElementos->origen = 3;
                    }
                    $objDatElementosDatElementos->save();
                }
            }
        }

        if ($parametros->accion == 'modificar') {
            if (isset($parametros->arrayinvolucrados)) {
                $this->DespublicarDesviacion($datelemento->idelemento);
            }
        }

        if (isset($parametros->arrayinvolucrados)) {
            foreach ($parametros->arrayinvolucrados as $involucrado) {

                if ($involucrado->nombretipo == 'Grupo') {
                    $objDatGrupoDesviacion = new DatGrupoDesviacion();
                    $objDatGrupoDesviacion->iddesviacion
                        = $datelemento->idelemento;
                    $objDatGrupoDesviacion->idgrupo = $involucrado->idgrupo;
                    $objDatGrupoDesviacion->save();
                    $this->PublicarElementosContenidoEnGrupo(
                        $involucrado->idgrupo, $datelemento->idelemento
                    );
                } else {
                    if ($involucrado->nombretipo == 'Usuario') {
                        $objDatUsuarioDesviacion = new DatUsuarioDesviacion();
                        $objDatUsuarioDesviacion->iddesviacion
                            = $datelemento->idelemento;
                        $objDatUsuarioDesviacion->idusuario
                            = $involucrado->idusuario;
                        $objDatUsuarioDesviacion->save();
                    } else {
                        if ($involucrado->nombretipo == 'Estructura') {
                            $objDatEstructuraDesviacion
                                = new DatEstructuraDesviacion();
                            $objDatEstructuraDesviacion->iddesviacion
                                = $datelemento->idelemento;
                            $objDatEstructuraDesviacion->idestructura
                                = $involucrado->idusuario;
                            $objDatEstructuraDesviacion->save();
                        }
                    }
                }
            }
        }

        if ($parametros->accion == 'modificar') {
            if ($parametros->arrayidplanes || $parametros->arrayidobjetivos || $parametros->arrayidactividades            ) {
                DatElementosDatElementos::EliminarAsosiacionDesviacionElementos(
                    $datelemento->idelemento
                );
            }
        }

        if ($parametros->arrayidplanes) {
            //idtipoelemento = 0;
            foreach ($parametros->arrayidplanes as $idplan) {
                $objDatElementosDatElementos = new DatElementosDatElementos();
                $objDatElementosDatElementos->idelementopadre
                    = $datelemento->idelemento;
                $objDatElementosDatElementos->idelementohijo = $idplan;
                $objDatElementosDatElementos->idautor = $idusuario;
                $datelementoplan = Doctrine::getTable('DatElementos')
                    ->findByDql(
                        "idelemento = '$idplan' AND idusuariocrea = '$idusuario'"
                    );
                if (($datelementoplan[0]->idelemento)) {
                    $objDatElementosDatElementos->origen = 1;
                } else {
                    $objDatElementosDatElementos->origen = 3;
                }
                $objDatElementosDatElementos->save();
            }
        }

        if ($parametros->arrayidobjetivos) {
            //idtipoelemento = 1;
            foreach ($parametros->arrayidobjetivos as $idobjetivo) {
                $objDatElementosDatElementos = new DatElementosDatElementos();
                $objDatElementosDatElementos->idelementopadre
                    = $datelemento->idelemento;
                $objDatElementosDatElementos->idelementohijo = $idobjetivo;
                $objDatElementosDatElementos->idautor = $idusuario;
                $datelementoobjetivo = Doctrine::getTable('DatElementos')
                    ->findByDql(
                        "idelemento = '$idobjetivo' AND idusuariocrea = '$idusuario'"
                    );
                if (($datelementoobjetivo[0]->idelemento)) {
                    $objDatElementosDatElementos->origen = 1;
                } else {
                    $objDatElementosDatElementos->origen = 3;
                }
                $objDatElementosDatElementos->save();
            }
        }

        if ($parametros->arrayidactividades) {
            //idtipoelemento = 3;
            foreach ($parametros->arrayidactividades as $idactividad) {
                $objDatElementosDatElementos = new DatElementosDatElementos();
                $objDatElementosDatElementos->idelementopadre
                    = $datelemento->idelemento;
                $objDatElementosDatElementos->idelementohijo = $idactividad;
                $objDatElementosDatElementos->idautor = $idusuario;
                $datelementoactividad = Doctrine::getTable('DatElementos')
                    ->findByDql(
                        "idelemento = '$idactividad' AND idusuariocrea = '$idusuario'"
                    );
                if (($datelementoactividad[0]->idelemento)) {
                    $objDatElementosDatElementos->origen = 1;
                } else {
                    $objDatElementosDatElementos->origen = 3;
                }
                $objDatElementosDatElementos->save();
            }
        }

        return $datelemento->activo;
    }


    public function listarcomboincidencias($idusuario, $tipoelemento)
    {
        $arrayIncidencias = array();
        // $cont = 0;
        $arrayIncidencias = DatElementos::ObtenerIncidencias(
            $idusuario, $tipoelemento
        );
        return $arrayIncidencias;
    }

    public function listardesviaciones($idusuario, $tipoelemento, $parametros)
    {
        $arraydesviaciones = array();

        $desviaciones = DatElementos::ObtenerDesviaciones(
            $idusuario, $tipoelemento, $parametros
        );
        $arraydesviaciones['total'] = count($desviaciones);
        if (($parametros->accion)) {
            $arrayDesviacionesTemp = array();
            $arrayIdDesvAsociada = array();
            $cont = 0;
            $arrayIdDesvAsociada
                = DatElementosDatElementos::IDsDeDesviacionAsociadasAIncidenciaDada(
                $parametros->idincidencia
            );

            if (count($arrayIdDesvAsociada) != 0) {
                for ($i = 0; $i < count($desviaciones); $i++) {
                    for ($j = 0; $j < count($arrayIdDesvAsociada); $j++) {
                        if ($desviaciones[$i]['idelemento']
                            == $arrayIdDesvAsociada[$j]['iddesviacion']
                        ) {
                            if ($parametros->accion == 'asociadas') {
                                $arrayDesviacionesTemp[$cont]
                                    = $desviaciones[$i];
                                $cont++;
                            } else {
                                break;
                            }
                        } else {
                            if ($j + 1 == count($arrayIdDesvAsociada)
                                && $parametros->accion == 'noasociadas'
                            ) {
                                $desviacion = $datelemento = Doctrine::getTable(
                                    'DatElementos'
                                )->find($desviaciones[$i]['idelemento']);
                                if ($desviacion->activo == 1) {
                                    $arrayDesviacionesTemp[$cont]
                                        = $desviaciones[$i];
                                    $cont++;
                                }
                                /* $arrayDesviacionesTemp[$cont] = $desviaciones[$i];
                                  $cont++; */
                            }
                        }
                    }
                }
                $desviaciones = $arrayDesviacionesTemp;
            } else {
                if ($parametros->accion == 'asociadas') {
                    $desviaciones = array();
                } else {
                    for ($i = 0; $i < count($desviaciones); $i++) {
                        $desviacion
                            =
                        $datelemento = Doctrine::getTable('DatElementos')->find(
                            $desviaciones[$i]['idelemento']
                        );
                        if ($desviacion->activo == 1) {
                            $arrayDesviacionesTemp[$cont] = $desviaciones[$i];
                            $cont++;
                        }
                    }
                    $desviaciones = $arrayDesviacionesTemp;
                }
            }
        }

        $arraydesviacionesFiltradas = array();
        $contador = 0;
        foreach ($desviaciones as $pos => $desviacion) {

            if (isset($parametros->filtros[0])) {

                $arraydesviaciones['resultado'][$pos]['idelemento']
                    = $desviacion['idelemento'];
                $arraydesviaciones['resultado'][$pos]['denominacion']
                    = $desviacion['denelemento'];
                $nomdesviacion
                    = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                    $desviacion['idtipodesviacion']
                );
                $denomdesviacion = $nomdesviacion[0]['dennomenclador'];
                $arraydesviaciones['resultado'][$pos]['tipodesviacion']
                    = $denomdesviacion;
                $cantasociados
                    = DatElementosDatElementos::ContarElementosRelacionados(
                    $desviacion['idelemento']
                );
                $arraydesviaciones['resultado'][$pos]['asociados']
                    = $cantasociados[0]['cantasociados'];
                $cantdocafectados
                    = DatElementosDatElementos::ContarDocumentosAfectados(
                    $desviacion['idelemento']
                );
                $arraydesviaciones['resultado'][$pos]['cantdocafectados']
                    = $cantdocafectados[0]['cantdocafectados'];
                $arraydesviaciones['resultado'][$pos]['impacto']
                    = $desviacion['impacto'];
                $arraydesviaciones['resultado'][$pos]['publico']
                    = self::EsPublica($desviacion['idelemento']);
                $arraydesviaciones['resultado'][$pos]['activo']
                    = $desviacion['activo'];
                $arraydesviaciones['resultado'][$pos]['idtipoelemento']
                    = $desviacion['idtipoelemento'];
                $arraydesviaciones['resultado'][$pos]['idautor']
                    = $desviacion['idusuariocrea'];
                $arraydesviaciones['resultado'][$pos]['autor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $desviacion['idusuariocrea'], 'usuario', null
                );

                $superior = 0;
                $subordinado = 1;
                if ($desviacion['idusuariocrea'] != $idusuario) {
                    $superior = 1;
                    $subordinado
                        = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                        $idusuario, $desviacion['idusuariocrea']
                    );
                }
                $arraydesviaciones['resultado'][$pos]['superior'] = $superior;
                $arraydesviaciones['resultado'][$pos]['subordinado']
                    = $subordinado;

                $bandera = false;
                $publico = 0;
                // $cantIncAsc = 0;
                foreach ($parametros->filtros as $filtro) {

                    if ($filtro ['field'] == 'publico') {
                        if ($filtro ['data'] ['value'] == 'Si') {
                            $publico = 1;
                        } else {
                            $publico = 0;
                        }
                        if ($arraydesviaciones['resultado'][$pos]['publico']
                            == $publico
                        ) {
                            $bandera = true;
                        }
                    } elseif ($filtro ['field'] == 'autor') {
                        $autor = strtoupper(
                            $arraydesviaciones['resultado'][$pos]['autor']
                        );
                        $autorFiltro = strtoupper($filtro ['data'] ['value']);
                        $resultado = strpos($autor, $autorFiltro);
                        if ($resultado !== false) {
                            $bandera = true;
                        } else {
                            $bandera = false;
                            break;
                        }
                    } elseif ($filtro['field'] == 'asociados') {
                        if ($filtro['data']['comparison'] == 'gt') {
                            if ($filtro['data']['value']
                                >= $cantasociados[0]['cantasociados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                        if ($filtro['data']['comparison'] == 'lt') {
                            if ($filtro['data']['value']
                                <= $cantasociados[0]['cantasociados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                        if ($filtro['data']['comparison'] == 'eq') {
                            if ($filtro['data']['value']
                                == $cantasociados[0]['cantasociados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                    } elseif ($filtro['field'] == 'cantdocafectados') {
                        if ($filtro['data']['comparison'] == 'gt') {
                            if ($filtro['data']['value']
                                >= $cantdocafectados[0]['cantdocafectados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                        if ($filtro['data']['comparison'] == 'lt') {
                            if ($filtro['data']['value']
                                <= $cantdocafectados[0]['cantdocafectados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                        if ($filtro['data']['comparison'] == 'eq') {
                            if ($filtro['data']['value']
                                == $cantdocafectados[0]['cantdocafectados']
                            ) {
                                $bandera = true;
                            } else {
                                $bandera = false;
                                break;
                            }
                        }
                    } else {
                        $bandera = true;
                    }
                }
                if ($bandera) {
                    $arraydesviacionesFiltradas['resultado'][$contador]
                        = $arraydesviaciones['resultado'][$pos];
                    $contador++;
                }
            } else {
                $arraydesviaciones['resultado'][$pos]['idelemento']
                    = $desviacion['idelemento'];
                $arraydesviaciones['resultado'][$pos]['denominacion']
                    = $desviacion['denelemento'];
                $nomdesviacion
                    = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                    $desviacion['idtipodesviacion']
                );
                $denomdesviacion = $nomdesviacion[0]['dennomenclador'];
                $arraydesviaciones['resultado'][$pos]['tipodesviacion']
                    = $denomdesviacion;
                $cantasociados
                    = DatElementosDatElementos::ContarElementosRelacionados(
                    $desviacion['idelemento']
                );
                $arraydesviaciones['resultado'][$pos]['asociados']
                    = $cantasociados[0]['cantasociados'];
                $cantdocafectados
                    = DatElementosDatElementos::ContarDocumentosAfectados(
                    $desviacion['idelemento']
                );
                $arraydesviaciones['resultado'][$pos]['cantdocafectados']
                    = $cantdocafectados[0]['cantdocafectados'];
                $arraydesviaciones['resultado'][$pos]['impacto']
                    = $desviacion['impacto'];
                $arraydesviaciones['resultado'][$pos]['publico']
                    = self::EsPublica($desviacion['idelemento']);
                $arraydesviaciones['resultado'][$pos]['activo']
                    = $desviacion['activo'];
                $arraydesviaciones['resultado'][$pos]['idtipoelemento']
                    = $desviacion['idtipoelemento'];
                $arraydesviaciones['resultado'][$pos]['idautor']
                    = $desviacion['idusuariocrea'];
                $arraydesviaciones['resultado'][$pos]['autor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $desviacion['idusuariocrea'], 'usuario', null
                );

                $superior = 0;
                $subordinado = 1;
                if ($desviacion['idusuariocrea'] != $idusuario) {
                    $superior = 1;
                    $subordinado
                        = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                        $idusuario, $desviacion['idusuariocrea']
                    );
                }
                $arraydesviaciones['resultado'][$pos]['superior'] = $superior;
                $arraydesviaciones['resultado'][$pos]['subordinado']
                    = $subordinado;
            }
        }
        //print_r($arraydesviaciones);die;
        if (isset($parametros->filtros[0])) {
            return $arraydesviacionesFiltradas;
        } else {
            return $arraydesviaciones;
        }
    }

    public function verificardesviacion(
        $idusuario, $tipoelemento, $iddesviacion
    ) {
        $arraydesviaciones = array();
        $desviaciones = DatElementos::VerificarDesviacion(
            $idusuario, $tipoelemento, $iddesviacion
        );
        foreach ($desviaciones as $pos => $desviacion) {
            $arraydesviaciones['resultado'][$pos]['idelemento']
                = $desviacion['idelemento'];
            $arraydesviaciones['resultado'][$pos]['denominacion']
                = $desviacion['denelemento'];
            $arraydesviaciones['resultado'][$pos]['descripcion']
                = $desviacion['descelemento'];
            $nomdesviacion
                = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                $desviacion['idtipodesviacion']
            );
            $denomdesviacion = $nomdesviacion[0]['dennomenclador'];
            $arraydesviaciones['resultado'][$pos]['tipodesviacion']
                = $desviacion['idtipodesviacion'];
            $arraydesviaciones['resultado'][$pos]['denomtipodesviacion']
                = $denomdesviacion;

            $idelemento = $desviacion['idelemento'];
            $datElementosDatElementos = Doctrine::getTable(
                'DatElementosDatElementos'
            )->findByDql("idelementopadre = '$idelemento'");
            if (($datElementosDatElementos[0]->idelementopadre)) {
                $cantasociados
                    = DatElementosDatElementos::ContarElementosRelacionados(
                    $desviacion['idelemento']
                );
                $incidenciasasociados
                    = DatElementosDatElementos::IDsDeIncidenciasAsociadas(
                    $desviacion['idelemento']
                );
                for ($i = 0; $i < count($incidenciasasociados); $i++) {
                    $arraydesviaciones['resultado'][$pos]['incidenciasasociadas'][$i]
                        = $incidenciasasociados[$i]['idincidenciaasociada'];
                }
            }
            $arraydesviaciones['resultado'][$pos]['asociados']
                = $cantasociados[0]['cantasociados'];
            $arraydesviaciones['resultado'][$pos]['impacto']
                = $desviacion['impacto'];
            $arraydesviaciones['resultado'][$pos]['publico'] = self::EsPublica(
                $desviacion['idelemento']
            );
            $arraydesviaciones['resultado'][$pos]['activo']
                = $desviacion['activo'];
            $arraydesviaciones['resultado'][$pos]['autor']
                = $this->integrator->seguridad->nombreUsuario(
                $desviacion['idusuariocrea']
            );
            $parametros->idelemento = $iddesviacion;
            $arraydocafectados = $this->CargarDocumentosAfectados($parametros);
            $arraydesviaciones['resultado'][$pos]['arraydocafectados']
                = $arraydocafectados['resultado'];
        }
        //print_r($arraydesviaciones);die;
        return $arraydesviaciones;
    }

    public function EliminarDesviaciones($parametros)
    {
        foreach ($parametros->arrayiddesviaciones as $iddesviacion) {
            $datelemento = Doctrine::getTable('DatElementos')->find(
                $iddesviacion
            );
            if (isset($datelemento->idelemento)) {
                $datelemento->delete();
            }

            $datdesviacion = Doctrine::getTable('DatDesviacion')->find(
                $iddesviacion
            );
            if (isset($datdesviacion->iddesviacion)) {
                $datdesviacion->delete();
            }

            DatElementosNomNomenclador::EliminarElemNom($iddesviacion);
            DatElementosDatElementos::EliminarRelaciones($iddesviacion);
        }
        return 1;
    }

    public function EsPublica($idelemento)
    {
        $espublica = 0;
        $datGrupoDesviacion = Doctrine::getTable('DatGrupoDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        $datUserDesviacion = Doctrine::getTable('DatUsuarioDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        $datEstructDesviacion = Doctrine::getTable('DatEstructuraDesviacion')
            ->findByDql("iddesviacion = '$idelemento'");
        //print_r($datGrupoDesviacion[0]->iddesviacion);
        if (($datGrupoDesviacion[0]->iddesviacion)
            || ($datUserDesviacion[0]->iddesviacion)
            || ($datEstructDesviacion[0]->iddesviacion)
        ) {
            $espublica = 1;
        }
        return $espublica;
    }

    public function PublicarDesviaciones($parametros)
    {
        if (isset($parametros->arrayiddesviaciones[0])
            && isset($parametros->arrayinvolucrados[0])
        ) {
            foreach ($parametros->arrayiddesviaciones as $iddesviacion) {
                //self::DespublicarDesviacion($iddesviacion);                
                foreach ($parametros->arrayinvolucrados as $involucrado) {

                    if ($involucrado->tipo == 0 && isset($involucrado->tipo)) {
                        $datGrupoDesviacion = Doctrine::getTable(
                            'DatGrupoDesviacion'
                        )->findByDql(
                            "iddesviacion = '$iddesviacion' AND idgrupo = '$involucrado->idgrupo'"
                        );
                        if (!($datGrupoDesviacion[0]->iddesviacion)) {
                            $objDatGrupoDesviacion = new DatGrupoDesviacion();
                            $objDatGrupoDesviacion->iddesviacion
                                = $iddesviacion;
                            $objDatGrupoDesviacion->idgrupo
                                = $involucrado->idgrupo;
                            $objDatGrupoDesviacion->save();
                            $this->PublicarElementosContenidoEnGrupo(
                                $involucrado->idgrupo, $iddesviacion
                            );
                        }
                    } else {
                        if ($involucrado->tipo == 1) {
                            $datUserDesviacion = Doctrine::getTable(
                                'DatUsuarioDesviacion'
                            )->findByDql(
                                "iddesviacion = '$iddesviacion' AND idusuario = '$involucrado->idusuario'"
                            );
                            if (!($datUserDesviacion[0]->iddesviacion)) {
                                $objDatUsuarioDesviacion
                                    = new DatUsuarioDesviacion();
                                $objDatUsuarioDesviacion->iddesviacion
                                    = $iddesviacion;
                                $objDatUsuarioDesviacion->idusuario
                                    = $involucrado->idusuario;
                                $objDatUsuarioDesviacion->save();
                            }
                        } else {
                            if ($involucrado->tipo == 2) {
                                $datEstructDesviacion = Doctrine::getTable(
                                    'DatEstructuraDesviacion'
                                )->findByDql(
                                    "iddesviacion = '$iddesviacion' AND idestructura = '$involucrado->id'"
                                );
                                if (!($datEstructDesviacion[0]->iddesviacion)) {
                                    $objDatEstructuraDesviacion
                                        = new DatEstructuraDesviacion();
                                    $objDatEstructuraDesviacion->iddesviacion
                                        = $iddesviacion;
                                    $objDatEstructuraDesviacion->idestructura
                                        = $involucrado->id;
                                    $objDatEstructuraDesviacion->save();
                                }
                            }
                        }
                    }
                }
            }
        }
        return 1;
    }

    public function PublicarElementosContenidoEnGrupo($idgrupo, $iddesviacion)
    {

        $arrayElementosContenidoEnGrupo
            = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupoGU(
            $idgrupo
        );

        foreach ($arrayElementosContenidoEnGrupo as $elemento) {
            if ($elemento['idestructura']) {
                $idestructura = $elemento['idestructura'];
                $datEstructDesviacion = Doctrine::getTable(
                    'DatEstructuraDesviacion'
                )->findByDql(
                    "iddesviacion = '$iddesviacion' AND idestructura = '$idestructura'"
                );
                if (!($datEstructDesviacion[0]->iddesviacion)) {
                    $objDatEstructuraDesviacion = new DatEstructuraDesviacion();
                    $objDatEstructuraDesviacion->iddesviacion = $iddesviacion;
                    $objDatEstructuraDesviacion->idestructura = $idestructura;
                    $objDatEstructuraDesviacion->save();
                }
            } else {
                if ($elemento['idusuario']) {
                    $idusuario = $elemento['idusuario'];
                    $datUserDesviacion = Doctrine::getTable(
                        'DatUsuarioDesviacion'
                    )->findByDql(
                        "iddesviacion = '$iddesviacion' AND idusuario = '$idusuario'"
                    );
                    if (!($datUserDesviacion[0]->iddesviacion)) {
                        $objDatUsuarioDesviacion = new DatUsuarioDesviacion();
                        $objDatUsuarioDesviacion->iddesviacion = $iddesviacion;
                        $objDatUsuarioDesviacion->idusuario = $idusuario;
                        $objDatUsuarioDesviacion->save();
                    }
                }
            }
        }
    }

    public function DespublicarDesviacion($iddesviacion)
    {
        DatGrupoDesviacion::EliminarGrupoDesviacion($iddesviacion);
        DatUsuarioDesviacion::EliminarUsuarioDesviacion($iddesviacion);
        DatEstructuraDesviacion::EliminarEstructuraDesviacion($iddesviacion);
    }

    public function DespublicarTodasDesviaciones($parametros)
    {
        foreach ($parametros->arrayiddesviaciones as $iddesviacion) {
            DatGrupoDesviacion::EliminarGrupoDesviacion($iddesviacion);
            DatUsuarioDesviacion::EliminarUsuarioDesviacion($iddesviacion);
            DatEstructuraDesviacion::EliminarEstructuraDesviacion(
                $iddesviacion
            );
        }
        return 1;
    }

    public function DesasociarIncidenciaDesviacion($iddesviacion)
    {
        DatElementosDatElementos::EliminarDesviacionRelacionada($iddesviacion);
    }

    public function AsociarIncidenciaDesviacion($parametros, $idusuario)
    {
        $this->DesasociarIncidenciaDesviacion($parametros->iddesviacion);
        foreach ($parametros->arrayIdincidencias as $idincidencia) {

            $objDatElementosDatElementos = new DatElementosDatElementos();
            $objDatElementosDatElementos->idelementopadre
                = $parametros->iddesviacion;
            $objDatElementosDatElementos->idelementohijo = $idincidencia;
            $objDatElementosDatElementos->idautor = $idusuario;
            $datelementoincid = Doctrine::getTable('DatElementos')->findByDql(
                "idelemento = '$idincidencia' AND idusuariocrea = '$idusuario'"
            );
            if (($datelementoincid[0]->idelemento)) {
                $objDatElementosDatElementos->origen = 1;
            } else {
                $objDatElementosDatElementos->origen = 3;
            }
            $objDatElementosDatElementos->save();
        }

        return 1;
    }

    public function RelacionarElementoConDesviacion($parametros, $idusuario)
    {

        foreach ($parametros->arrayDesviaciones as $iddesviacion) {

            $datElementosDatElementos = Doctrine::getTable(
                'DatElementosDatElementos'
            )->findByDql(
                "idelementopadre = '$iddesviacion'
                    AND idelementohijo = '$parametros->idelemenArelacionar'"
            );
            if (!($datElementosDatElementos[0]->idelementopadre)) {
                $objDatElementosDatElementos = new DatElementosDatElementos();
                $objDatElementosDatElementos->idelementopadre = $iddesviacion;
                $objDatElementosDatElementos->idelementohijo
                    = $parametros->idelemenArelacionar;
                $objDatElementosDatElementos->idautor = $idusuario;
                $datelementoincid = Doctrine::getTable('DatElementos')
                    ->findByDql(
                        "idelemento = '$parametros->idelemenArelacionar' AND idusuariocrea = '$idusuario'"
                    );
                if (($datelementoincid[0]->idelemento)) {
                    $objDatElementosDatElementos->origen = 1;
                } else {
                    $objDatElementosDatElementos->origen = 3;
                }
                $objDatElementosDatElementos->save();
            }
        }

        return 1;
    }

    public function CargarDocumentosAfectados($parametros)
    {
        $arraydesviaciones['resultado'] = array();

        if ($parametros->asociadasAplanes) {
            $documentos
                = DatElementosDatElementos::ObtenerDesviacionesAsociadasAplanes(
                $parametros->idelemento
            );
        } else {
            $documentos = DatElementosDatElementos::ObtenerDocumentosAfectados(
                $parametros->idelemento
            );
        }
        foreach ($documentos as $pos => $documento) {
            $arraydesviaciones['resultado'][$pos]['idelemento']
                = $documento['idelemento'];
            $arraydesviaciones['resultado'][$pos]['denominacion']
                = $documento['denelemento'];
            $arraydesviaciones['resultado'][$pos]['idtipoelemento']
                = $documento['idtipoelemento'];
            if ($documento['idtipoelemento'] == 0) {
                $documento['tipoelemento'] = 'Plan';
            } elseif ($documento['idtipoelemento'] == 1) {
                $documento['tipoelemento'] = 'Objetivo';
            } elseif ($documento['idtipoelemento'] == 3) {
                $documento['tipoelemento'] = 'Actividad';
            } elseif ($documento['idtipoelemento'] == 6) {
                $documento['tipoelemento'] = 'desviaci&oacute;n';
            }
            $arraydesviaciones['resultado'][$pos]['tipoelemento']
                = $documento['tipoelemento'];
            $arraydesviaciones['resultado'][$pos]['autor']
                = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                $documento['idusuariocrea'], 'usuario', null
            );
            /* $this->integrator->seguridad->nombreUsuario(
              $documento['idusuariocrea']); */
        }
        return $arraydesviaciones;
    }

    public function ActivarDesactivarDesviacion($parametros)
    {
        foreach ($parametros->arraydesviacion as $iddesviacion) {
            $datelemento = Doctrine::getTable('DatElementos')->find(
                $iddesviacion
            );
            if (isset ($datelemento->idelemento)) {
                $datelemento->activo = $parametros->activo;
                $datelemento->save();
            }
        }
        return 1;
    }

}
