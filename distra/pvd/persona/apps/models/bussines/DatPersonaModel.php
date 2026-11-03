<?php

class DatPersonaModel extends ZendExt_Model implements IConceptoExport
{
    protected $_objDatPersona;
    protected $_objAccesoSinDominio;
    protected $_response;

    function __construct()
    {
        $this->_objDatPersona = new DatPersona();
        $this->_objAccesoSinDominio = new SegAccesosindominioModel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPersonasActivas($idpersona, $filtro, $limit, $start, $identidad, $sincargo)
    {
        try {
            $idcargos = array();
            if(!empty($identidad)){
                $arrayidentidad = (is_numeric($identidad))?array($identidad):$identidad;
                foreach ($arrayidentidad as $idest){
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idest, true);
                    foreach ($cargos as $c){
                        array_push($idcargos, $c['idcargo']);
                    }
                }
            }
            $this->_response->data = $this->_objDatPersona->getPersonasActivas(
                self::reflectArray($idpersona), $filtro, $limit, $start, $idcargos, $sincargo
            );
            $this->_response->quantity = $limit > 0 ? $this->_objDatPersona->getCantPersonasActivas(
                self::reflectArray($idpersona), $filtro,$idcargos,$sincargo
            ) : count($this->_response->data);

            return $this->_response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function addPersonaCollection(array $persona, array $collDoctrineRecord)
    {
        try {
            $collection = new Doctrine_Collection('DatPersona');
            foreach ($persona as $k => $v) {
                $collection[0]->$k = $v;
            }
            $collection[0]->idestructura = ZendExt_GlobalConcept::getInstance()->Perfil->idestructuracomun;
            if (count($collDoctrineRecord) > 0) {
                foreach ($collDoctrineRecord as $k => $v) {
                    foreach ($v as $p => $dr) {
                        if(!empty($dr->foto)){
                            $collection[0][$k][$p]->foto = $dr->foto;
                            $collection[0][$k][$p]->principal = $dr->principal;
                            $collection[0][$k][$p]->fdesde = $dr->fdesde;
                            $collection[0][$k][$p]->fhasta = $dr->fhasta;
                            $collection[0][$k][$p]->descripcion = $dr->descripcion;
                        }
                    }
                }
            }
            $collection->save();

            return $collection->getFirst()->idpersona;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modPersona(array $persona)
    {
        try {
            $objPersona = $this->_objDatPersona->getById($persona['idpersona']);
            if (count($objPersona) > 0) {
                foreach ($persona as $k => $v) {
                    $objPersona[0]->$k = $v;
                }
                $objPersona->save();
            } else {
                throw new Exception('No existe la personas que quiere modificar', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delPersonas($persona)
    {
        try {
            foreach ($persona as $val) {
                $encargo = $this->_objDatPersona->getByIdPersona($val);
                if (count($encargo) == 0) {
                    $collection = $this->_objDatPersona->getById($val);
                    if (count($collection) > 0) {
                        foreach ($collection as $k => $v) {
                            $collection[$k]->feliminado = date("d/m/Y");
                        }
                        $collection->save();
                    } else {
                        throw new Exception('No existe la personas que quiere eliminar', 3);
                    }
                }  else {
                    throw new Exception('La persona que desea eliminar está ocupando cargo.', 4);
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /*public function getDatosToJabber($idpersona)
    {
        try {

            $this->_response = $this->_objDatPersona->getPersonasActivas($idpersona);

            $objStaticLinks = new EnlacesStaticosService();
            $objDatContacto = new DatContactoModel();
            $correo = $objDatContacto->getContactoByMedio(
                $idpersona, $objStaticLinks->getCorreoElectronico()
            );

            $this->_response[0]['correoelectronico'] = $correo->quantity > 0 ? $correo->data[0]['contacto'] : '';

            return $this->_response[0];
        } catch (Exception $e) {
            throw $e;
        }
    }*/
    
    /*Funcion que devuelve los datos necesarios para mostrar en el portal y para el perfil de seguridad
     * La foto no se incluye

     * Autor: Ing. Yadir Martinez Vergara
     * 24 de Enero de 2018 
     *      */
    public function getDatosToJabber($idpersona)
    {
        try {
            
            // $this->_response = $this->getPrincipalesDatosPersonaById($idpersona);
            /*Cambio de la funcionalidad para obtener datos de las personas*/
            //$this->_response = $this->_objDatPersona->getPersonasActivas($idpersona);
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $objStaticLinks = new EnlacesStaticosService();
            $sexos = $objStaticLinks->getImgSexo();
            /*(CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                    WHEN dp.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto*/
            $query = "SELECT dp.*,(CASE WHEN dp.sexo = 0 THEN 'Femenino' ELSE 'Masculino' END) AS denomsexo, "
                    . "dc.contacto as correoelectronico"
                    . " FROM mod_persona.dat_persona dp"
                    . " LEFT JOIN mod_persona.dat_foto dpfot ON (dpfot.idpersona = dp.idpersona AND dpfot.principal = 1)"
                    . " LEFT JOIN mod_persona.dat_contacto dc ON (dc.idpersona = dp.idpersona AND dc.idtipomediocontacto = {$objStaticLinks->getCorreoElectronico()})"
                    . " WHERE dp.feliminado IS NULL AND dp.idpersona = ?";
            $this->_response = $conn->fetchAll($query, array($idpersona));
            if(empty($this->_response)){
                return array();
            }else{
                return $this->_response[0];
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /*Funcion que devuelve la foto de la persona
     *

     * Autor: Ing. Yadir Martinez Vergara
     * 24 de Enero de 2018 
     *      */
    public function getFotoToPersona($idpersona)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $objStaticLinks = new EnlacesStaticosService();
            $sexos = $objStaticLinks->getImgSexo();
            /*(CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                    WHEN dp.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto*/
            $query = "SELECT dp.idpersona,(CASE WHEN dpfot.foto IS NOT NULL THEN encode(dpfot.foto,'escape')
                    WHEN dp.sexo = 1 THEN '{$sexos->male}' ElSE '{$sexos->famale}' END) as foto"
                    . " FROM mod_persona.dat_persona dp"
                    . " LEFT JOIN mod_persona.dat_foto dpfot ON (dpfot.idpersona = dp.idpersona AND dpfot.principal = 1)"
                    . " WHERE dp.feliminado IS NULL AND dp.idpersona = ?";
            $this->_response = $conn->fetchAll($query, array($idpersona));
            if(empty($this->_response)){
                return array();
            }else{
                return $this->_response[0];
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    

    public function agregarDqlDatosPersona(
        $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
    )
    {
        try {
            return $this->_objDatPersona->agregarDqlDatosPersona(
                $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect, $includeTablas, $relation
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function DevolverPersonasArregloId(array $arridPersonas)
    {
        try {
            return $this->_objDatPersona->DevolverPersonasArregloId($arridPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $idpersona
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @param null $identidad
     * @param null $idcargo
     * @param null $idestructura
     *
     * @return mixed
     * @throws Exception
     */
    public function getPrincipalesDatosPersonaById(
        $idpersona, $filtro = null, $limit = null, $start = 0, $identidad = null, $idcargo = null, $idestructura = null, $boolfoto, $boolcargo, $boolcategoria, $boolregimen
    )
    {
        try {

            $cargos = self::reflectArray($idcargo);
            if (!empty($idestructura)) {
                $array = Utiles::getArryOfCargos($idestructura, true);

                if (count($array) < 1) {
                    $array[] = -1;
                }
                $cargos = array_merge($cargos, $array);
            }

            $this->_response->data = $this->_objDatPersona->getPrincipalesDatosPersona(
                self::reflectArray($idpersona), $filtro, $limit, $start, self::reflectArray($identidad), $cargos, $boolfoto, $boolcargo, $boolcategoria, $boolregimen
            );

            $this->_response->quantity = ($limit > 0) ? $this->_objDatPersona->getCantPrincipalesDatosPersona(
                self::reflectArray($idpersona), $filtro, self::reflectArray($identidad), $cargos
            ) : count($this->_response->data);
            return $this->_response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Para orestes
     */
    public function getPrincipalesDatosPersonaByIdCuadro($idpersona, $filtro = null, $limit = null, $start = 0,
                                                         $identidad = null, $idcargo = null, $idestructura = null)
    {
        try {

            $direccion = new DatDireccionModel();
            $estanciaexterior = new DatEstanciaexteriorModel();
            $response = new StdClass();
            $response->data = $this->_objDatPersona->getPrincipalesDatosPersona(
                $this->reflectArray($idpersona), $filtro, $limit, $start, $this->reflectArray($identidad),
                $this->reflectArray($idcargo), $boolfoto = null, $boolcargo = null, $boolcategoria = null, $boolregimen = null
            );

            $response->quantity = ($limit > 0) ? $this->_objDatPersona->getCantPrincipalesDatosPersona(
                $this->reflectArray($idpersona), $filtro, $this->reflectArray($identidad), $this->reflectArray($idcargo)
            ) : count($response->data);


            foreach ($response->data as $k => $v) {

                if ($v['idcargo']) {
                    $response->data[$k]['especialidad'] = DatPersona::getEspecialidadByCargo(
                        $v['idcargo']
                    )[0]['denespecialidad'];

                    $response->data[$k]['codespecialidad'] = DatPersona::getEspecialidadByCargo(
                        $v['idcargo']
                    )[0]['codespecialidad'];
                }


                if ($v['idestadocivil']) {
                    $response->data[$k]['estadocivil'] = NomEstadocivil::getById($v['idestadocivil'])->denominacion;
                }
                $response->data[$k]['militancia'] = DatAfiliacion::getAfiliacionesByPersonayTipo(
                    $v['idpersona'], 2
                )[0]['denomorganizacion'];

                $data = DatNiveleducacional::getNiveleducacional($v['idpersona']);

                foreach ($data as $c => $array) {

                    $niveleducacional = NomNiveleducacional::getNivelByID($array['idniveleducacional']);
                    $data[$c]['niveleducacional'] =$niveleducacional[0]['denominacion'];
                    $titulo = NomTitulo::getById($array['idtitulo']);
                    $data[$c]['titulo'] = $titulo->denominacion;
                }

                $response->data[$k]['nivelescolar'] = $data[0]['niveleducacional'];
                $response->data[$k]['especialidad'] = $data[0]['titulo'];
                $response->data[$k]['educacion'] = DatEducacion::getEducacionByPersona($this->reflectArray($v['idpersona']), null, null);
                $response->data[$k]['sanciones'] = DatSancion::getSancionesByPersona(
                    $this->reflectArray($v['idpersona']), null, null
                );

                $result = DatSituacionlaboral::getCargosByPerson($v['idpersona']);
                $trayectoria=array();
                foreach ($result as $i => $valor) {
                    if($valor['principal']==1){
                        $estructura = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($valor['identidad'],true);
                        $trayectoria[$i]['organismo'] = $estructura[0]->denominacion;
                        $trayectoria[$i]['denomcargo'] = $valor['denomcargo'];
                        $trayectoria[$i]['fdesde'] = $valor['fdesde'];
                        $trayectoria[$i]['fhasta'] = $valor['fhasta'];
                        $trayectoria[$i]['entidad'] = $valor['entidad'];
                    }

                }

                $obj=new HisTrayectorialaboralModel();
                $response->data[$k]['trayectoria'] = $trayectoria;
                $trayectoriacargos=$obj->getTrayectoriaLaboralByPersona($v['idpersona']);
                $response->data[$k]['trayectoriacargos'] = $trayectoriacargos->data;

                $trayectoriagrado = DatGradomilitar::getGradosMilitaresByPersona($v['idpersona'], null, null);
                foreach ($trayectoriagrado as $per => $b) {
                    $grado = ZendExt_IoC::getInstance()->metadatos->dameGrado($b['idgrado']);

                    $personas[$per]['idpersona'] = $b['idpersona'];
                    $personas[$per]['fhasta'] = $b['fhasta'];
                    $personas[$per]['fdesde'] = $b['fdesde'];
                    $personas[$per]['dequien'] = $b['dequien'];
                    $personas[$per]['numorden'] = $b['numorden'];
                    $personas[$per]['grado'] = $grado[0]['denominacion'];
                }
                $response->data[$k]['trayectoriagrados'] = $personas;

                $misiones = DatEstanciaexterior::getEstanciasExteriorByPersonas($v['idpersona'], null, null);
                $obj = new ConfiguracionGeneralService();
                foreach ($misiones as $key => &$mision) {
                    $pais = $obj->findContryById($mision['idpais']);
                    $mision['pais'] = $pais['nombrepais'];

                }
                $response->data[$k]['misiones'] = $misiones;

                $edu = new DatEducacionModel();
                $cursos = $edu->getEducacionByPersona($v['idpersona'], null, null);

                $response->data[$k]['cursos'] = $cursos;

                $response->data[$k]['ciudanaias'] = DatCiudadania::getCiudadaniasByPersona(
                    $this->reflectArray($v['idpersona']), null, null
                );
                $response->data[$k]['fenotipo'] = DatFenotipo::getDatosFenotipicosByPersona(
                    $this->reflectArray($v['idpersona']), null, null
                );

                $response->data[$k]['direcciones'] = DatDireccion::getDireccionOficialByPersona(
                    $this->reflectArray($v['idpersona'])
                );
                foreach ($response->data[$k]['direcciones'] as $d => $dir) {
                    if ($dir['oficial'] == 1) {
                        $pais = ZendExt_IoC::getInstance()->datosmaestros->obtenerPais($dir['idpais']);
                        $prov = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($dir['idprovincia']);
                        $muni = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($dir['idmunicipio']);
                        $response->data[$k]['direccion'] = $dir['direccion'] . ', ' .
                            $muni[0]['denominacion'] . ', ' .
                            $prov[0]['denominacion'] . ', ' .
                            $pais['nombrepais'];
                    }

                }
                $response->data[$k]['conctatos'] = DatContacto::getContactos(
                    $this->reflectArray($v['idpersona'])
                );

                $categdocente = DatCategorizacion::getCategoriasByPersonayTipo(
                    $v['idpersona'], 2
                );
                $gradocientifico = DatCategorizacion::getCategoriasByPersonayTipo(
                    $v['idpersona'], 1
                );

                $arreglocategdoc=[];
                foreach($categdocente as $ky=>$ca){

                    $arreglocategdoc[$ky]['denominacion']=$ca['denominacion'];
                    $arreglocategdoc[$ky]['fhasta']=$ca['fhasta'];
                    $arreglocategdoc[$ky]['denomtipocategoria']=$ca['denomtipocategoria'];

                }
                $response->data[$k]['categoriadocente'] = $arreglocategdoc;


                $arreglogradoc=[];

                foreach($gradocientifico as $ky=>$g){
                    $arreglogradoc[$ky]['denominacion']=$g['denominacion'];
                    $arreglogradoc[$ky]['fhasta']=$g['fhasta'];
                    $arreglogradoc[$ky]['denomtipocategoria']=$g['denomtipocategoria'];

                }
                /* echo'<pre>';
                 print_r($arreglogradoc);die;*/
                $response->data[$k]['gradocientifico'] = $arreglogradoc;

                $categoriainvestigador = DatCategorizacion::getCategoriasByPersonayTipo(
                    $v['idpersona'], 3
                );
                $arreglocateginv=[];
                foreach($categoriainvestigador as $ky=>$c){
                    $arreglocateginv[$ky]['denominacion']=$c['denominacion'];
                    $arreglocateginv[$ky]['fhasta']=$c['fhasta'];
                    $arreglocateginv[$ky]['denomtipocategoria']=$c['denomtipocategoria'];

                }

                $response->data[$k]['categinvestig'] = $arreglocateginv;

                $response->data[$k]['idiomas'] = DatIdioma::getIdiomasByIdperson($v['idpersona']);
                $response->data[$k]['afiliaciones'] = DatAfiliacion::getAfiliacionesByPersona(
                    $this->reflectArray($v['idpersona']), null, null, null
                );

                $response->data[$k]['cargosorganizacion'] = DatCargoorganizacion::getCargosByOrganizacion(
                    $this->reflectArray($v['idpersona']), null, null, null
                );
                $response->data[$k]['afecciones'] = DatAfeccion::getAfeccionesByPersona(
                    $this->reflectArray($v['idpersona']), null, null, null
                );
                $response->data[$k]['estadosalud'] = DatEstadosalud::getEstadoSaludByPersona(
                    $this->reflectArray($v['idpersona']), null, null, null
                );

                $response->data[$k]['tallaje'] = DatTallaje::getTallajesByPersona($v['idpersona'], null, null);
                $response->data[$k]['ocupaciontiempoguerra'] = DatOcupaciontiempoguerra::getCargosByPersona(
                    $this->reflectArray($v['idpersona']), null, null, null
                );
                $exterior = $estanciaexterior->getEstanciasExteriorByPersonas(
                    $this->reflectArray($v['idpersona']), null, null, null
                );
                $response->data[$k]['estanciaexterior'] = $exterior->data;

                $response->data[$k]['condecoraciones'] = DatCondecoracion::getCondecoracionesByPersona(
                    $this->reflectArray($v['idpersona']), null, null, null
                );
                $response->data[$k]['familiaresyamigos'] = DatFamiliar::obtenerFamiliarPorPersona(
                    $v['idpersona']
                );

                $response->data[$k]['familiaresexterior'] = DatFamiliarexterior::getFamiliarResidenteByPesona(
                    $v['idpersona'], null, null
                );

                $response->data[$k]['familiarviaje'] = DatFamiliarviaje::getFamiliarViajeByPesona(
                    $v['idpersona'], null, null
                );
                $response->data[$k]['familiarsancionado'] = DatFamiliarsancionado::getFamiliarSancionadoByPesona(
                    $v['idpersona'], null, null
                );
                $response->data[$k]['familiarresidente'] = DatFamiliarresidente::getFamiliarRelacionesByPesona(
                    $v['idpersona'], null, null
                );

                $response->data[$k]['ingreso'] = DatIngreso::obtenerIngresoPorPersona($v['idpersona']);

                /*   $response->data[$k]['idprovincian'] =$v['idprovincian'] ;
                   $response->data[$k]['idmunicipion'] =$v['idmunicipion'] ;
                   $response->data[$k]['idlocalidadn'] = $v['idlocalidadn'];*/


            }
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function restPerson($ids)
    {
        try {
            $this->_objDatPersona->restPerson(Utiles::reflectArray($ids));
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect($baseAlias . '.*');
    }

    protected function iteratorAux($array, $arrayUno)
    {
        try {
            $p = 0;
            foreach ($arrayUno as $k => $v) {
                $array[$p][$k] = $v;
            }

            return $array;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getIdPais($idpaisSuin)
    {
        $sql = "SELECT idpais FROM mod_datosmaestros.nom_pais WHERE siglas = '$idpaisSuin'";
        $query = Doctrine_Manager::getInstance();
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idpais'];
    }

    public function getIdMunicipio($idmunicSuin)
    {
        $respuesta = null;
        if ($idmunicSuin != 0 && $idmunicSuin != '0' && $idmunicSuin != null && strlen($idmunicSuin) == 4) {
            $caracDos = $idmunicSuin[2];
            $caracTres = $idmunicSuin[3];
            $idmunicSuin[2] = '.';
            $idmunicSuin[3] = $caracDos;
            $idmunicSuin[4] = $caracTres;
            $sql = "SELECT iddpt, idpadre FROM mod_datosmaestros.nom_dpt WHERE codigo = '$idmunicSuin'
                AND (fechafin is null OR fechafin > now())";
            $query = Doctrine_Manager::getInstance();
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $respuesta = $result[0]['iddpt'];
        }
        return $respuesta;
    }

    public function getIdProvincia($idmunicSuin)
    {
        $respuesta = null;
        if ($idmunicSuin != 0 && $idmunicSuin != '0' && $idmunicSuin != null && strlen($idmunicSuin) == 4) {
            $caracDos = $idmunicSuin[2];
            $caracTres = $idmunicSuin[3];
            $idmunicSuin[2] = '.';
            $idmunicSuin[3] = $caracDos;
            $idmunicSuin[4] = $caracTres;
            $sql = "SELECT iddpt, idpadre FROM mod_datosmaestros.nom_dpt WHERE codigo = '$idmunicSuin'
                AND (fechafin is null OR fechafin > now())";
            $query = Doctrine_Manager::getInstance();
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $respuesta = $result[0]['idpadre'];
        }
        return $respuesta;
    }

    public function getIdPaisPorCodigo($idmunicSuin)
    {
        $respuesta = null;
        if ($idmunicSuin != 0 && $idmunicSuin != '0' && $idmunicSuin != null && strlen($idmunicSuin) == 4) {
            $caracDos = $idmunicSuin[2];
            $caracTres = $idmunicSuin[3];
            $idmunicSuin[2] = '.';
            $idmunicSuin[3] = $caracDos;
            $idmunicSuin[4] = $caracTres;
            $sql = "SELECT iddpt, idpadre, idpais FROM mod_datosmaestros.nom_dpt WHERE codigo = '$idmunicSuin'
                AND (fechafin is null OR fechafin > now())";

            $query = Doctrine_Manager::getInstance();
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $respuesta = $result[0]['idpais'];
        }
        return $respuesta;
    }
    public function getColorPiel($idpersona)
    {       
        $objDomain = new DatPersona();        
        foreach ($idpersona as $k => $v) {
            $result = $objDomain->getColor($v);
           
        }        
        return $result;
    }

    public function getIntegracionPolitica($idpersona)
    {
        
        $objDomain = new DatPersona();        
        foreach ($idpersona as $k => $v) {
            $result = $objDomain->getIntegracionPolitica($v);            
        }
       
        return $result;
    }

    public function getContenidoFicha($idpersona){
        try {
            $identidad = $datentidad = $_SESSION['Zeolides']['entidad']->idestructura;

            $sql = "SELECT c.idplantilla 
            FROM mod_rrhhmaestro.conf_plantillafuncionalidad c
            INNER JOIN mod_rrhhmaestro.dat_plantilladoc AS p
              ON (p.idplantilladoc = c.idplantilla AND p.identidad = $identidad)
            WHERE c.idconfiguracion = 101";
            $query = Doctrine_Manager::getInstance();
            $idplantilla = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            if(!empty($idplantilla[0]['idplantilla'])){
                $plantilla = ZendExt_IoC_Inter::getInstance()->maestro->getContenidoByIdPlantilla($idplantilla[0]['idplantilla'], $idpersona);
                $contenidoreemplazado = $plantilla->contenido['contenido'];
                if ($contenidoreemplazado != null) {
                    foreach ($plantilla->configuraciones as $k => $conf) {
                        $campostemp = ZendExt_IoC::getInstance()->reccomplejas->getCamposConfiguracion(
                            $conf['idconfiguracion']
                        );
                        //reemplazar contenido
                        if (count($campostemp) > 0) {
                            $contenidoreemplazado = $this->reemplazarContenido(
                                $contenidoreemplazado,
                                $campostemp,
                                $idpersona,
                                $conf['idconfiguracion']
                            );
                        }
                    }
                    return $contenidoreemplazado;
                } else {
                    return '';
                }
            } else return '';
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getContenidoFichaCuadro($idpersona){
        try {
            $plantilla = ZendExt_IoC_Inter::getInstance()->maestro->getContenidoByIdPlantilla(1, $idpersona);
            $contenidoreemplazado = $plantilla->contenido['contenido'];
            if ($contenidoreemplazado != null) {
                foreach ($plantilla->configuraciones as $k => $conf) {
                    $campostemp = ZendExt_IoC::getInstance()->reccomplejas->getCamposConfiguracion(
                        $conf['idconfiguracion']
                    );
                    //reemplazar contenido
                    if (count($campostemp) > 0) {
                        $contenidoreemplazado = $this->reemplazarContenido(
                            $contenidoreemplazado,
                            $campostemp,
                            $idpersona,
                            $conf['idconfiguracion']
                        );
                    }
                }
                return $contenidoreemplazado;
            } else {
                return '';
            }
        } catch (Exception $e) {
            throw $e;
        }
    }


    private function reemplazarContenido($contenido, $campos, $idpersona, $idconfiguracion)
    {
        $contenidoremplazado = $contenido;
        $idcampoidpersona = '1637';
        $arrayidcampos = Array();
        $pos = 0;
        foreach ($campos as $c) {
            $arraycontaux = explode('class="' . $c['idcampo'] . '"', $contenido);
            if (count($arraycontaux) > 1) {
                $arrayidcampos[$pos]['idcampo'] = $c['idcampo'];
                $arrayidcampos[$pos]['alias'] = $c['alias'];
                $arrayidcampos[$pos]['denomcampo'] = $c['denominacion'];
                $picllaveabierta = explode('{', $arraycontaux[1]);
                $picllavecerrada = explode('}', $picllaveabierta[1]);
                $arrayidcampos[$pos]['denominacioncont'] = $picllavecerrada[0];
                $pos++;
            }
            if ($c['campo'] == 'idpersona') {
                $idcampoidpersona = $c['idcampo'];
            }
        }
        foreach ($campos as &$ca) {
            if ($ca['leaf']) {
                foreach ($arrayidcampos as $campoTempalte) {
                    if ($ca['idcampo'] == $campoTempalte['idcampo']) {
                        $selectores[] = (object)$ca;
                        break;
                    }
                }
            }
        }
        $cond = new stdClass();
        $cond->idcampo = $idcampoidpersona;
        $cond->condicion = 'IN';
        $cond->valor = $idpersona;
        $cond->logico = '';
        $cond->tipo = '';
        $condiciones = array($cond);
        $valorescampos = ZendExt_IoC::getInstance()->reccomplejas->buscar(
            $idconfiguracion,
            $selectores,
            $condiciones,
            array(),
            array(),
            null,
            0,
            array()
        );
        foreach ($arrayidcampos as $k) {
            if (
                $k['alias'] == 'sexo' &&
                ($valorescampos->datos[0][$k['alias']] == 1 || $valorescampos->datos[0][$k['alias']] == 0)
            ) {
                $valor = ($valorescampos->datos[0][$k['alias']] == 'Masculino' || $valorescampos->datos[0][$k['alias']] == 1) ? 'Masculino' : 'Femenino';
            } else if ($k['alias'] == 'foto') {
                if ($valorescampos->datos[0][$k['alias']]) {
                    $valor = '<img src="data:image/jpg;base64,' . $valorescampos->datos[0][$k['alias']] . '" height=40 width=40 style="border:1px solid 000" />';
                } else {
                    $valor = '<img src="data:image/jpg;base64, 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" height=40 width=40 style="border:1px solid 000" />';
                }
            } else {
                $valor = $valorescampos->datos[0][$k['alias']];
            }
            $estapordenomcampo = explode('{' . $k['denomcampo'] . '}', $contenidoremplazado);
            if (count($estapordenomcampo) > 1) {
                $contenidoremplazado = str_replace('{' . $k['denomcampo'] . '}', $valor, $contenidoremplazado);
            } else {
                $contenidoremplazado = str_replace('{' . $k['denominacioncont'] . '}', $valor, $contenidoremplazado);
            }
        }
        //para el mariel
        $nummat = DatDocidentidad::getMatriculaByPersona($idpersona);
        $contenidoremplazado = str_replace('{no.matr1}', $nummat, $contenidoremplazado);
        //--
        return $contenidoremplazado;
    }
	
	/* Adicionar estructura evaluativa en evaluaciones */
    public function getPrincipalesDatosByIdEvaluaciones(
        $idpersona, $filtro = null, $limit = null, $start = 0, $identidad = null, $cargo = null, $idestructura = null
    )
    {

        try {
            $cargos = self::reflectArray($cargo);
            if (!empty($idestructura)) {
                $array = Utiles::getArryOfCargos($idestructura, true);

                if (count($array) < 1) {
                    $array[] = -1;
                }
                $cargo = array_merge($cargo, $array);
            }

            if(count($cargo)>0){
                $strId = '-1';
                foreach ($cargo as $cargo) {
                    if ($cargo) {
                        $strId .= ',' . $cargo;
                    }
                }

                $sql = "SELECT p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname,s.idcargo
				FROM mod_persona.dat_persona as p
				INNER JOIN mod_persona.dat_personaentidad pe ON (p.idpersona = pe.idpersona)
				LEFT JOIN mod_persona.dat_situacionlaboral s ON (pe.idpersonaentidad = s.idpersonaentidad)
                WHERE s.idcargo IN ($strId) and (p.feliminado is null or p.feliminado < now()) and s.principal = 1 ";

                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

            }
            else{
                $strIdpersona = '-1';
                foreach ($idpersona as $persona) {
                    $strIdpersona .= ',' . $persona;

                }
                $sql = "SELECT p.idpersona, p.nombre, p.snombre, p.papel, p.sapel,
				(p.nombre ||' '|| p.papel ||' '|| p.sapel) as fullname
				FROM mod_persona.dat_persona as p
                WHERE p.idpersona IN ($strIdpersona)";
                $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
            }


            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosPersonaService($params)
    {
        try {
            $where = '';
            $arrParams = array();
            if (array_key_exists('idpersona', $params)) {
                if (!empty($params['idpersona'])) {
                    $where = " AND dp.idpersona = ?";
                    $arrParams[] = $params['idpersona'];
                }
            } else if (array_key_exists('numid', $params)) {
                $where = " AND dpi.numero = ?";
                $arrParams[] = $params['numid'];
            } else if (array_key_exists('correoelectronico', $params)) {
                $where = " AND dcon.idtipomediocontacto = 2  AND dcon.contacto = ?";
                $arrParams[] = $params['correoelectronico'];
            }
            if ($where != '') {
                $persona = new DatPersona();
                $response = $persona->getDatosPersonaService($where, $arrParams);
            }
            foreach ($response->respuesta as $key => $value) {
                $objDirecciones = new DatDireccion();
                $response->respuesta[$key]['direcciones'] = $objDirecciones->getDireccionesByPesona(array($value['idpersona']));
                $objContacto = new DatContacto();
                $response->respuesta[$key]['contactos'] = $objContacto->getContactos(array($value['idpersona']));
            }
            $response->codigo = 'OK';
        } catch (Exception $e) {
            $response->respuesta = null;
            $response->codigo = 'ERROR';
            $response->error = $e;
        }
        return $response;
    }

    public function getDatosFichaBasicaPersona($numid, $idsuin)
    {
        if(!empty($numid))
        {
            $result = $this->_objDatPersona->getDatosFichaBasicaPersona("dpi.numero = '".$numid."'");
        }
        else
        {
            if(!empty($idsuin))
            {
                $result = $this->_objDatPersona->getDatosFichaBasicaPersona("dp.idsuin = ".$numid."");
            }
            else
            {
                $result = array();
            }
        }
        return $result;
    }

    public function getDatosBasicosPersonas($numid, $nombre, $snombre, $papel, $sapel, $idestructura, $idusuario, $iddominio, $limit, $start)
    {
        $idcargos = Array();
		$compartimentacion = 1;
		
        if (isset($idusuario)) {
            $comp = DatPersona::getCompartimentacionByIdusuario($idusuario);
			if(!empty($comp)){
				$compartimentacion = $comp[0]['idcompartimentacion'];
			}else{
				$compartimentacion = 2;
			}
			
            if ($compartimentacion == 2) {
                $varser = ZendExt_IoC::getInstance();
                $cargos = $varser->metadatos->obtenerCargosEstructura($idestructura, $iddominio);
                if (count($cargos) > 0) {
                    foreach ($cargos as $h => $carg) {
                        array_push($idcargos, $carg['idcargo']);
                    }
                }
            }
        }
        $result = DatPersona::getDatosBasicosPersona($numid, $nombre, $snombre, $papel, $sapel, $idcargos, $compartimentacion, $limit, $start);
        return $result;
    }

    public function getDatosFichaPersona($idpersona)
    {
        $result = DatPersona::getDatosFichaPersona($idpersona);
        foreach ($result as $p=>$per) {
            $estruc = array($per['identidad'], $per['idarea'], $per['idcargo']);
            if (!empty($per['ueb'])) {
                array_push($estruc, $per['ueb']);
            }
			if(!empty($per['identidad'])){
				$estinfo = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($estruc);
				$result[$p]['entidad'] = $estinfo[0][0]->denominacion;
				$result[$p]['area'] = $estinfo[1][0]->denominacion;
				$result[$p]['cargo'] = $estinfo[2][0]->denominacion;
				$result[$p]['ueb'] = (!empty($per['ueb']))?$estinfo[3][0]->denominacion:'';
			}else{
				$result[$p]['entidad'] = '';
				$result[$p]['area'] = '';
				$result[$p]['cargo'] = '';
				$result[$p]['ueb'] = '';
			}
            $result[$p]['direcciones'] = DatDireccionModel::getDireccionesByPesona(array($per['idpersona']))->data;
            $result[$p]['sanciones'] = DatSancion::getSancionesByPersona(array($per['idpersona']));
            $result[$p]['condecoraciones'] = DatCondecoracion::getCondecoracionesByPersona(array($per['idpersona']));
            $result[$p]['afiliaciones'] = DatAfiliacion::getAfiliacionesByPersona(array($per['idpersona']));
            $result[$p]['trayectoria'] = HisTrayectorialaboral::getTrayectoriaLaboralByPersona($idpersona);
            $niveled = DatNiveleducacional::getNivelEduByPersona($idpersona);
            $result[$p]['niveleducacional'] = $niveled[0]['niveleducacional'];
            $result[$p]['titulo'] = $niveled[0]['titulo'];
        }
        return $result;
    }

    public function getDatosPersonaByArrayId($arraypersonas, $nacionalidades, $contactos, $organizaciones)
    {
       $datPersona = new DatPersona();
       $datosPersonas = $datPersona->getDatosPersonaById($arraypersonas);
       foreach ($datosPersonas as $i => $persona){
           if($nacionalidades){
               $datNacionalidadModel = new DatNacionalidadModel();
               $nacionalidad = $datNacionalidadModel->getNationalityByIdperson($persona['idpersona']);
               if(!empty($nacionalidad->data))
                   $datosPersonas[$i]['nacionalidades'] = $nacionalidad->data;
           }
           if($organizaciones){
               $afiliaciones = $datPersona->getIntegracionPolitica($persona['idpersona']);
               if(!empty($afiliaciones))
                   $datosPersonas[$i]['organizaciones'] = $afiliaciones;
           }
           if($contactos){
               $DatContactoModel = new DatContactoModel();
               $contactos = $DatContactoModel->getContactos($persona['idpersona']);
               if(!empty($contactos->data))
                   $datosPersonas[$i]['contactos']= $contactos->data;
           }

       }
        return $datosPersonas;
    }
}

