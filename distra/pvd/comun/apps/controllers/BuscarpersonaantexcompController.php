<?php
class BuscarpersonaantexcompController extends ZendExt_Controller_Secure{
    private $persona;

    function init () {
        $this->persona = new DatPersonaModel();
        parent::init();
    }

    function buscarpersonaantexcompAction() {

        $this->render();
    }

    function cargarpersonaAction() {
        $inicio = $this->_request->getPost('start');
        $limite = $this->_request->getPost('limit');
        $persona = $this->_request->getPost('persona');
        $tipobusqueda=$this->_request->getPost('tipobusqueda');
        $texto = $this->_request->getPost('texto');
        $seguridad = $this->_request->getPost('seguridad');
        if($tipobusqueda == 1) {
            $this->buscador($inicio, $limite, $texto, $seguridad);
        } else{
            $persona=stripslashes($persona);
            $persona=json_decode($persona);
            $this->buscarpersonabyparametro($persona,$limite,$inicio, $seguridad);
        }
    }

    function cargarcombosexoAction() {
        $model = new NomSexo();
        $nomencladorsexo = $model->GetTodos();
        if(is_array ( $nomencladorsexo )) {
            $nomencladorsexo=array('cant'=>count($nomencladorsexo),'datos'=>$nomencladorsexo);
            echo(json_encode($nomencladorsexo));
        }
    }

    function cargarcombotiponoidentidadAction(){
    $objNomTnoID = new NomTipodocidentidad();
    $nomencladorTNoID = $objNomTnoID->GetTodos();
    if(is_array ( $nomencladorTNoID )) {
        $nomenclador=array('cant'=>count($nomencladorTNoID),'datos'=>$nomencladorTNoID);
        echo(json_encode($nomenclador));
    }
}

    function cargarcombocategoriaAction(){
        $objcategoria = new NomCategoriaPersona();
        $nomencladorCat = $objcategoria->GetTodos();
        if(is_array ( $nomencladorCat )) {
            $nomenclador=array('cant'=>count($nomencladorCat),'datos'=>$nomencladorCat);
            echo(json_encode($nomenclador));
        }
    }

    function cargarcombosectorAction(){
        $model = new NomSector();
        $nomencladorsector = $model->GetTodos();
        if(is_array ( $nomencladorsector )) {
            $nomencladorsector=array('cant'=>count($nomencladorsector),'datos'=>$nomencladorsector);
            echo(json_encode($nomencladorsector));
        }
    }

    function cargarcomboviaentradaAction(){
        $situacion = $this->pIntegrator->seleccion->GetTodos();
        if(is_array ( $situacion )) {
            $situacion=array('cant'=>count($situacion),'datos'=>$situacion);

		}
        echo(json_encode($situacion));
    }

    function guardarfotoAction() {
        $fp = fopen($_FILES["nombrefoto"]["tmp_name"], "rb");
        $contents = file_get_contents($_FILES["nombrefoto"]["tmp_name"]);
        $_SESSION["foto"] = $contents;
        fclose($fp);

		$nomTemp = $_FILES['nombrefoto']['tmp_name'];
		$arrNomTemp = explode('\\',$nomTemp);
		$nomImg = explode('.',$arrNomTemp[1]);

		$ext = $this->_request->getPost('extension');
		$dirfoto = "../../../persona/personaimgstemp/";
		$dir = "personaimgstemp/";

		$ffp = fopen("{$dir}"."{$nomImg[0]}"."{$ext}", "wb");
		fclose($ffp);
		file_put_contents("{$dir}"."{$nomImg[0]}"."{$ext}", $_SESSION["foto"]);

		$afoto = array();
		$afoto['success'] = true;
		$afoto['codigo'] = 1;
		$afoto['dirfoto'] = "{$dirfoto}"."{$nomImg[0]}"."{$ext}";
		$afoto['nombrefoto'] = "{$nomImg[0]}"."{$ext}";
		echo json_encode($afoto);die;
    }

	function SincronizarImgBDconFicheroServer($idpersona, $idfoto)
	{
	    $host = Zend_Registry::get('config')->bd->persona->host;
		$user = Zend_Registry::get('config')->bd->persona->usuario;
		$pass = Zend_Registry::get('config')->bd->persona->password;
		$dbna = Zend_Registry::get('config')->bd->persona->bd;
		$link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
		$consulta = pg_query($link, "select idfoto, foto, extension from mod_persona.dat_foto where idfoto={$idfoto} and hasta is null");
		$arrayVal = array();
		while ($row = pg_fetch_assoc($consulta))
		 $arrayVal[] = $row;

		$ext = $arrayVal[0]['extension'];
		$ffp = fopen("personaimgs/"."{$idpersona}"."{$ext}", "wb");
		fclose($ffp);
		$imagen = pg_unescape_bytea ($arrayVal[0]['foto']);
		file_put_contents("personaimgs/"."{$idpersona}"."{$ext}", $imagen);

	}

