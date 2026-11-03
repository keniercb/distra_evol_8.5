<?php
/**
 * Description of CantidadesComprometidasModel
 * Esta clase maneja las operaciones sobre las cantidades comprometidas de los productos en los diferentes
 * procesos que afecta el disponile de los productos.
 * Esta introduccion se para controlar la actualizaciones concurrentes
 * del valor del disponible del producto
 * @author kenier
 */
class UbicacionComprometidaModel extends BaseModel
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
     * Adiciona o modifica el registro de la cantidad comprometida por ubicacion asociada a un producto de un documento.
     * @param array $datos
     * @return boolean
     */
    public function adicionarUbicacionComprometida($datos)
    {
        $this->chekDisponible($datos);
        if (!$datos['idubicacioncomprometida']) {
            if ($datos['idlote']) {
                $where = "AND idlote = " . $datos['idlote'];
            }
            $compromiso = Doctrine::getTable('DatUbicacionComprometida')
                ->findByDql(
                    "idubicacion = ? AND iddocumento = ? AND idproducto = ? {$where}",
                    array($datos['idubicacion'], $datos['iddocumento'], $datos['idproducto'])
                )
                ->getFirst();
            $datos['idubicacioncomprometida'] = $compromiso->idubicacioncomprometida;
        }
        $record = new DatUbicacionComprometida();
        if ($datos['idubicacioncomprometida']) {
            $record->assignIdentifier($datos['idubicacioncomprometida']);
        }
        $record->synchronizeWithArray($datos);
        $record->save();
        return true;
    }

    /**
     * Elimina los registros de cantidades comprometidas por ubicacion asociadas a los productos
     * seleccionados de un documento.
     * @param numeric $iddocumento [Opcional]
     * @param array|numeric $idproducto [Opcional]
     * @param array|numeric $idubicacioncomprometida [Opcional]
     * @return boolean
     */
    public function eliminarUbicacionComprometida($iddocumento, $idproducto, $idubicacioncomprometida)
    {
        $query = Doctrine_Query::create()->delete('DatUbicacionComprometida');
        if ($iddocumento) {
            $query->where('iddocumento = ?', $iddocumento);
        }
        if ($idproducto) {
            $idproductos = is_array($idproducto) ? $idproducto : array($idproducto);
            $query->whereIn('idproducto', $idproductos);
        }
        if ($idubicacioncomprometida) {
            $idcomprometidas = is_array($idubicacioncomprometida) ? $idubicacioncomprometida :
                array($idubicacioncomprometida);
            $query->removeDqlQueryPart('where');
            $query->whereIn('idubicacioncomprometida', $idcomprometidas);
        }
        if ($iddocumento || count($idproductos) > 0 || count($idcomprometidas) > 0) {
            $query->execute();
        }
        return true;
    }

    /**
     * Cambia el estado de los registros de cantidades comprometidas por ubicacion asociados a los productos
     * de un documento.
     * @param numeric $iddocumento
     * @param numeric $estado
     * @return boolean
     */
    public function cambiarEstado($iddocumento, $estado)
    {
        Doctrine_Query::create()
            ->update('DatUbicacionComprometida')
            ->set('estado', $estado)
            ->where('iddocumento = ?', $iddocumento)
            ->execute();
        return true;
    }

    /**
     * Verifica si hay canidad disponible para la ubicacion.
     * @param array $datos
     * @return boolean
     * @throws ZendExt_Exception Excepcion que lanza si la disponibilidad se hace negativa.
     */
    private function chekDisponible($datos)
    {
        $filtro = array($datos['idubicacion'], $datos['idproducto'], $datos['iddocumento'], $datos['cantidad']);
        $query = Doctrine_Query::create()->from('DatUbicacionproducto up')->orderBy('up.idubicacionproducto');
        $cantidad = "up.cantidad";
        if ($datos['idlote']) {
            $query->leftJoin('up.DatUbicacionlote ul')->where('ul.idlote = ?', $datos['idlote']);
            $cantidad = "ul.cantidad";
            $where = "AND uc.idlote = ul.idlote";
            $subwhere = "AND _uc.idlote = ul.idlote";
        }
        $query->addWhere(
            "up.idubicacion = ? AND up.idproducto = ? AND (({$cantidad} - coalesce((SELECT sum(uc.cantidad) "
            . "FROM DatUbicacionComprometida uc WHERE uc.idubicacion = up.idubicacion "
            . "AND uc.idproducto = up.idproducto {$where} AND uc.estado = 1), 0)) + (coalesce((SELECT _uc.cantidad "
            . "FROM DatUbicacionComprometida _uc WHERE _uc.cantidad > 0 AND _uc.idubicacion = up.idubicacion "
            . "AND _uc.idproducto = up.idproducto {$subwhere} AND _uc.iddocumento = ? "
            . "AND _uc.estado = 1), 0) - ?)) < 0", $filtro
        );
        if ($query->count() > 0) {
            print_r($datos);
            //throw new ZendExt_Exception('LOG_LB_UBI_006');
        }
        return true;
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatUbicacionComprometida',
            'properties' => array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatEstructuraubicacion(), $relations);
        if (class_exists('DatDocumento')) {
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatUbicacionComprometida',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
            );
            $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        }
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatUbicacionComprometida',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
    }

}
