<?php
/**
 * Esta clase maneja las operaciones sobre las cantidades comprometidas de los productos en los diferentes
 * procesos que afecta el disponile de los productos. 
 * Esta introduccion se para controlar la actualizaciones concurrentes
 * del valor del disponible del producto
 * @author kenier
 */
class CantidadesComprometidasModel extends BaseModel
{
    /**
     * Constructor de la clase.
     */
    public function __construct()
    {
        parent::__construct();
        $this->tryInyector();
    }

    /**
     * Relaciona una tabla externa con la tabla DatCantidadesComprometidas.
     * @param Doctrine_Query $query
     * @param string $aliasExterno [Opcional]
     * @param string $aliasLocal [Opcional]
     * @param string $select [Opcional]
     * @param boolean $leftJoin [Opcional]
     */
    public function getJoinDatCantidadesComprometidas($query, $aliasExterno = 'd', $aliasLocal = '_cc', $select = '',
        $leftJoin = false)
    {
        if ($leftJoin) {
            $query->addSelect($select)->leftJoin("{$aliasExterno}.DatCantidadesComprometidas {$aliasLocal}");
        } else {
            $query->addSelect($select)->innerJoin("{$aliasExterno}.DatCantidadesComprometidas {$aliasLocal}");
        }
    }

    /**
     * Adiciona o modifica el registro de la cantidad comprometida asociada a un producto de un documento.
     * @param array $valores
     * @return boolean
     */
    public function insertarCantidadComprometida($valores)
    {
        if (!$valores['idcantidadcomprometida']) {
            $query = Doctrine_Query::create()
                ->from('DatCantidadesComprometidas _cc')
                ->where(
                    '_cc.iddocumento = ? AND _cc.idproducto = ?', array($valores['iddocumento'], $valores['idproducto'])
                )
                ->orderBy('_cc.idcantidadcomprometida');
            if ($valores['idcliente']) {
                $query->addWhere('_cc.idcliente = ?', $valores['idcliente']);
            }
            $prod = $query->fetchArray();
            $valores['idcantidadcomprometida'] = count($prod) > 0 ? $prod[0]['idcantidadcomprometida'] : null;
        }
        $record = new DatCantidadesComprometidas();
        if ($valores['idcantidadcomprometida']) {
            $record->assignIdentifier($valores['idcantidadcomprometida']);
        }
        $record->synchronizeWithArray($valores);
        $record->save();
        return true;
    }

    /**
     * Elimina los registros de cantidades comprometidas asociadas a los productos seleccionados de un documento.
     * @param numeric $iddocumento
     * @param array|numeric $idproducto [Opcional]
     * @param numeric|array $idcliente [Opcional]
     * @return boolean
     */
    public function eliminarCantidadComprometida($iddocumento, $idproducto = false, $idcliente = false)
    {
        $query = Doctrine_Query::create()
            ->delete('DatCantidadesComprometidas _cc')
            ->whereIn('_cc.iddocumento', $iddocumento);
        if ($idproducto) {
            $idproductos = is_array($idproducto) ? $idproducto : array($idproducto);
            $query->whereIn('_cc.idproducto', $idproductos);
        }
        if ($idcliente) {
            $idclientes = is_array($idcliente) ? $idcliente : array($idcliente);
            $query->andWhereIn('_cc.idcliente', $idclientes);
        }
        return $query->execute();
    }

    /**
     * Cambia el estado de los registros de cantidades comprometidas asociados a los productos de un documento.
     * @param numeric $estado
     * @param numeric $iddocumento
     * @param numeric $idcliente [Opcional]
     * @return boolean
     */
    public function cambiarEstado($estado, $iddocumento, $idcliente)
    {
        if ($estado == 2) {
            $productos = Doctrine_Query::create()
                ->select('_cc.idcantidadcomprometida, _cc.cantidad, poc.pendiente AS pendiente')
                ->from('DatCantidadesComprometidas _cc')
                ->innerJoin('_cc.DatProdorden po ON (po.idorden = _cc.iddocumento AND po.idproducto = _cc.idproducto AND _cc.idcliente = po.idcliente)')
                ->innerJoin('po.DatProdordencmpto poc')
                ->innerJoin('po.DatDocumentoPadre dp ON (dp.idpadre = po.idorden)')
                ->where('dp.iddocumento = ?', $iddocumento)
                ->orderBy('poc.cantidadoriginal ASC')
                ->fetchArray();
            foreach ($productos as $value) {
                if ($value['pendiente'] == 0) {
                    $value['estado'] = $estado;
                } else {
                    $value['cantidad'] = $value['pendiente'];
                }
                $this->insertarCantidadComprometida($value);
            }
        }
        $query = Doctrine_Query::create()
            ->update('DatCantidadesComprometidas')
            ->set('estado', $estado)
            ->where('iddocumento = ? ', $iddocumento);
        if ($idcliente) {
            $query->addWhere('idcliente = ?', $idcliente);
        }
        return $query->execute();
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatCantidadesComprometidas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatCantidadesComprometidas',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatCantidadesComprometidas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatDocumentoCliente(), $relations);
        if ($this->existComponent('log.dist.distribucion') && class_exists('DatProdorden')) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatDocumentoPadre',
                'properties' => array('local' => 'idorden', 'foreign' => 'idpadre')
            );
            $this->doctrineHelper->tryInyectRelactions(new DatProdorden(), $relations);
        }
    }

}
