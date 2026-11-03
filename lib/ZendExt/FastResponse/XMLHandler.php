<?php
/**
 * ZendExt_FastResponse_AbstractPDONomLoader
 *
 * Gestor de XML
 *
 * @author     : Omar Antonio Diaz Peña
 * @package    : ZendExt
 * @subpackage ZendExt_FastResponse
 * @copyright  : UCID-ERP Cuba
 * @version    1.0-0
 */
class ZendExt_FastResponse_XMLHandler
{
    /**
     * getXML
     *
     * Obtiene el xml segun un identificador
     *
     * @return SimpleXMLElement - objeto mapeado a partir de un xml
     */
    public function getXML($pIdXML)
    {
        $xml = '';

        $configInstance = Zend_Registry::get('config')->xml;
        if (file_exists($configInstance->$pIdXML)) {
            $xml = @simplexml_load_file($configInstance->$pIdXML);
            if (!$xml instanceof SimpleXMLElement) {
                throw new ZendExt_FastResponse_Exception($pIdXML, true);
            }
        } else {
            throw new ZendExt_FastResponse_Exception($pIdXML, false);
        }
        return $xml;
    }
}

