<?php

/**
 * @class     DesbloqueoInterceptor
 * Interceptor que se encarga de verificar el
 * bloqueo de los documentos
 * desde las acciones  de los controladores
 * @namespace Logistica\Utiles\Documento\Models
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
class BloqueoInterceptor extends AbstractInterceptor
{

    private $bloqueoModel, $documentoModel, $action;

    public function __construct($object, $params)
    {
        parent::__construct($object);
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->bloqueoModel = new BloqueoDocumentoModel($this->documentoModel);
        $this->action = $params['action'];
    }

    /**
     * Acción para bloquear un documento
     * @params $object Objeto de la clase controladora
     * @params $method Acción que se ejecuta
     * @params $args Arreglo que contiene el
     * identificador del documento
     *
     * @return null
     */
    public function around($object, $method, $args)
    {
        if ($this->isLockable($method)) {
            if ($args['iddocumento']) {
                $iddocumento = $args['iddocumento'];
            } else {
                $iddocumento = Zend_Json::decode($args['id'])[0];
            }
            if (!$this->bloqueoModel->bloquearDocumento($iddocumento)) {
                throw new ZendExt_Exception('LOG_LB_DOC_002');
            }
        }
    }

    /**
     * Función para conocer si determinada acción
     * que bloquea un documento
     * en la entidad
     * @params $method Acción que se ejecuta
     *
     * @return Valor booleano(true o false)
     */
    public function isLockable($method)
    {
        $strMethod = substr($method, 0, -6);

        switch ($strMethod) {
//            case 'cargarDocumentos':
            case 'aprobarestadodocumento':
            case 'cargarproductosdocumento':
            case 'eliminardocumento':
            case 'anularestadodocumento':
            case 'confirmardocumento':
                return true;
            default:
                return false;
        }
    }

//    public function initLock($uiParams)
//    {
//        if ($uiParams['iddocumento']) {
//            print_r($uiParams);
//            die();
//        }
//    }

}
