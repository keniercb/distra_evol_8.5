<?php

class DatEnmarcamientocbModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarComportamientos($params)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {

            $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                $params['identdatnomodpadre']
            );

            $datos = DatEnmarcamiento::getComportamientos(
                $params, $identpadreod[0]['identidaddatosnomenclador'], true
            );
        } else {
            $datos = DatEnmarcamiento::getComportamientosConsolidados(
                $params, true
            );
        }
        return $datos;
    }

    public function listarPlanes($params)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {
            $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                $params['identdatnomodpadre']
            );
            $datos = DatEnmarcamientoplan::getPlanes(
                $params, $identpadreod[0]['identidaddatosnomenclador']
            );
        } else {
            $datos = DatEnmarcamientoplan::getPlanesConsolidado($params);
        }
        return $datos;
    }

    public function listarCBTG($params)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {
            $identcb = DatEntidaddatosnomenclador::getCB1($params['identcb']);
            $datos = DatEnmarcamiento::getCBTG(
                $params, $identcb[0]['identidaddatosnomenclador']
            );
        } else {
            $datos = DatEnmarcamiento::getCBTGConsolidado($params);
        }
        return $datos;
    }

    public function listarViaAdq($params, $limite)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {
            $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                $params['identdatnomodpadre']
            );
            $datos = DatEnmarcamientoviaa::getViaAdq(
                $params, $identpadreod[0]['identidaddatosnomenclador'], $limite
            );

        } else {
            $datos = DatEnmarcamientoviaa::getViaAdqConsolidado(
                $params, $limite
            );
        }

        return $datos;
    }

    public function listarFiltrosViaAdq()
    {
        $datos = NomViaadquisicion::Obtener_via_adquisicion();
        return $datos;
    }

    public function listarFiltrosPlanes()
    {
        $datos = DatPlanificacion::obtenerPlanesTodos();
        return $datos;
    }

    public function obtenerEntidadRectora($identidad)
    {
        $datos = DatEnmarcamiento::obtenerEntidadRectora($identidad);
        return $datos;
    }

    public function guardarComportamientoMod($params)
    {
        $verif = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
            $params['identidaddatosnomencladorod']
        );
        for ($i = 0; $i < count($verif); $i++) {
            if ($verif[$i]['iddatosnomenclador'] == 2) {
                $identod = array();
                $identod = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidaddatosnomencladorod']
                );
                $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidadpadre']
                );
                if (count($identodpadre) == 0) {
                    $identodpadre[0]['identidaddatosnomenclador'] = -1;
                }
                foreach ($params['camposmod'] as $campos) {
                    if ($campos->accionaddmoddel == 'add') {
                        $objEnm = new DatEnmarcamiento();
                        $objEnm->identidaddatosnomencladorod
                            = $identod[0]['identidaddatosnomenclador'];
                        $objEnm->identidaddatosnomencladorcb
                            = $campos->identidaddatosnomencladorcb;
                        $objEnm->enmarcamiento = $campos->renmarcamiento;
                        $objEnm->enmarcamientodisponible
                            = $campos->renmarcamiento;
                        $objEnm->identidaddatosnomencladorodpadre
                            = $identodpadre[0]['identidaddatosnomenclador'];
                        $objEnm->idejercicio = $params['idejercicio'];
                        $objEnm->save();
                    } else {
                        if ($campos->accionaddmoddel == 'mod') {
                            DatEnmarcamiento::actualizarEnmarcamiento(
                                $identod[0]['identidaddatosnomenclador'],
                                $campos->identidaddatosnomencladorcb,
                                $campos->renmarcamiento, $params['idejercicio']
                            );
                        } else {
                            if ($campos->accionaddmoddel == 'del') {

                                DatEnmarcamiento::eliminarEnmarcamiento(
                                    $identod[0]['identidaddatosnomenclador'],
                                    $campos->identidaddatosnomencladorcb,
                                    $params['idejercicio']
                                );
                            }
                        }
                    }

                }
                return '24';
            }
        }
        return '20';
    }

    public function guardarPlanesMod($params)
    {
        $verif = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
            $params['identidad']
        );
        for ($i = 0; $i < count($verif); $i++) {
            if ($verif[$i]['iddatosnomenclador'] == 2) {
                $identod = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidad']
                );
                $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidadpadre']
                );
                if (count($identodpadre) == 0) {
                    $identodpadre[0]['identidaddatosnomenclador'] = -1;
                }
                foreach ($params['camposmod'] as $campos) {
                    if ($campos->accionaddmoddel == 'add') {
                        $objEnm = new DatEnmarcamientoplan();
                        $objEnm->identidaddatosnomencladorod
                            = $identod[0]['identidaddatosnomenclador'];
                        $objEnm->idmodelo = $campos->idmodelo;
                        $objEnm->enmarcamiento = $campos->renmarcamiento;
                        $objEnm->enmarcamientodisponible
                            = $campos->renmarcamiento;
                        $objEnm->identidaddatosnomencladorodpadre
                            = $identodpadre[0]['identidaddatosnomenclador'];
                        $objEnm->idejercicio = $params['idejercicio'];
                        $objEnm->save();
                    } else {
                        if ($campos->accionaddmoddel == 'mod') {
                            DatEnmarcamientoplan::actualizarPlanes(
                                $identod[0]['identidaddatosnomenclador'],
                                $campos->idmodelo, $campos->renmarcamiento,
                                $params['idejercicio']
                            );
                        } else {
                            if ($campos->accionaddmoddel == 'del') {
                                DatEnmarcamientoplan::eliminarPlanes(
                                    $identod[0]['identidaddatosnomenclador'],
                                    $campos->idmodelo, $params['idejercicio']
                                );
                            }
                        }
                    }
                }
                return '24';
            }
        }
        return '20';
    }

    public function guardarViaMod($params)
    {
        $verif = DatEntidaddatosnomenclador::getComportamientoDadoEntidad(
            $params['identidad']
        );
        for ($i = 0; $i < count($verif); $i++) {
            if ($verif[$i]['iddatosnomenclador'] == 2) {
               /* $identod = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidad']
                );*/
                $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identidadpadre']
                );
                if (count($identodpadre) == 0) {
                    $identodpadre[0]['identidaddatosnomenclador'] = -1;
                }
                foreach ($params['camposmod'] as $campos) {
                    if ($campos->accionaddmoddel == 'add') {
                        $objEnm = new DatEnmarcamientoviaa();
                        $objEnm->idenmarcamiento = $params['idenmarcamiento'];
                        $objEnm->idviaadquisicion = $campos->idvia;
                        $objEnm->enmarcamientovia = $campos->renmarcamiento;
                        $objEnm->enmarcamientodisponiblevia
                            = $campos->renmarcamiento;
                        $objEnm->save();
                    } else {
                        if ($campos->accionaddmoddel == 'mod') {
                            DatEnmarcamientoviaa::actualizarVias(
                                $params['idenmarcamiento'], $campos->idvia,
                                $campos->renmarcamiento
                            );
                        } else {
                            if ($campos->accionaddmoddel == 'del') {
                                DatEnmarcamientoviaa::eliminarVias(
                                    $params['idenmarcamiento'], $campos->idvia
                                );
                            }
                        }
                    }
                }
                return '24';
            }
        }
        return '20';
    }

    public function verificarEnmarcamientoCB($params)
    {
        $identodpadre = DatEntidaddatosnomenclador::getEntDatNom(
            $params['identidadpadre']
        );
        if (count($identodpadre) == 0) {
            return '24';
        } else {
            $params['identidadpadre']
                = $identodpadre[0]['identidaddatosnomenclador'];
            $result = DatEnmarcamiento::verificarEnmarcamientoCB($params);
            return $result;
        }
    }

    public function verificarEnmarcamientoPlan($params)
    {
        $result = DatEnmarcamientoplan::verificarEnmarcamientoPlan($params);
        return $result;
    }

    public function verificarEnmarcamientoVia($params)
    {
        $result = DatEnmarcamientoviaa::verificarEnmarcamientoVia($params);
        return $result;
    }

    public function exportarOD($params)
    {
        if ($params['identidaddatosnomencladorcb'] != "") {
            //Exportar las vias
            $datos = self::listarViaAdq($params, false);

            $datos = $datos['data'];

            header("Pragma: public");
            $cantTuplas = 3;
            header("Pragma: public");
            header("Expires: " . date("D:M:Y"));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header(
                "Content-Disposition: attachment;filename=EnmarcamientoVia.xls"
            );
            header("Content-Transfer-Encoding: binary ");
            echo "
		 <table >
		<th align=left style = color:blue >Órgano Demandante: </th>
			<td align=left>" . $params['denominacionentidad'] . "</td>
			";
            echo "
		<br>
			<tr>
			<th align=left style = color:green >Centro Balance: </th>
			<td align=left>" . $params['denominacioncb'] . "</td>
			 
			<th align=right style = color:green >Enmarcamiento: </th>
			<td align=left>" . $params['enmarcamiento'] . "</td>
			
			<th align=right style = color:green >Disponible: </th>
			<td align=left>" . $params['enmarcamientodisp'] . "</td>
			</tr>
			</br>  ";

            echo ("<br></br></table>") . "<tr >";
            echo "
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";
$tot=0;
$totdisp=0;
            foreach ($datos as $k => $value) {
                echo "<tr>
             <td align=left>" . $value['denominacionviaadquisicion'] . "</td>
             <td align=right >" . number_format($value['enmarcamiento'], 3) . "</td>
             <td align=right >" . number_format(
                 $value['enmarcamientodisponible'], 3
             ) . "</td>
             
             </tr>";
                $cantTuplas++;
                $tot+=$value['enmarcamiento'];
                $totdisp+=$value['enmarcamientodisponible'];
            }
                        echo " <tr >
             <th align=left> Total </th>
             <th align=right>" . number_format($tot, 3) . "</th>
	    <th align=right>" . number_format($totdisp, 3) . "</th>
              </tr>";
            echo "</table>";
            /*echo " <tr >
             <th align=left> Total </th>
             <th align=right > =SUMA(B3:B{$cantTuplas})</th>
			 <th align=right > =SUMA(C3:C{$cantTuplas}) </th>
              </tr>";
            echo "</table>";*/
        } else {

            $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if ($params['identidad'] != $identrectora[0]['identidad']) {
                $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                    $params['identdatnomodpadre']
                );
                $datos = DatEnmarcamiento::getComportamientos(
                    $params, $identpadreod[0]['identidaddatosnomenclador'],
                    false
                );
            } else {
                $datos = DatEnmarcamiento::getComportamientosConsolidados(
                    $params, false
                );
            }

            header("Pragma: public");
            $cantTuplas = 2;
            header("Pragma: public");
            header("Expires: " . date("D:M:Y"));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header("Content-Disposition: attachment;filename=OD.xls");
            header("Content-Transfer-Encoding: binary ");
            echo "
