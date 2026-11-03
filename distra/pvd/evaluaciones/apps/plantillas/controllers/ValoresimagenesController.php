<?php

class ValoresimagenesController extends ZendExt_Controller_Secure {

    private $model;

    function init() {
        $this->model = new NomEvalvaloresimagenesModel();
        parent::init();
    }

    function valoresimagenesAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function todasimagenesAction() {
        //$dirimgs = '..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'plantillas'.DIRECTORY_SEPARATOR.'nomvalimgs'.DIRECTORY_SEPARATOR;
        $dirimgs = '/pvd/evaluaciones/plantillas/nomvalimgs/';
        $dir = 'nomvalimgs' . DIRECTORY_SEPARATOR;
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
            */die("Direccion incorrecta o  no existe la carpeta nomvalimgs.");

        //Consulto la BD, buscando las imagenes que me piden
        $objVImg = new NomEvalvaloresimagenes();
        $images = $objVImg->GetPorLimite($this->_request->getPost('limit'), $this->_request->getPost('start'));
        $cantTotal = $objVImg->GetCantTotal();
        //Verifico que todas las imagenes guardadas en la BD, esten en el servidor como ficheros.
        $nomImg = "";
        $si = 1;
        foreach ($images as $i) {
            $nomImg = $i['idvaloresimagenes'] . $i['extension'];
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
                $this->SincronizarImgBDconFicheroServer($i['idvaloresimagenes']);
        }//foreach($images as $i)
        //print_r($arrNombres);die;
        $o = array('datos' => $images, 'cantidad' => $cantTotal);

        echo json_encode($o);
    }

