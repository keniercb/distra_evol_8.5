<?php

class VentaspuntoventaModel extends ComunpuntoventaModel
{
    public function __construct()
    {
        parent::__construct();
    }
	
	public function cargarTodasAreas($params)
	{ 
	    $query = Doctrine_Query::create()->select('da.idestructuraop,da.nombre as nombretienda')->from('DatAreaventa da');
        $this->doctrineHelper->addQueryLimits($query, $params);
        $arrayDepositos = $query->orderBy('da.idareaventa')->fetchArray();
        $datos = Array();$cont = 0;
        $cantidad = $query->count();
        return array('cantidad' => $cantidad, 'datos' => $arrayDepositos);		
	}
	
	public function ventasRealizadasPorClientes($params)
	{ 

	    $idcliente = (isset ($params['idventacliente']) && $params['idventacliente'])? $params['idventacliente'] : 'null'; 
		$idareaventa = (isset ($params['idareaventa']) && $params['idareaventa'])? $params['idareaventa'] : 'null';
		$idindicador = (isset ($params['idindicador']) && $params['idindicador'])? $params['idindicador'] : 'null';
		$criterio = (isset ($params['criterio']) && $params['criterio'])? "'".$params['criterio']."'" : 'null';
		$abreviatura = (isset ($params['abreviatura']) && $params['abreviatura'])? "'".$params['abreviatura']."'" : 'null';
		$desde = (isset ($params['desde']) && $params['desde'])? "'".$params['desde']."'" : 'null';
		$hasta = (isset ($params['hasta']) && $params['hasta'])? "'".$params['hasta']."'" : 'null';
		$limit = $params['limit'];
		$start = $params['start'];
			//Filtros
		$filtroentidad=(isset ($params['entidad']) && $params['entidad'])? "'".$params['entidad']."'" : 'null';
		$filtroareaventa=(isset ($params['areaventa']) && $params['areaventa'])? "'".$params['areaventa']."'" : 'null';
		$filtrovendedor=(isset ($params['vendedor']) && $params['vendedor'])? "'".$params['vendedor']."'" : 'null';
		$filtronroventa=(isset ($params['nroventa']) && $params['nroventa'])? "'".$params['nroventa']."'" : 'null';
		$filtrotipodoc=(isset ($params['tipodoc']) && $params['tipodoc'])? "'".$params['tipodoc']."'" : 'null';
		// Ordenar	
	
		if($params['ordenarpor']){
	$alfabetico='null';
	$mayorimporte='null';
	$menorimporte='null';
	$ordenalfabeticodes='null';
	$separar=explode(",", $params['ordenarpor']);
	
	foreach($separar as $s) {
		$alfabetico = (isset ($s) && $s=='ordenalfabetico' && $alfabetico=='null')? "'".$s."'" : 'null';
		$mayorimporte = (isset ($s)&& $s=='mayorimporte'&& $mayorimporte=='null')? "'".$s."'" : 'null';

		$menorimporte = (isset ($s)&& $s=='menorimporte'&& $menorimporte=='null')? "'".$s."'" : 'null';
		$ordenalfabeticodes = (isset ($s)&& $s=='ordenalfabeticodes'&& $ordenalfabeticodes=='null')? "'".$s."'" : 'null';
		
	}
}else{
	$alfabetico='null';
	$mayorimporte='null';
	
	$menorimporte='null';
	$ordenalfabeticodes='null';
	
}
//Filtro Comparaciones

if($params['comparaciones']){
	$campoMenor=($params['comparaciones'][0])?"'".$params['comparaciones'][0]['campo']."'":'null';
	$valorMenor=($params['comparaciones'][0])?$params['comparaciones'][0]['valor']:'null';
	$campoMayor=($params['comparaciones'][1])?"'".$params['comparaciones'][1]['campo']."'":'null';
	$valorMayor=($params['comparaciones'][1])?$params['comparaciones'][1]['valor']:'null';
	$campoIgual='null';
	$valorIgual='null';
}else{
	if($params['importe']){
		$campoIgual="'".'importe'."'";
		$valorIgual=$params['importe'];
		$campoMenor='null';
		$valorMenor='null';
		$campoMayor='null';
		$valorMayor='null';	
		
	 }else{
		$campoIgual='null';
		$valorIgual='null';
		$campoMenor='null';
		$valorMenor='null';
		$campoMayor='null';
		$valorMayor='null';	
	 }
	
}

$sql = "select *, count(*) over() as cantidad from mod_logpuntoventa.f_listadoventasxcliente(
			{$idcliente},{$idareaventa},{$desde},{$hasta},
			{$idindicador},{$criterio},{$abreviatura},
			{$filtroentidad},{$filtroareaventa},{$filtrovendedor},{$filtronroventa},
			{$filtrotipodoc},{$alfabetico},{$mayorimporte},{$campoMenor},{$valorMenor},
			{$campoMayor},{$valorMayor},{$campoIgual},{$valorIgual},{$menorimporte},{$ordenalfabeticodes})";
			