	function guardarIDAction(){
		if($this->_request->getPost('idpbusq')){
			$_SESSION['pbusq']["idpbusq"] = $this->_request->getPost('idpbusq');
			if($this->_request->getPost('nombusq'))
				$_SESSION['pbusq']["nombusq"] = $this->_request->getPost('nombusq');
			if($this->_request->getPost('snombusq'))
				$_SESSION['pbusq']["snombusq"] = $this->_request->getPost('snombusq');
			if($this->_request->getPost('papelbusq'))
				$_SESSION['pbusq']["papelbusq"] = $this->_request->getPost('papelbusq');
			if($this->_request->getPost('sapelbusq'))
				$_SESSION['pbusq']["sapelbusq"] = $this->_request->getPost('sapelbusq');
			if($this->_request->getPost('idsex'))
				$_SESSION['pbusq']["idsexo"] = $this->_request->getPost('idsex');
			if($this->_request->getPost('numidbusq'))
				$_SESSION['pbusq']["numidbusq"] = $this->_request->getPost('numidbusq');
			echo 1;
		}
		else echo( '{"codMsg":3,"mensaje": "Error al seleccionar la persona"}');
    }

    function insertarfoto($idpers, $nombretemp, $extension, $modo, $idfoto) {
	    try{//echo ($idpers."   ".$nombretemp."    ".$extension."    ".$modo."    ".$idfoto); die;
				$dir = "personaimgstemp/";
				$diroriginal = "personaimgs/";
				$contents = file_get_contents($dir.$nombretemp);



				$foto = pg_escape_bytea($contents);
                $host = Zend_Registry::get('config')->bd->persona->host;
                $user = Zend_Registry::get('config')->bd->persona->usuario;
                $pass = Zend_Registry::get('config')->bd->persona->password;
                $dbna = Zend_Registry::get('config')->bd->persona->bd;
                $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
				$sql = "";
				if($modo == 'ADD'){
	                $sql  = "insert INTO mod_persona.dat_foto (idpersona, foto, extension, desde) values ({$idpers}, '{$foto}', '{$extension}', now())";
				}else{
				   if($idfoto != -1){
					 $sqlb = "select extension from mod_persona.dat_foto where idfoto ={$idfoto} and hasta is null";
				     $sql  = "update mod_persona.dat_foto set foto='{$foto}', extension='{$extension}', desde=now() where idfoto ={$idfoto} and hasta is null";
					 $queryb = pg_query($link, $sqlb);
					 while ($row = pg_fetch_assoc($queryb))
					 $arrayVal[] = $row;
					 $ext = $arrayVal[0]['extension'];
					 unlink($diroriginal."{$idpers}"."{$ext}");
				   }
				   else
					 $sql  = "insert INTO mod_persona.dat_foto (idpersona, foto, extension, desde) values ({$idpers}, '{$foto}', '{$extension}', now())";
				}

				$query = pg_query($link, $sql);
				//print_r($query);die('asasasas');
				$ffp = fopen($diroriginal."{$idpers}"."{$extension}", "wb");
				fclose($ffp);
				file_put_contents($diroriginal."{$idpers}"."{$extension}", $contents);

				//unlink($dir.$nombretemp);

				$datp = new DatPersona();
				$idfotopersona = $datp->getIdFoto($idpers);
				//print_r($idfotopersona[0]['idfoto']);die('asasasas');
				return ($idfotopersona[0]['idfoto'])?$idfotopersona[0]['idfoto']:-1;

        }
        catch(Doctrine_Exception $ex) {
            throw new ZendExt_Exception('COST001', $ex);
        }
    }

    function dameimgAction() {
        $imag = $_SESSION["foto"];
        header("Content-type: image/jpeg");
        echo $imag;
    }

    function modificfoto() {
        if (isset($_SESSION['foto']) && isset($_SESSION['idpers'])) {
            $foto = pg_escape_bytea($_SESSION['foto']);
            $host = Zend_Registry::get('config')->bd->persona->host;
            $user = Zend_Registry::get('config')->bd->persona->usuario;
            $pass = Zend_Registry::get('config')->bd->persona->password;
            $dbna = Zend_Registry::get('config')->bd->persona->bd;
            $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
            if($this->persona->buscarFotoPersona($_SESSION['idpers']) == 0) {
                $sql  = "insert INTO mod_persona.dat_foto (foto,idpersona) values ('{$foto}',{$_SESSION['idpers']})";
                $query = pg_query($link, $sql);
            }
            else {
                $sql  = "update mod_persona.dat_foto set foto = '{$foto}' where idpersona = '{$_SESSION['idpers']}'";
                $query = pg_query($link, $sql);
            }
        }
        unset($_SESSION['foto'], $_SESSION['idpers']);
    }

