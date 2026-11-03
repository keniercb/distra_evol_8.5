<?php

class NomcolorpielController extends ZendExt_Controller_Secure
{

    private $request;

    function init()
    {
        parent::init();
    }

    function nomcolorpielAction()
    {
        // $this->cargaInicial('persona', 'nomenclador');
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function getSkinColorAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomColorpielModel();
        if ($query != '') {
            $result = $objModel->getColorActiveSkin($query, $limit, $start);
        } else {
            $result = $objModel->getColorActiveSkin(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addSkincolorAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->abreviatura != '') {
                $obj->abreviatura = $values->abreviatura;
            } else {
                $obj->abreviatura = null;
            }
            if ($values->descripcion != '') {
                $obj->descripcion = $values->descripcion;
            } else {
                $obj->descripcion = null;
            }
            if ($values->fdesde != '') {
                $fi = explode('/', $values->fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creacion no puede estar vacio.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $objModel = new NomColorpielModel();
            if ($objModel->addSkincolor($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "El color de piel ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function modSkincolorAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        $idnomenclador = $this->_request->getPost('idnomenclador');
        try {
            $objModel = new NomColorpielModel();
            $result = $objModel->modSkincolor(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El color de piel ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delSkincolorAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomColorpielModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delSkincolor($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "El color de piel no se podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "El color de piel ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El color de piel no se puede eliminar.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
        /* try {
              $arrIds = json_decode($this->_request->getPost('idnomenclador'));
              if (!empty($arrIds) && is_array($arrIds)) {
                  $obj->idnomenclador = $arrIds->idnomenclador;
              } else {
                  throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
              }
              $objModel = new NomColorpielModel();
              foreach ($arrIds as $value) {
                  $result = $objModel->delSkincolor($value);
              }
              if ($result) {
                  $this->request->success = true;
                  $this->request->mensaje = "El color de piel ha sido eliminado satisfactoriamente.";
                  $this->returnRequest();
              }
          } catch (Exception $e) {
              $this->request->success = false;
              $this->request->mensaje = $e->getMessage();
              $this->request->file = $e->getFile();
              $this->request->linea = $e->getLine();
              $this->returnRequest();
          }*/
    }

    function showReportAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        //$params = json_decode($this->_request->getParam('params'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomColorpiel::getColorActiveSkin();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['abreviatura'] = $value['abreviatura'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }

}
