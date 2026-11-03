<?php

class DatCargosOcupadosModel extends ZendExt_Model
{

    protected $domain;

    public function DatCargosOcupadosModel()
    {
        parent::ZendExt_Model();
        $this->domain = new DatCargosOcupados();
    }

    public function Insertar(DatCargosOcupados $cargo)
    {
        $this->conn->beginTransaction();
        try {
            $cargo->save();
            $this->conn->commit();
            return $cargo->idcargosocupados;
        } catch (Doctrine_Exception $exc) {
            $this->conn->rollback();
            throw $exc;
        }
    }

    public function InsertarAll(DatCargosOcupados $cargo)
    {
        $this->conn->beginTransaction();
        try {
            $cargoocupsave = new DatCargosOcupados();
            $cargoocupsave->idpersona = $cargo->idpersona;
            $cargoocupsave->idcargo = $cargo->idcargo;
            $cargoocupsave->identidad = $cargo->identidad;
            $cargoocupsave->fecharegistro = $cargo->fecharegistro;
            $cargoocupsave->fechaaplicacion = $cargo->fechaaplicacion;
            $cargoocupsave->fechavencimiento = $cargo->fechavencimiento;
            $cargoocupsave->observaciones = $cargo->observaciones;
            $cargoocupsave->idsituacionlaboral = $cargo->idsituacionlaboral;
            $cargoocupsave->idcentrocosto = $cargo->idcentrocosto;
            $cargoocupsave->idcajacajero = $cargo->idcajacajero;
            $cargoocupsave->idplantillanominal = ($cargo->idcargo == null) ? $cargo->idplantillanominal : null;
            $cargoocupsave->idpersonacuentabancariamn = $cargo->idpersonacuentabancariamn;
            $cargoocupsave->idpersonacuentabancariacuc = $cargo->idpersonacuentabancariacuc;
            $cargoocupsave->numerocontable = $cargo->numerocontable;
            $cargoocupsave->save();
            $this->conn->commit();
            return $cargoocupsave->idcargosocupados;
        } catch (Doctrine_Exception $exc) {
            $this->conn->rollback();
            throw $exc;
        }
    }

