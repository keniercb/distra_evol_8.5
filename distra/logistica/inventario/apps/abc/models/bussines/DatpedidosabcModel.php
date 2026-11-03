<?php

class DatpedidosabcModel extends BaseModel
{

    private $conexion = null;
    private $estadosPedidos = [
        1 => 'Elaboración',
        2 => 'Preparado',
        3 => 'Aprobado',
        4 => 'Contabilizado',
        5 => 'Eliminado',
        6 => 'Anulado',
        7 => 'Cancelado',
        8 => 'Cancelado-Duplicado',
        9 => 'Cerrado',
        10 => 'Propuesto a Cancelar',
        11 => 'Revisado',
        12 => 'Conciliado',
        13 => 'Pre-elaborado',
        14 => 'Aprobado con prórroga',
        15 => 'Prorrogar',
        -1 => 'Sin estado'
    ];

    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $mg = Doctrine_Manager::getInstance();
        $this->conexion = $mg->getCurrentConnection();
    }

    public function obtenerPedidosABC($limit, $start, $idestructura, $idconf = null, $idnaturaleza = null,
                                      $criterio = null)
    {
        try {
            $sql = "SELECT 
                    dpabc.idpedidoabc, 
                    dpabc.idpedido, 
                    dpabc.idconfperiodosclasificacionabc, 
                    dd.nrodoc, 
                    dd.estado, 
                    dpabc.fecha, 
                    dp.fechavencimiento, 
                    (cpc.fechainicio || ' - ' || cpc.fechafin) AS periodo,
                    cpc.naturalezas
                      FROM mod_logabc.dat_pedidosabc dpabc
                      JOIN mod_logdistribucion.dat_pedido dp ON dp.iddocumento = dpabc.idpedido
                      JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dp.iddocumento
                      JOIN mod_logabc.conf_periodosclasificacionabc cpc ON cpc.idconfperiodosclasificacionabc 
                      = dpabc.idconfperiodosclasificacionabc AND cpc.cerrado = 1
                      WHERE dpabc.idestructura = ? ";

            $where = "";
            if (!empty($idconf)) {
                $where .= " AND dpabc.idconfperiodosclasificacionabc = {$idconf}";
            }
            if (!empty($iddeposito)) {
                $where .= " AND dpp.iddeposito = {$iddeposito}";
            }
            if (!empty($criterio)) {
                $where .= " AND dd.nrodoc ILIKE '%" . $criterio . "%'";
            }

            $sql .= $where;

            $sql .= " ORDER BY dpabc.fecha DESC";
            $sql .= " LIMIT {$limit} OFFSET {$start} ";

            $r = $this->conexion->fetchAll($sql, array($idestructura));

            $arrNat = $this->conexion
                ->fetchAll("SELECT idnaturaleza, codigo FROM mod_datosmaestros.nom_naturaleza;");
            $arrNaturalezas = array();
            foreach ($arrNat as $n) {
                $arrNaturalezas[$n['idnaturaleza']] = $n['codigo'];
            }

            foreach ($r as &$item) {
                $item['estadomostrar'] = $this->estadosPedidos[$item['estado']];
                $aN = json_decode(stripslashes($item['naturalezas']));
                foreach ($aN as &$nat) {
                    $nat = $arrNaturalezas[$nat];
                }
                $item['naturalezas'] = implode(',', $aN);
            }

            $sqlc = "SELECT count(*) AS cantidad
              FROM mod_logabc.dat_pedidosabc dpabc
              INNER JOIN mod_logdistribucion.dat_pedido dp ON dp.iddocumento = dpabc.idpedido
              INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dp.iddocumento
              INNER JOIN mod_logabc.conf_periodosclasificacionabc cpc ON cpc.idconfperiodosclasificacionabc 
              = dpabc.idconfperiodosclasificacionabc AND cpc.cerrado = 1
              WHERE dpabc.idestructura = ?" . $where;
            $rc = $this->conexion->fetchAll($sqlc, array($idestructura));

            return array('codigo' => 1, 'datos' => $r, 'cantidad' => $rc[0]['cantidad']);

        } catch (Exception $e) {
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }

    }

    public function obtenerProductosPeriodoConf($idconf, $idueb, $iddeposito)
    {
        /*Busco todos los productos que su existencia este por debajo del punto de pedido y calculo la diferencia
        * entre la existencia maxima y la existencia en el deposito para hacer el pedido
        */
        $sql = "SELECT dp.idindicador AS idproducto, i.numeropieza AS codigo, 
        i.denominacion AS producto, round(dpp.valor, 0) AS existenciamaxima, 
        round(dp.cantidad, 0) AS existenciadeposito, round((dpp.valor - dp.cantidad), 0) AS pedido
        FROM mod_logabc.dat_parametrizacionproductos dpp
        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = dpp.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = dp.idindicador
        WHERE dpp.idestructura = ? 
        AND dpp.idconfperiodosclasificacionabc = ? 
        AND dpp.iddeposito = ? 
        AND dpp.idparametrosinventario = 26
        AND dp.cantidad <= (
            SELECT dpp1.valor 
            FROM mod_logabc.dat_parametrizacionproductos dpp1 
			WHERE dpp1.idestructura = dpp.idestructura 
			AND dpp1.idconfperiodosclasificacionabc = dpp.idconfperiodosclasificacionabc 
			AND dpp1.iddeposito = dpp.iddeposito 
			AND dpp1.idparametrosinventario = 28 
			AND dpp1.idproducto = dpp.idproducto
			)";

        return $this->conexion->fetchAll($sql, array($idueb, $idconf, $iddeposito));
    }

    public function adicionarPedidoABC($idueb, $arrProductos, $idconf)
    {
        try {
            $arrProductosIdent = array();
            foreach ($arrProductos as $p) {
                $arrProductosIdent[] = array(
                    'idproducto' => $p[0],
                    'cantidad' => $p[1]

                );
            }

            $arrCliente = $this->conexion->fetchAll("SELECT idclientesproveedores 
            FROM mod_datosmaestros.nom_clientesproveedor WHERE idestructura = ?", array($idueb));
            if (empty($arrCliente[0]['idclientesproveedores'])) {
                throw new Exception("La UEB no es un cliente.Por favor adicionela como cliente en el "
                    . "nomenclador.", 7);
            }

            $ioc = ZendExt_IoC_Inter::getInstance();
            $idpedido = $ioc->logistica->adicionarPedido($arrCliente[0]['idclientesproveedores'], 4, $arrProductosIdent
                , array(), null, null, null);

            $this->conexion->execute("INSERT INTO mod_logabc.dat_pedidosabc( idpedido, idestructura,
                                        idconfperiodosclasificacionabc) VALUES ({$idpedido},{$idueb},{$idconf});");

            return array('codigo' => 1, 'idpedido' => $idpedido);

        } catch (Exception $e) {
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }
    }

    public function eliminarPedidoAbc($idpedidoabc, $idpedido)
    {
        $this->conexion->beginTransaction();
        try {
            $this->conexion->execute("DELETE FROM mod_logistica.dat_documento WHERE iddocumento = ?",
                array($idpedido));
            $this->conexion->execute("DELETE FROM mod_logdistribucion.dat_pedido WHERE iddocumento = ?",
                array($idpedido));
            $this->conexion->execute("DELETE FROM mod_logabc.dat_pedidosabc WHERE idpedidoabc = ?",
                array($idpedidoabc));
            $this->conexion->commit();
            return array('codigo' => 1);
        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }
    }

    public function obtenerProductosDelPedido($idpedido)
    {
        $sql = "
            SELECT 
            dpp.idproductopedido,
            dpp.idproducto,
            i.numeropieza AS codigo,
            i.denominacion AS producto,
            (CASE 
                WHEN dpp.estado = 1 THEN 'No procesado'
                WHEN dpp.estado = 2 THEN 'En proceso'
                WHEN dpp.estado = 3 THEN 'En distribución'
                WHEN dpp.estado = 4 THEN 'Cumplimentado'
            END) AS estado,    
            round(dpp.cantidad,0) AS cantidad
              FROM mod_logdistribucion.dat_productopedido AS dpp
              INNER JOIN mod_datosmaestros.nom_indicador AS i ON i.idindicador = dpp.idproducto
              WHERE
              dpp.idpedido = ?
              AND dpp.servicio = 0";

        return $this->conexion->fetchAll($sql, array($idpedido));
    }

    public function obtenerConfPedido()
    {
        $aE = $this->integrator->metadatos
            ->obtenerPadreEntidad(ZendExt_GlobalConcept::getInstance()
                ->Estructura->idestructura, true);
        return $this->conexion
            ->fetchAll("SELECT 
                    idestructurarecibepedido, 
                    permitireditarpedido
                FROM 
                    mod_logdistribucion.conf_pedido
                WHERE 
                    idestructuracomun = ?", array($aE[0]->idestructura));
    }

    public function guardarCantidadesProductosPedidoAbc($arrProductos)
    {
        try {

            $this->conexion->beginTransaction();
            foreach ($arrProductos as $p) {
                $this->conexion->execute("
                    UPDATE 
                        mod_logdistribucion.dat_productopedido
                    SET 
                        cantidad = {$p[1]}
                    WHERE 
                        idproductopedido = {$p[0]}"
                );
            }
            $this->conexion->commit();

        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }

        return array('codigo' => 1);
    }

    public function prepararPedidoAbc($idpedido)
    {
        $this->conexion->beginTransaction();
        try {
            $this->conexion->execute("UPDATE mod_logistica.dat_documento SET estado = 2 WHERE iddocumento = ?",
                array($idpedido));

            $this->conexion->commit();
            return array('codigo' => 1);
        } catch (Exception $e) {
            $this->conexion->rollback();
            return array('codigo' => 3, 'mensaje' => $e->getMessage());
        }
    }


}
