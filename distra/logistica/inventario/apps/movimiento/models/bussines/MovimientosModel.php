<?php

class MovimientosModel extends DocumentoLogisticaModel
{
    /**
     * @var LoteService
     */
    protected $loteService;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->loteService = new LoteService();
    }

    /**
     * Elimina el documento seleccionado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Devuelve los movimienntos.
     * @param array $filtro
     * @return boolean
     */
    public function devolverMovimientos($filtro, $dql = false)
    {
        return $this->getProductoModel()->devolverMovimientos($filtro, $dql);
    }

    /**
     * Devuelve la cantidad de movimientos del documentos.
     * @param numeric $iddocumento
     * @return integer
     */
    protected function cantidadMovimientos($iddocumento)
    {
        return Doctrine_Query::create()->from('DatMovimientos m')->where('m.iddocumento = ?', $iddocumento)->count();
    }
    
    /**
     * Elimina los movimiemientos seleccionados del documento.
     * @param array $idmovimientos
     * @param numeric $iddocumento
     * @return array
     */
    public function eliminarMovimientos($idmovimientos, $iddocumento)
    {
        $this->getProductoModel()->eliminarMovimientos(false, $idmovimientos, false, false);
        return array('cantproductos' => $this->cantidadMovimientos($iddocumento));
    }
    
    /**
     * Verifica que todas las hojas de inventario esten contabilizadas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function conteoFisico($iddocumento)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'inventariogLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $inventario = new InventarioModel();
        $query = $inventario->devolverDocumentos(null, true);
        $query->innerJoin('d.DatMovimientos _m')
            ->innerJoin('_m.DatMovimientos _m2 ON _m2.idproducto = _m.idproducto')
            ->innerJoin('_m2.DatDocumento _d2')
            ->addWhere(
                '_m2.iddocumento = ? AND d.idestructuracomun = _d2.idestructuracomun AND d.estado IN (1, 2) '
                . 'AND d.iddoc = ?', array($iddocumento, $objDocPrim->iddoc)
            )
            ->orderBy('d.iddocumento');
        if ($query->count() > 0) {
            return false;
        }
        return true;
    }
	
	public function checkPuedeCancelar($idDocumento){
		return true;
	}

}