    function dameimgpersAction() {
        $idpers = $this->_request->getPost('idpers');
        $imag = $this->persona->buscarFotoPersona($idpers);
        if ($imag) {
            $_SESSION["foto"]  = pg_unescape_bytea($imag);
            echo 1;
        }
        else {
            echo 0;
        }
    }

    function verificarcarnet() {
        $id = $this->_request->getPost('numid');
		$nombre = $this->_request->getPost('nombre');
		$snombre = $this->_request->getPost('snombre');
		$papell = $this->_request->getPost('papel');
		$sapell = $this->_request->getPost('sapel');
        $model = new DatPersona();
        $v = $model->ExisteCI($id, $nombre, $snombre, $papell, $sapell);
		//print_r($v);die('aquiiii');
		if($v)
		 return 1;
		   else
		 return 0;
	}

    public function imprimirAction() {
        $idestructura = $this->global->Estructura->idestructura;
        $datosestructura = $this->integrator->metadatos->DameEstructura($idestructura);
        $codigo = $datosestructura[0]->codigo;
        echo json_encode(array('codigo'=>$codigo));
    }

    function obtenerformatoAction() {
        $direccion ='Location: http://'.$_SERVER['HTTP_HOST'].'/'.'report_generator.php/api/getFormats';
        echo header($direccion);
    }

    function buscador($inicio, $limite, $texto, $seguridad) {
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $iddominio = $this->global->Perfil->iddominio;

        /*$objPermisos = new SegPersonapermisos();
        $arrPermisos = $objPermisos->GetSeguridadXPersona($idusuario);
        $permiso = -1;
        if(count($arrPermisos) > 0) {
            $permiso = $arrPermisos[0]['permiso'];
        }else{
            $permiso = 2;
        }
        $objper = new DatPersona();
        if($seguridad == 1) {
            $permiso = 3;
        }*/
        $objPermisos = new DatGrupousuario();
        $permisos = $objPermisos->getCompartimentacion($idusuario);
        if($permisos){
            $permiso = $permisos[0]['idgrupo'];
        }else{
            $permiso = 2;
        }
        $objper = new DatPersonaAntex();
        $perso = $objper->BuscadorAntex($inicio, $limite, $texto, $idestructura, $iddominio, $permiso);//Buscador($inicio, $limite, $texto, $idestructura, $iddominio, $permiso);

        $total = $objper->countBuscadorAntex($texto, $idestructura, $iddominio, $permiso);//countBuscador($texto, $idestructura, $iddominio, $permiso);

		if (is_array($perso)) {
            $personas = array ('cant' => $total, 'datos' => $perso);
            echo(json_encode($personas));
        }else echo(json_encode(array ('cant' => 0, 'datos' => array())));
    }

	//buscar persona por parametro
	function buscarpersonabyparametro($persona,$limite,$inicio, $seguridad) {

		$idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
		$iddominio	=	$this->global->Perfil->iddominio;

        /*$objPermisos = new SegPersonapermisos();
        $arrPermisos = $objPermisos->GetSeguridadXPersona($idusuario);
        $permiso = -1;
        if(count($arrPermisos) > 0)
          $permiso = $arrPermisos[0]['permiso'];
		else
		  $permiso = 2;
		if($seguridad == 1) $permiso = 3;*/

        $objPermisos = new DatGrupousuario();
        $permisos = $objPermisos->getCompartimentacion($idusuario);
        if($permisos){
            $permiso = $permisos[0]['idgrupo'];
        }else{
            $permiso = 2;
        }
		$objperB = new DatPersonaAntex();
		$perso = $objperB->BuscarPersonaPorParamAntex($persona, $limite, $inicio, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);//BuscarPersonaPorParam( $persona, $limite, $inicio, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);
		$total = $objperB->countBuscarPersonaPorParamAntex($persona, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);//countBuscarPersonaPorParam($persona, $idestructura, $iddominio, $permiso, $this->integrator->metadatos);

		if (is_array($perso)) {
            $personas = array ('cant' => $total, 'datos' => $perso);
            echo(json_encode($personas));
        }else echo(json_encode(array ('cant' => 0, 'datos' => array())));
    }

}

?>
