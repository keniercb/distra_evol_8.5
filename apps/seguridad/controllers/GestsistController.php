<?php

/**
 * @name GestusuarioController - Componente de autenticación..
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestsistController extends SeguridadController
{

    private function devolverXML($idsistema)
    {
        $sistemas = DatSistema::obtenersistemaexportarxml($idsistema);
        if (count($sistemas)) {
            $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><menu>";
            foreach ($sistemas as $mdf) {
                $this->subsistemasxml($mdf, $menu);
            }
            $menu .= "</menu>";

            return $menu;
        } else {
            $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><menu></menu>";

            return $menu;
        }
    }

    private function subsistemasxml($raiz, &$menu)
    {
        $type = 'sistema';
        $referenciaSubsistema = $this->integrator->seguridad
            ->getUriSubsystemById($raiz['idsistema']);
        $menu .= "<MenuItem name=\"{$raiz['denominacion']}\" "
            . "id=\"{$raiz['idsistema']}\" "
            . "externa=\"{$raiz['externa']}\" "
            . "referencia=\"{$referenciaSubsistema}\" "
            . "icon=\"{$raiz['icono']}\"  "
            . "status=\"{$raiz['descripcion']}\" "
            . "type=\"{$type}\">";
        $this->funcionalidadesxml($raiz['idsistema'], $menu);
        $sistemashijos = DatSistema::obtenersistemashijos($raiz['idsistema']);
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $this->subsistemasxml($hijo, $menu);
                }
            }
        }
        $menu .= "</MenuItem>";
    }

    private function funcionalidadesxml($idsistema, &$menu)
    {
        $type = 'funcionalidad';
        $funcsistema = DatFuncionalidad::obtenerFuncionalidad($idsistema);
        if (count($funcsistema)) {
            foreach ($funcsistema as $funcionalidades) {
                $menu .= "<MenuItem name=\"{$funcionalidades->text}\" "
                    . "id=\"{$funcionalidades->idfuncionalidad}\"  "
                    . "src=\"{$funcionalidades->referencia}\" "
                    . "icon=\"{$funcionalidades->icono}\"  "
                    . "visible=\"{$funcionalidades->visible}\" "
                    . "status=\"{$funcionalidades->descripcion}\" "
                    . "index=\"{$funcionalidades->index}\" "
                    . "type=\"{$type}\">";
                $this->accionesxml($funcionalidades->idfuncionalidad, $menu);
                $menu .= "</MenuItem>";
            }
        }
    }

    private function accionesxml($idfuncionalidad, &$menu)
    {
        $type = 'accion';
        $acciones = DatAccion::obtenerAcciones($idfuncionalidad);
        if (count($acciones)) {
            foreach ($acciones as $accion) {
                $menu .= "<MenuItem name=\"{$accion->denominacion}\" "
                    . "id=\"{$accion->idaccion}\" type=\"{$type}\">";
                $this->recursosXml($accion->idaccion, $idfuncionalidad, $menu);
                $menu .= "</MenuItem>";
            }
        }
    }

    private function recursosXml($idaccion, $idfuncionalidad, &$menu)
    {
        $type = 'recurso';
        $arrayRecursos = DatRecurso::ObtenerRecursosXml(
            $idaccion, $idfuncionalidad
        );
        if (count($arrayRecursos)) {
            foreach ($arrayRecursos as $recursos) {
                $menu .= "<MenuItem name=\"{$recursos['denominacion']}\" "
                    . "id=\"{$recursos['idrecurso']}\" "
                    . "status=\"{$recursos['descripcion']}\" "
                    . "index=\"{$recursos['abreviatura']}\" "
                    . "type=\"{$type}\" />";
            }
        }
    }

    private function arrayainsertar($xmlcargado, $idpadre, $id)
    {
        foreach ($xmlcargado as $xml) {
            if ((string)$xml['type'] == 'sistema') {
                $sistema = new DatSistema();
                $sistema->denominacion = (string)$xml['name'];
                $sistema->descripcion = (string)$xml['status'];
                $sistema->icono = (string)$xml['icon'];
                $sistema->externa = (string)$xml['externa'];
                $sistema->iddominio = $this->global->Perfil->iddominio;
                if ($idpadre) {
                    $sistema->idpadre = $idpadre;
                }
                $sistema->save();

                if (!$sistema->externa) {
                    if ((string)$xml['referencia'] != "") {

                        $nombrearray = explode('/', (string)$xml['referencia']);
                        $nombre = $nombrearray[count($nombrearray) - 1];

                        $existeRefsubsit = $this->integrator->seguridad->existsubsistama($nombre);

                        if (!$existeRefsubsit) {
                            $bool = $this->integrator->seguridad->publicarSubsistemasXml(
                                $sistema->idsistema,
                                $nombre,
                                (string)$xml['referencia'],
                                $sistema->denominacion
                            );
                        }
                    }
                }

                $sistemaCompartimentacion = new DatSistemaCompartimentacion();
                $sistemaCompartimentacion->idsistema = $sistema->idsistema;
                $sistemaCompartimentacion->iddominio = $this->global->Perfil->iddominio;
                $sistemaCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem, $sistema->idsistema, ''
                    );
                }
            } elseif ((string)$xml['type'] == 'accion') {
                $accion = new DatAccion();
                $accion->denominacion = (string)$xml['name'];
                $accion->idfuncionalidad = $idpadre;
                $accion->iddominio = $this->global->Perfil->iddominio;
                $accion->save();
                $accionCompartimentacion = new DatAccionCompartimentacion();
                $accionCompartimentacion->idaccion = $accion->idaccion;
                $accionCompartimentacion->iddominio = $this->global->Perfil->iddominio;
                $accionCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem,
                        $accion->idaccion,
                        $accion->idfuncionalidad
                    );
                }
            } elseif ((string)$xml['type'] == 'recurso') {
                $recurso = DatRecurso::findIdRecurso((string)$xml['name'], $id);
                if (count($recurso)) {
                    $idrecurso = $recurso[0]['idrecurso'];
                } else {
                    $objRecurso = new DatRecurso();
                    $objRecurso->denominacion = (string)$xml['name'];
                    $objRecurso->descripcion = (string)$xml['status'];
                    $objRecurso->abreviatura = (string)$xml['index'];
                    $objRecurso->idfuncionalidad = $id;
                    $objRecurso->iddominio = $this->global->Perfil->iddominio;
                    $objRecurso->save();
                    $idrecurso = $objRecurso->idrecurso;
                    $obRecursoComp = new DatRecursoCompartimentacion();
                    $obRecursoComp->idrecurso = $idrecurso;
                    $obRecursoComp->iddominio = $this->global->Perfil->iddominio;
                    $obRecursoComp->save();
                }
                $objFunAccRec = new DatFuncionalidadDatAccion();
                $objFunAccRec->idrecurso = $idrecurso;
                $objFunAccRec->idfuncionalidadasociada = $id;
                $objFunAccRec->idaccion = $idpadre;
                $objFunAccRec->save();
            } else {
                $funcionalidad = new DatFuncionalidad();
                $funcionalidad->denominacion = (string)$xml['name'];
                $funcionalidad->descripcion = (string)$xml['status'];
                $funcionalidad->icono = (string)$xml['icon'];
                $funcionalidad->referencia = (string)$xml['src'];
                $funcionalidad->index = (string)$xml['index'];
//                $funcionalidad->visible = (boolean)$xml['visible'];
                $funcionalidad->visible = (string)$xml['visible'] != "" ? true : false;
                $funcionalidad->idsistema = $idpadre;
                $funcionalidad->iddominio = $this->global->Perfil->iddominio;
                $funcionalidad->save();
                $funcionalidadCompartimentacion = new DatFuncionalidadCompartimentacion();
                $funcionalidadCompartimentacion->idfuncionalidad = $funcionalidad->idfuncionalidad;
                $funcionalidadCompartimentacion->iddominio = $this->global->Perfil->iddominio;
                $funcionalidadCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem, $funcionalidad->idfuncionalidad, ''
                    );
                }
            }
        }
    }

    private function modificarRecursosNietos($idsistema, $externo){
        $funcionalidadeshijas = DatFuncionalidad::cargarfuncionalidades(
            $idsistema, 0, 0
        );
        if(count($funcionalidadeshijas)){
            foreach($funcionalidadeshijas as $funcionalidad){
                $recursos = DatRecurso::buscarRecursosI($funcionalidad->id,'');
                if(count($recursos)){
                    foreach($recursos as $recurso){
                        DatRecursoFuncionalidad::actualizarValorExternoRecurso($recurso['idrecurso'], $externo);
                    }
                }

            }
        }
    }


    private function modificarhijos($idsistema, $externa)
    {

        self::modificarRecursosNietos($idsistema,true);

        $canthijos = DatSistema::obtenersistemashijos($idsistema);
        if (count($canthijos)) {
            foreach ($canthijos as $hijos) {
                $refSubsisthijoInterno = $this->integrator->seguridad
                    ->getUriSubsystemById($hijos->idsistema);
                if ($refSubsisthijoInterno) {
                    $this->integrator->seguridad->eliminarSubsistemasXml(
                        $hijos->idsistema
                    );
                }
                $hijos->externa = $externa;
                $idsistema = $hijos->idsistema;
                $hijos->save();
                self::modificarhijos($idsistema, $externa);
            }
        }
    }

    private function getMethodsInformation($methods, $idnodo, $name)
    {
        $arrayResult = array();
        $key = 0;
        $class = strtolower(substr($name, 0, strlen($name) - 14));
        $referencia = explode('/apps/', $idnodo);
        $referencia = substr($referencia[1], 0, strrpos($referencia[1], '/'));
        $referencia = str_replace('controllers', 'index.php', $referencia);
        $referencia = $referencia . '/' . $class;
        foreach ($methods as $function) {
            $cadena = substr($function, strlen($function) - 6, strlen($function));
            if ($cadena == 'Action') {
                $arrayResult[$key]['leaf'] = true;
                $arrayResult[$key]['text'] = $function;
                $arrayResult[$key]['id'] = $function;
                $arrayResult[$key]['type'] = 'action';
                $arrayResult[$key]['referencia'] = $referencia . '/'
                    . substr($function, 0, strlen($function) - 6);
                $key++;
            }
        }

        return $arrayResult;
    }

    private function getMethodsInformationAccionesIII($methods, $idFunc)
    {

        $arrayAcciones = array();
        $arrayFuncionalidades = DatAccion::cargarAccionByIdFuncII(
            $idFunc
        );
        $arrayAcciones = SegUtil::convertToUnidimensional(
            $arrayFuncionalidades, 'denominacion'
        );
        $arrayAcc = SegUtil::convertToUnidimensional(
            $arrayFuncionalidades, 'descripcion'
        );
        $arrayIdAcc = SegUtil::convertToUnidimensional(
            $arrayFuncionalidades, 'idaccion'
        );
        $arrayResult = array();
        $key = 0;
        $id = count($arrayFuncionalidades) + 1;
        $arrayCargar = array(
            'cargaretiquetasAction',
            'closeportalAction',
            'cargaraccionesAction',
            'cargarAccionesXUriAction',
            'cargaraccionesbyidAction',
            'cargarayudaAction'
        );

        foreach ($methods as $function) {
            $cadena = substr($function, strlen($function) - 6, strlen($function));
            if ($cadena == 'Action'
                && !array_intersect(array($function), $arrayCargar)
            ) {

                $clave = array_search($function, $arrayAcciones);
                $arrayResult[$key]['denominacion'] = substr($function, 0, strlen($function) - 6);
                $arrayResult[$key]['idfuncionalidad'] = $idFunc;


                if (array_intersect(array($function), $arrayAcciones)) {
                    if ($arrayAcc[$clave] != null) {
                        $arrayResult[$key]['descripcion'] = "$arrayAcc[$clave]";
                    } else {
                        $arrayResult[$key]['descripcion'] = "";
                    }

                    $arrayResult[$key]['checked'] = true;
                    $arrayResult[$key]['idaccion'] = $arrayIdAcc[$clave];
                    $arrayResult[$key]['id'] = $arrayIdAcc[$clave];
                } else {
                    $arrayResult[$key]['descripcion'] = "";
                    $arrayResult[$key]['checked'] = false;
                    $arrayResult[$key]['idaccion'] = 0;
                    $arrayResult[$key]['id'] = $id;
                    $id++;
                }

                $key++;
            }
        }

        return $arrayResult;
    }


    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestusuarioAction() - Función encargada de darle render
     *                        a la vista correspondiente e incluye ademas otras
     *                        vistas para la integración a nivel de interfaz
     *
     * @return void
     */
    public function gestsistAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }


    /**
     * @method cargarsistfuncRecAction - Función usada para cargar el árbol
     * de sistemas hasta nivel de recurso.
     *
     * @return json
     * lily
     */
    public function cargarsistfuncRecAction()
    {
        $idnodo = $this->_request->getParam('node');
        $idsistema = $this->_request->getParam('idsistema');
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        //$externa = $this->_request->getParam('externa');
        $limit = $this->_request->getParam('limit');
        $start = $this->_request->getParam('start');
        $contador = 0;
        $sistFunArr = array();
        if ($idfuncionalidad != null) {
            $recursos = DatRecurso::buscarRecursos(
                $idfuncionalidad, '', $limit, $start
            );
            $recursosHeredados = DatRecursoFuncionalidad::obtenerRecursosHeredadosByIdFuncionalidad($idfuncionalidad, $limit, $start);

            if (count($recursos) > 0) {
                foreach ($recursos as $valores => $valor) {
                    $sistFunArr[$contador]['id'] = $valor['idrecurso'] . '_' . $idnodo;
                    $sistFunArr[$contador]['idrecurso'] = $valor['idrecurso'];
                    $sistFunArr[$contador]['text'] = $valor['denominacion'];
                    $sistFunArr[$contador]['abreviatura'] = $valor['abreviatura'];
                    $sistFunArr[$contador]['descripcion'] = $valor['descripcion'];
                    $sistFunArr[$contador]['icono'] = $valor['icono'];
                    $sistFunArr[$contador]['idfuncionalidad'] = $valor['idfuncionalidad'];
                    $sistFunArr[$contador]['leaf'] = true;
                    $sistFunArr[$contador]['type'] = 'recurso';
                    $sistFunArr[$contador]['iconCls'] = 'generadorreportes';
                    $sistFunArr[$contador]['heredado'] = false;
                    $contador++;
                }
            }
//            var_dump($recursosHeredados);die;
            if(count($recursosHeredados) > 0){
                foreach ($recursosHeredados as  $recursofuncionalidad) {
                    $recurs = DatRecurso::obtenerRecursoById($recursofuncionalidad['idrecurso']);
//                    var_dump($recurs); die();
                    $sistFunArr[$contador]['id'] = $recurs[0]['idrecurso'] . '_' . $idnodo;
                    $sistFunArr[$contador]['idrecurso'] = $recurs[0]['idrecurso'];
                    $sistFunArr[$contador]['text'] = $recurs[0]['denominacion'];
                    $sistFunArr[$contador]['abreviatura'] = $recurs[0]['abreviatura'];
                    $sistFunArr[$contador]['descripcion'] = $recurs[0]['descripcion'];
                    $sistFunArr[$contador]['icono'] = $recurs[0]['icono'];
                    $sistFunArr[$contador]['idfuncionalidad'] = $recurs[0]['idfuncionalidad'];
                    $sistFunArr[$contador]['externo'] = $recursofuncionalidad['externo'];
                    $sistFunArr[$contador]['leaf'] = true;
                    $sistFunArr[$contador]['type'] = 'recurso';
                    $sistFunArr[$contador]['iconCls'] = 'generadorreportes';
                    $sistFunArr[$contador]['heredado'] = true;
                    $contador++;
                }
            }
        } else {
            if ($idnodo == 0) {
                $sistemas = DatSistema::cargarsistema($idnodo);
                $sistemasComp = DatSistema::cargarSistCompartimentados($idnodo);
                $sistemas = (object)array_merge((array)$sistemas, (array)$sistemasComp);
            } else {
                $sistemas = DatSistema::cargarsistema($idsistema);
                $sistemasComp = DatSistema::cargarSistCompartimentados($idnodo);
                $sistemas = (object)array_merge((array)$sistemas, (array)$sistemasComp);
            }

            if (count($sistemas) > 0) {
                foreach ($sistemas as $valores => $valor) {
                    if(is_array($valor)){
                        foreach ($valor as $valor1) {
                            $refSubsistema = $this->integrator->seguridad
                                ->getUriSubsystemById($valor1->id);
                            $sistFunArr[$contador]['id'] = $valor1->id . '_' . $idnodo;
                            $sistFunArr[$contador]['idsistema'] = $valor1->id;
                            $sistFunArr[$contador]['idpadre'] = $valor1->idpadre;
                            $sistFunArr[$contador]['text'] = $valor1->text;
                            $sistFunArr[$contador]['abreviatura'] = $valor1->abreviatura;
                            $sistFunArr[$contador]['descripcion'] = $valor1->descripcion;
                            $sistFunArr[$contador]['icono'] = $valor1->icono;
                            $sistFunArr[$contador]['servidorweb'] = $valor1->externa;
                            $sistFunArr[$contador]['type'] = 'sistema';
                            $sistFunArr[$contador]['referencia'] = $refSubsistema;
                            $sistFunArr[$contador]['indice'] = $valor1->index;
                            $contador++;
                        }
                        break;
                    } else {
                        $refSubsistema = $this->integrator->seguridad
                            ->getUriSubsystemById($valor->id);
                        $sistFunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                        $sistFunArr[$contador]['idsistema'] = $valor->id;
                        $sistFunArr[$contador]['idpadre'] = $valor->idpadre;
                        $sistFunArr[$contador]['text'] = $valor->text;
                        $sistFunArr[$contador]['abreviatura'] = $valor->abreviatura;
                        $sistFunArr[$contador]['descripcion'] = $valor->descripcion;
                        $sistFunArr[$contador]['icono'] = $valor->icono;
                        $sistFunArr[$contador]['servidorweb'] = $valor->externa;
                        $sistFunArr[$contador]['type'] = 'sistema';
                        $sistFunArr[$contador]['referencia'] = $refSubsistema;
                        $sistFunArr[$contador]['indice'] = $valor->index;
                        $contador++;
                    }
                }
            }

            $funcionalidad = DatFuncionalidad::cargarfuncionalidades(
                $idsistema, 0, 0
            );
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valores => $valor) {
                    $sistFunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                    $sistFunArr[$contador]['idfuncionalidad'] = $valor->id;
                    $sistFunArr[$contador]['text'] = $valor->text;
                    $sistFunArr[$contador]['descripcion'] = $valor->descripcion;
                    $sistFunArr[$contador]['abreviatura'] = $valor->abreviatura;
                    $sistFunArr[$contador]['icono'] = $valor->icono;
                    $sistFunArr[$contador]['referencia'] = $valor->referencia;
                    $sistFunArr[$contador]['indice'] = $valor->index;
                    $sistFunArr[$contador]['visibilidad'] = $valor->visible;
                    $sistFunArr[$contador]['externa'] = ($valor->DatSistema->externa != '') ? true : false;
                    $sistFunArr[$contador]['type'] = 'funcionalidad';
                    $sistFunArr[$contador]['icon'] = '/../../lib/ExtJS/temas/default/images/tree/leaf.gif';
                    $contador++;
                }
            }
