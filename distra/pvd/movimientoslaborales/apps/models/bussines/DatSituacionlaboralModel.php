<?php

/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/05/16
 * Time: 9:48
 */
class DatSituacionlaboralModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function getSituacionLaboral($filtro, $idestructura, $idcargo, $inicio, $limite, $activo, $idconcepto, $fibaja, $ffbaja, $est, $mot, $filtros) {
        try {
            $idcargos = Array();
            $obj = new DatSituacionlaboral();
            if (!empty($idcargo)) {
                array_push($idcargos, $idcargo);
                $idestructura = null;
            } else if (!empty($idestructura)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true, false);
                if (count($cargos) > 0 || !empty($idconcepto)) {
                    $idcargos = array_column($cargos, 'idcargo');
                }
            } else {
                $idestructura = null;
            }

            if (!empty($idcargos)) {
                $datos = $obj->getSituacionByIdCargo(
                        $filtro, $idestructura, $idcargos, $inicio, $limite,
                        $activo, $idconcepto, $fibaja, $ffbaja, $est, $mot, $filtros
                );

                // Filtrar por año si se proporciona
                if (!empty($ano)) {
                    $datos = array_filter($datos, function ($dato) use ($ano) {
                        $fdesde = DateTime::createFromFormat('d/m/Y', $dato['fdesde']);
                        $fhasta = DateTime::createFromFormat('d/m/Y', $dato['fhasta']);

                        return $fdesde->format('Y') == $ano || $fhasta->format('Y') == $ano;
                    });
                }

                // Filtrar por rango de fechas si se proporcionan
                if (!empty($fibaja) && !empty($ffbaja)) {
                    // Agregar logs para depurar el filtrado de datos
                    error_log("Filtrando por rango de fechas: Desde $fibaja Hasta $ffbaja");
                    $datos = array_filter($datos, function ($dato) use ($fibaja, $ffbaja) {
                        $fdesde = DateTime::createFromFormat('d/m/Y', $dato['fdesde']);
                        $fhasta = DateTime::createFromFormat('d/m/Y', $dato['fhasta']);
                        $inicio = DateTime::createFromFormat('d/m/Y', $fibaja);
                        $fin = DateTime::createFromFormat('d/m/Y', $ffbaja);

                        return $fdesde >= $inicio && $fhasta <= $fin;
                    });
                    error_log("Datos después de filtrar por rango de fechas: " . json_encode($datos));
                }

                // Log de depuración para verificar parámetros
                error_log("Parámetros recibidos en getSituacionLaboral: " . json_encode([
                    'fibaja' => $fibaja,
                    'ffbaja' => $ffbaja,
                    'ano' => $ano,
                    'filtro' => $filtro,
                    'idestructura' => $idestructura,
                    'idcargo' => $idcargo,
                    'activo' => $activo,
                    'idconcepto' => $idconcepto,
                    'est' => $est,
                    'mot' => $mot
                ]));

                // Log de depuración para verificar datos antes del filtrado
                error_log("Datos antes del filtrado: " . json_encode($datos));

                $result = new stdClass();
                $result->cantidad = count($datos);
                $result->datos = $this->completarDatos($datos);
            } else {
                $result = new stdClass();
                $result->cantidad = 0;
                $result->datos = [];
            }

            // Log de depuración para verificar datos después del filtrado
            error_log("Datos después del filtrado: " . json_encode($datos));

            // Agregar mensajes de depuración a la respuesta
            $debugInfo = [
                'parametros_recibidos' => [
                    'fibaja' => $fibaja,
                    'ffbaja' => $ffbaja,
                    'ano' => $ano,
                    'filtro' => $filtro,
                    'idestructura' => $idestructura,
                    'idcargo' => $idcargo,
                    'activo' => $activo,
                    'idconcepto' => $idconcepto,
                    'est' => $est,
                    'mot' => $mot
                ],
                'datos_antes_filtrado' => $datos,
                'datos_despues_filtrado' => isset($result) ? $result->datos : []
            ];

