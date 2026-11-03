<?php

class ConfiguracionesasistController extends ZendExt_Controller_Secure
{
    protected $confSesionModel;

    function init()
    {
        parent::init();
        $this->confSesionModel = new ConfHabilitarsesionesModel();
    }

    function configuracionesasistAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render('configuracionesasist');
    }

    function getLimitesAction()
    {
        $result = ConfHorasextras::getLimites();
        $r = array();
        foreach ($result as $v) {
            if ($v['id'] == 1) {
                $r[0]['idlimitediario'] = $v['id'];
                $r[0]['limitediario'] = $v['limite'];
            } else {
                $r[0]['idlimitemensual'] = $v['id'];
                $r[0]['limitemensual'] = $v['limite'];
            }
        }
        echo json_encode(
            array('datos' => $r)
        );
    }

    function setLimitesAction()
    {
        $idlimitediario = $this->_getParam('idlimitediario');
        $limitediario = $this->_getParam('limitediario');
        $idlimitemensual = $this->_getParam('idlimitemensual');
        $limitemensual = $this->_getParam('limitemensual');
        $result = true;
        $r = ConfHorasextrasModel::setLimiteshoras($idlimitediario, $limitediario, $idlimitemensual, $limitemensual);
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getHabilitadoAction()
    {
        $result = ConfHabilitarhorarioModel::getHabilitarhorario();
        echo json_encode($result);
    }

    function setHorarioAction()
    {
        $habilitado = $this->_getParam('habilitado');
        $idestructuras = json_decode(stripslashes($this->_request->getPost('idestructuras')));
        $r = ConfHabilitarhorarioModel::setHabilitarhorario($habilitado, $idestructuras);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getEstructurasHorarioAction()
    {
        try {
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
            } else {
                $id = $this->_getParam('node');
            }
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);

            $datos = array();
            $pos = 0;
            foreach ($r as $t => $est) {
                // if ($est->idconcepto != 7) {
                $datos[$pos] = $est;
                if ($this->_getParam('idestructura')) {
                    if ($this->_getParam('check') == 1) {
                        $obj = new ConfEstructurahorario();
                        $existe = $obj->getByIdEstructura($est->id);
                        if (count($existe) > 0) {
                            $datos[$pos]->checked = true;
                        } else {
                            $datos[$pos]->checked = false;
                        }
                    } else {
                        $datos[$pos]->checked = false;
                    }

                }
                $pos++;
                // }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(array());
        }
    }

    function getHabilitadoCAAction()
    {
        $result = array();
        $CA = ConfHabcontrolaccesoModel::getHabilitarcontrolacceso();
        foreach ($CA as $i => $ca) {
            if ($ca['idca'] == 1) {
                $result[0] = $ca;
            } else if ($ca['idca'] == 2) {
                $result[1] = $ca;
            } else if ($ca['idca'] == 3) {
                $result[2] = $ca;
            }
        }
        echo json_encode($result);
    }

    function getlistadoPuntoAccesoAction()
    {
        $result = ConfHabcontrolaccesoModel::getlistadoPuntoAcceso();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setPuntoAccesoAction()
    {
        $puntosacceso = json_decode(stripslashes($this->_request->getPost('puntosacceso')));
        $r = ConfHabcontrolaccesoModel::setPuntoAcceso($puntosacceso);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoEstructuraTempusAction()
    {
        $result = ConfHabcontrolaccesoModel::getlistadoEstructuraTempus();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function getlistadoEstructuraRelojAction()
    {
        $result = ConfHabcontrolaccesoModel::getlistadoEstructuraReloj();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setHabilitarCAAction()
    {
        $servicioweb = $this->_getParam('servicioweb');
        $dirservautent = $this->_getParam('dirserverautent');
        $dirservdatos = $this->_getParam('dirserverdatos');
        $basedatos = $this->_getParam('basedatos');
        $habCA = $this->_getParam('habilitadoCA');
        $habTempus = $this->_getParam('habilitadoTempus');
        $habReloj = $this->_getParam('habilitadoReloj');
        $idestructurastempus = json_decode(stripslashes($this->_request->getPost('idestructurastempus')));
        $idestructurasANVIZ = json_decode(stripslashes($this->_request->getPost('idestructurasANVIZ')));
        $puntosacceso = json_decode(stripslashes($this->_request->getPost('puntosacceso')));

        $r = ConfHabcontrolaccesoModel::setHabilitarcontrolacceso($servicioweb, $dirservautent,
            $dirservdatos, $basedatos, $idestructurastempus, $idestructurasANVIZ, $habCA, $habTempus, $habReloj, $puntosacceso);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getEstructurasCAAction()
    {
        try {
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
            } else {
                $id = $this->_getParam('node');
            }
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);

            $datos = array();
            $pos = 0;
            foreach ($r as $t => $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    if ($this->_getParam('idestructura')) {
                        if ($this->_getParam('check') == 1) {
                            $obj = new ConfEstructuratempus();
                            $existe = $obj->getByIdEstructura($est->id);
                            if (count($existe) > 0) {
                                $datos[$pos]->checked = true;
                            } else {
                                $datos[$pos]->checked = false;
                            }
                        } else {
                            $datos[$pos]->checked = false;
                        }

                    }
                    $pos++;
                }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(array());
        }
    }

    function comprobarConexionAction()
    {
        $dirapp = $this->_getParam('dirapp');
        $idestructura = $this->_getParam('idestructura');
        try {
            if (!mkdir(substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $idestructura)) {
                mkdir(substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $idestructura);
            }
            $config_file = substr(__FILE__, 0, strrpos(__FILE__, 'apps')) . 'apps/pvd/regimentrabajo/models/bussines/' . $idestructura . '/BTARJET.DBF';
            $f = copy($dirapp, $config_file);
            if ($f) {
                $result['success'] = true;
                $result['msg'] = 1;
            } else {
                $result['success'] = false;
                $result['msg'] = 3;
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
        echo(json_encode($result));
    }

    function comprobarConexionRelojAction()
    {
        try {
            $server_name = $this->_getParam('dirserver');
            $database_name = $this->_getParam('nombredb');
            $username = $this->_getParam('usuario');
            $password = $this->_getParam('contrasena');

            if (PHP_OS == 'WINNT') {
                $connectionInfo = array("Database" => $database_name, "UID" => $username, "PWD" => $password);
                $conn = sqlsrv_connect($server_name, $connectionInfo);
            } else {
                $conn = mssql_connect($server_name, $username, $password);
                mssql_select_db($database_name, $conn);
            }

            if ($conn != false) {
                $result['success'] = true;
                $result['msg'] = 1;
                if (PHP_OS == 'WINNT') {
                    sqlsrv_close($conn); // close connection
                } else {
                    mssql_close($conn); // close connection
                }
            } else {
                $result['success'] = false;
                $result['msg'] = 3;
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
        echo(json_encode($result));
    }

    public function getHabSesionesAction()
    {
        $result = $this->confSesionModel->gethabilitarsesiones();
        echo json_encode($result);
    }

    function setHabilitarsesionesAction()
    {
        $habsesion = $this->_getParam('habsesion');
        $r = $this->confSesionModel->sethabilitarsesiones($habsesion);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getHabilitadoCausaAction()
    {
        $result = ConfHabCausaModel::getHabilitarcausa();
        echo json_encode($result);
    }

    function setHabilitarCausaAction()
    {
        $habilitadoA = $this->_getParam('habilitadoA');
        $habilitadoT = $this->_getParam('habilitadoT');
        $habilitadoSA = $this->_getParam('habilitadoSA');
        $habilitadoTSA = $this->_getParam('habilitadoTSA');
        $r = ConfHabCausaModel::setHabilitarcausa($habilitadoA, $habilitadoT, $habilitadoSA, $habilitadoTSA);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getHabSubVacAction()
    {
        $result = ConfHabilitarsubvacModel::getHabilitarSubVac();
        echo json_encode($result);
    }

    function setHabSubVacAction()
    {
        $habilitado = $this->_getParam('habsubvac');
        $r = ConfHabilitarsubvacModel::setHabilitarsubvac($habilitado);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getHabFinmesAction()
    {
        $result = ConfHabilitarfinmesModel::getHabilitarfinmes();
        echo json_encode($result);
    }

    function setHabFinmesAction()
    {
        $habilitado = $this->_getParam('habfinmes');
        $r = ConfHabilitarfinmesModel::setHabilitarfinmes($habilitado);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoHorarioNoctAction()
    {
        $result = ConfHabhorarionocturnidadModel::getlistadoHorarioNoct();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setHabilitarHorarioNoctAction()
    {
        $horarios = json_decode(stripslashes($this->_request->getPost('horarios')));
        $r = ConfHabhorarionocturnidadModel::setHabilitarlistadoHorarioNoct($horarios);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoCategoriasAction()
    {
        $obj = new ConfCategoriacausas();
        $result = $obj->getcategorias();
        foreach ($result['datos'] as $key => $cat) {
            $objFT = new ConfFondodetiempo();
            $FT = $objFT->existeFT($cat['idcategoriapersona']);
            $result['datos'][$key]['fondodetiempo'] = $FT[0]['fondodetiempo'];
            if (!empty($FT))
                $result['datos'][$key]['check'] = 1;
        }
        echo json_encode($result);
    }

    function getlistadoCausasAction()
    {
        $idcategoria = $this->_getParam('idcategoria');
        $result = NomCausa::GetLeafs();
        $obj = new ConfCategoriacausas();
        if (!empty($idcategoria)) {
            $causasbycateg = $obj->getCausasByCateg($idcategoria);
            foreach ($result as $key => $causa) {
                foreach ($causasbycateg as $causabycat) {
                    if ($causa['idcausa'] == $causabycat['idcausa']) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setCategoriaCausasAction()
    {
        $idcausas = json_decode(stripslashes($this->_request->getPost('causas')));
        $idcategoria = $this->_getParam('categoria');
        $fondotiempo = $this->_getParam('fondotiempo');
        $obj = new ConfCategoriacausasModel();
        $r = $obj->addCategoriacausas($idcategoria, $idcausas);
        $rest = $obj->addCategoriaFT($idcategoria, $fondotiempo);
        $result = true;
        if ($r == false && $rest == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoCausasCertAction()
    {
        $result = NomCausa::GetLeafs();
        $obj = new ConfHabcertificados();
        $causas = $obj->getHabilitarcausacertificados();
        foreach ($result as $key => $causa) {
            foreach ($causas as $causascert) {
                if ($causa['idcausa'] == $causascert['idcausa']) {
                    $result[$key]['check'] = 1;
                    break;
                } else
                    $result[$key]['check'] = 0;
            }
        }

        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setCausasCertificadosAction()
    {
        $idscausas = json_decode(stripslashes($this->_request->getPost('causas')));
        try {
            $domain = new ConfHabcertificados();
            $domain->DelCertificados();
            foreach ($idscausas as $v) {
                $existe = $domain->existe($v);
                if (count($existe) == 0) {
                    $obj = new ConfHabcertificados();
                    $obj->idcausa = $v;
                    $obj->save();
                }
            }
            $result = true;
        } catch (Exception $e) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoGruposAction()
    {
        $omGrupodescanso = new NomGrupodescanso();
        $result = $omGrupodescanso->getGrupoDescansoRegimenActive(-1, null, 0);
        $obj = new ConfHabgrupospredeterminados();
        $grupos = $obj->getHabilitargrupospredeterminados();
        foreach ($result as $key => $grupo) {
            foreach ($grupos as $g) {
                if ($grupo['idgrupodescanso'] == $g['idgrupodescanso']) {
                    $result[$key]['check'] = 1;
                    break;
                } else
                    $result[$key]['check'] = 0;
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setGruposAction()
    {
        $idsgrupos = json_decode(stripslashes($this->_request->getPost('grupos')));
        $idsusuario = json_decode(stripslashes($this->_request->getPost('usuarios')));
        try {
            $domain = new ConfHabgrupospredeterminados();
            $domain->Delgrupospredeterminados();
            foreach ($idsgrupos as $v) {
                $existe = $domain->existe($v);
                if (count($existe) == 0) {
                    $obj = new ConfHabgrupospredeterminados();
                    $obj->idgrupodescanso = $v;
                    $obj->save();
                }
            }
            $domainUser = new ConfHabusuarios();
            $domainUser->Delusuario();
            foreach ($idsusuario as $v) {
                $existeuser = $domainUser->existe($v);
                if (count($existeuser) == 0) {
                    $objuser = new ConfHabusuarios();
                    $objuser->idusuario = $v;
                    $objuser->save();
                }
            }
            $result = true;
        } catch (Exception $e) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getUsuariosAction()
    {
        $obj = new ConfHabusuarios();
        $result = $obj->getAllUsuarios();
        $usuarios = $obj->getUsuarios();
        foreach ($result as $key => $grupo) {
            foreach ($usuarios as $g) {
                if ($grupo['idusuario'] == $g['idusuario']) {
                    $result[$key]['check'] = 1;
                    break;
                } else
                    $result[$key]['check'] = 0;
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function getHorasDiasAction()
    {
        $result = ConfHorasdias::getHorasDias();
        echo json_encode($result);
    }

    function setHorasDiasAction()
    {
        $id = $this->_getParam('id');
        $result = true;
        $r = ConfHorasdiasModel::setHorasDias($id);
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    private function setHorasDias($id, $horasdias)
    {
        try {
            $horasdiasobj = ConfHorasdias::getById($id);
            if ($id == 1) {
                $horasdiasobj->id = $id;
                $horasdiasobj->horasdias = 1;
            } else if ($id == 2) {
                $horasdiasobj->id = $id;
                $horasdiasobj->horasdias = 2;
            }
            $horasdiasobj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    function getHabilitadoCargosnofirmanAction()
    {
        $result = ConfCargosnofirmanModel::getHabilitarcargosnofirman();
        echo json_encode($result);
    }

    function setCargosnofirmanAction()
    {
        $habilitado = $this->_getParam('habilitado');
        $idcargos = json_decode(stripslashes($this->_request->getPost('idestructuras')));
        $r = ConfCargosnofirmanModel::setHabilitarcargosnofirman($habilitado, $idcargos);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getCargosNofirmanAction()
    {
        try {
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
            } else {
                $id = $this->_getParam('node');
            }
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);

            $datos = array();
            $pos = 0;
            foreach ($r as $t => $est) {
                //if ($est->idconcepto != 7) {
                $datos[$pos] = $est;
                if ($this->_getParam('idestructura')) {
                    if ($this->_getParam('check') == 1) {
                        $obj = new ConfCargosnofirman();
                        $existe = $obj->getByIdCargo($est->id);
                        if (count($existe) > 0) {
                            $datos[$pos]->checked = true;
                        } else {
                            $datos[$pos]->checked = false;
                        }
                    } else {
                        $datos[$pos]->checked = false;
                    }

                }
                $pos++;
                // }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(array());
        }
    }


    function getlistadoCausasRepAction()
    {
        $idconcepto = $this->_getParam('idconcepto');
        $result = NomCausa::GetLeafs();
        if (!empty($idconcepto)) {
            $obj = new ConfResumenausentismocausas();
            $causasbyconcepto = $obj->getCausasByConcepto(array($idconcepto));
            foreach ($result as $key => $causa) {
                foreach ($causasbyconcepto as $causabyconc) {
                    if ($causa['idcausa'] == $causabyconc['idcausa']) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setConceptoCausasAction()
    {
        $idcausas = json_decode(stripslashes($this->_request->getPost('causas')));
        $idconcepto = $this->_getParam('idconcepto');
        $r = $this->addConceptocausas($idconcepto, $idcausas);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    public function addConceptocausas($idconcepto, $idscausas)
    {
        try {
            $domain = new ConfResumenausentismocausas();
            $domain->DelConceptoCausa($idconcepto);
            foreach ($idscausas as $v) {
                $existe = $domain->existe($v, $idconcepto);
                if (count($existe) == 0) {
                    $obj = new ConfResumenausentismocausas();
                    $obj->idconcepto = $idconcepto;
                    $obj->idcausa = $v;
                    $obj->save();
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }


    function getlistadoCausasPromTrabAction()
    {
        $result = NomCausa::GetLeafs();
        $obj = new ConfCausasadicionesdeduciones();
        $causas = $obj->getCausasadicionesdeduciones();
        foreach ($result as $key => $causa) {
            if (!empty($causas)) {
                foreach ($causas as $causaadd) {
                    if ($causa['idcausa'] == $causaadd['idcausa']) {
                        $result[$key]['adiciondeducion'] = ($causaadd['adiciondeducion'] == 1) ? 'Adición' : 'Dedución';
                        break;
                    } else
                        $result[$key]['adiciondeducion'] = '';
                }
            } else
                break;
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function guardarCausasAction()
    {
        $causas = json_decode(stripslashes($this->_request->getPost('causas')));
        $accion = $this->_getParam('accion');
        try {
            $domain = new ConfCausasadicionesdeduciones();
            foreach ($causas as $v) {
                $existe = $domain->existe($v);
                if (count($existe) == 0) {
                    $obj = new ConfCausasadicionesdeduciones();
                    $obj->idcausa = $v;
                    $obj->adiciondeducion = $accion;
                    $obj->save();
                } else {
                    $dat = $domain->getById($existe[0]['id']);
                    $dat->idcausa = $v;
                    $dat->adiciondeducion = $accion;
                    $dat->save();
                }
            }
            $result = true;
        } catch (Exception $e) {
            $result = false;
        }
        echo json_encode($result);
    }


    function getlistadoConceptosONEIAction()
    {
        $ConfConceptosCausasONEIModel = new ConfConceptosCausasONEIModel();
        $result = $ConfConceptosCausasONEIModel->getlistadoConceptosONEI();
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function adicionarConceptoAction()
    {
        $concepto = $this->_getParam('concepto');
        $orden = $this->_getParam('orden');
        $r = ConfConceptosCausasONEIModel::guardarConceptosONEI($concepto,$orden);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function modificarConceptoAction()
    {
        $idconcepto = $this->_getParam('idconcepto');
        $concepto = $this->_getParam('concepto');
        $orden = $this->_getParam('orden');
        $r = ConfConceptosCausasONEIModel::modConceptosONEI($idconcepto, $concepto,$orden);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function eliminarConceptoAction()
    {
        $idconcepto = $this->_getParam('idconcepto');
        $r = ConfConceptosCausasONEIModel::delConceptosONEI($idconcepto);
        $resp = ConfConceptoCausasONEI::DelConceptoCausa($idconcepto);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    function getlistadoCausasONEIAction()
    {
        $idconcepto = $this->_getParam('idconcepto');
        $result = NomCausa::GetLeafs();
        if (!empty($idconcepto)) {
            $obj = new NomConceptos();
            $causasbyconcepto = $obj->getCausasByConcepto($idconcepto);
            foreach ($result as $key => $causa) {
                foreach ($causasbyconcepto as $causabyconc) {
                    if ($causa['idcausa'] == $causabyconc['idcausa']) {
                        $result[$key]['check'] = 1;
                        break;
                    } else
                        $result[$key]['check'] = 0;
                }
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setConceptoCausasONEIAction()
    {
        $idcausas = json_decode(stripslashes($this->_request->getPost('causas')));
        $idconcepto = $this->_getParam('idconcepto');
        $r = $this->addConceptocausasONEI($idconcepto, $idcausas);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }

    public function addConceptocausasONEI($idconcepto, $idscausas)
    {
        try {
        $domain = new ConfConceptocausasONEI();
        $domain->DelConceptoCausa($idconcepto);
        foreach ($idscausas as $v) {
            $existe = $domain->existeConceptoCausa($v, $idconcepto);
            if (count($existe) == 0) {
                $obj = new ConfConceptocausasONEI();
                $obj->idconcepto = $idconcepto;
                $obj->idcausa = $v;
                $obj->save();
            }
        }
        return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getHabMultiplesCausasAction()
    {
        $result = (new ConfHabilitarmultiplescausas())->gethabilitarmultiplescausas();
        echo json_encode($result);
    }

    function setHabMultiplesCausasAction()
    {
        $habvariascausas = $this->_getParam('habilitado');
        $r = (new ConfHabilitarmultiplescausas())->sethabilitarmultiplescausas($habvariascausas);
        $result = true;
        if ($r == false) {
            $result = false;
        }
        echo json_encode($result);
    }



}

?>