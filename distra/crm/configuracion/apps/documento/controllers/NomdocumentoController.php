<?php

/**
 * Clase controladora para gestionar el nomenclador de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Controllers
 * @copyright  XETID.
 * @version    1.0-0
 */
class NomdocumentoController extends ZendExt_Controller_Secure
{
/**
 * Inicializa el padre 
 */
    function init()
    {
        parent::init();
        $this->model[] = new DocumentoModel();
        $this->model[] = new DatDocumentoprimModel();
    }
/**
 * Inicializa la vista
 */
    function nomdocumentoAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }
/**
 * Obtiene un nomenclador de documento primario
 * @return void Echo con el nomenclador
 * @throws Exception
 */
    function cargarnomdocgAction()
    {
        try {
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');
            $params['sfFiltro'] = $this->_request->getPost('sfFiltro');
            $result = NomDocprim::buscarnomdoc($params);
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }
/**
 * Obtiene un concepto
 * @return void Echo con un array conteniendo el concepto 
 */
    function cargarconceptosAction()
    {
        $result = array(array('concepto' => 'N', 'nombreconcepto' => 'Ninguno'),
                        array('concepto' => '+', 'nombreconcepto' => "Entrada"),
                        array('concepto' => '-', 'nombreconcepto' => "Salida"));
        echo(json_encode(array('datos' => $result)));
    }
/**
 * Adiciona un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación,-1 adicionó correctamente,-4 no adicionó
 */
    public function insertarnomdocAction()
    {
        $doc = new NomDocprim();
        $doc->denominacion = $this->_request->getPost('denominacion');
        $doc->abreviatura = $this->_request->getPost('abreviatura');
        $doc->concepto = $this->_request->getPost('concepto');
        $codigo = $this->_request->getPost('codigo');
        if (!empty($codigo)) {
            $doc->codigo = $this->_request->getPost('codigo');
        } else {
            $doc->codigo = '';
        }
        $code=$this->model[0]->insertarDocumento($doc);
        echo("{'codMsg':$code}");
        return;
    }
/**
 * Modifica un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación
 * @throws ZendExt_Exception
 */
    public function modificarnomdocAction()
    {
        try {
            $pIdDocumento = $this->_request->getPost('iddocumentos');
            $objNomDocprim = Doctrine::getTable('NomDocprim')->find($pIdDocumento);
            $objNomDocprim->denominacion = $this->_request->getPost('denominacion');
            $objNomDocprim->abreviatura = $this->_request->getPost('abreviatura');
            $objNomDocprim->concepto = $this->_request->getPost('concepto');
            $objNomDocprim->codigo = $this->_request->getPost('codigo');

            $result = DocumentoModel::modificar($objNomDocprim, $pIdDocumento);
            echo("{'codMsg':$result}");
            return;
        } catch (Exception $ex) {
            throw new ZendExt_Exception('CONF145', $ex);
        }
    }
/**
 * Elimina un nomenclador de documento primario
 * @return void Echo con mensaje de confirmación
 * @throws Exception
 */
    public function eliminarNomencladorDocumentoPrimarioAction()
    {
        try {
            $pIdDocumentos = json_decode(stripslashes($this->_request->getPost('iddocumentos')));
            $variablesModificar = "";
            $result = DocumentoModel::eliminarnDocumento($pIdDocumentos, $variablesModificar);
            $resultDelDocumento = ($result != "") ? explode(',', $result) : "";
            if (is_array($resultDelDocumento)) {
                echo("{'codMsg':-3, 'documentos':'" . implode(', ', $resultDelDocumento)
                    . "'}"); //hubieron documentos que no se puedieron eliminar.
            } else {
                /* se cambio $pIdDesglose por $pIdDocumentos */
                if (count($pIdDocumentos) == 1) {
                    echo("{'codMsg':-1, 'documentos':'" . implode(',', $resultDelDocumento)
                        . "'}"); //el docuemnto ha sido eliminada correctamente.
                } else {
                    echo("{'codMsg':-2, 'documentos':'" . implode(',', $resultDelDocumento)
                        . "'}"); //los docuemnto han sido eliminadas correctamente.
                }
            }
        } catch (Exception $ee) {
            throw $ee;
        }
    }

}
