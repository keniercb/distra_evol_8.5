<?php

/**
 * Controlador para gestion documental
 *
 * @author    Maximo E. Marin
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestordocumentalController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionaractividades.phtml
     */
    function cmpgestordocumentalAction()
    {

        $this->view->gestdoc
            = $this->integrator->gestordocumental->devolverJSContenido();
        $this->render();
    }

    function cargarDocumentosAsociadosAction()
    {
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $arraydocumentos = Doctrine::getTable('DatElementosDocumento')
            ->findByDql("idelemento = $parametros->idelemento")->toArray();
        $arreglo = array();
        foreach ($arraydocumentos as $i => $val) {
            $details = ZendExt_IoC::getInstance(
            )->gestordocumental->obtenerDetallesContenido($val['iddocumento']);
            $arreglo[$i]['denominacion'] = $details['nombre'];
            $arreglo[$i]['icono'] = $details['urlImagen'];
            $arreglo[$i]['id'] = $val['iddocumento'];
            $arreglo[$i]['fechaCreacion'] = $details['fechaCreacion'];
            $arreglo[$i]['fechaModificacion'] = $details['ultimaModificacion'];
            $arreglo[$i]['datosbd'] = 1;
        }
        if (count($arreglo > 0)) {
            echo json_encode(
                array('total' => count($arreglo), 'data' => $arreglo)
            );
        } else {
            echo json_encode(array('total' => 0, 'data' => array()));
        }
    }

    function abrirDocumentoAction()
    {
        $parametros->idenodo = $this->_request->getPost('idnodoselect');
        $documento = ZendExt_IoC::getInstance(
        )->gestordocumental->abrirdocumento($parametros->idenodo)['url'];
        echo json_encode($documento);
    }

    function eliminarAsociadionDocAction()
    {
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->documentos = json_decode(
            stripslashes($this->_request->getPost('idnodoselect'))
        );
        if ($parametros->documentos) {
            foreach (
                $parametros->documentos as /*$i =>*/
                $value
            ) {
                $documento = Doctrine::getTable('DatElementosDocumento')
                    ->findByDql(
                        "idelemento = $parametros->idelemento AND iddocumento = '$value'"
                    );
                if ($documento[0]->idelemento != null) {
                    $documento[0]->delete();
                    $resp = 1;
                } else {
                    $resp = 4;
                }
            }
        } else {
            $resp = 1;
        }
        echo json_encode(array('resp' => $resp));
    }


  public function cargarTipoDocumentosAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $idusuario = $this->global->Perfil->idusuario;
    $tiponomenclador = 13;
    $nomencladores
      = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
      $tiponomenclador, $idusuario
    );
    if ($nomencladores != null) {
      foreach ($nomencladores as $val) {
        $dat->data [] = array('iddocumentos' => $val['idnomenclador'],
                              'denominacion' => $val['denom']);
      }
    } else {
      $dat->data = array();
    }
    echo json_encode($dat);
  }

  public function cargarDocumentosAction()
  {
    $params['idelemento'] = $this->_request->getPost('idelemento');
    $params['iddocumentos'] = $this->_request->getPost('iddocumentos') ? $this->_request->getPost('iddocumentos') : 0;
    $model = new CmpgestordocumentalModel();
    $respuesta=$model->cargarDocumentos($params);
    echo json_encode(array('data' => $respuesta));
  }

  public function adicionarDocumentoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros['idproceso'] = $this->_request->getPost('idproceso');
    $parametros['tipoproceso'] = $this->_request->getPost('tipoproceso');
    $parametros['descripcion'] = $this->_request->getPost('descripcion');
    $parametros['idtipodocumento'] = $this->_request->getPost('idtipodocumento') ? $this->_request->getPost('idtipodocumento'):0;
    $parametros['nombrearchivo'] = $_FILES["file"]["tmp_name"];
    $filename = explode('.', $_FILES['file']['name']);
    $parametros['extensionarchivo']=$filename[1];
    $model = new CmpgestordocumentalModel();
    $respuesta=$model->adicionarDocumento($parametros);

    echo json_encode(array('cod' => $respuesta));
  }

  public function eliminarDocumentoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros['iddocespaciotrabajo'] = $this->_request->getPost('iddocespaciotrabajo');
    $parametros['iddocumentogestor'] = $this->_request->getPost('iddocumentogestor');
    $model = new CmpgestordocumentalModel();
    $respuesta=$model->eliminarDocumento($parametros);
    echo json_encode(array('codMsgA' => $respuesta));
  }
  public function descargarDocumentoAction()
  {
    ini_set("max_execution_time", 3600); //3600 1hora
    $parametros['iddocumentogestor'] = $this->_request->getParam('iddocumentogestor');
    $model = new CmpgestordocumentalModel();
    $respuesta=$model->descargarDocumento($parametros);
  }

}
