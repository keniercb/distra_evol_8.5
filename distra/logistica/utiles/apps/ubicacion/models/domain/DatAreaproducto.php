<?php

class DatAreaproducto extends BaseDatAreaproducto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatArea', array('local' => 'idarea', 'foreign' => 'idarea'));
    }

    /**
     * 
     * @param numeric $idarea
     * @return Doctrine_Query
     */
    public function devolverProductosXidArea($idarea)
    {
        $query = Doctrine_Query::create()
            ->select('ap.idarea, p.idproducto as idproducto, p.cantidad as existencia, p.disponible as disponible')
            ->from('DatAreaproducto ap')
            ->innerJoin('ap.DatProductoLogistica p')
            ->where('ap.idarea = ?', $idarea);
        return $query;
    }

    public function devolverPorductosUbicacionesVarias($idProd)
    {
        $conn = Zend_Registry::get('conexion');
        $query
            = "SELECT count(dup.idubicacion) as cant
                    FROM mod_logubicacion.dat_areaproducto dap
                    INNER JOIN mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dap.idproducto
                    WHERE dap.idproducto = $idProd
                    GROUP BY  dap.idproducto";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res[0]['cant'];
    }

}
