<?php

class BuscarpersonacompController extends ZendExt_Controller_Secure
{

    private $persona;

    function init()
    {
        $this->persona = new DatPersonaModel();
        parent::init();
    }

    function buscarpersonacompAction()
    {

        $this->render();
    }

    function cargarpersonaAction()
    {
        $inicio = $this->_request->getPost('start');
        $limite = $this->_request->getPost('limit');
        $persona = $this->_request->getPost('persona');
        $tipobusqueda = $this->_request->getPost('tipobusqueda');
        $texto = $this->_request->getPost('texto');
        $seguridad = $this->_request->getPost('seguridad');
        $modulo = $this->_request->getPost('modulo');
        $funcionalidad = $this->_request->getPost('funcionalidad');
        $identidad = $this->_request->getPost('identidad');
        $campocolores = $this->_request->getPost('campocolores');
        $cliente = $this->_request->getPost('cliente');
        $cargoprincipal = $this->_request->getPost('cargoprincipal');
        $categoriapersonabuscar = $this->_request->getPost('categoriapersonabuscar');
        $arrayidplantillas = Zend_Json::decode(stripslashes($this->_request->getPost('arrayidplantillas')));
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_request->getPost('idelaborarpagos')));
        $activo = $this->_request->getPost('activo');

        if (!$modulo)
            $modulo = 'PERSONA';
        if (!$funcionalidad)
            $funcionalidad = 'COMPONENTE';

        $datosestrutura = $this->integrator->metadatos->DameEstructura($identidad);
        $tipoestructura = $datosestrutura[0]->idtipo;
        $arrcargossubordinados = array();
        $arrcargos = array();
        //if($tipoestructura != 3){
        $arrcargossubordinados = $this->integrator->metadatos->obtenerCargosEstructura($identidad, true);
        foreach ($arrcargossubordinados as $rcargos) {
            $arrcargos[] = $rcargos['idcargo'];
        }
        //}

        if ($tipobusqueda == 1) {

            $this->buscador($inicio, $limite, $texto, $seguridad, $modulo, $funcionalidad, $identidad, $campocolores, $cliente, $tipoestructura, $arrcargos, $idelaborarpagos, $cargoprincipal, $activo);
        } else {

            $persona = stripslashes($persona);
            $persona = json_decode($persona);
            $this->buscarpersonabyparametro($persona, $limite, $inicio, $seguridad, $modulo, $funcionalidad, $identidad, $campocolores, $arrayidplantillas, $categoriapersonabuscar, $cliente, $tipoestructura, $arrcargos, $idelaborarpagos, $cargoprincipal, $texto);
        }
    }

    function cargarcombosexoAction()
    {
        // $model = new NomSexo();
        // $nomencladorsexo = $model->GetTodos();
        // if (is_array($nomencladorsexo)) {
        $nomencladorsexo = array('cant' => count($nomencladorsexo), 'datos' => $nomencladorsexo);
        echo(json_encode($nomencladorsexo));
        //  }
    }

    function cargarcombotiponoidentidadAction()
    {
        //$objNomTnoID = new NomTipodocidentidad();
        //  $nomencladorTNoID = $objNomTnoID->GetTodos();
        //  if (is_array($nomencladorTNoID)) {
        $nomenclador = array('cant' => count($nomencladorTNoID), 'datos' => $nomencladorTNoID);
        echo(json_encode($nomenclador));
        //  }
    }

    function cargarcombocategoriaAction()
    {
        $objcategoria = new NomCategoriaPersona();
        $nomencladorCat = $objcategoria->GetTodos();
        if (is_array($nomencladorCat)) {
            $nomenclador = array('cant' => count($nomencladorCat), 'datos' => $nomencladorCat);
            echo(json_encode($nomenclador));
        }
    }

    function guardarfotoAction()
    {
        $fp = fopen($_FILES["nombrefoto"]["tmp_name"], "rb");
        $contents = file_get_contents($_FILES["nombrefoto"]["tmp_name"]);
        $_SESSION["foto"] = $contents;
        fclose($fp);

        $nomTemp = $_FILES['nombrefoto']['tmp_name'];
        $arrNomTemp = explode('\\', $nomTemp);
        $nomImg = explode('.', $arrNomTemp[1]);

        $ext = $this->_request->getPost('extension');
        $dirfoto = "../../../persona/personaimgstemp/";
        $dir = "personaimgstemp/";

        $ffp = fopen("{$dir}" . "{$nomImg[0]}" . "{$ext}", "wb");
        fclose($ffp);
        file_put_contents("{$dir}" . "{$nomImg[0]}" . "{$ext}", $_SESSION["foto"]);

        $afoto = array();
        $afoto['success'] = true;
        $afoto['codigo'] = 1;
        $afoto['dirfoto'] = "{$dirfoto}" . "{$nomImg[0]}" . "{$ext}";
        $afoto['nombrefoto'] = "{$nomImg[0]}" . "{$ext}";
        echo json_encode($afoto);
        die;
    }

    function SincronizarImgBDconFicheroServer($idpersona, $idfoto)
    {
        $host = Zend_Registry::get('config')->bd->persona->host;
        $user = Zend_Registry::get('config')->bd->persona->usuario;
        $pass = Zend_Registry::get('config')->bd->persona->password;
        $dbna = Zend_Registry::get('config')->bd->persona->bd;
        $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
        $consulta = pg_query($link, "select idfoto, foto, extension from mod_persona.dat_foto where idfoto={$idfoto} and hasta is null");
        $arrayVal = array();
        while ($row = pg_fetch_assoc($consulta))
            $arrayVal[] = $row;

        $ext = $arrayVal[0]['extension'];
        $ffp = fopen("personaimgs/" . "{$idpersona}" . "{$ext}", "wb");
        fclose($ffp);
        $imagen = pg_unescape_bytea($arrayVal[0]['foto']);
        file_put_contents("personaimgs/" . "{$idpersona}" . "{$ext}", $imagen);
    }

    function guardarIDAction()
    {
        if ($this->_request->getPost('idpbusq')) {
            $_SESSION['pbusq']["idpbusq"] = $this->_request->getPost('idpbusq');
            if ($this->_request->getPost('nombusq'))
                $_SESSION['pbusq']["nombusq"] = $this->_request->getPost('nombusq');
            if ($this->_request->getPost('snombusq'))
                $_SESSION['pbusq']["snombusq"] = $this->_request->getPost('snombusq');
            if ($this->_request->getPost('papelbusq'))
                $_SESSION['pbusq']["papelbusq"] = $this->_request->getPost('papelbusq');
            if ($this->_request->getPost('sapelbusq'))
                $_SESSION['pbusq']["sapelbusq"] = $this->_request->getPost('sapelbusq');
            if ($this->_request->getPost('idsex'))
                $_SESSION['pbusq']["idsexo"] = $this->_request->getPost('idsex');
            if ($this->_request->getPost('numidbusq'))
                $_SESSION['pbusq']["numidbusq"] = $this->_request->getPost('numidbusq');
            echo 1;
        } else
            echo('{"codMsg":3,"mensaje": "Error al seleccionar la persona"}');
    }

    function insertarfoto($idpers, $nombretemp, $extension, $modo, $idfoto)
    {
        try {//echo ($idpers."   ".$nombretemp."    ".$extension."    ".$modo."    ".$idfoto); die;
            $dir = "personaimgstemp/";
            $diroriginal = "personaimgs/";
            $contents = file_get_contents($dir . $nombretemp);


            $foto = pg_escape_bytea($contents);
            $host = Zend_Registry::get('config')->bd->persona->host;
            $user = Zend_Registry::get('config')->bd->persona->usuario;
            $pass = Zend_Registry::get('config')->bd->persona->password;
            $dbna = Zend_Registry::get('config')->bd->persona->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
            $sql = "";
            if ($modo == 'ADD') {
                $sql = "insert INTO mod_persona.dat_foto (idpersona, foto, extension, desde) values ({$idpers}, '{$foto}', '{$extension}', now())";
            } else {
                if ($idfoto != -1) {
                    $sqlb = "select extension from mod_persona.dat_foto where idfoto ={$idfoto} and hasta is null";
                    $sql = "update mod_persona.dat_foto set foto='{$foto}', extension='{$extension}', desde=now() where idfoto ={$idfoto} and hasta is null";
                    $queryb = pg_query($link, $sqlb);
                    while ($row = pg_fetch_assoc($queryb))
                        $arrayVal[] = $row;
                    $ext = $arrayVal[0]['extension'];
                    unlink($diroriginal . "{$idpers}" . "{$ext}");
                } else
                    $sql = "insert INTO mod_persona.dat_foto (idpersona, foto, extension, desde) values ({$idpers}, '{$foto}', '{$extension}', now())";
            }

            $query = pg_query($link, $sql);
            //print_r($query);die('asasasas');
            $ffp = fopen($diroriginal . "{$idpers}" . "{$extension}", "wb");
            fclose($ffp);
            file_put_contents($diroriginal . "{$idpers}" . "{$extension}", $contents);

            //unlink($dir.$nombretemp);

            $datp = new DatPersona();
            $idfotopersona = $datp->getIdFoto($idpers);
            //print_r($idfotopersona[0]['idfoto']);die('asasasas');
            return ($idfotopersona[0]['idfoto']) ? $idfotopersona[0]['idfoto'] : -1;
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception('COST001', $ex);
        }
    }

    function dameimgAction()
    {
        $imag = $_SESSION["foto"];
        header("Content-type: image/jpeg");
        echo $imag;
    }

    function modificfoto()
    {
        if (isset($_SESSION['foto']) && isset($_SESSION['idpers'])) {
            $foto = pg_escape_bytea($_SESSION['foto']);
            $host = Zend_Registry::get('config')->bd->persona->host;
            $user = Zend_Registry::get('config')->bd->persona->usuario;
            $pass = Zend_Registry::get('config')->bd->persona->password;
            $dbna = Zend_Registry::get('config')->bd->persona->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
            if ($this->persona->buscarFotoPersona($_SESSION['idpers']) == 0) {
                $sql = "insert INTO mod_persona.dat_foto (foto,idpersona) values ('{$foto}',{$_SESSION['idpers']})";
                $query = pg_query($link, $sql);
            } else {
                $sql = "update mod_persona.dat_foto set foto = '{$foto}' where idpersona = '{$_SESSION['idpers']}'";
                $query = pg_query($link, $sql);
            }
        }
        unset($_SESSION['foto'], $_SESSION['idpers']);
    }

    function dameimgpersAction()
    {
        $idpers = $this->_request->getPost('idpers');
        $imag = $this->persona->buscarFotoPersona($idpers);
        if ($imag) {
            $_SESSION["foto"] = pg_unescape_bytea($imag);
            echo 1;
        } else {
            echo 0;
        }
    }

    function verificarcarnet()
    {
        $id = $this->_request->getPost('numid');
        $nombre = $this->_request->getPost('nombre');
        $snombre = $this->_request->getPost('snombre');
        $papell = $this->_request->getPost('papel');
        $sapell = $this->_request->getPost('sapel');
        $model = new DatPersona();
        $v = $model->ExisteCI($id, $nombre, $snombre, $papell, $sapell);
        //print_r($v);die('aquiiii');
        if ($v)
            return 1;
        else
            return 0;
    }

    public function imprimirAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $datosestructura = $this->integrator->metadatos->DameEstructura($idestructura);
        $codigo = $datosestructura[0]->codigo;
        echo json_encode(array('codigo' => $codigo));
    }

    function obtenerformatoAction()
    {
        $direccion = 'Location: http://' . $_SERVER['HTTP_HOST'] . '/' . 'report_generator.php/api/getFormats';
        echo header($direccion);
    }

    function buscador($inicio, $limite, $texto, $seguridad, $modulo, $funcionalidad, $identidad, $campocolores, $cliente = null, $tipoestructura, $arrcargos, $idelaborarpagos, $cargoprincipal, $activo = null)
    {

        $objperB = new DatPersona();
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $iddominio = $this->global->Perfil->iddominio;
        $permiso = -1;
        $r = array();
        $c = 0;
        $arraycategorias = new stdClass();

        if ($cliente == 'MINFAR') {

            $arraycategorias->cliente = $cliente;
            $arraycategorias->arraycategorias = $objperB->buscarCategoriasPermisoUsuario($this->global->Perfil->idpersona);
        }

        switch ($modulo) {

            case 'PERSONA' : {

                switch ($funcionalidad) {
                    case 'TODAS': {
                        // print_r('hola');die;
                        $r = $objperB->BuscadorTodasPersonasSistema($inicio, $limite, $texto);
                        $c = $objperB->countBuscadorTodasPersonasSistema($texto);
                        break;

                    }
                    case 'COMPONENTE': {

                        $r = $objperB->Buscador($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $arraycategorias);
                        $c = $objperB->countBuscador($texto, $identidad, $iddominio, $permiso, $arraycategorias);
                        break;
                    }
                    case 'VIALIDAD': {
                        // print_r('hola');die;
                        $r = $objperB->BuscadorPersonaVialidad($inicio, $limite, $texto, $identidad);
                        $c = $objperB->countBuscadorPersonaVialidad($texto, $identidad);
                        break;
                    }
                    default: {

                        // print_r('hola');die;
                        $r = $objperB->Buscador($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $arraycategorias);
                        $c = $objperB->countBuscador($texto, $identidad, $iddominio, $permiso, $arraycategorias);
                    }
                }
                break;
            }

            case 'NOMINA' : {
                switch ($funcionalidad) {
                    case 'CESP': {
                        $r = $objperB->BuscarPersonaNominaPorEntidadTexto($texto, $inicio, $limite, $identidad, $arraycategorias, null, $cargoprincipal);
                        foreach ($r as $i => $persona) {
                            if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                $longorden = strlen($ordenplantilla . '');
                                $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                            } else {
                                $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                            }
                        }
                        $c = $objperB->CantidadBuscarPersonaNominaPorEntidadTexto($texto, $identidad, $arraycategorias, null, null, $cargoprincipal);
                        break;
                    }
                    case 'REGSALTIEMPSERV': {
                        //Si el SNC se va a comportar como en el Sigerh
                        $sql = "select sncsigerh from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $sncsigerh = $conn->fetchOne($sql);
                        if($sncsigerh == 1){
                            $datosestr = $this->integrator->metadatos->DameEstructura($identidad);
                            $denomentidad = $datosestr[0]->text;
                            $r = $objperB->BuscarPersonaRegistroSalarioTiempoServicioSIGERH($texto, $limite, $inicio, $identidad);
                            $rareas = array();
                            foreach ($r as $i => $persona) {
                                $rareas[] = $persona['denominacion'];
                                $cont++;
                            }
                            $rareas = array_values(array_unique($rareas));
                            $orden = 1;
                            foreach($rareas as $area){
                                foreach ($r as $i => $persona) {
                                    if($area == $persona['denominacion']){
                                        $r[$i]['plantilla'] = "a".$orden."-".$denomentidad."/".$persona['denominacion'];

                                    }
                                }
                                $orden++;
                            }
                            $c = $objperB->CantidadPersonaTextoRegistroSalarioTiempoServicioSIGERH($texto, $limite, $inicio, $identidad);
                        //Distra
                        }else{
                            $r = $objperB->BuscarPersonaNominaPorEntidadTextoRegistroSalarioTiempoServicio($texto, $inicio, $limite, $identidad, $arraycategorias, null, $cargoprincipal);
                            foreach ($r as $i => $persona) {
                                if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                    list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                    $longorden = strlen($ordenplantilla . '');
                                    $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                                } else {
                                    $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                                }
                            }
                            $c = $objperB->CantidadBuscarPersonaNominaPorEntidadTextoRegistroSalarioTiempoServicio($texto, $identidad, $arraycategorias, null, null, $cargoprincipal);
                        }
                        break;
                    }
		            case 'COMPART': {
                        $r = $objperB->BuscarPersonaNominaPorEntidadTextoCompartimentacion($texto, $inicio, $limite, $identidad, $arraycategorias, null,$cargoprincipal, $tipobusqueda);
                        $c = $objperB->CantidadBuscarPersonaNominaPorEntidadTextoCompartimentacion($texto, $identidad, $arraycategorias, null, null,$cargoprincipal, $tipobusqueda);
                        break;
                    }
                    case 'CESPHIST': {
                        $r = $objperB->BuscarPersonaNominaPorEntidadTextoHist($texto, $inicio, $limite, $identidad, $arraycategorias);                       
                        foreach ($r as $i => $persona) {
                            $idpersona = $persona['idpersona'];
                            $sqlplantillas = "select DISTINCT (CASE WHEN cpn.denominacion <> '' THEN cpn.orden || '-' || cpn.denominacion ELSE 'Sin plantilla nominal' END) as area
                                from mod_persona.dat_persona dp
                                left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona)
                                inner join mod_nomina.his_personabaja hpb on (hpb.idpersona = dp.idpersona)
                                inner join mod_nomina.his_vacacionespersonabaja hvpb on (hvpb.idpersonabaja = hpb.idpersonabaja)
                                left join mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = hpb.idplantillanominal)
                                where hpb.idpersona = $idpersona";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $datosplantillas = $conn->fetchOne($sqlplantillas);

                            $persona['plantilla'] = $datosplantillas;
                            if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                $longorden = strlen($ordenplantilla . '');
                                $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                            } else {
                                $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                            }
                        }
                        $c = $objperB->CantidadBuscarPersonaNominaPorEntidadTextoHist($texto, $identidad, $arraycategorias);
                        break;
                    }
                    case 'RG': {//funcionalidad reitegros
                        $r = $objperB->BuscarPersonaNomina($texto, $inicio, $limite, $identidad, $arraycategorias, $tipobusqueda);
                        $c = $objperB->CantidadBuscarPersonaNomina($texto, $identidad, $arraycategorias, $tipobusqueda);
                        break;
                    }
                    case 'GCO': {
                        $r = $objperB->BuscadorNomina($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $campocolores, $arraycategorias, null, $tipoestructura, $arrcargos, $tipobusqueda, $activo);
                        foreach ($r as $i => $persona) {
                            if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                $longorden = strlen($ordenplantilla . '');
                                $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                            } else {
                                $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                            }
                        }
                        //print_r($r);die;
                        // $c = $objperB->countBuscadorNomina($texto, $identidad, $iddominio, $permiso, $arraycategorias, null, $tipoestructura, $arrcargos, $tipobusqueda);
                        $c = count($r);
                        break;
                    }
                    case 'CERTANT': {
                        $r = $objperB->BuscadorPersonasCargoDerechoIncremento($texto, $inicio, $limite, $identidad, $arraycategorias, $tipobusqueda);
                        foreach ($r as $i => $persona) {
                            if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                $longorden = strlen($ordenplantilla . '');
                                $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                            } else {
                                $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                            }
                        }
                        $c = $objperB->countBuscadorPersonasCargoDerechoIncremento($texto, $identidad, $arraycategorias, $tipobusqueda);
                        break;
                    }
                    case 'ACB': {
                        //Buscando el nomsubordinacion de la entidad padre
                        $sqlSubordinacionEstructura = "SELECT idnomsubordinacion
                        FROM mod_estructuracomp.dat_subordinacion WHERE idpadre = ? and idhijo = ?;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $rsubordinacion = $conn->fetchOne($sqlSubordinacionEstructura, array($identidad, $identidad));
                        //Buscando las subordinaciones
                        $datossubordinacion = ($rsubordinacion) ? $this->integrator->metadatos->getHijosSubordinacion($identidad, $rsubordinacion) : array();

                        if (count($datossubordinacion) > 0) {
                            foreach ($datossubordinacion as $restruct) {
                                $arrayentidades[] = $restruct->idestructura;
                            }
                            array_push($arrayentidades, $identidad);
                        }

                        if (!empty($arrayentidades)) {
                            $idestructura =  $arrayentidades;
                        } else {
                            $id = (!empty($identidad) && $identidad != -1) ? $identidad : $idestructura;
                            $arrayentidades[] = $id;
                            $idestructura =  $arrayentidades;
                        }                      
                       
                        $r = $objperB->BuscadorPersonasCuentasBancarias($texto, $inicio, $limite, $idestructura);
                        $c = $objperB->countBuscadorPersonasCuentasBancarias($texto, $idestructura);
                        break;
                    }
                    case 'TALON': {
                        $r = $objperB->BuscadorPersonasTalonPago($texto, $inicio, $limite, $identidad, $idelaborarpagos);
                        $c = $objperB->countBuscadorPersonasTalonPago($texto, $identidad, $idelaborarpagos);
                        break;
                    }
                    default: {
                        $r = $objperB->Buscador($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $arraycategorias);
                        $c = $objperB->countBuscador($texto, $identidad, $iddominio, $permiso, $arraycategorias);
                    }
                }
                break;
            }

        }
        echo(json_encode(array('cant' => $c, 'datos' => $r)));
    }

    //buscar persona por parametro
    function buscarpersonabyparametro($persona, $limite, $inicio, $seguridad, $modulo, $funcionalidad, $identidad, $campocolores, $arrayidplantillas, $categoriapersonabuscar, $cliente, $tipoestructura, $arrcargos, $idelaborarpagos, $cargoprincipal, $texto)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $tipobusqueda = 2;
        $iddominio = $this->global->Perfil->iddominio;
        //$objPermisos = new SegPersonapermisos();
        //$arrPermisos = $objPermisos->GetSeguridadXPersona($idusuario);
        $permiso = -1;
        /*if (count($arrPermisos) > 0)
            $permiso = $arrPermisos[0]['permiso'];
        else
            $permiso = 2;        
       if($seguridad == 1) {
            $permiso = 3;
        }*/
        $objperB = new DatPersona();
        $r = array();
        $c = 0;
        $arraycategorias = new stdClass();
        if ($cliente == 'MINFAR') {
            $arraycategorias->cliente = $cliente;
            //$arraycategorias->arraycategorias = $objperB->buscarCategoriasPermisoUsuario($this->global->Perfil->idpersona);
            $arraycategorias->arraycategorias = array($categoriapersonabuscar);			
        }
        switch ($modulo) {
            case 'PERSONA' : {
                switch ($funcionalidad) {
                    case 'COMPONENTE': {
                        $r = $objperB->BuscarPersonaPorParam($persona, $limite, $inicio, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);
                        $c = $objperB->countBuscarPersonaPorParam($persona, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);
                        break;
                    }
                    default: {
                        $r = $objperB->BuscarPersonaPorParam($persona, $limite, $inicio, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);
                        $c = $objperB->countBuscarPersonaPorParam($persona, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);
                    }
                }
                break;
            }

            case 'NOMINA' : {
                switch ($funcionalidad) {
                    case 'CESP': {
                        
                        
                        $r = $objperB->BuscarPersonaNominaPorEntidadParams($persona, $inicio, $limite, $identidad, $arraycategorias);                    
                        $c = $objperB->CantidadBuscarPersonaNominaPorEntidadParams($persona, $identidad, $arraycategorias);
                        break;
                    }

                    case 'COMPART': {
                        $r = $objperB->BuscarPersonaNominaPorEntidadTextoCompartimentacion($persona, $inicio, $limite, $identidad, $arraycategorias, $arrayidplantillas,$cargoprincipal, $tipobusqueda);
                        $c = $objperB->CantidadBuscarPersonaNominaPorEntidadTextoCompartimentacion($persona, $identidad, $arraycategorias, $arrayidplantillas, null,$cargoprincipal, $tipobusqueda);
                        break;
                    }

                    case 'RG': {//funcionalidad reitegros
                        $r = $objperB->BuscarPersonaNomina($persona, $inicio, $limite, $identidad, $arraycategorias, $arrayidplantillas, $tipobusqueda);
                        $c = $objperB->CantidadBuscarPersonaNomina($persona, $identidad, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $tipobusqueda);
                        break;
                    }
                    case 'GCO': {

                        $r = $objperB->BuscadorNomina($inicio, $limite, $persona, $identidad, $iddominio, $permiso, $campocolores, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $arrcargos, $tipobusqueda);
                        $c = $objperB->countBuscadorNomina($persona, $identidad, $iddominio, $permiso, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $arrcargos, $tipobusqueda);
                        /*$r = $objperB->BuscadorNomina($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $campocolores, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $arrcargos);
                        $c = $objperB->countBuscadorNomina($texto, $identidad, $iddominio, $permiso, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $arrcargos); */

                       /* $r = $objperB->BuscarPersonaPorParamNomina($persona, $limite, $inicio, $idestructura, null, null, null, $campocolores);
                        foreach ($r as $i => $persona) {
                            if ($persona['plantilla'] != 'Sin plantilla nominal') {
                                list($ordenplantilla,) = explode('-', $persona['plantilla']);
                                $longorden = strlen($ordenplantilla . '');
                                $r[$i]['plantilla'] = chr(96 + $longorden) . $persona['plantilla'];//chr(96) caracter antes de letra "a"
                            } else {
                                $r[$i]['plantilla'] = 'z-' . $persona['plantilla'];
                            }
                        }
                        //print_r($r);die;
                        $c = $objperB->countBuscarPersonaPorParamNomina($persona, $idestructura, null, null, null);*/
                        break;
                    }
                    case 'CERTANT': {
                        $r = $objperB->BuscadorPersonasCargoDerechoIncremento($persona, $inicio, $limite, $identidad, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $tipobusqueda);
                        $c = $objperB->countBuscadorPersonasCargoDerechoIncremento($persona, $identidad, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar, $tipobusqueda);
                        break;
                    }
                    case 'TALON': {
                        $r = $objperB->BuscadorPersonasTalonPago($persona, $inicio, $limite, $identidad, $idelaborarpagos, $tipobusqueda);
                        $c = $objperB->countBuscadorPersonasTalonPago($persona, $identidad, $idelaborarpagos, $tipobusqueda);
                        break;
                        
                    }
                    default: {//print_r('dss');die;
                        $r = $objperB->Buscador($inicio, $limite, $texto, $identidad, $iddominio, $permiso, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar);
                        $c = $objperB->countBuscador($texto, $identidad, $iddominio, $permiso, $arraycategorias, $arrayidplantillas, $categoriapersonabuscar);
                    }
                }
                break;
            }
        }

        echo(json_encode(array('cant' => $c, 'datos' => $r)));
    }

    public function cargarplantillasnominalesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $arrayplantillas = array();
        $cont = 0;
        //Plantillas nominales
        $sqlplantillas = "SELECT pn.idplantillanominal, pn.denominacion FROM mod_nomina.conf_plantillanominal pn
			               WHERE pn.identidad = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datosplantillas = $conn->fetchAll($sqlplantillas, array($idestructura));
        foreach ($datosplantillas as $i => $value) {
            //Hijos
            $arrayplantillas[$cont]['id'] = $value['idplantillanominal'];
            $arrayplantillas[$cont]['text'] = $value['denominacion'];
            $arrayplantillas[$cont]['leaf'] = true;
            $arrayplantillas[$cont]['checked'] = false;
            $cont++;
        }
        echo json_encode($arrayplantillas);
    }

}

?>
