<?php

/**
 *
 */
class DocumentoValidator
{

    protected $_post = array();
    protected $_mDocActivo;

    /**
     *
     */
    public function __construct()
    {
        $this->_post = $_POST;
        $this->_mDocActivo = new DocumentoActivoModel();
    }

    /**
     *
     */
    public function validarAprobar()
    {
        $idDocumento = $this->_post['iddocumento'];
        $sMovimiento = new MovimientoService();

        $cantEnMovimiento = $sMovimiento->getCantMediosEnMovByIdDocumento($idDocumento);
        return ($cantEnMovimiento && $this->_mDocActivo->existeDocumento($idDocumento, 2)) ? true : false;
    }

    /**
     *
     */
    public function validarCancelar()
    {
        $idDocumento = $this->_post['iddocumento'];
        return ($this->_mDocActivo->existeDocumento($idDocumento, 2)) ? true : false;
    }

    /**
     *
     */
    public function validarConfirmar()
    {
        $idDocumento = $this->_post['iddocumento'];
        $sMovimiento = new MovimientoService();

        $cantEnMovimiento = $sMovimiento->getCantMediosEnMovByIdDocumento($idDocumento);
        if ($this->_post['docDesdeInventario']) {
            throw new ZendExt_Exception('LOG_AFT_DOC_004');
        }
        return ($cantEnMovimiento > 0 && $this->_mDocActivo->existeDocumento($idDocumento)) ? true : false;
    }

}
