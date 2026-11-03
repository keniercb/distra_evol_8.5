<?php
/**
 * Controlador de firmas de documentos.
 *
 * @package Presentación.
 * @subpackage Controlador.
 * @copyright UCID
 * @version 1.0
 */
class ConfFirmaDocumentoController extends ZendExt_Controller_Secure
{
    private $_nomDocumentoFirmaModel;
    private $_nomTipoFirmaModel;
    private $_confFirmaDocumentoModel;

    public function init()
    {
        parent::init();
        $this->_confFirmaDocumentoModel = new ConfFirmaDocumentoModel();
        $this->_nomDocumentoFirmaModel = new NomDocumentoFirmaModel();
        $this->_nomTipoFirmaModel = new NomTipoFirmaModel();
    }

    public function conffirmadocumentoAction()
    {
        $this->render();
    }

    public function getFirmasDocumentosAction()
    {
        echo Zend_Json::encode(
            $this->_confFirmaDocumentoModel->getPieFirmaDocumento($this->_getParam('idfirmadocumento'))
        );
    }

}