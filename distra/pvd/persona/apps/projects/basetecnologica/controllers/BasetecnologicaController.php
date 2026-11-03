<?php

$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$config['include_path'] = get_include_path();

$d = explode('web/',$dirabsmt);
$p = "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/controllers/";
/* $p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/models/bussines/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/models/domain/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/models/domain/generated/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/comun/services/"; */

$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/controllers/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/bussines/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/domain/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/models/domain/generated/";
$p .= "" . PATH_SEPARATOR . $d[0] . "apps/pvd/persona/services/";
$config["include_path"] .= $p;
//die($p);
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

//Include PHPExcel to import person data
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/PHPExcel.php');
include_once(Zend_Registry::get('config')->dir_aplication . '/pvd/comun/recursos/PHPExcel/PHPExcel/IOFactory.php');

/**
 * Clase controladora de la personalización de persona basetecnologica
 */
class BasetecnologicaController extends GestionarpersonaController
{

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Inicializa las variables necesarias
     */
    public function basetecnologicaAction()
    {
        $this->view->jsnomproducto = $this->integrator->logistica->getJsNomencladorProductos();
        //$js = array("<script type='text/javascript' src='/pvd/comun/views/js/buscadorexterno/fuc.js'></script>");
        $this->cargaInicial(
            'personalizacion_persona', 'basetecnologica', null, array(
                'cssBase' => 'ext-jquery', 'dirBaseExtjs' => 'ext-jquery')
        );
        $this->render();
    }

