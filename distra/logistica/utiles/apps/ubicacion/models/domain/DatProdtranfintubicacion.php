<?php

class DatProdtranfintubicacion extends BaseDatProdtranfintubicacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEstructuraubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne('DatUbicacionproducto', array('local' => 'idestructuraubicacion', 'foreign' => 'idubicacion'));
        $this->hasOne('DatProdTransfInterna', array('local' => 'idprodtransfinterna', 'foreign' => 'idprodtransfinterna'));
    }

    /**
     * Devuelve los datos de la ubicacion.
     * @param numeric $idmovimiento
     * @return array
     */
    /*public function getMovDatosUbicacion($idmovimiento)
    {
        $query = Doctrine_Query::create()
            ->select('coalesce(sum(coalesce(mu.cantidad, 0)), 0) AS cantidad')
            ->from('DatProdTransfInterna mu')
            ->where('mu.idprodtransfinterna = ?', $idmovimiento);
        return $query->fetchArray()[0];
    }*/

    /**
     * Determina si el producto tiene cantidad disponible para todas las ubicaciones especificadas del movimiento.
     * @param numeric $idproducto
     * @param numeric $idmovimiento
     * @return boolean
     */
    /*public function productoDisponible($idproducto, $idmovimiento)
    {
        $query = Doctrine_Query::create()
            ->from('DatUbicacionproducto up')
            ->innerJoin('up.DatMovubicacion mu')
            ->innerJoin('mu.DatMovimientos m')
            ->where(
                'up.idproducto = ? AND m.idmovimiento = ? AND (up.cantidad - coalesce((SELECT sum(uc.cantidad) '
                . 'FROM DatUbicacionComprometida uc WHERE uc.idubicacion = mu.idubicacion '
                . 'AND uc.idproducto = m.idproducto AND uc.estado = 1), 0)) >= mu.cantidad',
                array($idproducto, $idmovimiento)
            );
        return $query->count() == 0;
    }*/

    /*public function eliminar($idmovubicacion)
    {
        Doctrine_Query::create()->delete('DatMovubicacion')->where("idmovubicacion = ? ", $idmovubicacion)->execute();
    }*/

    /*public function devolverEstructuras($params = false)
    {
        $where = '';
        if ($params && $params['idestructuraubicacion']) {
            $where .= " where mv.idestructuraubicacion = {$params['idestructuraubicacion']}";
        }
        $con = Doctrine_Manager:: connection();
        $sql = "Select  mv.idestructuraubicacion FROM mod_logubicacion.dat_movubicacion mv{$where}";
        $resp = $con->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }*/

    /**
     * Deevuelve los datos de la ubicación si es unica o false en caso contrario.
     * @param numeric $idproducto
     * @return array|boolean
     */
    /*public function getUbicacionUnica($idproducto)
    {
        $query = Doctrine_Query::create()
            ->select(
                'up.idubicacionproducto, up.idubicacion, up.idproducto, up.cantidad, '
                . '(up.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc '
                . 'WHERE uc.idubicacion = up.idubicacion AND uc.idproducto = up.idproducto), 0)) AS disponible'
            )
            ->from('DatUbicacionproducto up')
            ->where('up.idproducto = ? AND up.cantidad > 0', $idproducto);
        if ($query->count() == 1) {
            return $query->fetchOne()->toArray();
        }
        return false;
    }*/

}
