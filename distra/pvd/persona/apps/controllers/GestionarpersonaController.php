<?php
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$config['include_path'] = get_include_path();

$d = explode('web/',$dirabsmt);
$p = "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/controllers/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/controllers/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/bussines/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/domain/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/domain/generated/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/services/";
$config["include_path"] .= $p;
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

//Include PHPExcel to import person data
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/PHPExcel.php');
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/PHPExcel/PHPExcel/IOFactory.php');


/**
 * Class GestionarpersonaController
 */
class GestionarpersonaController extends ControladorBase
{
    /**
     * @var
     */
    protected $_gestPerson, $_objFoto, $_objPersona, $_objFenotipico, $_objDirecciones, $_objNacionality,
        $_objDocIdentidad, $_objContacto, $_objBirthdata, $_objAccesoSinDominio, $_objLanguage, $_objCiudadanias,
        $_objSanciones, $_objCondecoraciones, $_objAfiliaciones, $_objCargosAfiliacion, $_objEstanciaExterior,
        $_objAfeccion, $_objEstadoSalud, $_objEducaion, $_objCategorizacion, $_objCat, $_objCategorizacionCientifica,
        $_objGrados, $_objCuentaBancaria, $_objRegimen, $_objFrom, $_objTrayectoriaLaboral, $_objOcupacionTiempoGuerra,
        $_objFamilairViaje, $_objFamiliarExterior, $_objFamiliarRelaciones, $_objFamiliarSancionado, $__objEst,
        $_objCentroEstudio, $__objMisiones, $_objOrganizacion, $_objTitulo,$_objPsicometrico;

    /**
     *
     */
    public function init()
    {
        parent::init();
        $this->_gestPerson = new GestionarpersonaModel();
        $this->_objFoto = new DatFotoModel();
        $this->_objPersona = new DatPersonaModel();
        $this->_objFenotipico = new DatFenotipoModel();
        $this->_objDirecciones = new DatDireccionModel();
        $this->_objNacionality = new DatNacionalidadModel();
        $this->_objDocIdentidad = new DatDocidentidadModel();
        $this->_objContacto = new DatContactoModel();
        $this->_objBirthdata = new DatDatosnacimientoModel();
        $this->_objAccesoSinDominio = new SegAccesosindominioModel();
        $this->_objLanguage = new DatIdiomaModel();
        $this->_objCiudadanias = new DatCiudadaniaModel();
        $this->_objSanciones = new DatSancionModel;
        $this->_objCondecoraciones = new DatCondecoracionModel();
        $this->_objAfiliaciones = new DatAfiliacionModel();
        $this->_objEstanciaExterior = new DatEstanciaexteriorModel();
        $this->_objCargosAfiliacion = new DatCargoorganizacionModel();
        $this->_objAfeccion = new DatAfeccionModel();
        $this->_objEstadoSalud = new DatEstadosaludModel();
        $this->_objEducaion = new DatEducacionModel();
        $this->_objCategorizacion = new DatCategorizacionModel();
        $this->_objCat = new DatCategoriaModel();
        $this->_objCategorizacionCientifica = new DatCategorizacioncientificaModel();
        $this->_objGrados = new DatGradomilitarModel();
        $this->_objCuentaBancaria = new DatCuentabancariaModel();
        $this->_objRegimen = new DatRegimentrabajoModel();
        $this->_objTrayectoriaLaboral = new HisTrayectorialaboralModel();
        $this->_objOcupacionTiempoGuerra = new DatOcupaciontiempoguerraModel();
        $this->_objFamilairViaje = new DatFamiliarviajeModel();
        $this->_objFamiliarExterior = new DatFamiliarexteriorModel();
        $this->_objFamiliarRelaciones = new DatFamiliarresidenteModel();
        $this->_objFamiliarSancionado = new DatFamiliarsancionadoModel();
        $this->_objEst = new DatOcupaciontiempoguerraModel();
        $this->_objCentroEstudio = new NomCentroestudioModel();
        $this->_objMisiones = new NomMisionModel();
        $this->_objOrganizacion = new NomOrganizacionModel();
        $this->_objTitulo = new NomTituloModel();
        $this->_objPsicometrico = new DatCaracterizacionModel();
    }

