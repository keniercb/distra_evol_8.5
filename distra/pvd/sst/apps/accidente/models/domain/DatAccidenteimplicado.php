<?php

class DatAccidenteimplicado extends BaseDatAccidenteimplicado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatImplicadopartecuerpo', array('local' => 'idaccidenteimplicado', 'foreign' => 'idaccidenteimplicado')
        );
        $this->hasMany(
            'DatImplicadopartecuerpo',
            array('local' => 'idaccidenteimplicado', 'foreign' => 'idaccidenteimplicado')
        );
        $this->hasOne('DatAccidente', array('local' => 'idaccidente', 'foreign' => 'idaccidente'));
    }

    public function getById($idaccidenteimplicado)
    {
        return Doctrine::getTable('DatAccidenteimplicado')->find($idaccidenteimplicado);
    }

    public function getImplicados($idaccidente, $filtro, $inicio, $limite)
    {
        $sql = "SELECT
                  ai.*
				, dp.idpersona
				, sl.idcargo
				, sl.idarea as idarea
				, ti.denominacion as tipoinvalidez
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_sstaccidente.dat_accidenteimplicado AS ai
				LEFT JOIN mod_sstaccidente.nom_tipoinvalidez AS ti ON (ti.idtipoinvalidez = ai.idtipoinvalidez)
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (pe.idpersona = ai.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE ai.idaccidente = '$idaccidente'";
        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $sql = $sql . " ORDER BY dp.nombre";
        if (!empty($limite)) {
            $sql = $sql . " OFFSET $inicio LIMIT $limite";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantImplicados($idaccidente, $filtro)
    {
        $sql = "SELECT
				ai.idaccidenteimplicado
				FROM mod_sstaccidente.dat_accidenteimplicado AS ai
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (pe.idpersona = ai.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE ai.idaccidente = '$idaccidente'";

        if ($filtro != null) {
            $sql .= " AND (cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%'
                or ident.numero ilike '%$filtro%' or dp.nombre ilike '%$filtro%'
                or dp.snombre ilike '%$filtro%' or dp.papel ilike '%$filtro%'
                or dp.sapel ilike '%$filtro%')";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }

    public function existePersona($idaccidente, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenteimplicado m')
            ->where("m.idaccidente = '$idaccidente' and m.idpersona = '$idpersona'");
        return $queryObj->fetchArray();
    }

    public function existeFallecido($idaccidente, $idestructura, $anno, $equiparado)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAccidenteimplicado m')
            ->innerJoin('m.DatAccidente a')
            ->where("m.ffallecimiento IS NOT NULL AND a.identidad = '$idestructura'");
        if (!empty($idaccidente)) {
            $queryObj->addWhere("m.idaccidente = '$idaccidente'");
        }
        if (!empty($anno)) {
            $queryObj->addWhere("date_part('year', a.fecha) = $anno");
        }
        if (isset($equiparado)) {
            $queryObj->addWhere("a.equiparado = $equiparado");
        }
        return $queryObj->fetchArray();
    }

    public function getCantAccidenteBypersona($idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('a.*')
            ->from('DatAccidenteimplicado a')
            ->where("a.idpersona = '$idpersona'");
        return count($queryObj->fetchArray());
    }

    public function getDatosByImplicado($idaccidenteimplicado)
    {
        $sql = "SELECT
                  ai.tareahabitual
				, dp.idpersona
				, dp.sexo
				, date_part('year',age(dn.fechanacimiento)) AS edad
				, date_part('year',age(sl.fdesde)) AS antiguedad
				, sl.idcargo
				, tc.denominacion as tipocontrato
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_sstaccidente.dat_accidenteimplicado AS ai
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (pe.idpersona = ai.idpersona)
				INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = pe.idpersonaentidad)
				INNER JOIN mod_fuerzatrabajo.nom_tipocontrato AS tc ON (tc.idtipocontrato = sl.idtipocontrato)
				INNER JOIN mod_persona.dat_persona AS dp ON (pe.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)
				WHERE ai.idaccidenteimplicado = '$idaccidenteimplicado'";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getNivelEduByPersona($idpersona)
    {
        $sql = "SELECT
                  nne.denominacion as niveleducacional
				FROM mod_personaext.dat_niveleducacional AS ne
				INNER JOIN mod_personaext.nom_niveleducacional AS nne ON (ne.idniveleducacional = nne.idniveleducacional)
				WHERE ne.idpersona = '$idpersona'
				ORDER BY ne.fdesde DESC";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql)[0]['niveleducacional'];
    }

    public function obtenerCantImplicadosPorAccidente($arrEstructura)
    {
        $sql = "SELECT
                    da.idaccidente,
                    nta.denominacion || ' (' || da.fecha || ' ' || da.hora || ')' AS denominacion,
                    count(dai.idaccidenteimplicado) AS cantidad
                FROM mod_sstaccidente.dat_accidente AS da
                INNER JOIN mod_sstaccidente.nom_tipoaccidente AS nta ON (da.idtipoaccidente = nta.idtipoaccidente)
                LEFT JOIN mod_sstaccidente.dat_accidenteimplicado AS dai ON (da.idaccidente = dai.idaccidente)";
        $sql = $sql . "GROUP BY da.idaccidente, nta.denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerCantFallecidosPorYear($arrEstructura)
    {
        $sql = "SELECT
                    substring(da.fecha::VARCHAR, 7, 4) AS denominacion,
                    count(da.idaccidente) AS cantidad
                FROM mod_sstaccidente.dat_accidente AS da
                INNER JOIN mod_sstaccidente.dat_accidenteimplicado AS dai ON (da.idaccidente = dai.idaccidente)
                WHERE dai.ffallecimiento IS NOT NULL";
        $sql = $sql . " GROUP BY denominacion";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getCantPartescuerpo($idestructura)
    {

        $idestructura = -1;
        if ($idestructura == '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $sql = "SELECT count(ip.idpartecuerpo) as cantidad,np.denominacion
                  FROM  mod_sstaccidente.dat_accidente acci
                   LEFT JOIN mod_sstaccidente.dat_accidenteimplicado ai ON(acci.idaccidente=ai.idaccidente)
                  LEFT JOIN mod_sstaccidente.dat_implicadopartecuerpo ip ON(ai.idaccidenteimplicado=ip.idaccidenteimplicado)
                  INNER JOIN mod_sstaccidente.nom_partecuerpo np on(ip.idpartecuerpo=np.idpartecuerpo)
                WHERE acci.identidad=$idestructura
                 GROUP BY np.denominacion ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getCantTipoinvalidez($idestructura)
    {
        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $sql = "SELECT count(ai.idtipoinvalidez) as cantidad,ti.denominacion
              FROM mod_sstaccidente.dat_accidente acc  
              left JOIN mod_sstaccidente.dat_accidenteimplicado ai on(acc.idaccidente=ai.idaccidente)
              inner JOIN mod_sstaccidente.nom_tipoinvalidez ti on(ai.idtipoinvalidez=ti.idtipoinvalidez)
                WHERE acc.identidad=$idestructura
                 GROUP BY ti.denominacion ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getDatosPartesAfectadas($idestructura, $partes, $annoini, $annofin)
    {

        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }

        $sql = "SELECT date_part('year', acc.fecha) as anno,np.denominacion, count(np.idpartecuerpo) as cantidad
                  FROM mod_sstaccidente.dat_implicadopartecuerpo im
                  left join mod_sstaccidente.dat_accidenteimplicado acci on (acci.idaccidenteimplicado = im.idaccidenteimplicado )
                  left join mod_sstaccidente.dat_accidente acc on (acc.idaccidente =acci.idaccidente)
                  left join mod_sstaccidente.nom_partecuerpo np on (np.idpartecuerpo =im.idpartecuerpo)
                  where acc.identidad= " . $idestructura . " and date_part('year', acc.fecha) between " . $annoini . " and " . $annofin;

        $sql .= (empty($partes)) ? " GROUP BY im.idpartecuerpo,anno,np.denominacion" : " and im.idpartecuerpo in ($partes) GROUP BY im.idpartecuerpo,anno,np.denominacion";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;

    }

    public function getDatosComportamiento($idestructura, $annoini, $annofin)
    {

        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }
        $sql = "  select anno, sum(menos17) as menos17 ,sum(entre1725) as entre1725,sum(entre2640) as entre2640,sum(entre4150) as entre4150,sum(entre5160) as entre5160,sum(mayor60) as mayor60
                   from 
                  (
			SELECT date_part('year', acc.fecha) as anno,
                  
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento)))< 17 THEN count(im.idpersona) else 0 end   as menos17,
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento))) between 17 and 25 THEN count(im.idpersona) else 0 end   as entre1725,
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento))) between 26 and 40 THEN count(im.idpersona) else 0 end   as entre2640,
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento))) between 41 and 50 THEN count(im.idpersona) else 0 end   as entre4150,
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento))) between 51 and 60 THEN count(im.idpersona) else 0 end   as entre5160,
			CASE WHEN (select date_part('year',age(now()::date,n.fechanacimiento))) > 60 THEN count(im.idpersona) else 0 end   as mayor60	
			
			    FROM mod_sstaccidente.dat_accidenteimplicado im   
                             
                  left join mod_sstaccidente.dat_accidente acc on (acc.idaccidente =im.idaccidente)                 
                  inner join mod_persona.dat_datosnacimiento n on(im.idpersona=n.idpersona)                 
                  where  acc.identidad= " . $idestructura . " and date_part('year', acc.fecha)  between " . $annoini . " and " . $annofin . "
                  GROUP BY acc.fecha,n.fechanacimiento,im.idpersona
                  ) as tabla group by anno";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getDatosIncapacidad($idestructura, $incapacidad, $annoini, $annofin)
    {

        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }

        $sql = "SELECT date_part('year', acc.fecha) as anno,np.denominacion, count(np.idtipoinvalidez) as cantidad 
                  FROM mod_sstaccidente.dat_accidenteimplicado im 
                 left join mod_sstaccidente.dat_accidente acc on (acc.idaccidente =im.idaccidente) 
                 left join mod_sstaccidente.nom_tipoinvalidez np on (np.idtipoinvalidez =im.idtipoinvalidez)
                 where acc.identidad= " . $idestructura . "  and date_part('year', acc.fecha)  between " . $annoini . " and " . $annofin;

        $sql .= (empty($incapacidad)) ? " GROUP BY im.idtipoinvalidez,anno,np.denominacion" : " and im.idtipoinvalidez in ($incapacidad) GROUP BY im.idtipoinvalidez,anno,np.denominacion";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getDatosCantFallecidos($idestructura, $accidentes, $annoini, $annofin)
    {
        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }

        $sql = "SELECT date_part('year', acc.fecha) as anno,np.denominacion, count(acc.idtipoaccidente) as cantidad 
                FROM mod_sstaccidente.dat_accidenteimplicado im                 
                left join mod_sstaccidente.dat_accidente acc on (acc.idaccidente =im.idaccidente) 
                left join mod_sstaccidente.nom_tipoaccidente np on (np.idtipoaccidente =acc.idtipoaccidente)
                 where acc.identidad= " . $idestructura . "  and im.ffallecimiento is not null and date_part('year', acc.fecha)  between " . $annoini . " and " . $annofin;

        $sql .= (empty($accidentes)) ? " GROUP BY acc.idtipoaccidente,anno,np.denominacion" : " and acc.idtipoaccidente in ($accidentes) GROUP BY acc.idtipoaccidente,anno,np.denominacion";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getCategoriasActivas($categoria){
        $sql=" SELECT *  FROM  mod_estructuracomp.nom_categocup  WHERE fechafin IS NULL AND visible=1 ";
        $sql .= (empty($categoria)) ? ";" : " and idcategocup in (".$categoria.");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getDatosCategoria($idestructura, $categoria, $annoini, $annofin)
    {

        if ($idestructura != '') {
            $idestructura = $idestructura;
        } else {
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        }

        $sql = "SELECT date_part('year', acc.fecha) as anno,np.denominacion, count(np.idcategocup) as cantidad 
                  FROM mod_sstaccidente.dat_accidenteimplicado im 
                 left join mod_sstaccidente.dat_accidente acc on (acc.idaccidente =im.idaccidente)                
                  left join mod_persona.dat_personaentidad pe on (pe.idpersona =im.idpersona)                 
                  left join mod_persona.dat_situacionlaboral sit on (sit.idpersonaentidad =pe.idpersonaentidad)                   
                  left join mod_estructuracomp.dat_cargocivil ca on (sit.idcargo =ca.idcargo)                 
                  left join mod_estructuracomp.nom_categocup np on (np.idcategocup =ca.idcategocup)                  
                 where acc.identidad= " . $idestructura . "  and sit.estado=0 and date_part('year', acc.fecha)  between " . $annoini . " and " . $annofin ;

        $sql .= (empty($categoria)) ? " GROUP BY ca.idcategocup,anno,np.denominacion" : " and ca.idcategocup in ($categoria) GROUP BY ca.idcategocup,anno,np.denominacion";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }


}