//            var_dump($sistFunArr);
            $auxArr = array();
            foreach ($sistFunArr as $key => $valor) {
                $auxArr[$key] = $valor['indice'];
            }
            //oredeno el arreglo por indice de manera ascendente
            $bool = array_multisort($auxArr, SORT_ASC, $sistFunArr);
//            var_dump($bool);
        }
        echo json_encode($sistFunArr);
    }

    /**
     * @method exportarsistemaAction - Función usada para exportar los sistemas
     *  a partir de un nbodo especifico.
     */
    public function exportarsistemaAction()
    {
        $idsistema = $this->_request->getPost('idsistema');

        $xml = $this->devolverXML($idsistema);
        $fileName = 'sistemas.xml';
        header('Content-Type:text/xml');
        header('Content-Type: application/force-download');
        header("Content-Disposition: attachment; filename=\"{$fileName}\"");
        header('Pragma: no-cache');
        header('Expires: 0');
        echo($xml);
    }

    /**
     * @method importarXMLAction - Función usada para importar un sistema.
     */
    public function importarXMLAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $idsistema = $this->_request->getPost('idsistema');
        $dirFile = $_FILES['fileUpload']['tmp_name'];
        if ($_FILES['fileUpload']['type'] == 'text/xml') {
            if (file_exists($dirFile)) {
                $contenido = file_get_contents($dirFile);
                $contenido = ltrim($contenido);
                if ($obj = simplexml_load_string($contenido)) {
                    $xmlcargado = $obj;
                    try {
                        foreach ($xmlcargado as $xml) {
                            if ((string)$xml['type'] == 'sistema') {

                                if (DatSistema::verificarNombreSistema($idsistema, (string)$xml['name'], null) > 0) {
                                    $respuesta->codMsg = 3;
                                    $respuesta->mensaje = 'El subsistema que quiere importar ya existe.';
                                    $respuesta->failure = 'true';
                                    echo json_encode($respuesta);
                                    return;

                                } else {

                                    $this->arrayainsertar($xmlcargado, $idsistema, '');

                                    $respuesta->mensaje = 'El subsistema ha sido '
                                        . 'importado satisfactoriamente.';
                                    $respuesta->success = 'true';
                                    echo json_encode($respuesta);
                                    return;
                                }
                            }

                        }
                    } catch (Exception $exc) {
                        $respuesta->codMsg = 3;
                        $respuesta->mensaje = 'El archivo introducido'
                            . ' no es válido.';
                        $respuesta->failure = 'true';

                        echo json_encode($respuesta);
                    }
                } else {
                    $respuesta->codMsg = 3;
                    $respuesta->mensaje = 'El archivo introducido'
                        . ' no es válido.';
                    $respuesta->failure = 'true';

                    echo json_encode($respuesta);
                }
            }
        } else {
            $respuesta->codMsg = 3;
            $respuesta->mensaje = 'El archivo introducido'
                . ' no es válido.';
            $respuesta->failure = 'true';

            echo json_encode($respuesta);
        }
    }

    /**
     * @method cargargridaccionesAction() - Función usada para listar las
     * acciones de una funcionalidad determinada.
     *
     * @return json
     */
    public function cargargridaccionesAction()
    {
        $denominacion = $this->_request->getParam('denominacion');
        $idrecurso = $this->_request->getParam('idrecurso');

        if ($idrecurso) {
            if ($denominacion) {
                $this->cargarGridRecursoDadaDenominacion();
                return;
            } else {
                $this->cargarGridRecursoSinDenominacion();
                return;
            }
        } else {
            if ($denominacion) {
                $this->cargargridFuncDadaDenominacion();
                return;

            } else {
                $this->cargargridFuncSinDenominacion();
                return;
            }
        }
    }

    public function cargarGridRecursoDadaDenominacion()
    {
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        $denominacion = $this->_request->getParam('denominacion');
        $externa = $this->_request->getParam('externa');
        $idrecurso = $this->_request->getParam('idrecurso');
        $start = $this->_request->getParam("start");
        $limit = $this->_request->getParam("limit");

        if ($externa == "true") {
            $accExistentes = DatAccion::buscaraccion(
                $idfuncionalidad, $denominacion, $limit, $start
            );
            $canfilas = DatAccion::obtenercantaccionbuscadas(
                $idfuncionalidad, $denominacion
            );
        } else {

            $datosacc = $this->pedirReferenciaAccionesIIAction();

            if (count($datosacc) > 0) {
                $i = 0;
                $accionesExistGuardadasBD = array();
                foreach ($datosacc as $accion) {
                    if ($accion['checked']) {
                        $accionesExistGuardadasBD[$i] = $accion;
                    }

                    $i++;
                }
                $datosacc = $accionesExistGuardadasBD;
            }

            $accExistentes = array();
            foreach ($datosacc as $act) {
                if (is_int(
                    strpos(
                        strtolower($act['denominacion']),
                        strtolower($denominacion)
                    )
                )
                ) {
                    $accExistentes[] = $act;
                }
            }

            $canfilas = count($accExistentes);
            $resto = $canfilas - $start;
            $limite = $resto < $limit ? $resto : $limit;
            $accExistentes = array_slice(
                $accExistentes, $start, $limite
            );
        }

        $accionesRec = DatAccion::cargarRecursosAddII(
            $idfuncionalidad, $idrecurso, $denominacion, '', $start
        );
        $arrayDenomiAcciones = SegUtil::convertToUnidimensional(
            $accionesRec, 'denominacion'
        );
        if (count($accExistentes) > 0) {
            if (count($accionesRec) > 0) {
//                        print_r($arrayDenomiAcciones);
                foreach ($accExistentes as $key => $accion) {
                    if (array_intersect(
                        array($accion['denominacion']),
                        $arrayDenomiAcciones
                    )
                    ) {
                        $accExistentes[$key]['checked'] = true;
                    } else {
                        $accExistentes[$key]['checked'] = false;
                    }
                }
            } else {
                foreach ($accExistentes as $key => $accion) {
                    $accExistentes[$key]['checked'] = false;
                }
            }
        }

        echo json_encode(
            array(
                'cantidad_filas' => $canfilas,
                'datos'          => $accExistentes
            )
        );
        return;
    }

    public function cargarGridRecursoSinDenominacion()
    {
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        $denominacion = $this->_request->getParam('denominacion');
        $externa = $this->_request->getParam('externa');
        $idrecurso = $this->_request->getParam('idrecurso');
        $start = $this->_request->getParam("start");
        $limit = $this->_request->getParam("limit");

        if ($externa == "true") {
            $accExistentes = DatAccion::buscaraccion(
                $idfuncionalidad, '', $limit, $start
            );
            $canfilas = DatAccion::obtenercantaccionbuscadas(
                $idfuncionalidad, $denominacion
            );
        } else {

            $accExistentes = $this->pedirReferenciaAccionesIIAction();

            if (count($accExistentes) > 0) {

                $i = 0;
                $accionesExistGuardadasBD = array();

                foreach ($accExistentes as $accion) {
                    if ($accion['checked']) {
                        $accionesExistGuardadasBD[$i] = $accion;
                    }

                    $i++;
                }

                $accExistentes = $accionesExistGuardadasBD;

                $canfilas = count($accExistentes);

                $resto = $canfilas - $start;
                $limite = $resto < $limit ? $resto : $limit;
                $accExistentes = array_slice(
                    $accExistentes, $start, $limite
                );
            }
        }

        $accionesRec = DatAccion::cargarRecursosAddII(
            $idfuncionalidad, $idrecurso, '', '', $start
        );
        $arrayDenomiAcciones = SegUtil::convertToUnidimensional(
            $accionesRec, 'denominacion'
        );
        if (count($accExistentes) > 0) {
            if (count($accionesRec) > 0) {
//                        print_r($arrayDenomiAcciones);
                foreach ($accExistentes as $key => $accion) {
                    if (array_intersect(
                        array($accion['denominacion']),
                        $arrayDenomiAcciones
                    )
                    ) {
                        $accExistentes[$key]['checked'] = true;
                    } else {
                        $accExistentes[$key]['checked'] = false;
                    }
                }
            } else {
                foreach ($accExistentes as $key => $accion) {
                    $accExistentes[$key]['checked'] = false;
                }
            }
        }


        echo json_encode(
            array(
                'cantidad_filas' => $canfilas,
                'datos'          => $accExistentes
            )
        );

        return;
    }

    public function cargargridFuncDadaDenominacion()
    {
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        $denominacion = $this->_request->getParam('denominacion');
        $externa = $this->_request->getParam('externa');
        $start = $this->_request->getParam("start");
        $limit = $this->_request->getParam("limit");
        $insertarRec = $this->_request->getParam("insertarRec");

        if ($externa == "true") {
            $datosacc = DatAccion::buscaraccion(
                $idfuncionalidad, $denominacion, $limit, $start
            );
            // var_dump($datosacc);die;
            foreach ($datosacc as $key => $accion) {
                $datosacc[$key]['checked'] = true;
            }
            $canfilas = DatAccion::obtenercantaccionbuscadas(
                $idfuncionalidad, $denominacion
            );
            echo json_encode(
                array(
                    'cantidad_filas' => $canfilas,
                    'datos'          => $datosacc
                )
            );
            return;
        } else {

            $datosacc = $this->pedirReferenciaAccionesIIAction();
            $arrayAccionesBuscadas = array();
            if ($insertarRec) {
                $i = 0;
                $accionesExistGuardadasBD = array();

                foreach ($datosacc as $accion) {
                    if ($accion['checked']) {
                        $accionesExistGuardadasBD[$i] = $accion;
                    }

                    $i++;
                }

                $datosacc = $accionesExistGuardadasBD;
                foreach ($datosacc as $act) {
                    if (
                    is_int(
                        strpos(
                            strtolower($act['denominacion']),
                            strtolower($denominacion)
                        )
                    )
                    ) {
                        $arrayAccionesBuscadas[] = $act;
                    }
                }
            } else {
                foreach ($datosacc as $act) {
                    if (
                    is_int(
                        strpos(
                            strtolower($act['denominacion']),
                            strtolower($denominacion)
                        )
                    )
                    ) {
                        $arrayAccionesBuscadas[] = $act;
                    }
                }
            }
            $canfilas = count($arrayAccionesBuscadas);
            $resto = $canfilas - $start;
            $limite = $resto < $limit ? $resto : $limit;

            $arrayAccionesBuscadas = array_slice(
                $arrayAccionesBuscadas, $start, $limite
            );

            echo json_encode(
                array(
                    'cantidad_filas' => $canfilas,
                    'datos'          => $arrayAccionesBuscadas
                )
            );
            return;
        }
    }

    public function cargargridFuncSinDenominacion()
    {
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        $denominacion = $this->_request->getParam('denominacion');
        $externa = $this->_request->getParam('externa');
        $start = $this->_request->getParam("start");
        $limit = $this->_request->getParam("limit");
        $insertarRec = $this->_request->getParam("insertarRec");

        if ($externa == "true") {
            $datosacc = DatAccion::buscaraccion(
                $idfuncionalidad, '', $limit, $start
            );
            if (count($datosacc) > 0) {
                foreach ($datosacc as $key => $accion) {
                    $datosacc[$key]['checked'] = true;
                }
            }
            $canfilas = DatAccion::obtenercantaccionbuscadas(
                $idfuncionalidad, $denominacion
            );
            echo json_encode(
                array(
                    'cantidad_filas' => $canfilas,
                    'datos'          => $datosacc
                )
            );
            return;
        } else {
            $datosacc = $this->pedirReferenciaAccionesIIAction();
            if ($insertarRec) {
                $i = 0;
                $accionesExistGuardadasBD = array();
                foreach ($datosacc as $accion) {
                    if ($accion['checked']) {
                        $accionesExistGuardadasBD[$i] = $accion;
                    }
                    $i++;
                }
                $datosacc = $accionesExistGuardadasBD;

            }
            $canfilas = count($datosacc);
            $resto = $canfilas - $start;
            $limite = $resto < $limit ? $resto : $limit;
            $datos = array_slice($datosacc, $start, $limite);
            echo json_encode(
                array('cantidad_filas' => $canfilas, 'datos' => $datos)
            );
            return;
        }
    }

    /**
     * @method insertarsistemaAction - Función usada para
     * adicionar un nuevo sistema.
     */
    public function insertarsistemaAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $sistema = new DatSistema();
        $idpadre = $this->_request->getPost('idpadre');
        $sistema->denominacion = $denominacion;
        $sistema->abreviatura = $this->_request->getPost('abreviatura');
        $sistema->descripcion = $this->_request->getPost('descripcion');
        $sistema->icono = $this->_request->getPost('icono');
        $sistema->iddominio = $this->global->Perfil->iddominio;
        $sistema->index
            =
            count(DatSistema::cargarsistema($idpadre)) + count(DatFuncionalidad::cargarfuncionalidades($idpadre, 0, 0))
            + 1;
        $referencia = $this->_request->getPost('referencia');
        $nombrearray = explode('/', $referencia);
        $nombre = $nombrearray[count($nombrearray) - 1];
        //$visible = $this->_request->getPost('visibilidad') != '' 
        //    ? $this->_request->getPost('visibilidad') : false;
        $externo = $this->_request->getPost('externo') != ''
            ? $this->_request->getPost('externo') : false;

        $respuesta = new stdClass();
        $respuesta->codMsg = 1;

        $bool = true;
        $existeRefsubsit = false;
        if ($externo && $referencia == 'Seleccione la referencia') {
            echo "{'codMsg':3,'mensaje':'Escriba la referencia del "
                . "sistema externo.', 'failure': 'true'}";
        } else {
            if ($idpadre == 0) {
                if ($externo) {
                    $sistema->externa = $referencia;
                }
                $sistema->idpadre = $sistema->idsistema;

                if (!$externo) {
                    if ($referencia != 'Seleccione la referencia') {
                        $existeRefsubsit = $this->integrator->seguridad
                            ->existsubsistama($nombre);
                        if (!$existeRefsubsit) {
                            $sistema->save();
                            $bool = $this->integrator->seguridad
                                ->publicarSubsistemasXml(
                                    $sistema->idsistema,
                                    $nombre,
                                    $referencia,
                                    $denominacion
                                );
                        }
                    }
                }
            } else {
                $sistema->idpadre = $idpadre;

                if ($externo) {
                    $servwebpadre = DatSistema::buscarservidorweb($idpadre);
                    if (count($servwebpadre)) {
                        if ($servwebpadre[0]->externa) {
                            $sistema->externa = $servwebpadre[0]->externa;
                        } else {
                            $sistema->externa = $referencia;
                        }
                    }
                }

                if (!$externo) {
                    if ($referencia != 'Seleccione la referencia') {
                        $existeRefsubsit = $this->integrator->seguridad
                            ->existsubsistama($nombre);
                        if (!$existeRefsubsit) {
                            $sistema->save();
                            $bool = $this->integrator->seguridad
                                ->publicarSubsistemasXml(
                                    $sistema->idsistema,
                                    $nombre,
                                    $referencia,
                                    $denominacion
                                );
                        }
                    }
                }
            }
            if (!$existeRefsubsit) {
                $sistema->save();
                $objSistemaComp = new DatSistemaCompartimentacion();
                $objSistemaComp->idsistema = $sistema->idsistema;
                $objSistemaComp->iddominio = $this->global->Perfil->iddominio;
                $objSistemaComp->save();

                $arrayObjServidores = array();
                $model = new DatSistemaModel();
                $model->insertarsistema($arrayObjServidores, $sistema);
                echo "{'codMsg':1,'mensaje':'El subsistema ha sido adicionado </br>"
                    . "satisfactoriamente.', 'success': 'true'}";
            } else {
                if ($existeRefsubsit) {
                    echo "{'codMsg':3,'mensaje':'Ya existe un subsistema con "
                        . "esta referencia.', 'failure': 'true'}";
                }
            }
        }
    }

    /**
     * @method modificarsistemaAction - Función usada para midificar
     * un sistema seleccionado.
     */
    public function modificarsistemaAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $sistema = Doctrine::getTable('DatSistema')->find($idsistema);
        $sistema->denominacion = $denominacion;
        $sistema->abreviatura = $this->_request->getPost('abreviatura');
        $sistema->descripcion = $this->_request->getPost('descripcion');
        $sistema->icono = $this->_request->getPost('icono');
        $referencia = $this->_request->getPost('referencia');
        $nombrearray = explode('/', $referencia);
        $nombre = $nombrearray[count($nombrearray) - 1];
        //$visible = $this->_request->getPost('visibilidad') != '' 
        //    ? $this->_request->getPost('visibilidad') : false;
        $externo = $this->_request->getPost('externo') != ''
            ? $this->_request->getPost('externo') : false;
        $refSubsistInterno = $this->integrator->seguridad
            ->getUriSubsystemById($sistema->idsistema);

        $bool = true;
        $existeRefsubsit = false;

        if ($externo && $referencia == 'Seleccione la referencia') {
            echo "{'codMsg':3,'mensaje':'Escriba la referencia del "
                . "sistema externo.', 'failure': 'true'}";
        } else {
//            var_dump($externo);die;
            if ($externo) {
                if ($refSubsistInterno) {
                    $this->integrator->seguridad->eliminarSubsistemasXml(
                        $sistema->idsistema
                    );
                }
                self::modificarhijos($idsistema, $referencia);
                $sistema->externa = $referencia;
            }

            if (!$externo) {

                if ($sistema->externa) {
//                    var_dump('entro aqui');
                    self::modificarRecursosNietos($idsistema,$externo);
                    $sistema->externa = '';
//                    var_dump($sistema->externa);
                    if ($referencia != 'Seleccione la referencia') {
                        $existeRefsubsit = $this->integrator->seguridad
                            ->existsubsistama($nombre);
                        if (!$existeRefsubsit) {
                            $bool = $this->integrator->seguridad
                                ->publicarSubsistemasXml(
                                    $sistema->idsistema,
                                    $nombre,
                                    $referencia,
                                    $denominacion
                                );
                        }
                    }

//                    var_dump($sistema->externa); die();

                } else {
                    if ($refSubsistInterno) {

                        if ($referencia != 'Seleccione la referencia') {

                            $nombrerefSubsistInterno = explode('/', $refSubsistInterno);
                            $nombreRefSubInt = $nombrerefSubsistInterno[count($nombrerefSubsistInterno) - 1];

                            if($nombreRefSubInt != $nombre){

                                $existeRefsubsit = $this->integrator->seguridad
                                    ->existsubsistama($nombre);

                                if (!$existeRefsubsit) {
                                    $bool = $this->integrator->seguridad
                                        ->modificarSubsistema(
                                            $sistema->idsistema,
                                            $nombre,
                                            $referencia,
                                            $denominacion
                                        );
                                }

                            }

                        } else {
                            $this->integrator->seguridad
                                ->eliminarSubsistemasXml($sistema->idsistema);
                        }
                    } else {
                        if (!$refSubsistInterno && !$sistema->externa) {

                            if ($referencia != 'Seleccione la referencia') {
                                $existeRefsubsit = $this->integrator->seguridad
                                    ->existsubsistama($nombre);
                                if (!$existeRefsubsit) {

                                    $bool = $this->integrator->seguridad
                                        ->publicarSubsistemasXml(
                                            $sistema->idsistema,
                                            $nombre,
                                            $referencia,
                                            $denominacion
                                        );
                                }
                            }
                        }
                    }
                }
            }

            if (!$existeRefsubsit) {
                $arrayObjServidores = array();
                $model = new DatSistemaModel();
                $model->modificarsistema($arrayObjServidores, $sistema);
//                var_dump($sistema); die;
                echo "{'codMsg':1,'mensaje':'El subsistema ha sido modificado </br>"
                    . "satisfactoriamente.', 'success': 'true'}";
            } else {
                if ($existeRefsubsit) {
                    echo "{'codMsg':3,'mensaje':'Ya existe un subsistema "
                        . "con esta referencia.', 'failure': 'true'}";
                }
            }
        }
    }

    /**
     * @method eliminarsistemaAction - Función usada para eliminar
     *  una rama completa.
     */
    public function eliminarsistemaAction()
    {
        $sistemashijos = DatSistema::cargarsistema(
            $this->_request->getPost('idsistema')
        );
        foreach ($sistemashijos as $sistema) {
            $this->integrator->seguridad->eliminarSubsistemasXml($sistema->id);
        }
        DatSistema::eliminarsistema($this->_request->getPost('idsistema'));
        $this->integrator->seguridad->eliminarSubsistemasXml(
            $this->_request->getPost('idsistema')
        );
        echo "{'codMsg':1,'mensaje':'El subsistema ha sido eliminado </br>"
            . "satisfactoriamente.', 'success': 'true'}";
    }

    /**
     * @method cargarReferenciaAction - Función usada para cargar
     * el árbol de referencias para insertar posteriormente
     * las funcionalidades.
     */
    public function cargarReferenciaFuncionalidadesAction()
    {
        $idnodo = $this->_request->getParam('id');
        $name = $this->_request->getParam('text');
        $type = $this->_request->getParam('type');
        $dr = explode('/web', $_SERVER['DOCUMENT_ROOT']);
        if ($idnodo) {
            $raiz = $idnodo . '/';
        } else {
            $raiz = $dr[0] . '/' . 'apps/';
        }
        $nodes = array();
        if ($type != 'controlador') {
            $d = dir($raiz);
            while ($f = $d->read()) {
                if ($f == '.'
                    || $f == '..'
                    || substr($f, 0, 1) == '.'
                    || $f == 'config.php'
                    || $f == 'comun'
                    || $f == 'models'
                    || $f == 'services'
                    || $f == 'validators'
                    || $f == 'views'
                    || $f == 'index.php'
                ) {
                    continue;
                }
                if (is_dir($raiz . '/' . $f)) {
                    $nodes[] = array(
                        'text' => $f,
                        'id'   => $raiz . $f,
                        'cls'  => 'folder'
                    );
                } else {
                    if ($name == 'controllers') {
                        $nodes[] = array(
                            'text' => $f,
                            'id'   => $raiz . $f,
                            'cls'  => 'folder',
                            'type' => 'controlador'
                        );
                    } else {
                        $nodes[] = array(
                            'text' => $f,
                            'id'   => $raiz . $f,
                            'leaf' => true,
                            'cls'  => 'folder',
                            'type' => 'controlador'
                        );
                    }
                }
            }
            $d->close();
        } else {
            $controler = explode('/controllers/', $idnodo);
            if (file_exists($controler[0] . '/config.php')) {
                include_once $controler[0] . '/config.php';
            }
            set_include_path(
                get_include_path() . PATH_SEPARATOR . dirname($idnodo)
            );
            $class = substr($controler[1], 0, strlen($controler[1]) - 4);
            $methods = @get_class_methods($class);
            $nodes = self::getMethodsInformation($methods, $idnodo, $name);
            for ($i = 0; $i < count($nodes); $i++) {
                $nodes[$i]['id'] = $nodes[$i]['referencia'];
            }
            //var_dump($nodes);die;
        }
        echo json_encode($nodes);
    }

    /**
     * @method insertarfuncionalidadAction - Función usada para adicionar
     * nuevas funcionalidades.
     */
    public function insertarfuncionalidadAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad->idsistema = $this->_request->getPost('idsistema');
        $funcionalidad->denominacion = $denominacion;
        $funcionalidad->referencia = $this->_request->getPost('referencia');
        $funcionalidad->descripcion = $this->_request->getPost('descripcion');
