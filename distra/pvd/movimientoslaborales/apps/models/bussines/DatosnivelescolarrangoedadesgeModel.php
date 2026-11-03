<?php

class DatosnivelescolarrangoedadesgeModel extends ZendExt_Model
{
    public function DatosnivelescolarrangoedadesgeModel()
    {
        parent::ZendExt_Model();

    }
    
    //Obtengo solo los Grupo Escala que tengan personas ocupando el cargo:
    public function getGruposEscala($idestructura)
    {        
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);  
        
        if (count($cargos) > 0) {
            foreach ($cargos as $h => $carg) {
                $idcargos[$h] = $carg['idcargo'];
            }
            $stringIdsCargos = $this->arrayToString($idcargos);
            
            $sql = "SELECT ngc.idgrupocomplejidad, ngc.denominacion as grupoescala
                    FROM mod_estructuracomp.nom_grupocomplejidad AS ngc
                    WHERE ngc.fechainicio <= now() AND (ngc.fechafin > now() OR ngc.fechafin IS NULL)
                        AND (SELECT count(sl.idsituacionlaboralp) 
                            FROM mod_persona.dat_situacionlaboral AS sl
                            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)                            
                            LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                            INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                            WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                    AND sl.idcargo IN ($stringIdsCargos)
                        ) > 0
                    ORDER BY ngc.idgrupocomplejidad;";
        
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            return $conn->fetchAll($sql);
        } else {
            return array();
        }
        
        
    }
    
    public function getDenominacionColumnas()
    { 
        $denomColumnas = array();
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        $sqlNivelEduc = "SELECT ne.denominacion
                  FROM mod_personaext.nom_niveleducacional AS ne
                  WHERE ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)
                  ORDER BY ne.idniveleducacional;";        
        $nivelesEduc = $conn->fetchAll($sqlNivelEduc);
        
        $denomColumnas[] = 'Grupo Escala';
        
        foreach ($nivelesEduc as $key => $value) {
            $denomColumnas[] = $value['denominacion'];
        }
        
        $idestructuraentro = $this->global->Estructura->idestructura;
     
        $sqlRangosEdades = "SELECT re.denominacion
                  FROM mod_rrhhmaestro.conf_rangoedades AS re
                  WHERE re.idestructura = {$idestructuraentro} 
                  ORDER BY re.orden;";        
        $rangosEdades = $conn->fetchAll($sqlRangosEdades);
        
        foreach ($rangosEdades as $key => $value) {
            $denomColumnas[] = $value['denominacion'];
        }
        
        $denomColumnas[] = 'En edad de jubilación';
        
        $denomColumnas[] = 'TOTAL';
        
        $result = array();
        $result['denominaciones'] = $denomColumnas;
        $result['totalniveleduc'] = count($nivelesEduc);
        $result['totalrangoedades'] = count($rangosEdades);
      
        return $result;
    }
    
    public function getValoresFila($idgrupocomplejidad, $idestructura)
    {
        $valoresFila = array();
        
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);                
            
        if (count($cargos) > 0) {
            
            foreach ($cargos as $h => $carg) {
                $idcargos[$h] = $carg['idcargo'];
            }
            $stringIdsCargos = $this->arrayToString($idcargos);
            
            $valoresFila['escolaridad'] = $this->getEscolaridad($stringIdsCargos, $idgrupocomplejidad);
            
            $valoresFila['rangosedades'] = $this->getDatosRangosEdades($stringIdsCargos, $idgrupocomplejidad);
            
            $datosEdades = $this->getDatosEdades($stringIdsCargos, $idgrupocomplejidad);
            $datosEdadesMujeres = $this->getDatosEdadesMujeres($stringIdsCargos, $idgrupocomplejidad);
            
            $valoresFila['enedadjubilacion'] = $datosEdades[0]['enedadjubilacion'];                      
            $valoresFila['enedadjubilacionmujeres'] = $datosEdadesMujeres[0]['enedadjubilacion'];   
            
            $datosTotal = $this->getTotal($stringIdsCargos, $idgrupocomplejidad);
            $datosTotalMujeres = $this->getTotalMujeres($stringIdsCargos, $idgrupocomplejidad);
            
            $valoresFila['totaltotal'] = "";
            if (!empty($datosTotal[0]['total'])) {
                $valoresFila['totaltotal'] = $datosTotal[0]['total'];
            }
            
            $valoresFila['totalmujeres'] = "";
            if (!empty($datosTotalMujeres[0]['totalmujeres'])) {
                $valoresFila['totalmujeres'] = $datosTotalMujeres[0]['totalmujeres'];
            }
            
        } else {            
            $valoresFila['escolaridad'] = array();
            
            $valoresFila['rangosedades'] = array();
            
            $valoresFila['enedadjubilacion'] = "";            
            $valoresFila['enedadjubilacionmujeres'] = "";
            
            $valoresFila['totaltotal'] = "";
            $valoresFila['totalmujeres'] = "";
        }
        
        return $valoresFila;
    }
    
    public function getEscolaridad($stringIdsCargos, $idgrupocomplejidad)
    {        
        $sql = "SELECT ne.denominacion, (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    LEFT JOIN mod_personaext.dat_niveleducacional AS dne ON (dne.idpersona = dp.idpersona 
                        AND dne.fdesde = (SELECT MAX(dnie.fdesde) 
                                            FROM mod_personaext.dat_niveleducacional AS dnie 
                                            WHERE dnie.idpersona = dp.idpersona))
		    LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
		    INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                    WHERE dne.idniveleducacional = ne.idniveleducacional AND sl.principal = 1 
                        AND sl.fdesde <= now() AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad
                        AND sl.idcargo IN ($stringIdsCargos)
                ) as cantidad,
                (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    LEFT JOIN mod_personaext.dat_niveleducacional AS dne ON (dne.idpersona = dp.idpersona 
                        AND dne.fdesde = (SELECT MAX(dnie.fdesde) 
                                            FROM mod_personaext.dat_niveleducacional AS dnie 
                                            WHERE dnie.idpersona = dp.idpersona))
		    LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
		    INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                    WHERE dne.idniveleducacional = ne.idniveleducacional AND sl.principal = 1 AND dp.sexo <> 1
                        AND sl.fdesde <= now() AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad
                        AND sl.idcargo IN ($stringIdsCargos)
                ) as cantidadmujeres

	FROM mod_personaext.nom_niveleducacional AS ne

	WHERE ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)

	ORDER BY ne.idniveleducacional";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    public function getDatosRangosEdades($stringIdsCargos, $idgrupocomplejidad)
    {        
        $idestructuraentro = $this->global->Estructura->idestructura;
        
        $sql = "SELECT re.denominacion, (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)
		    LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
		    INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                    WHERE (CASE WHEN re.valorinicial is null THEN TRUE ELSE date_part('year', age(dn.fechanacimiento)) >= re.valorinicial END) 
                        AND (CASE WHEN re.valorfinal is null THEN TRUE ELSE date_part('year', age(dn.fechanacimiento)) <= re.valorfinal END)
                        AND sl.principal = 1 
                        AND sl.fdesde <= now() AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad
                        AND sl.idcargo IN ($stringIdsCargos)
                ) as cantidad,
                (SELECT count(sl.idsituacionlaboralp) 
                    FROM mod_persona.dat_situacionlaboral AS sl 
                    INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
                    INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                    LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)
		    LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
		    INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                    WHERE (CASE WHEN re.valorinicial is null THEN TRUE ELSE date_part('year', age(dn.fechanacimiento)) >= re.valorinicial END) 
                        AND (CASE WHEN re.valorfinal is null THEN TRUE ELSE date_part('year', age(dn.fechanacimiento)) <= re.valorfinal END)
                        AND sl.principal = 1 AND dp.sexo <> 1
                        AND sl.fdesde <= now() AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad
                        AND sl.idcargo IN ($stringIdsCargos)
                ) as cantidadmujeres

	FROM mod_rrhhmaestro.conf_rangoedades AS re
        
        WHERE re.idestructura = {$idestructuraentro} 
            
        ORDER BY re.orden;";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    public function getDatosEdades($stringIdsCargos, $idgrupocomplejidad)
    {        
        $sql = "SELECT 
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND dn.fechanacimiento is null limit 1 )) as edadnoconocida,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND ((date_part('year', age(dn.fechanacimiento)) >= 60 AND dp.sexo <> 1) OR (date_part('year', age(dn.fechanacimiento)) >= 65 AND dp.sexo = 1)) limit 1 )) as enedadjubilacion
	
	FROM mod_persona.dat_situacionlaboral AS sl 

	INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
	INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null) 
	LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)

	LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)

	WHERE sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.fdesde <= now() 
            AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    public function getDatosEdadesMujeres($stringIdsCargos, $idgrupocomplejidad)
    {        
        $sql = "SELECT 
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND dn.fechanacimiento is null limit 1 )) as edadnoconocida,
            SUM((select 1 
                from mod_persona.dat_situacionlaboral as dsl 
                where dsl.idsituacionlaboralp = sl.idsituacionlaboralp 
                    AND (date_part('year', age(dn.fechanacimiento)) >= 60) limit 1 )) as enedadjubilacion
	
	FROM mod_persona.dat_situacionlaboral AS sl 

	INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad) 
	INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null) 
	LEFT JOIN mod_persona.dat_datosnacimiento AS dn ON (dn.idpersona = dp.idpersona)

	LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
        INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)

	WHERE sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.fdesde <= now() AND dp.sexo <> 1
            AND sl.estado = 0 AND ns.idgrupocomplejidad = $idgrupocomplejidad";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    public function getTotal($stringIdsCargos, $idgrupocomplejidad)
    {        
        $sql = "SELECT count(sl.idsituacionlaboralp) as total
                FROM mod_persona.dat_situacionlaboral AS sl 

                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)

                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)

                WHERE ns.idgrupocomplejidad = $idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() 
                    AND sl.estado = 0 AND sl.idcargo IN ($stringIdsCargos)";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    public function getTotalMujeres($stringIdsCargos, $idgrupocomplejidad)
    {        
        $sql = "SELECT count(sl.idsituacionlaboralp) as totalmujeres
                FROM mod_persona.dat_situacionlaboral AS sl 

                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)

                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)

                WHERE ns.idgrupocomplejidad = $idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() 
                    AND dp.sexo <> 1 AND sl.estado = 0 AND sl.idcargo IN ($stringIdsCargos)";
        
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        
        return $conn->fetchAll($sql);
    }
    
    private function arrayToString($array)
    {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }
    
 
}