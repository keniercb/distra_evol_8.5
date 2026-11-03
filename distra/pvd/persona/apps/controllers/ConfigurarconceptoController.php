<?php

class ConfigurarconceptoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function configurarconceptoAction()
    {
        // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    //obtener  los conceptos
    function getConceptosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $denominacion = $this->_request->getPost('query');
        $nomConcepto = new NomConcepto();
        $r['data'] = $nomConcepto->getPorLimite($denominacion, $limit, $start);
        $r['total'] = $nomConcepto->getCantTotal($denominacion);
        echo(json_encode($r));
    }

    //adicionar conceptos
    function adicionarConceptoAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $icono = $this->_request->getPost('icono');
        $referencia = $this->_request->getPost('referencia');
        $descripcion = $this->_request->getPost('descripcion');
        $nomConcepto = new NomConcepto();
        $nomConcepto->denominacion = $denominacion;
        $nomConcepto->icono = $icono;
        $nomConcepto->referencia = $referencia;
        $nomConcepto->descripcion = $descripcion;
        if (!$nomConcepto->existe($denominacion, true)) {
            $nomConcepto->save();
            $existe = false;
        }
        $r->codMsg = 1;
        $r->exception = 0;
        $r->existe = $existe;
        echo(json_encode($r));
    }

    //modificar conceptos
    function modificarConceptoAction()
    {
        $idconcepto = $this->_request->getPost('id');
        $denominacion = $this->_request->getPost('denominacion');
        $icono = $this->_request->getPost('icono');
        $referencia = $this->_request->getPost('referencia');
        $descripcion = $this->_request->getPost('descripcion');
        $nomConcepto = new NomConcepto();
        $nomConceptodenom = Doctrine::getTable('NomConcepto')->find($idconcepto);
        $cambio = true;
        if ($denominacion == $nomConceptodenom->denominacion) {
            $cambio = false;
        }
        $nomConceptodenom->denominacion = $denominacion;
        $nomConceptodenom->icono = $icono;
        $nomConceptodenom->referencia = $referencia;
        $nomConceptodenom->descripcion = $descripcion;
        $existe = true;
        $nomConceptoModel = new NomConceptoModel();
        if (!$nomConcepto->existe($nomConceptodenom->denominacion, $cambio)) {
            $nomConceptoModel->Actualizar($nomConceptodenom);
            $existe = false;
        }
        $r = new StdClass();
        $r->codMsg = 1;
        $r->exception = 0;
        $r->existe = $existe;
        $r->mensaje = "El concepto ha sido modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    //eliminar conceptos
    function eliminarConceptoAction()
    {
        $id = $this->_request->getPost('id');
        $nomConcepto = new NomConceptoModel();
        $r = $nomConcepto->Eliminar($id);
        echo(json_encode($r));
    }

    ///////Campo//////
    function getCamposAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idconcepto = $this->_request->getPost('idconcepto');
        $denominacion = $this->_request->getPost('query');
        $nomCampo = new NomCampo();
        $r['data'] = $nomCampo->getPorLimite($idconcepto, $denominacion, $limit, $start);
        $r['total'] = $nomCampo->getCantTotal($idconcepto, $denominacion);
        echo(json_encode($r));
    }

    //adicionar campo
    function adicionarCampoAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $idtipodedato = $this->_request->getPost('idtipodedato');
        $descripcion = $this->_request->getPost('descripcion');
        $idconcepto = $this->_request->getPost('idconcepto');
        $existe = true;
        $nomCampo = new NomCampo();
        $nomCampo->denominacion = $denominacion;
        $nomCampo->idtipodedato = $idtipodedato;
        $nomCampo->descripcion = $descripcion;
        $nomCampo->idconcepto = $idconcepto;
        if (!$nomCampo->existe($denominacion, true)) {
            $nomCampo->save();
            $existe = false;
        }
        $r->codMsg = 1;
        $r->exception = 0;
        $r->existe = $existe;
        $r->mensaje = "El campo ha sido adicionada satisfactoriamente.";
        echo(json_encode($r));
        //idtipodedato
    }

    //modificar campo
    function modificarCampoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        $denominacion = $this->_request->getPost('denominacion');
        $idtipodedato = $this->_request->getPost('idtipodedato');
        $descripcion = $this->_request->getPost('descripcion');
        $nomCampo = new NomCampo();
        $nomCampodenom = Doctrine::getTable('NomCampo')->find($idcampo);
        $cambio = true;
        if ($denominacion == $nomCampodenom->denominacion) {
            $cambio = false;
        }
        $nomCampodenom->denominacion = $denominacion;
        $nomCampodenom->idtipodedato = $idtipodedato;
        $nomCampodenom->descripcion = $descripcion;
        $existe = true;
        $nomCampoModel = new NomCampoModel();
        if (!$nomCampo->existe($nomCampodenom->denominacion, $cambio)) {
            $nomCampoModel->Actualizar($nomCampodenom);
            $existe = false;
        }
        $r = new StdClass();
        $r->codMsg = 1;
        $r->exception = 0;
        $r->existe = $existe;
        $r->mensaje = "El concepto ha sido modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    //eliminar campo
    function eliminarCampoAction()
    {
        $id = $this->_request->getPost('id');
        $nomCampo = new NomCampoModel();
        $r = $nomCampo->Eliminar($id);
        echo(json_encode($r));
    }

    //Cargar iconos
    function getIconsAction()
    {
        try {
            $dir = 'views/images/icons/';
            $realdir = '../../views/images/icons/';
            $images = array();
            $d = dir($dir);
            $i = 0;
            while ($name = $d->read()) {
                if (!preg_match('/\.(jpg|gif|png)$/', $name)) {
                    continue;
                }
                $size = filesize($dir . $name);
                $images[] = array(
                    'idimagen' => $i++, 'denominacion' => $name, 'size' => $size, 'url' => $realdir . $name);
            }
            $d->close();
            $r = array('datos' => $images);
            echo json_encode($r);
        } catch (Exception $e) {
            $r->codigo = $e->getCode();
            echo json_encode($r);
        }
    }

    //cargar los tipos de datos del combo tipo de dato
    function getTipoDatoAction()
    {
        $nomTipodedato = new NomTipodedato();
        $r['data'] = $nomTipodedato->getTodos();
        echo(json_encode($r));
    }

    /**
     *
     */
    function guardarImagenAction()
    {
        try {
            $nombre = $this->_request->getPost('nombre');
            $direccion = $_SERVER['DOCUMENT_ROOT'] . '/pvd/persona/views/css/icons.css';
            $contenido = file_get_contents($direccion);
            $nombreComparacion = '.' . $nombre . ' {';
            $respuesta = strpos($contenido, $nombreComparacion);
            if ($respuesta === false) {
                if (isset($_SESSION["nombreimagen"])) {
                    unset($_SESSION['nombreimagen']);
                }
                $fp = fopen($_FILES["nombreimagen"]["tmp_name"], "rb");
                $contents = file_get_contents($_FILES["nombreimagen"]["tmp_name"]);
                $_SESSION["nombreimagen"] = $contents;
                $dimensiones = getimagesize($_FILES["nombreimagen"]["tmp_name"]);
                $_SESSION["dimensiones"] = $dimensiones;
                fclose($fp);
                $ext = $this->_request->getPost('extension');
                $dirimgs = $_SERVER['DOCUMENT_ROOT'] . '/pvd/persona/views/images/icons/';
                $dircss = $_SERVER['DOCUMENT_ROOT'] . '/pvd/persona/views/css/icons.css';
                //Genera clase en el fichero CSS
                $style = ' {background-image:url(../images/icons/' . $nombre . $ext . ') !important;}';
                $estilo = PHP_EOL . '.' . $nombre . $style;
                $fp = fopen($dircss, 'a');
                fwrite($fp, $estilo);
                fclose($fp);
                //guardar la imagen en la carpeta destino
                $ffp = fopen($dirimgs, "wb");
                fclose($ffp);
                file_put_contents($dirimgs . $nombre . $ext, $_SESSION['nombreimagen']);
                $aimg['success'] = true;
                echo json_encode($aimg);
            } else {
                $aimg['success'] = true;
                $aimg['exception'] = true;
                echo json_encode($aimg);
            }
        } catch (Doctrine_Exception $ex) {
            throw new ZendExt_Exception($ex);
        }
    }
}
