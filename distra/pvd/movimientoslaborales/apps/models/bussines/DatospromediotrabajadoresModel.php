<?php

class DatospromediotrabajadoresModel extends ZendExt_Model
{
    public function DatospromediotrabajadoresModel()
    {
        parent::ZendExt_Model();

    }

    public function getDatos($estructura, $fdesde, $fhasta)
    {
        if ($estructura != "" && $fdesde && $fhasta) {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargos1 = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estructura, $iddominio, true);

            if (count($cargos1) > 0) {
                $idcargos = array();
                foreach ($cargos1 as $j => $val) {
                    array_push($idcargos, $val['idestructura']);
                }

                $fini = explode('-', $fdesde);
                $ff = explode('-', $fhasta);
                $finicio = date_create($fini[0] . '-' . $fini[1] . '-' . $fini[2]);
                $ffin = date_create($ff[0] . '-' . $ff[1] . '-' . $ff[2]);
                $personasPorCatOcupacional = array();
                $categoria = array();
                $suma = array();
                $adiciones = array();
                $deduciones = array();

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $dias = 0;
                while ($finicio <= $ffin) {
                    $fecha = $finicio->format("d/m/Y");
                    $query = "SELECT  
                                  CASE 
                                    WHEN co.idcategocup in(0,5,6) THEN 'CUADRO'
                                    ELSE co.denominacion
                                  END as denominacionr,
                              count(p.idpersona) as cantidad,
                              p.sexo
                        FROM mod_estructuracomp.dat_cargo dc
                             INNER JOIN mod_estructuracomp.dat_cargocivil cc ON cc.idcargo = dc.idcargo AND cc.idproyecto = 0
                             INNER JOIN mod_estructuracomp.nom_categocup co ON co.idcategocup = cc.idcategocup                            
                             INNER JOIN mod_persona.dat_situacionlaboral sl on sl.idcargo = dc.idcargo AND ((sl.fdesde <= cast('" . $fecha . "' as date) AND (cast('" . $fecha . "' as date) <= sl.fhasta OR sl.fhasta is null)))
                             INNER JOIN mod_persona.dat_personaentidad pe on pe.idpersonaentidad = sl.idpersonaentidad AND ((pe.fdesde <= cast('" . $fecha . "' as date) AND (cast('" . $fecha . "' as date) <= pe.fhasta OR pe.fhasta is null)))
                             INNER JOIN mod_persona.dat_persona p on pe.idpersona = p.idpersona AND p.feliminado is null
                        WHERE dc.idcargo IN (" . implode(',', $idcargos) . ") AND dc.idproyecto = 0 group by denominacionr, p.sexo order by denominacionr";
                    $cargos = $conn->fetchAll($query);

                    foreach ($cargos as $c) {
                        $personasPorCatOcupacional[$fecha][$c['denominacionr']]['total'] += $c['cantidad'];
                        if ($c['sexo'] == 0) {
                            $personasPorCatOcupacional[$fecha][$c['denominacionr']]['mujer'] = $c['cantidad'];
                            $personasPorCatOcupacional[$fecha]['total']['mujer'] += $c['cantidad'];

                            $suma[$c['denominacionr']]['mujer'] += $c['cantidad'];
                            $suma['total']['mujer'] += $c['cantidad'];
                        }

                        if ($c['sexo'] == 1 && !isset($personasPorCatOcupacional[$fecha][$c['denominacionr']]['mujer'])) {
                            $personasPorCatOcupacional[$fecha][$c['denominacionr']]['mujer'] = 0;
                            if (!isset($suma[$c['denominacionr']]['mujer']))
                                $suma[$c['denominacionr']]['mujer'] = 0;
                        }
                        $personasPorCatOcupacional[$fecha]['total']['total'] += $c['cantidad'];
                        $categoria[$c['denominacionr']] = $c['denominacionr'];

                        $suma[$c['denominacionr']]['total'] += $c['cantidad'];
                        $suma['total']['total'] += $c['cantidad'];
                    }

                    date_add($finicio, date_interval_create_from_date_string('+1 days'));
                    $dias++;
                }
                $promedio = array();
                foreach ($suma as $key => $valor) {
                    $promedio[$key]['total'] = round($valor['total'] / $dias, 2);
                    $promedio[$key]['mujer'] = round($valor['mujer'] / $dias, 2);
                }

                $adicionesdeduciones = $this->GetAsistByCategoriaOcup($idcargos, $fdesde, $fhasta);
                foreach ($adicionesdeduciones as $v) {
                    if (count($this->getCausasadicionesdeduciones()) > 0) {
                        if ($v['sexo'] == 0) {
                            if (count($this->getCausasadiciones($v['idcausa'])) > 0) {
                                $adiciones[$v['denominacionr']]['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                                $adiciones['total']['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            } else if (count($this->getCausasdeduciones($v['idcausa'])) > 0) {
                                $deduciones[$v['denominacionr']]['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                                $deduciones['total']['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            }
                        }
                        if (count($this->getCausasadiciones($v['idcausa'])) > 0) {
                            $adiciones[$v['denominacionr']]['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            $adiciones['total']['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                        } else if (count($this->getCausasdeduciones($v['idcausa'])) > 0) {
                            $deduciones[$v['denominacionr']]['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            $deduciones['total']['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                        }
                    } else {
                        if ($v['sexo'] == 0) {
                            if ($v['afectasalario'] == 0) {
                                $adiciones[$v['denominacionr']]['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                                $adiciones['total']['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            } else {
                                $deduciones[$v['denominacionr']]['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                                $deduciones['total']['mujer'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            }
                        }
                        if ($v['afectasalario'] == 0) {
                            $adiciones[$v['denominacionr']]['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            $adiciones['total']['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                        } else {
                            $deduciones[$v['denominacionr']]['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                            $deduciones['total']['total'] += round($v['cantidad'] / $dias, 2);//$v['cantidad'];
                        }
                    }
                }
                
                $promediototal = array();
                foreach ($promedio as $k => $p) {
                    $promediototal[$k]['total'] = $promedio[$k]['total'] + $adiciones[$k]['total'] - $deduciones[$k]['total'];
                    $promediototal[$k]['mujer'] = $promedio[$k]['mujer'] + $adiciones[$k]['mujer'] - $deduciones[$k]['mujer'];
                }
                $res['resultado'] = $personasPorCatOcupacional;
                $res['catocup'] = $categoria;
                $res['suma'] = $suma;
                $res['promedio'] = $promedio;
                $res['adiciones'] = $adiciones;
                $res['deduciones'] = $deduciones;
                $res['promediototal'] = $promediototal;

                return $res;
            } else {
                return array();
            }
        }
    }

    private function getCausasadiciones($idcausa)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                    FROM
                    mod_regimentrabajo.conf_causasadicionesdeduciones
                      where adiciondeducion = 1 and idcausa = " . $idcausa . ";";
        return $conn->fetchAll($query);
    }

    private function getCausasdeduciones($idcausa)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                    FROM
                    mod_regimentrabajo.conf_causasadicionesdeduciones
                      where adiciondeducion = 0 and idcausa = $idcausa;";
        return $conn->fetchAll($query);
    }

    private function getCausasadicionesdeduciones()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                    FROM
                    mod_regimentrabajo.conf_causasadicionesdeduciones;";
        return $conn->fetchAll($query);
    }

    public function GetAsistByCategoriaOcup($idcargo, $fdesde, $fhasta)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $query = "SELECT CASE
                             WHEN co.idcategocup in (0, 5, 6) THEN 'CUADRO'
                             ELSE co.denominacion
                           END as denominacionr,count(m3.idpersona) as cantidad,m3.sexo,m.idcausa, nc.afectasalario
                    FROM mod_regimentrabajo.dat_asistencia m
                    INNER JOIN mod_persona.dat_persona m3 ON m3.idpersona = m.idpersona
                    LEFT JOIN mod_persona.dat_personaentidad m11 ON m3.idpersona = m11.idpersona
                    LEFT JOIN mod_persona.dat_situacionlaboral m12 ON m11.idpersonaentidad = m12.idpersonaentidad and m12.estado = 0
                    LEFT JOIN mod_estructuracomp.dat_cargo m14 ON m12.idcargo = m14.idcargo AND (m14.idproyecto = 0)
                    INNER JOIN mod_personaext.dat_regimentrabajo drt ON drt.idpersona = m.idpersona AND drt.idcargo = m.idcargo and drt.actual = 1
                    INNER JOIN mod_estructuracomp.dat_cargocivil cc ON cc.idcargo = m14.idcargo AND cc.idproyecto = 0
                    INNER JOIN mod_estructuracomp.nom_categocup co ON co.idcategocup = cc.idcategocup
                    INNER JOIN mod_regimentrabajo.nom_causa nc on m.idcausa = nc.idcausa";

        $where = " WHERE ((m.fecharegistro >= cast('" . $fdesde . "' as date)
			 AND m.fecharegistro <= cast('" . $fhasta . "' as date)
			 AND m.fhasta is null AND m.fdesde is null
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo and m.idcausa is not null)
			 OR (m.fhasta is not null
			 AND m.fdesde is not null and((m.fhasta <= cast('" . $fhasta . "' as date)
			 and m.fhasta >= cast('" . $fdesde . "' as date))
			 or (m.fdesde <= cast('" . $fhasta . "' as date)
			 and m.fdesde >= cast('" . $fdesde . "' as date))
			 or ((m.fhasta >= cast('" . $fhasta . "' as date)
			 and m.fdesde <= cast('" . $fdesde . "' as date))))
			 and m.idcargo in (" . implode(',', $idcargo) . ") and drt.idcargo = m12.idcargo and m.idcausa is not null))
             ";
        $query .= $where . " group by denominacionr, m3.sexo,m.idcausa,nc.afectasalario
                                order by denominacionr";
        $personas = $conn->fetchAll($query);
        return $personas;
    }

}