<?php

class DocumentoActivoService extends ZendExt_Model
{

    protected $_docModel;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_docModel = new DocumentoActivoModel();
    }

    public function getDocActivosPendientes($parametros = array())
    {
        return $this->_docModel->getDocumentosActivos($parametros);
    }

    /*
     * Devuelve los documentos dado el arreglo de filtros
     * $parametros = array(
      'codigooperacion' => 'OPER_APERTURA',
      'idestado' => 2
      );
     * */

    public function obtenerDocumentos($parametros)
    {
        return $this->_docModel->getDocumentos($parametros);
    }

    /*
     * Aprueba Documento
     * */

    public function aprobarDocumento($iddocumento, $idoperacion, $identidad, $observacion = "")
    {
        $objGesDocModelo = DocumentoActivoFactory::getInstance($idoperacion, LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $estado = $objGesDocModelo->aprobarDocumento(
            $iddocumento, $idoperacion, $observacion, $identidad
        );

        $historialRNEstadosModel = new HisRegNumericoEstatusModel();
        $historialRNEstadosModel->guardarHistorialRegNumEstatus($this->uiParams['iddocumento']);


        $arr = array();
        if ($estado) {
            $arr['success'] = true;
            $arr['estado'] = 'Aprobado';
            $arr['idestado'] = 3;
        } else {
            $arr['failure'] = true;
            $arr['Cod'] = 3;
        }
        return $arr;
    }

}