<table >		
            <th align=right style = color:blue>Órgano Demandante: </th>
            <td align=left> " . $params['denominacionentidad'] . "</td>
			
			";
            echo ("<br></br></table>") . "<tr >";
            echo "
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";
            $tot=0;
$totdisp=0;
            foreach ($datos['data'] as $k => $value) {
                echo "<tr>
             <td align=left>" . $value['denominacioncb'] . "</td>
             <td align=right >" . number_format($value['enmarcamiento'], 3) . "</td>
             <td align=right >" . number_format(
                 $value['enmarcamientodisponible'], 3
             ) . "</td>
             
             </tr>";
                $cantTuplas++;
                $tot+=$value['enmarcamiento'];
                $totdisp+=$value['enmarcamientodisponible'];
            }
                        echo " <tr >
             <th align=left> Total </th>
             <th align=right>" . number_format($tot, 3) . "</th>
	    <th align=right>" . number_format($totdisp, 3) . "</th>
              </tr>";
            echo "</table>";
          /*  echo " <tr >
             <th align=left> Total </th>
             <th align=right > =SUMA(B3:B{$cantTuplas})</th>
			 <th align=right > =SUMA(C3:C{$cantTuplas}) </th>
              </tr>";
            echo "</table>";*/

        }
    }

    public function exportarCB($params)
    {
        if ($params['identidaddatosnomencladorod'] != "") {
            //Exportar las vias
            $datos = self::listarViaAdq($params);
            $datos = $datos['data'];
            header("Pragma: public");
            $cantTuplas = 3;
            header("Pragma: public");
            header("Expires: " . date("D:M:Y"));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header(
                "Content-Disposition: attachment;filename=EnmarcamientoVia.xls"
            );
            header("Content-Transfer-Encoding: binary ");
            echo "
		 <table >
		<th align=left style = color:blue >Centro Balance: </th>
			<td align=left>" . $params['denominacionentidad'] . "</td>
			";
            echo "
		<br>
			<tr>
			<th align=left style = color:green >Órgano Demandante: </th>
			<td align=left>" . $params['denominacionod'] . "</td>
			 
			<th align=right style = color:green >Enmarcamiento: </th>
			<td align=left>" . $params['enmarcamiento'] . "</td>
			
			<th align=right style = color:green >Disponible: </th>
			<td align=left>" . $params['enmarcamientodisp'] . "</td>
			</tr>
			</br>  ";

            echo ("<br></br></table>") . "<tr >";
            echo "
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";

            foreach ($datos as $k => $value) {
                echo "<tr>
             <td align=left>" . $value['denominacionviaadquisicion'] . "</td>
             <td align=right >" . number_format($value['enmarcamiento'], 3) . "</td>
             <td align=right >" . number_format(
                 $value['enmarcamientodisponible'], 3
             ) . "</td>
             
             </tr>";
                $cantTuplas++;
            }
            echo " <tr >
             <th align=left> Total </th>
             <th align=right > =SUMA(B3:B{$cantTuplas})</th>
			 <th align=right > =SUMA(C3:C{$cantTuplas}) </th>
              </tr>";
            echo "</table>";
        } else {
            $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if ($params['identidad'] != $identrectora[0]['identidad']) {
                
                $identpadreod
                    = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
                        $params['identidad']
                    );
                $datos = DatEnmarcamiento::exportarCB(
                    $params, $identpadreod[0]['identidaddatosnomenclador']
                );

            } else {
                
                $datos = DatEnmarcamiento::exportarCBTGConsolidado($params);

            }
            header("Pragma: public");
            header("Pragma: public");
            header("Expires: " . date("D:M:Y"));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header("Content-Disposition: attachment;filename=OD.xls");
            header("Content-Transfer-Encoding: binary ");
            echo "
		 <table >
		<th align=left style = color:blue >Centro Balance: </th>
			<td align=left>" . $params['denominacionentidad'] . "</td>
			";
            echo "
        <table border=1 cellspacing=0 width=60%> 
             <th align=left>Entidad padre</th>
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";
            $totalenm = 0;
            $totalenmdisp = 0;
            $cantTuplas = 2;
            $identidadrec = DatEntidaddatosnomenclador::obtenerEntidadRectora();

            foreach ($datos['data'] as $k => $value) {

                if ($value['_parent'] == $identidadrec['identidad']) {
                    $totalenm += $value['enmarcamiento'];
                    $totalenmdisp += $value['enmarcamientodisponible'];
                }
                $cantTuplas++;
                echo "<tr>
             <td align=left>" . $value['denorganopadre'] . "</td>
             <td align=left>" . $value['denorgano'] . "</td>
             <td align=right >" . $value['enmarcamiento'] . "</td>
             <td align=right >" . $value['enmarcamientodisponible'] . "</td>
             
             </tr>";
            }

            echo " <tr >
             <th align=left> Total </th>
             <th align=right > </th> 
             <th align=right >" . number_format($totalenm, 3) . "</th>
	     <th align=right >" . number_format($totalenmdisp, 3) . "</th>
              </tr>";
            echo "</table>";
        }
    }

    public function exportarenmarcplan($params)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {
            $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                $params['identdatnomodpadre']
            );
            $datos = DatEnmarcamientoplan::getPlanes(
                $params, $identpadreod[0]['identidaddatosnomenclador']
            );
        } else {
            $datos = DatEnmarcamientoplan::getPlanesConsolidado($params);
        }
        header("Pragma: public");
        $cantTuplas = 2;
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=OD.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "  
            <th align=left>Órgano Demandante: " . $params['denominacionentidad']
            . "</th>
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";
        $temp = "";
        $enmarcamiento = 0;
        $enmarcamientodisponible = 0;
        foreach ($datos['data'] as $value) {
            if ($temp != $value['denominacionplan']) {
                echo " <th align=center>" . $value['denominacionplan']
                    . "</th>";
            }
            echo "<tr> 
             <td align=left>" . $value['denominacionmodelo'] . "</td>
             <td align=right >" . number_format($value['enmarcamiento'], 3) . "</td>
             <td align=right >" . number_format(
                 $value['enmarcamientodisponible'], 3
             ) . "</td>
             
             </tr>";
            $enmarcamiento += $value['enmarcamiento'];
            $enmarcamientodisponible += $value['enmarcamientodisponible'];
            $cantTuplas++;
            $temp = $value['denominacionplan'];
        }
        echo " <tr >
             <th align=left> Total </th>
             <th align=right >" . number_format($enmarcamiento, 3) . "</th>
	      <th align=right >" . number_format($enmarcamientodisponible, 3) . "</th>
              </tr>";
        echo "</table>";
    }

    public function exportarViaAdq($params)
    {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        if ($params['identidad'] != $identrectora[0]['identidad']) {
            $identpadreod = DatEntidaddatosnomenclador::getEntDatNom(
                $params['identdatnomodpadre']
            );
            $datos = DatEnmarcamientoViaAdq::getViaAdq(
                $params, $identpadreod[0]['identidaddatosnomenclador']
            );
        } else {
            $datos = DatEnmarcamientoViaAdq::getViaAdqConsolidado($params);
        }
        header("Pragma: public");
        $cantTuplas = 2;
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=OD.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "  
            <th align=left>Órgano Demandante: " . $params['denominacionentidad']
            . "</th>
        <table border=1 cellspacing=0 width=60%>   
             <th align=left>Denominación</th>
             <th align=left>Enmarcamiento</th>
             <th align=left>Enmarcamiento disponible</th>
            
        </tr>";
        foreach ($datos['data'] as $value) {
            echo "<tr> 
             <td align=left>" . $value['denominacionviaadquisicion'] . "</td>
             <td align=right >" . number_format($value['enmarcamiento'], 3) . "</td>
             <td align=right >" . number_format(
                 $value['enmarcamientodisponible'], 3
             ) . "</td>
             
             </tr>";
            $cantTuplas++;
        }
        echo " <tr >
             <th align=left> Total </th>
             <th align=right > =SUMA(B3:B{$cantTuplas})</th>
			 <th align=right > =SUMA(C3:C{$cantTuplas}) </th>
              </tr>";
        echo "</table>";
    }
}


