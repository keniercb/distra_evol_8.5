<?php

class CierreModel extends ZendExt_Model {

    public function periodoActualSubsistema($identidad, $idsubsistema) {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        return $result[0]['idperiodoactual'];
    }

    public function ejercicioActualSubsistema($identidad, $idsubsistema) {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $result = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        return $result[0]['idejercicioactual'];
    }

    /**
     * Obtener los subsistemas activos de un per&iacute;odo determinado.
     *
     * @param enteropos $identidad Id estructura com&uacute;n.
     * @param enteropos $idperiodo Id per&iacute;odo.
     *
     * @return array Subsistemas de la entidad en un per&iacute;odo dado.
     */
    public function subsistemasPeriodo($identidad, $idperiodo) {
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructura($identidad);
        $result = array();
        foreach ($subsistemas as $sub) {
            if ($sub->idestado == 1) {
                $subSistemasCierre = DatCierre::BuscarCierreSubsistema($sub->idestructurasubsist);
                if ($subSistemasCierre[0]['idperiodoactual'] == $idperiodo) {
                    $sist = $this->integrator->datosmaestros->buscarSubsistemaPorId($sub->idsubsistema);
                    $result[] = $sist;
                }
            }
        }
        return $result;
    }

    public function subsistemasPeriodoSinCerrarContab($identidad, $idperiodo, $idsubsistema) {
        if (!$idsubsistema) {
            return array();
        }
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasPrecedentes($idsubsistema, $identidad);
        $result = array();
        foreach ($subsistemas as $sub) {
            if ($sub->idestado == 1 && $sub->cierra == 1) {
                $subSistemasCierre = DatCierre::BuscarCierreSubsistema($sub->idestructurasubsist);
                if ($subSistemasCierre[0]['idperiodoactual'] == $idperiodo) {
                    $sist = $this->integrator->datosmaestros->buscarSubsistemaPorId($sub->idsubsistema);
                    $result[] = $sist;
                }
            }
        }
        return $result;
    }

    public function subsistemasCierreEntidad($identidad) {
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructura($identidad);

        $result = array();
        foreach ($subsistemas as $sub) {
            if ($sub->idestado == 2) {
                $result[$sub->idestructurasubsist] = DatCierre::BuscarCierreSubsistema($sub->idestructurasubsist);
                //$result[$sub->idestructurasubsist]['denominacion'] = $sub->denominacion;
                $result[$sub->idestructurasubsist]['idsubsistema'] = $sub->idsubsistema;
            }
        }
        $periodoContabilidad = 0;

        foreach ($result as $res) {
            if ($res['idsubsistema'] == 4) {
                $periodoContabilidad = $res[0]['idperiodoactual'];
                break;
            }
        }

        foreach ($result as $r) {
            if (($r[0]['idperiodoactual'] == $periodoContabilidad) && $r['idsubsistema'] != 4) {
                return false;
            }
        }
        return true;
    }

    public function subsistemasEjercicio($identidad, $idejercicio) {
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructura($identidad);
        $res = array();
        foreach ($subsistemas as $sub) {
            if ($sub->idestado == 2) {
                $result = DatCierre::BuscarCierreSubsistema($sub->idestructurasubsist);
                if ($result[0]['idejercicioactual'] == $idejercicio) {
                    $sist = $this->integrator->datosmaestros->buscarSubsistemaPorId($sub->idsubsistema);
                    $res[] = $sist;
                }
            }
        }
        return $res;
    }

