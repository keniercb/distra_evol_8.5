<?php

class DatOcupacionActual extends BaseDatOcupacionActual {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomPersonaEsfera', array('local' => 'idesfera', 'foreign' => 'idesfera'));
        $this->hasOne('NomPersonaSubordinacion', array('local' => 'idsubordinacion', 'foreign' => 'idsubordinacion'));
        $this->hasOne('NomPersonaTipoOrgano', array('local' => 'idtipoorgano', 'foreign' => 'idtipoorgano'));
        $this->hasOne('NomMotivoponerencargo', array('local' => 'idmotivoponerencargo', 'foreign' => 'idmotivoponerencargo'));
    }

    public function Buscar($idpersonaresidencia) {
        $temp = $this->conn->getTable('DatOcupacionActual')->find($idpersonaresidencia);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual')->execute();
        return $result->toArray();
    }

    public function GetTodosByIdPersona($idpersona) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual p')
                ->where("p.idpersona=?", array($idpersona))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getPersonasByEntidadActual($limit = 15, $start = 0, $idestructura, $filtro = '') {
        try {
            $query = new Doctrine_Query ();
            if ($filtro != '') {
                $result = $query->select('oa.idocupacionactual, dp.numid as numid, dp.nombre as nombre, dp.snombre as snombre, dp.papel as papel, dp.sapel as sapel')
                        ->from('DatOcupacionActual oa')
                        ->innerJoin('oa.DatPersona dp')
                        ->where("oa.identidad = '$idestructura' and dp.fechaeliminado is null and (dp.numid ILIKE '%$filtro%' or dp.nombre ILIKE '%$filtro%' or dp.papel ILIKE '%$filtro%' or dp.sapel ILIKE '%$filtro%')")
                        ->limit($limit)
                        ->offset($start)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            } else {
                $result = $query->select('oa.idocupacionactual, dp.numid as numid, dp.nombre as nombre, dp.snombre as snombre, dp.papel as papel, dp.sapel as sapel')
                        ->from('DatOcupacionActual oa')
                        ->innerJoin('oa.DatPersona dp')
                        ->where("oa.identidad = ? and dp.fechaeliminado is null", $idestructura)
                        ->limit($limit)
                        ->offset($start)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function cantPersonasByEntidadActual($idestructura) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('oa.idpersona')
                    ->from('DatOcupacionActual oa')
                    ->innerJoin('oa.DatPersona dp')
                    ->where("oa.identidad = ? and dp.fechaeliminado is null", $idestructura)
                    ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetTodosById($id) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual p')
                ->where("p.idocupacionactual=?", array($id))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetPersonaByArrIdCargo($id, $tipo, $limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->select('p.*, o.denom, s.denom, e.denom, m.denom, per.numid, per.nombre, per.snombre, per.papel, per.sapel, sex.denom , per.idsituacionespecificapersona, per.idsituacionpersona,catg.denom, ident.idpersonaidentidad, nac.fechanacimiento ,ni.denom, ns.denom,nsp.denom  ')
                ->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("p.estadocargo=? and p.idcargo>0", array($tipo))
                ->whereIn("p.idcargo", $id)
                ->limit($limite)
                ->offset($inicio)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetCantPersonaByArrIdCargo($id, $tipo, $limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("p.estadocargo=? and p.idcargo>0", array($tipo))
                ->whereIn("p.idcargo", $id)
                ->count();
        return $result;
    }

    public function GetPersonaByArrIdEntidades($id, $tipo, $limite, $inicio) {  // print_r($id);die;	
        $query = new Doctrine_Query ();
        $result = $query->select('p.*, o.denom, s.denom, e.denom, mo.denom, per.numid, per.nombre, per.snombre, per.papel, per.sapel, sex.denom , per.idsituacionespecificapersona, per.idsituacionpersona,catg.denom, ident.idpersonaidentidad, nac.fechanacimiento ,ni.denom , ns.denom,nsp.denom ')
                ->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("p.estadocargo=? and p.idcargo>0", array($tipo))
                ->whereIn("p.identidad", $id)
                ->limit($limite)
                ->offset($inicio)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetCantPersonaByArrIdEntidades($id, $tipo, $limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("p.estadocargo=? and p.idcargo>0", array($tipo))
                ->whereIn("p.identidad", $id)
                ->count();
        return $result;
    }

    public function GetDatosPersonaByIdEstruc($id, $tipo, $limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->select('p.*, o.denom, s.denom, e.denom, m.denom, per.numid, per.nombre, per.snombre, per.papel, per.sapel,per.idsituacionespecificapersona, per.idsituacionpersona,sex.denom , catg.denom, ident.idpersonaidentidad, nac.fechanacimiento ,ni.denom, ns.denom,nsp.denom  ')
                ->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("(p.idorganismo=? or p.identidad=? or p.idcargo=?) and p.estadocargo=?", array($id, $id, $id, $tipo))
                ->limit($limite)
                ->offset($inicio)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function GetCantDatosPersonaByIdEstruc($id, $tipo, $limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual p')
                ->leftJoin('p.NomPersonaTipoOrgano o')
                ->leftJoin('p.NomPersonaSubordinacion s')
                ->leftJoin('p.NomPersonaEsfera e')
                ->leftJoin('p.NomMotivoponerencargo m')
                ->leftJoin('p.DatPersona per')
                ->leftJoin('per.NomSexo sex')
                ->leftJoin('per.NomSituacionpersona ns')
                ->leftJoin('per.NomSituacionespecificapersona nsp')
                ->leftJoin('per.DatPersonanacimiento nac')
                ->leftJoin('per.NomCategoriaPersona catg')
                ->leftJoin('per.DatPersonadocidentidad ident')
                ->leftJoin('ident.NomTipodocidentidad ni')
                ->where("(p.idorganismo=? or p.identidad=? or p.idcargo=?) and p.estadocargo=?", array($id, $id, $id, $tipo))
                ->count();
        return $result;
    }

    static public function verifOcupAct($idpersona) {
        $q = Doctrine_Query::create();
        try {
            $result = $q->select('idocupacionactual')
                    ->from('DatOcupacionActual')
                    ->where("idpersona=?", array($idpersona))
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            if (count($result))
                return true;
            else
                return false;
        } catch (Doctrine_Exception $ee) {
            die($ee);
        }
    }

    static public function verifOcupCargo($idcargo, $estadocargo, $disp) {

        $q = Doctrine_Query::create();
        try {
            $result = $q->select('idocupacionactual')
                    ->from('DatOcupacionActual')
                    ->where("idcargo=? and estadocargo=?", array($idcargo, $estadocargo))
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            if (($disp - count($result)) > 0)
                return 1;
            else
                return 0;
        } catch (Doctrine_Exception $ee) {
            die($ee);
        }
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatOcupacionActual')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function obtenerCargoPersona($idpersona) {
        $query = new Doctrine_Query ();
        $result = $query->select('cargo, organismo, entidad, fechainicioorden as fchocupcargo, 
								idorganismo, identidad, idcargo')
                ->from('DatOcupacionActual')
                ->where("idpersona = ?", $idpersona)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    //Devuelve el o los cargos de la persona en dependecnia del parametro $oficial
    //$oficial = 0 : no oficial
    //$oficial = 1 : oficial
    public function obtenerCargoOficialPersona($idpersona, $oficial) {
        $query = new Doctrine_Query ();
        $result = $query->select('cargo, organismo, entidad, fechainicioorden as fchocupcargo, 
								idorganismo, identidad, idcargo')
                ->from('DatOcupacionActual')
                ->where("idpersona = {$idpersona} and oficial = {$oficial}")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ObtenerPersonasOcupanCargoHistorico($idcargo, $limit, $start) {
        $sql = "select doa.idpersonatrayectoriamilitar, per.idpersona, per.numid, 
                    	(CASE WHEN per.snombre is not null THEN
                    	per.nombre||' '|| per.snombre||' '|| per.papel||' '||  per.sapel
                    	ELSE per.nombre||' '|| per.papel||' '||  per.sapel END) as nombreapellidos,
						doa.fechainicio, doa.fechafin, doa.cargooficial
                    from mod_persona.dat_personatrayectoriamilitar doa
                    inner join mod_persona.dat_persona per on (per.idpersona = doa.idpersona)
                    where doa.idcargo = {$idcargo} order by doa.fechainicio  limit {$limit} offset {$start}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function CantidadPersonasOcupanCargo($idcargo) {
        $sql = "select count(doa.idocupacionactual) as cantidad
                    from mod_persona.dat_ocupacionactual doa
                    where doa.idcargo = {$idcargo}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['cantidad'];
    }

    public function VerificarPersonasConCargoOficial($idpersona) {
        $sql = "select count(doa.idocupacionactual) as cantidad
                    from mod_persona.dat_ocupacionactual doa
                    where doa.idpersona = {$idpersona} and doa.cargooficial = 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['cantidad'];
    }

    public function obtenerIdsCargosActualesporPersona($idpersona) {
        $query = new Doctrine_Query ();
        $result = $query->select('idcargo')
                ->from('DatOcupacionActual')
                ->where("idpersona = ?", $idpersona)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function VerificarObtenerDatosCargoOficial($idpersona) {
        $sql = "select doa.idocupacionactual, doa.idcargo
                    from mod_persona.dat_ocupacionactual doa
                    where doa.idpersona = {$idpersona} and doa.cargooficial = 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function VerificarCargoMismaPersona($idpersona, $idcargo) {
        $sql = "select count(*) as cantidad
                    from mod_persona.dat_ocupacionactual doa
                    where doa.idpersona = {$idpersona} and doa.idcargo = {$idcargo}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['cantidad'];
    }

    public function CantidadPersonasOcupanCargoHistorico($idcargo) {
        $sql = "select count(doa.idpersonatrayectoriamilitar) as cantidad
                    from mod_persona.dat_personatrayectoriamilitar doa
                    where doa.idcargo = {$idcargo}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0]['cantidad'];
    }

    public function ObtenerPersonasOcupanCargo($idcargo, $limit, $start) {
        $sql = "select doa.idocupacionactual, per.idpersona, per.numid, 
                    	(CASE WHEN per.snombre is not null THEN
                    	per.nombre||' '|| per.snombre||' '|| per.papel||' '||  per.sapel
                    	ELSE per.nombre||' '|| per.papel||' '||  per.sapel END) as nombreapellidos,
						doa.fechainicio, doa.cargooficial
                    from mod_persona.dat_ocupacionactual doa
                    inner join mod_persona.dat_persona per on (per.idpersona = doa.idpersona)
                    where doa.idcargo = {$idcargo} order by doa.fechainicio limit {$limit} offset {$start}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function ObtenerPersonasporArrEntidades($arrEntidades) {
        $sql = "select doa.idocupacionactual, dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel,
					dp.numid, ncp.denom as categoria
                    from mod_persona.dat_ocupacionactual doa
					inner join mod_persona.dat_persona dp on (dp.idpersona = doa.idpersona)
					left join mod_persona.nom_categoriapersona ncp on (ncp.idcategoriapersona = dp.idcategoriapersona)
                    where doa.identidad in (" . implode(',', $arrEntidades) . ");";
        //die($sql);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

	public function obtenerDatosCargoEntidadyPersonalesXIdpersona($idpersona){
	   
	    $sql = "select dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel, ns.denom as sexo, nc.denom as categoria, oa.identidad, oa.idcargo, df.extension, df.idfoto
				from mod_persona.dat_persona dp
				left join mod_persona.dat_ocupacionactual oa on (oa.idpersona = dp.idpersona)
				left join mod_persona.nom_sexo ns on (ns.idsexo = dp.idsexo)
				left join mod_persona.nom_categoriapersona nc on (nc.idcategoriapersona = dp.idcategoriapersona)
				left join mod_persona.dat_foto df on (df.idpersona = dp.idpersona and df.hasta is null)
				where dp.idpersona = {$idpersona};";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
		
		$objIoC = ZendExt_IoC::getInstance();
		if($result[0]['idcargo'] != ''){
		  $arrDatCargos = $objIoC->metadatos->BuscardatosdelCargoporarrIDs(array($result[0]['idcargo']));
		  if(count($arrDatCargos) > 0){
		     $result[0]['cargo'] = $arrDatCargos[0]['cargo'];
		  }else $result[0]['cargo'] = 'Sin rol';
		}else {
			$result[0]['cargo'] = 'Sin rol';
		}

		if($result[0]['identidad'] != ''){
		  $arrEntidades = $objIoC->metadatos->DenomEstructurasbyArreglo(array($result[0]['identidad']));
		  if(count($arrEntidades) > 0){
		     $result[0]['linea'] = $arrEntidades[0]['denominacion'];
		  }else $result[0]['linea'] = 'Sin l&iacute;nea productiva';
		}else {
			$result[0]['linea'] = 'Sin l&iacute;nea productiva';
		}
		return $result;
		
	}
	
    //getSqlQuery()
}

//fin clase 
?>