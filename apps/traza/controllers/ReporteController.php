<?php

class ReporteController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    public function ReporteAction()
    {
        $this->render();
    }

    public function cargarValoresGraficasAction(){
        $params = $this->_request->getParams();//$parametros FechaDesde, FechaHasta.
        $data = array();
        $arrayFiltros = HisTrazaModel::getFiltros($params);
        switch($params['grafica']){
            case 'subsistema':
                $datos = HisTraza::getGraficByCategory($arrayFiltros);
                foreach ($datos as $key => $value) {
                    array_push($data, array('categoria'=>$value['subsistema'],'valor'=>(int)$value['count']));
                }
                break;
            case 'fecha':
                $datos = HisTraza::getGraficByDate($arrayFiltros);
                foreach ($datos as $key => $value) {
                    array_push($data, array('categoria'=>$value['fecha'],'valor'=>(int)$value['count']));
                }
                break;
            case 'usuario':
                $datos = HisTraza::getGraficByUser($arrayFiltros);
                foreach ($datos as $key => $value) {
                    array_push($data, array('categoria'=>$value['usuario'],'valor'=>(int)$value['count']));
                }
                break;
            case 'tipo':
                $datos = HisTraza::getGraficByTipe($arrayFiltros);
                foreach ($datos as $key => $value) {
                    array_push($data, array('categoria'=>$value['tipotraza'],'valor'=>(int)$value['count']));
                }
                break;
        }

        echo  json_encode($data);

    }


    function cargarhijosAction()
    {
        $params = json_decode($this->_request->getParam('params'));
        $datos = array();
        switch ($params->tipo) {
            case 'inicio':
                $datos = HisTrazaModel::getUsersWithSessions((array)$params);
                break;
            case 'usuario':
                $datos = HisTrazaModel::getSesionsWithTracesTree(
                    (array)$params
                );
                break;
            case 'sesion':
                $datos = HisTrazaModel::getTracesArrayTreeSesion((array)$params);
                break;
            case 'trace':
                $datos = HisTrazaModel::getTracesArrayTreeTrace((array)$params);
                break;
            default :
                break;
        }
        echo json_encode($datos);
        return;
    }

    function cargarhijos1Action()
    {
        $params = json_decode($this->_request->getParam('params'));
        $paramstipo = $this->_request->getParam('tipo');     //1
        switch ($params->tipo) {
            case 'inicio': {
                $users = HisTraza::cargarusuario((array)$params);
                // print_r($users);die;
                if (count($users) > 0) {
                    foreach ($users as $user) {
                        $leaf = false;
                        $arreglo[] = $this->getarregloComun(
                            'usuario',
                            $user[usuario],
                            $user[usuario],
                            $leaf
                        );
                    }
                    echo json_encode($arreglo);
                } else {
                    echo("{'codMsg':6,'mensaje':'No existen usuarios
                     con estas especificaciones.','success':false}");
                }
            }
                break;
            case 'usuario': {
                $dateAutenticacion = HisTraza::getTrazaByUserandSesion(
                    (array)$params
                );
                if (count($dateAutenticacion) > 0) {
                    foreach ($dateAutenticacion as $auteticacion) {
                        if ($auteticacion['NomTipotraza']['idtipotraza'] == 8) {
                            $ifcantidadtraza = HisTraza::getIfChildParams(
                                (array)$params,
                                $auteticacion['idseccion']
                            );
                            if (count($ifcantidadtraza) > 0) {
                                $autenticacion = 'Sesion del ip:' . $auteticacion['ippc'];
                                $arreglo[] = $this->getarregloComun(
                                    'sesion',
                                    $autenticacion,
                                    $auteticacion['idseccion'],
                                    false,
                                    $auteticacion['fecha'],
                                    $auteticacion['hora']
                                );
                            }
                        } else {
                            $arreglo[] = $this->getarregloComun(
                                'trace',
                                $auteticacion['NomTipotraza']['tipotraza'],
                                $auteticacion['NomTipotraza']['tipotraza'],
                                true,
                                $auteticacion['fecha'],
                                $auteticacion['hora'],
                                $auteticacion['NomCategoriatraza']['denominacion'],
                                'traza'
                            );
                        }
                    }
                    echo json_encode($arreglo);
                } else {
                    echo("{'codMsg':6,'mensaje':'El usuario no tiene
                     sesiones registradas.','success':false}");
                }
            }
                break;
            case 'sesion': {
                $arregloTrazas = HisTraza::getTrazaByUserandSesion(
                    (array)$params
                );
                if (count($arregloTrazas) > 0) {
                    foreach ($arregloTrazas as $traza) {
                        $tieneHijos = $this->tieneHijosSecion(
                            $traza['idtraza']
                        );
                        $text = $traza['HisAccion']['accion'] == '' ? $traza['NomTipotraza']['tipotraza']
                            : $traza['HisAccion']['accion'];
                        if ($traza['NomTipotraza']['tipotraza'] == 'Acción') {
                            $descripcion = $traza['HisAccion']['descripcion'] == '' ? $traza['HisAccion']['accion']
                                : $traza['HisAccion']['descripcion'];
                            $memory = $traza['HisAccion']['memoria'];
                            $time = $traza['HisAccion']['tiempoejecucion'];
                        } else {
                            $descripcion = '';
                        }
                        $acciones[] = $this->getarregloComun(
                            'trace',
                            $text,
                            $traza['idtraza'],
                            $tieneHijos,
                            $traza['fecha'],
                            $traza['hora'],
                            $traza['NomCategoriatraza']['denominacion'],
                            'traza',
                            $traza['NomTipotraza']['tipotraza'],
                            $descripcion,
                            $memory,
                            $time
                        );
                    }
                    echo json_encode($acciones);
                } else {
                    $acciones = array();
                    echo json_encode($acciones);
                }
            }
                break;
            case 'trace': {
                $arregloTrazas = HisTraza::getTrazaByUserandSesion(
                    (array)$params
                );
                if (count($arregloTrazas) > 0) {
                    foreach ($arregloTrazas as $traza) {
                        $tieneHijos = $this->tieneHijosTrazas(
                            $traza['idtraza']
                        );
                        $text = $traza['HisAccion']['accion'] == '' ? $traza['NomTipotraza']['tipotraza']
                            : $traza['HisAccion']['accion'];
                        if ($traza['NomTipotraza']['tipotraza'] == 'Acción') {
                            $descripcion = $traza['HisAccion']['descripcion'] == '' ? $traza['HisAccion']['accion']
                                : $traza['HisAccion']['descripcion'];
                            $memory = $traza['HisAccion']['memoria'];
                            $time = $traza['HisAccion']['tiempoejecucion'];
                        } else {
                            $descripcion = '';
                        }
                        $acciones[] = $this->getarregloComun(
                            'trace',
                            $text,
                            $traza['idtraza'],
                            $tieneHijos,
                            $traza['fecha'],
                            $traza['hora'],
                            $traza['NomCategoriatraza']['denominacion'],
                            'traza',
                            $traza['NomTipotraza']['tipotraza'],
                            $descripcion,
                            $memory,
                            $time
                        );
                    }
                    echo json_encode($acciones);
                } else {
                    $acciones = array();
                    echo json_encode($acciones);
                }
            }
                break;
            default :
                ;
                break;
        }
    }

    function mostrarDetallesAction()
    {
        $params['tipo'] = $this->_request->getPost('tipotraza');
        $params['id'] = $this->_request->getPost('identidad');
        $respuesta = HisTraza::getDatosTraza($params);
        echo json_encode($respuesta);
        return;
    }

    function getarregloComun(
        $ptipo, $ptext, $pidseleccion, $pleaf, $fecha = '', $hora = '', $subsistema = '', $traza = '', $tipo = '',
        $descripcion = '', $memory = '', $time = ''
    )
    {
        $arreglo['tipotraza'] = $tipo;
        $arreglo['memoria'] = $memory;
        $arreglo['tiempoejecucion'] = $time;
        $arreglo['iconCls'] = $traza;
        $arreglo['tipo'] = $ptipo;
        $arreglo['text'] = $ptext;
        switch ($ptipo) {
            case 'usuario':
                $arreglo['identidad'] = $pidseleccion;
                break;
            case 'sesion':
                $arreglo['identidad'] = $pidseleccion;
                break;
            case 'trace':
                $arreglo['identidad'] = $pidseleccion;
                break;
            default :
                break;
        }
        $arreglo['leaf'] = $pleaf;
        $arreglo['uiProvider'] = 'col';
        $arreglo['fecha'] = $fecha;
        $arreglo['hora'] = $hora;
        $arreglo['subsistema'] = $subsistema;
        $arreglo['descripcion'] = $descripcion;

        return $arreglo;
    }

    function getHijos($idtraza, $arrayTrazas, $subsistema)
    {
        $resp = array();
        for ($i = 0; $i < count($arrayTrazas); $i++) {
            if ($idtraza == $arrayTrazas[$i][idtrazapadre]) {
                $tipo = $arrayTrazas[$i][idtipotraza];
                $leaf = $this->tieneHijosTrazas($arrayTrazas[$i][idtraza]);
                $atipo = HisTraza::getTipo($tipo);
                $resp[] = $this->getarregloComun(
                    'trace',
                    $atipo[0][tipo],
                    $arrayTrazas[$i][idtraza],
                    !$leaf,
                    $arrayTrazas[$i][fecha],
                    $arrayTrazas[$i][hora],
                    $subsistema,
                    $referencia
                );
            }
        }
        return $resp;
    }

    function tieneHijosSecion($idpadre)
    {
        $arrayTrazas = HisTraza::getHijosSecions($idpadre);
        if ($arrayTrazas[0]['hijossecions'] > 0) {
            return false;
        }
        return true;
    }

    function tieneHijosTrazas($idpadre)
    {
        $arrayTrazas = HisTraza::getHijosTraza($idpadre);
        if ($arrayTrazas[0]['hijostrazas'] > 0) {
            return false;
        }
        return true;
    }

    function confgridAction()
    {
        $result = array('grid' => array('columns' => array()));
        $idTraza = array(
            'id'        => 'idtraza',
            'hidden'    => true,
            'hideable'  => false,
            'dataIndex' => 'idtraza'
        );
        $result ['grid'] ['columns'] [] = $idTraza;
        $idEstComun = array(
            'hidden'    => true,
            'hideable'  => false,
            'dataIndex' => 'idestructuracomun'
        );
        $result ['grid'] ['columns'] [] = $idEstComun;
        $categ = array(
            'header'    => 'Categor&iacute;a',
            'width'     => 122,
            'sortable'  => true,
            'dataIndex' => 'categoria'
        );
        $result ['grid'] ['columns'] [] = $categ;
        $user = array(
            'header'    => 'Usuario',
            'width'     => 70,
            'sortable'  => true,
            'dataIndex' => 'usuario'
        );
        $result ['grid'] ['columns'] [] = $user;
        $fecha = array(
            'header'    => 'Fecha',
            'width'     => 70,
            'sortable'  => true,
            'dataIndex' => 'fecha'
        );
        $result ['grid'] ['columns'] [] = $fecha;
        $hora = array(
            'header'    => 'Hora',
            'width'     => 60,
            'sortable'  => true,
            'dataIndex' => 'hora'
        );
        $result ['grid'] ['columns'] [] = $hora;
        $tmp = new stdClass();
        $result ['grid'] ['campos'] [] = $tmp->name = 'idestructuracomun';
        $tmp = new stdClass();
        $result ['grid'] ['campos'] [] = $tmp->name = 'categoria';
        $tmp = new stdClass();
        $result ['grid'] ['campos'] [] = $tmp->name = 'usuario';
        $tmp = new stdClass();
        $result ['grid'] ['campos'] [] = $tmp->name = 'fecha';
        $tmp = new stdClass();
        $result ['grid'] ['campos'] [] = $tmp->name = 'hora';
        $tmp = new stdClass();
        $traza = $this->_request->getPost('tipo_traza');
        $traceconfig = ZendExt_FastResponse::getXML('traceconfig');
        $contenedores = $traceconfig->containers;
        foreach ($contenedores->children() as $contenedor) {
            if ($traza == (string)$contenedor ['alias']) {
                $atributos = $contenedor->atts;
                foreach ($atributos->children() as $column) {
                    $alias = (string)$column ['alias'];
                    $att = (string)$column ['att'];
                    $arrayT = array(
                        'header'    => $alias,
                        'width'     => 122,
                        'sortable'  => true,
                        'dataIndex' => $att,
                        'hidden'    => ($column ['hidden'] == 'true') ? true : false,
                        'renderer'  => ($traza == "Datos" && $column ['att'] == 'dato') ? 'htmlEncode' : false
                    );
                    $arr = $arrayT;
                    $result ['grid'] ['columns'] [] = $arr;
                    $tmp = new stdClass();
                    $tmp->name = (string)$column ['att'];
                    $result ['grid'] ['campos'] [] = $tmp;
                }
                break;
            }
        }
        echo(json_encode($result));
    }

    function confformAction()
    {
        $traza = $this->_request->getPost('tipo_traza');
        $traceconfig = ZendExt_FastResponse::getXML('traceconfig');
        $contenedores = $traceconfig->containers;
        $cantidad = 1;
        $idoperador = 0;
        $result = array(array('cantidad' => $cantidad));
        $result [] = array(
            'xtype'      => 'TextField',
            'fieldLabel' => 'Usuario',
            'id'         => 'idusuario',
            "maxLength"  => "50"
        );
        foreach ($contenedores->children() as $contenedor) {
            if ($traza == (string)$contenedor ['alias']) {
                $atributos = $contenedor->atts;
                foreach ($atributos->children() as $column) {
                    switch ((string)$column ['type']) {
                        case 'text' :
                            $xtype = 'TextField';
                            break;
                        case 'bool' :
                            $xtype = 'combo';
                            break;
                        case 'number' :
                            $xtype = 'NumberField';
                            break;
                        default :
                            $xtype = null;
                            break;
                    }
                    $longitudMax = (string)$column ['maxLength'];
                    $longitudMin = (string)$column ['minLength'];
                    if ($xtype) {
                        if ($xtype == 'NumberField') {
                            $idoperador++;
                            $arr = array(
                                'xtype'      => 'combo',
                                'fieldLabel' => 'Operador',
                                'id'         => 'idcomp' . (string)$column ['att'],
                                'data'       => self::cargarcombooperador()
                            );
                            $result [] = $arr;
                            $cantidad++;
                        }
                        $arr = array(
                            'xtype'      => $xtype,
                            'fieldLabel' => (string)$column ['alias'],
                            'id'         => 'id' . (string)$column ['att']
                        );
                        if ($longitudMax) {
                            $arr ['maxLength'] = $longitudMax;
                        }
                        if ($longitudMin) {
                            $arr ['minLength'] = $longitudMin;
                            $arr ['minLengthText'] = "prueba";
                        }
                        if ($xtype == 'combo') {
                            $method = 'cargarcombo' . ucfirst((string)$column ['att']);
                            $arr ['hiddenName'] = $arr ['id'];
                            $arr ['data'] = self::$method();
                        }
                        $result [] = $arr;
                        $cantidad++;
                    }
                }
                break;
            }
        }
        $result [0] ['cantidad'] = $cantidad;
        echo(json_encode($result));
    }

    function cargargridAction()
    {
        $offset = 0;
        $idcategoria = 0;
        $fechaDesde = 0;
        $fechaHasta = 0;
        if ($this->_request->getPost('idtipotraza')) {
            $idtipotraza = $this->_request->getPost('idtipotraza');
        }
        if ($this->_request->getPost('tipotraza')) {
            $tipotraza = $this->_request->getPost('tipotraza');
        }
        if ($this->_request->getPost('idcategoria')) {
            $idcategoria = $this->_request->getPost('idcategoria');
        }
        if ($this->_request->getPost('fecha_desde')) {
            $fechaDesde = $this->_request->getPost('fecha_desde');
        }
        if ($this->_request->getPost('fecha_hasta')) {
            $fechaHasta = $this->_request->getPost('fecha_hasta');
        }
        if ($this->_request->getPost('start')) {
            $offset = $this->_request->getPost('start');
        }
        if ($this->_request->getPost('limit')) {
            $limit = $this->_request->getPost('limit');
        }
        if ($this->_request->getPost('campos')) {
            $campos = json_decode(
                str_replace('\\', '', $this->_request->getPost('campos'))
            );
        }
        $className = self::clasenombre($tipotraza);
        $cantidad = self::cantidad(
            $className,
            $idtipotraza,
            $idcategoria,
            $fechaDesde,
            $fechaHasta,
            $campos
        );
        $trazas = self::cargardatos(
            $className,
            $idtipotraza,
            $idcategoria,
            $fechaDesde,
            $fechaHasta,
            $offset,
            $limit,
            $campos
        );
        echo(json_encode(
            array('cantidad_trazas' => $cantidad, 'trazas' => $trazas)
        ));
    }

    function cargarcombotipoAction()
    {
        $traceconfig = ZendExt_FastResponse::getXML('traceconfig');
        $contenedores = $traceconfig->containers;
        $tipo = array();
        $cont = 0;
        foreach ($contenedores->children() as $contenedor) {
            if ((int)$contenedor ['enabled'] == 1) {
                $tipo[$cont]['idtipotraza'] = (int)$contenedor ['id'];
                $tipo[$cont]['tipotraza'] = (string)$contenedor ['alias'];
                $cont++;
            }
        }
        if (count($tipo)) {
            echo(json_encode(array('tipo_traza' => $tipo)));
        } else {
            $r->codMsg = 1;
            $r->mensaje = "No existen trazas activas.";
            echo(json_encode($r));
        }
    }

    function cargarcombocategoriaAction()
    {
        $categoria = NomCategoriatraza::selectAllcategoria();
        echo(json_encode(array('categorias' => $categoria)));
    }

    function cargarcombosubsistemaAction()
    {
        $session = Zend_Registry::get('session');
        $certificate = $session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $systemsArray = $this->integrator->seguridad->ObtenerSistemas(
            $certificate,
            $idestructura
        );
        echo(json_encode(array('sistemas' => $systemsArray)));
    }

    function exportarxmlAction()
    {
        $temp = $this->_request->getParam('datos');
        $campos = json_decode(str_replace('\\', '', $temp));
        $temp = null;
        if ($campos) {
            $fileName = "Traza de " . $campos [0] . " (" . date('d-m-Y h-i-s') . ").xml";
            header('Content-Type: application/octet-stream');
            header('Content-Type: application/force-download');
            header("Content-Disposition: inline; filename=\"{$fileName}\"");
            header('Pragma: no-cache');
            header('Expires: 0');
            $xml
                = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n" . "<xml> \n" . "	<trazas tipo=\"$campos[0]\"> \n";
            echo $xml;
            $xml = null;
            $cont = 0;
            $trazas = self::cargardatos($campos [1]);
            if ($trazas) {
                foreach ($trazas as $traz) {
                    $cont++;
                    $xml = "		<traza_" . $cont . "> \n";
                    foreach ($traz as $name => $value) {
                        $xml .= "			<" . $name . ">" . $value . "</" . $name . "> \n";
                    }
                    $xml .= "		</traza_" . $cont . "> \n";
                    echo $xml;
                }
            }
            $xml = "	</trazas> \n" . "</xml>";
            echo $xml;
        }
    }

    function cargarReporteAction()
    {
        $dirGrafic = Zend_Registry::getInstance()->config;
        $config = new Zend_Config_Ini(
            $dirGrafic->dirGraficos . 'reportes.ini'
        );
        $arrayResult = array();
        $keys = 0;
        foreach ($config as $value) {
            foreach ($value as $key => $attributes) {
                $arrayResult[$keys][$key] = $attributes;
            }
            $keys++;
        }
        echo json_encode($arrayResult);
    }

    private static function cargardatos($idtraza)
    {
        return $datos = HisTraza::cargardatostraza($idtraza);
    }

    private static function cantidad($className, $idtipotraza, $idcategoria, $fechaDesde, $fechaHasta, $campos)
    {
        if (!$idtipotraza) {
            $idtipotraza = 0;
        }
        if (!$idcategoria) {
            $idcategoria = 0;
        }
        if (!$fechaDesde) {
            $fechaDesde = 0;
        }
        if (!$fechaHasta) {
            $fechaHasta = 0;
        }
        if (!$campos) {
            $campos = new stdClass();
        }
        $global = ZendExt_GlobalConcept::getInstance();
        if ($global->Estructura->idestructura) {
            $idestructura = $global->Estructura->idestructura;
        } else {
            $idestructura = 0;
        }
        $clase = new $className();
        $cantidad = $clase->cantidad(
            $idestructura,
            $idtipotraza,
            $idcategoria,
            $fechaDesde,
            $fechaHasta,
            $campos
        );
        $clase = null;
        $campos = null;
        if ($cantidad [0] ['cantidad']) {
            return $cantidad [0] ['cantidad'];
        }

        return 0;
    }

    private static function cargarcombooperador()
    {
        $result [0] = array('>', '>');
        $result [1] = array('>=', '>=');
        $result [2] = array('=', '=');
        $result [3] = array('<=', '<=');
        $result [4] = array('<', '<');
        return $result;
    }

    private static function clasenombre($tipotraza)
    {
        $className = "";
        $traceconfig = ZendExt_FastResponse::getXML('traceconfig');
        $contenedores = $traceconfig->containers;
        foreach ($contenedores->children() as $contenedor) {
            if ($tipotraza == (string)$contenedor ['alias']) {
                $className = (string)$contenedor ['doctrine'];
                break;
            }
        }
        return $className;
    }

    private static function cargarcomboFalla()
    {
        $result [0] = array(0, 0);
        $result [1] = array(1, 1);
        $result [2] = array("Todas", 2);
        return $result;
    }

    private function cargarcomboInterno()
    {
        $result [0] = array(0, 0);
        $result [1] = array(1, 1);
        $result [2] = array("Todas", 2);
        return $result;
    }

    private function cargarcomboIdoperacion()
    {
        $datos = NomOperacion::getOperationsArray();
        $arrayResult = array();
        foreach ($datos as $values) {
            $arrayResult[] = array(
                $values['denominacion'],
                $values['idoperacion']
            );
        }
        return $arrayResult;
    }

    function listarTrazasAction()
    {
//        $params = json_decode($this->_request->getParam('params'));
//        $params->start = $this->_request->getParam('start');
//        $params->limit = $this->_request->getParam('limit');
        $params =  $this->_request->getParams();
        if(isset($params['usuarios']))
            $params['usuarios'] = explode(",", $params['usuarios']);
        if(isset($params['idtipotrazas']))
            $params['idtipotrazas'] = explode(",", $params['idtipotrazas']);
        $trazas = HisTrazaModel::findTraces((array)$params);
        $cantidad = HisTrazaModel::findCountTraces((array)$params);
        echo json_encode(array('cantidad' => $cantidad, 'datos' => $trazas));
        return;
    }

    function usuariosConTrazasAction()
    {
        $params = json_decode($this->_request->getParam('params'));
        $usuarios = HisTrazaModel::getUsersWithTraces((array)$params);
        echo json_encode(
            array('cantidad' => count($usuarios), 'datos' => $usuarios)
        );
        return;
    }

    function ipsConTrazasAction()
    {
        $params = json_decode($this->_request->getParam('params'));
        $ips = HisTrazaModel::getIpsWithTraces((array)$params);
        echo json_encode(array('cantidad' => count($ips), 'datos' => $ips));
        return;
    }

    function sistemasConTrazasAction()
    {
        $params = json_decode($this->_request->getParam('params'));
        $sistemas = HisTrazaModel::getSistemsWithTraces((array)$params);
        echo json_encode(array('datos' => $sistemas));
        return;
    }

}