        $conn = Zend_Registry::get('conexion');
		$result = $conn->execute($sql . " limit {$limit} offset {$start}")->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0,
            'datos' => $result
        );	
	}
	
	public function cargarProductosVenta($params)
	{ 
	
	    $idventas = (isset ($params['idventas']) && $params['idventas'])?$params['idventas']: 'null'; 
		$limit = $params['limit'];
		$start = $params['start'];
					
        $sql = "select *, count(*) over() as cantidad from mod_logpuntoventa.f_productoventa(
		{$idventas}				
		)";
		//print_r($sql);die;
        $conn = Zend_Registry::get('conexion');
		$result = $conn->execute($sql . " limit {$limit} offset {$start}")->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'cantidad' => count($result) > 0 ? $result[0]['cantidad'] : 0,
            'datos' => $result
        );	
	}

	public function cargarTiendas()
	{
		$conn = Zend_Registry::get('conexion');
		$sql = "
		select a.nombre as areaventa
		from mod_logpuntoventa.dat_areaventa a
		where a.nombre is not null and a.nombre != ''
		group by 1
		";
		return [
			'datos' => $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC)
		];
	}

	public function cargarTipoDocumento()
	{
		$conn = Zend_Registry::get('conexion');
		$sql = "
            select denominacion as tipodoc
            FROM mod_datosmaestros.nom_docprim
            where abreviatura in ('compventaLog','compdevLog')
		";
		return [
			'datos' => $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC)
		];
	}

	public function cargarVendedor()
	{
		$conn = Zend_Registry::get('conexion');
		$sql = "
            select vendedor
            from mod_logpuntoventa.dat_ventas
            group by vendedor
		";
		return [
			'datos' => $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC)
		];
	}

    public function existeIdAbo($codigo, $idestructuracomun)
    {
        $existe = LogisticaDoctrineHelper::__init()->query(
            "SELECT count(np.idpos) as cantidad "
            . "FROM NomPos np INNER JOIN np.DatPosEntidad dpe ON dpe.idpos = np.idpos WHERE np.idabo like '%{$codigo}%' "
            . "AND dpe.idestructuracomun = {$idestructuracomun}"
        )->toArray();
        return $existe[0]['cantidad'] == 0 ? false : true;
    }

    public function existeVentaCliente($idcliente, $idestructuracomun, $idestructuraop)
    {
        $conn = Zend_Registry::get('conexion');
        $sql = "select count(dav.idareaventa) as cantidad
                from mod_logpuntoventa.dat_areaventa dav
                inner join mod_logpuntoventa.dat_ventas dv on dv.idareaventa = dav.idareaventa
                where dav.idestructuracomun = {$idestructuracomun} and dav.idestructuraop = {$idestructuraop} and dv.idpersona = {$idcliente}";

        $serv = $conn->fetchAll($sql);
        return $serv[0]['cantidad'] == 0 ? false : true;
    }
}
