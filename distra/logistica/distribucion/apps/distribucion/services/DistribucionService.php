<?php

/**
 * @class DistribucionService
 * Aqui se encuentran todos los servicios de movimiento
 *
 * @copyright XETID
 * @author DivisiÃ³n de GestiÃ³n de Entidades
 * @version 1.0
 */
class DistribucionService extends ZendExt_Model
{
    private $_model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_model = new DistribucionModel(
            array('alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_DIST)
        );
    }

    public function devolverDocDistribucion($datosDoc)
    {
        $documento = $this->_model->devolverDocumentos($datosDoc);
        return $documento;
    }

    public function adicionarDocDistribucionRotacion($datosDoc)
    {
        $datosDoc ['action'] = 'adicionarDocumento';
        $datosDoc['idnomconcepto'] = null;
        $datosDoc['tipodestino'] = 1;
        $datosDoc['tipodistribucion'] = 4;
        $datosDoc['tipo'] = 5;
        $datosDoc['iddocumento'] = $this->_model->adicionarDocumento($datosDoc)['iddocumento'];
        $datosDoc['datos'] = $this->_model->adicionarMovimientos($datosDoc)['productos'];
        $this->_model->salvarCantidades($datosDoc);
        $this->_model->confirmarDocumento($datosDoc['iddocumento']);
        $this->_model->aprobarDocumento($datosDoc);
        return $datosDoc['iddocumento'];
    }

    public function devolverClientes($datosDoc)
    {
        $documento = $this->_model->devolverClientes($datosDoc);
        return $documento;
    }

    public function devolverProductosDistribucion($datosDoc)
    {
        $productos = $this->_model->devolverMovimientos($datosDoc);
        return $productos;
    }

    public function devolverProductosDistribucionFact($datosDoc)//esto es una prueba
    {
        $productos = $this->_model->devolverMovimientosParaFact($datosDoc);
        return $productos;
    }

    public function devolverCantidadPendiente($parametros)
    {
        $prodordenModel = new ProdordenModel();
        return $prodordenModel->devolverCantidadPendiente($parametros);
    }

    public function getCantidadProducto($idproducto, $documentos, $cliente)//se utiliza en facturacion
    {
        $objProdOrden = new DatProdorden();
        return $objProdOrden->getCantidadProducto($idproducto, $documentos, $cliente);
    }

    public function getDepositosDistribucion($documento, $idcliente)//se utiliza en facturacion
    {
        $objProdOrden = new DatProdorden();
        return $objProdOrden->getDepositosDistribucion($documento, $idcliente);
    }

    public function getEntregadoProceso($parametros) //se utiliza en facturacion
    {
        $objProdOrden = new DatProdorden();
        return $objProdOrden->getEntregadoProceso($parametros);
    }


    /**
     * Genera los documentos de distribucion por balanceo.
     * @param array $datosDoc
     * @return array
     */

    public function adicionarDocDistribucionBalanceo($datosDoc)
    {
        $datosDoc['action'] = 'adicionarDocumento';
        $datosDoc['idnomconcepto'] = null;
        $datosDoc['tipodistribucion'] = 6;
        $datosDoc['tipodestino'] = 3;
        $datosDoc['salidaporfactura'] = 0;
        $datosDoc['iddocumentos'] = $this->_model->adicionarDocumentoBalanceo($datosDoc);
        return $datosDoc['iddocumentos'];
    }

}
