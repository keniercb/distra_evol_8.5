<?php
$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteEmpleoRemuneracion extends ZendExt_Model
{
    function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getDatosPromediotrabActual($estructura, $fdesde, $fhasta)
    {    
        {
            if ($estructura != "" && $fdesde && $fhasta) {
                $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
                $cargos1 = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estructura, $iddominio, true);
    
                if (count($cargos1) > 0) {
                    $idcargos = array();
                    foreach ($cargos1 as $j => $val) {
                        array_push($idcargos, $val['idestructura']);
                    }
                    list($diad, $mesd, $annod) = explode('/', $fdesde);
                    list($diah, $mesh, $annoh) = explode('/', $fhasta);
                    $finicio = date_create($diad . '-' . $mesd . '-' . $annod); //
                    $ffin = date_create($diah. '-' . $mesh . '-' . $annoh);
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

    }

    public function getDatosPromediotrabAnterior($estructura, $fdesde, $fhasta)
    {  
        if ($estructura != "" && $fdesde && $fhasta) {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estructura, $iddominio, true);

            if (count($cargos) > 0) {
                $idcargos = array();
                foreach ($cargos as $j => $val) {
                    array_push($idcargos, $val['idestructura']);
                }
                list($diab, $mesb, $annob) = explode('/', $fdesde);
                $anno=$annob-1;   
                list($diad, $mesd, $annod) = explode('/', $fdesde);
                list($diah, $mesh, $annoh) = explode('/', $fhasta);
                $finicio = date_create( $anno.'-'.$mesd.'-'.$diad);  
                $ffin= date_create( $anno.'-'.$mesh.'-'.$diah);

                $personasPorCatOcupacional = array();
                $categoria = array();
                $suma = array();

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $dias = 0;
                while ($finicio <= $ffin) {
                    $fecha= $finicio->format("d/m/Y");
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


                $res['suma'] = $suma;
                $res['promedio'] = $promedio;

                return $res;
            } else {
                return array();
            }
        }
       
    }

    public function getPlanPromedioTrabaj($estructura, $fdesde, $fhasta)
    {    
        $obj= new ReporteEmpleoRemuneracion();
        if ($estructura != "" && $fdesde && $fhasta) {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estructura, $iddominio, true);

            if (count($cargos) > 0) {
                $idcargos = array();
                foreach ($cargos as $j => $val) {
                    array_push($idcargos, $val['idestructura']);
                }
                $fechaplan =  $obj->PlanAcumula($fdesde,$fhasta); 
                $finiciop=$fechaplan['inicio']; 
                $ffinp=$fechaplan['fin'];
                list($diad, $mesd, $annod) = explode('/', $finiciop);
                list($diah, $mesh, $annoh) = explode('/', $ffinp);
                $finicio = date_create($annod.'-'.$mesd.'-'.$diad);  
                $ffin = date_create($annoh.'-'.$mesh.'-'.$diah); 
                $personasPorCatOcupacional = array();
                $categoria = array();
                $suma = array();

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $dias = 0;
                while ($finicio <= $ffin) {
                    $fecha = $fdesde; 
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

                $res['resultado'] = $personasPorCatOcupacional;
                $res['catocup'] = $categoria;
                $res['suma'] = $suma;
                $res['promedio'] = $promedio;
                
                return $res;
            } else {
                return array();
            }
        }
    } 
    
    public function periodoSemestreAnt($inicio,$fin)
    {
       
        list($dia, $mes, $anno) = explode('/', $inicio);
        list($diaf, $mesf, $annof) = explode('/', $fin);
        $annoi= $anno - 1;
        $annofin=$annof - 1;
        $ini = $dia.'/'. $mes.'/'. $annoi;
        $fin = $diaf.'/'. $mesf.'/'. $annofin;
         $semestre ['inicio']=$ini;
         $semestre['fin']= $fin;
         return $semestre;
    }

   ///////// especialidad 

    public function Especialidad($filtro) 
    {
        if ($filtro) {
            $sqlespecialidad="SELECT DISTINCT ne.idespecialidad, ne.denespecialidad
            FROM mod_datosmaestros.nom_especialidad ne where ne.denespecialidad ilike '%$filtro%' order by ne.denespecialidad ASC ;"; 
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $esp = $conn->fetchAll($sqlespecialidad); 

        } else {
            $sqlespecialidad="SELECT DISTINCT ne.idespecialidad, ne.denespecialidad
                                FROM mod_datosmaestros.nom_especialidad ne ---where ne.idpadre='98'; 
                                order by ne.denespecialidad ASC"; 
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $esp = $conn->fetchAll($sqlespecialidad); 
        }
    
     return array('datos'=>$esp, 'cantidad'=>count($esp));
    }

    public function NOMEsp($id)
    {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sqlespecialidad="SELECT DISTINCT  ne.denespecialidad  FROM mod_datosmaestros.nom_especialidad ne
                           WHERE ne.idespecialidad = $id ";
            $esp = $conn->fetchAll($sqlespecialidad); //print_r($esp);die;
        $final=$esp[0]['denespecialidad'];
        return $final;
    }

    public function cantPersonasxIDESP($idestructura,$inicio,$fin,$id,$idcargos) 
    {
        $obj= new ReporteEmpleoRemuneracion();
        $idniveleducacional= $obj->FINDidUniv();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlesp = "SELECT DISTINCT count(pent.idpersona) as cantidad
                      FROM mod_persona.dat_persona as pent
                      INNER JOIN mod_persona.dat_personaentidad pe ON (pent.idpersona = pe.idpersona) AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                            inner join mod_persona.dat_situacionlaboral as pstl ON pe.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                            inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                            left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                        where  pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                                nt.idespecialidad = $id  and pnel.idniveleducacional= $idniveleducacional and
                                (pstl.fdesde >= '$inicio' and
                                pstl.fdesde <= '$fin' or
                                pstl.fdesde >= '$inicio' and
                                pstl.fdesde <= '$fin' and
                                pstl.fhasta >= '$fin' or
                                pstl.fdesde >= '$inicio' and
                                pstl.fdesde <= '$fin' and
                                pstl.fhasta is null) 
                        or
                        pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                        (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                         nt.idespecialidad ='$id' and pnel.idniveleducacional= '$idniveleducacional' and
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio')";
                            
         $resultado = $conn->fetchAll($sqlesp);
         $cantidad= $resultado[0]['cantidad'];
        return $cantidad;
    } 

   

    ////////// titulos

    public function cantPersonasxIDTitulo($idestructura,$inicio,$fin,$idtitulo,$idcargos)   {
        $obj= new ReporteEmpleoRemuneracion();
        $idniveleducacional = $obj->FINDidUniv();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqltitulo = "SELECT DISTINCT count(pent.idpersona) as cantidad
                         FROM mod_persona.dat_persona as pent
                      INNER JOIN mod_persona.dat_personaentidad pe ON (pent.idpersona = pe.idpersona) AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                            inner join mod_persona.dat_situacionlaboral as pstl ON pe.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                            inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                            left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                        where pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                                 pnel.idtitulo = '$idtitulo' and pnel.idniveleducacional= '$idniveleducacional' and
                            (pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta >= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta is null) 
                        or
                        pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                                 pnel.idtitulo = '$idtitulo' and pnel.idniveleducacional= '$idniveleducacional' and
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio') "; 
                            
         $resultado = $conn->fetchAll($sqltitulo); 
         $cantidadact= $resultado[0]['cantidad'];
         return $cantidadact;
    }    
  
    public function Titulos($valor) {

        $mg = Doctrine_Manager::getInstance();
          $conn = $mg->getCurrentConnection();
          $sql=" SELECT DISTINCT nt.idtitulo
                       FROM mod_personaext.nom_titulo nt
                        where nt.idespecialidad = '$valor' ;"; 
           $titulos= $conn->fetchAll($sql); 
          
        return  $titulos ;
    }


  
    public function FindTitulosxID($idt) {
          $denom=array();
          $mg = Doctrine_Manager::getInstance();
          $conn = $mg->getCurrentConnection();
          $sql = " SELECT DISTINCT denominacion
              FROM mod_personaext.nom_titulo where idtitulo  = '$idt' ; "; 
          $titulo = $conn->fetchAll($sql); //echo'<pre>';print_r($titulo);die;
          return $titulo[0]['denominacion'];
    }

    public function FINDidUniv(){
          $denom=array();
          $mg = Doctrine_Manager::getInstance();
          $conn = $mg->getCurrentConnection();
          $sql = " SELECT idniveleducacional FROM  mod_personaext.nom_niveleducacional where denominacion LIKE '%Nivel Superior%' ; ";
          $titulo = $conn->fetchAll($sql);
          return $titulo[0]['idniveleducacional'];
    }

    /// Universitarios
    public function CantPersonasUniversitarias($idestructura,$inicio,$fin,$idcargos)  {  
        $obj= new ReporteEmpleoRemuneracion();
        $idniveleducacional = $obj->FINDidUniv();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqluniv = "SELECT DISTINCT count(pent.idpersona) as cantidad
                   FROM mod_persona.dat_persona as pent
                      INNER JOIN mod_persona.dat_personaentidad pe ON (pent.idpersona = pe.idpersona) AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                            inner join mod_persona.dat_situacionlaboral as pstl ON pe.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                        inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                        left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                    where pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                                  pnel.idniveleducacional = '$idniveleducacional'  and
                            (pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta >= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta is null) 
                        or
                        pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                (pent.feliminado >= CURRENT_DATE OR pent.feliminado IS NULL)  AND 
                                 pnel.idniveleducacional = '$idniveleducacional'  and
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio')"; 
            $resultado = $conn->fetchAll($sqluniv); 
            $cantidad = $resultado[0]['cantidad']; //print_r($cantidad);die;
        
        return $cantidad;
    }

    

    ////////  horas
    public function getDatosHorasTrabajadas($idestructura,$fdesde,$fhasta,$idcargos)  {
            $obj= new ReporteEmpleoRemuneracion();
            $horas = array();
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql=" SELECT DISTINCT 
                        rta.idpersona, rta.fecharegistro, rta.hrstrabajadas
                        FROM mod_regimentrabajo.dat_asistencia rta
                        INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = rta.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                        INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                        WHERE  rta.fecharegistro >=  cast('$fdesde' as date) AND  
                                                rta.fecharegistro <= cast('$fhasta' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ";//
            $hextact = $conn->fetchAll($sql);
            for ($i1=0;$i1<= count($hextact);$i1++) {
                $hconact += strtotime($hextact[$i1]['hrstrabajadas']);
            }
            $horasact = date("H:i:s",$hconact);   
            list($dia, $mes, $anno) = explode('/', $fdesde);
            $annof=$anno-1;    
            list($diah, $mesh, $annoh) = explode('/', $fhasta);
            $finicio = $dia.'/'. $mes.'/'.$annof; 
            $ffin = $diah.'/'.$mesh.'/'.$annof;
            $sqlant=" SELECT DISTINCT 
                        rta.idpersona, rta.fecharegistro, rta.hrstrabajadas
                        FROM mod_regimentrabajo.dat_asistencia rta
                        INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = rta.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                        INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                        WHERE  rta.fecharegistro >=  cast('$finicio' as date) AND  
                                                rta.fecharegistro <= cast('$ffin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ";
            $hextant = $conn->fetchAll($sqlant);
            for ($i2=0;$i2<= count($hextant);$i2++)  {
                $hconant += strtotime($hextant[$i2]['hrstrabajadas']); //

            }
            $horasant = date("H:i:s",$hconant);

            ///// horas acumuladas actual
            $fechahact =  $obj-> RealAcumuladoActual($fhasta); 
            $iniciorealact=$fechahact['inicio']; 
            $finrealact=$fechahact['fin'];
            $sqlact=" SELECT DISTINCT 
                        rta.idpersona, rta.fecharegistro, rta.hrstrabajadas
                        FROM mod_regimentrabajo.dat_asistencia rta
                        INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = rta.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                        INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                        WHERE  rta.fecharegistro >=  cast('$iniciorealact' as date) AND  
                                                rta.fecharegistro <= cast('$finrealact' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ";
            $hact = $conn->fetchAll($sqlact);
            for ($i3=0;$i3<= count($hact);$i3++)  {
                $hract += strtotime($hact[$i3]['hrstrabajadas']);
            }
            $horasrealact = date("H:i:s",$hract);  

            ///// horas aumuladas anterior 
            $fechahant =  $obj-> RealAcumuladoAnterior($fhasta); 
            $iniciorealant=$fechahant['inicio']; 
            $finrealant=$fechahant['fin'];
            $sqlant=" SELECT DISTINCT 
                        rta.idpersona, rta.fecharegistro, rta.hrstrabajadas
                        FROM mod_regimentrabajo.dat_asistencia rta
                        INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = rta.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                        INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                        WHERE  rta.fecharegistro >=  cast('$iniciorealant' as date) AND  
                                                rta.fecharegistro <= cast('$finrealant' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ";
            $hant = $conn->fetchAll($sqlant);
            for ($i4=0; $i4<= count($hant); $i4++)  {
                $hrant += strtotime($hant[$i4]['hrstrabajadas']);
            }
            $horasrealant = date("H:i:s",$hrant);  //print_r($horasrealant );die;

            $horas['act'] = $horasact;
            $horas['ant'] = $horasant;
            $horas['realact'] = $horasrealact;
            $horas['realant'] = $horasrealant;
            $horas['sumahant'] =$hconant;
            $horas['sumahact'] =$hconact;
            $horas['sumahacumact'] =$hract;
            $horas['sumahacumant'] =$hrant;
            return $horas;
    }
      
    public function MeSAnt($fdesde,$fhasta) {
            list($dia, $mes, $anno) = explode('/', $fdesde);
            $annof=$anno-1;    
            list($diah, $mesh, $annoh) = explode('/', $fhasta);
            $annoa=$annoh-1;
            $finicio = $dia.'/'. $mes.'/'.$annof; 
            $ffin = $diah.'/'.$mesh.'/'.$annoa; 
            $fecha['inicio']=$finicio;
            $fecha['fin']=$ffin;
            return $fecha;
    }

    //////// plan acumulado
    public function PlanAcumula($fdesde,$fhasta){
           list($dia, $mes, $anno) = explode('/', $fdesde);
           $finicio = "01/01/$anno";
           $fechaplan['inicio']=$finicio;
           $fechaplan['fin']=$fhasta;
           return $fechaplan;
    }

    /// real acumulado
    public function RealAcumuladoActual($fhasta) {
        list($dia, $mes, $anno) = explode('/', $fhasta);
       if ($mes>=06 && $mes<12) {
        $mes1= 06-04;
        $inicio="01/$mes1/$anno";
        $fin="20/$mes/$anno";
       } else {
        $mes1= 02;
        $inicio="01/$mes1/$anno";
        $fin="20/$mes/$anno";
       }
       $fechaacum['inicio']=$inicio;
       $fechaacum['fin']=$fin;
       return $fechaacum;
    }

    public function RealAcumuladoAnterior($fhasta)    {
        list($dia, $mes, $anno) = explode('/', $fhasta);
        $annot=$anno-1;
       if ($mes>=06 && $mes<12) {
        $mes1= 06-04;
        $inicio="01/$mes1/$annot";
        $fin="20/$mes/$annot";
       } else {
        $mes1= 02;
        $inicio="01/$mes1/$annot";
        $fin="20/$mes/$annot";
       }
       $fechaacum['inicio']=$inicio;
       $fechaacum['fin']=$fin;
       return $fechaacum;
    }

    ///// remuneracion
    public function getDatosRemuneracion($idestructura,$fdesde,$fhasta,$idcargos ) {  
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $obj= new ReporteEmpleoRemuneracion();
            $fechaanterior =  $this->MeSAnt($fdesde,$fhasta); 
            $finicio=$fechaanterior['inicio'];
            $ffin=$fechaanterior['fin'];
            $datosact = array();
            $contact=0;
            $contdat=0;
            $sqlactual= " SELECT DISTINCT  das.idpersona , das.idcargo
                                FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$fdesde' as date) AND  
                                          das.fecharegistro <= cast('$fhasta' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ;";
            $idperact = $conn->fetchAll($sqlactual);
            foreach ($idperact as $key){
                $ioc = ZendExt_IoC_Inter::getInstance();
                $datosact[$contact]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                $contact++;
            }
            foreach ($datosact as $key){
                $totalact+= $key['salario']->Salario;
            } 

        /////////// anterior 
            $contant=0;
            $datosant = array();
            $sqlanterior= " SELECT 	DISTINCT  das.idpersona , das.idcargo
              FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$finicio' as date) AND  
                                          das.fecharegistro <= cast('$ffin' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)";
            $idperant = $conn->fetchAll($sqlanterior);
            foreach ($idperant as $key) {
                $ioc = ZendExt_IoC_Inter::getInstance();
                $datosant[$contant]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                $contant++;
            }
            foreach ($datosant as $key)  {
                $totalant+= $key['salario']->Salario;
            }
            
            ////////////////Real acumulado Actual
            $realact =  $obj-> RealAcumuladoActual($fhasta); 
            $iniciorealact=$realact['inicio']; 
            $finrealact=$realact['fin'];
            $contrealact=0;
            $datosrealact = array();
            $sqlrealactual= " SELECT DISTINCT  das.idpersona , das.idcargo
              FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$iniciorealact' as date) AND  
                                          das.fecharegistro <= cast('$finrealact' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) ";
            $srealact = $conn->fetchAll($sqlrealactual);
            foreach ($srealact as $key) {
                $ioc = ZendExt_IoC_Inter::getInstance();
                $datosrealact[$contrealact]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                $contrealact++;
            }
            foreach ($datosrealact as $key ) {
                $totalrealact+= $key['salario']->Salario;;
            }

            ////////////////  Real Acumulado Anterior

            $realant =  $obj-> RealAcumuladoAnterior($fhasta); 
            $iniciorealant=$realant['inicio']; 
            $finrealant=$realant['fin'];
            $contsql=0;
            $datosrealant = array();
            $sqlrealanterior= " SELECT 	DISTINCT  das.idpersona , das.idcargo
              FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$iniciorealant' as date) AND  
                                          das.fecharegistro <= cast('$finrealant' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)";
            $srealant  = $conn->fetchAll($sqlrealanterior);
            foreach ($srealant as $key) {
                $ioc = ZendExt_IoC_Inter::getInstance();
                $datosrealant[$contsql]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                $contsql++;
            }
            foreach ($datosrealant as $key ) {
                $totalrealant+= $key['salario']->Salario;
            }

            //////////////// Plan Acumulado
            $fechaplan =  $obj-> PlanAcumula($fdesde,$fhasta); 
            $finiciop=$fechaplan['inicio']; 
            $ffinp=$fechaplan['fin'];
            $contplan=0;
            $datosp = array();
            $sqlplan= " SELECT 	DISTINCT  das.idpersona , das.idcargo
             FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$finiciop' as date) AND  
                                          das.fecharegistro <= cast('$ffinp' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)";
            $splan = $conn->fetchAll($sqlplan);
            if(!empty($sqlplan)) {
                foreach ($splan as $key) {
                    $ioc = ZendExt_IoC_Inter::getInstance();
                    $datosp[$contplan]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                    $contplan++;
                }
                foreach ($datosp as $key) {
                    $totalplan += $key['salario']->Salario;
                }
            }else{
                $totalplan=0;
            }

           //////////////////////////////// Mujeres actual
            $mact=array();
            $m=0;
            $sqlmujeractual="SELECT DISTINCT das.idpersona ,das.idcargo
             FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$fdesde' as date) AND  
                                          das.fecharegistro <= cast('$fhasta' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) and
                                             mdp.sexo = 0;";//print_r($sqlmujeractual);die;
            $mujeract = $conn->fetchAll($sqlmujeractual);
            if(!empty($mujeract)){
                foreach ($mujeract as $key) {
                    $ioc = ZendExt_IoC_Inter::getInstance();
                    $mact[$m]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                    $m++;
                }
                    foreach ($mact as $key ) {
                       $totalmujeract += $key['salario']->Salario;
                    }
            }else{
                $totalmujeract=0;
            }

             //////////////Anterior mujer
             $manterior=array();
             $mant=0;
             $sqlmujerant= "SELECT DISTINCT das.idpersona ,das.idcargo
                FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$finicio' as date) AND  
                                          das.fecharegistro <= cast('$ffin' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)
                                               and mdp.sexo = 0;"; //print_r($sqlmujerant);die;
              $mujerant  = $conn->fetchAll($sqlmujerant);
        if (!empty($mujerant)){
             foreach ($mujerant as $key) {
                 $ioc = ZendExt_IoC_Inter::getInstance();
                 $manterior[$mant]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                 $mant++;
             }
             foreach ($manterior as $key ) {
                 $totalmujerant += $key['salario']->Salario;
             }
        } else {
            $totalmujerant = 0;
        }

            ////////// real acumulado mujer actual
            $fecharealactmujer =  $obj-> RealAcumuladoActual($fhasta); 
            $iniciorealactmujer=$fecharealactmujer['inicio']; 
            $finrealactmujer=$fecharealactmujer['fin'];
            $mrealact=array();
            $mreala=0;
            $sqlmujerrealact= "SELECT DISTINCT das.idpersona ,das.idcargo
           FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$iniciorealactmujer' as date) AND  
                                          das.fecharegistro <= cast('$finrealactmujer' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)
                                              and mdp.sexo = 0;";
            $mujerrealact = $conn->fetchAll($sqlmujerrealact);
            if (!empty($mujerrealact)){
            foreach ($mujerrealact as $key) {
                $ioc = ZendExt_IoC_Inter::getInstance();
                $mrealact[$mreala]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                $mreala++;
            }
            foreach ($mrealact as $key ) {
               $totalmujerrealact += $key['salario']->Salario;
            }
            }else
                {
                    $totalmujerrealact=0;
                }
             ////////// real acumulado mujer anterior
            $fecharealantmujer =  $obj-> RealAcumuladoAnterior($fhasta); 
            $iniciorealantmujer=$fecharealantmujer['inicio']; 
            $finrealantmujer=$fecharealantmujer['fin'];
            $mrealant=array();
            $mrealat=0;
            $sqlmujerrealant= "SELECT DISTINCT das.idpersona ,das.idcargo
          FROM mod_regimentrabajo.dat_asistencia das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                 WHERE  das.fecharegistro >=  cast('$iniciorealantmujer' as date) AND  
                                          das.fecharegistro <= cast('$finrealantmujer' as date) AND 
                                             sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                             (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)
                                              and mdp.sexo = 0;";
             $mujerrealant = $conn->fetchAll($sqlmujerrealant);
             if (!empty($mujerrealant)) {
                 foreach ($mujerrealant as $key) {
                     $ioc = ZendExt_IoC_Inter::getInstance();
                     $mrealant[$mrealat]['salario'] = $ioc->nomina->ObtenerDatosNominaPersona($key['idcargo'], $key['idpersona'], $idestructura);
                     $mrealat++;
                 }
                 foreach ($mrealant as $key) {
                     $totalmujerrealant += $key['salario']->Salario;
                 }
             }else{
                 $totalmujerrealant=0;
             }
                 
            $remuneracion['actual']= $totalact;
            $remuneracion['ant']= $totalant;
            $remuneracion['realactual']= $totalrealact;
            $remuneracion['realant']=$totalrealant;
            $remuneracion['mujeractual']= $totalmujeract;
            $remuneracion['mujerant']= $totalmujerant;
            $remuneracion['mujerrealactual']= $totalmujerrealact;
            $remuneracion['mujerrealant']= $totalmujerrealant;
            $remuneracion['plan']= $totalplan;
           // print_r($remuneracion);die;
           return $remuneracion;
    }

    public function IDMigracion() {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql="  SELECT idcausa FROM mod_regimentrabajo.conf_conceptocausas_onei where idconcepto='1' ;";
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['idcausa'];
    }

    public function IDAltaBaja(){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlALTA="SELECT idcausa FROM mod_regimentrabajo.nom_causa where denominacion LIKE '%ALTAS%';";
        $resultadoALTA = $conn->fetchAll($sqlALTA);
        $sqlBAJA="SELECT idcausa FROM mod_regimentrabajo.nom_causa where denominacion LIKE '%BAJA%';";
        $resultadoBAJA = $conn->fetchAll($sqlBAJA);
        return array('idalta' => $resultadoALTA[0]['idcausa'] , 'idbaja' => $resultadoBAJA[0]['idcausa']);
    }
   
    public function getAltasEnRangoUniv($idestructura,$inicio,$fin,$idcargos) {
        $obj= new ReporteEmpleoRemuneracion();
        $idcausa=$obj->IDMigracion();
        $idniveleduc=$obj->FINDidUniv();
        $idaltabaja= $obj-> IDAltaBaja();
        $idalta=$idaltabaja['idalta'];
        $idbaja=$idaltabaja['idbaja'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlaltas = "SELECT DISTINCT  count(dta.idpersona) as cantidadaltas
                FROM  mod_regimentrabajo.dat_asistencia dta
                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
                 INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
                   INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                            inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                            left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                    where pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idalta'  and 
                         dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and  pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                            (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                            (pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta >= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta is null) 
                        or
                       pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idalta'  and 
                 dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and   pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                 (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND 
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio')"; 
        $resultadosqlaltas = $conn->fetchAll($sqlaltas); //print_r($resultadosqlaltas);die;
        return $resultadosqlaltas[0]['cantidadaltas'];
    }     
    
    public function getBajasEnRangoUniv($idestructura,$inicio,$fin,$idcargos) {
        $obj= new ReporteEmpleoRemuneracion();
        $idcausa=$obj->IDMigracion();
        $idniveleduc=$obj->FINDidUniv();
        $idaltabaja= $obj-> IDAltaBaja();
        $idalta=$idaltabaja['idalta'];
        $idbaja=$idaltabaja['idbaja'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlbajas = "SELECT DISTINCT count(dta.idpersona) as cantidadbajas
                FROM  mod_regimentrabajo.dat_asistencia dta
                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
                 INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
                   INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                    inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                    left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                where  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idbaja'  and  dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                            (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                        dta.fhasta <='$inicio' and 
                        (pstl.fdesde >= '$inicio' and
                        pstl.fdesde <= '$fin' or
                        pstl.fdesde >= '$inicio' and
                        pstl.fdesde <= '$fin' and
                        pstl.fhasta >= '$fin' or
                        pstl.fdesde >= '$inicio' and
                        pstl.fdesde <= '$fin' and
                        pstl.fhasta is null) 
                    or
                    pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idbaja'  and dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                    pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                    (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                        (pstl.fhasta >= '$inicio' and
                        pstl.fhasta <= '$fin' or
                        pstl.fhasta >= '$inicio' and
                        pstl.fhasta <= '$fin' and
                        pstl.fdesde <= '$inicio') "; 
        $resultadosqlbajas = $conn->fetchAll($sqlbajas);
        return  $resultadosqlbajas[0]['cantidadbajas'];
    }
 
    public function getAltasxTituloEnRango($idestructura,$inicio,$fin,$idtitulo,$idcargos)    {
        $obj= new ReporteEmpleoRemuneracion();
        $idcausa=$obj->IDMigracion();
        $idniveleduc=$obj->FINDidUniv();
        $idaltabaja= $obj-> IDAltaBaja();
        $idalta=$idaltabaja['idalta'];
        $idbaja=$idaltabaja['idbaja'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlaltas = "SELECT DISTINCT count(dta.idpersona) as cantidadaltas
                    FROM  mod_regimentrabajo.dat_asistencia dta
                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
                    INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
                    INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                        inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                        left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                    where pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idalta'  and 
                            nt.idtitulo = '$idtitulo' and  dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                            pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                            (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                            (pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta >= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta is null) 
                        or
                        pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idalta'  and 
                        nt.idtitulo = '$idtitulo' and  dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                        pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                        (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio')"; 
        $resultadosqlaltas = $conn->fetchAll($sqlaltas);
        return $resultadosqlaltas[0]['cantidadaltas'];
    }
    public function getBajasxTituloEnRango($idestructura,$inicio,$fin,$idtitulo,$idcargos)    {
            $obj= new ReporteEmpleoRemuneracion();
            $idcausa=$obj->IDMigracion();
            $idniveleduc=$obj->FINDidUniv();
            $idaltabaja= $obj-> IDAltaBaja();
            $idalta=$idaltabaja['idalta'];
            $idbaja=$idaltabaja['idbaja'];
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
        $sqlbajas = "SELECT DISTINCT count(dta.idpersona) as cantidadbajas
            FROM  mod_regimentrabajo.dat_asistencia dta
            INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
            INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
            INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
             where pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idbaja'  and 
                    nt.idtitulo = '$idtitulo' and  dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                    pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                   (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                    (pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' or
                    pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' and
                    pstl.fhasta >= '$fin' or
                    pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' and
                    pstl.fhasta is null) 
                or
                 pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idbaja'  and 
                 nt.idtitulo = '$idtitulo' and  dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                 pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                 (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                    (pstl.fhasta >= '$inicio' and
                    pstl.fhasta <= '$fin' or
                    pstl.fhasta >= '$inicio' and
                    pstl.fhasta <= '$fin' and
                    pstl.fdesde <= '$inicio')"; 
        $resultadosqlbajas = $conn->fetchAll($sqlbajas);
        return $resultadosqlbajas[0]['cantidadbajas'];
            
    }
   /*
    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
    INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
    INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
    
    pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
    (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND */
    public function getAltasxESPEnRango($idestructura,$inicio,$fin,$id,$idcargos)  {
        $obj= new ReporteEmpleoRemuneracion();
        $idcausa=$obj->IDMigracion();
        $idniveleduc=$obj->FINDidUniv();
        $idaltabaja= $obj-> IDAltaBaja();
        $idalta=$idaltabaja['idalta'];
        $idbaja=$idaltabaja['idbaja'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlaltas = "SELECT DISTINCT count(dta.idpersona) as cantidadaltas
                    FROM  mod_regimentrabajo.dat_asistencia dta
                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
                    INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
                    INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                        inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                        left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
                    where pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idalta'  and nt.idespecialidad = '$id' and 
                          dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and  pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                         (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                            (pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta >= '$fin' or
                            pstl.fdesde >= '$inicio' and
                            pstl.fdesde <= '$fin' and
                            pstl.fhasta is null) 
                        or
                        pent.identidad = '$idestructura'  and pnel.idniveleducacional= '$idniveleduc' and dta.idcausa= '$idalta'  and  nt.idespecialidad = '$id' and 
                           dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                           (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                           pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                           (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                            (pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' or
                            pstl.fhasta >= '$inicio' and
                            pstl.fhasta <= '$fin' and
                            pstl.fdesde <= '$inicio') "; 
            $resultadosqlaltas = $conn->fetchAll($sqlaltas); 
            return $resultadosqlaltas[0]['cantidadaltas'];
    }   

    public function getBajasxESPEnRango($idestructura,$inicio,$fin,$id,$idcargos)  {
        $obj= new ReporteEmpleoRemuneracion();
        $idcausa=$obj->IDMigracion();
        $idniveleduc=$obj->FINDidUniv();
        $idaltabaja= $obj-> IDAltaBaja();
        $idalta=$idaltabaja['idalta'];
        $idbaja=$idaltabaja['idbaja'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlbajas = "SELECT DISTINCT count(dta.idpersona) as cantidadbajas
            FROM  mod_regimentrabajo.dat_asistencia dta
            INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = dta.idpersona)
                    INNER JOIN mod_persona.dat_personaentidad pent ON mdp.idpersona = pent.idpersona AND ((pent.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pent.fhasta OR pent.fhasta IS NULL)))
                    INNER JOIN mod_persona.dat_situacionlaboral pstl ON pent.idpersonaentidad = pstl.idpersonaentidad AND pstl.estado = 0
                inner join mod_personaext.dat_niveleducacional as pnel on (pent.idpersona = pnel.idpersona)
                left join mod_personaext.nom_titulo as nt on (nt.idtitulo = pnel.idtitulo)
            where pent.identidad = '$idestructura' and  pnel.idniveleducacional = '$idniveleduc' and dta.idcausa= '$idbaja'  and 
            dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
            pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                           (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                    (pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' or
                    pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' and
                    pstl.fhasta >= '$fin' or
                    pstl.fdesde >= '$inicio' and
                    pstl.fdesde <= '$fin' and
                    pstl.fhasta is null) 
                or
                pent.identidad = '$idestructura'  and pnel.idniveleducacional= '$idniveleduc' and dta.idcausa= '$idbaja'  and 
                dta.fhasta < '$inicio' and dta.idcausa ='$idcausa' and 
                pstl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL) AND
                    (pstl.fhasta >= '$inicio' and
                    pstl.fhasta <= '$fin' or
                    pstl.fhasta >= '$inicio' and
                    pstl.fhasta <= '$fin' and
                    pstl.fdesde <= '$inicio') "; 
            $resultadosqlbajas = $conn->fetchAll($sqlbajas); 
            return $resultadosqlbajas[0]['cantidadbajas'];
            
    }
    
    public function getCausasadiciones($idcausa)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                    FROM
                    mod_regimentrabajo.conf_causasadicionesdeduciones
                      where adiciondeducion = 1 and idcausa = " . $idcausa . ";";
        return $conn->fetchAll($query);
    }

    public function getCausasdeduciones($idcausa)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT *
                    FROM
                    mod_regimentrabajo.conf_causasadicionesdeduciones
                      where adiciondeducion = 0 and idcausa = $idcausa;";
        return $conn->fetchAll($query);
    }

    public function getCausasadicionesdeduciones()
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