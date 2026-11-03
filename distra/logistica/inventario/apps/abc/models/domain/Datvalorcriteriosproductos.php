<?php

class Datvalorcriteriosproductos extends BaseDatvalorcriteriosproductos
{

    public function setUp()
    {
        $this->hasMany('Confperiodosclasificacionabc', array('local' => 'idconfperiodosclasificacionabc', 'foreign' => 'idconfperiodosclasificacionabc'));
        $this->hasMany('Nomcriteriovaloracion', array('local' => 'idcriteriovaloracion', 'foreign' => 'idcriteriovaloracion'));
        parent::setUp();
    }

    public function obtenerValoresCriterios($arrEstructuras, $idconfperiodo)
    {
        $mg = Doctrine_Manager::getInstance();
        $cc = $mg->getCurrentConnection();
        $cc->execute("SET enable_indexscan TO TRUE;");
        $cc->execute("SET enable_seqscan TO FALSE;");

        $sql = "SELECT idestructura, idindicador, valor1, valor2, valor3
        FROM mod_logabc.dat_valorcriteriosproductos
        WHERE idconfperiodosclasificacionabc = {$idconfperiodo} AND idestructura IN (".implode(',', $arrEstructuras).")
        ORDER BY idestructura DESC";

        return $cc->fetchAll($sql);
    }

    public function obtenerValorDadoCriterioPeriodoProducto($idconfperiodo, $idestructura, $arrProductos)
    {
        $mg = Doctrine_Manager::getInstance();
        $cc = $mg->getCurrentConnection();
        $cc->execute("SET enable_indexscan TO TRUE;");
        $cc->execute("SET enable_seqscan TO FALSE;");

        $sql = "SELECT idvalorcriteriosproductos, idcriteriovaloracion, valor, idestructura, 
                   idconfperiodosclasificacionabc, idproducto
              FROM mod_logabc.dat_valorcriteriosproductos
              WHERE idconfperiodosclasificacionabc = {$idconfperiodo} AND idestructura = {$idestructura} 
              AND idproducto IN (".implode(',', $arrProductos).")";

        return $cc->fetchAll($sql);

    }


}
