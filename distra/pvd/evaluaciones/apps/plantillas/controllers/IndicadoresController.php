<?php

class IndicadoresController extends ZendExt_Controller_Secure {

    private $objIndicadorImgModel;

    function init() {
        $this->objIndicadorImgModel = new NomEvalindicadorimagenModel();
        parent::init();
    }

    function indicadoresAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todosindicadorestextoAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $denominacion = $this->_request->getPost('denomIndicadorT');
        //$recurso = $this->_request->getPost ( 'recurso' );
        $objIndicadorT = new NomEvalindicadortexto();
        if ($denominacion != '') {
            $r['datos'] = $objIndicadorT->ObtenerIndicadorTBuscado($denominacion, $limit, $start);
            $r['cantidad'] = $objIndicadorT->ObtenerCantidadIndicadorTBuscado($denominacion);
        } else {
            $r['datos'] = $objIndicadorT->GetPorLimite($limit, $start);
            $r['cantidad'] = $objIndicadorT->GetCantTotal();
        }
        echo (json_encode($r));
    }

    function todosindicadoresimagenAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objIndicadorI = new NomEvalindicadorimagen();
        $r['datos'] = $objIndicadorI->GetPorLimite($limit, $start);
        $r['cantidad'] = $objIndicadorI->GetCantTotal();

        echo (json_encode($r));
    }

    function adicionarindicadortextoAction() {
        $objIndicadorT = new NomEvalindicadortexto();
        $objIndicadorT->codigo = $this->_request->getPost('cod');
        $objIndicadorT->denom = $this->_request->getPost('denom');
        $objIndicadorT->descripcion = $this->_request->getPost('descrip');
        $objIndicadorT->fechainicio = $this->_request->getPost('fi');

        if ($this->_request->getPost('ff') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('ff');
        $objIndicadorT->fechafin = $ff;
        $objIndicadorT->iddominioevaluativo = $this->_request->getPost('iddominio');

        $objIndicadorTModel = new NomEvalindicadortextoModel();
        $objIndicadorTModel->Insertar($objIndicadorT);
        $r->success = true;
        echo (json_encode($r));
    }

    function modificarindicadortextoAction() {
        $idindicadortexto = $this->_request->getPost('idindicadortexto');
        $objIndicadorT = Doctrine::getTable('NomEvalindicadortexto')->find($idindicadortexto);
        $codigo = $this->_request->getPost('cod');
        $objIndicadorT->denom = $this->_request->getPost('denom');
        $objIndicadorT->descripcion = $this->_request->getPost('descrip');
        $objIndicadorT->fechainicio = $this->_request->getPost('fi');
        if ($this->_request->getPost('ff') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('ff');
        $objIndicadorT->fechafin = $ff;
        $objIndicadorT->iddominioevaluativo = $this->_request->getPost('iddominio');

        if ($objIndicadorT->codigo != $codigo) {
            if (!$this->verificarcodigo($this->_request->getPost('cod'), true)) {
                $objIndicadorT->codigo = $this->_request->getPost('cod');
                $objIndicadorTModel = new NomEvalindicadortextoModel();
                $objIndicadorTModel->Actualizar($objIndicadorT);
                $r->success = true;
            } else {
                throw new ZendExt_Exception('CHE045');
            }
        } else {
            $objIndicadorT->codigo = $this->_request->getPost('cod');
            $objIndicadorTModel = new NomEvalindicadortextoModel();
            $objIndicadorTModel->Actualizar($objIndicadorT);
            $r->success = true;
        }


        echo (json_encode($r));
    }

    function verificarcodigo($codigo, $texto) {
        if ($texto) {
            $objIndicadorT = NomEvalindicadortexto::contarcodigo($codigo);
            if ($objIndicadorT)
                return 1;
            else
                return 0;
        }
        else {
            $objIndicadorI = NomEvalindicadorimagen::contarcodigo($codigo);
            if ($objIndicadorI)
                return 1;
            else
                return 0;
        }
    }

    function eliminarindicadortextoAction() {
        try{
            $idindicadortexto = $this->_request->getPost('idindicadortexto');
            $objIndicadorT = Doctrine::getTable('NomEvalindicadortexto')->find($idindicadortexto);
            $objIndicadorTModel = new NomEvalindicadortextoModel();
            $objIndicadorTModel->Eliminar($objIndicadorT);
            $r->exception = true;
        echo (json_encode($r));
        } catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }
    }

    function todosrecursosAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objRecurso = new DatEvalrecursoevaluativo();
        $r['datos'] = $objRecurso->GetPorLimite($limit, $start);
        $r['cantidad'] = $objRecurso->GetCantTotal();

        echo (json_encode($r));
    }

    function cargardominioAction() {
        $idrecursoevaluativo = $this->_request->getPost('idrecurso');
        $iddominioevaluativo = $this->_request->getPost('iddominio');
        if ($iddominioevaluativo == 'raizDominio')
            $iddominioevaluativo = -1;

        $objDominio = new DatEvaldominioevaluativo();

        $r = $objDominio->GetDominioEvaluativo($iddominioevaluativo, $idrecursoevaluativo);
        $v = null;
        $nodos = array();
        if (count($r) > 0)
            foreach ($r as $v)
                $nodos[] = array('id' => $v['iddominioevaluativo'], 'text' => $v['denom'], 'descripcion' => $v['descripcion'], 'idpadre' => $v['idpadre']);

        echo (json_encode($nodos));
    }

    function buscardominioAction() {
        $idominio = $this->_request->getPost('iddominio');
        $objDominio = new DatEvaldominioevaluativo();
        $r = array();
        $r = $objDominio->Buscar($idominio);

        echo (json_encode($r[0][denom]));
    }

    function temporalimagenAction() {
        try {
            if (isset($_SESSION["nombreimagen"]))
                unset($_SESSION['nombreimagen']);
            $fp = fopen($_FILES["nombreimagen"]["tmp_name"], "rb");
            $contents = file_get_contents($_FILES["nombreimagen"]["tmp_name"]);
            $nomTemp = $_FILES['nombreimagen']['tmp_name'];
            $arrNomTemp = explode('\\', $nomTemp);
            $nomImg = explode('.', $arrNomTemp[1]);

            $_SESSION["nombreimagen"] = $contents;
            $dimensiones = getimagesize($_FILES["nombreimagen"]["tmp_name"]);
            $_SESSION["dimensiones"] = $dimensiones;
            fclose($fp);

            $ext = $this->_request->getPost('extension');
            $dirimgs = "../../../plantillas/nomvalimgstemp/";
            $dir = "nomvalimgstemp/";
            $aimg = array();
            if ($dimensiones[0] < 200 && $dimensiones[1] < 200) {

                $ffp = fopen("nomvalimgstemp/" . "{$idindicadorimagen}" . "{$ext}", "wb");
                fclose($ffp);
                file_put_contents("nomvalimgstemp/" . "{$nomImg[0]}" . "{$ext}", $_SESSION['nombreimagen']);

                $aimg['success'] = true;
                $aimg['codigo'] = 1;
                $aimg['imagen'] = "{$dirimgs}" . "{$nomImg[0]}" . "{$ext}";
                $aimg['nombretemp'] = "{$nomImg[0]}" . "{$ext}";
                echo json_encode($aimg);
                die;
            } else {
                $aimg['success'] = true;
                $aimg['codigo'] = 2;
                unset($_SESSION['nombreimagen']);
                echo json_encode($aimg);
                die;
            }
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }

    function todasimagenesAction() {
        $dirimgs = "../../../plantillas/nomvalindimgs/";
        $dir = "nomvalindimgs/";
        $images = array();
        $arrNombres = array();
        $archivo = '';
        //Obtengo un listado de los nombres de los ficheros de imagenes en el servidor
        if ($gestor = opendir($dir)) {
            while (false !== ($archivo = readdir($gestor))) {
                if ($archivo != "." && $archivo != "..")
                    if (!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP)$/', $archivo))
                        continue;
                    else
                        $arrNombres[] = $archivo;
            }
        }else /* Debo lanzar una excepcion
            */die("Direccion incorrecta o  no existe la carpeta nomvalindimgs.");

        //Consulto la BD, buscando las imagenes que me piden
        $objIImg = new NomEvalindicadorimagen();
        $images = $objIImg->GetPorLimite($this->_request->getPost('limit'), $this->_request->getPost('start'));
        $cantTotal = $objIImg->GetCantTotal();

        //Verifico que todas las imagenes guardadas en la BD, esten en el servidor como ficheros.
        $nomImg = "";
        $si = 1;
        foreach ($images as $i) {
            $nomImg = $i['idindicadorimagen'] . $i['extension'];
            $si = -1;
            foreach ($arrNombres as $n)
                if ($nomImg == $n) {
                    $si = 1;
                    continue;
                } else {
                    $si = -1;
                }
            //En caso de que no este el fichero en el servidor lo creo y copio el contenido de la bd en el mismo.
            if ($si != 1)
                $this->SincronizarImgBDconFicheroServer($i['idindicadorimagen']);
        }//foreach($images as $i)
        //print_r($arrNombres);die;
        $r['datos'] = $images;
        $r['cantidad'] = $cantTotal;

        echo (json_encode($r));
    }

    function SincronizarImgBDconFicheroServer($idindicadorimagen) {
        $host = Zend_Registry::get('config')->bd->plantillas->host;
        $user = Zend_Registry::get('config')->bd->plantillas->usuario;
        $pass = Zend_Registry::get('config')->bd->plantillas->password;
        $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
        $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
        $consulta = pg_query($link, "select denom, extension from mod_evaluaciones.nom_evalindicadorimagen where idindicadorimagen={$idindicadorimagen}");
        $arrayVal = array();
        while ($row = pg_fetch_assoc($consulta))
            $arrayVal[] = $row;
        $ext = $arrayVal[0]['extension'];
        $ffp = fopen("nomvalindimgs/" . "{$idindicadorimagen}" . "{$ext}", "wb");
        fclose($ffp);
        $imagen = pg_unescape_bytea($arrayVal[0]['denom']);
        file_put_contents("nomvalindimgs/" . "{$idindicadorimagen}" . "{$ext}", $imagen);
    }

    function adicionarimagenAction() {
        try {
            $codigo = $this->_request->getPost('codigo');
            $nombre = $this->_request->getPost('nombre');
            $iddominioevaluativo = $this->_request->getPost('iddominioevaluativo');
            $descripcion = $this->_request->getPost('heDescripcion');
            $fi = $this->_request->getPost('fechainicio');
            $ff = $this->_request->getPost('fechafin');
            if ($ff == '')
                $ff = null;
            $ext = $this->_request->getPost('extension');
            $nombretemp = $this->_request->getPost('nombretemp');

            $imagen = pg_escape_bytea($_SESSION['nombreimagen']);
            $host = Zend_Registry::get('config')->bd->plantillas->host;
            $user = Zend_Registry::get('config')->bd->plantillas->usuario;
            $pass = Zend_Registry::get('config')->bd->plantillas->password;
            $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");

            //Genero el ID de la tupla que voy a insertar.
            $queryMax = pg_query($link, "select max(idindicadorimagen) as maximo from mod_evaluaciones.nom_evalindicadorimagen");
            $arrayMax = array();
            while ($row = pg_fetch_assoc($queryMax))
                $arrayMax[] = $row;
            $idindicadorimagen = 1;
            if ($arrayMax[0]['maximo'] != null)
                $idindicadorimagen = $arrayMax[0]['maximo'] + 1;

            if ($ff == '')
                $sql = "insert INTO mod_evaluaciones.nom_evalindicadorimagen (idindicadorimagen, codigo, denom, extension, descripcion, fechainicio, fechafin, iddominioevaluativo, nombre)
				 values ({$idindicadorimagen},'{$codigo}','{$imagen}','{$ext}','{$descripcion}', '{$fi}',null,'{$iddominioevaluativo}','{$nombre}')";
            else
                $sql = "insert INTO mod_evaluaciones.nom_evalindicadorimagen (idindicadorimagen, codigo, denom, extension, descripcion, fechainicio, fechafin, iddominioevaluativo, nombre)
				 values ({$idindicadorimagen},'{$codigo}','{$imagen}','{$ext}','{$descripcion}', '{$fi}','{$ff}','{$iddominioevaluativo}','{$nombre}')";

            $query = pg_query($link, $sql);

            $ffp = fopen("nomvalindimgs/" . "{$idindicadorimagen}" . "{$ext}", "wb");
            fclose($ffp);
            file_put_contents("nomvalindimgs/" . "{$idindicadorimagen}" . "{$ext}", $_SESSION['nombreimagen']);
            $dir = "nomvalimgstemp/";
            unlink("nomvalimgstemp/" . "{$nombretemp}");

            if ($gestor = opendir($dir)) {
                while (false !== ($archivo = readdir($gestor))) {
                    if ($archivo != "." && $archivo != "..")
                        if (!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP)$/', $archivo))
                            continue;
                        else
                            unlink("nomvalimgstemp/" . "{$archivo}");
                }
            }
            $m->codMsg = 1;
            $m->result = true;
            echo (json_encode($m));
            unset($_SESSION['nombreimagen']);
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }

    function eliminarimagenAction() {
        $idimg = $this->_request->getPost('idimagen');


        $eliminado = $this->objIndicadorImgModel->Eliminar($idimg);

        if ($eliminado){
           $m->eliminado = true;
        }
        echo json_encode($m);
    }

    function modificarimagenAction() {
        try {
            $id = $this->_request->getPost('idimagen');
            $objIndicadorI = Doctrine::getTable('NomEvalindicadorimagen')->find($id);
            $codigo = $this->_request->getPost('codigo');
            $nombre = $this->_request->getPost('nombre');
            $iddominioevaluativo = $this->_request->getPost('iddominioevaluativo');
            $descripcion = $this->_request->getPost('heDescripcion');
            $fi = $this->_request->getPost('fechainicio');
            $ff = $this->_request->getPost('fechafin');
            if ($ff == '')
                $ff = null;

            //$imagen = pg_escape_bytea($_SESSION['nombreimagen']);
            $host = Zend_Registry::get('config')->bd->plantillas->host;
            $user = Zend_Registry::get('config')->bd->plantillas->usuario;
            $pass = Zend_Registry::get('config')->bd->plantillas->password;
            $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");

            if ($objIndicadorI->codigo != $codigo) {
                if (!$this->verificarcodigo($this->_request->getPost('codigo'), false)) {
                    if ($ff != null) {
                        $sql = "UPDATE mod_evaluaciones.nom_evalindicadorimagen ii
						SET codigo = '{$codigo}',
							descripcion = '{$descripcion}',
							fechainicio = '{$fi}',
							fechafin = '{$ff}',
							iddominioevaluativo = '{$iddominioevaluativo}',
							nombre = '{$nombre}'
						WHERE
							ii.idindicadorimagen = '{$id}'";
                    } else {
                        $sql = "UPDATE mod_evaluaciones.nom_evalindicadorimagen ii
						SET codigo = '{$codigo}',
							descripcion = '{$descripcion}',
							fechainicio = '{$fi}',
							fechafin = null,
							iddominioevaluativo = '{$iddominioevaluativo}',
							nombre = '{$nombre}'
						WHERE
							ii.idindicadorimagen = '{$id}'";
                    }
                    $query = Doctrine_Manager::getInstance();
                    $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                    //$queryMax = pg_query($link, $sql);

                    /* 	$ffp = fopen("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", "wb");
                      fclose($ffp);
                      file_put_contents("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", $_SESSION['nombreimagen']);
                     */
                    //$m->codMsg = 1;
                    $m->mensaje = true;
                    echo json_encode($m);
                    unset($_SESSION['nombreimagen']);
                } else {
                    throw new ZendExt_Exception('CHE063');
                }
            } else {
                if ($ff != null) {
                    $sql = "UPDATE mod_evaluaciones.nom_evalindicadorimagen ii
						SET codigo = '{$codigo}',
							descripcion = '{$descripcion}',
							fechainicio = '{$fi}',
							fechafin = '{$ff}',
							iddominioevaluativo = '{$iddominioevaluativo}',
							nombre = '{$nombre}'
						WHERE
							ii.idindicadorimagen = '{$id}'";
                } else {
                    $sql = "UPDATE mod_evaluaciones.nom_evalindicadorimagen ii
						SET codigo = '{$codigo}',
							descripcion = '{$descripcion}',
							fechainicio = '{$fi}',
							fechafin = null,
							iddominioevaluativo = '{$iddominioevaluativo}',
							nombre = '{$nombre}'
						WHERE
							ii.idindicadorimagen = '{$id}'";
                }
                $query = Doctrine_Manager::getInstance();
                $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                //$queryMax = pg_query($link, $sql);

                /* 	$ffp = fopen("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", "wb");
                  fclose($ffp);
                  file_put_contents("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", $_SESSION['nombreimagen']);
                 */
                //$m->codMsg = 1;
                $m->mensaje = true;
                echo json_encode($m);
                unset($_SESSION['nombreimagen']);
            }
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }

    function mostrarimagenAction() {
        $id = $this->_request->getPost('idimagen');
        $ext = $this->_request->getPost('extension');
        $dirimgs = "../../../plantillas/nomvalindimgs/";

        $aimg['success'] = true;
        $aimg['codigo'] = 1;
        $aimg['imagen'] = "{$dirimgs}" . "{$id}" . "{$ext}";
        $aimg['nombretemp'] = "{$id}" . "{$ext}";

        echo json_encode($aimg);
        die;
    }
     function obtenerreporteAction(){
       $formato = $_GET['formato'];
        $titulo = $_GET['titulo'];
	    $usuario =json_decode($_GET['usuario']);
        $fecha = json_decode($_GET['fecha']);
        $params = json_decode($_GET['params']);
        $header = json_decode($_GET['header']);
		$tiporeporte=$_GET['tiporeporte'];
               if( $usuario=='1'){
                $usuario=$this->global->Perfil->usuario;
           }
     if($fecha=='1'){
                $fecha=gmdate("d/m/Y H:i:s");
        }


        for ($i = 0; $i < count($header) - 1; $i++) {
            $cabecera[$i] = $header[$i + 1];
        }
        $objIndicadorT = new NomEvalindicadortexto();
        $data=$objIndicadorT->GetTodos();
		 for ($i = 0; $i < count($data); $i++) {
            $datos[$i]['denom'] = $data[$i]['denom'];
            $datos[$i]['codigo'] = $data[$i]['codigo'];
            $datos[$i]['fechainicio'] = $data[$i]['fechainicio'];
            $datos[$i]['fechafin'] = $data[$i]['fechafin'];

        }
       if($tiporeporte=='listnomenclador'){
			ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte($formato, $titulo, $datos, $cabecera, $usuario,$fecha);
		}

    }

}