    public function Actualizar($object)
    {
        try {
            $cargo = Doctrine::getTable('DatCargosOcupados')->find($object['idcargosocupados']);
            //Si las situaciones del servicio difieren se borran las configuraciones a la situacion del servicio de la persona
            if ($object->idsituacionlaboral != $cargo->idsituacionlaboral || ($cargo->idsituacionlaboral != null)) {
                $sqlIdConfElemantoSalarial = "select conf.idelementosalarialsituacionservicio from mod_nomina.conf_elementosalarialsituacionservicio conf
			                                  inner join mod_nomina.dat_cargosocupados datco on (datco.idcargosocupados = conf.idcargoocupado)
			                                  where datco.idcargosocupados=?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arridelementosalarial = $conn->fetchAll($sqlIdConfElemantoSalarial, array($cargo->idcargosocupados));
                if (count($arridelementosalarial) > 0) {
                    $sqlConceptosPdConfElementoSalarial = "select confc.idconceptpelementsalarialessituacionservicio from mod_nomina.conf_conceptpelementsalarialessituacionservicio confc
			                                  inner join mod_nomina.dat_cargosocupados datco on (datco.idcargosocupados = confc.idcargosocupados)
			                                  where confc.idcargosocupados=?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrconceptoselementosalarial = $conn->fetchAll($sqlConceptosPdConfElementoSalarial, array($cargo->idcargosocupados));
                    if (count($arrconceptoselementosalarial) > 0) {
                        foreach ($arrconceptoselementosalarial as $i => $valor) {
                            $sqlEscalasConfElementoSalarial = "select confesc.idescalaelementosalarialsituacionservicio from mod_nomina.conf_escalaelementosalarialsituacionservicio confesc
			                                  inner join mod_nomina.conf_conceptpelementsalarialessituacionservicio confc on (confc.idconceptpelementsalarialessituacionservicio = confesc.idconceptpelementsalarialessituacionservicio)
			                                  where confesc.idconceptpelementsalarialessituacionservicio=?;";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $arrescalas = $conn->fetchAll($sqlEscalasConfElementoSalarial, array($valor['idconceptpelementsalarialessituacionservicio']));
                            if (count($arrescalas) > 0) {
                                $objConfEscala = Doctrine::getTable('ConfEscalaElementoSalarialSituacionServicio')->find($arrescalas[0]['idescalaelementosalarialsituacionservicio']);
                                $objConfEscala->delete();
                            }
                            $objConfConcepto = Doctrine::getTable('ConfigConceptospdElementosSalarialesSituacionServicio')->find($valor['idconceptpelementsalarialessituacionservicio']);
                            $objConfConcepto->delete();
                        }
                    }
                    $objConfElementoSalarial = Doctrine::getTable('ConfigElementoSalarialSituacionServicio')->find($arridelementosalarial[0]['idelementosalarialsituacionservicio']);
                    $objConfElementoSalarial->delete();
                }
            }

            //Si la modificacion es en el cargo se actualizan las escalas de la persona para el cargo nuevo
            if ($object->idcargo != $cargo->idcargo) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sqlcargoviejo = "select ceesp.*, ncpd.idconceptopercepciondescuento, ncpd.denominacion 
                        from mod_nomina.conf_escalaelementosalarialpersona ceesp
			            inner join mod_nomina.conf_conceptospdelementossalariales cces on (cces.idconfconceptospdelementossalariales = ceesp.idconfconceptospdelementossalariales)
			            inner join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idelementosalarialcargo = cces.idelementosalarialcargo)
			            inner join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = cces.idconceptopercepciondescuento)
			            inner join mod_nomina.dat_cargosocupados dco on (dco.idcargo = cesc.idcargo and dco.idpersona = ceesp.idpersona)
			            where dco.idcargo = ? and dco.identidad = ? and ceesp.idpersona = ? ;";
                $escalascargoviejo = $conn->fetchAll($sqlcargoviejo, array($cargo->idcargo, $cargo->identidad, $cargo->idpersona));
                foreach ($escalascargoviejo as $escala) {
                    $sqlcargonuevo = "select cces.idconfconceptospdelementossalariales, cces.idconceptopercepciondescuento
                        from mod_nomina.conf_conceptospdelementossalariales cces 
			            inner join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idelementosalarialcargo = cces.idelementosalarialcargo)
			            where cesc.idcargo = ? and cces.idconceptopercepciondescuento = ?;";
                    $escalascargonuevo = $conn->fetchAll($sqlcargonuevo, array($object->idcargo, $escala['idconceptopercepciondescuento']));
                    //Comprobando si existe el mismo idconceptopercepciondescuento para el nuevo cargo
                    if (!empty($escalascargonuevo)) {
                        if($escala['idconfescalaelementosalarialpersona']){
                            $obj = Doctrine::getTable('ConfEscalaElementoSalarialPersona')->find($escala['idconfescalaelementosalarialpersona']);
                            $obj->idconfconceptospdelementossalariales = $escalascargonuevo[0]['idconfconceptospdelementossalariales'];
                            $obj->save();
                        }
                    } else {
                        if($escala['idconfescalaelementosalarialpersona']){
                            $obj = Doctrine::getTable('ConfEscalaElementoSalarialPersona')->find($escala['idconfescalaelementosalarialpersona']);
                            if($obj){
                                $obj->delete();
                            }
                        }

                    }
                }
            }

            if ($cargo != false) {
                foreach ($object as $k => $v) {
                    $cargo->$k = $v;
                }

                $cargo->save();
                $this->conn->commit();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }


    public function eliminarCargoOcupado($id, $idpersona, $identidad)
    {
        try {
            $r = null;
            //Eliminando los elementos salariales de la situacion del servicio
            $objDatCargoOcup = Doctrine::getTable('DatCargosOcupados')->find($id);
            if ($objDatCargoOcup->idsituacionlaboral != null) {
                $sqlIdConfElemantoSalarial = "select conf.idelementosalarialsituacionservicio from mod_nomina.conf_elementosalarialsituacionservicio conf
			                                  inner join mod_nomina.dat_cargosocupados datco on (datco.idcargosocupados = conf.idcargoocupado)
			                                  where datco.idcargosocupados=?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arridelementosalarial = $conn->fetchAll($sqlIdConfElemantoSalarial, array($id));

                if (count($arridelementosalarial) > 0) {
                    $objConfElementoSalarial = Doctrine::getTable('ConfigElementoSalarialSituacionServicio')->find($arridelementosalarial[0]['idelementosalarialsituacionservicio']);
                    $objConfElementoSalarial->delete();
                }
                $sqlConceptosPdConfElementoSalarial = "select confc.idconceptpelementsalarialessituacionservicio from mod_nomina.conf_conceptpelementsalarialessituacionservicio confc
			                                  inner join mod_nomina.dat_cargosocupados datco on (datco.idcargosocupados = confc.idcargosocupados)
			                                  where confc.idcargosocupados=?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrconceptoselementosalarial = $conn->fetchAll($sqlConceptosPdConfElementoSalarial, array($id));
                if (count($arrconceptoselementosalarial) > 0) {
                    foreach ($arrconceptoselementosalarial as $i => $valor) {
                        $sqlEscalasConfElementoSalarial = "select confesc.idescalaelementosalarialsituacionservicio from mod_nomina.conf_escalaelementosalarialsituacionservicio confesc
			                                  inner join mod_nomina.conf_conceptpelementsalarialessituacionservicio confc on (confc.idconceptpelementsalarialessituacionservicio = confesc.idconceptpelementsalarialessituacionservicio)
			                                  where confesc.idconceptpelementsalarialessituacionservicio=?;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrescalas = $conn->fetchAll($sqlEscalasConfElementoSalarial, array($valor['idconceptpelementsalarialessituacionservicio']));
                        if (count($arrescalas) > 0) {
                            $objConfEscala = Doctrine::getTable('ConfEscalaElementoSalarialSituacionServicio')->find($arrescalas[0]['idescalaelementosalarialsituacionservicio']);
                            $objConfEscala->delete();
                        }
                        $objConfConcepto = Doctrine::getTable('ConfigConceptospdElementosSalarialesSituacionServicio')->find($valor['idconceptpelementsalarialessituacionservicio']);
                        $objConfConcepto->delete();
                    }
                }

            }

            //Eliminando el cargo
            $r = Doctrine::getTable('DatCargosOcupados')->find($id);
            $r->delete();
            return "No esta en uso";
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                return "Esta en uso";
            } else {
                return "No esta en uso";
            }
        }
    }

    public function obtenerListadoCargosOcupadosActual($idpersona, $identidad, $start, $limit, $sistema)
    {
        try {
            $texto = "";
            $listado = $this->domain->obtenerListadoCargosOcupadosActual($idpersona, $identidad, $start, $limit);

            foreach ($listado as $k => $value) {
                if ($value['idcargo'] != '') {
                    $ioc = ZendExt_IoC::getInstance();
                    $datoscargo = $this->integrator->metadatos->DameEstructura($value['idcargo']);
                    $arrCaminosCargos = $ioc->metadatos->getRutaEstructura(array($value['idcargo']));
                    $arrcaminoid = explode('/', $arrCaminosCargos[count($arrCaminosCargos) - 1]['rutaId']);
                    foreach ($arrcaminoid as $cc => $rid) {
                        //Dame los datos de la estructura
                        if (!empty($rid)) {
                            $datosestructuracamino = $ioc->metadatos->DameEstructura($rid);
                            //print_r($datosestructuracamino);die;
                            if ($texto == "") {
                                $texto = '<img src="' . $datosestructuracamino[0]->icon . '" height=16 width=16 />' . " " . $datosestructuracamino[0]->text . "/";
                            } else {
                                $texto = $texto . '<img src="' . $datosestructuracamino[0]->icon . '" height=16 width=16 />' . " " . $datosestructuracamino[0]->text . "/";
                            }
                        }
                    }
                    //print_r($texto);die;
                    $listado[$k]['path'] = $this->conformarCamino($arrCaminosCargos);
                    $listado[$k]['denomcargo'] = $datoscargo[0]->text;
                    $listado[$k]['denomcargoiconos'] = '<img src="' . $datoscargo[0]->icon . '" height=16 width=16 />' . ' ' . $datoscargo[0]->text;
                    $listado[$k]['caminocargo'] = $texto;
                } else {
                    $listado[$k]['denomcargo'] = 'Sin cargo';
                    $listado[$k]['caminocargo'] = 'Sin cargo';
                }

                $sqlDenomCentrosdeCosto = "select (centrocosto.codigocentrogrupo ||'_'||centrocosto.descripcioncentrogrupo)  as denominacion, centrocosto.idpadre 
                                           from mod_contabilidadcosto.nom_centrocosto centrocosto
			                               where centrocosto.idcentrogrupo =?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdenomcentroscosto = $conn->fetchAll($sqlDenomCentrosdeCosto, array($value['idcentrocosto']));
                $idpadre = $arrdenomcentroscosto[0]['idpadre'];
                if($value['idcentrocosto'] == $idpadre){
                    $denomcc = $arrdenomcentroscosto[0]['denominacion'];
                }else{
                    $sqlDenomCentrosdeCosto = "select centrocosto.descripcioncentrogrupo
                              from mod_contabilidadcosto.nom_centrocosto centrocosto
                              where centrocosto.idcentrogrupo = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $denomcentroscostopadre = $conn->fetchOne($sqlDenomCentrosdeCosto, array($idpadre));
                    $denomcc = $arrdenomcentroscosto[0]['denominacion'].'.'.$denomcentroscostopadre;
                }
                //print_r($arrdenomcentroscosto);die;
                $listado[$k]['denomccosto'] = $denomcc;


                $objPlantilla = new ConfPlantillaNominal();
                $datosplantilla = $objPlantilla->obtenerDenomXIdSinCodigo($value['idplantillanominal']);
                $listado[$k]['denomcentrocosto'] = $datosplantilla;
            }

            return $listado;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function conformarCamino($array)
    {
        $idpadre;
        $path = array();
        foreach ($array as $v) {
            if ($v['idnomeav'] == 3) {
                $idpadre = $v['idfila'];
                $path[] = $idpadre;
            }
        }
        foreach ($array as $val) {
            $idpadre = $this->buscarHijos($array, $idpadre);
            if ($idpadre)
                $path[] = $idpadre;
        }
        return $path;
    }

    public function buscarHijos($array, $idpadre)
    {
        foreach ($array as $val) {
            if ($idpadre == $val['idpadre'] && $val['idnomeav'] != 3) {
                return $val['idfila'];
                break;
            }
        }
    }

    public function obtenerListadoCargosOcupadosHistorico($idpersona, $identidad, $start, $limit)
    {
        try {
            $listado = $this->domain->obtenerListadoCargosOcupadosHistorico($idpersona, $identidad, $start, $limit);
            $objHistorico = new HisCargosOcupados();
            if (count($listado) > 0) {
                foreach ($listado as $cont => $elem) {
                    $objHistorico->idhiscargosocupados = $elem['idhiscargosocupados'];
                    $objHistorico->idpersona = $elem['idpersona'];
                    $objHistorico->idcargo = $elem['idcargo'];
                    $objHistorico->identidad = $elem['identidad'];
                    $objHistorico->fecharegistro = $elem['fecharegistro'];
                    $objHistorico->fechaaplicacion = $elem['fechaaplicacion'];
                    $objHistorico->fechavencimiento = $elem['fechavencimiento'];
                    $objHistorico->observaciones = $elem['observaciones'];
                    $objHistorico->idsituacionlaboral = $elem['idsituacionlaboral'];
                    $objHistorico->idcajacajero = $elem['idcajacajero'];
                    $objHistorico->idcentrocosto = $elem['idcentrocosto'];
                    $objHistorico->idpersonacuentabancariamn = $elem['idpersonacuentabancariamn'];
                    $objHistorico->idpersonacuentabancariacuc = $elem['idpersonacuentabancariacuc'];
                    $objHistorico->numerocontable = $elem['numerocontable'];
                    $objHistorico->idplantillanominal = $elem['idplantillanominal'];
                    $objHistorico->orden = $elem['orden'];
                }
            }
            $arrhistorico = $objHistorico->obtenerListadoCargosOcupadosHistorico($idpersona, $identidad, $start, $limit);
            if (count($arrhistorico) > 0) {
                foreach ($arrhistorico as $k => $value) {
                    $datoscargo = $this->integrator->metadatos->DameEstructura($value['idcargo']);//print_r(array($value['idcargo']));die;
                    //print_r($datoscargo);die;
                    //$arrCaminosCargos = $this->integrator->metadatos->BuscarCaminodadoArrIdCargos(array($value['idcargo']));
                    $texto = "";
                    foreach ($arrCaminosCargos as $n => $v) {
                        $texto = $texto . "/" . '<img src="' . $v['icon'] . '" height=16 width=16 />' . ' ' . $v['denominacion'];
                    }
                    //$arrhistorico[$k]['path'] = $this->conformarCamino($arrCaminosCargos);
                    $arrhistorico[$k]['denomcargo'] = '<img src="' . $datoscargo[0]->icon . '" height=16 width=16 />' . ' ' . $datoscargo[0]->denominacion;
                    $arrhistorico[$k]['caminocargo'] = $texto;
                    $sqlDenomCentrosdeCosto = "select centrocosto.descripcioncentrogrupo  as denominacion from mod_contabilidadcosto.nom_centrocosto centrocosto
			                                  where centrocosto.idcentrogrupo=?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrdenomcentroscosto = $conn->fetchAll($sqlDenomCentrosdeCosto, array($value['idplantillanominal']));
                    $arrhistorico[$k]['denomcentrocosto'] = $arrdenomcentroscosto[0]['denominacion'];
                }
            }
            //print_r($arrhistorico);die;
            return $arrhistorico;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function cantidadCargosOcupadoxPersona($idpersona, $identidad)
    {
        try {
            $listado = $this->domain->cantdCargosOcupadosxPersona($idpersona, $identidad);
            return $listado;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function cantidadCargosOcupadoHistoricoxPersona($idpersona, $identidad)
    {
        try {
            $listado = $this->domain->cantdCargosOcupadosHistoricoxPersona($idpersona, $identidad);
            return $listado;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function verficarExistencia($idpersona, $identidad, $idcargo, $idsituacionlaboral, $idplantillanominal)
    {
        try {
            $resp = $this->domain->verficarExistenciadelCargo($idpersona, $identidad, $idcargo, $idplantillanominal);
            if (!$resp) {
                $resp = $this->domain->verificarExistenciadelaSituacionLaboral($idpersona, $identidad, $idsituacionlaboral, $idplantillanominal);
                if (!$resp) {
                    return $m = 'ok';
                } else {
                    return $m = 'situacion';
                }
            } else {
                return $m = 'cargo';
            }
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function verficarExistMod($idpersona, $identidad, $idcargo, $idsituacionlaboral, $idcargosocupados, $idcargosocupados, $idplantillanominal)
    {
        try {
            $resp = $this->domain->verficarExistenciadelCargoMod($idpersona, $identidad, $idcargo, $idcargosocupados, $idplantillanominal);
            if (!$resp) {
                $resp = $this->domain->verificarExistenciadelaSituacionLaboralMod($idpersona, $identidad, $idsituacionlaboral, $idcargosocupados, $idplantillanominal);
                if (!$resp) {
                    return $m = 'ok';
                } else {
                    return $m = 'situacion';
                }
            } else {
                return $m = 'cargo';
            }
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Devolver las personas registradas en cargos ocupados.
     */
    public function obtenerListadoPersonasRegistradas($identidad, $limit, $start)
    {
        return $this->domain->obtenerListadoPersonas($identidad, $limit, $start);
    }

    public function obtenerCantidadTotalPersonasRegistradas()
    {
        return $this->domain->obtenerCantidadPersonas($identidad);
    }

    public function buscarAreaPersona($idpersona)
    {
        return DatCargosOcupados::buscarAreaPersona($idpersona);
    }

    //****Numero contables

    public function adicionarNumeroContable($idpersona, $identidad, $nombreapellido, $numerocontable)
    {
        try {

            $existeNCEntidad = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersonaEntidadNC($numerocontable, $identidad);

            $existePersonaNC = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersonaEntidad($idpersona, $identidad);

            if (!$existePersonaNC) {

                if (!$existeNCEntidad) {

                    $objConfigPersonaCodigoContable = new ConfigPersonaCodigoContable();
                    $objConfigPersonaCodigoContable->idpersona = $idpersona;
                    $objConfigPersonaCodigoContable->cdgocontable = $numerocontable;
                    $objConfigPersonaCodigoContable->nombreapellido = $nombreapellido;
                    $objConfigPersonaCodigoContable->idestructura = $identidad;
                    $objConfigPersonaCodigoContable->save();

                    /* $idpersonacdgocontable = $objConfigPersonaCodigoContable->idpersonacdgocontable;

                      $objEscConf = new ConfCuentasAperturaPersona();
                      $arrayidcta = $objEscConf->obtenerIdCuenta($identidad);

                      $ioc = ZendExt_IoC::getInstance();
                      foreach ($arrayidcta as $k => $v) {
                      $apertCta = array();
                      if ($v['tipoapertura'] == 1) {
                      $datos = $ioc->contabilidad->obtenerCuentaPorId($v['idcuenta']);
                      $concatcuenta      = $datos->concatcta . '.' . $numerocontable;
                      $cuentacontabiliza = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);//print_r($cuentacontabiliza);
                      //die;

                      if (empty($cuentacontabiliza->idcuenta)) {
                      $objAperCta                = new stdClass();
                      $objAperCta->codigo        = $numerocontable; //Codigo;
                      $objAperCta->descripcion   = $nombreapellido;
                      $objAperCta->identificador = $idpersonacdgocontable; //idpersona;
                      $objAperCta->concat        = $concatcuenta;
                      array_push($apertCta, $objAperCta);
                      }
                      if (!empty($apertCta)) {
                      $confCta                   = array('tabla' => 'conf_personacdgocontable');
                      $arrayAnalCta = array('configuracion' => $confCta, 'aperturas' => $apertCta);
                      $analCta      = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $v['idcuenta'], $arrayAnalCta);
                      }
                      }else{
                      $dat_cargos_ocupados = new DatCargosOcupados();
                      $datos = $ioc->contabilidad->obtenerCuentaPorId($v['idcuenta']);
                      $idcentrocostoTem = $dat_cargos_ocupados->obtenerCentroCostoPersona($idpersona,$identidad);
                      //print_r($idcentrocostoTem);die;
                      $idcentrocosto = $idcentrocostoTem;
                      $confCta       = array('tabla' => 'nom_centrocosto');
                      $apertCta      = array();

                      //Datos del centro costo
                      $sqlCountCC = "select * from  mod_contabilidadcosto.nom_centrocosto centrocosto
                      where centrocosto.idcentrogrupo=?;";
                      $mg         = Doctrine_Manager::getInstance();
                      $conn       = $mg->getCurrentConnection();
                      $objcentrogrupo = $conn->fetchRow($sqlCountCC, array($idcentrocosto));
                      $codigocentrogrupo     = $objcentrogrupo['codigocentrogrupo'];

                      $concatcuenta = $datos->concatcta . '.' . $codigocentrogrupo;

                      $cuentacontabiliza             = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);
                      $idcuentaaperturadaCentroCosto = $cuentacontabiliza->idcuenta;

                      if (empty($idcuentaaperturadaCentroCosto)) {

                      $objAperCta                = new stdClass();
                      $objAperCta->codigo        = $codigocentrogrupo; //Codigo centro grupo
                      $objAperCta->descripcion   = $objcentrogrupo['descripcioncentrogrupo']; //descripcioncentrogrupo
                      $objAperCta->identificador = $objcentrogrupo['idcentrogrupo']; //idcentrogrupo;
                      $objAperCta->concat        = $concatcuenta;
                      array_push($apertCta, $objAperCta);
                      $arrayAnalCta                  = array('configuracion' => $confCta, 'aperturas' => $apertCta);
                      $analCta                       = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $v['idcuenta'], $arrayAnalCta);
                      $idcuentaaperturadaCentroCosto = $analCta['cuentas'][0]['idcuenta'];

                      }

                      $datos = $ioc->contabilidad->obtenerCuentaPorId($idcuentaaperturadaCentroCosto);
                      $concatcuenta      = $datos->concatcta . '.' . $numerocontable;
                      $cuentacontabiliza = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);

                      if (empty($cuentacontabiliza->idcuenta)) {
                      $apertCta      = array();
                      $objAperCta                = new stdClass();
                      $objAperCta->codigo        = $numerocontable; //Codigo;
                      $objAperCta->descripcion   = $nombreapellido;
                      $objAperCta->identificador = $idpersonacdgocontable; //idpersona;
                      $objAperCta->concat        = $concatcuenta;
                      array_push($apertCta, $objAperCta);
                      }

                      if (!empty($apertCta)) {
                      $confCta                   = array('tabla' => 'conf_personacdgocontable');
                      $arrayAnalCta = array('configuracion' => $confCta, 'aperturas' => $apertCta);
                      $analCta      = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $idcuentaaperturadaCentroCosto, $arrayAnalCta);
                      }

                      }

                      } */

//
                    $m->Mensaje = 1;
                    return $m;
                    // echo Zend_Json::encode($m);
                } else {
                    $m->Mensaje = 3;
                    $m->Text = 2; //el numero contable ya existe en la entidad
                    //  echo Zend_Json::encode($m);
                    return $m;
                }
            } else {

                $m->Mensaje = 3;
                $m->Text = 1; //la persona ya existe en la entidad con un numero contable(no puede tener dos numero en la misma entidad)
                // echo Zend_Json::encode($m);
                return $m;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificarNumeroContable($idpersonacdgocontable, $idpersona, $identidad, $nombreapellido, $numerocontable)
    {
        try {


            $existe = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersonaEntidadNC($numerocontable, $identidad);

            if (!$existe) {
                $objConfigPersonaCodigoContable = ConfigPersonaCodigoContable::obtenerObjConfigPersonaCodigoContable($idpersonacdgocontable);

                if ($objConfigPersonaCodigoContable) {

                    $objConfigPersonaCodigoContable->cdgocontable = $numerocontable;
                    $objConfigPersonaCodigoContable->save();

                    $m->Mensaje = 1;
                    return $m;
                    // echo Zend_Json::encode($m);
                }
            } else {
                $m->Mensaje = 3;
                $m->Text = 2; //el numero contable ya existe en la entidad
                return $m;
                // echo Zend_Json::encode($m);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarNumerocontable($idpersonacdgocontable)
    {
        try {

            $objConfigPersonaCodigoContable = ConfigPersonaCodigoContable::obtenerObjConfigPersonaCodigoContable($idpersonacdgocontable);


            if ($objConfigPersonaCodigoContable) {
                /* $objEscConf = new ConfCuentasAperturaPersona();
                  $arrayidcta = $objEscConf->obtenerIdCuenta($objConfigPersonaCodigoContable->idestructura);
                  // print_r($arrayidcta);die;
                  $ioc = ZendExt_IoC::getInstance();
                  foreach ($arrayidcta as $k => $v) {

                  if($v['tipoapertura']==1){

                  $arrayConcepto = array(
                  'concat'        => $objConfigPersonaCodigoContable->cdgocontable, //Codigo;,
                  'identificador' => $objConfigPersonaCodigoContable->idpersonacdgocontable //idpersona;
                  );
                  $ioc->contabilidad->eliminarAnalisisCtaPorConcepto($objConfigPersonaCodigoContable->idestructura, $v['idcuenta'], $arrayConcepto);

                  }else{
                  $dat_cargos_ocupados = new DatCargosOcupados();
                  $datos = $ioc->contabilidad->obtenerCuentaPorId($v['idcuenta']);
                  $idcentrocosto = $dat_cargos_ocupados->obtenerCentroCostoPersona($objConfigPersonaCodigoContable->idpersona,
                  $objConfigPersonaCodigoContable->idestructura);

                  //Datos del centro costo
                  $sqlCountCC = "select * from  mod_contabilidadcosto.nom_centrocosto centrocosto
                  where centrocosto.idcentrogrupo=?;";
                  $mg         = Doctrine_Manager::getInstance();
                  $conn       = $mg->getCurrentConnection();
                  $objcentrogrupo = $conn->fetchRow($sqlCountCC, array($idcentrocosto));
                  $codigocentrogrupo     = $objcentrogrupo['codigocentrogrupo'];

                  $concatcuenta = $datos->concatcta . '.' . $codigocentrogrupo;
                  $cuentacontabiliza             = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($objConfigPersonaCodigoContable->idestructura, $concatcuenta);

                  if(!empty($cuentacontabiliza->idcuenta)){
                  $idcuentaaperturadaCentroCosto = $cuentacontabiliza->idcuenta;
                  $arrayConcepto = array(
                  'concat'        => $objConfigPersonaCodigoContable->cdgocontable, //Codigo;
                  'identificador' => $objConfigPersonaCodigoContable->idpersonacdgocontable //idpersona;
                  );
                  $ioc->contabilidad->eliminarAnalisisCtaPorConcepto($objConfigPersonaCodigoContable->idestructura, $idcuentaaperturadaCentroCosto, $arrayConcepto);
                  }

                  }


                  } */

                $objConfigPersonaCodigoContable->delete();


                $m->Mensaje = 1;
                return $m;
                // echo Zend_Json::encode($m);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function calcularNumeroContable($identidad)
    {
        try {

            $ArraygPersonaCodigoContable = ConfigPersonaCodigoContable::obtenerConfigDadoIdEntidad($identidad);

            $codigo = $ArraygPersonaCodigoContable[0]['cdgocontable'];

            if (count($ArraygPersonaCodigoContable)) {
                foreach ($ArraygPersonaCodigoContable as $k => $v) {
                    if ($codigo < $v['cdgocontable']) {
                        $codigo = $v['cdgocontable'];
                    }
                }


                return $codigo;
                // echo Zend_Json::encode($m);
            } else {

                return 0;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function actualizarAperturas($identidad)
    {

        //configuracion de cuentas
        $objEscConf = new ConfCuentasAperturaPersona();
        //Cuentas a aperturar
        $arrayidcta = $objEscConf->obtenerIdCuenta($identidad);
        //Persona a aperturar
        $arrayCdgContable = ConfigPersonaCodigoContable::obtenerConfigDadoIdEntidad($identidad);
        $ioc = ZendExt_IoC::getInstance();

        foreach ($arrayidcta as $k => $v) {
            if ($v['tipoapertura'] == 1) {
                $confCta = array('tabla' => 'conf_personacdgocontable');
                $datos = $ioc->contabilidad->obtenerCuentaPorId($v['idcuenta']);
                $apertCta = array();

                foreach ($arrayCdgContable as $kCdg => $vCdg) {
                    $concatcuenta = $datos->concatcta . '.' . $vCdg['cdgocontable'];
                    $cuentacontabiliza = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);

                    if (empty($cuentacontabiliza->idcuenta)) {
                        $objAperCta = new stdClass();
                        $objAperCta->codigo = $vCdg['cdgocontable']; //Codigo;
                        $objAperCta->descripcion = $vCdg['nombreapellido'];
                        $objAperCta->identificador = $vCdg['idpersonacdgocontable']; //idpersona;
                        $objAperCta->concat = $concatcuenta;
                        array_push($apertCta, $objAperCta);
                    }
                }

                if (!empty($apertCta)) {
                    $arrayAnalCta = array('configuracion' => $confCta, 'aperturas' => $apertCta);
                    $analCta = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $v['idcuenta'], $arrayAnalCta);
                }
            } else {
                $dat_cargos_ocupados = new DatCargosOcupados();
                //codigos contables y otros datos de la persona ordenados por centro de costo
                $arrayCdgContable = ConfigPersonaCodigoContable::obtenerConfigDadoIdEntidadOrdenadoPorCentroCosto($identidad);
                $arrayCdgContable = ConfigPersonaCodigoContable::organizaArregloPersonaCdgContable($arrayCdgContable);

                //datos de la cuenta, para utilizar su concat
                $datos = $ioc->contabilidad->obtenerCuentaPorId($v['idcuenta']);

                foreach ($arrayCdgContable as $kCdg => $vCdg) {
                    $idcentrocosto = $vCdg['idcentrocosto'];
                    $confCta = array('tabla' => 'nom_centrocosto');
                    $apertCta = array();
                    //para obtener el codigo del centro de grupo
                    /* $arraydatoscentrocosto = $ioc->contabilidad_costos->obtenerCentrosCosto($identidad);
                      $objcentrogrupo        = $dat_cargos_ocupados->dameCodigoCentroGrupo($idcentrocosto, $arraydatoscentrocosto); */

                    //Datos del centro costo
                    $sqlCountCC = "select * from  mod_contabilidadcosto.nom_centrocosto centrocosto  where centrocosto.idcentrogrupo=?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $objcentrogrupo = $conn->fetchRow($sqlCountCC, array($idcentrocosto));
                    $codigocentrogrupo = $objcentrogrupo['codigocentrogrupo'];

                    $concatcuenta = $datos->concatcta . '.' . $codigocentrogrupo;

                    $cuentacontabiliza = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);
                    $idcuentaaperturadaCentroCosto = $cuentacontabiliza->idcuenta;

                    if (empty($idcuentaaperturadaCentroCosto)) {
                        $objAperCta = new stdClass();
                        $objAperCta->codigo = $codigocentrogrupo; //Codigo centro grupo
                        $objAperCta->descripcion = $objcentrogrupo['descripcioncentrogrupo']; //descripcioncentrogrupo
                        $objAperCta->identificador = $objcentrogrupo['idcentrogrupo']; //idcentrogrupo;
                        $objAperCta->concat = $concatcuenta;
                        array_push($apertCta, $objAperCta);
                        $arrayAnalCta = array('configuracion' => $confCta, 'aperturas' => $apertCta);
                        $analCta = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $v['idcuenta'], $arrayAnalCta);
                        $idcuentaaperturadaCentroCosto = $analCta['cuentas'][0]['idcuenta'];
                    }
                    $apertCtaPersona = array();
                    foreach ($vCdg['arraypersonas'] as $kCdg => $persona) {
                        $datos = $ioc->contabilidad->obtenerCuentaPorId($idcuentaaperturadaCentroCosto);
                        //print_r($datos);die;
                        $concatcuenta = $datos->concatcta . '.' . $persona['cdgocontable'];
                        $cuentacontabiliza = $ioc->contabilidad_financiera->obtenerCuentaPorConcat($identidad, $concatcuenta);

                        if (empty($cuentacontabiliza->idcuenta)) {
                            $objAperCta = new stdClass();
                            $objAperCta->codigo = $persona['cdgocontable']; //Codigo;
                            $objAperCta->descripcion = $persona['nombreapellido'];
                            $objAperCta->identificador = $persona['idpersonacdgocontable']; //idpersona;
                            $objAperCta->concat = $concatcuenta;
                            array_push($apertCtaPersona, $objAperCta);
                        }
                    }

                    if (!empty($apertCtaPersona)) {
                        $confCta = array('tabla' => 'conf_personacdgocontable');
                        $arrayAnalCta = array('configuracion' => $confCta, 'aperturas' => $apertCtaPersona);
                        $analCta = $ioc->contabilidad->aperturarAnalisisCtaPorConcepto($identidad, $idcuentaaperturadaCentroCosto, $arrayAnalCta);
                    }
                }
            }
        }
        $m->Mensaje = 1;
        return $m;
    }

    // Dar alta automaticamente al pagoa las personas para el pago
    public function darAltaPago($arraypersonas, $identidad, $arrcargossubordinados)
    {
        $cont = 0;
        $objDatCargosOcupados = new DatCargosOcupados();
        $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();
        $arrcargos = array();
        //Cargos subordinados a la estructura
        foreach ($arrcargossubordinados as $rcargos) {
            $arrcargos[] = $rcargos['idcargo'];
        }
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //Recorriendo las personas para buscar el cargo en la entidad y darles alta
        foreach ($arraypersonas as $i => $valor) {
            //Cargo de la persona en la entidad
            $datos = DatCargosOcupados::verificarcargo($valor, $arrcargos);
            if (count($datos) > 0) {
                if ($datos[0]['idcargo']) {
                    $cont++;
                    $idcargo = $datos[0]['idcargo'];
                    $idpersona = $valor;
                    //Verificar que esa persona, con ese cargo en esa entidad no sea alta en nomina
                    $idcargoocupado = $objDatCargosOcupados->obtenerIdCargosOcupadosPersonaCargoEntidad($idpersona, $identidad, $idcargo);
                    if (!$idcargoocupado) {			    
						  $centrocostoplantillanominal = $objConfPlantillaNominalCargo->obtenerCentroCostoCargo($idcargo);
						  //Verificando que sea un Centro de Costo Valido en Contabilidad
						  $sqlCC = "SELECT centrocosto.idcentrogrupo FROM mod_contabilidadcosto.nom_centrocosto centrocosto
								    where  centrocosto.idcentrogrupo = ?;";
						$idcentrogrupo = $conn->fetchOne($sqlCC, array($centrocostoplantillanominal[0]['idcentrocosto']));
						//Buscando la fecha de alta en el Cargo
                        //Verificando que sea un Centro de Costo Valido en Contabilidad
                        $sqlFechaPersonaCargo = "SELECT ds.fdesde FROM  mod_persona.dat_situacionlaboral ds
                                                INNER JOIN dat_personaentidad dpe ON (dpe.idpersonaentidad = ds.idpersonaentidad)
                                                WHERE dpe.idpersona = ? and ds.idcargo = ? and ds.estado = 0;";
                        $fechapersonacargo = $conn->fetchOne($sqlFechaPersonaCargo, array($idpersona, $idcargo));
						if($idcentrogrupo){
					      $obj = new DatCargosOcupados();
						  $obj->idpersona = $idpersona;
						  $obj->idcargo = $idcargo;
						  $obj->idcentrocosto = $centrocostoplantillanominal[0]['idcentrocosto'];
						  $obj->identidad = $identidad;
						  if($fechapersonacargo){
                              $obj->fecharegistro = $fechapersonacargo;
                              $obj->fechaaplicacion = $fechapersonacargo;
                          }
						  $obj->save();
						}  
						                  
                    }
                }
            }
        }
        if ($cont > 0) {
            return 1;
        } else return -1;

        // return $this->domain->obtenerCantidadPersonas($identidad);
    }

    public function obtenerCantidadCargosPersonaEntidad($idpersona, $identidad)
    {
        $cantidadcargos = DatCargosOcupados::obtenerCantidadCargoPersonaEntidad($idpersona, $identidad);
        return $cantidadcargos;
    }

    public function obtenerCargosNominaNoFuerzaTrabajo($identidad, $arrcargos)
    {
        //Recorriendo los cargos para buscar las personas q los ocupan
        $personasnoftrab = array();
        $objDatCargosOcupados = new DatCargosOcupados();
        foreach ($arrcargos as $idcargo) {
            //Persona que ocupa cargo en nomina en la entidad
            $arridpersona = $objDatCargosOcupados->obtenerPersonasxEntidadCargo($identidad, $idcargo);
            if (count($arridpersona)) {
                foreach ($arridpersona as $ridpersona) {
                    $idpersona = $ridpersona['idpersona'];
                    //Obtener cargo persona en fuerza de trabajo
                    $existecargofuerzatrabajo = $objDatCargosOcupados->existeCargoFuerzaTrabajo($idpersona, $idcargo);
                    //Si el cargo de la persona en nomina no coincide con el cargo de la persona en situacion laboral
                    if ($existecargofuerzatrabajo == 0) {
                        $personasnoftrab[] = $idpersona;
                    }
                }
            }
        }
        if (count($personasnoftrab) > 0) {
            $nombrecompleto = "";
            foreach ($personasnoftrab as $idpersona) {
                //Dame los datos de la persona que no le da el acumulado
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		           where dp.idpersona = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                if ($nombrecompleto == "") {
                    $nombrecompleto = $nombreapp . ", ";
                } else {
                    $nombrecompleto = $nombrecompleto . " " . $nombreapp . ", ";
                }
            }
            $obj->cod = 2;
            $obj->texto = $nombrecompleto;
            return $obj;
        } else {
            $obj->cod = 1;
            $obj->texto = 'Ok';
            return $obj;
        }
    }

    public function sincronizarCargosNominaFuerzaTrabajo($identidad, $arrcargos)
    {
        $objConfPlantillaNominalCargo = new ConfPlantillaNominalCargo();
        //Recorriendo los cargos para buscar las personas q los ocupan
        $personasnoftrab = array();
        $objDatCargosOcupados = new DatCargosOcupados();
        foreach ($arrcargos as $idcargo) {
            //Persona que ocupa cargo en nomina en la entidad
            $arridpersona = $objDatCargosOcupados->obtenerPersonasxEntidadCargo($identidad, $idcargo);
            if (count($arridpersona)) {
                foreach ($arridpersona as $ridpersona) {
                    $idcargosocupados = $ridpersona['idcargosocupados'];
                    $idpersona = $ridpersona['idpersona'];
                    //Obtener cargo persona en fuerza de trabajo
                    $existecargofuerzatrabajo = $objDatCargosOcupados->existeCargoFuerzaTrabajo($idpersona, $idcargo);
                    //Si el cargo de la persona en nomina no coincide con el cargo de la persona en situacion laboral
                    if ($existecargofuerzatrabajo == 0) {
                        $cargofuerzatrabajo = $objDatCargosOcupados->obtenerCargoFuerzaTrabajo($idpersona);
                        if (count($cargofuerzatrabajo) > 0) {
                            foreach ($cargofuerzatrabajo as $rcargo) {
                                $idcargofuerzatrabajo = $rcargo['idcargo'];
                                $existecargoentidad = array_search($idcargofuerzatrabajo, $arrcargos);
                                if ($existecargoentidad) {
                                    $idcentrocostoplantillanominal = $objConfPlantillaNominalCargo->obtenerCentroCostoCargo($idcargofuerzatrabajo)[0]['idcentrocosto'];
                                    $objDatCargosOcupadosUpdate = Doctrine::getTable('DatCargosOcupados')->find($idcargosocupados);
                                    $objDatCargosOcupadosUpdate->idcargo = $idcargofuerzatrabajo;
                                    $objDatCargosOcupadosUpdate->idcentrocosto = $idcentrocostoplantillanominal;
                                    print_r($objDatCargosOcupadosUpdate);
                                    die;
                                    $objDatCargosOcupadosUpdate->save();
                                }
                            }
                        }

                    }
                }
            }
        }
        return 'ok';
    }

    public function actualizarCargos($tipo, $identidad)
    {
        //Obtener cargos de movimientos laborales
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($tipo == 1) {
            try {
                $conn->beginTransaction();
                $sql = "DELETE FROM mod_nomina.conf_plantillanominalcargo WHERE idcargo in (SELECT cpc.idcargo
                FROM mod_nomina.conf_plantillanominalcargo cpc
                inner join mod_nomina.conf_plantillanominal cp on (cp.idplantillanominal = cpc.idplantillanominal)
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = cpc.idcargo)
                where cp.identidad = ? and nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                $sql = "DELETE FROM mod_nomina.nom_areascargos WHERE idcargo in (SELECT nac.idcargo
                FROM mod_nomina.nom_areascargos nac
                inner join mod_nomina.nom_areas na on (na.idarea = nac.idarea)
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = nac.idcargo)
                where na.idestructura = ? and nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                $sql = "DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idcargo in (SELECT ccpr.idcargo
                FROM mod_nomina.conf_cargospagoporresultado ccpr
                inner join mod_nomina.conf_pagosporresultado cpr on (cpr.idpagoporresultado = ccpr.idpagoporresultado)
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = ccpr.idcargo)
                where cpr.identidad = ? and nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                /*$sql = "DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargo in (SELECT dco.idcargo
                FROM mod_nomina.dat_cargosocupados dco
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = dco.idcargo)
                where dco.identidad = ? and nf.idfila is null)";
                $conn->execute($sql, array($identidad));*/
                $conn->commit();
                return 1;
            } catch (Exception $e) {
                return 3;
            }
        } else {
            try {
                $conn->beginTransaction();
                $sql = "DELETE FROM mod_nomina.conf_plantillanominalcargo WHERE idcargo in (SELECT cpc.idcargo
                FROM mod_nomina.conf_plantillanominalcargo cpc
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = cpc.idcargo)
                where nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                $sql = "DELETE FROM mod_nomina.nom_areascargos WHERE idcargo in (SELECT nac.idcargo
                FROM mod_nomina.nom_areascargos nac
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = nac.idcargo)
                where nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                $sql = "DELETE FROM mod_nomina.conf_cargospagoporresultado WHERE idcargo in (SELECT ccpr.idcargo
                FROM mod_nomina.conf_cargospagoporresultado ccpr
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = ccpr.idcargo)
                where nf.idfila is null);";
                $conn->execute($sql, array($identidad));

                /*$sql = "DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargo in (SELECT dco.idcargo
                FROM mod_nomina.dat_cargosocupados dco
                left join mod_estructuracomp.nom_filaestruc nf on (nf.idfila = dco.idcargo)
                where nf.idfila is null)";
                $conn->execute($sql, array($identidad));*/
                $conn->commit();
                return 1;
            } catch (Exception $e) {
                return 3;
            }
        }
    }
}