    function SincronizarImgBDconFicheroServer($idvaloresimagenes) {
        $host = Zend_Registry::get('config')->bd->plantillas->host;
        $user = Zend_Registry::get('config')->bd->plantillas->usuario;
        $pass = Zend_Registry::get('config')->bd->plantillas->password;
        $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
        $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
        $consulta = pg_query($link, "select denom, extension from mod_evaluaciones.nom_evalvaloresimagenes where idvaloresimagenes={$idvaloresimagenes}");
        $arrayVal = array();
        while ($row = pg_fetch_assoc($consulta))
            $arrayVal[] = $row;
        $ext = $arrayVal[0]['extension'];
        $ffp = fopen('nomvalimgs' . DIRECTORY_SEPARATOR . "{$idvaloresimagenes}" . "{$ext}", "wb");
        fclose($ffp);
        $imagen = pg_unescape_bytea($arrayVal[0]['denom']);
        file_put_contents('nomvalimgs' . DIRECTORY_SEPARATOR . "{$idvaloresimagenes}" . "{$ext}", $imagen);
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
            $dir = 'nomvalimgstemp' . DIRECTORY_SEPARATOR;
            $aimg = array();
            if ($dimensiones[0] < 200 && $dimensiones[1] < 200) {

                $ffp = fopen('nomvalimgstemp/'."{$idvaloresimagenes}" . "{$ext}", "wb");
                fclose($ffp);
                file_put_contents('nomvalimgstemp/'. "{$nomImg[0]}" . "{$ext}", $_SESSION['nombreimagen']);

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

    function adicionarimagenAction() {
        try {
            $descripcion = $this->_request->getPost('descripcion');
            $fi = $this->_request->getPost('dfFIImagen');
            $ff = $this->_request->getPost('dfFFImagen');
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
            $queryMax = pg_query($link, "select max(idvaloresimagenes) as maximo from mod_evaluaciones.nom_evalvaloresimagenes");
            $arrayMax = array();
            while ($row = pg_fetch_assoc($queryMax))
                $arrayMax[] = $row;
            $idvaloresimagenes = 1;
            if ($arrayMax[0]['maximo'] != null)
                $idvaloresimagenes = $arrayMax[0]['maximo'] + 1;

            if ($ff == '')
                $sql = "insert INTO mod_evaluaciones.nom_evalvaloresimagenes (idvaloresimagenes, denom, descripcion, fechainicio, fechafin, extension)
                     values ({$idvaloresimagenes},'{$imagen}','{$descripcion}', '{$fi}', null, '{$ext}')";
            else
                $sql = "insert INTO mod_evaluaciones.nom_evalvaloresimagenes (idvaloresimagenes, denom, descripcion, fechainicio, fechafin, extension)
                      values ({$idvaloresimagenes},'{$imagen}','{$descripcion}', '{$fi}', '{$ff}', '{$ext}')";

            //die($sql);

            $query = pg_query($link, $sql);

            $ffp = fopen('nomvalimgs' . DIRECTORY_SEPARATOR . "{$idvaloresimagenes}" . "{$ext}", "wb");
            fclose($ffp);
            file_put_contents('nomvalimgs' . DIRECTORY_SEPARATOR . "{$idvaloresimagenes}" . "{$ext}", $_SESSION['nombreimagen']);
            $dir = 'nomvalimgstemp' . DIRECTORY_SEPARATOR;
            unlink('nomvalimgstemp' . DIRECTORY_SEPARATOR . "{$nombretemp}");

            if ($gestor = opendir($dir)) {
                while (false !== ($archivo = readdir($gestor))) {
                    if ($archivo != "." && $archivo != "..")
                        if (!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP)$/', $archivo))
                            continue;
                        else
                            unlink('nomvalimgstemp' . DIRECTORY_SEPARATOR . "{$archivo}");
                }
            }
            $m->codMsg = 1;
            $m->mensaje = utf8_encode("La imagen ha sido adicionada satisfactoriamente.");
            echo json_encode($m);
            unset($_SESSION['nombreimagen']);
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }

    function modificarimagenAction() {
        try {
            $id = $this->_request->getPost('idimagen');
            $descripcion = $this->_request->getPost('descripcion');
            $fi = $this->_request->getPost('dfFIImagen');
            $ff = $this->_request->getPost('dfFFImagen');

            if ($ff == '')
                $ff = null;
            $ext = $this->_request->getPost('extension');
            $imagen = pg_escape_bytea($_SESSION['nombreimagen']);
            $host = Zend_Registry::get('config')->bd->plantillas->host;
            $user = Zend_Registry::get('config')->bd->plantillas->usuario;
            $pass = Zend_Registry::get('config')->bd->plantillas->password;
            $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");

            if ($ff != null) {
                $sql = "UPDATE mod_evaluaciones.nom_evalvaloresimagenes vi
				SET descripcion = '{$descripcion}',
					fechainicio = '{$fi}',
					fechafin = '{$ff}'
				WHERE
					vi.idvaloresimagenes = '{$id}'";
            } else {
                $sql = "UPDATE mod_evaluaciones.nom_evalvaloresimagenes vi
				SET descripcion = '{$descripcion}',
					fechainicio = '{$fi}',
					fechafin = null
				WHERE
					vi.idvaloresimagenes = '{$id}'";
            }

            $query = Doctrine_Manager::getInstance();
            $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            /* $queryMax = pg_query($link, $sql);

              $ffp = fopen("nomvalimgs/"."{$idvaloresimagenes}"."{$ext}", "wb");
              fclose($ffp);
              file_put_contents("nomvalimgs/"."{$idvaloresimagenes}"."{$ext}", $_SESSION['nombreimagen']);
             */
            $m->codMsg = 1;
            $m->mensaje = utf8_encode("La imagen ha sido modificada satisfactoriamente.");
            echo json_encode($m);
            unset($_SESSION['nombreimagen']);
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }

    function eliminarimagenAction() {
    try{
        $idimg = $this->_request->getPost('idimagen');
        $extension = $this->_request->getPost('extension');
        $res = $this->model->Eliminar($idimg, $extension);
        $r->codMsg = 1;
        $r->exception = 0;
        $r->mensaje = "La imagen ha sido eliminada satisfactoriamente.";
        echo (json_encode($r));
    }catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }
            
    }

    function mostrarimagenAction() {
        $id = $this->_request->getPost('idimagen');
        $ext = $this->_request->getPost('extension');
        $dirimgs = '/pvd/evaluaciones/plantillas/nomvalimgs/';

        $aimg['success'] = true;
        $aimg['codigo'] = 1;
        $aimg['imagen'] = "{$dirimgs}" . "{$id}" . "{$ext}";
        $aimg['nombretemp'] = "{$id}" . "{$ext}";

        echo json_encode($aimg);
        die;
    }

}