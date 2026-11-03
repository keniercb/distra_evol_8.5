<?php

class SalidaModel extends DocumentoLogisticaModel
{
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
    }

    /**
     * Verifica que el documento tenga productos.
     * @param type $iddocumento (identificador de documento).
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => implode(',', Zend_Json::decode($iddocumento)))
        );
        if ($datosBusqueda['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param type $iddocumento (identificador de documento).
     * @return boolean
     */
    public function productosConCantidad($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => implode(',', Zend_Json::decode($iddocumento)))
        );
        if ($datosBusqueda['cantidad'] > 0) {
            foreach ($datosBusqueda['datos'] as $value) {
                if ($value['cantidad'] == 0) {
                    return false;
                }
            }
            return true;
        }
    }

}