    public function getP3AltayBajasAction()
    {
        try {
            $obj = new ReporteMrg();
            $obj->getP3_Altas_Bajas();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getP4RegistroTrabajadoresAction()
    {
        try {
            $obj = new ReporteMrg();
            $obj->getP4_RegistroTrabajadores();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Reporte que genera la Planilla del Cuadro
     */
    public function getPlanillaCuadroAction()
    {
        try
        {
            $obj = new DatpersonaModel();
            $idpersona = $this->_getParam('idpersona');
            $dir_host = $_SERVER ['HTTP_HOST'];
            $http = isset($_SERVER ['HTTPS']) ? 'https' : 'http';
            $url = " { $http } :// { $dir_host } /pvd/persona/views/images/fotos/";
            $path = substr(
                    __FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'apps' . DIRECTORY_SEPARATOR)
                ) . DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'persona' .
                DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'fotos' .
                DIRECTORY_SEPARATOR;
            $persona = $obj->getPrincipalesDatosPersonaByIdCuadro($idpersona);
            $personaTotal = $persona->data[0];
            $personales['nombre'] = $personaTotal['nombre'];
            $personales['snombre'] = $personaTotal['snombre'];
            $personales['papel'] = $personaTotal['papel'];
            $personales['sapel'] = $personaTotal['sapel'];
            $personales['numid'] = $personaTotal['numid'];
            $personales['sexo'] = $personaTotal['sexo'];
            if ($persona->data[0] ['foto'])
            {
                file_put_contents($path . $personaTotal['idpersona'] . '.png', base64_decode($personaTotal['foto']));
                $foto = '/pvd/persona/views/images/fotos/' . $personaTotal['idpersona'] . '.png';
            }
            $nacimineto['idmunicipio'] = $personaTotal['idmunicipion'];
            $nacimineto['idprovincia'] = $personaTotal['idprovincian'];
            $nacimineto['idpais'] = $personaTotal['idpaisn'];
            $ciudanaias = $personaTotal['ciudanaias'];
            $fenotipo = $personaTotal['fenotipo'];
            $residencia = $personaTotal['direcciones'];
            $contacto = $personaTotal['conctatos'];
            $escolaridad = $personaTotal['nivelescolar'];
            $categoria = $personaTotal['categoria'];
            $categoriasgral['gradocientifico'] = $personaTotal['gradocientifico'];
            $categoriasgral['categoriadocente'] = $personaTotal['categoriadocente'];
            $categoriasgral['categinvestig'] = $personaTotal['categinvestig'];
            $idioma = $personaTotal['idiomas'];
            $afiliaciones = $personaTotal['afiliaciones'];
            $trayectoria = $personaTotal['trayectoria'];
            $trayectoriacargos = $personaTotal['trayectoriacargos'];
            $um = $this->integrator->metadatos->DameEstructura($personaTotal['identidad']);
            $trabajo['direccion'] = $um[0]->direccion;
            $datoscargo = $this->integrator->metadatos->obtenerDatosCargo($personaTotal['idcargo']);
            $especialidad = $personaTotal['especialidad'];
            $trabajo['salario'] = $datoscargo[0]['salario'];
            $trabajo['cargo'] = $datoscargo[0]['denominacion'];
            $cargosorganizacion = $personaTotal['cargosorganizacion'];
            $afecciones = $personaTotal['afecciones'];
            $estadosalud = $personaTotal['estadosalud'];
            $educacion = $personaTotal['educacion'];
            $ocupaciontiempoguerra = $personaTotal['ocupaciontiempoguerra'];
            $estanciaexterior = $personaTotal['estanciaexterior'];
            $condecoraciones = $personaTotal['condecoraciones'];
            $sanciones = $personaTotal['sanciones'];
            $familiares = $personaTotal['familiaresyamigos'];
            $familiarexterior = $personaTotal['familiaresexterior'];
            $relacionextranjero = $personaTotal['relacionextranjero'];
            $familiarviaje = $personaTotal['familiarviaje'];
            $familiarsancionado = $personaTotal['familiarsancionado'];
            $familiarresidente = $personaTotal['familiarresidente'];
            $ingreso = $personaTotal['ingreso'];
            if ($idpersona != '')
            {
                $objPlanilla = new Planilla($idpersona);
                $objPlanilla->CrearPlanilla();
                $objPlanilla->CrearPagina1();
                $objPlanilla->CrearPagina2();
                $objPlanilla->CrearPagina3(
                    $personales, $foto, $nacimineto, $ciudanaias, $fenotipo, $residencia, $contacto, $especialidad,
                    $escolaridad, $categoriasgral, $idioma, $afiliaciones, $trayectoria, $trabajo
                );
                $objPlanilla->CrearPagina4(
                    $cargosorganizacion, $estadosalud, $afecciones, $trayectoriacargos, $residencia, $educacion,
                    $ocupaciontiempoguerra, $estanciaexterior, $condecoraciones, $sanciones, $familiares,
                    $familiarexterior,$familiarviaje,$familiarsancionado,$familiarresidente,$ingreso
                );
                $objPlanilla->Guardar();
            } else
            {
                throw new Exception('No existe persona para la cual generar la Planilla del Cuadro', 3);
            }
        } catch (Exception $e)
        {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    /**
     * Reporte que genera la Sitesis Bio
     */
    public function getPerfilCuadroAction()
    {
        $idpersona = $this->_getParam('idpersona');
        $obj = new DatpersonaModel();
        $dir_host = $_SERVER ['HTTP_HOST'];
        $http = isset ($_SERVER ['HTTPS']) ? 'https' : 'http';
        $url = " { $http } :// { $dir_host } /pvd/persona/views/images/fotos/";
        $path = substr(__FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'apps' . DIRECTORY_SEPARATOR)) .
            DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR . 'pvd' . DIRECTORY_SEPARATOR . 'persona' .
            DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'fotos' .
            DIRECTORY_SEPARATOR;
        $persona = $obj->getPrincipalesDatosPersonaByIdCuadro($idpersona);
        if ($persona->data[0]['foto']) {
            file_put_contents(
                $path . $persona->data[0] ['idpersona'] . '.png', base64_decode($persona->data[0] ['foto'])
            );
            $ficha_data['foto'] = '/pvd/persona/views/images/fotos/' . $persona->data[0] ['idpersona'] . '.png';
        }
        $ficha_data['numid'] = $persona->data[0]['numid'];
        $ficha_data['nombres'] = $persona->data[0]['nombre'] . ' ' . $persona->data[0]['snombre'];
        $ficha_data['papel'] = $persona->data[0]['papel'];
        $ficha_data['sapel'] = $persona->data[0]['sapel'];
        $ficha_data['direccion'] = $persona->data[0]['direccion'];
        $ficha_data['provincia'] = $persona->data[0]['provincia'];
        $ficha_data['municipio'] = $persona->data[0]['municipio'];
        $ficha_data['fechanacimiento'] = $persona->data[0]['fechanacimiento'];
        $ficha_data['pelo'] = $persona->data[0]['fenotipo'][0]['pelo'];
        $ficha_data['piel'] = $persona->data[0]['fenotipo'][0]['piel'];
        $ficha_data['ojos'] = $persona->data[0]['fenotipo'][0]['ojos'];
        $ficha_data['peso'] = $persona->data[0]['fenotipo'][0]['pesocorporal'];
        $ficha_data['estatura'] = $persona->data[0]['fenotipo'][0]['estatura'];
        $ficha_data['gsanguineo'] = $persona->data[0]['fenotipo'][0]['gruposanguineo'];
        $ficha_data['nivelescolar'] = $persona->data[0]['preparacion'];
        $ficha_data['cargoactual'] = $persona->data[0]['denomcargo'];
        $ficha_data['trayectoria'] = $persona->data[0]['trayectoria'];
        $ficha_data['preparaciocivil'] = $persona->data[0]['educacion'];
        $ficha_data['afiliaciones'] = $persona->data[0]['afiliaciones'];
        $ficha_data['estanciaexterior'] = $persona->data[0]['estanciaexterior'];
        $ficha_data['sanciones'] = $persona->data[0]['sanciones'];
        foreach ($ficha_data['trayectoria'] as $key => $value) {
            if ($value['principal'] == 1) {
                $ficha_data['area'] = $persona->data[0]['trayectoria'][0]['area'];
                $ficha_data['entidad'] = $persona->data[0]['trayectoria'][0]['entidad'];
            }
        }
        $datoscargo = $this->integrator->metadatos->obtenerDatosCargo($persona->data[0]['idcargo']);
        $ficha_data['salario'] = $datoscargo[0]['salario'];

        if ($ficha_data['fechanacimiento']) {
            $yearactual = date('Y');
            $fecha = explode('/', $ficha_data['fechanacimiento']);
            $year = $fecha[2];
            $edad = $yearactual - $year;
            $ficha_data['edad'] = $edad;
        } else {
            $ficha_data['edad'] = ' ';
        }
        $objPerfil = new Perfil($ficha_data);
        $objPerfil->salvarPerfil();
        $r = new StdClass();
        $r->url = "/pvd/persona/projects/basetecnologica/SitesisBio.rtf";
        echo json_encode($r);
    }

    public function generarRTFExpedienteAction()
    {
        $idpersona = $this->_request->getParam('idpersona');
        $objRes = new ExpedienteRTF($datos);
        $objRes->CrearExpediente($idpersona);
        $r->msg = "";
        $r->url = "/pvd/persona/projects/basetecnologica/Expediente.rtf";
        echo json_encode($r);
    }

    public function syncActivoFaRAction()
    {
        $activos = new SyncpersonasactivosModel();
        //En la rieccion IP escribir la direccion IP real del sitio, respetar a partir de (/_servicios/wsdl/sosActivos.wsdl)-> Mantener esto
        $oSoapClient = new SoapClient("http://10.17.1.42/DATAFAR/_servicios/wsdl/sosActivos.wsdl");
        //Parametros...
        /*Fijos*/
        $conf['nFuncion'] = 'ObtenerDatosPlantilla';
        $conf['idFuente'] = 0;
        $conf['nClase'] = 'lnServActivos';
        $conf['usuario'] = 'diango';
        $conf['clave'] = '0123';
        /*Aspectos Configurables.*/
        $conf['idvariante'] = 0; //Variante de servicio: 0 -> Buscar x Nro.Publico  dee Unidades Militares |  1 -> Buscar x No.IDENTIDAD de la Persona
        $conf['idtipocarne'] = 0; //Variante de Carne: 0-> Numero de Identidad Civil | 1-> Numero de Identidad Militar
        $conf['cadena'] = $this->_getParam('n_publico'); //'4610'; //NroPublico:2800		NUMID:46102600000
        $conf['tiporetorno'] = 0; //Tipo de retorno de la consulta 0: COLUMNA 1: NUMERICO
        $result = $oSoapClient->controlServicios($conf);
        if ($result == -1) {
            $this->response->success = -1;
        } else {
            if (is_array($result)) {
                try {
                    $idpers = array();
                    foreach ($result as $data) {
                        $idpers[] = $data['idpers'];
                    }
                    //buscando las personas que fueron eliminadas en activos para eliminarlas aqui
                    $dataEstruct = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion($this->_getParam('n_publico'), 0, 0, 0);
                    $query1 = Doctrine_Query::create()
                        ->select('dp.idpersona as idpersona')
                        ->from('DatPersona dp')
                        ->innerJoin('dp.DatPersonaentidad do')
                        ->whereNotIn('dp.idsuin', $idpers)
                        ->andWhere('do.identidad = ' . $dataEstruct['identidad']);
                    $personasEliminar = $query1->execute()->toArray();
                    if (count($personasEliminar) > 0) {
                        foreach ($personasEliminar as $key => $pers) {
                            $idpersEliminar[] = $pers['idpersona'];
                        }
                        $this->EliminarPersonas($idpersEliminar);
                    }
                    //buscando las personas que fueron eliminadas en activos para eliminarlas aqui
                    $query = Doctrine_Query::create()
                        ->from('DatPersona')
                        ->whereIn('idsuin', $idpers);
                    $persons = $query->execute()->toArray();
                    $existe = false;
                    $guardar = true;
                    $arrayNoExtisten = array();
                    $NoMigrados = array();
                    if (count($persons) > 0) {
                        foreach ($persons as $k => $val) {
                            $personas[$val['idsuin']] = $val;
                        }
                        foreach ($result as $p => $v) {
                            $existe = false;
                            if (mb_strlen($v['noidentidad']) < 2) {
                                $NoMigrados = array_push($NoMigrados, $v['nombre'] . ' ' . $v['papell'] . ' ' . $v['sapell']);
                            } else {
                                    if (is_array($personas[$v['idpers']])) {
                                        $existe = true;
                                            $this->UpdPeopleActivos($v, $personas[$v['idpers']]);
                                    }
                                if (!$existe) {
                                    $arrayNoExtisten[] = $v;
                                }
                            }
                        }
                        if (count($arrayNoExtisten) > 0) {
                            $respuesta = $this->AddPeopleActivos($arrayNoExtisten, $this->_getParam('n_publico'));
                            $collection = $respuesta[0];
                            $cargos = $respuesta[2];
                        } else
                            $guardar = false;
                    } else {
                        $respuesta = $this->AddPeopleActivos($result, $this->_getParam('n_publico'));
                        $collection = $respuesta[0];
                        $cargos = $respuesta[2];
                    }
                } catch (Doctrine_Exception $e) {
                    print_r($e);
                    die;
                }
                try {
                    $this->response->datos = $result;
                    $this->response->cantidad = count($result);
                    if ($guardar) {
                        $collection->save();
                        foreach ($cargos as $k => $idcargo) {
                            $sitlaboral = new DatSituacionlaboral();
                            $cantByCargon = $sitlaboral->getCantPersonaCargo($idcargo);
                            if ($cantByCargon != -1) {
                                ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($idcargo, $cantByCargon);
                            }
                        }
                    }
                } catch (Doctrine_Exception $e) {
                    $this->responseExceptions($e);
                    return;
                }
            } else {
                $this->response->success = FALSE;
            }
            if (count($respuesta[1]) > 0) {
                $this->response->success = FALSE;
                $this->response->codigo = 1;
                $this->response->mensaje = 'Las siguientes personas no tiene carnet de identidad registrado por lo que sus datos no fueron migrados: ' . implode(',', $NoMigrados);
            }
        }
        $this->responseRequest();
    }

    private function AddPeopleActivos($result, $nopublico)
    {
        $collection = new Doctrine_Collection('DatPersona');
        $NoMigrados = array();
        $arreglocargos = array();
        $resultado = array();
        foreach ($result as $k => $v) {
            $cant = mb_strlen($v['noidentidad']);
            if ($cant < 2) {
                $NoMigrados = array_push($NoMigrados, $v['nombre'] . ' ' . $v['papell'] . ' ' . $v['sapell']);
            } else {
                $nombres = explode(' ', $v['nombre']);
                $collection[$k]->nombre = $nombres[0];
                $collection[$k]->snombre = $nombres[1];
                $collection[$k]->papel = $v['papell'];
                $collection[$k]->sapel = $v['sapell'];
                $collection[$k]->sexo = $v['sexo'];
                $collection[$k]->idsuin = $v['idpers'];
                $collection[$k]->idestructura = $v['idestructura'];
                $collection[$k]->DatDocidentidad = Utiles::linkCollectionToSave($collection[$k]->DatDocidentidad, array(
                    'idtipodocidentidad' => $v['tipoci'] === 0 ? 1 : 2,
                    'numero' => $v['noidentidad'],
                    'principal' => 1
                ));
                if (empty($v['idcargomilitar']) && empty($v['idcargociv'])) {
                    $dataEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion($nopublico, 0, 0, 0);
                } else {
                    if (!empty($v['idcargociv'])) {
                        $dataEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion($nopublico, $v['idarea'], $v['idcargociv'], 0);
                    } else {
                        $dataEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion($nopublico, $v['idarea'], $v['idcargomilitar'], 1);
                    }
                }
                $dataEntidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dataEstructura['identidad']);    //para buscar la denominacion de la entidad que no viene en el servicio de Maikel.
                $collection[$k]->DatPersonaentidad = Utiles::linkCollectionToSave($collection[$k]->DatPersonaentidad, array(
                    'identidad' => $dataEstructura['identidad'],
                    'fdesde' => date('d-m-Y'),
                    'idprocedenciasocial' => 7
                ));
                $idsituacion = null;
                if ($dataEstructura['idcargo'] == 0 || $dataEstructura['idcargo'] == NULL || $dataEstructura['idcargo'] == "")
                    $idsituacion = 100;
                else
                    $idsituacion = 4;
                foreach ($collection[$k]->DatPersonaentidad as $r => $z) {
                    $collection[$k]->DatPersonaentidad[$r]->DatSituacionlaboral = Utiles::linkCollectionToSave($collection[$k]->DatPersonaentidad[$r]->DatSituacionlaboral, array(
                        'idsituacion' => $idsituacion,
                        'idarea' => $dataEstructura['idarea'],
                        'idcargo' => $dataEstructura['idcargo'],
                        'fdesde' => date('d-m-Y'),
                        'idtipocontrato' => 6,
                        'principal' => 1
                    ));
                    array_push($arreglocargos, $dataEstructura['idcargo']);
                    $resultado = array_unique($arreglocargos);
                }
                if ($v['categoria'] == 1 && !empty($v['idgrado']) && is_numeric($v['idgrado']) && strlen($v['noidentidad']) < 11) {
                    $collection[$k]->DatGradomilitar = Utiles::linkCollectionToSave($collection[$k]->DatGradomilitar, array(
                        'fdesde' => date('d-m-Y')/*$cadOrden[1]*/,
                        'idgrado' => $v['idgrado']
                    ));
                    //para categoria
                    $collection[$k]->DatCategoria = Utiles::linkCollectionToSave(
                        $collection[$k]->DatCategoria,
                        array('fdesde' => date('d-m-Y'),'principal' => 1, 'idcategoriapersona' => 3)
                    );
                }
                else
                {
                    //para categoria
                    $collection[$k]->DatCategoria = Utiles::linkCollectionToSave(
                        $collection[$k]->DatCategoria,
                        array('fdesde' => date('d-m-Y'), 'principal' => 1, 'idcategoriapersona' => 11)
                    );
                }
            }
        }
        $respuesta = array();
        $respuesta[0] = $collection;
        $respuesta[1] = $NoMigrados;
        $respuesta[2] = $resultado;
        return $respuesta;
    }

    private function UpdPeopleActivos($v,$val)
    {
        $persona = Doctrine::getTable('DatPersona')
            ->find($val['idpersona']);
        $nombres = explode(' ', $v['nombre']);
        $persona->nombre = $nombres[0];
        $persona->snombre = $nombres[1];
        $persona->papel = $v['papell'];
        $persona->sapel = $v['sapell'];
        $persona->sexo = $v['sexo'];
        $persona->idsuin = $v['idpers'];
        $persona->idestructura = $v['idestructura'];
        if (!empty($persona->feliminado)) {
            $persona->feliminado = null;
        }
        $persona->save();
        $idpersona = $persona->idpersona;
        $docIdentidad = Doctrine::getTable('DatDocidentidad')
            ->findBy('idpersona', $val['idpersona']);
        $docIdentidad[0]->idtipodocidentidad = $v['tipoci'] === 0 ? 1 : 2;
        $docIdentidad[0]->numero = $v['noidentidad'];
        $docIdentidad[0]->principal = 1;
        $docIdentidad[0]->fdesde = date('d-m-Y');
        $docIdentidad[0]->save();
        if (empty($v['idcargomilitar']) && empty($v['idcargociv'])) {
            $dataEstructura =
                ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion($this->_getParam('n_publico'), 0, 0, 0);
        } else {
            if (!empty($v['idcargociv'])) {
                $dataEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion(
                    $this->_getParam('n_publico'), $v['idarea'], $v['idcargociv'], 0
                );
            } else {
                $dataEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerUbicacion(
                    $this->_getParam('n_publico'), $v['idarea'], $v['idcargomilitar'], 1
                );
            }
        }
        $dataEntidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura(
            $dataEstructura['identidad']
        );    //para buscar la denominacion de la entidad que no viene en el servicio de Maikel.
        $personaentidad = Doctrine::getTable('DatPersonaentidad')
            ->findBy('idpersona', $val['idpersona']);
        $personaentidad[0]->identidad = $dataEstructura['identidad'];
        $personaentidad[0]->fdesde = date('d-m-Y');
        $personaentidad[0]->idprocedenciasocial = 7;
        $personaentidad[0]->save();
        $idpersonaentidad = $personaentidad[0]->idpersonaentidad;
        $idsituacion = null;
        if ($dataEstructura['idcargo'] == 0 || $dataEstructura['idcargo'] == null ||
            $dataEstructura['idcargo'] == ""
        ) {
            $idsituacion = 100;
        } else {
            $idsituacion = 4;
        }
        $sitlaboral = new DatSituacionlaboral();
        $situacionlaboral = $sitlaboral->getByIdPersonaEntidad($idpersonaentidad);
        if ($situacionlaboral == null) {
            $situacionlaboralnew = new DatSituacionlaboral();
            $situacionlaboralnew->idpersonaentidad = $idpersonaentidad;
            $situacionlaboralnew->idsituacion = $idsituacion;
            $situacionlaboralnew->fdesde = date('d-m-Y');
            $situacionlaboralnew->idarea = $dataEstructura['idarea'];
            $situacionlaboralnew->idcargo = $dataEstructura['idcargo'];
            $situacionlaboralnew->idtipocontrato = 6;
            $situacionlaboralnew->principal = 1;
            $situacionlaboralnew->save();
        } else {
            $sitlabprincilap = $sitlaboral->existeConOcupacionPrincipalEntidad($val['idpersona'],$personaentidad[0]->identidad);
            if($sitlabprincilap[0]['idcargo'] != $dataEstructura['idcargo'] ||
                $sitlabprincilap[0]['idsituacion'] != $idsituacion ||
                $sitlabprincilap[0]['idarea'] != $dataEstructura['idarea']){
                $situacionlaboralx = Doctrine::getTable('DatSituacionlaboral')
                    ->findBy('idsituacionlaboralp', $sitlabprincilap[0]['idsituacionlaboralp']);
                $situacionlaboralx = $situacionlaboralx[0];
                $situacionlaboralx->idpersonaentidad = $idpersonaentidad;
                $situacionlaboralx->idsituacion = $idsituacion;
                $situacionlaboralx->fdesde = date('d-m-Y');
                $situacionlaboralx->idarea = $dataEstructura['idarea'];
                $situacionlaboralx->idcargo = $dataEstructura['idcargo'];
                $situacionlaboralx->idtipocontrato = 6;
                $situacionlaboralx->principal = 1;
                $situacionlaboralx->save();
                $idcargoviejo = $situacionlaboralx->idcargo;
            }
        }
        if ($idcargoviejo) {
            $cantByCargov = $sitlaboral->getCantPersonaCargo($idcargoviejo);
            if ($cantByCargov != -1) {
                ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($idcargoviejo, $cantByCargov);
            }
        }
        $cantByCargon = $sitlaboral->getCantPersonaCargo($dataEstructura['idcargo']);
        if ($cantByCargon != -1) {
            ZendExt_IoC::getInstance()->metadatos->registrarAltasBajas($dataEstructura['idcargo'], $cantByCargon);
        }
        $grado = Doctrine::getTable('DatGradomilitar')
            ->findBy('idpersona', $val['idpersona']);
        if ($v['categoria'] == '1' && strlen($v['noidentidad']) < 11) {
            if (!empty($v['idgrado']) && is_numeric($v['idgrado'])) {
                if (count($grado) == 0) {
                    $grado = new DatGradomilitar();
                    $grado->idpersona = $val['idpersona'];
                    $grado->fdesde = date('d-m-Y');
                    $grado->idgrado = $v['idgrado'];
                    $grado->save();
                } else {
                    $grado[0]->idpersona = $val['idpersona'];
                    $grado[0]->fdesde = date('d-m-Y');
                    $grado[0]->idgrado = $v['idgrado'];
                    $grado[0]->save();
                }
            }
        } else {
            if (count($grado) != 0) {
                $grado[0]->idpersona = $val['idpersona'];
                $grado[0]->fdesde = date('d-m-Y');
                $grado[0]->idgrado = 0;
                $grado[0]->save();
            }
        }
        //para la categoria
        $categoria = Doctrine::getTable('DatCategoriapersona')
            ->findBySql(
                'idpersona = ' . $val['idpersona'] . ' and principal = 1 and fhasta is null'
            );
        if (count($categoria) == 0) {
            $categ = new DatCategoria();
            $categ->idpersona = $val['idpersona'];
            $categ->fdesde = date('d-m-Y');
            $categ->principal = 1;
            if ($v['categoria'] == '1' && strlen($v['noidentidad']) < 11) {
                $categ->idcategoriapersona = 3;
            } else {
                $categ->idcategoriapersona = 11;
            }
            $categ->save();
        } else {
            $categoria[0]->fdesde = date('d-m-Y');
            $categoria[0]->principal = 1;
            if ($v['categoria'] == '1' && strlen($v['noidentidad']) < 11) {
                $categoria[0]->idcategoriapersona = 3;//para los militares
            } else {
                $categoria[0]->idcategoriapersona = 11;//para los civiles
            }
            $categoria[0]->save();
        }
    }

    private function EliminarPersonas($idpersonasEliminar)
    {
        foreach ($idpersonasEliminar as $key => $val) {
            $persona = Doctrine::getTable('DatPersona')->find($val);
            $persona->feliminado = date('d-m-Y');
            $persona->save();
        }
    }

    public function getEstructuraAction()
    {
        try {
            if ($this->_getParam('node') === 'root') {
                $id = $this->global->Estructura->idestructura;
				$result = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
            } else {
                $id = $this->_getParam('node');
				$result = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
            }
            $this->response = $result;
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    public function getSituacionAction()
	{
		try {
            $obj = new NomSituacionModel();
			$this->response = $obj->getAllSituation();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
	}

    public function getRutaAlojamientoAction()
    {
        $idestructuraalojamiento = $this->_request->getPost('idestructuraalojamiento');
        $ruta=array();
        $objModel = new NomestructalojamientoModel();
        $resu=$objModel->getRutaAlojamiento($idestructuraalojamiento,$ruta);
        $result=implode('->',$resu);
        echo json_encode($result) ;
    }

    public function getRutaTransportacionAction()
    {
        $idestructuratransportacion = $this->_request->getPost('idestructuratransportacion');
        $ruta=array();
        $objModel = new NomEstructransportacionModel();
        $resu=$objModel->getRutaTransportacion($idestructuratransportacion,$ruta);
        $result=implode('->',$resu);
        echo json_encode($result) ;
    }
}