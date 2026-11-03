<?php

/**
 * @class SolicitudentregaModel
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
class SolicitudentregaModel extends SalidaModel
{
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatEntrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
    }

    /**
     * Adiciona una solicitud de entrega.
     * @param array $datosDoc
     * @return numeric
     */
    public function adicionarDocumento($datosDoc = array())
    {
        $datosDoc['clientes'][] = array(
            'idcliente' => $datosDoc['descripcliente'],
            'tipocliente' => LogisticaGlobal::TIPO_CLIENTE_CENTRO
        );
        $documento = parent::adicionarDocumento($datosDoc);
        if($datosDoc['idordenproduccion']){
            $documento->estado = 2;
            $obDocPadre = new DatDocumentoPadre();
            $obDocPadre->idpadre = $datosDoc['idordenproduccion'];
            $documento->DatDocumentoPadre->add($obDocPadre);
        }
        $documento->save();
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $this->producto->adicionarMovimientos($documento->iddocumento, $datosDoc['idproductos']);
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $this->producto->modificarMovimientos($datosDoc['productos']);
        }
        if (is_numeric($datosDoc['descripcliente'])) {
            $idClientes = array();
            $idClientes[] = array(
                'idcliente' => $datosDoc['descripcliente'],
                'tipocliente' => LogisticaGlobal::TIPO_CLIENTE_CENTRO
            );
            $this->adicionarClientes($documento->iddocumento, $idClientes, true);
        }
        return array('iddocumento' => $documento->iddocumento, 'numeroref' => $documento->numeroref, 'fechacontable' => $documento->fechacontable);
    }

    /**
     * Metodo para devolver los documentos de solicitud de entrega
     * @param array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @param boolean $dql [Opcional]
     * @return array
     */
    public function devolverDocumentos($datosDoc = array(), $dql = false)
    {
       $query = parent::devolverDocumentos($datosDoc);
       /* $query->leftJoin("d.DatDocumentoPadre dp")
            ->leftJoin("dp.DatDocumento dd")
            ->leftJoin("dd.DatDocumentoprim ddp")
            ->leftJoin("ddp.NomDocprim ndp");else ' - '
        $query->addSelect('dd.nrodoc as nroDoc, ndp.denominacion as tipoDoc, dd.fechacontable as fecha');*/
        $query->addSelect('ddpadre.fechacontable as fecha');
        $query->addSelect('ddpadre.nrodoc as nroDoc');
        $query->addSelect('ndprim.denominacion as tipoDoc');
        $query->leftJoin("d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)");
        $query->leftJoin("dp.DatDocumento ddpadre ON (ddpadre.iddocumento = dp.idpadre)");
        $query->leftJoin("ddpadre.DatDocumentoprim dprim");
        $query->leftJoin("dprim.NomDocprim ndprim");
     
        if ($dql) {
            return $query;
        }
      //  print_r($query->getSqlQuery());die;
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Metodo para eliminar el documento con los movimientos del producto correspondientes.
     * @params numeric $iddocumento
     * @params boolean  en false
     * @params boolean $afecta Variable que indica si la operacion afecta un documento de ajuste de inventario.
     * @return numeric
     */
    public function eliminarDocumento($iddocumento)
    {
        $this->getProductoModel()->eliminarMovimientos($iddocumento, false, false, false);
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Aprueba el documento seleccionado.
     * @param numeric $iddocumento Identificador del documento a aprobar
     * @return boolean
     */
    public function aprobarDocumento($iddocumento, $setCronologia = true)
    {
        $mov = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($iddocumento))->toArray();
        $collectCmplto = new Doctrine_Collection('DatProductocmplto');
        $collectMov = new Doctrine_Collection('DatMovimientos');
        foreach ($mov as $item) {
            $cmplto = new DatProductocmplto();
            $cmplto->synchronizeWithArray(
                array(
                    'idproducto' => $item['idproducto'], 'iddocumento' => $iddocumento, 'cantidad' => $item['cantidad'],
                    'pendiente' => $item['cantidad']
                )
            );
            $collectCmplto->add($cmplto);
            $prod = Doctrine::getTable('DatProductoLogistica')->find($item['idproducto']);
            $mov = Doctrine::getTable('Datmovimientos')->find($item['idmovimiento']);
            $mov->existenciaactual = $prod->cantidad;
            $collectMov->add($mov);
        }
        if ($collectCmplto->count()) {
            $collectCmplto->save();
        }
        if ($collectMov->count()) {
            $collectMov->save();
        }
        return parent::aprobarDocumento($iddocumento, $setCronologia);
    }

    /**
     * Duplica el documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return array
     */
    public function copiarDocumento($iddocumento)
    {
        $idCopia = parent::copiarDocumento($iddocumento);
        $cliente = Doctrine::getTable('DatDocumentoCliente')
            ->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        if ($cliente) {
            $newcliente = $cliente->copy();
            $newcliente->iddocumentocliente = null;
            $newcliente->iddocumento = $idCopia;
            $newcliente->save();
        }
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        return array('iddocumento' => $idCopia, 'observaciones' => $doc->observaciones);
    }

    /**
     * Eliminar el o los movimientos seleccionados.
     * @param array $arrayidmovimientos
     * @return boolean
     */
    public function eliminarMovimientos($arrayidmovimientos)
    {
        $this->getProductoModel()->eliminarMovimientos(false, $arrayidmovimientos, false, false);
        return true;
    }
}
