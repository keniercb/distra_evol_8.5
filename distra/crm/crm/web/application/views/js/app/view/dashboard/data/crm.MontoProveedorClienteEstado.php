<?php
/**
 * Created by PhpStorm.
 * User: hero
 * Date: 2/06/16
 * Time: 11:10
 */

function getMontoPorEstado($isClient) {
    $query = "Select count(montototal) as quantity, avg(montototal) as mean, sum(montototal) as amount, state_name 
    from ( Select b.nombre as state_name, a.montototal 
	from mod_crmcontratacion.dat_contrato as a 
	inner join mod_crmcontratacion.nom_estado as b
	on a.idestado=b.idestado and a.cliente=$isClient
	) as c 
	group by c.state_name";

    $conn_string = "host=10.12.170.138 port=5432 dbname=distra-beta user=zeolides password=zeolides*2012.,";
    $conn = pg_connect($conn_string);
    $result = pg_query($conn, $query);
    $e = pg_fetch_all($result);
    $result = new \StdClass();
    $result->rows = $e;
    $result->success = true;
    echo json_encode($result);
}

getMontoPorEstado(isset($_POST['isClient'])?$_POST['isClient']:0);