    function compararFechas($primera, $segunda) {
        $valoresPrimera = explode("/", $primera);
        $valoresSegunda = explode("/", $segunda);

        $diaPrimera = $valoresPrimera[0];
        $mesPrimera = $valoresPrimera[1];
        $anyoPrimera = $valoresPrimera[2];

        $diaSegunda = $valoresSegunda[0];
        $mesSegunda = $valoresSegunda[1];
        $anyoSegunda = $valoresSegunda[2];

        $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $anyoPrimera);
        $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $anyoSegunda);

        if (!checkdate($mesPrimera, $diaPrimera, $anyoPrimera)) {
            // "La fecha ".$primera." no es v&aacute;lida";
            return 0;
        } elseif (!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)) {
            // "La fecha ".$segunda." no es v&aacute;lida";
            return 0;
        } else {
            return $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }

    public function cerrarPeriodo($identidad, $idsubsistema) {
        try {
            $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $idEstructuraSubSistCierre = $estructurasubsist->idestructurasubsist;
            $arrayDatCierre = DatCierre::BuscarCierreSubsistema($idEstructuraSubSistCierre);
            $objDatCierre = Doctrine::getTable('DatCierre')->find($arrayDatCierre[0]['idcierre']);
            $idPeriodoCierre = $objDatCierre->idperiodoactual;

            //CONFC012 Error al cerrar el período
            //La fecha de inicio del próximo período no es válida, la fecha contable del subsistema no puede tener un valor del futuro
            $nextperiodo = $this->integrator->datosmaestros->periodoSiguiente(
                    $objDatCierre->idperiodoactual);
            if (self::compararFechas($nextperiodo->inicio, date('d/m/Y')) > 0) {
                throw new ZendExt_Exception('CONFC012');
            }

            if ($objDatCierre) {
                $primerPeriodo = $this->integrator->datosmaestros->primerPeriodo($objDatCierre->idejercicioactual);
                $ultimoPeriodo = $this->integrator->datosmaestros->ultimoPeriodo($objDatCierre->idejercicioactual);
                $subs_precedentes = NomSubsistema::BuscarSubsistemasPrecedentes($idEstructuraSubSistCierre);
                $subs_posteriores = NomSubsistema::BuscarSubsistemasPosteriores($idsubsistema, $identidad);
                if (count($subs_posteriores)) {
                    $estructurasubsistpost = $this->integrator->datosmaestros->buscarInstancia(
                            $identidad, $subs_posteriores[0]['idsubsistema']
                    );
                    $sub_posterior = DatCierre::BuscarCierreSubsistema($estructurasubsistpost->idestructurasubsist);
                } else {
                    $sub_posterior = $arrayDatCierre;
                }

                if ($subs_precedentes) {
                    foreach ($subs_precedentes as $subsp) {
                        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia(
                                $identidad, $subsp['idsubsistema']
                        );
                        $sub_precedente = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
                        if ($objDatCierre->idperiodoactual == $primerPeriodo && $objDatCierre->idejercicioactual == $sub_posterior[0]['idejercicioactual'] && $objDatCierre->idperiodoactual != $sub_posterior[0]['idperiodoactual']
                        ) {
                            $nextperiodo = $this->integrator->datosmaestros->obtenerPeriodo(
                                    $sub_posterior[0]['idperiodoactual']
                            );
                        } else {
                            if ($objDatCierre->idperiodoactual == $sub_precedente[0]['idperiodoactual'] && !DatCierreperiodo::ObtenerCierre(
                                            $sub_precedente[0]['idestructurasubsist'], $sub_precedente[0]['idperiodoactual']
                                    )
                            ) {
                                //Si el subsistema que se esta cerrando y alguno de sus subsistemas precedentes poseen el mismo
                                //idperiodoactual y aparte de eso ese periodo en ese subsistema precedente no se encuentra cerrado
                                //se arroja la excepcion,esta validacion se hace para el caso del ultimo periodo(diciembre)
                                //ya que dos subsistemas pueden estar en este periodo uno con el periodo cerrado y otro sin cerrar.
                                throw new ZendExt_Exception('CONFC009');
                            } else {
                                $dm = Doctrine_Manager::getInstance();
                                $conn = $dm->getCurrentConnection();
                                //buscando solicitudes de abrir subsistema pendiente de aprobar/rechazar
                                $query = " SELECT pa.idperiodoabierto
                                            FROM mod_datosmaestros.dat_periodoabierto pa
                                            WHERE pa.idsubsistema = {$subsp['idsubsistema']} AND
                                                  pa.idestructurasubsist = {$estructurasubsist->idestructurasubsist} AND
                                                  pa.idperiodo = {$objDatCierre->idperiodoactual} AND
                                                  pa.estado = 0 ";
                                $solicitudPendienteAbrirPeriodo = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                                if (count($solicitudPendienteAbrirPeriodo) > 0) {
                                    throw new ZendExt_Exception('CONFC011');
                                }

                                $periodoActual = $this->integrator->datosmaestros->obtenerPeriodo(
                                        $objDatCierre->idperiodoactual
                                );
                                if ($objDatCierre->idperiodoactual == $ultimoPeriodo) {
                                    if (DatCierreperiodo::ObtenerCierre(
                                                    $idEstructuraSubSistCierre, $objDatCierre->idperiodoactual
                                            )
                                    ) {
                                        throw new ZendExt_Exception('CONFC007');
                                    }
                                    $nextperiodo = $periodoActual;
                                } else {
                                    $nextperiodo = $this->integrator->datosmaestros->periodoSiguiente(
                                            $objDatCierre->idperiodoactual, $objDatCierre->idejercicioactual,
                                            $periodoActual->fin
                                    );
                                }
                            }
                        }
                    }
                } else {
                    $periodoActual = $this->integrator->datosmaestros->obtenerPeriodo($objDatCierre->idperiodoactual);
                    if ($objDatCierre->idperiodoactual == $ultimoPeriodo) {
                        if (DatCierreperiodo::ObtenerCierre($idEstructuraSubSistCierre, $objDatCierre->idperiodoactual)) {
                            throw new ZendExt_Exception('CONFC007');
                        }
                        $nextperiodo = $periodoActual;
                    } else {
                        $nextperiodo = $this->integrator->datosmaestros->periodoSiguiente(
                                $objDatCierre->idperiodoactual, $objDatCierre->idejercicioactual, $periodoActual->fin
                        );
                    }
                }

                $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, 4);
                if ($estructurasubsist->idestado == 1 && $estructurasubsist->contabiliza == 1 && $estructurasubsist->cierra == 1) {
                    //solo si contabilidad cierra, contabiliza y está activa...
                    //... validar integridad de periodos entre subsistemas
                    $idperiodoActualContabilidad = $this->integrator->datosmaestros->periodoActualSubsistema($identidad, 4);
                    $periodoActualContabilidad = $this->integrator->datosmaestros->obtenerPeriodo($idperiodoActualContabilidad, 4);

                    $nextperiodoContabilidad = $this->integrator->datosmaestros->periodoSiguiente(
                            $idperiodoActualContabilidad, $periodoActualContabilidad->idejercicioactual, $periodoActualContabilidad->fin
                    );
                    //  si el proximo periodo del subsistema es el siguiente de contabilidad...
                    //  (los subsistema deben cerrar hasta el siguiente de contabilidad)
                    if ($nextperiodo->idperiodo != $nextperiodoContabilidad->idperiodo) {
                        throw new ZendExt_Exception('CONFC010');
                    }
                }

                $objDatCierre->idperiodoactual = $nextperiodo->idperiodo;
                $objDatCierre->save();

                if ($idPeriodoCierre == $ultimoPeriodo) {
                    $fecha = $periodoActual->fin;
                } else {
                    $fecha = $nextperiodo->inicio;
                }
                $objfecha = $this->integrator->datosmaestros->fechaContableSubsistemaObj($identidad, $idsubsistema);

                if ($objfecha->incremento != 1) {
                    //En caso que la fecha se haya configurado como automatica no es necesario actualizar la fecha del subsistema
                    //ya que esta fue actualizada con la fecha actual o con la fecha del ultimo dia del proximo periodo en
                    //la llamada al servicio fechaContableSubsistemaObj.
                    $this->integrator->datosmaestros->actualizarFechaSubsistema($identidad, $idsubsistema, $fecha);
                }
                //Aqui se guarda para saber que periodo se cerria.
                $this->guardarCierrePeriodo($idPeriodoCierre, $idEstructuraSubSistCierre);
                //Notificar cierre para subsistemas reabiertos
                $this->integrator->datosmaestros->cerrarPeriodoReabiertoPorSubsistema($idsubsistema, $identidad);
                return true;
            } else {
                throw new ZendExt_Exception('CONFC001');
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function aperturarPeriodo($identidad, $idsubsistema) {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $asd = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        $dat = Doctrine::getTable('DatCierre')->find($asd[0]['idcierre']);

        if ($dat) {

            $primerperiodo = $this->integrator->datosmaestros->primerPeriodo($dat->idejercicioactual);
            $ultimoperiodo = $this->integrator->datosmaestros->ultimoPeriodo($dat->idejercicioactual);
            if ($dat->idperiodoactual != $primerperiodo) {
                $estructurasubsistcont = $this->integrator->datosmaestros->buscarInstancia($identidad, 4);
                $asdcont = DatCierre::BuscarCierreSubsistema($estructurasubsistcont->idestructurasubsist);
                $contabilidad = Doctrine::getTable('DatCierre')->find($asdcont[0]['idcierre']);
                if ($dat->idperiodoactual == $ultimoperiodo && $dat->idejercicioactual == $contabilidad->idejercicioactual && $dat->idperiodoactual != $contabilidad->idperiodoactual
                ) {
                    $antperiodo = $this->integrator->datosmaestros->obtenerPeriodo($contabilidad->idperiodoactual);
                } else {
                    $antperiodo = $this->integrator->datosmaestros->periodoAnterior($dat->idperiodoactual);
                }
                $dat->idperiodoactual = $antperiodo->idperiodo;
                $dat->save();

                $s = $antperiodo->fin;
                $m = explode('-', $s);
                if (count($m) > 1) {
                    $s = $m[2] . '/' . $m[1] . '/' . $m[0];
                }
                $this->integrator->datosmaestros->actualizarFechaSubsistema($identidad, $idsubsistema, $s);
            } else {
                throw new ZendExt_Exception('CONFC005');
            }
        } else {
            throw new ZendExt_Exception('CONFC006');
        }
    }

    public function cerrarEjercicio($identidad, $idsubsistema) {
        try {
            $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
            $idEstructuraSubSist = $estructurasubsist->idestructurasubsist;
            $asd = DatCierre::BuscarCierreSubsistema($idEstructuraSubSist);
            $dat = Doctrine::getTable('DatCierre')->find($asd[0]['idcierre']);
            $idEjercicioParaCerrar = $dat->idejercicioactual;
            if ($dat) {
                $ultimoperiodo = $this->integrator->datosmaestros->ultimoPeriodo($idEjercicioParaCerrar);
                if ($dat->idperiodoactual == $ultimoperiodo) {
                    $nextejercicio = $this->integrator->datosmaestros->ejercicioSiguiente($idEjercicioParaCerrar);
                    if ($nextejercicio) {
                        $dat->idejercicioactual = $nextejercicio;
                        //$nextperiodo = $this->integrator->datosmaestros->primerPeriodo($nextejercicio);
                        $nextperiodo = $this->integrator->datosmaestros->primerPeriodoObjeto($nextejercicio);

                        $dat->idperiodoactual = $nextperiodo->idperiodo;
                        $dat->save();

                        $this->integrator->datosmaestros->actualizarFechaSubsistema(
                                $identidad, $idsubsistema, $nextperiodo->inicio
                        );
                        $this->guadarCierreEjercicio($idEjercicioParaCerrar, $idEstructuraSubSist);
                        return true;
                    } else {
                        throw new ZendExt_Exception('CONFC005');
                    }
                } else {
                    throw new ZendExt_Exception('CONFC003');
                }
            } else {
                throw new ZendExt_Exception('CONFC001');
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cierreDiario($identidad, $idsubsistema, $es_cierrediario) {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $asd = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        $dat = Doctrine::getTable('DatCierre')->find($asd[0]['idcierre']);
        if ($dat) {
            $dat->cierrediario = $es_cierrediario;
            $dat->save();
            return true;
        }
        return false;
    }

    public function asignarEjercicioPeriodo($identidad, $idsubsistema, $ejercicio, $periodo) {
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($identidad, $idsubsistema);
        $asd = DatCierre::BuscarCierreSubsistema($estructurasubsist->idestructurasubsist);
        if (count($asd) > 0) {
            $dat = Doctrine::getTable('DatCierre')->find($asd[0]['idcierre']);
            if ($dat) {
                $dat->idejercicioactual = $ejercicio;
                $dat->idperiodoactual = $periodo;
                $dat->save();
                return true;
            } else {
                throw new ZendExt_Exception('CONFC001');
            }
        } else {
            throw new ZendExt_Exception('CONFC008');
        }
    }

    /**
     * Guarda los datos del ejercicio del subsistema indicando que se ha cerrado.
     *
     * @param enteropos $argIdEjercicio         Id ejercicio.
     * @param enteropos $argIdEstructuraSubSist Id subsistema entidad.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function guadarCierreEjercicio($argIdEjercicio, $argIdEstructuraSubSist) {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objDatCierreEjercicio = new DatCierreejercicio();
            $objDatCierreEjercicio->idestructurasubsist = $argIdEstructuraSubSist;
            $objDatCierreEjercicio->idejercicio = $argIdEjercicio;
            $objDatCierreEjercicio->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            $cc->rollback();
            throw $e;
        }
    }

    /**
     * Guarda los datos del periodo del subsistema indicando que se ha cerrado.
     *
     * @param enteropos $argIdPeriodo           Id periodo.
     * @param enteropos $argIdEstructuraSubSist Id subsistema entidad.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function guardarCierrePeriodo($argIdPeriodo, $argIdEstructuraSubSist) {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objDatCierreperiodo = new DatCierreperiodo();
            $objDatCierreperiodo->idestructurasubsist = $argIdEstructuraSubSist;
            $objDatCierreperiodo->idperiodo = $argIdPeriodo;
            $objDatCierreperiodo->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            $cc->rollback();
            throw $e;
        }
    }

}

?>