//        $funcionalidad->index = $this->_request->getPost('index') + 1;
        $funcionalidad->index
            = count(DatFuncionalidad::cargarfuncionalidades($this->_request->getPost('idsistema'), 0, 0)) + count(
                DatSistema::cargarsistema($this->_request->getPost('idsistema'))
            ) + 1;
        $funcionalidad->icono = $this->_request->getPost('icono');
        $funcionalidad->iddominio = $this->global->Perfil->iddominio;
        $funcionalidad->visible = $this->_request->getPost('visibilidad') != ''
            ? true : false;

        $funcionalidad->abreviatura = $this->_request->getPost('abreviatura');
        //$externo = $this->_request->getPost('externo') != '' 
        //   ? $this->_request->getPost('externo') : false;

        $model = new DatFuncionalidadModel();
        $idfuncionalidad = $model->insertarfuncionalidad($funcionalidad);
        $objFuncCompart = new DatFuncionalidadCompartimentacion();
        $objFuncCompart->iddominio = $this->global->Perfil->iddominio;
        $objFuncCompart->idfuncionalidad = $idfuncionalidad;
        $objFuncCompart->save();
        echo "{'codMsg':1,'mensaje':'La funcionalidad ha sido adicionada </br>"
            . "satisfactoriamente.', 'success': 'true'}";
    }

    /**
     * @method modificarfuncionalidadAction() - Función usada para modificar
     * una funcionalidad determinada.
     */
    public function modificarfuncionalidadAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        $funcionalidad->idsistema = $this->_request->getPost('idsistema');
        $funcionalidad->denominacion = $denominacion;
        $funcionalidad->referencia = $this->_request->getPost('referencia');
        $funcionalidad->descripcion = $this->_request->getPost('descripcion');
        $funcionalidad->icono = $this->_request->getPost('icono');
        $funcionalidad->visible = $this->_request->getPost('visibilidad') != ''
            ? true : false;

        $funcionalidad->abreviatura = $this->_request->getPost('abreviatura');
        //$externo = $this->_request->getPost('externo') != '' 
        //    ? $this->_request->getPost('externo') : false;

        $model = new DatFuncionalidadModel();
        $model->modificarfuncionalidad($funcionalidad);
        echo "{'codMsg':1,'mensaje':'La funcionalidad ha sido "
            . "modificada </br>satisfactoriamente.', 'success': 'true'}";
    }

    /**
     * @method eliminarfuncionalidadAction - Función usada para eliminar
     * un conjunto de funcionalidades.
     */
    public function eliminarfuncionalidadAction()
    {
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        $model = new DatFuncionalidadModel();
        $model->eliminarfuncionalidad($funcionalidad);
        echo "{'codMsg':1,'mensaje':'La funcionalidad ha sido eliminada </br>"
            . "satisfactoriamente.', 'success': 'true'}";
    }

    public function incluirControladores($dir)
    {
        $excludedFolder = ['models', 'comun', 'services', 'views', 'validators', 'recursos'];
        $arrays = array_diff(scandir($dir), array('.', '..', '.svn', '.idea',));
        if(array_search("controllers", $arrays, true)){
            $arrays = array_diff($arrays, $excludedFolder);
        }
        foreach ($arrays as $carpeta) {
            $dir1 = $dir . '/' . $carpeta;

            if (array_search("controllers", $arrays, true)) {
                $include = $dir . '/controllers/';
                $includePath = get_include_path();
                set_include_path($includePath . PATH_SEPARATOR . $include);
            }
            self::incluirControladores($dir1);
        }
        return;
    }



    public function pedirReferenciaAccionesIIAction()
    {
        $idfuncionalidad = $this->_request->getParam('idfuncionalidad');
        $referencia = $this->_request->getParam('referencia');
        $referenciaI = DatFuncionalidad::obtenerReferenciaByIdFuncionalidad($idfuncionalidad);
//        var_dump($referenciaI); die();
        if($referenciaI[0]['referencia'] != $referencia){
            $referencia = $referenciaI[0]['referencia'];
        }
        $controlador = explode('/', $referencia);
        $controlador = ucfirst($controlador[count($controlador) - 2])
            . 'Controller';
//        $includePath = get_include_path();
        $dr = explode('/web', $_SERVER['DOCUMENT_ROOT']);
//        $module = explode('/index.php/', $referencia);
        $module = explode('/', $referencia);
//        $include = $dr[0] . '/' . 'apps/' . $module[0] . '/controllers/';
        $dir = $dr[0] . '/' . 'apps/' . $module[0] ;

        $this->incluirControladores($dir);

        $methods = @get_class_methods($controlador);

        $accionesexistentes = self::getMethodsInformationAccionesIII(
            $methods, $idfuncionalidad
        );

        return $accionesexistentes;
    }

    public function insertaraccionAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;

        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayNodesChecked = json_decode(
            stripslashes($this->_request->getPost('accionesChequeadas'))
        );
        $arrayNodesElim = json_decode(
            stripslashes(
                $this->_request->getPost('denominacionAccionesEliminar')
            )
        );

        if (count($arrayNodesChecked) > 0) {
            $arraysemodifacaron = array();
            foreach ($arrayNodesChecked as $action) {
                $idaccion = $action->idaccion;
                $denominacion = $action->denominacion;
                $descripcion = $action->descripcion;

                if ($idaccion != 0) {
                    $datAccion = Doctrine::getTable('DatAccion')
                        ->find($idaccion);
                    if ($datAccion->descripcion != $descripcion) {
                        $datAccion->descripcion = $descripcion;
                        $arraysemodifacaron[] = $datAccion;
                    }
                    $datAccion->save();
                } else {
                    $accion = new DatAccion();
                    $accion->denominacion = $denominacion;
                    $accion->descripcion = $descripcion;
                    $accion->idfuncionalidad = $idfuncionalidad;
                    $accion->iddominio = $this->global->Perfil->iddominio;
                    $model = new DatAccionModel();
                    $idaccion = $model->insertaraccion($accion);
                }
            }
//            print_r($arraysemodifacaron)die;
            if (count($arraysemodifacaron) == 1) {
//                $respuesta->mensaje = "La operación ha sido "
//                    . "concluida satisfactoriamente.";
                $respuesta->mensaje = 'La acción ha sido '
                    . 'modificada satisfactoriamente.';
            } else {
//                $respuesta->mensaje = "La operación ha sido "
//                    . "concluida satisfactoriamente.";
                $respuesta->mensaje = 'Las acciones han sido '
                    . 'modificadas </br>satisfactoriamente.';
            }
        }
        if (count($arrayNodesElim) > 0) {
            $accionesUsadas = DatAccion::obtenerAccionesUsuario(
                $arrayNodesElim, $idfuncionalidad
            );
            $accionesUsadas = SegUtil::convertToUnidimensional(
                $accionesUsadas, 'denominacion'
            );
            if (count($accionesUsadas) > 0) {
                $nodesElim = array();
                $nodesElim = array_diff($arrayNodesElim, $accionesUsadas);
                if (count($nodesElim) > 0) {
                    $accionesElim = array();
                    foreach ($nodesElim as $denomin) {
                        $accionesElim[] = $denomin;
                    }
                    $respuesta->denominaciones = $accionesElim;
                    DatAccion::eliminarAcciones($nodesElim, $idfuncionalidad);
                }
                if (count($arrayNodesElim) == 1) {
                    $respuesta->codMsg = 3;
                    $respuesta->mensaje = "La acción seleccionada no se "
                        . "puede eliminar del sistema debido a que está en uso.";
//                    $respuesta->mensaje = "La acción seleccionada no se "
//                        . "puede desmarcar debido a que está en uso.";
                } else {
                    $stringDenominacion = "";
                    $longitud = count($accionesUsadas);

                    foreach ($accionesUsadas as $key => $denominacion) {
                        if ($key == 0) {
                            $stringDenominacion .= $denominacion;
                        } elseif ($key == $longitud - 1) {
                            $ultimaDenominacion = $denominacion;
                            $inicial = $ultimaDenominacion[0];
                            $stringDenominacion .= (strtolower($inicial) == "i")
                                ? (" e " . $ultimaDenominacion)
                                : (" y " . $ultimaDenominacion);
                        } else {
                            $stringDenominacion .= ", " . $denominacion;
                        }
                    }
                    $respuesta->codMsg = 3;
                    if (count($accionesUsadas) == 1) {
                        $respuesta->mensaje = "La acción seleccionada no se "
                            . "puede eliminar del sistema debido a que está en uso.";
//                        $respuesta->mensaje = "La acción denominada "
//                            . $stringDenominacion
//                            . " no se puede desmarcar "
//                            . "debido a que está en uso.";
                    } else {
                        $respuesta->mensaje = "Las acciones seleccionadas no se "
                            . "pueden eliminar del sistema debido a que están en uso.";
//                        $respuesta->mensaje = "Las acciones denominadas "
//                            . $stringDenominacion
//                            . " no se pueden desmarcar debido "
//                            . "a que están en uso.";
                    }
                }
            } else {
                DatAccion::eliminarAcciones($arrayNodesElim, $idfuncionalidad);
                if (count($arrayNodesChecked) == 1) {
//                    $respuesta->mensaje = "La operación ha sido "
//                        . "concluida satisfactoriamente.";
                    $respuesta->mensaje = 'La acción ha sido '
                        . 'guardada satisfactoriamente.';
                } else {
//                    $respuesta->mensaje = "La operación ha sido "
//                        . "concluida satisfactoriamente.";
                    $respuesta->mensaje = 'Las acciones han sido '
                        . 'guardadas <br>satisfactoriamente.';
                }
            }
        }
        echo json_encode($respuesta);
        return;
    }


    /**
     * @author Darien García Tejo.
     * @method adicionarAccioneExternaAction() - Función encargada de registrar
     *  las acciones pertenecientes a las
     *         funcionalidades de los sistemas externos.
     * @return void
     */
    public function adicionarAccioneExternaAction()
    {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $denominacion = $this->_request->getPost('denominacionacc');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $descripcion = $this->_request->getPost('descripcionacc');
        $accion = new DatAccion();
        $accion->denominacion = $denominacion;
        $accion->descripcion = $descripcion;
        $accion->idfuncionalidad = $idfuncionalidad;
        $accion->iddominio = $this->global->Perfil->iddominio;
        $model = new DatAccionModel();
        $idaccion = $model->insertaraccion($accion);
        echo "{'codMsg':1,'mensaje':'La acci&oacute;n ha sido adicionada "
            . "satisfactoriamente.','idaccion': '$idaccion', 'success': 'true'}";
    }

    /**
     * @author Darien García Tejo.
     * @method modificarAccioneExternaAction - Función usada para actualizar
     * la acción seleccionada dentro de una
     *         funcionalidad.
     * @return void
     */
    public function modificarAccioneExternaAction()
    {
        $arrayAcciones = json_decode(
            stripslashes($this->_request->getPost('arrayAcciones'))
        );
        $arraydenominaciones = array();
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $existedenominacion = false;
        foreach ($arrayAcciones as $action) {
            $idaccion = $action->idaccion;
            $idfuncionalidad = $action->idfuncionalidad;
            $denominacion = $action->denominacion;
            $longitud = strlen($denominacion);
            if ($denominacion[$longitud-1] == " ") {
                $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
            }
            $descripcion = $action->descripcion;

            $datAccion = Doctrine::getTable('DatAccion')->find($idaccion);
            if ($datAccion->denominacion != $denominacion) {
                if (DatAccion::verificarAccion('denominacion', $denominacion, $idfuncionalidad, $idaccion) > 0) {
                    $existedenominacion = true;
                    $arraydenominaciones[] = $denominacion;
                } else {
                    $datAccion->denominacion = $denominacion;
                }
            }
            if ($datAccion->descripcion != $descripcion) {
                $datAccion->descripcion = $descripcion;
            }
            $datAccion->save();
        }
        if ($existedenominacion) {
            $respuesta->codMsg = 3;
            if (count($arrayAcciones) > 1) {
                $stringDenominacion = "";
                $longitud = count($arraydenominaciones);

                foreach ($arraydenominaciones as $key => $denominacion) {
                    if ($key == 0) {
                        $stringDenominacion .= $denominacion;
                    } elseif ($key == $longitud - 1) {
                        $ultimaDenominacion = $denominacion;
                        $inicial = $ultimaDenominacion[0];
                        $stringDenominacion .= (strtolower($inicial) == "i")
                            ? (" e " . $ultimaDenominacion)
                            : (" y " . $ultimaDenominacion);
                    } else {
                        $stringDenominacion .= ", " . $denominacion;
                    }
                }
                if (count($arraydenominaciones) > 1) {
//                    $respuesta->mensaje = "Ya existen acciones con "
//                        . "las denominaciones "
//                        . $stringDenominacion
//                        . " en la funcionalidad seleccionada.";
                    $respuesta->mensaje = "Las acciones "
                        . $stringDenominacion
                        . " ya existen.";
                } else {
                    $respuesta->mensaje = "La acción "
                        . $stringDenominacion
                        . " ya existe.";
                }
            } else {
                $respuesta->mensaje = "La acción ya existe.";
            }
        } else {
            if (count($arrayAcciones) > 1) {
//              $respuesta->mensaje = "La operación ha sido "
//                . "concluida satisfactoriamente.";
                $respuesta->mensaje = "Las acciones han sido "
                    . "modificadas </br>satisfactoriamente.";
            } else {
//            $respuesta->mensaje = "La operación ha sido "
//                . "concluida satisfactoriamente.";
                $respuesta->mensaje = "La acci&oacute;n ha sido "
                    . "modificada satisfactoriamente.";
            }
        }

        echo json_encode($respuesta);
        return;
    }


    /**
     * @author Darien García Tejo.
     * @method eliminarAccioneExternaAction - Función usada para eliminar
     * las acciones seleccionadas de una
     *         funcionalidad.
     * @return void
     */
    public function eliminarAccioneExternaAction()
    {
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;

        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayNodesElim = json_decode(
            stripslashes($this->_request->getPost('denominacionAccion'))
        );
        if (count($arrayNodesElim) > 0) {
            $accionesUsadas = DatAccion::obtenerAccionesUsuario(
                $arrayNodesElim, $idfuncionalidad
            );
            $accionesUsadas = SegUtil::convertToUnidimensional(
                $accionesUsadas, 'denominacion'
            );
            if (count($accionesUsadas) > 0) {
                $nodesElim = array();
                $nodesElim = array_diff($arrayNodesElim, $accionesUsadas);
                if (count($nodesElim) > 0) {
                    $accionesElim = array();
                    foreach ($nodesElim as $denomin) {
                        $accionesElim[] = $denomin;
                    }
                    $respuesta->denominaciones = $accionesElim;
                    DatAccion::eliminarAcciones($nodesElim, $idfuncionalidad);
                }
                if (count($arrayNodesElim) == 1) {
                    $respuesta->codMsg = 3;
                    $respuesta->mensaje = "La acción seleccionada no se puede "
                        . "eliminar debido a que está en uso.";
                } else {
                    $stringDenominacion = "";
                    $longitud = count($accionesUsadas);

                    foreach ($accionesUsadas as $key => $denominacion) {
                        if ($key == 0) {
                            $stringDenominacion .= $denominacion;
                        } elseif ($key == $longitud - 1) {
                            $ultimaDenominacion = $denominacion;
                            $inicial = $ultimaDenominacion[0];
                            $stringDenominacion .= (strtolower($inicial) == "i")
                                ? (" e " . $ultimaDenominacion)
                                : (" y " . $ultimaDenominacion);
                        } else {
                            $stringDenominacion .= ", " . $denominacion;
                        }
                    }
                    $respuesta->codMsg = 3;
                    if (count($accionesUsadas) == 1) {
//                        $respuesta->mensaje = "La accion denominada "
//                            . $stringDenominacion
//                            . " no se puede eliminar debido "
//                            . "a que está en uso.";
                        $respuesta->mensaje = "La acción seleccionada no se puede "
                            . "eliminar debido a que está en uso.";
                    } else {
//                        $respuesta->mensaje = "Las acciones denominadas "
//                            . $stringDenominacion
//                            . " no se pueden eliminar "
//                            . "debido a que están en uso.";
                        $respuesta->mensaje = "Las acciones seleccionadas no se pueden "
                            . "eliminar debido a que estan en uso.";
                    }

                }
            } else {
                DatAccion::eliminarAcciones($arrayNodesElim, $idfuncionalidad);
                if (count($arrayNodesElim) == 1) {
                    $respuesta->mensaje = 'La acción ha sido eliminada '
                        . 'satisfactoriamente.';
                } else {
                    $respuesta->mensaje = 'Las acciones han sido eliminadas '
                        . 'satisfactoriamente.';
                }
            }
            echo json_encode($respuesta);
            return;
        }
    }

    /**
     * @method insertarRecursosAction - Función usada para
     * adicionar un recurso.
     */
    public function insertarRecursosAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $iddominio = $this->global->Perfil->iddominio;
        $arrayAccionesChecked = json_decode(
            stripslashes($this->_request->getPost('arrayAccionesChecked'))
        );

        $icono = $this->_request->getPost('icono');
        //$referencia = $this->_request->getPost('referencia');
        //$externo = $this->_request->getPost('externo') != '' 
        //   ? $this->_request->getPost('externo') : false;
        //$visible = $this->_request->getPost('visibilidad') 
        //!= '' ? true : false;

        $objRecurso = new DatRecursoModel();
        $idrecurso = $objRecurso->insertarRecurso(
            $denominacion,
            $abreviatura,
            $descripcion,
            $idfuncionalidad,
            $iddominio,
            $icono
        );

        foreach ($arrayAccionesChecked as $action) {
            $idaccion = $action->idaccion;
            $denominacion = $action->denominacion;
            $descripcion = $action->descripcion;

            $obj = new DatFuncionalidadDatAccion();
            $obj->idfuncionalidadasociada = $idfuncionalidad;
            $obj->idrecurso = $idrecurso;

            if ($idaccion != 0) {
                $obj->idaccion = $idaccion;
            } else {
                $accion = new DatAccion();
                $accion->denominacion = $denominacion;
                $accion->descripcion = $descripcion;
                $accion->idfuncionalidad = $idfuncionalidad;
                $accion->iddominio = $iddominio;

                $model = new DatAccionModel();
                $idaccionNew = $model->insertaraccion($accion);

                $obj->idaccion = $idaccionNew;
            }

            $obj->save();
        }


        echo "{'codMsg':1,'mensaje':'El recurso ha sido adicionado "
            . "satisfactoriamente.', 'success': 'true'}";
    }


    public function validarRecursoAction()
    {
        //$global = ZendExt_GlobalConcept::getInstance();

        $this->modificarRecursos();
    }

    /**
     * @method modificarRecursosAction - Función usada
     * para modificar un recurso
     */
    public function modificarRecursos()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrecurso = $this->_request->getPost('idrecurso');

        $icono = $this->_request->getPost('icono');
        //$referencia = $this->_request->getPost('referencia');
        //$externo = $this->_request->getPost('externo') != '' 
        //    ? $this->_request->getPost('externo') : false;
        //$visible = $this->_request->getPost('visibilidad') 
        //!= '' ? true : false;

        $arrayNodesChecked = json_decode(
            stripslashes($this->_request->getPost('arrayAccionesChecked'))
        );
        $arrayNodesElim = json_decode(
            stripslashes($this->_request->getPost('arrayAccionesElim'))
        );

        if (count($arrayNodesElim) > 0) {
            $accionesRec = DatAccion::cargarRecursosAddII(
                $idfuncionalidad, $idrecurso, ''
            );
            $arrayIdAccRec = SegUtil::convertToUnidimensional(
                $accionesRec, 'idaccion'
            );
            foreach ($arrayNodesElim as $idaction) {
                if (array_intersect(array($idaction), $arrayIdAccRec)) {
//                    DatSistemaSegRolDatFuncionalidadDatAccion
//                        ::eliminarPermisosRecursos(
//                            $idrecurso, $idfuncionalidad, $idaction
//                        );
                    DatSistemaSegRolDatFuncionalidadDatAccion
                        ::eliminarPermisosRecursosAcciones(
                            $idrecurso, $idaction
                        );
                    DatFuncionalidadDatAccion::eliminarRecursosAccion(
                        $idrecurso, $idaction
                    );
                }
            }
        }

        $objRecurso = new DatRecursoModel();
        $objRecurso->modificarRecurso(
            $idrecurso, $denominacion, $abreviatura,
            $descripcion, $idfuncionalidad, $icono
        );

        if (count($arrayNodesChecked) > 0) {
            $arrayAcc = DatFuncionalidadDatAccion::getArrayAccionesByIdFunc(
                $idfuncionalidad, $idrecurso
            );
            $arrayAcc = SegUtil::convertToUnidimensional(
                $arrayAcc, 'idaccion'
            );
            $arrayAccInsertar = array_diff($arrayNodesChecked, $arrayAcc);

            if (count($arrayAccInsertar) > 0) {
                foreach ($arrayAccInsertar as $idacciones) {
                    $arrayAccEliminar = array_diff($arrayAcc, $idacciones);

                    $obj = new DatFuncionalidadDatAccion();
                    $obj->idaccion = $idacciones;
                    $obj->idfuncionalidadasociada = $idfuncionalidad;
                    $obj->idrecurso = $idrecurso;
                    $arrayObjectInsert[] = $obj;

                    if (count($arrayAccEliminar) > 0) {
                        DatFuncionalidadDatAccion::eliminarRecursosFuncAccion(
                            $idrecurso, $idfuncionalidad, $arrayAccEliminar
                        );
                    }
                }
            }
            $objRecurso->actualizarPermisos(
                $arrayObjectInsert, $idrecurso, $idfuncionalidad
            );
        }
        echo "{'codMsg':1,'mensaje':'El recurso ha sido modificado "
            . "satisfactoriamente.', 'success': 'true'}";
    }

    /**
     * @method eliminarRecursosAction - Función usada para eliminar
     *  una colección de recursos.
     */
    public function eliminarRecursosAction()
    {
        $arrayRecursosElim = json_decode(
            stripslashes($this->_request->getPost('arrayRecursosElim'))
        );
//        var_dump($arrayRecursosElim); die();
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $esHeredado = $arrayRecursosElim[1];
        if(!$esHeredado){
            $objRecursosModel = new DatRecursoModel();
            $objRecursosModel->eliminarRecursos($arrayRecursosElim[0]);
        }
        else{
            $objRecursosFuncionalidadModel = new DatRecursoFuncionalidadModel();
            $objRecursosFuncionalidadModel->eliminarrecursoFuncionalidad($arrayRecursosElim[0],$idfuncionalidad);
        }

        echo "{'codMsg':1,'mensaje':'El recurso ha sido "
            . "eliminado satisfactoriamente.', 'success': 'true'}";
    }


    public function cargarArbolSistemaFisicoAction()
    {
        $idNodo = $this->getRequest()->getParam('node');
        $datos = array();
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idpadre = "";
        if ($idNodo != 'root') {
            $dirApps .= $idNodo;
            $idpadre = $idNodo;
        }
        $arrays = array_diff(
            scandir($dirApps), array('.', '..', '.svn', '.idea')
        );
        foreach ($arrays as $dir) {
            if ($dir != 'comun') {
                if (is_dir($dirApps . '/' . $dir)) {
                    $hoja = $this->isHojaDir($dirApps . '/' . $dir);
                    $nodo = array(
                        'idpadre' => $idNodo,
                        'id'      => ($idpadre == "") ? $dir : $idpadre . '/' . $dir,
                        'leaf'    => $hoja,
                        'text'    => $dir
                    );
                    array_push($datos, $nodo);
                }
            }
        }
        echo json_encode($datos);
    }

    public function isHojaDir($dir)
    {
        $arrays = array_diff(scandir($dir), array('.', '..', '.svn', '.idea'));
        if (count($arrays) == 0) {
            return true;
        }
        foreach ($arrays as $value) {
            if (is_dir($dir . $value)) {
                return false;
            }
        }
//        return true;
    }

    public function modificarRelacionFuncionalidadSitemaAction()
    {
        //$indice = $this->_request->getPost('indice');
        //$idsistemaDestino = $this->_request->getPost('idsistemaDestino');

        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        $funcionalidad->idsistema = $this->_request->getPost('idsistemaDestino');
        $funcionalidad->index = $this->_request->getPost('indice');

        $model = new DatFuncionalidadModel();
        $model->modificarfuncionalidad($funcionalidad);

        $objSistRolFunc = Doctrine::getTable('DatSistemaSegRolDatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        if ($objSistRolFunc) {
            $objSistRolFunc->idsistema = $this->_request->getPost('idsistemaDestino');
            $objSistRolFunc->save();
        }
        $objSistRolFuncAcc = Doctrine::getTable('DatSistemaSegRolDatFuncionalidadDatAccion')
            ->find($this->_request->getPost('idfuncionalidad'));
        if ($objSistRolFuncAcc) {
            $objSistRolFuncAcc->idsistema = $this->_request->getPost('idsistemaDestino');
            $objSistRolFuncAcc->save();
        }

    }

    public function modificarRelacionSistemaSitemaAction()
    {
        $sistema = Doctrine::getTable('DatSistema')
            ->find($this->_request->getPost('idsistema'));
        if ($this->_request->getPost('idsistemaDestino')) {
            $sistema->idpadre = $this->_request->getPost('idsistemaDestino');
        } else {
            $sistema->idpadre = $this->_request->getPost('idsistema');
        }

        $sistema->index = $this->_request->getPost('indice');
        $model = new DatSistemaModel();
        $model->modificarsistema(array(), $sistema);
    }

    public function modificarIndiceAction()
    {
        $idpadreNuevo = $this->_request->getPost('idsistemaDestino');
        $indiceNuevo = $this->_request->getPost('indice');
        $idpadreViejo = $this->_request->getPost('idsitemaOrigen');
        $idindiceViejo = $this->_request->getPost('indiceNodo');
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');

        DatSistema::actualizarIndiceSistema($idpadreNuevo, $indiceNuevo, $idpadreViejo, $idindiceViejo, $idsistema);
        DatFuncionalidad::actualizarIndiceFuncionalidad(
            $idpadreNuevo, $indiceNuevo, $idpadreViejo, $idindiceViejo, $idfuncionalidad
        );
    }

    public function cantidadHijosAction()
    {
        $idsistema = $this->_request->getPost('idsitema');
        $cantidad = count(DatSistema::cargarsistema($idsistema)) +
            count(DatFuncionalidad::cargarfuncionalidades($idsistema, 0, 0));
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $respuesta->cantidadHijos = $cantidad;
        echo json_encode($respuesta);
    }

    public function cargarCmbIconFontsAction(){
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        $webPath = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'web';

        $iconFonts = file_get_contents( $webPath . "/lib/ExtJS/temas/fonts-icons.json");
        $iconFonts = json_decode($iconFonts, true);
        $iconFonts = $iconFonts['icons'];

        foreach ($iconFonts as $icon){
            $result[] = array('icon'=>$icon['properties']['name']);
        }
        echo json_encode(array('icons' => $result));
    }

    public function insertarRecursoHeredado(){

    }

    public function moverRecursoHeredadoAction(){

//        $idfuncionalidadPadre = $this->_request->getPost('idfuncionalidadPadre');
        $idfuncionalidadAdoptiva = $this->_request->getPost('idfuncionalidadAdoptiva');
        $idrecurso = $this->_request->getPost('idrecurso');
        $externo = $this->_request->getPost('externo');
        $recurso = Doctrine::getTable('DatRecurso')->find($idrecurso);
//        var_dump($recurso);die();
        $respuesta = new stdClass();
        if($recurso){
            $objRecursoFuncionalidad = new DatRecursoFuncionalidadModel();
            $idrecurso = $objRecursoFuncionalidad->insertarrecursoFuncionalidad($idrecurso,$idfuncionalidadAdoptiva, $externo);
            $respuesta->codMsg = 1;
            $respuesta->mensaje = 'El recurso ha sido movido satisfactoriamente.';
        }
        else{
            $respuesta->codMsg = 3;
            $respuesta->mensaje = 'El recurso que esta moviendo ha sido eliminado de la funcionalidad a la que pertenecia.';
        }
        echo json_encode($respuesta);


    }

    public function existeRecursoAction(){
        $idfuncionalidadAdoptiva = $this->_request->getPost('idfuncionalidadAdoptiva');
        $idrecurso = $this->_request->getPost('idrecurso');

        $objRecFunc = new DatRecursoFuncionalidad();
        $datos = $objRecFunc->comprobarRecursoHeredadoByIdFuncIdRec($idfuncionalidadAdoptiva, $idrecurso);
//        var_dump($datos); die();
        echo json_encode($datos);

    }

}

