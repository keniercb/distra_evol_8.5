<?php

class DatoscategocupgrupoescalaModel extends ZendExt_Model
{
    public function DatoscategocupgrupoescalaModel()
    {
        parent::ZendExt_Model();

    }
    
    public function getDatos($idestructura)
    {
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
        
        if (count($cargos) > 0) {
            foreach ($cargos as $h => $carg) {
                $idcargos[$h] = $carg['idcargo'];
            }
            $stringIdsCargos = $this->arrayToString($idcargos);
            
            $sql = "SELECT ngc.denominacion,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 1 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as totaloperarios,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 1 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujeresoperarios,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 3 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as totalservicio,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 3 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujeresservicio,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 2 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as totaladministrativos,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 2 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujeresadministrativos,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 4 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as totaltecnicos,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 4 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujerestecnicos,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 5 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as totalcuadros,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND mco.idcategoriareporte = 5 AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujerescuadros,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as total,
                        (SELECT count(sl.idsituacionlaboralp) 
                                FROM mod_persona.dat_situacionlaboral AS sl
                                INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                                LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                                LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                                INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                                WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0 AND dp.sexo <> 1
                                        AND sl.idcargo IN ($stringIdsCargos)
                        ) as mujerestotal

                FROM mod_estructuracomp.nom_grupocomplejidad AS ngc

                WHERE ngc.fechainicio <= now() AND (ngc.fechafin > now() OR ngc.fechafin IS NULL) 
                    AND (SELECT count(sl.idsituacionlaboralp) 
                        FROM mod_persona.dat_situacionlaboral AS sl
                        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                        INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = dpe.idpersona AND dp.feliminado is null)
                        LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = sl.idcargo AND cc.idproyecto = 0)
                        INNER JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                        LEFT JOIN mod_rrhhmaestro.conf_mapeocategocup AS mco ON (mco.idcategocup = co.idcategocup)
                        LEFT JOIN mod_estructuracomp.dat_cargo AS dc ON (dc.idcargo = sl.idcargo AND dc.idproyecto = 0)
                        INNER JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                        WHERE ns.idgrupocomplejidad = ngc.idgrupocomplejidad AND sl.principal = 1 AND sl.fdesde <= now() AND sl.estado = 0
                                AND sl.idcargo IN ($stringIdsCargos)
                    ) > 0

                ORDER BY ngc.idgrupocomplejidad;";
            
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            $datos = $conn->fetchAll($sql);
            
            $posfinal = count($datos);
            $datos[$posfinal]['denominacion'] = 'Total';
            
            foreach ($datos as $key => $value) {
                $datos[$posfinal]['totaloperarios'] += $value['totaloperarios'];
                $datos[$posfinal]['mujeresoperarios'] += $value['mujeresoperarios'];
                $datos[$posfinal]['totalservicio'] += $value['totalservicio'];
                $datos[$posfinal]['mujeresservicio'] += $value['mujeresservicio'];
                $datos[$posfinal]['totaladministrativos'] += $value['totaladministrativos'];
                $datos[$posfinal]['mujeresadministrativos'] += $value['mujeresadministrativos'];
                $datos[$posfinal]['totaltecnicos'] += $value['totaltecnicos'];
                $datos[$posfinal]['mujerestecnicos'] += $value['mujerestecnicos'];
                $datos[$posfinal]['totalcuadros'] += $value['totalcuadros'];
                $datos[$posfinal]['mujerescuadros'] += $value['mujerescuadros'];
                $datos[$posfinal]['total'] += $value['total'];
                $datos[$posfinal]['mujerestotal'] += $value['mujerestotal'];
            }
            
            return $datos;            
            
        } else {
            return array();
        }
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