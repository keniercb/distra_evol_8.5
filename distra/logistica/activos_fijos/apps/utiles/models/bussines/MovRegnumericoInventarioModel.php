<?php

class MovRegnumericoInventarioModel extends MovRegnumericoActivoModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getMovRegNumericoInventario($alias, $select = false, $paramsWhere = array())
    {
        $query = new Doctrine_Query();
        $query->from("DatMovRegnumericoInventario {$alias}");
        $query->select("{$alias}.idmovregnumerico");

        if ($select) {
            $this->getSelectMovRegNumericoInventario($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereMovRegNumericoInventario($query, $alias, $paramsWhere);
        }

        return $query;
    }

    public function getJoinMovRegNumericoInventario(
    Doctrine_Query &$query, $alias, $aliasExt, $join = 1, $select = false, $paramsWhere = array()
    )
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("DatMovRegnumericoInventario {$alias}");
        } else {

            if ($join) {
                $query->innerJoin("{$aliasExt}.DatMovRegnumericoInventario {$alias}");
            } else {
                $query->leftJoin("{$aliasExt}.DatMovRegnumericoInventario {$alias}");
            }
        }

        if ($select) {
            $this->getSelectMovRegNumericoInventario($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereMovRegNumericoInventario($query, $alias, $paramsWhere);
        }
    }

    public function getSelectMovRegNumericoInventario(Doctrine_Query &$query, $alias, $postAlias = '')
    {
        $columnNames = Doctrine::getTable('DatMovRegnumericoInventario')->getColumnNames();

        foreach ($columnNames as $columna) {
            $query->addSelect("{$alias}.{$columna} AS {$columna}$postAlias");
        }
    }

    public function getWhereMovRegNumericoInventario(Doctrine_Query &$query, $alias, $paramsWhere = array())
    {
        ComunAFTModel::getInstance()->getFiltroGenerico($query, $alias, 'DatMovRegnumericoInventario', $paramsWhere);
    }

    public function contarTodos($iddocumento) {
      $sql = "
        INSERT INTO 
          mod_logactivofijotangible.dat_movregnumericoinventario
        (
          idmovregnumerico,
          color
        )
        SELECT mrn.idmovregnumerico, 'negro'
        FROM mod_logactivofijotangible.dat_movregnumerico mrn
        INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
        WHERE m.iddocumento = {$iddocumento}

        ON CONFLICT ON CONSTRAINT dat_movregnumericoinventario_pkey
        DO 
          UPDATE SET color = 'negro'
      ";
      $conn = Zend_Registry::get('conexion');
      $query = $conn->prepare($sql);
      $query->execute();
      
    }

}
