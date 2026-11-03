<?php

class DatPlanconsumo extends BaseDatPlanconsumo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomIndicador', array('local' => 'idproducto', 'foreign' => 'idindicador'));
        //$this->hasOne ('DatPedido', array('local' => 'iddocumento', 'foreign' => 'idpedido'));
    }

    public function getFiltro($filter)
    {
        $query = Doctrine_Query::create();
        if ($filter->codigo) {
            $query->addWhere("lower(i.codigo) like '%" . strtolower($filter->codigo) . "%'");
        }
        if ($filter->idprod) {
            $query->addWhere("dpc.idproducto = $filter->idprod");
        }
        if ($filter->idcliente) {
            $query->addWhere("dpc.idcliente = $filter->idcliente");
        }
        if ($filter->descripcion) {
            $query->addWhere("lower(i.denominacion) like '%" . strtolower($filter->descripcion) . "%'");
        }

        return $query;
    }

    /**
     * Funcion que parametriza la cantidad de resultados que se devuelve en una consulta
     *
     * @param Doctrine_Query $dql
     * @param array          $params Arreglo que contiene los parametros de offset y limite
     *
     * @return Doctrine_Query El query
     */
    public function addQueryLimits(Doctrine_Query $dql, $params = array())
    {
        if ($params['limit']) {
            $dql->offset($params['start'])->limit($params['limit']);
        }
        return $dql;
    }

    public function getQueryPlanConsumo()
    {
        $query = Doctrine_Query::create();
        $query->select(
            "dpc.idplanconsumo,
                dpc.idcliente,
                dpc.idproducto,
                dpc.idestructura,
                dpc.planconsumo,
                dpc.politicacobertura,
                dpc.existencia,
                dpc.minimo,
                dpc.maximo,
                dpc.enproceso,
                dpc.entregado,
                dpc.pendiente,
                dpc.fechaplanconsumo,
                dpc.fechapoliticacobertura,
                dpc.fechaexistencia,
                dpc.fechaminimo,
                dpc.fechamaximo"
        )
            ->from('DatPlanconsumo dpc')
            ->orderBy('dpc.idplanconsumo ASC');
        return $query;
        //
    }

    public function addWhereQuery($query, $params)
    {
        if ($params['codigo']) {
            $query->addWhere("lower(i.codigo) like '%" . strtolower($params['codigo']) . "%'");
        }
        if ($params['idprod']) {
            $query->addWhere("dpc.idproducto =?", array($params['idprod']));
        }
        if ($params['idcliente']) {
            $query->addWhere("dpc.idcliente =?", array($params['idcliente']));
        }
        if ($params['descripcion']) {
            $query->addWhere("lower(i.denominacion) like '%" . strtolower($params['descripcion']) . "%'");
        }

        if (count($params['arProd']) > 0) {
            $query->addWhereIn("dpc.idproducto", $params['arProd']);
        }
        if (count($params['arClient']) > 0) {
            $query->addWhereIn("dpc.idcliente", $params['arClient']);
        }
        $query->addWhere("dpc.idestructura =?", $params['idestructura']);

        return $query;
    }

    public function getDatasClienteById($idcliente)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = " SELECT
                   ncp.idclientesproveedores as idcliente,
                   ncp.codigo as codigo,
                   ncp.nombre as nombre
		FROM
		  mod_nomencladores.nom_clientesproveedores ncp
		WHERE ncp.idclientesproveedores = $idcliente";
        $resultado = $conn->fetchAll($query);
        return $resultado;
    }

    public function checkExistencia($cliente, $producto)
    {
        $query = new Doctrine_Query();
        $resultado = $query->select('dpc.idplanconsumo')
            ->from('DatPlanconsumo dpc')
            ->where("dpc.idcliente = ? AND dpc.idproducto =?", array($cliente, $producto))
            ->count();
        return $resultado;
    }

    public function isExisteProductos($producto)
    {
        $query = new Doctrine_Query();
        $resultado = $query->select('dpc.idplanconsumo')
            ->from('DatPlanconsumo dpc')
            ->where("dpc.idproducto =?", array($producto))
            ->count();
        return $resultado;
    }

    public function obtenerIDPlanConsumo($idcliente, $idproducto, $idcontrato)
    {
        $query = new Doctrine_Query();
        return $query->select('dpc.idplanconsumo')
            ->from('DatPlanconsumo dpc')
            ->where(
                "dpc.idcliente =? and dpc.idproducto =? and dpc.idcontrato =?",
                array($idcliente, $idproducto, $idcontrato)
            )
            ->fetchArray();
    }

    public function getDatosConsumoCritico($fechacontable, $limit, $start)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "
        SELECT dpc.idcliente as idcliente,
        dpc.idplanconsumo as idplanconsumo,
        dpc.idcontrato as idcontrato,
        dpc.idproducto as idproducto,
        round(dpc.planconsumo / 365, 6) as pdiario,
        coalesce (dpc.politicacobertura, 0) - ('$fechacontable'::date - dpc.fechaexistencia::date) as cantdiasconf,
        case when ((round(dpc.planconsumo / 365, 6) *
        ('$fechacontable'::date - dpc.fechaexistencia::date)) > (dpc.existencia -
        ('$fechacontable'::date - dpc.fechaexistencia::date) * round(dpc.planconsumo/365, 6)))
         then 1 else 0 end as porconsumo,
        case when (('$fechacontable'::date - dpc.fechaexistencia::date) =
        coalesce (dpc.politicacobertura, 0)  - ('$fechacontable'::date - dpc.fechaexistencia::date))
         then 1 else 0 end as porcobertura,
        dpc.existencia - ('$fechacontable'::date - dpc.fechaexistencia::date) *
        round(dpc.planconsumo/365, 6) as existenciatr,
        ('$fechacontable'::date - dpc.fechaexistencia::date) as cantdias,
        round(dpc.planconsumo / 365, 6) * ('$fechacontable'::date - dpc.fechaexistencia::date) as consumo,
        dpc.existencia as existencia,
        ni.denominacion as denominacion
        FROM mod_logdistribucion.dat_planconsumo dpc
        INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dpc.idproducto
        WHERE ni.idindicador = dpc.idproducto AND dpc.existencia IS NOT NULL AND dpc.politicacobertura IS NOT NULL
        AND ((round(dpc.planconsumo / 365, 6) *
        ('$fechacontable'::date - dpc.fechaexistencia::date)) >
        (dpc.existencia - ('$fechacontable'::date - dpc.fechaexistencia::date)* round(dpc.planconsumo/365, 6))
        OR (('$fechacontable'::date - dpc.fechaexistencia::date) =
         coalesce (dpc.politicacobertura, 0) - ('$fechacontable'::date - dpc.fechaexistencia::date)))";

        $count = $conn->execute($sql);
        $sql .= " limit {$limit} offset {$start}";
        $datos = $conn->execute($sql);
        return array('cantidad' => $count->rowCount(), 'datos' => $datos->fetchAll(PDO::FETCH_ASSOC));
    }

    public function getDatosPlanConsumo($idestructura, $idproducto)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            "dpc.idplanconsumo, dpc.planconsumo, dpc.politicacobertura"
        )->from('DatPlanconsumo dpc')
            ->where(
                'dpc.idestructura = ? and dpc.idproducto = ? and dpc.existencia IS NOT NULL
         AND dpc.politicacobertura IS NOT NULL',
                array($idestructura, $idproducto)
            )
            ->orderBy('dpc.idplanconsumo ASC')
            ->fetchArray();
    }

    public function getPlanConsumoByProductoCliente($idestructura, $idproductos, $idclientes)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            "dpc.idplanconsumo, dpc.existencia, dpc.planconsumo, dpc.politicacobertura, dpc.maximo, dpc.minimo,
            dpc.fechaexistencia"
        )->from('DatPlanconsumo dpc')
            ->where(
                'dpc.idestructura = ? and dpc.idproducto IN ? and dpc.idcliente IN ? and dpc.existencia IS NOT NULL
         AND dpc.politicacobertura IS NOT NULL',
                array($idestructura, $idproductos, $idclientes)
            )
            ->orderBy('dpc.idplanconsumo ASC')
            ->fetchArray();
    }


}