    /**
     *
     */
    public function loadTreeConceptAction()
    {
        try {
            if ($this->_getParam('idproyecto') != '') {
                $idusuario = $this->global->Perfil->idusuario;
                $arrRoles = $this->integrator->seguridad->getRolesbyUser($idusuario);
                $objDatProyecRol = new DatProyectorolModel();
                $roles = array();
                foreach ($arrRoles as $v) {
                    $roles[] = $v['idrol'];
                }
                $this->response = $objDatProyecRol->getTreeConceptByRol(
                    $roles, $this->_getParam('idproyecto')
                );
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $error
     */
    public function responseExceptions($error)
    {
        $this->response->success = false;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    /**
     *
     */
    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    /**
     *
     */
    public function addPersonAction()
    {
        try {
            $datos = json_decode($this->_getParam('datos'));
            $persona = json_decode($this->_getParam('persona'));           
            $fotoPrincipal = $this->_getParam('fotoPrincipal');
            $foto1 = explode('data:image/jpg;base64,', $fotoPrincipal);
            $indixes = array(
                'nombre' => '', 'snombre' => null, 'papel' => '', 'sapel' => '', 'idsuin' => '', 'sexo' => '');
            $valores = array();
            foreach ($indixes as $k => $v) {
                switch ($k) {
                    case 'feliminado':
                    case 'snombre':
                    case 'fregistro':
                        $valores[$k] = $persona->$k ? $persona->$k : $v;
                        break;
                    case 'sexo':
                        if ($persona->$k == '1')
                            $valores[$k] = 1;
                        else if ($persona->$k == '0')
                            $valores[$k] = 0;
                        else
                            $valores[$k] = $persona->$k;
                        break;
                    default:
                        $valores[$k] = trim($persona->$k);
                        break;
                }
            }
            $existenum = $this->_objDocIdentidad->existeDocIdentidadByNumero(
                $persona->idtipodocidentidad, $persona->numid, null
            );
            if ($existenum == 0) {
                $collectionFotos = $this->addImagenesAction('get');
                if (count($collectionFotos) == 0) {
                    $collectionFotos = array();
                    $collectionFotos[0] = new stdClass();
                    $collectionFotos[0]->foto = $foto1[1];
                    $collectionFotos[0]->principal = 1;
                    $collectionFotos[0]->desde = date('d/m/Y');
                    $collectionFotos[0]->hasta = null;
                    $collectionFotos[0]->descripcion = "";
                }
                $valores['idpersona'] = $this->_objPersona->addPersonaCollection(
                    $valores, array('DatFoto' => $collectionFotos)
                );
                $valoresdocidentidad = array(
                    array(
                        'idtipodocidentidad' => $persona->idtipodocidentidad, 'serie' => null,
                        'numero' => $persona->numid,
                        'principal' => 1, 'fdesde' => null, 'fhasta' => null));
                $this->_objDocIdentidad->addDocIdentidad($valoresdocidentidad, $valores['idpersona']);
                $this->addAccesoSinDominio(array($valores['idpersona']));
                $foto = $this->_objFoto->getFotoPrincipal(array($valores['idpersona']));
                $doc = DatDocidentidad::getDocIdentidadPrincipalByPersona($valores['idpersona']);
                $valores['foto'] = $foto['imgbase64'];
                $valores['idtipodocidentidad'] = $persona->idtipodocidentidad;
                $valores['numid'] = $doc['numero'];
                $valores['denominacion'] = $doc['denomtipodocidentidad'];
                $valores['mincaracter'] = $doc['mincaracter'];
                $valores['maxcaracter'] = $doc['maxcaracter'];
                $valores['type'] = $doc['type'];
                $this->response->datos = $valores;
                if (!empty($datos) && isset($datos)) {
                    $this->adicionarDatosFenotipicos($datos, $valores['idpersona']);
                    //Adicionar datos de nacimiento:
                    $idpais = $this->getIdPais($datos[0]->idpaisnac);
                    $idmunic = $this->getIdMunicipio($datos[0]->idmunicipionac);
                    $idprov = $this->getIdProvincia($datos[0]->idmunicipionac);
                    $this->adicionarDatosNacimiento($datos, $valores['idpersona'], $idpais, $idmunic, $idprov);
                    //Adicionar direccion:
                    $idmunicres = $this->getIdMunicipio($datos[0]->idmunicipiores);
                    $idprovres = $this->getIdProvincia($datos[0]->idmunicipiores);
                    $idpaisres = $this->getIdPaisPorCodigo($datos[0]->idmunicipiores);
                    $this->adicionarDireccion($datos, $valores['idpersona'], $idmunicres, $idprovres, $idpaisres);
                }
            } else {
                throw new Exception("El número de identidad ya existe", 5);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    private function adicionarDatosFenotipicos($datos, $idpersona)
    {
        $indixesFenotipicos = array(
            'idcolorojos' => '', 'idcolorpiel' => '', 'idcolorpelo' => '', 'idgruposanguineo' => 'NULL',
            'pesocorporal' => null, 'estatura' => null, 'observaciones' => null);
        $valoresFenotipicos = array();
        foreach ($indixesFenotipicos as $k => $v) {
            switch ($k) {
                case 'observaciones':
                    $valoresFenotipicos[$k] = null;
                    break;
                case 'pesocorporal':
                    $valoresFenotipicos[$k] = $datos[0]->peso != '' ? $datos[0]->peso : null;
                    break;
                case 'estatura':
                    $valoresFenotipicos[$k] = $datos[0]->estatura != '' ? $datos[0]->estatura : null;
                    break;
                case 'idgruposanguineo':
                    $valoresFenotipicos[$k] = null;
                    break;
                case 'idcolorojos':
                    $valoresFenotipicos[$k] = $datos[0]->idcolorojos != '' ? $datos[0]->idcolorojos : null;
                    break;
                case 'idcolorpiel':
                    $valoresFenotipicos[$k] = $datos[0]->idcolorpiel;
                    break;
                case 'idcolorpelo':
                    $valoresFenotipicos[$k] = $datos[0]->idcolorpelo != '' ? $datos[0]->idcolorpelo : null;
                    break;
            }
        }
        $valoresFenotipicos['idfenotipo'] = $this->_objFenotipico->addDatosFenotipicos(
            $valoresFenotipicos, $idpersona
        );
    }

    private function getIdPais($idpaisSuin)
    {
        $idpais = $this->_objPersona->getIdPais($idpaisSuin);
        return $idpais;
    }

    private function getIdMunicipio($idmunicSuin)
    {
        $idMunic = $this->_objPersona->getIdMunicipio($idmunicSuin);
        return $idMunic;
    }

    private function getIdProvincia($idmunicSuin)
    {
        $idProv = $this->_objPersona->getIdProvincia($idmunicSuin);
        return $idProv;
    }

    private function getIdPaisPorCodigo($idmunicSuin)
    {
        $idPais = $this->_objPersona->getIdPaisPorCodigo($idmunicSuin);
        return $idPais;
    }

    private function adicionarDatosNacimiento($datos, $idpersona, $idpais, $idmunic, $idprov)
    {
        $indixesNacimiento = array(
            'fechanacimiento' => '', 'nombremadre' => null, 'nombrepadre' => null, 'registrocivil' => null,
            'tomo' => null, 'folio' => null, 'idpais' => null,
            'idprovincia' => null, 'idmunicipio' => null, 'localidad' => null, 'idpersona' => '',);
        $valoresNacimiento = array();
        foreach ($indixesNacimiento as $k => $v) {
            switch ($k) {
                case 'fechanacimiento':
                    if (empty($datos[0]->fechanacimiento)) {
                        $carne = $datos[0]->numid;
                        $anno = substr($carne, 0, 2);
                        $mes = substr($carne, 2, 2);
                        $dia = substr($carne, 4, 2);
                        if ($anno > 30) {
                            $fechanacimiento = $dia . '/' . $mes . '/19' . $anno;
                        } else {
                            $fechanacimiento = $dia . '/' . $mes . '/20' . $anno;
                        }
                        $valoresNacimiento[$k] = $fechanacimiento;
                    } else {
                        $valoresNacimiento[$k] = $datos[0]->fechanacimiento;
                    }
                    break;
                case 'nombremadre':
                    $valoresNacimiento[$k] = $datos[0]->nomma;
                    break;
                case 'nombrepadre':
                    $valoresNacimiento[$k] = $datos[0]->nompa;
                    break;
                case 'registrocivil':
                    $valoresNacimiento[$k] = $datos[0]->registrocivil;
                    break;
                case 'tomo':
                    $valoresNacimiento[$k] = $datos[0]->tomo;
                    break;
                case 'folio':
                    $valoresNacimiento[$k] = $datos[0]->folio;
                    break;
                case 'idpais':
                    $valoresNacimiento[$k] = $idpais;
                    break;
                case 'idprovincia':
                    $valoresNacimiento[$k] = $idprov;
                    break;
                case 'idmunicipio':
                    $valoresNacimiento[$k] = $idmunic;
                    break;
                case 'localidad':
                    $valoresNacimiento['localidad'] = null;
                    break;
            }
        }
        $this->_objBirthdata->addBirthdata(
            $valoresNacimiento, $idpersona
        );
    }

    private function adicionarDireccion($datos, $idpersona, $idmunicres, $idprovres, $idpaisres)
    {
        $objDireccion = new DatDireccion();
        $objDireccion->idpersona = $idpersona;
        $objDireccion->fdesde = $datos[0]->fechares;
        $objDireccion->direccion = $datos[0]->direccion;
        $objDireccion->idmunicipio = $idmunicres;
        $objDireccion->idprovincia = $idprovres;
        $objDireccion->idpais = $idpaisres;
        $objDireccion->save();
    }

    /**
     * @param string $accion
     *
     * @return array
     */
    public function addImagenesAction($accion = 'save')
    {
        try {
            $fotos = json_decode($this->_getParam('fotos'));
            $persona = json_decode($this->_getParam('persona'));
            $indixes = array(
                'foto' => '', 'principal' => 0, 'fdesde' => '', 'fhasta' => null, 'descripcion' => null);
            $valores = array();
            $p = 0;
            foreach ($fotos->addImgs as $val) {
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'descripcion':
                        case 'fhasta':
                            $valores[$p]->$k = $val->$k ? $val->$k : $v;
                            break;
                        case 'foto':
                            $valores[$p]->$k = $val->imgbase64;
                            break;
                        case 'principal':
                            $valores[$p]->$k = ($fotos->setPrinc == $val->idfoto) ? 1 : $v;
                            break;
                        default:
                            $valores[$p]->$k = $val->$k;
                            break;
                    }
                }
                $p++;
            }
            if ($accion == 'save') {
                $this->_objFoto->addFotos($valores, $persona->idpersona);
            } else {
                return $valores;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     * @param array $idpersona
     */
    public function addAccesoSinDominio(array $idpersona)
    {
        try {
            $idusuario = $this->global->Perfil->idusuario;
            $this->_objAccesoSinDominio->addAccesoSinDominio($idpersona, $idusuario);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     *
     */
    public function modPersonAction()
    {
        try {
            $datos = json_decode($this->_getParam('datos'));
            $persona = json_decode($this->_getParam('persona'));
            $indixes = array(
                'idpersona' => '', 'nombre' => '', 'snombre' => null, 'papel' => '', 'sapel' => '', 'sexo' => '');
            $valores = array();
            foreach ($indixes as $k => $v) {
                switch ($k) {
                    case 'feliminado':
                    case 'snombre':
                    case 'fregistro':
                        $valores[$k] = $persona->$k ? $persona->$k : $v;
                        break;
                    default:
                        $valores[$k] = trim($persona->$k);
                        break;
                }
            }
            $existenum = $this->_objDocIdentidad->existeDocIdentidadByNumero(
                $persona->idtipodocidentidad, $persona->numid, $valores['idpersona']
            );
            if ($existenum == 0) {
                $this->_objPersona->modPersona($valores);
                $valoresdocidentidad = array(
                    array(
                        'idtipodocidentidad' => $persona->idtipodocidentidad, 'serie' => null,
                        'numero' => $persona->numid,
                        'principal' => 1, 'fdesde' => null, 'fhasta' => null));
                $docprin = DatDocidentidad::getDocIdentidadPrincipalByPersona($valores['idpersona']);

                if (!empty($docprin)) {
                    $valoresmoddocidentidad[$docprin['iddocidentidad']] = $valoresdocidentidad[0];
                    $valoresmoddocidentidad[$docprin['iddocidentidad']]['iddocidentidad'] = $docprin['iddocidentidad'];
                    $valoresmoddocidentidad[$docprin['iddocidentidad']]['fdesde'] = $docprin['fdesde'];
                    $this->_objDocIdentidad->modDocIdentidad(
                        $valoresmoddocidentidad, array($docprin['iddocidentidad']), $valores['idpersona']
                    );
                } else {
                    $this->_objDocIdentidad->addDocIdentidad($valoresdocidentidad, $valores['idpersona']);
                }
                $this->modImagenesAction();
                $foto = $this->_objFoto->getFotoPrincipal(array($valores['idpersona']));

                $doc = DatDocidentidad::getDocIdentidadPrincipalByPersona($valores['idpersona']);
                $valores['foto'] = $foto['imgbase64'];
                $valores['idtipodocidentidad'] = $persona->idtipodocidentidad;
                $valores['numid'] = $doc['numero'];
                $valores['denominacion'] = $doc['denomtipodocidentidad'];
                $valores['mincaracter'] = $doc['mincaracter'];
                $valores['maxcaracter'] = $doc['maxcaracter'];
                $valores['type'] = $doc['type'];
                $this->response->datos = $valores;
                if (!empty($datos) && isset($datos)) {
                    //Adicionar datos fenotipicos:
                    $this->adicionarDatosFenotipicos($datos, $valores['idpersona']);
                    //Adicionar datos de nacimiento:
                    $idpais = $this->getIdPais($datos[0]->idpaisnac);
                    $this->adicionarDatosNacimiento($datos, $valores['idpersona'], $idpais);
                    //Adicionar direccion:
                    $this->adicionarDireccion($datos, $valores['idpersona']);
                }
            } else {
                throw new Exception("El número de identidad ya existe", 5);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modImagenesAction()
    {
        try {
            $fotos = json_decode($this->_getParam('fotos'));
            $this->delImagenesAction('local');
            if (is_numeric($fotos->setPrinc)) {
                $this->_objFoto->setAsFotoPrincipal(array($fotos->setPrinc), array($fotos->orgImg));
            } else {
                $this->_objFoto->setAsFotoPrincipal(array(-1), array($fotos->orgImg));
            }
            $this->addImagenesAction();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     *
     */
    public function delImagenesAction($accion)
    {
        try {
            $fotos = json_decode($this->_getParam('fotos'));
            $this->_objFoto->delFotos($fotos->delImgs);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delPersonAction()
    {
        try {
            $persona = json_decode($this->_getParam('arrPersons'));
            $this->_objPersona->delPersonas($persona);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function restPersonAction()
    {
        try {
            $persona = json_decode($this->_getParam('arrPersons'));
            $this->_objPersona->restPerson($persona);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getTipoDocIdentificacionAction()
    {
        try {
            $objModel = new NomTipodocidentidadModel();
            $this->response = $objModel->getTipoDocIdentidadActivo(
                $this->_getParam('query'), $this->_getParam('limit'), $this->_getParam('start')
            );
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getDocIdentidadAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objDocIdentidad->getDocIdentidad($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual obtener los doc identidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modDocIdentidadAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'iddocidentidad' => '', 'idtipodocidentidad' => '', 'serie' => '', 'numero' => '', 'principal' => 0,
                    'fdesde' => '', 'fhasta' => null);
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->iddocidentidad;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'iddocidentidad':
                                $arrIds[] = $v->$i;
                                break;
                            case 'principal':
                                $valores[$p][$i] = ($v->$i) ? 1 : 0;
                                break;
                            case 'fhasta':
                                $valores[$p][$i] = ($v->$i) ? $v->$i : null;
                                break;
                            case 'serie':
                                $valores[$p][$i] = ($v->$i) ? $v->$i : null;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delDocIdentidadAction('local');
                $this->addDocIdentidadAction('local');
                $this->_objDocIdentidad->modDocIdentidad($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual asignar los doc de identidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delDocIdentidadAction($accion)
    {
        try {
            $this->_objDocIdentidad->delDocIdentidad(
                json_decode($this->_getParam('arrDel')), $this->_getParam('idpersona')
            );
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function addDocIdentidadAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idtipodocidentidad' => '', 'serie' => '', 'numero' => '', 'principal' => 0, 'fdesde' => '',
                    'fhasta' => null);
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'principal':
                                $valores[$p][$i] = ($v->$i) ? 1 : 0;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objDocIdentidad->addDocIdentidad($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar los doc de identidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getImagenesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objFoto->getFotosByPersona(
                    $this->_getParam('idpersona'), $this->_getParam('query') != '' ? $this->_getParam('query') : null,
                    $this->_getParam('limit') != '' ? $this->_getParam('limit') : null,
                    $this->_getParam('start') != '' ? $this->_getParam('start') : null,
                    json_decode($this->_getParam('delimgs')) != '' ? json_decode($this->_getParam('delimgs')) : array(), false
                );
            } else {
                throw new Exception('No existe persona a la cual asignar los doc de identidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getDatosFenotipicosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $data = $this->_objFenotipico->getDatosFenotipicosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = ($data->quantity > 0) ? $data->data[0] : array();
            } else {
                throw new Exception('No existe persona a la cual obtener los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function addDatosFenotipicosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idcolorojos' => '', 'idcolorpiel' => '', 'idcolorpelo' => '', 'idgruposanguineo' => null,
                    'pesocorporal' => null, 'estatura' => null, 'observaciones' => null);
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'observaciones':
                            $valores[$k] = null;
                            break;
                        case 'pesocorporal':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'estatura':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'idgruposanguineo':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'idcolorojos':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'idcolorpiel':
                            $valores[$k] = $this->_getParam($k);
                            break;
                        case 'idcolorpelo':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                    }
                }
                $valores['idfenotipo'] = $this->_objFenotipico->addDatosFenotipicos(
                    $valores, $this->_getParam('idpersona')
                );
                $data = $this->_objFenotipico->getDatosFenotipicosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modDatosFenotipicosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idfenotipo' => '', 'idcolorojos' => '', 'idcolorpiel' => '', 'idcolorpelo' => '',
                    'idgruposanguineo' => 'NULL', 'pesocorporal' => null, 'estatura' => null, 'observaciones' => null);
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'observaciones':
                        case 'pesocorporal':
                        case 'estatura':
                        case 'idcolorojos':
                        case 'idcolorpelo':
                        case 'idgruposanguineo':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        default:
                            $valores[$k] = $this->_getParam($k);
                            break;
                    }
                }
                $this->_objFenotipico->modDatosFenotipicos($valores, $this->_getParam('idpersona'));
                $data = $this->_objFenotipico->getDatosFenotipicosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delDatosFenotipicosAction()
    {
        try {
        } catch (Exception $e) {
        }
    }

    /**
     *
     */
    public function getDireccionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objDirecciones->getDireccionesByPesona(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona de la cual obtener las direcciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getTreeProvMuniAction()
    {
        try {
            $this->response = $this->_objDirecciones->getTreeProvMuni($this->_getParam('idpais', null));
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCountrysAction()
    {
        try {
            $this->response->contrys = $this->_objBirthdata->getContrys();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modDireccionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'iddireccion' => '', 'idprovincia' => '', 'idmunicipio' => '', 'direccion' => '', 'oficial' => 0,
                    'fdesde' => '', 'fhasta' => null);
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->iddireccion;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'iddireccion':
                                $arrIds[] = $v->$i;
                                break;
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delDireccionesAction('local');
                $this->addDireccionesAction('local');
                $this->_objDirecciones->modDirecciones($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar las direcciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delDireccionesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objDirecciones->delDirecciones($datos);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function addDireccionesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idpais' => '',
                    'idprovincia' => '',
                    'idmunicipio' => '',
                    'direccion' => '',
                    'oficial' => 0,
                    'fdesde' => '',
                    'fhasta' => null
                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objDirecciones->addDirecciones($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar las direcciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto nacionalidad
     */
    public function getNationalityByIdpersonAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objNacionality->getNationalityByIdperson(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la nacionalidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function changeNationalitysAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idnacionalidadp' => '', 'idnacionalidad' => '', 'fdesde' => '', 'fhasta' => null, 'activa' => 0);
                foreach ($datos as $val) {
                    $l = $val->idnacionalidadp;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idnacionalidadp':
                                $arrIds[] = $val->$k;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->removeNationalitysAction('local');
                $add = $this->addNationalitysAction('local');
                $this->_objNacionality->changeNationalitys($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual asignar alguna nacionalidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function removeNationalitysAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objNacionality->removeNationalitys($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addNationalitysAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idnacionalidad' => '', 'fdesde' => '', 'fhasta' => null, 'activa' => 0);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objNacionality->addNationalitys($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar los doc de identidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getContactosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objContacto->getContactos(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe la persona de la cual obtener los contactos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    //Fin del concepto de nacionalidad
    /**
     *
     */
    public function modContactosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idcontacto' => '', 'contacto' => '', 'idtipomediocontacto' => '',
                    'idtipocontacto' => '', 'oficial' => 0);
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idcontacto;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idcontacto':
                                $arrIds[] = $v->$i;
                                break;
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delContactosAction('local');
                $this->addContactosAction('local');
                $this->_objContacto->modContactos($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar las direcciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delContactosAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objContacto->delContactos($datos);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     *
     * @throws Exception
     */
    public function addContactosAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'contacto' => '', 'idtipomediocontacto' => '', 'idtipocontacto' => '', 'oficial' => 0);
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objContacto->addContactos($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar los contactos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concpeto datos de nacimiento
     */
    public function getLocalityByIdMunicAction()
    {
        try {
            $this->response = array(
                'locality' => $this->_objBirthdata->getLocalityByIdMunic($this->_getParam('idmunicipio')));
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @throws Exception
     */
    public function getCountriesAction()
    {
        try {
            $this->response = array('countries' => $this->_objBirthdata->getContrys());
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getBirthdataByIdPersonAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $result = $this->_objBirthdata->getBirthdataByIdPerson(array($this->_getParam('idpersona')));
                $this->response->data = $result->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de nacimineto', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function addBirthdataAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'fechanacimiento' => '', 'nombremadre' => null, 'nombrepadre' => null, 'registrocivil' => null,
                    'tomo' => null, 'folio' => null, 'idpais' => null,
                    'idprovincia' => null, 'idmunicipio' => null, 'localidad' => null, 'idpersona' => '',);
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'nombremadre':
                        case 'nombrepadre':
                        case 'registrocivil':
                        case 'tomo':
                        case 'folio':
                        case 'idpais':
                        case 'idprovincia':
                        case 'idmunicipio':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'localidad':
                        default:
                            $valores[$k] = $this->_getParam($k);
                            break;
                    }
                }
                $this->_objBirthdata->addBirthdata(
                    $valores, $this->_getParam('idpersona')
                );
                $result = $this->_objBirthdata->getBirthdataByIdPerson(array($this->_getParam('idpersona')));
                $this->response->data = $result->data[0];
            } else {
                throw new Exception('No existe persona a la cual asignar los datos de nacimiento', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function changeBirthdataAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'iddatosnacimiento' => '', 'fechanacimiento' => '', 'nombremadre' => null, 'nombrepadre' => null,
                    'registrocivil' => null, 'tomo' => null, 'folio' => null, 'idpais' => null,
                    'idprovincia' => null, 'idmunicipio' => null, 'localidad' => null, 'idpersona' => '',);
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'nombremadre':
                        case 'nombrepadre':
                        case 'registrocivil':
                        case 'tomo':
                        case 'folio':
                        case 'idprovincia':
                        case 'idmunicipio':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'localidad':
                        default:
                            $valores[$k] = $this->_getParam($k);
                            break;
                    }
                }
                $valores['iddatosnacimiento'] = $this->_objBirthdata->modBirthdata(
                    $valores, $this->_getParam('idpersona')
                );
                $result = $this->_objBirthdata->getBirthdataByIdPerson(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = $result->data[0];
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de nacimiento', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Idioma
     */
    public function getLanguageByIdpersonAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objLanguage->getLanguageByIdperson(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la nacionalidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function changeLanguagesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'ididiomap' => '', 'ididioma' => '', 'idformaadquiriridioma' => '', 'observacion' => null,);
                foreach ($datos as $val) {
                    $l = $val->ididiomap;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'ididiomap':
                                $arrIds[] = $val->$k;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->removeLanguagesAction('local');
                $add = $this->addLanguagesAction('local');
                $this->_objLanguage->changeLanguages($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual asignar algun idioma', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function removeLanguagesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objLanguage->removeLanguages($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addLanguagesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'ididioma' => '', 'idformaadquiriridioma' => '', 'observacion' => null,);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objLanguage->addLanguages($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar algun idioma', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Ciudadanias
     */
    public function getCiudadaniasAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCiudadanias->getCiudadaniasByPersona($idpersona);
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la ciudadania', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modCiudadaniasAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idciudadaniap' => '', 'idciudadania' => '', 'fdesde' => '', 'fhasta' => null, 'activa' => 0);
                foreach ($datos as $val) {
                    $l = $val->idciudadaniap;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idciudadaniap':
                                $arrIds[] = $val->$k;
                                break;
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->delCiudadaniasAction('local');
                $add = $this->addCiudadaniasAction('local');
                $this->_objCiudadanias->modCiudadanias($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de ciudadania', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto idioma
     */
    /**
     * @param $accion
     */
    public function delCiudadaniasAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objCiudadanias->delCiudadanias($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addCiudadaniasAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idciudadania' => '', 'fdesde' => '', 'fhasta' => null, 'activa' => 0);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objCiudadanias->addCiudadanias($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las ciudadanias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Sanciones
     */
    public function getSancionesAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objSanciones->getSancionesByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la sanciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modSancionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idsancionp' => '',
                    'idsancion' => '',
                    'idmotivosancion' => '',
                    'tiemposancion' => '',
                    'unidadtiempo' => '',
                    'fimposicion' => '',
                    'frehabilitacion' => '',
                    'observacion' => '',
                    'resolucion' => '',
                    'fnotificacion' => '',
                    'idcargofacultado' => '',
                    'resrehabilitacion' => ''
                );
                foreach ($datos as $val) {
                    $l = $val->idsancionp;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idsancionp':
                                $arrIds[] = $val->$k;
                                break;
                            case 'tiemposancion':
                            case 'unidadtiempo':
                            case 'observacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->delSancionesAction('local');
                $add = $this->addSancionesAction('local');
                $this->_objSanciones->modSanciones($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de sanción', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function delSancionesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objSanciones->delSanciones($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addSancionesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idsancion' => '',
                    'idmotivosancion' => '',
                    'tiemposancion' => '',
                    'unidadtiempo' => '',
                    'fimposicion' => '',
                    'frehabilitacion' => '',
                    'observacion' => '',
                    'resolucion' => '',
                    'fnotificacion' => '',
                    'idcargofacultado' => '',
                    'resrehabilitacion' => ''
                );
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'tiemposancion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'unidadtiempo':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'observacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'idsancion':
                                $valores[$l][$k] = $val->$k;
                                break;
                            case 'idmotivosancion':
                                $valores[$l][$k] = $val->$k;
                                break;
                            case 'fimposicion':
                                $valores[$l][$k] = $val->$k;
                                break;
                            case 'frehabilitacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'resolucion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'fnotificacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'idcargofacultado':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'resrehabilitacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objSanciones->addSanciones($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las sanciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Condecoraciones
     */
    public function getCondecoracionesAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCondecoraciones->getCondecoracionesByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la condecoraciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modCondecoracionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idcondecoracionp' => '', 'idcondecoracion' => '', 'idmotivocondecoracion' => '', 'fecha' => '',
                    'observacion' => '');
                foreach ($datos as $val) {
                    $l = $val->idcondecoracionp;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idcondecoracionp':
                                $arrIds[] = $val->$k;
                                break;
                            case 'idmotivocondecoracion':
                            case 'fecha':
                            case 'observacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->delCondecoracionesAction('local');
                $add = $this->addCondecoracionesAction('local');
                $this->_objCondecoraciones->modCondecoraciones($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de condecoraciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto de Sanciones
     */
    /**
     * @param $accion
     */
    public function delCondecoracionesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objCondecoraciones->delCondecoraciones($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addCondecoracionesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idcondecoracion' => '', 'idmotivocondecoracion' => '', 'fecha' => '', 'observacion' => '');
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            default:
                                (empty($val->$k)) ? $valores[$l][$k] = null : $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objCondecoraciones->addCondecoraciones($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las condecoraciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de afiliaciones
     */
    public function getAfiliacionesAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objAfiliaciones->getAfiliacionesByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la afiliaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getCargosOrganizacionAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCargosAfiliacion->getCargosByOrganizacion($idpersona);
            } else {
                throw new Exception(
                    'No existe persona a la cual obtener los cargos de la persona por sus afiliaciones', 3
                );
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto de Condecoraciones
     */
    /**
     *
     */
    public function modAfiliacionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrAfil'));
                $indixes = array(
                    'idafiliacion' => '', 'idorganizacion' => '', 'fdesde' => '', 'fhasta' => null);
                foreach ($datos->arrMod as $val) {
                    $l = $val->idafiliacion;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idafiliacion':
                                $arrIds[] = $val->$k;
                                break;
                            case 'fecha':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delAfiliacionesAction('local');
                $this->addAfiliacionesAction('local');
                $this->modCargosOrganizacion();
                $this->_objAfiliaciones->modAfiliaciones($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de afiliaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function delAfiliacionesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrAfil'));
            $datosCargo = json_decode($this->_getParam('arrCargos'));
            $this->_objAfiliaciones->delAfiliaciones($datos->arrDel);
            $this->_objCargosAfiliacion->delCargosOrganizacion($datosCargo->arrDel);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addAfiliacionesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAfil'));
                $indixes = array(
                    'idorganizacion' => '', 'fdesde' => '', 'fhasta' => null, 'DatCargoorganizacion' => '');
                foreach ($datos->arrAdd as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'DatCargoorganizacion':
                                $arrayTmp = array();
                                foreach ($val->$k as $c => $rec) {
                                    $arrayTmp[$c]['idcargoorganizacion'] = $rec->idcargoorganizacion;
                                    $arrayTmp[$c]['idnivelorganizacion'] = $rec->idnivelorganizacion;
                                    $arrayTmp[$c]['fdesde'] = $rec->fdesde;
                                    $arrayTmp[$c]['fhasta'] = $rec->fhasta;
                                }
                                $valores[$l][$k] = $arrayTmp;
                                break;
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objAfiliaciones->addAfiliaciones($valores, $this->_getParam('idpersona'));
                $this->addCargoOrganizacion();
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las afiliaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @throws Exception
     */
    public function addCargoOrganizacion()
    {
        try {
            $valores = array();
            $datos = json_decode($this->_getParam('arrCargos'));
            $indixes = array(
                'idafiliacion' => '', 'idcargoorganizacion' => '', 'idnivelorganizacion' => null, 'fdesde' => '',
                'fhasta' => null);
            foreach ($datos->arrAdd as $l => $val) {
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'idnivelorganizacion':
                        case 'fhasta':
                            $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                            break;
                        default:
                            $valores[$l][$k] = $val->$k;
                            break;
                    }
                }
            }
            $this->_objCargosAfiliacion->addCargosOrganizacion($valores);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     *
     */
    public function modCargosOrganizacion()
    {
        try {
            $valores = array();
            $arrIds = array();
            $datos = json_decode($this->_getParam('arrAfil'));
            $indixes = array(
                'idcargoorganizacionp' => '', 'idafiliacion' => '', 'idcargoorganizacion' => '',
                'idnivelorganizacion' => null, 'fdesde' => '', 'fhasta' => null);
            foreach ($datos->arrMod as $val) {
                $l = $val->idcargoorganizacionp;
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'idcargoorganizacionp':
                            $arrIds[] = $val->$k;
                            break;
                        case 'idnivelorganizacion':
                        case 'fecha':
                            $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                            break;
                        default:
                            $valores[$l][$k] = $val->$k;
                            break;
                    }
                }
            }
            $this->_objCargosAfiliacion->modCargosOrganizacion($valores, $arrIds);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * Concepto Estancia en el exterior
     */
    public function getEstanciaExteriorAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objEstanciaExterior->getEstanciasExteriorByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener los datos de la estancias en el exterior', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modEstanciaExteriorAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idestanciaexterior' => '', 'idtipoestanciaexterior' => null, 'idmision' => '', 'idpais' => '',
                    'observacion' => null, 'cargo' => null, 'fdesde' => '', 'fhasta' => null,);
                foreach ($datos as $val) {
                    $l = $val->idestanciaexterior;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idestanciaexterior':
                                $arrIds[] = $val->$k;
                                break;
                            case 'observacion':
                            case 'cargo':
                            case 'idpais':
                            case 'idtipoestanciaexterior':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $remove = $this->delEstanciaExteriorAction('local');
                $add = $this->addEstanciaExteriorAction('local');
                $this->_objEstanciaExterior->modEstanciasExterior($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de estancias en el exterior', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto afiliaciones
     */
    /**
     * @param $accion
     */
    public function delEstanciaExteriorAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objEstanciaExterior->delEstanciasExterior($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addEstanciaExteriorAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idtipoestanciaexterior' => null, 'idmision' => '', 'idpais' => '',
                    'observacion' => null, 'cargo' => null, 'fdesde' => '', 'fhasta' => null);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'observacion':
                            case 'cargo':
                            case 'idpais':
                            case 'idtipoestanciaexterior':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objEstanciaExterior->addEstanciasExterior($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las condecoraciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Afecciones y Datos de salud
     */
    public function getAfeccionesAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objAfeccion->getAfeccionesByPersona($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener las afecciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function getDatosSaludAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $data = $this->_objEstadoSalud->getEstadoSaludByPersona($idpersona);
                $this->response->data = ($data->quantity > 0) ? $data->data[0] : array();
            } else {
                throw new Exception('No existe persona de la cual obtener los datos de salud', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modAllDatosSaludAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrAfec'));
                $indixes = array(
                    'idafeccion' => '', 'idpadecimiento' => '', 'fdesde' => '', 'fhasta' => null,
                    'tratamiento' => null,);
                foreach ($datos->arrMod as $val) {
                    $l = $val->idafeccion;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idafeccion':
                                $arrIds[] = $val->$k;
                                break;
                            case 'tratamiento':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->modEstadoSalud();
                $this->delAllDatosSaludAction('local');
                $this->addAllDatosSaludAction('local');
                $this->_objAfeccion->modAfecciones($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar las afecciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modEstadoSalud()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('dataForm'));
                $indixes = array(
                    'idestadosalud' => '', 'estadosalud' => '', 'idaptitudfisica' => null, 'limitacion' => null);
                foreach ($datos->arrMod as $val) {
                    $l = $val->idestadosalud;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idestadosalud':
                                $arrIds[] = $val->$k;
                                break;
                            case 'limitacion':
                            case 'idaptitudfisica':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objEstadoSalud->modEstadoSalud($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de estancias en el exterior', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     * @param $accion
     */
    public function delAllDatosSaludAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrAfec'));
            $this->_objAfeccion->delAfecciones($datos->arrDel);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @param $accion
     */
    public function addAllDatosSaludAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAfec'));
                $indixes = array(
                    'idpadecimiento' => '', 'fdesde' => '', 'fhasta' => null, 'tratamiento' => null,);
                foreach ($datos->arrAdd as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'tratamiento':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objAfeccion->addAfecciones($valores, $this->_getParam('idpersona'));
                $this->addEstadoSaludActual();
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las afecciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function addEstadoSaludActual()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('dataForm'));
                $indixes = array(
                    'estadosalud' => '', 'idaptitudfisica' => null, 'limitacion' => null);
                foreach ($datos->arrAdd as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'limitacion':
                            case 'idaptitudfisica':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objEstadoSalud->addEstadoSalud($valores, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual asignar el estado de salud', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * Concepto Datos educacionales
     */
    public function getDatosEducacionalesAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objEducaion->getEducacionByPersona($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener los datos educacionales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modDatosEducacionalesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idtipoformacion' => null, 'idmodoformacion' => null, 'fhasta' => null, 'resultado' => '',
                    /* 'evaluacion' => NUll,*/
                    'idcentroestudio' => '', 'idcurso' => '', 'observacion' => '', 'ideducacion' => '', 'fdesde' => '');
                foreach ($datos as $val) {
                    $l = $val->ideducacion;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'ideducacion':
                                $arrIds[] = $val->$k;
                                break;
                            case 'idtipoformacion':
                            case 'idmodoformacion':
                            case 'fhasta':
                                /*  case 'evaluacion':*/
                            case 'idcurso':
                            case 'observacion':
                            case 'resultado':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delDatosEducacionalesAction('local');
                $this->addDatosEducacionalesAction('local');
                $this->_objEducaion->modEducacion($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos educacionales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function delDatosEducacionalesAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objEducaion->delEducacion($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function addDatosEducacionalesAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idtipoformacion' => null, 'idmodoformacion' => null, 'fhasta' => null, /* 'evaluacion' => NUll,*/
                    'idcentroestudio' => null, 'idcurso' => null, 'observacion' => '', 'resultado' => '', 'fdesde' => '');
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idtipoformacion':
                            case 'idmodoformacion':
                            case 'fhasta':
                            case 'idcurso':
                            case 'observacion':
                            case 'resultado':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objEducaion->addEducacion($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar los datos educacionales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto Categorias de la Persona
     */
    public function getTipoCategoriaAction()
    {
        try {
            $this->response = $this->_objCategorizacion->getTipoCategoria();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function getCategoriasAction()
    {
        try {
            $ob = new NomCategoriapersonaModel();
            $this->response = $ob->getCategorias(true);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCondecorationsAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomCondecoracionModel();
            $this->response = $ob->getCondecorationActive($filtro = null, $limit = null,
                $start = 0, $idtipocondecoracion = null, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getPadecimientosAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomPadecimientoModel();
            $this->response = $ob->getActiveSuffering($filtro = null, $limit = null, $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }

        $this->responseRequest();
    }

    public function getNacionalidadesAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomNacionalidadModel();
            $this->response = $ob->getActiveNationality($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCitizensAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomCiudadaniaModel();
            $this->response = $ob->getActiveCitizenship($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getIdiomasAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomIdiomaModel();
            $this->response = $ob->getActiveLanguage($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getAsignacionAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomAsignacionModel();
            $this->response = $ob->getAsignacionActive($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getAptitudesFisicasAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomAptitudfisicaModel();
            $this->response = $ob->getAptitudesFisicasActivas($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getDocIdentificacionAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomTipodocidentidadModel();
            $this->response = $ob->getTipoDocIdentidadActivo($filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getFormEnteringJefeAction()
    {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerDenominacionesCargos(false);
            foreach ($cargos as $pos=>$carg) {
                $datos[$pos]['idcargopropuesto'] = $carg['id'];
                $datos[$pos]['cargopropuesto'] = $carg['denominacion'];
            }
            $this->response->data = $datos;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }
    public function getSantionsAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomSancionModel($filtro = null, $limit = null,
                $start = 0, $idtipocondecoracion = null, $value);
            $this->response = $ob->getSanctionActive($idtiposancion = null, $filtro = null, $limit = null,
                $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCursesAction()
    {
        try {
            $value = $this->_getParam('value');
            $ob = new NomCursoModel($filtro = null, $limit = null, $start = 0, $value);
            $this->response = $ob->getCursoActivo($filtro = null, $limit = null, $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }

        $this->responseRequest();
    }

    /**
     * Fin del concepto Datos educacionales
     */
    public function getCategoriasByPersonaAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCat->getCategoriasByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modCategoriasPersonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'fhasta' => null, 'idcategoria' => '', 'fdesde' => '', 'principal' => 0,
                    'idcategoriapersona' => '');
                foreach ($datos as $val) {
                    $l = $val->idcategoria;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idcategoria':
                                $arrIds[] = $val->$k;
                                break;
                            case 'principal':
                                $valores[$l][$k] = (!$val->$k) ? 0 : 1;
                                break;
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delCategoriasPersonaAction('local');
                $this->addCategoriasPersonaAction('local');
                $this->_objCat->modCategorias($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delCategoriasPersonaAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objCat->delCategorias($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function addCategoriasPersonaAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'fhasta' => null, 'principal' => 0, 'idcategoriapersona' => '', 'fdesde' => '');
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            case 'principal':
                                $valores[$l][$k] = (!$val->$k) ? 0 : 1;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objCat->addCategorias($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto Categorias Cientificas de la Persona
     */
    public function getTipoCategoriaCientificasAction()
    {
        try {
            $this->response = $this->_objCategorizacionCientifica->getTipoCategoria();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCategoriasCientificasAction()
    {
        try {
            $value = $this->_getParam('value');
            $this->response = $this->_objCategorizacionCientifica->getNomCategorias($value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCentroEstudiosAction()
    {
        try {
            $value = $this->_getParam('value');
            $this->response = $this->_objCentroEstudio->getCentroEstudioActivo($idtipocentroestudio = null, $filtro = null,
                $limit = null, $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getTituloAction()
    {
        try {
            $value = $this->_getParam('value');
            $this->response = $this->_objTitulo->getTitleActive($idtitulo = null, $filtro = null,
                $limit = null, $start = 0, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getMisionesAction()
    {
        try {
            $value = $this->_getParam('value');

            $this->response = $this->_objMisiones->getMisionActive($filtro = null,
                $limit = null, $start = 0, $idtipomision = null, $value);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getOrganizacionesAction()
    {
        try {
            $value = $this->_getParam('value');
            $this->response = $this->_objOrganizacion->getOrganizationActive($filtro = null,
                $limit = null, $start = 0, $idtipoorganizacion = null, $value);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }


    /**
     * Fin del concepto Categorias de la persona
     */
    public function getCategoriasCientificasByPersonaAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCategorizacionCientifica->getCategoriasByPersonas($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addCategoriasCientificasPersonaAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'fhasta' => null, 'fratificacion' => null, 'idcategoria' => '', 'fdesde' => '');
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objCategorizacionCientifica->addCategorias($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modCategoriasCientificasPersonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'fhasta' => null, 'fratificacion' => null, 'idcategoria' => '', 'fdesde' => '',
                    'idcategorizacion' => '');
                foreach ($datos as $val) {
                    $l = $val->idcategorizacion;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idcategorizacion':
                                $arrIds[] = $val->$k;
                                break;
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delCategoriasPersonaAction('local');
                $this->addCategoriasPersonaAction('local');
                $this->_objCategorizacionCientifica->modCategorias($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar las categorias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delCategoriasCientificasPersonaAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objCategorizacionCientifica->delCategorias($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * Concepto Grados militares
     */
    public function getNomMilitaryDegreesAction()
    {
        try {
            $this->response->data = $this->_objGrados->getNomMilitaryDegrees();
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function getGradosMilitaresAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objGrados->getGradosMilitaresByPersona($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener los grados militares', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto Categorias Cientificas de la persona
     */
    public function modGradosMilitaresAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idgradomilitar' => '', 'idgrado' => '', 'fdesde' => '', 'fhasta' => null, 'dequien' => null,
                    'numorden' => null, 'parrafo' => null, 'anexo' => null);
                foreach ($datos as $val) {
                    $l = $val->idgradomilitar;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idgradomilitar':
                                $arrIds[] = $val->$k;
                                break;
                            case 'dequien':
                            case 'numorden':
                            case 'parrafo':
                            case 'anexo':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delGradosMilitaresAction('local');
                $this->addGradosMilitaresAction('local');
                $this->_objGrados->modGradosMilitares($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los grados militares', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delGradosMilitaresAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objGrados->delGradosMilitares($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function addGradosMilitaresAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idgrado' => '', 'fdesde' => '', 'fhasta' => null, 'dequien' => null,
                    'numorden' => null, 'parrafo' => null, 'anexo' => null);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'dequien':
                            case 'numorden':
                            case 'parrafo':
                            case 'anexo':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objGrados->addGradosMilitares($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar los grados militares', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto de Cuenta Bancaria
     */
    public function getCuentaBancariaAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->_objCuentaBancaria->getCuentaBancariaByPersona($idpersona);
            } else {
                throw new Exception('No existe persona de la cual obtener las cuentas bancarias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getBancosAction()
    {
        try {
            $this->response = $this->_objCuentaBancaria->getBancos();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto Grados militares
     */
    public function getMonedasAction()
    {
        try {
            $this->response = $this->_objCuentaBancaria->getMonedas();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modCuentaBancariaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idcuentabancaria' => '', 'numerocuenta' => '', 'fdesde' => '', 'fhasta' => null, 'idbanco' => '',
                    'idmoneda' => '', 'idtipocuentabancaria' => '', 'descripcion' => null);
                foreach ($datos as $val) {
                    $l = $val->idcuentabancaria;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idcuentabancaria':
                                $arrIds[] = $val->$k;
                                break;
                            case 'descripcion':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->delCuentaBancariaAction('local');
                $this->addCuentaBancariaAction('local');
                $this->_objCuentaBancaria->modCuentaBancaria($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar las cuentas bancarias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delCuentaBancariaAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objCuentaBancaria->delCuentaBancaria($datos);
            if (isset($accion)) {
                return;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function addCuentaBancariaAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'numerocuenta' => '', 'fdesde' => '', 'fhasta' => null, 'idbanco' => '', 'idmoneda' => '',
                    'idtipocuentabancaria' => '', 'descripcion' => null);
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'descripcion':
                            case 'fhasta':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objCuentaBancaria->addCuentaBancaria($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual asignar las cuentas bancarias', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto Regimen de Trabajo
     */
    public function getTipoRegimenTrabajoAction()
    {
        try {
            $objService = new RegimenTrabajoService();
            $data = $objService->getRegimenTrabajo();
            if ($data['datos']) {
                $this->response->data = $data['datos'];
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getGrupoDescansoAction()
    {
        try {
            $objService = new RegimenTrabajoService();
            $data = $objService->getGruposRegimenTrabajo($this->_getParam('idregimentrabajo'));
            if ($data['datos']) {
                $this->response->data = $data['datos'];
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto de Cuenta Bancaria
     */
    public function getTurnoTrabajoAction()
    {
        try {
            $objService = new RegimenTrabajoService();
            $data = $objService->getTurnoTrabajo();
            if ($data) {
                $this->response->data = $data;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getRegimenTrabajoByPersonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objRegimen->getRegimenTrabajoByPersona(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona de la cual obtener las ocpuaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modRegimenTrabajoAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idregimentrabajop' => '', 'actual' => 0, 'fdesde' => '', 'fhasta' => null, 'idpersona' => '',
                    'idregimentrabajo' => '', 'idgrupodescanso' => '', 'idturnotrabajo' => '');
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idregimentrabajop;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idregimentrabajop':
                                $arrIds[] = $v->$i;
                                break;
                            case 'actual':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delRegimenTrabajoAction('local');
                $this->addRegimenTrabajoAction('local');
                $this->_objRegimen->modRegimenTrabajo($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar las ocupaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function delRegimenTrabajoAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objRegimen->delRegimenTrabajo($datos);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function addRegimenTrabajoAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'actual' => 0, 'fdesde' => '', 'fhasta' => null, 'idpersona' => '', 'idregimentrabajo' => '',
                    'idgrupodescanso' => '', 'idturnotrabajo' => '');
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'actual':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objRegimen->addRegimenTrabajo($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar las remien de trabajo', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concepto Tallaje
     */
    public function getTallajeAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->_objFrom = new DatTallajeModel();
                $this->response = $this->_objFrom->getTallajesByPersona($this->_getParam('idpersona', array()));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos de tallaje', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modTallajeAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->makeInstanceOf('DatTallajeModel');
                $indixes = array(
                    'idtallaje' => '', 'idtalla' => '', 'idprenda' => '', 'idnorma' => '');
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idtallaje;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idtallaje':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delTallajeAction('local');
                $this->addTallajeAction('local');
                $this->_objFrom->modTallaje($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de tallaje', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto de Regimen de Trabajo
     */
    protected function makeInstanceOf($class)
    {
        if (!$this->_objFrom instanceof $class) {
            $this->_objFrom = new $class();
        }
    }

    public function delTallajeAction($accion)
    {
        try {
            $this->makeInstanceOf('DatTallajeModel');
            $datos = json_decode($this->_getParam('arrDel'));
            $idpersona = json_decode($this->_getParam('idpersona'));
            $this->_objFrom->delTallaje($datos, $idpersona);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addTallajeAction($accion)
    {
        try {
            $this->makeInstanceOf('DatTallajeModel');
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idtalla' => '', 'idprenda' => '', 'idnorma' => '');
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objFrom->addTallaje($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar los datos de tallaje', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Uso verificado
     * Iteración 1
     */
    public function getDatosSocialesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $objModel = new DatCaracteristicasocialModel();
                $data = $objModel->getDatosSocialesByPersona(array($this->_getParam('idpersona')));
                $this->response->data = ($data->quantity > 0) ? $data->data[0] : array();
            } else {
                throw new Exception('No existe persona a la cual obtener los datos sociales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Uso verificado
     * Iteración 1
     */
    public function addDatosSocialesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array('idestadocivil', 'idestratificacionsocial', 'alia', 'observaciones', 'jubilado', 'iddisposicion');
                $valores = array();
                foreach ($indixes as $k) {
                    switch ($k) {
                        case 'iddisposicion':
                        case 'alia':
                            $valores[$k] = $this->_getParam($k, null);
                            break;
                        default:
                            $valores[$k] = $this->_getParam($k);
                            break;
                    }
                }
                $objModel = new DatCaracteristicasocialModel();
                $objModel->addDatosSociales($valores, $this->_getParam('idpersona'));
                $data = $objModel->getDatosSocialesByPersona(array($this->_getParam('idpersona')));
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos sociales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Uso verificado
     * Iteración 1
     */
    public function modDatosSocialesAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idcaracteristicasocial', 'idestadocivil', 'idestratificacionsocial', 'alia', 'observaciones',
                    'jubilado', 'iddisposicion'
                );
                $valores = array();
                foreach ($indixes as $k) {
                    switch ($k) {
                        case 'iddisposicion':
                        case 'alia':
                            $valores[$k] = $this->_getParam($k, null);
                            break;
                        default:
                            $valores[$k] = $this->_getParam($k);
                            break;
                    }
                }
                $objModel = new DatCaracteristicasocialModel();
                $objModel->modDatosSociales($valores, $this->_getParam('idpersona'));
                $data = $objModel->getDatosSocialesByPersona(array($this->_getParam('idpersona')));
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos sociales', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function delDatosSocialesAction()
    {
        try {
        } catch (Exception $e) {
        }
    }

    public function getEvaluacionesAction()
    {
        try {
            if ($this->_getParam('idpersona') != null) {

                $this->response = ZendExt_IoC_Inter::getInstance()->evaluaciones->getEvaluacionesPersona(
                    $this->_getParam('idpersona'), 10, 0
                );
            } else {
                throw new Exception('No existe persona a la cual obtener las evaluaciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @method obtenerEventosAlimentacion - Devuelve los eventos de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEventosAlimentacionAction()
    {
        echo json_encode(DatServalimentacionModel::obtenerEventosAlimentacion());
    }

    /** CONCEPTO: SERVICIOS DE ALIMENTACION **/
    /**
     * @method obtenerEstAlimentacion - Devuelve las estructuras de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEstAlimentacionAction()
    {
        echo json_encode(DatServalimentacionModel::obtenerEstAlimentacion($this->_getParam('node')));
    }

    /**
     * @method obtenerServAlimentacionPorPersona - Devuelve los eventos de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerServAlimentacionPorPersonaAction()
    {
        $respuesta = DatServalimentacionModel::obtenerServAlimentacionPorPersona($this->_getParam('idpersona'));
        if ($respuesta->error) {
            $this->responseExceptions($respuesta->error);
        } else {
            echo json_encode($respuesta);
        }
    }

    /**
     * @method gestionarServAlimentacion - Gestiona las acciones para los servicios de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function gestionarServAlimentacionAction()
    {
        try {
            $arradd = json_decode($this->_getParam('arrAdd'));
            $arrmod = json_decode($this->_getParam('arrMod'));
            $arrdel = json_decode($this->_getParam('arrDel'));
            if (count($arradd) > 0) {
                DatServalimentacionModel::adicionarServAlimentacion($this->_getParam('idpersona'), $arradd);
            }
            if (count($arrmod) > 0) {
                DatServalimentacionModel::modificarServAlimentacion($this->_getParam('idpersona'), $arrmod);
            }
            if (count($arrdel) > 0) {
                DatServalimentacionModel::eliminarServAlimentacion($arrdel);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @method obtenerEstTransportacion - Devuelve las estructuras de transportacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEstTransportacionAction()
    {
        echo json_encode(DatServtransportacionModel::obtenerEstTransporte($this->_getParam('node')));
    }

    /** CONCEPTO: SERVICIOS DE TRANSPORTACION **/
    /**
     * @method obtenerServTransportacionPorPersona - Devuelve los eventos de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerServTransportacionPorPersonaAction()
    {
        $respuesta = DatServtransportacionModel::obtenerServTranspPorPersona($this->_getParam('idpersona'));
        if ($respuesta->error) {
            $this->responseExceptions($respuesta->error);
        } else {
            echo json_encode($respuesta);
        }
    }

    /**
     * @method gestionarServTransportacion - Gestiona las acciones para los servicios de alimentacion
     * @author Orestes Rodríguez Lorenzo
     */
    public function gestionarServTransportacionAction()
    {
        try {
            $arradd = json_decode($this->_getParam('arrAdd'));
            $arrmod = json_decode($this->_getParam('arrMod'));
            $arrdel = json_decode($this->_getParam('arrDel'));
            if (count($arradd) > 0) {
                DatServtransportacionModel::adicionarServTransportacion($this->_getParam('idpersona'), $arradd);
            }
            if (count($arrmod) > 0) {
                DatServtransportacionModel::modificarServTransportacion($this->_getParam('idpersona'), $arrmod);
            }
            if (count($arrdel) > 0) {
                DatServtransportacionModel::eliminarServTransportacion($arrdel);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * @method .
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerEstAlojamientoAction()
    {
        echo json_encode(DatServalojamientoModel::obtenerEstAlojamiento($this->_getParam('node')));
    }

    /** CONCEPTO: SERVICIOS DE ALOJAMIENTO **/
    /**
     * @method obtenerServAlojamientoPorPersona - Devuelve los eventos de alimentacion.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function obtenerServAlojamientoPorPersonaAction()
    {
        $respuesta = DatServalojamientoModel::obtenerServAlojPorPersona($this->_getParam('idpersona'));
        if ($respuesta->error) {
            $this->responseExceptions($respuesta->error);
        } else {
            echo json_encode($respuesta);
        }
    }

    /**
     * @method gestionarServTransportacion - Gestiona las acciones para los servicios de alimentacion
     * @author Orestes Rodríguez Lorenzo
     */
    public function gestionarServAlojamientoAction()
    {
        try {
            $arradd = json_decode($this->_getParam('arrAdd'));
            $arrmod = json_decode($this->_getParam('arrMod'));
            $arrdel = json_decode($this->_getParam('arrDel'));
            if (count($arradd) > 0) {
                DatServalojamientoModel::adicionarServAlojamiento($this->_getParam('idpersona'), $arradd);
            }
            if (count($arrmod) > 0) {
                DatServalojamientoModel::modificarServAlojamiento($this->_getParam('idpersona'), $arrmod);
            }
            if (count($arrdel) > 0) {
                DatServalojamientoModel::eliminarServAlojamiento($arrdel);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     * CONCEPTO DATOS DE FAMILIARES Y AMIGOS
     */
    public function obtenerFamiliarAction()
    {
        $result = DatFamiliarModel::obtenerFamiliarPorPersona(json_decode($this->_getParam('idpersona')));
        if ($result->error) {
            $this->responseExceptions($result->error);
        } else {
            echo json_encode($result);
        }
    }

    /**
     *
     */
    public function gestionarFamiliarAction()
    {
        if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
            DatFamiliarModel::adicionarFamiliar(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrAdd'))
            );

        }
        if (count(json_decode($this->_getParam('arrMod'))) > 0) {
            DatFamiliarModel::modificarFamiliar(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrMod'))
            );
        }
        if (count(json_decode($this->_getParam('arrDel'))) > 0) {
            DatFamiliarModel::eliminarFamiliar(json_decode($this->_getParam('arrDel')));
        }
        $this->responseRequest();
    }

    /**
     * CONCEPTO DATOS DE INGRESOS PERSONALES
     */
    public function obtenerIngresoAction()
    {
        $result = DatIngresoModel::obtenerIngresoPorPersona(json_decode($this->_getParam('idpersona')));
        if ($result->error) {
            $this->responseExceptions($result->error);
        } else {
            echo json_encode($result);
        }
    }

    /**
     *
     */
    public function gestionarIngresoAction()
    {
        if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
            DatIngresoModel::adicionarIngreso(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrAdd'))
            );
        }
        if (count(json_decode($this->_getParam('arrMod'))) > 0) {
            DatIngresoModel::modificarIngreso(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrMod'))
            );
        }
        if (count(json_decode($this->_getParam('arrDel'))) > 0) {
            DatIngresoModel::eliminarFamiliar(json_decode($this->_getParam('arrDel')));
        }
        $this->responseRequest();
    }

    /**
     * Trayectoria Laboral
     */
    public function getTrayectoriaLaboralByPersonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $traylab = $this->_objTrayectoriaLaboral->getTrayectoriaLaboralGetSituacionLab($this->_getParam('idpersona'));
                if(!empty($traylab))
                    $this->response = $traylab;
                else
                    $objtraylab = $this->_objTrayectoriaLaboral->getTrayectoriaLaboralByPersona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            print_r($e->getMessage());
            die;
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function addTrayectoriaLaboralAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $indixes = array(
                    'idtrayectorialaboral' => '',
                    'orgentidad' => '',
                    'cargo' => '',
                    'fdesde' => '',
                    'fhasta' => '',
                    'motivobaja' => '',
                    'observacion' => '',
                    'falta' => '',
                    'fbaja' => '',
                    'noalta' => '',
                    'categocup' => ''
                );
                foreach ($datos as $l => $val) {
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'motivobaja':
                            case 'observacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                $this->_objTrayectoriaLaboral->addTrayectoriaLaboral($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar los datos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modTrayectoriaLaboralAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idtrayectorialaboral' => '',
                    'orgentidad' => '',
                    'cargo' => '',
                    'fdesde' => '',
                    'fhasta' => '',
                    'motivobaja' => '',
                    'observacion' => '',
                    'falta' => '',
                    'fbaja' => '',
                    'noalta' => '',
                    'categocup' => ''
                );
                foreach ($datos as $val) {
                    $l = $val->idtrayectorialaboral;
                    foreach ($indixes as $k => $v) {
                        switch ($k) {
                            case 'idtrayectorialaboral':
                                $arrIds[] = $val->$k;
                                break;
                            case 'motivobaja':
                            case 'observacion':
                                $valores[$l][$k] = ($val->$k != '') ? $val->$k : null;
                                break;
                            default:
                                $valores[$l][$k] = $val->$k;
                                break;
                        }
                    }
                }
                //$remove = $this->delTrayectoriaLaboralAction('local');
                //$add = $this->addTrayectoriaLaboralAction('local');
                $this->_objTrayectoriaLaboral->modTrayectoriaLaboral($valores, $arrIds);
            } else {
                throw new Exception('No existe persona a la cual modificar los datos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $accion
     */
    public function delTrayectoriaLaboralAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objTrayectoriaLaboral->delTrayectoriaLaboral($datos);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getEntidadAction()
    {
        try {
            $objModel = new HisTrayectorialaboralModel();
            $this->response->data = $objModel->getEntidad();

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getMotivosMovimientoAction()
    {
        try {
            $objmb = new NomMotivobajaModel();
            $this->response = $objmb->getAllMotivobaja(true);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Observaciones
     */


    public function getObservacionAction()
    {
        $result = DatObservacionModel::getObservacion(json_decode($this->_getParam('idpersona')));
        if ($result->error) {
            $this->responseExceptions($result->error);
        } else {
            echo json_encode($result);
        }
    }

    /**
     *
     */
    public function gestObservacionAction()
    {
        if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
            DatObservacionModel::addObservacion(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrAdd'))
            );
        }
        if (count(json_decode($this->_getParam('arrMod'))) > 0) {
            DatObservacionModel::modObservacion(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrMod'))
            );
        }
        if (count(json_decode($this->_getParam('arrDel'))) > 0) {
            DatObservacionModel::delObservacion(json_decode($this->_getParam('arrDel')));
        }
        $this->responseRequest();
    }

    /**
     * Fin del concepto observaciones
     */

    public function getCargosGuerraAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objOcupacionTiempoGuerra->getCargosGuerraByPesona(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona de la cual obtener los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addCargosGuerraAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'entidad' => '',
                    'cargo' => '',
                    'oficial' => 0,
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->_objOcupacionTiempoGuerra->addCargosGuerra($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modCargosGuerraAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idocupaciontiempoguerra' => '',
                    'entidad' => '',
                    'cargo' => '',
                    'oficial' => 0,
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idocupaciontiempoguerra;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idocupaciontiempoguerra':
                                $arrIds[] = $v->$i;
                                break;
                            case 'oficial':
                                $valores[$p][$i] = ($v->$i == 0) ? 0 : 1;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delCargosGuerraAction('local');
                $this->addCargosGuerraAction('local');
                $this->_objOcupacionTiempoGuerra->modCargosGuerra($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delCargosGuerraAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $this->_objOcupacionTiempoGuerra->delCargosGuerra($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * concepto medios de la persona.
     */

    public function getMedioAction()
    {
        try {
            $value = $this->_getParam('value');
            $objMedios = new NomMedioModel();
            $this->response = $objMedios->getMedioActive($filtro = null, $limit = null, $start = 0, $value);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getMediosByPersonAction()
    {
        try {
            $objMedios = new DatPersonamedioModel();

            if ($this->_getParam('idpersona') != '') {
                $this->response = $objMedios->getMediosByPerson(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe persona de la cual obtener los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addMediosPersonaAction($accion)
    {
        try {
            $objMedios = new DatPersonamedioModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idasignacion' => '',
                    'idmedio' => '',
                    'fdesde' => '',
                    'fhasta' => NULL,
                    'serie' => 0
                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objMedios->addMediosPersona($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionar los cargos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modMediosPersonaAction()
    {
        try {
            $objMedios = new DatPersonamedioModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idpersonamedio' => '',
                    'idasignacion' => '',
                    'idmedio' => '',
                    'fdesde' => '',
                    'fhasta' => NULL,
                    'serie' => 0
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idpersonamedio;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idpersonamedio':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delMediosPersonaAction('local');
                $this->addMediosPersonaAction('local');
                $objMedios->modMediosPersona($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar las direcciones', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delMediosPersonaAction($accion)
    {
        try {

            $objMedios = new DatPersonamedioModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $objMedios->delMediosPersona($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getSituacionDefensaAction()
    {
        try {
            $obj = new DatSituaciondefensaModel();

            if ($this->_getParam('idpersona') != '') {
                $this->response = $obj->getSituacionDefensa(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe la persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addSituacionDefensaAction($accion)
    {
        try {
            $objMedios = new DatSituaciondefensaModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idsituaciondefensa' => '',
                    'idasignaciondefensa' => '',
                    'idcargodefensa' => '',
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objMedios->addSituacionDefensa($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }


    public function modSituacionDefensaAction()
    {
        try {
            $obj = new DatSituaciondefensaModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idsituaciondefensa' => '',
                    'idasignaciondefensa' => '',
                    'idcargodefensa' => '',
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));

                foreach ($datos as $v) {
                    $p = $v->idsituaciondefensa;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idsituaciondefensa':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delSituacionDefensaAction('local');
                $this->addSituacionDefensaAction('local');
                $obj->modSituacionDefensa($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar ', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delSituacionDefensaAction($accion)
    {
        try {

            $objMedios = new DatSituaciondefensaModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $objMedios->delSituacionDefensa($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * CONCEPTO SITUACION EXCEPCIONAL
     */
    public function getSituacExcepAction()
    {
        try {
            $obj = new DatSituacexcepModel();

            if ($this->_getParam('idpersona') != '') {
                $this->response = $obj->getSituacExcep(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe la persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addSituacExcepAction($accion)
    {
        try {
            $objMedios = new DatSituacexcepModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idsitexcepcional' => '',
                    'idsituacexcep' => '',
                    'idcargoexcep' => '',
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objMedios->addSituacExcep($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modSituacExcepAction()
    {
        try {
            $obj = new DatSituacexcepModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idsitexcepcional' => '',
                    'idsituacexcep' => '',
                    'idcargoexcep' => '',
                    'fdesde' => '',
                    'fhasta' => NULL
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));

                foreach ($datos as $v) {
                    $p = $v->idsitexcepcional;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idsitexcepcional':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delSituacExcepAction('local');
                $this->addSituacExcepAction('local');
                $obj->modSituacExcep($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar ', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delSituacExcepAction($accion)
    {
        try {

            $objMedios = new DatSituacexcepModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $objMedios->delSituacExcep($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }


    /**
     * CONCEPTO RECLAMACION
     */
    public function getReclamacionAction()
    {
        try {
            $obj = new DatReclamacionModel();

            if ($this->_getParam('idpersona') != '') {
                $this->response = $obj->getReclamacion(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe la persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addReclamacionAction($accion)
    {
        try {
            $objMedios = new DatReclamacionModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idreclamacion' => '',
                    'fechaacuerdo' => '',
                    'numeroacuerdo' => '',
                    'decision' => '',
                    'reclamacion' => '',
                    'nuevaplaza' => ''

                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objMedios->addReclamacion($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modReclamacionAction()
    {
        try {
            $obj = new DatReclamacionModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idreclamacion' => '',
                    'fechaacuerdo' => '',
                    'numeroacuerdo' => '',
                    'decision' => '',
                    'reclamacion' => '',
                    'nuevaplaza' => ''
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));

                foreach ($datos as $v) {
                    $p = $v->idreclamacion;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idreclamacion':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delReclamacionAction('local');
                $this->addReclamacionAction('local');
                $obj->modReclamacion($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar ', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delReclamacionAction($accion)
    {
        try {

            $objMedios = new DatReclamacionModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $objMedios->delReclamacion($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }




    /**
     * CONCEPTO Aseo
     */
    public function getAseopAction()
    {
        try {
            $obj = new DatAseopModel();

            if ($this->_getParam('idpersona') != '') {
                $this->response = $obj->getAseop(array($this->_getParam('idpersona')));
            } else {
                throw new Exception('No existe la persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addAseopAction($accion)
    {
        try {
            $objMedios = new DatAseopModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idaseop' => '',
                    'idaseo' => '',
                    'fdesde' => '',
                    'fhasta' => ''

                );
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objMedios->addAseop($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modAseopAction()
    {
        try {
            $obj = new DatAseopModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idaseop' => '',
                    'idaseo' => '',
                    'fdesde' => '',
                    'fhasta' => ''
                );
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));

                foreach ($datos as $v) {
                    $p = $v->idaseop;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idaseop':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->deltAseopAction('local');
                $this->addAseopAction('local');
                $obj->modAseop($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar ', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function deltAseopAction($accion)
    {
        try {

            $objMedios = new DatAseopModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $objMedios->delAseop($datos, null);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }


    /**
     * CONCEPTO FAMILIAR O AMIGOS CON VIAJES AL EXTERIOR
     */
    public function getFamiliarViajeByPesonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objFamilairViaje->getFamiliarViajeByPesona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function gestionarFamiliarViajeAction()
    {
        try {
            if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
                $add = $this->_objFamilairViaje->adicionarFamiliarViaje(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrAdd'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrMod'))) > 0) {
                $add = $this->_objFamilairViaje->modificarFamiliarViaje(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrMod'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrDel'))) > 0) {
                $add = $this->_objFamilairViaje->eliminarFamiliarViaje(json_decode($this->_getParam('arrDel')));
                $this->response->success = is_numeric($add) ? true : false;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     * FAMILIAR RESIDENTE EN EXTERIOR
     */
    public function getFamiliarResidenteByPesonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objFamiliarExterior->getFamiliarResidenteByPesona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos', 3);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function gestFamiliarResidenteAction()
    {
        try {
            if (count(json_decode($this->_getParam('arrAdd'))) > 0) {

                $add = $this->_objFamiliarExterior->adicionarFamiliarResidente(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrAdd'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrMod'))) > 0) {
                $add = $this->_objFamiliarExterior->modificarFamiliarResidente(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrMod'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrDel'))) > 0) {
                $add = $this->_objFamiliarExterior->eliminarFamiliarResidente(json_decode($this->_getParam('arrDel')));
                $this->response->success = is_numeric($add) ? true : false;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /***
     *Relaciones en el exterior
     */
    public function getFamiliarRelacionesByPesonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objFamiliarRelaciones->getFamiliarRelacionesByPesona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos', 3);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function gestFamiliarRelacionesAction()
    {
        try {
            if (count(json_decode($this->_getParam('arrAdd'))) > 0) {

                $add = $this->_objFamiliarRelaciones->adicionarFamiliarRelaciones(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrAdd'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrMod'))) > 0) {
                $add = $this->_objFamiliarRelaciones->modificarFamiliarRelaciones(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrMod'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrDel'))) > 0) {
                $add = $this->_objFamiliarRelaciones->eliminarFamiliarRelaciones(json_decode($this->_getParam('arrDel')));
                $this->response->success = is_numeric($add) ? true : false;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /***
     * Familiares sancionados
     */
    public function getSancionesJudicialesAction()
    {
        try {
            $enlaces = new EnlacesStaticosService();
            $sancion = new NomSancionModel();
            $tipo = new NomTiposancionModel();
            $tiposancion = $tipo->getTipoSanctionByCodigo($enlaces->getIdJudiciales());
            $this->response = $sancion->getSanctionActive($tiposancion['idnomenclador']);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }


    public function getFamiliarSancionadoByPesonaAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $this->response = $this->_objFamiliarSancionado->getFamiliarSancionadoByPesona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos', 3);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function gestFamiliarSancionadoAction()
    {
        try {
            if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
                $add = $this->_objFamiliarSancionado->adicionarFamiliarSancionado(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrAdd'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrMod'))) > 0) {
                $add = $this->_objFamiliarSancionado->modificarFamiliarSancionado(
                    json_decode($this->_getParam('idpersona')),
                    json_decode($this->_getParam('arrMod'))
                );
                $this->response->success = is_numeric($add) ? true : false;
            }
            if (count(json_decode($this->_getParam('arrDel'))) > 0) {
                $add = $this->_objFamiliarSancionado->eliminarFamiliarSancionado(json_decode($this->_getParam('arrDel')));
                $this->response->success = is_numeric($add) ? true : false;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    public function exportarPersonasAction()
    {
        $objExport = new ExportarPersonaModel();
        $objExport->exportarPersonaData(
            Zend_Json::decode($this->_getParam('idspersona')), $this->_getParam('idproyecto')
        );
    }

    public function importarPersonasAction()
    {
        $objExport = new ImportarPersonaModel();
        $resp = $objExport->importarPersonaData(
            $_FILES['personafile']
        );
        $this->response->success = true;
        $this->responseRequest();
    }

    /**
     * CONCEPTO CANTERA
     */
    public function getCargosAction()
    {
        try {
            $objModel = new DatCanteraModel();
            $resul = $objModel->getCargos($this->_getParam('query') /*,$this->_getParam('limit', 15),
                $this->_getParam('start', 0)*/);

            $this->response->data = $resul;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addCanteraAction($accion)
    {
        try {
            $objModel = new DatCanteraModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'fechapropuesta' => '', 'fechatermino' => '', 'estadocantera' => '', 'idcargopropuesto' => '', 'idorganismo' => '', 'idpropone' => '', 'propone' => '');
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objModel->addCantera($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionarle la cantera', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCanterasAction()
    {
        try {

            $objModel = new DatCanteraModel();
            $this->response = $objModel->getCanteras(
                $this->_getParam('idpersona'), $this->_getParam('limit', 15),
                $this->_getParam('start', 0)
            );
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modCanteraAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $objFrom = new DatCanteraModel();
                $indixes = array(
                    'fechapropuesta' => '', 'fechatermino' => '', 'estadocantera' => '', 'idcargopropuesto' => '',
                    'idorganismo' => '', 'idpropone' => '', 'propone' => '', 'idcantera' => '');
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idcantera;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idcantera':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delCanteraAction('local');
                $this->addCanteraAction('local');
                $objFrom->modCantera($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar los datos de cantera', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function delCanteraAction($accion)
    {
        try {
            $objFrom = new DatCanteraModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $idpersona = json_decode($this->_getParam('idpersona'));
            $objFrom->delCantera($datos, $idpersona);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getArbolEntidadesAction()
    {
        try {
            if ($this->_getParam('node') === 'root') {
                $r = $this->_objEst->getRoot($this->global->Estructura->idestructura);
            } else {
                $r = $this->_objEst->getEstructura($this->_getParam('node'));
            }
            $this->response = $r;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Constructor de la clase
     */
    protected function gestionarpersonaAction()
    {
        $this->render();
    }

    public function cargarNumerosPublicosAction()
    {
        $DOSM = new DatPersonaentidadModel();
        $temp = $DOSM->getAllNumerosPublicos();
        $nom = array('datos' => $temp);
        echo(json_encode($nom));
    }

    public function addNiveleducacionalAction($accion)
    {
        try {
            $objModel = new DatNiveleducacionalModel();
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idniveleducacional' => '', 'fdesde' => '', 'descripcion' => '', 'idtitulo' => '');
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $objModel->addNiveleducacional($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionarle el nivel educacional', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getNiveleducacionalAction()
    {
        try {
            $objModel = new DatNiveleducacionalModel();
            $this->response = $objModel->getNiveleducacional(
                $this->_getParam('idpersona'), $this->_getParam('limit', 15),
                $this->_getParam('start', 0)
            );
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modNiveleducacionalAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $objFrom = new DatNiveleducacionalModel();
                $indixes = array('idniveleducacionalp' => '', 'idniveleducacional' => '', 'fdesde' => '', 'descripcion' => '', 'idtitulo' => '');
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idniveleducacionalp;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idniveleducacionalp':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delNiveleducacionalAction('local');
                $this->addNiveleducacionalAction('local');
                $objFrom->modNiveleducacional($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar el nivel educacional', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delNiveleducacionalAction($accion)
    {
        try {
            $objFrom = new DatNiveleducacionalModel();
            $datos = json_decode($this->_getParam('arrDel'));
            $idpersona = json_decode($this->_getParam('idpersona'));
            $objFrom->delNiveleducacional($datos, $idpersona);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getDenomEntidadAction()
    {
        try {
            $orgentidad = $this->_getParam('orgentidad');
            if ($orgentidad) {
                HisTrayectorialaboralModel::getDenomEntidad($orgentidad);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getEstadoViviendaAction()
    {
        try {
            $objEstadoViv = new NomEstadoviviendaModel();
            $this->response->data = $objEstadoViv->getEstadoVivienda();

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getConvivenciaAction()
    {
        try {
            $objConvivencia = new NomConvivenciaModel();
            $this->response->data = $objConvivencia->getConvivencia();

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getEstadoViviendaByPersonaAction()
    {
        try {
            $idpersona = json_decode($this->_getParam('idpersona'));
            $objEstado = new DatEstadoviviendaModel();
            $this->response = $objEstado->getEstadoViviendaByPersona($idpersona);
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getReservaAction()
    {
        try {
            $idpersona = json_decode($this->_getParam('idpersona'));
            $this->response->data = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getDatosPersonaReserva(array($idpersona));
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addEstadoViviendaAction($accion)
    {
        try {
            $objModel = new DatEstadoviviendaModel();
            if ($this->_getParam('idpersona') != '') {
                $idconvivencia = $this->_getParam('idconvivencia');
                $idestadovivienda = $this->_getParam('idestadovivienda');
                $objModel->addEstadoVivienda($idconvivencia, $idestadovivienda, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionarle el estado de vivienda', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modEstadoViviendaAction($accion)
    {
        try {
            $objModel = new DatEstadoviviendaModel();
            if ($this->_getParam('idpersona') != '') {
                $idconvivencia = $this->_getParam('idconvivencia');
                $idestadovivienda = $this->_getParam('idestadovivienda');
                $idestadoviviendap = $this->_getParam('idestadoviviendap');
                $objModel->modEstadoVivienda($idestadoviviendap, $idconvivencia, $idestadovivienda, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionarle el estado de vivienda', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function importarPersonaExcelAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $idestructura = $this->global->Estructura->idestructura;
        $nameFile = explode('.', $_FILES['fileUpload']['name']);
        if ($nameFile[count($nameFile) - 1] == 'xls') {
            $dir_file = $_FILES["fileUpload"]["tmp_name"];
            if (file_exists($dir_file)) {
                $objReader = PHPExcel_IOFactory::createReaderForFile($dir_file);
                $objReader->setReadDataOnly(true);
                $excelObject = $objReader->load($dir_file);
                $excelObject->setActiveSheetIndex(0);
                $array_aux = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(2);
                $array_tallaje = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(3);
                $array_medio = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(4);
                $array_sanciones = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(5);
                $array_condecoracion = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(6);
                $array_ingresos = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(7);
                $array_nivel = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(8);
                $array_estudios = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(9);
                $array_familiar = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $excelObject->setActiveSheetIndex(10);
                $array_afecciones = $excelObject->getActiveSheet()->toArray('', true, true, true);
                $objtPersona = new DatPersona();
                $result = $objtPersona->ImportarPersona($array_aux, $array_tallaje, $array_medio, $array_sanciones, $array_condecoracion, $array_ingresos, $array_nivel, $array_estudios, $array_familiar, $array_afecciones, $idestructura);
                if ($result == true) {
                    $respuesta->codMsg = 1;
                    $respuesta->success = 'true';
                    echo json_encode($respuesta);
                    return;
                } else {
                    $respuesta->codMsg = 3;
                    $respuesta->failure = 'true';
                    echo json_encode($respuesta);
                    return;
                }
            } else {
                $respuesta->codMsg = 5;
                $respuesta->failure = 'true';
                echo json_encode($respuesta);
            }
        } else {
            $respuesta->codMsg = 6;
            $respuesta->failure = 'true';
            echo json_encode($respuesta);
        }
    }

    public function darAltaAction()
    {
        try {
            $datos = json_decode($this->_getParam('arrAdd'));
            foreach ($datos as $valor) {
                $idsituacionlaboralp = $valor->idsituacionlaboralp;
                $fdesde = $valor->fdesde;
                $fhasta = $valor->fhasta ? $valor->fhasta : null;
                $idsituacion = $valor->idsituacion;
                $principal = $valor->principal == false ? 0 : 1;
                $idcargo = $valor->idcargo;
                $result = $idcargo != null ? ZendExt_IoC::getInstance()->metadatos->BuscarEntidadXidcargo($idcargo) : null;
                $identidad = $result[0]['idestructura'];
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo(array($idcargo));
                $idarea = $cargo[0]['idpadre'];
                $result = DatSituacionlaboralModel::darAlta(
                    $this->_getParam('idpersona'),
                    $identidad,
                    $fdesde,
                    $fhasta,
                    $idcargo,
                    $idsituacion,
                    null,
                    null,
                    $idarea,
                    null,
                    $principal,
                    null,
                    null,
                    null
                );
            }
            $this->response->data = $result;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function setAltaAction()
    {
        try {
            $datos = json_decode($this->_getParam('arrMod'));
            foreach ($datos as $valor) {
                $idsituacionlaboralp = $valor->idsituacionlaboralp;
                $fdesde = $valor->fdesde;
                $fhasta = $valor->fhasta ? $valor->fhasta : null;
                $idsituacion = $valor->idsituacion;
                $principal = $valor->principal == false ? 0 : 1;
                $idcargo = $valor->idcargo;
                $result = $idcargo != null ? ZendExt_IoC::getInstance()->metadatos->BuscarEntidadXidcargo($idcargo) : null;
                $identidad = $result[0]['idestructura'];
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo(array($idcargo));
                $idarea = $cargo[0]['idpadre'];
                $respuesta = DatSituacionlaboralModel::setAlta(
                    $idsituacionlaboralp, $identidad, $fdesde, $fhasta,
                    $idsituacion, null, null, $idarea, null,
                    $principal, $idcargo, null, null
                );
            }
            $this->response->data = $respuesta;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function darBajaAction()
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            foreach ($datos as $valor) {
                $idsituacionlaboralp = $valor;
                $respuesta = DatSituacionlaboral::removeRecord($idsituacionlaboralp);
            }
            $this->response->data = $respuesta;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getCargosByPersonaAction()
    {
        try {
            $idpersona = json_decode($this->_getParam('idpersona'));
            $result = DatSituacionlaboral::getCargosByPerson($idpersona);
            foreach ($result as $i => $valor) {
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($valor['idarea']);
                $result[$i]['denomarea'] = $estructura[0]->denominacion;
            }
            $this->response->data = $result;
            $this->response->quantity = count($this->response->data);

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }


    public function getProcesosAction()
    {
        try {
            $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->getProcesosActivos();

        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();

    }

    public function getViasReclutamientoAction()
    {
        try {
            $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->getViasReclutamiento();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addProcesoActivoAction($accion)
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idproceso' => '', 'idviareclutamiento' => '', 'observacion' => '');
                $valores = array();
                $datos = json_decode($this->_getParam('arrAdd'));
                $p = 0;
                foreach ($datos as $v) {
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                    $p++;
                }
                $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->addProcesoActivo($valores, $this->_getParam('idpersona'));
                if (isset($accion)) {
                    return;
                }
            } else {
                throw new Exception('No existe persona a la cual adicionarle el proceso', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getProcesoActivoAction()
    {
        try {
            $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->getProcesosByPersona($this->_getParam('idpersona'));
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function modProcesoActivoAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'idcandidato' => '', 'idproceso' => '', 'idviareclutamiento' => '', 'observacion' => '');
                $valores = array();
                $arrIds = array();
                $datos = json_decode($this->_getParam('arrMod'));
                foreach ($datos as $v) {
                    $p = $v->idcandidato;
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idcandidato':
                                $arrIds[] = $v->$i;
                                break;
                            default:
                                $valores[$p][$i] = $v->$i;
                                break;
                        }
                    }
                }
                $this->delProcesoActivoAction('local');
                $this->addProcesoActivoAction('local');
                $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->modProcesoActivo($valores, $arrIds, $this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona a la cual modificar el proceso', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function delProcesoActivoAction($accion)
    {
        try {
            $datos = json_decode($this->_getParam('arrDel'));
            $idpersona = json_decode($this->_getParam('idpersona'));
            $this->response->data = ZendExt_IoC_Inter::getInstance()->seleccion->delProcesoActivo($datos, $idpersona);
            if (isset($accion)) {
                return;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function generarPdfFichaAction()
    {
        $objPers = new DatPersonaModel();
        $contenido = $objPers->getContenidoFicha($this->_getParam('idpersona'));
        $pdf = new GenerarTCPDF();
        $pdf->ConstruirFicha($contenido);
        return true;
    }

    function generarFichaCuadroAction()
    {
        $objPers = new DatPersonaModel();
        $contenido = $objPers->getContenidoFichaCuadro($this->_getParam('idpersona'));
        $pdf = new GenerarTCPDF();
        $pdf->ConstruirFicha($contenido);
        return true;
    }

    public function obtenerFamiliarccAction()
    {

        try {
            if ($this->_getParam('idpersona') != '') {
                $obj = new DatFamiliarSegundoModel();
                $this->response = $obj->obtenerFamiliarPorPersona($this->_getParam('idpersona'));
            } else {
                throw new Exception('No existe persona de la cual obtener los datos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function gestionarFamiliarccAction()
    {
        if (count(json_decode($this->_getParam('arrAdd'))) > 0) {
            DatFamiliarSegundoModel::adicionarFamiliar(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrAdd'))
            );

        }
        if (count(json_decode($this->_getParam('arrMod'))) > 0) {
            DatFamiliarSegundoModel::modificarFamiliar(
                json_decode($this->_getParam('idpersona')),
                json_decode($this->_getParam('arrMod'))
            );
        }
        if (count(json_decode($this->_getParam('arrDel'))) > 0) {
            DatFamiliarSegundoModel::eliminarFamiliar(json_decode($this->_getParam('arrDel')));
        }
        $this->responseRequest();
    }

    public function getDatosPsicometricosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $data =  $this->_objPsicometrico->getDatosPsicometricosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = ($data->quantity > 0) ? $data->data[0] : array();
            } else {
                throw new Exception('No existe persona a la cual obtener los datos psicométricos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function addDatosPsicometricosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'coeficiente' => '', 'expresion' => '', 'apariencia' => '', 'motivacion' => '',
                    'perfil' => '', 'explaboral' => '', 'expactividad' => '','aptoperfil' => '','resumen' => '');
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'coeficiente':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'expresion':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'apariencia':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'motivacion':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'perfil':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'explaboral':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'expactividad':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'aptoperfil':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'resumen':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                    }
                }
               // print_r($valores);die;
                $valores['idcaracterizacion'] = $this->_objPsicometrico->addDatosPsicometricos(
                    $valores, $this->_getParam('idpersona')
                );
                $data =  $this->_objPsicometrico->getDatosPsicometricosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     *
     */
    public function modDatosPsicometricosAction()
    {
        try {
            if ($this->_getParam('idpersona') != '') {
                $indixes = array(
                    'coeficiente' => '', 'expresion' => '', 'apariencia' => '', 'motivacion' => '','perfil' => '',
                    'explaboral' => '', 'expactividad' => '','idcaracterizacion'=>'','aptoperfil' => '','resumen' => '');
                $valores = array();
                foreach ($indixes as $k => $v) {
                    switch ($k) {
                        case 'coeficiente':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'expresion':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'apariencia':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'motivacion':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'perfil':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'explaboral':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'expactividad':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'idcaracterizacion':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'aptoperfil':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                        case 'resumen':
                            $valores[$k] = $this->_getParam($k) != '' ? $this->_getParam($k) : null;
                            break;
                    }
                }

                $this->_objPsicometrico->modDatosPsicometricos($valores, $this->_getParam('idpersona'));
                $data =  $this->_objPsicometrico->getDatosPsicometricosByPersona(
                    array($this->_getParam('idpersona'))
                );
                $this->response->data = $data->data[0];
            } else {
                throw new Exception('No existe persona a la cual obtener los datos fenotipicos', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Concpeto: Datos Sociales
     */
    public function obtenerDisposicionesAction(){
        $model = new NomDisposicionModel();
        $result = $model->getDisposicionActive();
        echo json_encode($result);
    }

    /**
     * Concepto: Trayectoria Laboral
     */
    public function obtenerCategOcupacionalAction() {
        $modelo = new HisTrayectorialaboral();
        $resultado = $modelo->obtenerCategOcupacional();
        echo json_encode($resultado);
    }
}