            // Incluir los mensajes de depuración en el resultado final
            $result->debug = $debugInfo;

            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function completarDatos($datos) {
        foreach ($datos as $k => $dato) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dato['identidad']);
            $datos[$k]['entidad'] = $entidad[0]->denominacion;
            unset($entidad);
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dato['idarea']);
            $datos[$k]['area'] = $area[0]->denominacion;
            unset($area);
            if (!empty($dato['ueb'])) {
                $ueb = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dato['ueb']);
                $datos[$k]['ueb'] = $ueb[0]->denominacion;
                $datos[$k]['entidad_area'] = $datos[$k]['entidad'] . '->' . $ueb[0]->denominacion . '->' .
                        $datos[$k]['area'];
                unset($ueb);
            } else {
                $datos[$k]['entidad_area'] = $datos[$k]['entidad'] . '->' . $datos[$k]['area'];
            }
        }
        return $datos;
    }

    public function ordenarInfoByCargo(array $orden, array $datos) {
        $result = Array();
        $pos = count($datos);
        foreach ($orden as $val) {
            foreach ($datos as $obj) {
                if ($val == $obj['idcargo']) {
                    array_push($result, $obj);
                    $result[count($result) - 1]['orden'] = $pos;
                    $pos--;
                }
            }
        }
        return $result;
    }

    private function addupdSituacionLab($datosSit, $idsituacionlaboralp) {
        if (isset($idsituacionlaboralp)) {
            $objsit = DatSituacionlaboral::getById($idsituacionlaboralp);
        } else {
            $objsit = new DatSituacionlaboral();
        }
        if (isset($datosSit->idpersonaentidad)) {
            $objsit->idpersonaentidad = $datosSit->idpersonaentidad;
        }
        $objsit->idcargo = (empty($datosSit->idcargo)) ? null : $datosSit->idcargo;
        $objsit->idsituacion = (empty($datosSit->idsituacion)) ? null : $datosSit->idsituacion;
        $objsit->fdesde = (empty($datosSit->fdesde)) ? null : $datosSit->fdesde;
        $objsit->fhasta = (empty($datosSit->fhasta)) ? null : $datosSit->fhasta;
        $objsit->noalta = (empty($datosSit->noalta)) ? null : $datosSit->noalta;
        $objsit->idtipocontrato = (empty($datosSit->idtipocontrato)) ? null : $datosSit->idtipocontrato;
        $objsit->idarea = (empty($datosSit->idarea)) ? null : $datosSit->idarea;
        $objsit->ueb = (empty($datosSit->ueb)) ? null : $datosSit->ueb;
        $objsit->principal = (empty($datosSit->principal)) ? 0 : $datosSit->principal;
        $objsit->idprogramalaboral = (empty($datosSit->idprograma)) ? null : $datosSit->idprograma;
        $objsit->idespcargo = (empty($datosSit->idespcargo)) ? null : $datosSit->idespcargo;
        $objsit->idmodalidadempleo = (empty($datosSit->idmodalidadempleo)) ? null : $datosSit->idmodalidadempleo;
        $objsit->idmotivo = (empty($datosSit->idmotivomovimiento)) ? null : $datosSit->idmotivomovimiento;
        $objsit->funciones = (empty($datosSit->funciones)) ? null : $datosSit->funciones;
        if (!empty($datosSit->nromn)) {
            $objsit->nromn = $datosSit->nromn;
        }
        $objsit->save();
        return $objsit->idsituacionlaboralp;
    }

    public function darAlta($datosSit) {
        try {
            $respuesta = new stdClass();
            $objSitLab = new DatSituacionlaboral();
            $existeCargoMismaNaturaleza = Array();
            if ($datosSit->idcargo) {
                $existeCargoMismaNaturaleza = $objSitLab->existePersonaCargoMismaNaturaleza(
                        $datosSit->idpersona, $datosSit->idcargo
                );
            }
            if (count($existeCargoMismaNaturaleza) == 0) {
                $existe = $objSitLab->existeConSitLaboralyEntidad($datosSit->idpersona, $datosSit->identidad,
                        $datosSit->idsituacion);
                if (count($existe) == 0) {
                    $existeprincipal = $objSitLab->existeConOcupacionPrincipalEntidad($datosSit->idpersona,
                            $datosSit->identidad);
                    if (count($existeprincipal) > 0 && $datosSit->principal == 1) {
                        $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($existeprincipal[0]['idarea']);
                        $respuesta->area = $area[0]->denominacion;
                        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($existeprincipal[0]['idcargo']);
                        $respuesta->cargo = $cargo[0]['denominacion'];
                        $respuesta->error = -2;
                    } else {
                        $idpersonaentidad = DatPersonaentidadModel::addPersonaEnt(
                                        $datosSit->idpersona, $datosSit->idprocedenciasocial, $datosSit->identidad,
                                        $datosSit->fdesde, $datosSit->fhasta
                        );
                        $datosSit->idpersonaentidad = $idpersonaentidad;
                        $idsituacionlaboralp = $this->addupdSituacionLab($datosSit);
                        if ($datosSit->idcargo) {
                            $cantByCargo = $objSitLab->getCantPersonaCargo(array($datosSit->idcargo));
                            if ($cantByCargo != -1 && $datosSit->idcargo) {
                                ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($datosSit->idcargo, $cantByCargo);
                            }
                        }
                        if ($datosSit->idcandidato != '') {
                            $objSitLab->setEstadoCndidato($datosSit->idcandidato);
                        }
                        $respuesta->idsituacionlaboralp = $idsituacionlaboralp;
                    }
                } else {
                    $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($existe[0]['idarea']);
                    $respuesta->area = $area[0]->denominacion;
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($existe[0]['idcargo']);
                    $respuesta->cargo = $cargo[0]['denominacion'];
                    $respuesta->error = -4;
                }
            } else {
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($existeCargoMismaNaturaleza[0]['idarea']);
                $respuesta->area = $area[0]->denominacion;
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($existeCargoMismaNaturaleza[0]['idcargo']);
                $respuesta->cargo = $cargo[0]['denominacion'];
                $respuesta->error = -3;
            }
            return $respuesta;
        } catch (Exception $e) {
            return false;
        }
    }

    public function setAlta($datosSit) {
        try {
            $objSitLab = new DatSituacionlaboral();
            $objsit = $objSitLab->getById($datosSit->idsituacionlaboralp);
            $objPersEntidad = new DatPersonaentidad();
            $objpe = $objPersEntidad->getById($objsit->idpersonaentidad);
            $objpe->idprocedenciasocial = $datosSit->idprocedenciasocial;
            $objpe->identidad = $datosSit->identidad;
            $sl = $objSitLab->getSitLabByPersonaEntidad($objsit->idpersonaentidad);
            if ($objsit->fdesde == $objpe->fdesde) {
                $objpe->fdesde = $datosSit->fdesde;
            }
            if (count($sl) == 1) {
                $objpe->fhasta = (empty($datosSit->fhasta)) ? null : $datosSit->fhasta;
            } else {
                if ($objpe->fhasta != null) {
                    if ($datosSit->fhasta == '' || $this->compararFechas($datosSit->fhasta, $objpe->fhasta) == 1) {
                        $objpe->fhasta = (empty($datosSit->fhasta)) ? null : $datosSit->fhasta;
                    }
                }
            }
            $objpe->save();
            $existe = $objSitLab->existeConSitLaboralyEntidad(
                    $objpe->idpersona, $objpe->identidad, $datosSit->idsituacion
            );
            if (
                    (count($existe) > 0 && $existe[0]['idsituacionlaboralp'] == $datosSit->idsituacionlaboralp) || count($existe) == 0
            ) {
                $existeprincipal = $objSitLab->existeConOcupacionPrincipalEntidad(
                        $objpe->idpersona, $objpe->identidad
                );
                if (
                        count($existeprincipal) > 0 && $datosSit->principal == 1 &&
                        $existeprincipal[0]['idsituacionlaboralp'] != $datosSit->idsituacionlaboralp
                ) {
                    return -2;
                } else {
                    $cargoviejo = $objsit->idcargo;
                    $idsituacionlaboralp = $this->addupdSituacionLab($datosSit, $datosSit->idsituacionlaboralp);
                    if (!empty($cargoviejo)) {
                        $cantByCargov = $objSitLab->getCantPersonaCargo(array($cargoviejo));
                        if ($cantByCargov != -1) {
                            ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($cargoviejo, $cantByCargov);
                        }
                    }
                    if (!empty($datosSit->idcargo)) {
                        $cantByCargon = $objSitLab->getCantPersonaCargo(array($datosSit->idcargo));
                        if ($cantByCargon != -1) {
                            ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($datosSit->idcargo, $cantByCargon);
                        }
                    }
                    return $idsituacionlaboralp;
                }
            } else {
                return -4;
            }
        } catch (Exception $e) {
            echo($e->getMessage());
            return false;
        }
    }

    private function tieneMedios($idpersona) {
        try {
            $tiene = false;
            //$tiene = $this->integrator->activos_fijos->existePersonaConMedios($idpersona);
            return $tiene;
        } catch (Exception $e) {
            return false;
        }
    }

    public function realizarMovimiento($datosSit) {
        try {
            $objSitLab = new DatSituacionlaboral();
            $objsit = $objSitLab->getById($datosSit->idsituacionlaboralp);
            $objPersEntidad = new DatPersonaentidad();
            $objpe = $objPersEntidad->getById($objsit->idpersonaentidad);
            //Si la persona tiene medios no se puede mover para un area diferente
            if ($objsit->idarea != $datosSit->idarea) {
                $tienemedios = $this->tieneMedios($objpe->idpersona);
                if ($tienemedios == true) {
                    return -1;
                }
            }
            $objsit->idmotivo = (empty($datosSit->idmotivomovimiento)) ? null : $datosSit->idmotivomovimiento;
            $objsit->estado = ($objsit->idcargo == $datosSit->idcargo) ? 3 : 1;
            $objsit->fhasta = $datosSit->fdesde;
            $objsit->funciones = (empty($datosSit->funciones)) ? null : $datosSit->funciones;
            //Buscar el numero del movimiento de nomina
            $nromnom = MovimientonominaModel::getNumeroConsecutivo((empty($datosSit->ueb)) ? $objpe->identidad : $datosSit->ueb);
            $now = explode('/', date('d/m/Y'));
            $nromn = (!empty($nromnom['nro']) && $now[2] == $nromnom['anno']) ? $nromnom['nro'] + 1 : 1;
            MovimientonominaModel::addupdNumeroConsecutivo(
                    (empty($datosSit->ueb)) ? $objpe->identidad : $datosSit->ueb, $nromn, $now[2], ($nromnom['nro']) ? 0 : 1
            );
            $datosSit->nromn = $nromn;

            if ($objsit->ueb == $datosSit->ueb) {
                $objsit->nromn = $datosSit->nromn;
            } else {
                $nromnomviejo = MovimientonominaModel::getNumeroConsecutivo((empty($objsit->ueb)) ? $objpe->identidad : $objsit->ueb);
                $nromnviejo = (!empty($nromnomviejo['nro']) && $now[2] == $nromnomviejo['anno']) ? $nromnomviejo['nro'] + 1 : 1;
                MovimientonominaModel::addupdNumeroConsecutivo(
                        (empty($objsit->ueb)) ? $objpe->identidad : $objsit->ueb, $nromnviejo, $now[2], ($nromnomviejo['nro']) ? 0 : 1
                );
                $objsit->nromn = $nromnviejo;
            }
            $objsit->save();


            $datosSit->idpersonaentidad = $objsit->idpersonaentidad;
            $datosSit->idarea = ($datosSit->idcargo == $objsit->idcargo) ? $objsit->idarea : $datosSit->idarea;
            $datosSit->principal = $objsit->principal;
            $idsitlabpnew = $this->addupdSituacionLab($datosSit);

            $sl = $objSitLab->getSitLabByPersonaEntidad($objsit->idpersonaentidad);
            if (count($sl) == 0) {
                $objpe->fhasta = (isset($datosSit->fhasta)) ? $datosSit->fhasta : null;
            } else {
                if (isset($objpe->fhasta)) {
                    if (empty($datosSit->fhasta) || $this->compararFechas($datosSit->fhasta, $objpe->fhasta) == 1) {
                        $objpe->fhasta = (!empty($datosSit->fhasta)) ? $datosSit->fhasta : null;
                    }
                }
            }
            $objpe->save();
            if ($objsit->idcargo) {
                $cantByCargov = $objSitLab->getCantPersonaCargo(array($objsit->idcargo));
                if ($cantByCargov != -1) {
                    ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($objsit->idcargo, $cantByCargov);
                }
            }
            $cantByCargon = $objSitLab->getCantPersonaCargo(array($datosSit->idcargo));
            if ($cantByCargon != -1) {
                ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($datosSit->idcargo, $cantByCargon);
            }
            $result = new stdClass();
            $result->idpersona = $objpe->idpersona;
            $result->identidad = $objpe->identidad;
            $result->idcargo = $datosSit->idcargo;
            $result->idsituacionlaboralpnueva = $idsitlabpnew;
            $result->idsituacionlaboralp = $idsitlabpnew;
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }

    public function darBaja($idsituacionlaboralp, $idmotivobaja, $fecha) {
        try {
            $objSitLab = new DatSituacionlaboral();
            $objsit = $objSitLab->getById($idsituacionlaboralp);
            $objmoventidad = DatPersonaentidad::getById($objsit->idpersonaentidad);
            //Si la persona tiene medios no se puede dar baja
            $tienemedios = $this->tieneMedios($objmoventidad->idpersona);
            if ($tienemedios == true) {
                return -1;
            }

            //Actualizar numero de movimiento de nomina
            $nromnom = MovimientonominaModel::getNumeroConsecutivo(
                            (empty($objsit->ueb)) ? $objmoventidad->identidad : $objsit->ueb
            );
            $now = explode('/', date('d/m/Y'));
            $nromn = (!empty($nromnom['nro']) && $now[2] == $nromnom['anno']) ? $nromnom['nro'] + 1 : 1;
            MovimientonominaModel::addupdNumeroConsecutivo(
                    (empty($objsit->ueb)) ? $objmoventidad->identidad : $objsit->ueb, $nromn, $now[2], ($nromnom['nro']) ? 0 : 1
            );
            $objsit->nromn = $nromn;
            $objsit->fhasta = $fecha;
            $objsit->idmotivo = $idmotivobaja;
            $objsit->estado = 2;
            $objsit->save();
            $sl = $objSitLab->getSitLabByPersonaEntidad($objsit->idpersonaentidad);
            if (count($sl) == 0) {
                $objmoventidad->fhasta = $fecha;
                $objmoventidad->save();
            }
            if (!empty($objsit->idcargo)) {
                $cantByCargo = $objSitLab->getCantPersonaCargo(array($objsit->idcargo));
                if ($cantByCargo >= 0) {
                    ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($objsit->idcargo, $cantByCargo);
                }
            }
            $result = new stdClass();
            $result->idpersona = $objmoventidad->idpersona;
            $result->identidad = $objmoventidad->identidad;
            $result->idcargo = $objsit->idcargo;
            $result->idsituacionlaboralp = $objsit->idsituacionlaboralp;
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteSituacionLaboral($idsituacionlaboralp) {
        try {
            $objSitLab = new DatSituacionlaboral();
            $objsit = $objSitLab->getById($idsituacionlaboralp);
            $objPersEntidad = new DatPersonaentidad();
            $objmoventidad = $objPersEntidad->getById($objsit->idpersonaentidad);
            $idcargo = $objsit->idcargo;
            $objSitLab->deleteSL($idsituacionlaboralp);
            $sl = $objSitLab->getSitLabByPersonaEntidad($objmoventidad->idpersonaentidad);
            if (count($sl) == 0) {
                $objmoventidad->delete();
            }
            if (!empty($idcargo)) {
                $cantByCargo = $objSitLab->getCantPersonaCargo(array($idcargo));
                if ($cantByCargo >= 0) {
                    ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($idcargo, $cantByCargo);
                }
            }
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getSituacionLabById($id) {
        try {
            $obj = new DatSituacionlaboral();
            $result = $obj->getSituacionLabById($id);
            $result = $result[0];
            $resultCargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($result['idcargo']);
            $result['cargo'] = $resultCargo[0]['denominacion'];
            $result['cantidad'] = $resultCargo[0]['cantidad'];
            $result['cantidadreal'] = $resultCargo[0]['cantidadreal'];
            $result['temporal'] = $resultCargo[0]['temporal'];
            $resultArea = ZendExt_IoC::getInstance()->metadatos->DameEstructura($result['idarea']);
            $result['area'] = $resultArea[0]->denominacion;
            $resultEntidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($result['identidad']);
            $result['entidad'] = $resultEntidad[0]->denominacion;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerCargoOficialPersona($idpersona, $principal) {
        try {
            $objOcupacion = new DatSituacionlaboral();
            return $objOcupacion->obtenerCargoOficialPersona($idpersona, $principal);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTrayectoriaLaboralPersona($idpersona) {
        try {
            $objOcupacion = new DatSituacionlaboral();
            return $objOcupacion->getTrayectoriaLaboralPersona($idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPersonasSinSituacion($filtro, $inicio, $limite, $numid, $nombre, $papel, $sapel) {
        try {
            $obj = new DatSituacionlaboral();
            $datos = $obj->getPersonasSinSituacion($filtro, $inicio, $limite, $numid, $nombre, $papel, $sapel);
            $cantidad = $obj->cantPersonasSinSituacion($filtro, $numid, $nombre, $papel, $sapel);
            foreach ($datos as $k => $sit) {
                $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['idcargo']);
                $datos[$k]['cargo'] = $cargo[0]->denominacion;
            }
            if ($cantidad == 0) {
                $datos = Array();
            }
            $result = new stdClass();
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function updateCompletamientoCargo(array $idcargo) {
        try {
            $objDomain = new DatSituacionlaboral();
            foreach ($idcargo as $v) {
                $cantByCargo = $objDomain->getCantPersonaCargo(array($v));
                if ($cantByCargo > 0) {
                    ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($v, $cantByCargo);
                } else {
                    ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($v, 0);
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getRegistroAltasBajas($idestructura, $idconcepto, $fdesde, $fhasta, $altaobaja) {
        try {
            // echo'<pre>';print_r($altaobaja);die;
            // $idestructura = $this->global->Estructura->idestructura;
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                $objSitLab = new DatSituacionlaboral();
                if ($altaobaja == 1) {
                    $datos = $objSitLab->getAltasByMes($fdesde, $fhasta, $idcargos);
                } elseif ($altaobaja == 2) {
                    $datos = $objSitLab->getBajasByMes($fdesde, $fhasta, $idcargos);
                } elseif ($altaobaja == 3) {
                    $altas = $objSitLab->getAltasByMes($fdesde, $fhasta, $idcargos);
                    $bajas = $objSitLab->getBajasByMes($fdesde, $fhasta, $idcargos);
                    $datos = array_merge($altas, $bajas);
                    // $datos = $objSitLab->getRegistroAltasBajas($idcargos, $idconcepto, $fdesde, $fhasta, $altaobaja);
                }
                // $datos = $objSitLab->getRegistroAltasBajas($idcargos, $idconcepto, $fdesde, $fhasta, $altaobaja);
            }
            $result = Array();
            $post = 0;
            //$datos = DatSituacionlaboralModel::ordenarInfoByCargo($idcargos, $datos);
            //echo'<pre>';print_r($datos);die;
            $arraypersonaentidad = Array();
            foreach ($datos as $k => $sit) {
                $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['idcargo']);
                $datos[$k]['cargo'] = $cargo[0]->denominacion;
                $esta = false;
                foreach ($result as $rs) {
                    if ($rs['idarea'] == $sit['idarea']) {
                        $esta = true;
                    }
                }
                if ($esta == false) {
                    $result[$post]['idarea'] = $sit['idarea'];
                    $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['idarea']);
                    $result[$post]['area'] = $area[0]->denominacion;
                    $posicion = 0;
                    foreach ($datos as $d) {
                        // if (!in_array($d['idpersonaentidad'], $arraypersonaentidad)) {
                        // array_push($arraypersonaentidad, $d['idpersonaentidad']);
                        if ($result[$post]['idarea'] == $d['idarea']) {
                            $result[$post]['datos'][$posicion] = $d;
                            if (empty($d['fhasta'])) {
                                $result[$post]['datos'][$posicion]['idmotivo'] = '';
                                $result[$post]['datos'][$posicion]['motivobaja'] = '';
                            }
                            $posicion++;
                        }
                        // }
                    }
                    $post++;
                }
            }
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function conformarElemSalRep(&$arrElemSal, $idpersona, &$arrCS, $ueb) {
        $arrES = array();
        foreach ($arrCS as $c) {
            $arrES[$c['idconceptosalarial']] = 0;
            if (array_key_exists($idpersona, $arrElemSal)) {
                $arrES[$c['idconceptosalarial']] += $arrElemSal[$idpersona][$c['idestructurarmodelonomina']];
            } else {
                if (!empty($ueb)) {
                    $arrIdsCS = array();
                    foreach ($arrCS as $cs) {
                        $arrIdsCS[] = $cs['idestructurarmodelonomina'];
                    }
                    $arrElemSal = ZendExt_IoC::getInstance()->pvd->obtenerDatosPagosAdicionalesCargoyPersona(
                            $ueb, array($idpersona), $arrIdsCS
                    );
                } else {
                    $arrES[$c['idconceptosalarial']] = 0;
                }
            }
        }
        return $arrES;
    }

    public function getRegistroAltas($idestructura, $idconcepto) {
        $result = Array();
        $objIoC = ZendExt_IoC::getInstance();
        try {
            $cargos = $objIoC->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = $this->getIdCargos($cargos);
                $objSilLab = new DatSituacionlaboral();
                $datos = $objSilLab->getRegistroAltas($idcargos, $idconcepto);
                if (count($datos) > 0) {
                    /* Busco la configuracion de los conceptos que van al reporte Registro de Trabajadores */
                    $objConfCS = new ConfConceptosalarialnomina();
                    $arrCS = $objConfCS->getConfigAll(1);
                    $arrIdsCS = array();
                    foreach ($arrCS as $cs) {
                        $arrIdsCS[] = $cs['idestructurarmodelonomina'];
                    }
                    $arrIdsPersonas = array();
                    $arrIdsCargos = array();
                    foreach ($datos as $d) {
                        if (!empty($d['idcargo'])) {
                            $arrIdsPersonas[] = $d['idpersona'];
                            $arrIdsCargos[] = $d['idcargo'];
                        }
                    }
                    $arrIdsCargos = array_unique($arrIdsCargos);
                    $cargos = $objIoC->metadatos->obtenerDatosCargo($arrIdsCargos);
                    $arrCargos = array();
                    foreach ($cargos as $c) {
                        $arrCargos[$c['idcargo']] = $c;
                    }
                    /* Busco los valores de los elementos salariales de la persona y el cargo que ocupa la persona */
                    $entidadcsn = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadXidcargo($arrIdsCargos[0]);
                    if (count($arrIdsCS) > 0) {
                        $arrElemSal = $objIoC->pvd->obtenerDatosPagosAdicionalesCargoyPersona(
                                $entidadcsn[0]['idestructura'], $arrIdsPersonas, $arrIdsCS
                        );
                    }

                    foreach ($datos as $a => $d) {
                        $cargo = $arrCargos[$d['idcargo']];
                        $area = $objIoC->metadatos->DameEstructura($d['idarea']);
                        $datos[$a]['area'] = $area[0]->denominacion;

                        //$neduc = ZendExt_IoC_Inter::getInstance()->persona->getNivelEduByPersona($d['idpersona']);
                        //$nivelprep = (isset($neduc[0]['neabr'])) ? $neduc[0]['neabr'] : $neduc[0]['niveleducacional'];
                        //$datos[$a]['preparacion'] = $nivelprep;
                        $nivelpreparacion = $objSilLab->getNivelPreparacionByCargo($d['idcargo']);
                        $datos[$a]['preparacion'] = $nivelpreparacion[0]['abreviatura'];

                        $datos[$a]['categoria'] = $cargo['categoria'];
                        $datos[$a]['escala'] = $cargo['salario'];
                        $datos[$a]['grupocomplejidad'] = $cargo['grupocomplejidad'];
                        $datos[$a]['cargo'] = ($cargo['denominacion'] == '') ? 'NO EXISTE' : $cargo['denominacion'];
                        if (count($arrIdsCS) > 0) {
                            $datos[$a]['salario'] = $this->conformarElemSalRep($arrElemSal, $d['idpersona'], $arrCS, $d['ueb']);
                        } else {
                            $datos[$a]['salario'] = Array();
                        }
                        $datos[$a]['total'] = $datos[$a]['escala'] + array_sum($datos[$a]['salario']);
                    }
                    $datos[$a]['total'] = round($datos[$a]['total'], 2);
                    $result = Array();
                    $post = 0;
                    $datos = $this->ordenarInfoByCargo($idcargos, $datos);
                    foreach ($datos as $sit) {
                        $esta = false;
                        foreach ($result as $rs) {
                            if ($rs['idarea'] == $sit['idarea']) {
                                $esta = true;
                            }
                        }
                        if ($esta == false) {
                            $result[$post]['idarea'] = $sit['idarea'];
                            $result[$post]['area'] = $sit['area'];
                            $posicion = 0;
                            foreach ($datos as $a => $d) {
                                if ($result[$post]['idarea'] == $d['idarea']) {
                                    $result[$post]['datos'][$posicion] = $d;
                                    $posicion++;
                                }
                            }
                            $post++;
                        }
                    }
                }
            }
            return $result;
        } catch (Exception $e) {
            return 2;
        }
    }

    private function compararFechas($primera, $segunda) {
        $valoresPrimera = explode("/", $primera);
        $valoresSegunda = explode("/", $segunda);
        $finicial = $valoresPrimera[2] . $valoresPrimera[1] . $valoresPrimera[0];
        $ffinal = $valoresSegunda[2] . $valoresSegunda[1] . $valoresSegunda[0];
        if ($finicial > $ffinal) {
            return 1;
        } else {
            return 0;
        }
    }

    public function getElaborado($idestructura) {
        $obj = new DatSituacionlaboral();
        return $obj->getElaborado($idestructura);
    }

    public function getAprobado($idestructura) {
        $obj = new DatSituacionlaboral();
        return $obj->getAprobado($idestructura);
    }

    public function getCompletamiento($concepto, $idestructura) {
        $objSitLab = new DatSituacionlaboral();
        $cantcubiertoi = 0;
        $cantcubiertod = 0;
        $cantplantilla = 0;
        if ($concepto == 7) {
            $cantcubiertoi = $objSitLab->getCantPersonaCargo(array($idestructura), 0);
            $cantcubiertod = $objSitLab->getCantPersonaCargo(array($idestructura), 1);
            $datcargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idestructura);
            $cantplantilla = $datcargo[0]['cantidad'];
        } else {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true, false);

            $arrIdsCargos = array_column($cargos, 'idcargo');
            unset($cargos);
            if (count($arrIdsCargos) > 0) {
                $datcargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arrIdsCargos);

                if (count($datcargo) > 0) {
                    foreach ($datcargo as $carg) {
                        $cantplantilla += $carg['cantidad'];
                    }
                    $cantcubiertoi = $objSitLab->getCantPersonaCargo($arrIdsCargos, 0);
                    $cantcubiertod = $objSitLab->getCantPersonaCargo($arrIdsCargos, 1);
                }
            }
        }
        $porciento = round(($cantcubiertoi + $cantcubiertod) * 100 / $cantplantilla, 2);
        $resultado = array($cantplantilla, $cantcubiertoi, $cantcubiertod, $cantcubiertoi + $cantcubiertod, $porciento);
        return $resultado;
    }

    public function getProblemasDetectados() {
        $idestructura = $this->global->Estructura->idestructura;
        $estructuras = array($idestructura);
        if ($idestructura != '') {
            $estructurasInternas = ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
            foreach ($estructurasInternas as $val) {
                array_push($estructuras, $val->id);
            }
            $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
            foreach ($entidades as $e) {
                array_push($estructuras, $e->idfila);
            }
        }
        $objSitLab = new DatSituacionlaboral();
        $resultado = Array();
        $perselim = $objSitLab->getSitConProblemas($estructuras);
        foreach ($perselim as $per) {
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($per['identidad']);
            $per['entidad'] = $entidad[0]->denominacion;
            array_push($resultado, $per);
        }
        return $resultado;
    }

    public function getAltasByMes($finicio, $ffin, $idestructura) {
        $resultado = Array();
        $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $resultado = $objSitLab->getAltasByMes($finicio, $ffin, $arrIdsCargos);
        }
        return $resultado;
    }

    public function getBajasByMes($finicio, $ffin) {
        $resultado = Array();
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $resultado = $objSitLab->getBajasByMes($finicio, $ffin, $arrIdsCargos);
        }
        return $resultado;
    }

    public function getMovByMes($finicio, $ffin) {
        $resultado = Array();
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $resultado = $objSitLab->getMovByMes($finicio, $ffin, $arrIdsCargos);
        }
        return $resultado;
    }

    public function getCantAltasByMes($finicio, $ffin) {
        $cantidades = Array();
        $meses = Array();
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $datos = $objSitLab->getCantAltasByMes($finicio, $ffin, $arrIdsCargos);
            foreach ($datos as $m) {
                array_push($cantidades, $m['cant']);
                $aux['mes'] = $m['mes'];
                $aux['year'] = $m['year'];
                array_push($meses, $aux);
            }
        }
        $resultado['meses'] = $meses;
        $resultado['cantidades'] = $cantidades;
        return $resultado;
    }

    public function getCantBajasByMes($finicio, $ffin) {
        $cantidades = Array();
        $meses = Array();
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $datos = $objSitLab->getCantBajasByMes($finicio, $ffin, $arrIdsCargos);
            foreach ($datos as $m) {
                array_push($cantidades, $m['cant']);
                $aux['mes'] = $m['mes'];
                $aux['year'] = $m['year'];
                array_push($meses, $aux);
            }
        }
        $resultado['meses'] = $meses;
        $resultado['cantidades'] = $cantidades;
        return $resultado;
    }

    public function getCantMovByMes($finicio, $ffin) {
        $cantidades = Array();
        $meses = Array();
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        if ($cargos) {
            $arrIdsCargos = $this->getIdCargos($cargos);
            $objSitLab = new DatSituacionlaboral();
            $datos = $objSitLab->getCantMovByMes($finicio, $ffin, $arrIdsCargos);
            foreach ($datos as $m) {
                array_push($cantidades, $m['cant']);
                $aux['mes'] = $m['mes'];
                $aux['year'] = $m['year'];
                array_push($meses, $aux);
            }
        }
        $resultado['meses'] = $meses;
        $resultado['cantidades'] = $cantidades;
        return $resultado;
    }

    public function arrayToString($array) {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }

    public function getTrabajadoresPorCategoria($idestructura) {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                $stringIdsCargos = $this->arrayToString($idcargos);
                $datosBasicos = DatSituacionlaboral::getTrabajadoresPorCategoria($stringIdsCargos);
            }
            $datos = array();
            $datos[0]['niveleducacional'] = 'Total';
            foreach ($datosBasicos as $v) {
                if (!empty($v['niveleducacional'])) {
                    $datos[0]['total'] += $v['total'];
                    $datos[0]['totalmujer'] += $v['totalmujer'];
                    $datos[0]['mayoresedadlaboral'] += $v['mayoresedadlaboral'];
                    $datos[0]['mayoresedadlaboralmujeres'] += $v['mayoresedadlaboralmujeres'];
                    $datos[0]['menoresedadlaboral'] += $v['menoresedadlaboral'];
                    $datos[0]['menoresedadlaboralmujeres'] += $v['menoresedadlaboralmujeres'];
                    $datos[0]['operarios'] += $v['operarios'];
                    $datos[0]['operariosmujer'] += $v['operariosmujer'];
                    $datos[0]['servicios'] += $v['servicios'];
                    $datos[0]['serviciosmujer'] += $v['serviciosmujer'];
                    $datos[0]['tecnicos'] += $v['tecnicos'];
                    $datos[0]['tecnicosmujer'] += $v['tecnicosmujer'];
                    $datos[0]['administrativos'] += $v['administrativos'];
                    $datos[0]['administrativosmujer'] += $v['administrativosmujer'];
                    $datos[0]['directivos'] += $v['directivos'];
                    $datos[0]['directivosmujer'] += $v['directivosmujer'];
                }
            }
            $llave = 1;
            foreach ($datosBasicos as $key => $value) {
                if (!empty($datosBasicos[$key]['niveleducacional'])) {
                    $datos[$llave] = $value;
                    $llave++;
                }
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTrabajadoresPorCategoriaPorMunicipio($idestructura) {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                $stringIdsCargos = $this->arrayToString($idcargos);
                $datosBasicos = DatSituacionlaboral::getTrabajadoresPorCategoriaPorMunicipio($stringIdsCargos);
            }
            $datos = array();
            $llave = 0;
            foreach ($datosBasicos as $key => $value) {
                if (!empty($datosBasicos[$key]['municipio'])) {
                    $datos[$llave] = $value;
                    $llave++;
                }
            }

            $sumaDatos = array();
            foreach ($datos as $k => $v) {
                $sumaDatos['total'] += $datos[$k]['total'];
                $sumaDatos['totalmujer'] += $v['totalmujer'];
                $sumaDatos['mayoresedadlaboral'] += $v['mayoresedadlaboral'];
                $sumaDatos['mayoresedadlaboralmujeres'] += $v['mayoresedadlaboralmujeres'];
                $sumaDatos['menoresedadlaboral'] += $v['menoresedadlaboral'];
                $sumaDatos['menoresedadlaboralmujeres'] += $v['menoresedadlaboralmujeres'];
                $sumaDatos['operarios'] += $v['operarios'];
                $sumaDatos['operariosmujer'] += $v['operariosmujer'];
                $sumaDatos['servicios'] += $v['servicios'];
                $sumaDatos['serviciosmujer'] += $v['serviciosmujer'];
                $sumaDatos['tecnicos'] += $v['tecnicos'];
                $sumaDatos['tecnicosmujer'] += $v['tecnicosmujer'];
                $sumaDatos['administrativos'] += $v['administrativos'];
                $sumaDatos['administrativosmujer'] += $v['administrativosmujer'];
                $sumaDatos['directivos'] += $v['directivos'];
                $sumaDatos['directivosmujer'] += $v['directivosmujer'];
            }

            $result = array();
            $result['datos'] = $datos;
            $result['sumadatos'] = $sumaDatos;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosCentroInformante($idestructura) {
        try {
            $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
            $centroInformante = array();
            $centroInformante['denominacion'] = $datosEstructura[0]->text;
            $centroInformante['codigo'] = $datosEstructura[0]->codigo;

            return $centroInformante;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getReportHist($idestructura, $idcategocup, $decisorios, $idfacultado, $finicio, $ffin) {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                $datos = DatSituacionlaboral::getReportCuad(
                                $idcargos, $idcategocup, $decisorios, $idfacultado, $finicio, $ffin
                );
                foreach ($datos as $h => $valor) {
                    $afil = DatReserva::getAfiliacionPolitica($valor['idpersona']);
                    $datos[$h]['militancia'] = (isset($afil[0]['abreviatura'])) ? $afil[0]['abreviatura'] : $afil[0]['denominacion'];
                }
            }
            $datos = $this->ordenarInfoByCargo($idcargos, $datos);
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getReportCuad($idestructura, $decisorios, $idfacultado) {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                $cat = DatSituacionlaboral::getCatOcup(1);
                $idc = Array();
                foreach ($cat as $c) {
                    array_push($idc, $c['idcategocup']);
                }
                $datos = DatSituacionlaboral::getReportCuad(
                                $idcargos, $idc, $decisorios, $idfacultado, null, null, 1
                );
                foreach ($datos as $h => $valor) {
                    $afil = DatReserva::getAfiliacionPolitica($valor['idpersona']);
                    $datos[$h]['militancia'] = (isset($afil[0]['abreviatura'])) ? $afil[0]['abreviatura'] :
                            $afil[0]['denominacion'];
                }
            }
            $datos = $this->ordenarInfoByCargo($idcargos, $datos);
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getIdCargos($arryCargos) {
        foreach ($arryCargos as $h => $carg) {
            $idcargos[$h] = $carg['idcargo'];
        }
        return $idcargos;
    }

    public function obtenerCargosPorPersonaEntidad($idpersona, $idestructura) {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idsCargos = $this->getIdCargos($cargos);
            }
            $obj = new DatSituacionlaboral();
            $datos = $obj->getSituacionByPersonaEntidad($idpersona, $idsCargos);
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerPersonasActivas($filtro, $inicio, $limite, $numid, $nombre, $papel, $sapel, $encargo) {
        try {
            $sitlab = new DatSituacionlaboral();
            $datos = $sitlab->obtenerPersonasActivas($filtro, $inicio, $limite, $numid, $nombre, $papel, $sapel, $encargo);
            $cantidad = $sitlab->cantPersonasActivas($filtro, $numid, $nombre, $papel, $sapel, $encargo);
            foreach ($datos as $k => $sit) {
                $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['idcargo']);
                $datos[$k]['cargo'] = $cargo[0]->denominacion;
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['idarea']);
                $datos[$k]['area'] = $area[0]->denominacion;
                $datos[$k]['orden'] = $area[0]->orden;
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($sit['identidad']);
                $datos[$k]['entidad'] = $entidad[0]->denominacion;
                $ea = ($entidad[0]->denominacion == '') ? '' : $entidad[0]->denominacion . '->' . $area[0]->denominacion;
                $datos[$k]['entidad_area'] = $ea;
            }
            if ($cantidad == 0) {
                $datos = Array();
            }
            $result = new stdClass();
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function updMotivo($idsituacionlaboralp, $idmotivo) {
        $obj = DatSituacionlaboral::getById($idsituacionlaboralp);
        $obj->idmotivo = $idmotivo;
        $obj->fmodmotivo = date('d/m/Y');
        $obj->save();
        return true;
    }

}
